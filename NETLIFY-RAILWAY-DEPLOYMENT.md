# Netlify + Railway Deployment Guide

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     quantalyze.co.in                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌───────────────────────┐      ┌───────────────────────────┐ │
│   │       NETLIFY         │      │         RAILWAY           │ │
│   │    (Static Frontend)  │      │    (Dynamic Backend)      │ │
│   ├───────────────────────┤      ├───────────────────────────┤ │
│   │                       │      │                           │ │
│   │  • Home page (/)      │      │  • /admin/* (dashboard)   │ │
│   │  • /about             │ ───▶ │  • /api/* (all endpoints) │ │
│   │  • /services/*        │      │  • Authentication         │ │
│   │  • /contact           │      │  • Database queries       │ │
│   │  • /portfolio         │      │                           │ │
│   │  • /testimonials      │      │  ┌─────────────────────┐  │ │
│   │  • All static pages   │      │  │   Railway MySQL     │  │ │
│   │                       │      │  │   (Database)        │  │ │
│   │  CDN + Edge caching   │      │  └─────────────────────┘  │ │
│   └───────────────────────┘      └───────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Benefits

| Feature | Netlify | Railway |
|---------|---------|---------|
| **Static pages** | ✅ Super fast CDN | - |
| **API routes** | - | ✅ Full Node.js |
| **Admin panel** | - | ✅ SSR + Auth |
| **Database** | - | ✅ MySQL |
| **Cost** | Free tier generous | Pay per use |
| **SSL** | ✅ Auto | ✅ Auto |
| **Custom domain** | ✅ Easy | ✅ Easy |

---

## Setup Instructions

### Step 1: Railway (Backend + Database)

Railway is already configured. Verify:

1. **MySQL Service** running with database `railway`
2. **Web Service** with these env vars:

```env
MYSQL_URL=mysql://root:MByStMgRlxYtwoPVPehAhigVyQyOTMyQ@mysql.railway.internal:3306/railway
MYSQLHOST=mysql.railway.internal
MYSQLPORT=3306
MYSQLUSER=root
MYSQLPASSWORD=MByStMgRlxYtwoPVPehAhigVyQyOTMyQ
MYSQLDATABASE=railway
DB_HOST=mysql.railway.internal
DB_PORT=3306
DB_USER=root
DB_PASSWORD=MByStMgRlxYtwoPVPehAhigVyQyOTMyQ
DB_NAME=railway
NODE_ENV=production
JWT_SECRET=quantalyze-admin-jwt-production-secret-2024-change-this-immediately
NEXTAUTH_SECRET=quantalyze-production-secret-key-change-this-in-production
NEXTAUTH_URL=https://quantalyze.co.in
```

3. **Health check**: https://quantalyze.up.railway.app/api/health
   - Should show `database.status: "connected"`

---

### Step 2: Netlify (Frontend)

#### Option A: Deploy via Netlify Dashboard

1. Go to [netlify.com](https://netlify.com) → Log in
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect to GitHub → Select `techstudio-cpu/quantalyze.co.in`
4. Configure build settings:
   - **Build command**: `npm run build:netlify`
   - **Publish directory**: `out`
   - **Node version**: `20`
5. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = `https://quantalyze.up.railway.app`
6. Click **Deploy**

#### Option B: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize (first time)
netlify init

# Deploy
netlify deploy --prod
```

---

### Step 3: Custom Domain Setup

#### On Netlify (for main domain):

1. Go to **Site settings** → **Domain management**
2. Add custom domain: `quantalyze.co.in`
3. Add DNS records at your registrar:

```
Type: A
Name: @
Value: 75.2.60.5  (Netlify load balancer)

Type: CNAME
Name: www
Value: your-site-name.netlify.app
```

#### On Railway (for API subdomain - optional):

1. Go to **Settings** → **Domains**
2. Add: `api.quantalyze.co.in`
3. Add DNS record:

```
Type: CNAME
Name: api
Value: quantalyze.up.railway.app
```

Then update `netlify.toml` redirects to use `api.quantalyze.co.in`.

---

## How Routing Works

The `netlify.toml` file handles routing:

```toml
# /admin/* → Railway
[[redirects]]
  from = "/admin/*"
  to = "https://quantalyze.up.railway.app/admin/:splat"
  status = 200

# /api/* → Railway
[[redirects]]
  from = "/api/*"
  to = "https://quantalyze.up.railway.app/api/:splat"
  status = 200
```

This means:
- `quantalyze.co.in/` → Netlify (static)
- `quantalyze.co.in/about` → Netlify (static)
- `quantalyze.co.in/admin` → Railway (proxied)
- `quantalyze.co.in/api/health` → Railway (proxied)

---

## Deployment Workflow

### Automatic (Recommended)

1. Push to `main` branch
2. **Netlify** auto-builds frontend
3. **Railway** auto-deploys backend

### Manual

```bash
# Build and test locally
npm run build:netlify

# Push to trigger deployments
git add .
git commit -m "Update site"
git push origin main
```

---

## Testing

After deployment, verify:

| Test | URL | Expected |
|------|-----|----------|
| Homepage | https://quantalyze.co.in | Static page loads |
| About | https://quantalyze.co.in/about | Static page loads |
| API Health | https://quantalyze.co.in/api/health | JSON with `database.status: connected` |
| Admin Login | https://quantalyze.co.in/admin/login | Login form |
| Admin Auth | Login with `Admin` / `Admin@123` | Dashboard loads |

---

## Troubleshooting

### "API calls failing"
- Check Netlify redirects in `netlify.toml`
- Verify Railway is running: https://quantalyze.up.railway.app/api/health
- Check browser console for CORS errors

### "Admin login not working"
- Verify Railway MySQL is connected
- Check Railway logs for errors
- Ensure JWT_SECRET is set

### "Static pages 404"
- Verify build output in `out/` folder
- Check Netlify deploy logs
- Ensure `trailingSlash: true` in config

---

## Files Reference

| File | Purpose |
|------|---------|
| `netlify.toml` | Netlify build & redirect config |
| `scripts/build-netlify.js` | Build script for Netlify |
| `railway.json` | Railway deployment config |
| `.env.railway` | Railway env template |

---

## Cost Estimate

| Service | Free Tier | Paid |
|---------|-----------|------|
| **Netlify** | 100GB bandwidth/month | $19/month |
| **Railway** | $5 credit/month | ~$5-20/month |
| **Total** | ~$0-5/month | ~$25-40/month |

---

*Last updated: December 2024*
