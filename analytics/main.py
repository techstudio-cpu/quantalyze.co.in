from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict
import mysql.connector
from datetime import datetime, timedelta
import pandas as pd
import numpy as np
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Quantalyze Analytics API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': int(os.getenv('DB_PORT', 3306)),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'database': os.getenv('DB_NAME', 'quantalyze_db')
}

def get_db_connection():
    try:
        return mysql.connector.connect(**DB_CONFIG)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")

@app.get("/")
def read_root():
    return {
        "service": "Quantalyze Analytics API",
        "version": "1.0.0",
        "status": "active"
    }

@app.get("/health")
def health_check():
    try:
        conn = get_db_connection()
        conn.close()
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

@app.get("/analytics/dashboard")
def get_dashboard_analytics(days: int = 30):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        date_filter = datetime.now() - timedelta(days=days)
        
        cursor.execute("""
            SELECT 
                COUNT(*) as total_events,
                COUNT(DISTINCT session_id) as unique_sessions,
                COUNT(DISTINCT ip_address) as unique_visitors
            FROM analytics_events
            WHERE created_at >= %s
        """, (date_filter,))
        overview = cursor.fetchone()
        
        cursor.execute("""
            SELECT 
                event_type,
                COUNT(*) as count
            FROM analytics_events
            WHERE created_at >= %s
            GROUP BY event_type
            ORDER BY count DESC
        """, (date_filter,))
        event_breakdown = cursor.fetchall()
        
        cursor.execute("""
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as events
            FROM analytics_events
            WHERE created_at >= %s
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        """, (date_filter,))
        daily_trend = cursor.fetchall()
        
        cursor.execute("""
            SELECT COUNT(*) as total FROM newsletter_subscribers WHERE status = 'active'
        """)
        newsletter_stats = cursor.fetchone()
        
        cursor.execute("""
            SELECT COUNT(*) as total FROM contact_submissions WHERE status = 'new'
        """)
        contact_stats = cursor.fetchone()
        
        conn.close()
        
        return {
            "overview": overview,
            "event_breakdown": event_breakdown,
            "daily_trend": daily_trend,
            "newsletter_subscribers": newsletter_stats['total'],
            "pending_contacts": contact_stats['total']
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/analytics/trends")
def get_trends(days: int = 90):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        date_filter = datetime.now() - timedelta(days=days)
        
        cursor.execute("""
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as total_events,
                COUNT(DISTINCT session_id) as unique_sessions
            FROM analytics_events
            WHERE created_at >= %s
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        """, (date_filter,))
        
        data = cursor.fetchall()
        conn.close()
        
        if not data:
            return {"trend": "insufficient_data", "data": []}
        
        df = pd.DataFrame(data)
        df['date'] = pd.to_datetime(df['date'])
        df = df.sort_values('date')
        
        df['ma_7'] = df['total_events'].rolling(window=7, min_periods=1).mean()
        df['ma_30'] = df['total_events'].rolling(window=30, min_periods=1).mean()
        
        recent_avg = df['total_events'].tail(7).mean()
        previous_avg = df['total_events'].tail(14).head(7).mean()
        
        if previous_avg > 0:
            growth_rate = ((recent_avg - previous_avg) / previous_avg) * 100
        else:
            growth_rate = 0
        
        trend = "increasing" if growth_rate > 5 else "decreasing" if growth_rate < -5 else "stable"
        
        return {
            "trend": trend,
            "growth_rate": round(growth_rate, 2),
            "recent_avg": round(recent_avg, 2),
            "previous_avg": round(previous_avg, 2),
            "data": data
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/analytics/conversion")
def get_conversion_metrics():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("""
            SELECT 
                (SELECT COUNT(DISTINCT session_id) FROM analytics_events) as total_visitors,
                (SELECT COUNT(*) FROM contact_submissions) as total_contacts,
                (SELECT COUNT(*) FROM newsletter_subscribers WHERE status = 'active') as total_subscribers
        """)
        
        metrics = cursor.fetchone()
        conn.close()
        
        total_visitors = metrics['total_visitors'] or 1
        contact_rate = (metrics['total_contacts'] / total_visitors) * 100
        subscription_rate = (metrics['total_subscribers'] / total_visitors) * 100
        
        return {
            "total_visitors": metrics['total_visitors'],
            "total_contacts": metrics['total_contacts'],
            "total_subscribers": metrics['total_subscribers'],
            "contact_conversion_rate": round(contact_rate, 2),
            "subscription_conversion_rate": round(subscription_rate, 2)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/analytics/popular-services")
def get_popular_services():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("""
            SELECT 
                service_interest as service,
                COUNT(*) as inquiries
            FROM contact_submissions
            WHERE service_interest IS NOT NULL
            GROUP BY service_interest
            ORDER BY inquiries DESC
            LIMIT 10
        """)
        
        services = cursor.fetchall()
        conn.close()
        
        return {"popular_services": services}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
