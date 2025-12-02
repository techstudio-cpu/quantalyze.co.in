"""
Email Automation Router
Handle automated email campaigns and notifications
"""

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from app.core.config import settings
from app.core.database import execute_query

router = APIRouter()


class EmailRequest(BaseModel):
    to: List[EmailStr]
    subject: str
    body: str
    html: bool = True


class CampaignRequest(BaseModel):
    name: str
    subject: str
    body: str
    target: str = "all"  # "all", "active", "new"
    schedule: Optional[str] = None  # ISO datetime or None for immediate


class EmailTemplate(BaseModel):
    name: str
    subject: str
    body: str
    variables: List[str] = []


# Email templates storage (in-memory for simplicity)
email_templates = {
    "welcome": {
        "name": "Welcome Email",
        "subject": "Welcome to Quantalyze! 🎉",
        "body": """
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">Welcome to Quantalyze, {name}!</h1>
            <p>Thank you for subscribing to our newsletter. You're now part of our digital community!</p>
            <p>Here's what you can expect:</p>
            <ul>
                <li>Latest trends in digital marketing</li>
                <li>Web development insights</li>
                <li>Exclusive offers and updates</li>
            </ul>
            <p style="margin-top: 20px;">
                <a href="https://quantalyze.co.in" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                    Visit Our Website
                </a>
            </p>
            <p style="color: #666; font-size: 12px; margin-top: 30px;">
                © 2024 Quantalyze Digital Agency. All rights reserved.
            </p>
        </body>
        </html>
        """,
        "variables": ["name"]
    },
    "inquiry_confirmation": {
        "name": "Inquiry Confirmation",
        "subject": "We've Received Your Inquiry - Quantalyze",
        "body": """
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">Thank You for Reaching Out!</h1>
            <p>Dear {name},</p>
            <p>We've received your inquiry about <strong>{service}</strong> and our team is excited to learn more about your project!</p>
            <p>What happens next:</p>
            <ol>
                <li>Our team will review your requirements</li>
                <li>We'll reach out within 24 hours</li>
                <li>Schedule a free consultation call</li>
            </ol>
            <p>In the meantime, feel free to check out our portfolio and case studies.</p>
            <p style="color: #666; font-size: 12px; margin-top: 30px;">
                © 2024 Quantalyze Digital Agency
            </p>
        </body>
        </html>
        """,
        "variables": ["name", "service"]
    },
    "follow_up": {
        "name": "Follow Up",
        "subject": "Checking In - Quantalyze",
        "body": """
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">Hello {name}!</h1>
            <p>We wanted to follow up on your recent inquiry about {service}.</p>
            <p>We'd love to discuss how we can help bring your vision to life. Would you be available for a quick call this week?</p>
            <p>Looking forward to hearing from you!</p>
            <p>Best regards,<br>The Quantalyze Team</p>
        </body>
        </html>
        """,
        "variables": ["name", "service"]
    }
}


@router.post("/send")
async def send_email(request: EmailRequest, background_tasks: BackgroundTasks):
    """Send email to specified recipients"""
    try:
        if not settings.EMAIL_USER or not settings.EMAIL_PASSWORD:
            raise HTTPException(
                status_code=400, 
                detail="Email service not configured. Set EMAIL_USER and EMAIL_PASS."
            )
        
        # Queue email sending in background
        background_tasks.add_task(
            send_email_async,
            request.to,
            request.subject,
            request.body,
            request.html
        )
        
        return {
            "success": True,
            "message": f"Email queued for {len(request.to)} recipient(s)",
            "recipients": request.to
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def send_email_async(to: List[str], subject: str, body: str, html: bool = True):
    """Send email asynchronously"""
    try:
        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        message["From"] = settings.EMAIL_USER
        message["To"] = ", ".join(to)
        
        if html:
            part = MIMEText(body, "html")
        else:
            part = MIMEText(body, "plain")
        
        message.attach(part)
        
        await aiosmtplib.send(
            message,
            hostname=settings.EMAIL_HOST,
            port=settings.EMAIL_PORT,
            username=settings.EMAIL_USER,
            password=settings.EMAIL_PASSWORD,
            start_tls=True
        )
        
        print(f"✅ Email sent to {to}")
        
    except Exception as e:
        print(f"❌ Failed to send email: {e}")


@router.post("/campaign")
async def create_campaign(request: CampaignRequest, background_tasks: BackgroundTasks):
    """Create and send an email campaign"""
    try:
        # Get target subscribers
        if request.target == "all":
            subscribers = await execute_query(
                "SELECT email, name FROM newsletter_subscribers WHERE status = 'active'"
            )
        elif request.target == "new":
            subscribers = await execute_query(
                """
                SELECT email, name FROM newsletter_subscribers 
                WHERE status = 'active' 
                AND created_at >= date('now', '-7 days')
                """
            )
        else:
            subscribers = await execute_query(
                "SELECT email, name FROM newsletter_subscribers WHERE status = 'active'"
            )
        
        if not subscribers:
            return {
                "success": False,
                "message": "No subscribers found for this campaign"
            }
        
        # Queue campaign emails
        for email, name in subscribers:
            personalized_body = request.body.replace("{name}", name or "Subscriber")
            background_tasks.add_task(
                send_email_async,
                [email],
                request.subject,
                personalized_body,
                True
            )
        
        return {
            "success": True,
            "campaign": request.name,
            "recipients_count": len(subscribers),
            "scheduled": request.schedule or "immediate"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/templates")
async def get_email_templates():
    """Get available email templates"""
    return {
        "success": True,
        "templates": [
            {
                "id": key,
                "name": template["name"],
                "subject": template["subject"],
                "variables": template["variables"]
            }
            for key, template in email_templates.items()
        ]
    }


@router.get("/templates/{template_id}")
async def get_template(template_id: str):
    """Get a specific email template"""
    if template_id not in email_templates:
        raise HTTPException(status_code=404, detail="Template not found")
    
    return {
        "success": True,
        "template": email_templates[template_id]
    }


@router.post("/templates/{template_id}/send")
async def send_template_email(
    template_id: str,
    to: List[EmailStr],
    variables: dict,
    background_tasks: BackgroundTasks
):
    """Send an email using a template"""
    if template_id not in email_templates:
        raise HTTPException(status_code=404, detail="Template not found")
    
    template = email_templates[template_id]
    
    # Replace variables in template
    subject = template["subject"]
    body = template["body"]
    
    for var, value in variables.items():
        subject = subject.replace(f"{{{var}}}", str(value))
        body = body.replace(f"{{{var}}}", str(value))
    
    background_tasks.add_task(
        send_email_async,
        to,
        subject,
        body,
        True
    )
    
    return {
        "success": True,
        "message": f"Template email queued for {len(to)} recipient(s)",
        "template": template_id
    }


@router.post("/welcome-new-subscriber")
async def send_welcome_email(email: EmailStr, name: str, background_tasks: BackgroundTasks):
    """Send welcome email to new subscriber"""
    template = email_templates["welcome"]
    body = template["body"].replace("{name}", name or "Subscriber")
    
    background_tasks.add_task(
        send_email_async,
        [email],
        template["subject"],
        body,
        True
    )
    
    return {
        "success": True,
        "message": f"Welcome email queued for {email}"
    }


@router.get("/status")
async def get_email_status():
    """Check email service configuration status"""
    configured = bool(settings.EMAIL_USER and settings.EMAIL_PASSWORD)
    
    return {
        "success": True,
        "configured": configured,
        "host": settings.EMAIL_HOST if configured else None,
        "port": settings.EMAIL_PORT if configured else None,
        "user": settings.EMAIL_USER[:5] + "***" if configured else None,
        "message": "Email service is ready" if configured else "Configure EMAIL_USER and EMAIL_PASS to enable email features"
    }
