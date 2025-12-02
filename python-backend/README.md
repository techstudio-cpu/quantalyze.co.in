# Quantalyze Python Backend

Advanced Python backend for Quantalyze Digital Agency admin panel, providing AI-powered analytics, automated reports, and email automation.

## Features

### 🔍 Advanced Analytics
- Time-series data visualization
- Revenue forecasting
- Inquiry breakdown by service/status
- Growth rate calculations
- AI-generated insights

### 📊 Report Generation
- PDF, Excel, and CSV exports
- Inquiry reports
- Subscriber reports
- Revenue estimates
- Comprehensive business reports

### 🤖 AI Assistant
- Content generation (emails, social posts, blog)
- Sentiment analysis
- Keyword extraction
- Text summarization
- Automated inquiry responses

### 📧 Email Automation
- Template-based emails
- Campaign management
- Welcome emails for new subscribers
- Follow-up automation

### 💾 Data Export
- Full database backups
- Filtered exports
- Multiple format support

## Installation

### Prerequisites
- Python 3.10+
- pip or poetry

### Setup

1. Create virtual environment:
```bash
cd python-backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env with your settings
```

4. Run the server:
```bash
python run.py
```

Or with uvicorn directly:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Documentation

Once running, access the interactive API docs:
- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc

## API Endpoints

### Analytics
- `GET /api/analytics/dashboard` - Dashboard analytics
- `GET /api/analytics/inquiries/breakdown` - Inquiry breakdown
- `GET /api/analytics/revenue/forecast` - Revenue forecast

### Reports
- `POST /api/reports/generate` - Generate report
- `GET /api/reports/types` - Available report types

### AI Assistant
- `POST /api/ai/generate-content` - Generate content
- `POST /api/ai/analyze` - Analyze text
- `POST /api/ai/generate-inquiry-response` - Generate inquiry response
- `GET /api/ai/capabilities` - AI capabilities

### Email Automation
- `POST /api/email/send` - Send email
- `POST /api/email/campaign` - Create campaign
- `GET /api/email/templates` - List templates
- `GET /api/email/status` - Service status

### Data Export
- `POST /api/export/data` - Export data
- `POST /api/export/backup` - Create backup
- `GET /api/export/stats` - Data statistics

## Integration with Next.js

The Python backend uses the same JWT tokens as the Next.js frontend. Include the token in requests:

```javascript
// From Next.js admin panel
const token = localStorage.getItem('adminToken');

fetch('http://localhost:8000/api/analytics/dashboard', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## Production Deployment

### Using Docker
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Using systemd (Linux)
```ini
[Unit]
Description=Quantalyze Python Backend
After=network.target

[Service]
User=www-data
WorkingDirectory=/path/to/python-backend
ExecStart=/path/to/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

## Security Notes

1. Always use HTTPS in production
2. Keep `JWT_SECRET` synchronized with Next.js
3. Configure proper CORS origins
4. Use environment variables for sensitive data
5. Never commit `.env` files

## License

© 2024 Quantalyze Digital Agency. All rights reserved.
