"""
Quantalyze Python Backend - Run Script
Start the FastAPI server with uvicorn
"""

import uvicorn
import os
from pathlib import Path

# Change to the backend directory
os.chdir(Path(__file__).parent)

if __name__ == "__main__":
    # Load environment from parent directory
    env_file = Path(__file__).parent.parent / ".env.local"
    if env_file.exists():
        from dotenv import load_dotenv
        load_dotenv(env_file)
    
    print("🚀 Starting Quantalyze Python Backend...")
    print("📚 API Documentation: http://localhost:8000/api/docs")
    print("🔗 Health Check: http://localhost:8000/api/health")
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        reload_dirs=["app"]
    )
