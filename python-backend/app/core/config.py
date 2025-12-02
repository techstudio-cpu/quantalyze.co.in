"""
Configuration settings for the Python backend
"""

from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    # Application Settings
    APP_NAME: str = "Quantalyze Backend"
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    
    # Database Settings
    DB_HOST: str = os.getenv("DB_HOST", "localhost")
    DB_PORT: int = int(os.getenv("DB_PORT", "3306"))
    DB_USER: str = os.getenv("DB_USER", "root")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD", "")
    DB_NAME: str = os.getenv("DB_NAME", "quantalyze_db")
    
    # Use SQLite in development
    USE_SQLITE: bool = os.getenv("NODE_ENV", "development") != "production"
    SQLITE_PATH: str = os.getenv("SQLITE_PATH", "../data/quantalyze.db")
    
    # JWT Settings (must match Next.js)
    JWT_SECRET: str = os.getenv("JWT_SECRET", "your-secret-key-change-in-production")
    JWT_ALGORITHM: str = "HS256"
    
    # Email Settings
    EMAIL_HOST: str = os.getenv("EMAIL_HOST", "smtp.gmail.com")
    EMAIL_PORT: int = int(os.getenv("EMAIL_PORT", "587"))
    EMAIL_USER: str = os.getenv("EMAIL_USER", "")
    EMAIL_PASSWORD: str = os.getenv("EMAIL_PASS", "")
    
    # OpenAI Settings (for AI features)
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY")
    
    # Frontend URL
    FRONTEND_URL: str = os.getenv("NEXTAUTH_URL", "http://localhost:3000")
    
    @property
    def database_url(self) -> str:
        if self.USE_SQLITE:
            return f"sqlite+aiosqlite:///{self.SQLITE_PATH}"
        return f"mysql+aiomysql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
    
    class Config:
        env_file = "../.env.local"
        extra = "allow"


settings = Settings()
