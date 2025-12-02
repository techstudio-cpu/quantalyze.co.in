"""
Advanced Analytics Router
Provides intelligent data analysis and insights
"""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
import pandas as pd
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db, execute_query

router = APIRouter()


class AnalyticsResponse(BaseModel):
    success: bool
    data: dict
    message: Optional[str] = None


class TimeSeriesData(BaseModel):
    labels: List[str]
    values: List[float]
    trend: str  # "up", "down", "stable"
    change_percent: float


@router.get("/dashboard", response_model=AnalyticsResponse)
async def get_dashboard_analytics(
    period: str = "30d",
    db: AsyncSession = Depends(get_db)
):
    """
    Get comprehensive dashboard analytics
    - period: 7d, 30d, 90d, 365d
    """
    try:
        # Calculate date range
        days = int(period.replace("d", ""))
        start_date = datetime.now() - timedelta(days=days)
        
        # Get inquiry statistics
        inquiries = await execute_query(
            """
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as count,
                status
            FROM inquiries
            WHERE created_at >= :start_date
            GROUP BY DATE(created_at), status
            ORDER BY date
            """,
            {"start_date": start_date.isoformat()}
        )
        
        # Get subscriber statistics
        subscribers = await execute_query(
            """
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as count
            FROM newsletter_subscribers
            WHERE created_at >= :start_date
            GROUP BY DATE(created_at)
            ORDER BY date
            """,
            {"start_date": start_date.isoformat()}
        )
        
        # Process data into time series
        inquiry_data = process_time_series(inquiries, days)
        subscriber_data = process_time_series(subscribers, days)
        
        # Calculate conversion metrics
        total_inquiries = sum(inquiry_data["values"])
        converted = await execute_query(
            "SELECT COUNT(*) FROM inquiries WHERE status = 'converted'"
        )
        conversion_rate = (converted[0][0] / total_inquiries * 100) if total_inquiries > 0 else 0
        
        return AnalyticsResponse(
            success=True,
            data={
                "period": period,
                "inquiries": inquiry_data,
                "subscribers": subscriber_data,
                "metrics": {
                    "total_inquiries": int(total_inquiries),
                    "conversion_rate": round(conversion_rate, 2),
                    "avg_daily_inquiries": round(total_inquiries / days, 2),
                    "growth_rate": calculate_growth_rate(inquiry_data["values"])
                },
                "insights": generate_insights(inquiry_data, subscriber_data)
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/inquiries/breakdown")
async def get_inquiry_breakdown(db: AsyncSession = Depends(get_db)):
    """Get inquiry breakdown by service type and status"""
    try:
        by_service = await execute_query(
            """
            SELECT service, COUNT(*) as count
            FROM inquiries
            GROUP BY service
            ORDER BY count DESC
            """
        )
        
        by_status = await execute_query(
            """
            SELECT status, COUNT(*) as count
            FROM inquiries
            GROUP BY status
            """
        )
        
        return AnalyticsResponse(
            success=True,
            data={
                "by_service": [{"service": r[0], "count": r[1]} for r in by_service],
                "by_status": [{"status": r[0], "count": r[1]} for r in by_status]
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/revenue/forecast")
async def get_revenue_forecast(months: int = 3):
    """
    Generate revenue forecast using historical data
    Uses simple linear regression for prediction
    """
    try:
        # Get historical inquiry data
        historical = await execute_query(
            """
            SELECT 
                strftime('%Y-%m', created_at) as month,
                COUNT(*) as count
            FROM inquiries
            WHERE created_at >= date('now', '-12 months')
            GROUP BY strftime('%Y-%m', created_at)
            ORDER BY month
            """
        )
        
        if len(historical) < 3:
            return AnalyticsResponse(
                success=True,
                data={
                    "forecast": [],
                    "message": "Insufficient data for forecasting"
                }
            )
        
        # Simple forecasting logic
        values = [r[1] for r in historical]
        avg_growth = sum([values[i] - values[i-1] for i in range(1, len(values))]) / (len(values) - 1)
        
        # Generate forecast
        forecast = []
        last_value = values[-1]
        avg_revenue_per_inquiry = 850  # Estimated average revenue
        
        for i in range(months):
            projected_inquiries = max(0, last_value + (avg_growth * (i + 1)))
            forecast.append({
                "month": (datetime.now() + timedelta(days=30 * (i + 1))).strftime("%Y-%m"),
                "projected_inquiries": round(projected_inquiries),
                "projected_revenue": round(projected_inquiries * avg_revenue_per_inquiry)
            })
        
        return AnalyticsResponse(
            success=True,
            data={
                "historical": [{"month": r[0], "inquiries": r[1]} for r in historical],
                "forecast": forecast,
                "confidence": "medium" if len(historical) >= 6 else "low"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def process_time_series(data, days: int) -> dict:
    """Process query results into time series format"""
    if not data:
        return {
            "labels": [],
            "values": [],
            "trend": "stable",
            "change_percent": 0
        }
    
    df = pd.DataFrame(data, columns=["date", "count"] + (["status"] if len(data[0]) > 2 else []))
    df["date"] = pd.to_datetime(df["date"])
    
    # Fill missing dates
    date_range = pd.date_range(
        start=datetime.now() - timedelta(days=days),
        end=datetime.now(),
        freq="D"
    )
    
    daily = df.groupby("date")["count"].sum().reindex(date_range, fill_value=0)
    
    values = daily.values.tolist()
    labels = [d.strftime("%Y-%m-%d") for d in daily.index]
    
    # Calculate trend
    first_half = sum(values[:len(values)//2])
    second_half = sum(values[len(values)//2:])
    
    if second_half > first_half * 1.1:
        trend = "up"
    elif second_half < first_half * 0.9:
        trend = "down"
    else:
        trend = "stable"
    
    change = ((second_half - first_half) / first_half * 100) if first_half > 0 else 0
    
    return {
        "labels": labels,
        "values": values,
        "trend": trend,
        "change_percent": round(change, 2)
    }


def calculate_growth_rate(values: List[float]) -> float:
    """Calculate growth rate from values"""
    if len(values) < 2 or sum(values[:len(values)//2]) == 0:
        return 0
    
    first_half = sum(values[:len(values)//2])
    second_half = sum(values[len(values)//2:])
    
    return round((second_half - first_half) / first_half * 100, 2)


def generate_insights(inquiries: dict, subscribers: dict) -> List[str]:
    """Generate AI-like insights from data"""
    insights = []
    
    if inquiries["trend"] == "up":
        insights.append(f"📈 Inquiries are trending up by {abs(inquiries['change_percent'])}%")
    elif inquiries["trend"] == "down":
        insights.append(f"📉 Inquiries have decreased by {abs(inquiries['change_percent'])}%")
    
    if subscribers["trend"] == "up":
        insights.append(f"🎯 Newsletter growth is strong at {abs(subscribers['change_percent'])}%")
    
    total_inquiries = sum(inquiries["values"])
    if total_inquiries > 0:
        peak_day = inquiries["labels"][inquiries["values"].index(max(inquiries["values"]))]
        insights.append(f"⭐ Peak activity was on {peak_day}")
    
    if not insights:
        insights.append("📊 Data collection in progress. More insights coming soon.")
    
    return insights
