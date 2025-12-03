# Quantalyze Analytics Service

Python-based analytics service for advanced data processing and insights.

## Features

- Real-time dashboard analytics
- Trend analysis with moving averages
- Conversion rate tracking
- Popular services analysis
- MySQL database integration

## Setup

### 1. Install Dependencies

```bash
cd analytics
pip install -r requirements.txt
```

### 2. Configure Environment

Create `.env` file:

```env
DB_HOST=mysql.railway.internal
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=railway
```

### 3. Run Service

```bash
python main.py
```

Or with uvicorn:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## API Endpoints

### Health Check
```
GET /health
```

### Dashboard Analytics
```
GET /analytics/dashboard?days=30
```

Returns:
- Total events, sessions, visitors
- Event breakdown by type
- Daily trends
- Newsletter subscribers count
- Pending contacts count

### Trends Analysis
```
GET /analytics/trends?days=90
```

Returns:
- Growth rate calculation
- Moving averages (7-day, 30-day)
- Trend direction (increasing/decreasing/stable)

### Conversion Metrics
```
GET /analytics/conversion
```

Returns:
- Contact conversion rate
- Newsletter subscription rate
- Total visitors and conversions

### Popular Services
```
GET /analytics/popular-services
```

Returns:
- Top 10 most inquired services

## Integration with Next.js

Update `src/lib/python-api.ts` to call these endpoints:

```typescript
const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8000';

export async function getDashboardAnalytics(days: number = 30) {
  const response = await fetch(`${PYTHON_API_URL}/analytics/dashboard?days=${days}`);
  return response.json();
}
```

## Railway Deployment

Add as a separate service in Railway:

1. Create new service
2. Connect to same MySQL database
3. Set environment variables
4. Deploy Python service

## Dependencies

- FastAPI - Web framework
- Uvicorn - ASGI server
- MySQL Connector - Database driver
- Pandas - Data analysis
- NumPy - Numerical computing
- Scikit-learn - Machine learning (future use)
