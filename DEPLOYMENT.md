# Railway Deployment Guide

## ✅ Pre-Deployment Checklist

Your project is now **production-ready** and optimized for Railway deployment.

### Files Removed
- ❌ All deployment MD files (8 files)
- ❌ Non-Railway .env files (.env.example, .env.local, .env.netlify, .env.production)
- ❌ Backup folders (_admin_backup, _api_backup)
- ❌ Python backend (unused)
- ❌ Build scripts (Netlify, static builds)
- ❌ netlify.toml, deploy.sh, .htaccess
- ❌ Unnecessary config files

### Files Optimized
- ✅ package.json - Railway-only scripts
- ✅ .gitignore - Clean, production-focused
- ✅ .env - Renamed from .env.railway
- ✅ README.md - Concise deployment guide
- ✅ Health check endpoint created at `/api/health`

## 🚀 Deploy to Railway

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Production-ready: Railway deployment"
git push origin main
```

### Step 2: Railway Setup

1. **Create New Project**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Add MySQL Database**
   - Click "New" → "Database" → "Add MySQL"
   - Railway auto-configures connection variables

3. **Configure Environment Variables**
   
   Go to project settings → Variables, add:
   
   ```env
   NODE_ENV=production
   JWT_SECRET=<generate-strong-secret>
   NEXTAUTH_SECRET=<generate-strong-secret>
   NEXTAUTH_URL=https://your-domain.railway.app
   EMAIL_HOST=smtp.stackmail.com
   EMAIL_PORT=587
   EMAIL_USER=info@quantalyze.co.in
   EMAIL_PASS=<your-email-password>
   GOOGLE_ANALYTICS_ID=<your-ga-id>
   PORT=3000
   ```
   
   **Note:** `MYSQL_URL` and related DB variables are auto-populated by Railway MySQL plugin.

4. **Deploy**
   - Railway automatically deploys on push to main
   - Monitor build logs in Railway dashboard
   - First build takes 2-3 minutes

### Step 3: Custom Domain (Optional)

1. Go to Settings → Domains
2. Click "Generate Domain" for Railway subdomain
3. Or add custom domain (quantalyze.co.in)
4. Update `NEXTAUTH_URL` to match your domain

## 🔍 Health Monitoring

Railway monitors your app via `/api/health` endpoint:
- **Timeout:** 300 seconds
- **Restart Policy:** ON_FAILURE
- **Max Retries:** 10

## 📊 Post-Deployment

### Verify Deployment

1. **Check Health:** `https://your-app.railway.app/api/health`
2. **Test Homepage:** `https://your-app.railway.app`
3. **Admin Panel:** `https://your-app.railway.app/admin`

### Database Setup

If using Railway MySQL for the first time:
1. Railway creates empty database
2. Run migrations/seeds if needed
3. Create admin user via API or direct DB access

## 🛠️ Maintenance

### View Logs
```bash
# In Railway dashboard
Project → Deployments → View Logs
```

### Redeploy
```bash
git push origin main
# Railway auto-deploys
```

### Rollback
- Railway dashboard → Deployments → Select previous deployment → Redeploy

## ⚡ Performance Tips

- **Caching:** Railway CDN enabled by default
- **Scaling:** Auto-scales based on traffic
- **Database:** Consider connection pooling for high traffic
- **Monitoring:** Use Railway metrics dashboard

## 🔒 Security Checklist

- ✅ JWT secrets are strong (32+ characters)
- ✅ Database credentials secured by Railway
- ✅ .env file excluded from git
- ✅ Security headers configured in next.config.js
- ✅ HTTPS enforced by Railway

## 📞 Support

**Issues?**
- Check Railway logs
- Verify environment variables
- Review build output
- Contact: info@quantalyze.co.in

---

**Status:** ✅ Production Ready | **Platform:** Railway | **Framework:** Next.js 15
