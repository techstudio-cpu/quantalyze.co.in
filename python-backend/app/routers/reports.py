"""
Reports Router
Generate PDF, Excel, and other report formats
"""

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
from io import BytesIO
import pandas as pd

from app.core.database import get_db, execute_query

router = APIRouter()


class ReportRequest(BaseModel):
    report_type: str  # "inquiries", "subscribers", "revenue", "comprehensive"
    period: str = "30d"  # "7d", "30d", "90d", "365d", "all"
    format: str = "pdf"  # "pdf", "excel", "csv"


@router.post("/generate")
async def generate_report(request: ReportRequest):
    """Generate a report in specified format"""
    try:
        # Calculate date range
        if request.period == "all":
            start_date = datetime(2020, 1, 1)
        else:
            days = int(request.period.replace("d", ""))
            start_date = datetime.now() - timedelta(days=days)
        
        # Fetch data based on report type
        if request.report_type == "inquiries":
            data = await get_inquiry_data(start_date)
        elif request.report_type == "subscribers":
            data = await get_subscriber_data(start_date)
        elif request.report_type == "revenue":
            data = await get_revenue_data(start_date)
        elif request.report_type == "comprehensive":
            data = await get_comprehensive_data(start_date)
        else:
            raise HTTPException(status_code=400, detail="Invalid report type")
        
        # Generate report in requested format
        if request.format == "excel":
            return await generate_excel_report(data, request.report_type)
        elif request.format == "csv":
            return await generate_csv_report(data, request.report_type)
        else:
            return await generate_pdf_report(data, request.report_type)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def get_inquiry_data(start_date: datetime) -> dict:
    """Fetch inquiry data for reports"""
    inquiries = await execute_query(
        """
        SELECT id, name, email, phone, company, service, message, status, created_at
        FROM inquiries
        WHERE created_at >= :start_date
        ORDER BY created_at DESC
        """,
        {"start_date": start_date.isoformat()}
    )
    
    summary = await execute_query(
        """
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new_count,
            SUM(CASE WHEN status = 'contacted' THEN 1 ELSE 0 END) as contacted,
            SUM(CASE WHEN status = 'converted' THEN 1 ELSE 0 END) as converted
        FROM inquiries
        WHERE created_at >= :start_date
        """,
        {"start_date": start_date.isoformat()}
    )
    
    return {
        "title": "Inquiries Report",
        "generated_at": datetime.now().isoformat(),
        "period_start": start_date.isoformat(),
        "summary": {
            "total": summary[0][0] if summary else 0,
            "new": summary[0][1] if summary else 0,
            "contacted": summary[0][2] if summary else 0,
            "converted": summary[0][3] if summary else 0
        },
        "data": [
            {
                "id": r[0], "name": r[1], "email": r[2], "phone": r[3],
                "company": r[4], "service": r[5], "message": r[6],
                "status": r[7], "created_at": r[8]
            } for r in inquiries
        ]
    }


async def get_subscriber_data(start_date: datetime) -> dict:
    """Fetch subscriber data for reports"""
    subscribers = await execute_query(
        """
        SELECT id, email, name, status, created_at
        FROM newsletter_subscribers
        WHERE created_at >= :start_date
        ORDER BY created_at DESC
        """,
        {"start_date": start_date.isoformat()}
    )
    
    return {
        "title": "Newsletter Subscribers Report",
        "generated_at": datetime.now().isoformat(),
        "period_start": start_date.isoformat(),
        "summary": {
            "total": len(subscribers),
            "active": sum(1 for s in subscribers if s[3] == "active")
        },
        "data": [
            {"id": r[0], "email": r[1], "name": r[2], "status": r[3], "created_at": r[4]}
            for r in subscribers
        ]
    }


async def get_revenue_data(start_date: datetime) -> dict:
    """Calculate revenue data for reports"""
    inquiries = await execute_query(
        """
        SELECT 
            strftime('%Y-%m', created_at) as month,
            COUNT(*) as count,
            service
        FROM inquiries
        WHERE created_at >= :start_date
        GROUP BY strftime('%Y-%m', created_at), service
        ORDER BY month
        """,
        {"start_date": start_date.isoformat()}
    )
    
    # Estimate revenue based on service type
    service_rates = {
        "web-development": 5000,
        "mobile-app": 8000,
        "seo": 1500,
        "digital-marketing": 2000,
        "branding": 3000,
        "default": 850
    }
    
    revenue_by_month = {}
    for r in inquiries:
        month, count, service = r[0], r[1], r[2]
        rate = service_rates.get(service, service_rates["default"])
        if month not in revenue_by_month:
            revenue_by_month[month] = 0
        revenue_by_month[month] += count * rate * 0.3  # 30% conversion estimate
    
    return {
        "title": "Revenue Estimate Report",
        "generated_at": datetime.now().isoformat(),
        "period_start": start_date.isoformat(),
        "summary": {
            "total_estimated": sum(revenue_by_month.values()),
            "avg_monthly": sum(revenue_by_month.values()) / max(len(revenue_by_month), 1)
        },
        "data": [
            {"month": m, "estimated_revenue": round(v, 2)}
            for m, v in sorted(revenue_by_month.items())
        ]
    }


async def get_comprehensive_data(start_date: datetime) -> dict:
    """Get all data for comprehensive report"""
    inquiries = await get_inquiry_data(start_date)
    subscribers = await get_subscriber_data(start_date)
    revenue = await get_revenue_data(start_date)
    
    return {
        "title": "Comprehensive Business Report",
        "generated_at": datetime.now().isoformat(),
        "period_start": start_date.isoformat(),
        "sections": {
            "inquiries": inquiries,
            "subscribers": subscribers,
            "revenue": revenue
        }
    }


async def generate_excel_report(data: dict, report_type: str) -> StreamingResponse:
    """Generate Excel report"""
    output = BytesIO()
    
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        if report_type == "comprehensive":
            for section_name, section_data in data.get("sections", {}).items():
                df = pd.DataFrame(section_data.get("data", []))
                df.to_excel(writer, sheet_name=section_name.capitalize(), index=False)
        else:
            df = pd.DataFrame(data.get("data", []))
            df.to_excel(writer, sheet_name="Report", index=False)
            
            # Add summary sheet
            summary_df = pd.DataFrame([data.get("summary", {})])
            summary_df.to_excel(writer, sheet_name="Summary", index=False)
    
    output.seek(0)
    
    filename = f"{report_type}_report_{datetime.now().strftime('%Y%m%d')}.xlsx"
    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


async def generate_csv_report(data: dict, report_type: str) -> StreamingResponse:
    """Generate CSV report"""
    df = pd.DataFrame(data.get("data", []))
    output = BytesIO()
    df.to_csv(output, index=False)
    output.seek(0)
    
    filename = f"{report_type}_report_{datetime.now().strftime('%Y%m%d')}.csv"
    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


async def generate_pdf_report(data: dict, report_type: str) -> StreamingResponse:
    """Generate PDF report using ReportLab"""
    from reportlab.lib import colors
    from reportlab.lib.pagesizes import letter, A4
    from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
    from reportlab.lib.styles import getSampleStyleSheet
    
    output = BytesIO()
    doc = SimpleDocTemplate(output, pagesize=A4)
    elements = []
    styles = getSampleStyleSheet()
    
    # Title
    elements.append(Paragraph(data.get("title", "Report"), styles['Heading1']))
    elements.append(Paragraph(f"Generated: {data.get('generated_at', '')}", styles['Normal']))
    elements.append(Spacer(1, 20))
    
    # Summary
    if "summary" in data:
        elements.append(Paragraph("Summary", styles['Heading2']))
        summary_data = [[k, str(v)] for k, v in data["summary"].items()]
        summary_table = Table(summary_data, colWidths=[200, 200])
        summary_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
        ]))
        elements.append(summary_table)
        elements.append(Spacer(1, 20))
    
    # Data table
    if "data" in data and len(data["data"]) > 0:
        elements.append(Paragraph("Details", styles['Heading2']))
        
        # Get headers from first row
        headers = list(data["data"][0].keys())
        table_data = [headers]
        
        # Add rows (limit to first 50 for PDF)
        for row in data["data"][:50]:
            table_data.append([str(row.get(h, ""))[:30] for h in headers])
        
        table = Table(table_data)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.darkblue),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('FONTSIZE', (0, 0), (-1, -1), 8),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ]))
        elements.append(table)
    
    doc.build(elements)
    output.seek(0)
    
    filename = f"{report_type}_report_{datetime.now().strftime('%Y%m%d')}.pdf"
    return StreamingResponse(
        output,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


@router.get("/types")
async def get_available_report_types():
    """Get list of available report types"""
    return {
        "success": True,
        "report_types": [
            {"id": "inquiries", "name": "Inquiries Report", "description": "All customer inquiries and their status"},
            {"id": "subscribers", "name": "Subscribers Report", "description": "Newsletter subscriber list and stats"},
            {"id": "revenue", "name": "Revenue Report", "description": "Estimated revenue based on inquiries"},
            {"id": "comprehensive", "name": "Comprehensive Report", "description": "Complete business overview"}
        ],
        "formats": ["pdf", "excel", "csv"],
        "periods": ["7d", "30d", "90d", "365d", "all"]
    }
