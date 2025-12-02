# Railway Deployment Guide for Quantalyze

## 🚀 Quick Deploy Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Production-ready: Railway deployment"
git push origin main
```

### Step 2: Create Railway Project

1. Go to [Railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize and select your `quantalyze-digital-agency` repo
5. Railway auto-detects Next.js and starts building

### Step 3: Add MySQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database" → "MySQL"**
3. Railway automatically creates and connects the database
4. Environment variables are auto-injected:
   - `MYSQL_URL`
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLDATABASE`

### Step 4: Configure Environment Variables

In Railway dashboard → Your service → **Variables** tab, add:

```env
# Required
NODE_ENV=production
JWT_SECRET=<generate-a-secure-64-char-secret>

# Email (optional)
EMAIL_PASSWORD=<your-gmail-app-password>

# EmailJS (optional - for contact forms)
EMAILJS_PUBLIC_KEY=<your-key>
EMAILJS_SERVICE_ID=<your-service-id>
EMAILJS_TEMPLATE_ID=<your-template-id>
```

### Step 5: Deploy

Railway auto-deploys on every push. Manual redeploy:
1. Go to **Deployments** tab
2. Click **"Redeploy"**

### Step 6: Setup Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Click **"+ Custom Domain"**
3. Add `quantalyze.co.in`
4. Update DNS records at your registrar:
   ```
   Type: CNAME
   Name: @
   Value: <your-railway-domain>.up.railway.app
   ```

---

## 📋 Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | ✅ | Set to `production` |
| `JWT_SECRET` | ✅ | Secret for admin auth tokens |
| `MYSQL_URL` | Auto | Railway injects this |
| `EMAIL_PASSWORD` | ⚡ | For email features |
| `EMAILJS_*` | ⚡ | For contact form |

---

## 🔧 Build Settings

Railway uses these settings (from `railway.json`):

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/api/health"
  }
}
```

---

## ✅ Verify Deployment

After deployment, check:

1. **Health Check**: `https://your-domain.up.railway.app/api/health`
   ```json
   {
     "status": "ok",
     "database": { "type": "MySQL", "status": "connected" },
     "railway": true
   }
   ```

2. **Admin Login**: `https://your-domain.up.railway.app/admin/login`
   - Username: `Admin`
   - Password: `Admin@123`
   - **Change password after first login!**

---

## 🐛 Troubleshooting

### Build Fails
- Check Railway build logs
- Ensure `package.json` has correct scripts
- Verify Node version in `engines`

### Database Connection Error
- Verify MySQL service is running in Railway
- Check if `MYSQL_URL` is present in variables
- View logs for connection errors

### Admin Login Not Working
- Check `/api/health` for database status
- Verify `JWT_SECRET` is set
- Clear browser cookies and retry

### 502/503 Errors
- Check Railway logs for crash details
- Verify healthcheck is passing
- Ensure port 3000 is used (Railway requirement)

---

## 💰 Railway Pricing

- **Hobby Plan**: $5/month (500 hours)
- **Pro Plan**: $20/month (unlimited)
- MySQL addon: Included in plan

---

## 🔒 Security Checklist

- [ ] Change `JWT_SECRET` from default
- [ ] Change admin password after first login
- [ ] Enable 2FA on Railway account
- [ ] Set up SSL (automatic on Railway)
- [ ] Review CORS origins in code

---

## 📞 Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- GitHub Issues: Create issue in your repo

---

*Last updated: December 2024*
