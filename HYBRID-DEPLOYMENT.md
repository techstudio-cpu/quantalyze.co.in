# Hybrid Deployment Guide

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    quantalyze.co.in                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────────────┐    ┌─────────────────────────┐   │
│   │    ServerByt        │    │       Railway           │   │
│   │    (Static)         │    │       (Dynamic)         │   │
│   ├─────────────────────┤    ├─────────────────────────┤   │
│   │ • Home page         │    │ • /admin/*              │   │
│   │ • /about            │───▶│ • /api/*                │   │
│   │ • /services         │    │ • Database (MySQL)      │   │
│   │ • /contact          │    │ • Authentication        │   │
│   │ • /portfolio        │    │ • Dynamic content       │   │
│   │ • All static pages  │    │                         │   │
│   └─────────────────────┘    └─────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## How It Works

1. **Static Site (ServerByt)**
   - Pure HTML/CSS/JS files
   - Super fast loading
   - Low hosting cost
   - No server-side processing needed

2. **Dynamic Backend (Railway)**
   - Admin panel
   - All API endpoints
   - Database operations
   - Form submissions

3. **Connection**
   - Static site calls Railway API for dynamic features
   - Admin panel redirects to Railway
   - Forms submit to Railway API

---

## Build & Deploy

### Step 1: Get Your Railway Domain

First, note your Railway app URL. It looks like:
- `https://quantalyze-digital-agency-production.up.railway.app`

Or if you set a custom subdomain:
- `https://api.quantalyze.co.in`

### Step 2: Build Static Site

```bash
# Set your Railway URL and build
set RAILWAY_API_URL=https://YOUR-RAILWAY-DOMAIN.up.railway.app
npm run build:static
```

Or on Mac/Linux:
```bash
RAILWAY_API_URL=https://YOUR-RAILWAY-DOMAIN.up.railway.app npm run build:static
```

This creates a `static-deploy/` folder with all static files.

### Step 3: Upload to ServerByt

1. Open **FileZilla** or **cPanel File Manager**
2. Connect to your ServerByt hosting
3. Navigate to `public_html/`
4. **Delete** all existing files (backup first if needed)
5. Upload **everything** from `static-deploy/` folder
6. Make sure `.htaccess` is uploaded (it's a hidden file)

### Step 4: Verify

- **Static site**: https://quantalyze.co.in
- **Admin panel**: https://YOUR-RAILWAY-DOMAIN.up.railway.app/admin
- **API health**: https://YOUR-RAILWAY-DOMAIN.up.railway.app/api/health

---

## DNS Configuration (Optional)

If you want `api.quantalyze.co.in` to point to Railway:

1. In your domain registrar (GoDaddy, Namecheap, etc.):

   ```
   Type: CNAME
   Name: api
   Value: YOUR-RAILWAY-DOMAIN.up.railway.app
   ```

2. In Railway → Settings → Domains:
   - Add custom domain: `api.quantalyze.co.in`

Then update your static build:
```bash
set RAILWAY_API_URL=https://api.quantalyze.co.in
npm run build:static
```

---

## What Goes Where

### ServerByt (Static)
- `/` - Home page
- `/about/` - About page
- `/services/` - Services listing
- `/contact/` - Contact page
- `/portfolio/` - Portfolio
- `/testimonials/` - Testimonials
- `/brands/` - Brands page
- `/why-us/` - Why us page
- All other static pages

### Railway (Dynamic)
- `/admin/` - Admin dashboard
- `/admin/login/` - Admin login
- `/api/admin/*` - Admin API
- `/api/health` - Health check
- `/api/newsletter` - Newsletter subscribe
- `/api/contact` - Contact form submit

---

## Updating Content

### Static Pages
1. Edit files in `src/app/`
2. Run `npm run build:static`
3. Upload to ServerByt

### Dynamic Content (via Admin)
1. Go to Railway admin panel
2. Make changes
3. Changes reflect automatically (no redeploy needed)

---

## Troubleshooting

### Contact form not working
- Check browser console for CORS errors
- Verify RAILWAY_API_URL is correct
- Check Railway logs for errors

### Admin panel not loading
- Make sure Railway is deployed and running
- Check Railway health: `/api/health`

### 404 errors on page refresh
- Make sure `.htaccess` is uploaded
- Check if mod_rewrite is enabled on ServerByt

---

## File Structure

```
static-deploy/
├── index.html          # Home page
├── about/
│   └── index.html
├── services/
│   └── index.html
├── contact/
│   └── index.html
├── _next/              # Next.js assets
│   ├── static/
│   └── ...
├── .htaccess           # Apache config (redirects /admin, /api to Railway)
└── deploy-info.json    # Build metadata
```

---

*Last updated: December 2024*
