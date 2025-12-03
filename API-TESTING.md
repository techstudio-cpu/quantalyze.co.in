# API Testing Guide

Quick reference for testing all API endpoints.

## 🔍 Health Check

```bash
curl https://quantalyze.up.railway.app/api/health
```

Expected Response:
```json
{
  "status": "ok",
  "timestamp": "2024-12-03T10:30:00.000Z",
  "service": "quantalyze-digital-agency"
}
```

## 📧 Newsletter API

### Subscribe
```bash
curl -X POST https://quantalyze.up.railway.app/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "preferences": ["digital-trends", "marketing-insights"]
  }'
```

### Get Stats
```bash
curl https://quantalyze.up.railway.app/api/newsletter
```

### Unsubscribe
```bash
curl "https://quantalyze.up.railway.app/api/newsletter?action=unsubscribe&email=test@example.com"
```

## 📝 Contact API

### Submit Contact Form
```bash
curl -X POST https://quantalyze.up.railway.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "company": "Tech Corp",
    "service": "Web Development",
    "message": "I need a website"
  }'
```

### Get Submissions
```bash
curl "https://quantalyze.up.railway.app/api/contact?status=new&limit=10"
```

## 📊 Analytics API

### Track Event
```bash
curl -X POST https://quantalyze.up.railway.app/api/analytics \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "page_view",
    "event_data": {"page": "/services"},
    "session_id": "abc123"
  }'
```

### Get Analytics
```bash
curl "https://quantalyze.up.railway.app/api/analytics?days=30"
```

## 🛠️ Services API

### Get All Services
```bash
curl https://quantalyze.up.railway.app/api/services
```

### Get Featured Services
```bash
curl "https://quantalyze.up.railway.app/api/services?featured=true"
```

### Create Service (Admin)
```bash
curl -X POST https://quantalyze.up.railway.app/api/services \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "title": "SEO Optimization",
    "description": "Improve your search rankings",
    "icon": "🔍",
    "category": "Marketing",
    "price": "Starting at $500/month",
    "featured": true
  }'
```

## 🔐 Admin Authentication

### Login
```bash
curl -X POST https://quantalyze.up.railway.app/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "admin",
    "role": "admin"
  }
}
```

### Verify Token
```bash
curl -X POST https://quantalyze.up.railway.app/api/admin/auth/verify \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🐍 Python Analytics API

### Health Check
```bash
curl http://localhost:8000/health
```

### Dashboard Analytics
```bash
curl "http://localhost:8000/analytics/dashboard?days=30"
```

### Trends Analysis
```bash
curl "http://localhost:8000/analytics/trends?days=90"
```

### Conversion Metrics
```bash
curl http://localhost:8000/analytics/conversion
```

### Popular Services
```bash
curl http://localhost:8000/analytics/popular-services
```

## 🧪 Testing with Postman

### Import Collection

Create a Postman collection with these requests:

1. **Environment Variables:**
   - `base_url`: `https://quantalyze.up.railway.app`
   - `python_url`: `http://localhost:8000`
   - `admin_token`: (set after login)

2. **Pre-request Script for Admin Endpoints:**
```javascript
pm.request.headers.add({
  key: 'Authorization',
  value: 'Bearer ' + pm.environment.get('admin_token')
});
```

## 🔧 Testing with curl Scripts

### test-newsletter.sh
```bash
#!/bin/bash
BASE_URL="https://quantalyze.up.railway.app"

echo "Testing Newsletter Subscription..."
curl -X POST $BASE_URL/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'

echo "\n\nGetting Newsletter Stats..."
curl $BASE_URL/api/newsletter
```

### test-admin.sh
```bash
#!/bin/bash
BASE_URL="https://quantalyze.up.railway.app"

echo "Admin Login..."
RESPONSE=$(curl -s -X POST $BASE_URL/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}')

TOKEN=$(echo $RESPONSE | jq -r '.token')

echo "Token: $TOKEN"

echo "\n\nVerifying Token..."
curl -X POST $BASE_URL/api/admin/auth/verify \
  -H "Authorization: Bearer $TOKEN"
```

## 📱 Frontend Testing

### Newsletter Form
1. Go to homepage
2. Scroll to newsletter section
3. Enter email
4. Click Subscribe
5. Should see success message

### Contact Form
1. Go to /contact page
2. Fill all fields
3. Submit form
4. Should see success message

### Admin Panel
1. Go to /admin
2. Login with credentials
3. Should see dashboard
4. Test logout

## 🐛 Common Issues

### 1. CORS Errors
**Solution:** Check Railway environment variables for correct domain

### 2. Database Connection Failed
**Solution:** Verify MySQL service is running in Railway

### 3. 401 Unauthorized
**Solution:** Check JWT_SECRET matches in environment

### 4. 500 Internal Server Error
**Solution:** Check Railway logs for detailed error

## 📊 Expected Response Times

- Health Check: < 100ms
- Newsletter Subscribe: < 500ms
- Contact Submit: < 500ms
- Analytics Query: < 1s
- Admin Login: < 300ms

## 🔍 Debugging

### Check Railway Logs
```bash
# In Railway dashboard
Project → Deployments → View Logs
```

### Test Database Connection
```bash
curl https://quantalyze.up.railway.app/api/health
```

### Verify Environment Variables
```bash
# In Railway dashboard
Project → Variables → Check all are set
```

---

**Happy Testing! 🚀**
