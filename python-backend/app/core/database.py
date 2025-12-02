"""
Database connection and utilities
Supports both SQLite (development) and MySQL (production)
"""

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import text
import aiosqlite
from typing import AsyncGenerator
import os

from app.core.config import settings

# Create async engine
if settings.USE_SQLITE:
    # SQLite for development
    engine = create_async_engine(
        settings.database_url,
        echo=settings.DEBUG,
        connect_args={"check_same_thread": False}
    )
else:
    # MySQL for production
    engine = create_async_engine(
        settings.database_url,
        echo=settings.DEBUG,
        pool_pre_ping=True,
        pool_size=10,
        max_overflow=20
    )

# Session factory
async_session = sessionmaker(
    engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)

# Base class for models
Base = declarative_base()


async def init_db():
    """Initialize database connection"""
    try:
        async with engine.begin() as conn:
            # Test connection
            await conn.execute(text("SELECT 1"))
        
        db_type = "SQLite" if settings.USE_SQLITE else "MySQL"
        print(f"✅ {db_type} database connected successfully")
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        raise


async def close_db():
    """Close database connection"""
    await engine.dispose()
    print("Database connection closed")


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency for getting database session"""
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()


# Raw query helper for complex queries
async def execute_query(sql: str, params: dict = None):
    """Execute raw SQL query"""
    async with async_session() as session:
        result = await session.execute(text(sql), params or {})
        return result.fetchall()


async def execute_one(sql: str, params: dict = None):
    """Execute raw SQL query and return one result"""
    async with async_session() as session:
        result = await session.execute(text(sql), params or {})
        return result.fetchone()
