"""
Quantalyze Digital Agency - Advanced Python Backend
Provides AI-powered analytics, automated reports, and advanced admin features
"""

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import routers
from app.routers import analytics, reports, ai_assistant, email_automation, data_export
from app.core.config import settings
from app.core.database import init_db, close_db

# Lifespan manager for startup/shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Starting Quantalyze Python Backend...")
    await init_db()
    yield
    # Shutdown
    print("👋 Shutting down Quantalyze Python Backend...")
    await close_db()

# Create FastAPI application
app = FastAPI(
    title="Quantalyze Admin Backend",
    description="Advanced Python backend for Quantalyze Digital Agency admin panel",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://quantalyze.co.in",
        "https://www.quantalyze.co.in"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify JWT token from Next.js frontend"""
    from jose import jwt, JWTError
    
    try:
        token = credentials.credentials
        payload = jwt.decode(
            token, 
            settings.JWT_SECRET, 
            algorithms=["HS256"]
        )
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )

# Include routers
app.include_router(
    analytics.router,
    prefix="/api/analytics",
    tags=["Analytics"],
    dependencies=[Depends(verify_token)]
)

app.include_router(
    reports.router,
    prefix="/api/reports",
    tags=["Reports"],
    dependencies=[Depends(verify_token)]
)

app.include_router(
    ai_assistant.router,
    prefix="/api/ai",
    tags=["AI Assistant"],
    dependencies=[Depends(verify_token)]
)

app.include_router(
    email_automation.router,
    prefix="/api/email",
    tags=["Email Automation"],
    dependencies=[Depends(verify_token)]
)

app.include_router(
    data_export.router,
    prefix="/api/export",
    tags=["Data Export"],
    dependencies=[Depends(verify_token)]
)

# Health check endpoint (no auth required)
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "version": "1.0.0",
        "service": "Quantalyze Python Backend"
    }

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Quantalyze Advanced Admin Backend",
        "docs": "/api/docs",
        "health": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
