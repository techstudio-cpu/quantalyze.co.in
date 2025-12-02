"""
AI Assistant Router
Provides AI-powered features for content generation, analysis, and automation
"""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
import httpx

from app.core.config import settings
from app.core.database import execute_query

router = APIRouter()


class ContentRequest(BaseModel):
    prompt: str
    content_type: str  # "email", "blog", "social", "response"
    tone: str = "professional"  # "professional", "casual", "friendly"
    length: str = "medium"  # "short", "medium", "long"


class AnalysisRequest(BaseModel):
    text: str
    analysis_type: str  # "sentiment", "keywords", "summary"


class InquiryResponseRequest(BaseModel):
    inquiry_id: int
    custom_context: Optional[str] = None


@router.post("/generate-content")
async def generate_content(request: ContentRequest):
    """
    Generate AI-powered content for various purposes
    Falls back to template-based generation if OpenAI is not configured
    """
    try:
        if settings.OPENAI_API_KEY:
            return await generate_with_openai(request)
        else:
            return await generate_with_templates(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def generate_with_openai(request: ContentRequest) -> dict:
    """Generate content using OpenAI API"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "gpt-3.5-turbo",
                    "messages": [
                        {
                            "role": "system",
                            "content": f"You are a professional content writer for Quantalyze Digital Agency. Generate {request.content_type} content with a {request.tone} tone. Keep the length {request.length}."
                        },
                        {
                            "role": "user",
                            "content": request.prompt
                        }
                    ],
                    "max_tokens": {"short": 150, "medium": 300, "long": 600}.get(request.length, 300),
                    "temperature": 0.7
                },
                timeout=30.0
            )
            
            if response.status_code == 200:
                data = response.json()
                content = data["choices"][0]["message"]["content"]
                return {
                    "success": True,
                    "content": content,
                    "model": "gpt-3.5-turbo",
                    "tokens_used": data["usage"]["total_tokens"]
                }
            else:
                # Fall back to templates
                return await generate_with_templates(request)
                
    except Exception as e:
        return await generate_with_templates(request)


async def generate_with_templates(request: ContentRequest) -> dict:
    """Generate content using predefined templates (fallback)"""
    templates = {
        "email": {
            "professional": """
Subject: {subject}

Dear {recipient},

Thank you for reaching out to Quantalyze Digital Agency. We specialize in delivering innovative digital solutions that drive business growth.

{body}

We would be delighted to discuss how we can help achieve your goals. Please feel free to schedule a consultation at your convenience.

Best regards,
The Quantalyze Team
""",
            "casual": """
Hey {recipient}!

Thanks for getting in touch with us at Quantalyze! 

{body}

Let's chat and see how we can help you out!

Cheers,
The Quantalyze Team
"""
        },
        "social": {
            "professional": "🚀 {content} | Quantalyze Digital Agency - Your Partner in Digital Excellence #DigitalMarketing #WebDevelopment",
            "casual": "✨ {content} 💪 #Quantalyze #DigitalAgency"
        },
        "response": {
            "professional": """
Thank you for your inquiry about {service}. At Quantalyze, we pride ourselves on delivering exceptional {service} solutions tailored to your specific needs.

{details}

We would love to schedule a call to discuss your project in detail. What time works best for you?
""",
            "casual": """
Thanks for reaching out about {service}! We'd love to help you out.

{details}

When's a good time to chat?
"""
        }
    }
    
    template = templates.get(request.content_type, {}).get(request.tone, "")
    
    if not template:
        template = f"Generated content for: {request.prompt}"
    else:
        # Simple template filling
        template = template.replace("{content}", request.prompt)
        template = template.replace("{body}", request.prompt)
        template = template.replace("{details}", request.prompt)
        template = template.replace("{subject}", "Your Inquiry")
        template = template.replace("{recipient}", "Valued Customer")
        template = template.replace("{service}", "our services")
    
    return {
        "success": True,
        "content": template.strip(),
        "model": "template",
        "note": "Configure OPENAI_API_KEY for AI-generated content"
    }


@router.post("/analyze")
async def analyze_text(request: AnalysisRequest):
    """
    Analyze text for sentiment, keywords, or generate summary
    """
    try:
        if request.analysis_type == "sentiment":
            return await analyze_sentiment(request.text)
        elif request.analysis_type == "keywords":
            return await extract_keywords(request.text)
        elif request.analysis_type == "summary":
            return await generate_summary(request.text)
        else:
            raise HTTPException(status_code=400, detail="Invalid analysis type")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def analyze_sentiment(text: str) -> dict:
    """Simple sentiment analysis"""
    positive_words = ["great", "excellent", "amazing", "good", "love", "best", "fantastic", "wonderful", "happy", "pleased"]
    negative_words = ["bad", "terrible", "awful", "poor", "hate", "worst", "disappointed", "unhappy", "frustrated", "angry"]
    
    text_lower = text.lower()
    positive_count = sum(1 for word in positive_words if word in text_lower)
    negative_count = sum(1 for word in negative_words if word in text_lower)
    
    if positive_count > negative_count:
        sentiment = "positive"
        score = min(positive_count * 0.2, 1.0)
    elif negative_count > positive_count:
        sentiment = "negative"
        score = min(negative_count * 0.2, 1.0)
    else:
        sentiment = "neutral"
        score = 0.5
    
    return {
        "success": True,
        "sentiment": sentiment,
        "confidence": round(score, 2),
        "analysis": {
            "positive_indicators": positive_count,
            "negative_indicators": negative_count
        }
    }


async def extract_keywords(text: str) -> dict:
    """Extract keywords from text"""
    import re
    
    # Remove common words
    stop_words = {"the", "a", "an", "is", "are", "was", "were", "be", "been", "being", 
                  "have", "has", "had", "do", "does", "did", "will", "would", "could",
                  "should", "may", "might", "must", "shall", "can", "need", "dare",
                  "to", "of", "in", "for", "on", "with", "at", "by", "from", "or",
                  "and", "but", "if", "then", "else", "when", "up", "down", "out",
                  "this", "that", "these", "those", "i", "you", "we", "they", "it"}
    
    # Extract words
    words = re.findall(r'\b[a-zA-Z]{3,}\b', text.lower())
    
    # Count frequency
    word_count = {}
    for word in words:
        if word not in stop_words:
            word_count[word] = word_count.get(word, 0) + 1
    
    # Sort by frequency
    keywords = sorted(word_count.items(), key=lambda x: x[1], reverse=True)[:10]
    
    return {
        "success": True,
        "keywords": [{"word": k, "count": v} for k, v in keywords],
        "total_words": len(words)
    }


async def generate_summary(text: str) -> dict:
    """Generate a simple summary"""
    sentences = text.replace("!", ".").replace("?", ".").split(".")
    sentences = [s.strip() for s in sentences if s.strip()]
    
    if len(sentences) <= 2:
        summary = text
    else:
        # Take first and last sentence for simple summary
        summary = f"{sentences[0]}. {sentences[-1]}."
    
    return {
        "success": True,
        "summary": summary,
        "original_length": len(text),
        "summary_length": len(summary),
        "reduction": f"{round((1 - len(summary)/len(text)) * 100)}%"
    }


@router.post("/generate-inquiry-response")
async def generate_inquiry_response(request: InquiryResponseRequest):
    """Generate an AI-powered response for a customer inquiry"""
    try:
        # Fetch inquiry details
        inquiry = await execute_query(
            "SELECT name, email, service, message FROM inquiries WHERE id = :id",
            {"id": request.inquiry_id}
        )
        
        if not inquiry:
            raise HTTPException(status_code=404, detail="Inquiry not found")
        
        name, email, service, message = inquiry[0]
        
        # Generate response
        prompt = f"Customer {name} is interested in {service}. Their message: {message}"
        if request.custom_context:
            prompt += f" Additional context: {request.custom_context}"
        
        content_request = ContentRequest(
            prompt=prompt,
            content_type="response",
            tone="professional",
            length="medium"
        )
        
        if settings.OPENAI_API_KEY:
            result = await generate_with_openai(content_request)
        else:
            result = await generate_with_templates(content_request)
        
        return {
            "success": True,
            "inquiry": {
                "id": request.inquiry_id,
                "name": name,
                "service": service
            },
            "suggested_response": result["content"],
            "model": result.get("model", "template")
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/capabilities")
async def get_ai_capabilities():
    """Get available AI capabilities"""
    has_openai = bool(settings.OPENAI_API_KEY)
    
    return {
        "success": True,
        "openai_enabled": has_openai,
        "capabilities": {
            "content_generation": {
                "available": True,
                "types": ["email", "blog", "social", "response"],
                "tones": ["professional", "casual", "friendly"],
                "ai_powered": has_openai
            },
            "text_analysis": {
                "available": True,
                "types": ["sentiment", "keywords", "summary"],
                "ai_powered": False  # Uses rule-based analysis
            },
            "inquiry_responses": {
                "available": True,
                "ai_powered": has_openai
            }
        },
        "setup_hint": None if has_openai else "Add OPENAI_API_KEY to enable AI-powered features"
    }
