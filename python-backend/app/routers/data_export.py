"""
Data Export Router
Export data in various formats and manage backups
"""

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from io import BytesIO
import json
import pandas as pd

from app.core.database import get_db, execute_query

router = APIRouter()


class ExportRequest(BaseModel):
    data_type: str  # "inquiries", "subscribers", "team", "services", "all"
    format: str = "json"  # "json", "csv", "excel"
    filters: Optional[dict] = None


class BackupRequest(BaseModel):
    include: List[str] = ["inquiries", "subscribers", "team", "services"]


@router.post("/data")
async def export_data(request: ExportRequest):
    """Export data in specified format"""
    try:
        # Fetch data based on type
        if request.data_type == "inquiries":
            data = await get_inquiries_data(request.filters)
        elif request.data_type == "subscribers":
            data = await get_subscribers_data(request.filters)
        elif request.data_type == "team":
            data = await get_team_data()
        elif request.data_type == "services":
            data = await get_services_data()
        elif request.data_type == "all":
            data = await get_all_data()
        else:
            raise HTTPException(status_code=400, detail="Invalid data type")
        
        # Format and return data
        if request.format == "csv":
            return await format_csv(data, request.data_type)
        elif request.format == "excel":
            return await format_excel(data, request.data_type)
        else:
            return await format_json(data, request.data_type)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def get_inquiries_data(filters: dict = None) -> List[dict]:
    """Get all inquiries data"""
    query_sql = """
        SELECT id, name, email, phone, company, service, message, status, created_at, updated_at
        FROM inquiries
        ORDER BY created_at DESC
    """
    
    results = await execute_query(query_sql)
    
    return [
        {
            "id": r[0], "name": r[1], "email": r[2], "phone": r[3],
            "company": r[4], "service": r[5], "message": r[6],
            "status": r[7], "created_at": str(r[8]), "updated_at": str(r[9])
        }
        for r in results
    ]


async def get_subscribers_data(filters: dict = None) -> List[dict]:
    """Get all subscribers data"""
    results = await execute_query(
        """
        SELECT id, email, name, preferences, status, created_at, updated_at
        FROM newsletter_subscribers
        ORDER BY created_at DESC
        """
    )
    
    return [
        {
            "id": r[0], "email": r[1], "name": r[2], "preferences": r[3],
            "status": r[4], "created_at": str(r[5]), "updated_at": str(r[6])
        }
        for r in results
    ]


async def get_team_data() -> List[dict]:
    """Get team members data"""
    results = await execute_query(
        """
        SELECT id, name, email, role, department, bio, avatar, status, joined_at
        FROM team_members
        ORDER BY joined_at DESC
        """
    )
    
    return [
        {
            "id": r[0], "name": r[1], "email": r[2], "role": r[3],
            "department": r[4], "bio": r[5], "avatar": r[6],
            "status": r[7], "joined_at": str(r[8])
        }
        for r in results
    ]


async def get_services_data() -> List[dict]:
    """Get services data"""
    results = await execute_query(
        """
        SELECT id, title, description, icon, category, price, featured, status, created_at
        FROM services
        ORDER BY created_at DESC
        """
    )
    
    return [
        {
            "id": r[0], "title": r[1], "description": r[2], "icon": r[3],
            "category": r[4], "price": r[5], "featured": bool(r[6]),
            "status": r[7], "created_at": str(r[8])
        }
        for r in results
    ]


async def get_all_data() -> dict:
    """Get all data for complete export"""
    return {
        "inquiries": await get_inquiries_data(),
        "subscribers": await get_subscribers_data(),
        "team": await get_team_data(),
        "services": await get_services_data(),
        "exported_at": datetime.now().isoformat()
    }


async def format_json(data, data_type: str) -> StreamingResponse:
    """Format data as JSON"""
    output = BytesIO()
    
    export_data = {
        "data_type": data_type,
        "exported_at": datetime.now().isoformat(),
        "count": len(data) if isinstance(data, list) else "multiple",
        "data": data
    }
    
    output.write(json.dumps(export_data, indent=2, default=str).encode())
    output.seek(0)
    
    filename = f"{data_type}_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    
    return StreamingResponse(
        output,
        media_type="application/json",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


async def format_csv(data, data_type: str) -> StreamingResponse:
    """Format data as CSV"""
    if isinstance(data, dict):
        # For 'all' export, use the first dataset
        data = data.get("inquiries", [])
    
    df = pd.DataFrame(data)
    output = BytesIO()
    df.to_csv(output, index=False)
    output.seek(0)
    
    filename = f"{data_type}_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    
    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


async def format_excel(data, data_type: str) -> StreamingResponse:
    """Format data as Excel"""
    output = BytesIO()
    
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        if isinstance(data, dict) and "inquiries" in data:
            # Multiple sheets for 'all' export
            for sheet_name, sheet_data in data.items():
                if isinstance(sheet_data, list) and sheet_data:
                    df = pd.DataFrame(sheet_data)
                    df.to_excel(writer, sheet_name=sheet_name.capitalize(), index=False)
        else:
            df = pd.DataFrame(data)
            df.to_excel(writer, sheet_name="Data", index=False)
    
    output.seek(0)
    
    filename = f"{data_type}_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
    
    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


@router.post("/backup")
async def create_backup(request: BackupRequest):
    """Create a complete data backup"""
    try:
        backup_data = {
            "backup_id": datetime.now().strftime("%Y%m%d_%H%M%S"),
            "created_at": datetime.now().isoformat(),
            "includes": request.include,
            "data": {}
        }
        
        if "inquiries" in request.include:
            backup_data["data"]["inquiries"] = await get_inquiries_data()
        
        if "subscribers" in request.include:
            backup_data["data"]["subscribers"] = await get_subscribers_data()
        
        if "team" in request.include:
            backup_data["data"]["team"] = await get_team_data()
        
        if "services" in request.include:
            backup_data["data"]["services"] = await get_services_data()
        
        # Return as downloadable JSON
        output = BytesIO()
        output.write(json.dumps(backup_data, indent=2, default=str).encode())
        output.seek(0)
        
        filename = f"quantalyze_backup_{backup_data['backup_id']}.json"
        
        return StreamingResponse(
            output,
            media_type="application/json",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/available")
async def get_available_exports():
    """Get available export options"""
    return {
        "success": True,
        "data_types": [
            {"id": "inquiries", "name": "Customer Inquiries", "description": "All customer inquiries and leads"},
            {"id": "subscribers", "name": "Newsletter Subscribers", "description": "Email subscriber list"},
            {"id": "team", "name": "Team Members", "description": "Team member profiles"},
            {"id": "services", "name": "Services", "description": "Service offerings"},
            {"id": "all", "name": "Complete Export", "description": "All data in one export"}
        ],
        "formats": [
            {"id": "json", "name": "JSON", "description": "JavaScript Object Notation"},
            {"id": "csv", "name": "CSV", "description": "Comma-Separated Values"},
            {"id": "excel", "name": "Excel", "description": "Microsoft Excel format"}
        ]
    }


@router.get("/stats")
async def get_data_stats():
    """Get statistics about available data"""
    try:
        inquiries_count = await execute_query("SELECT COUNT(*) FROM inquiries")
        subscribers_count = await execute_query("SELECT COUNT(*) FROM newsletter_subscribers")
        team_count = await execute_query("SELECT COUNT(*) FROM team_members")
        services_count = await execute_query("SELECT COUNT(*) FROM services")
        
        return {
            "success": True,
            "stats": {
                "inquiries": inquiries_count[0][0] if inquiries_count else 0,
                "subscribers": subscribers_count[0][0] if subscribers_count else 0,
                "team_members": team_count[0][0] if team_count else 0,
                "services": services_count[0][0] if services_count else 0
            },
            "last_updated": datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
