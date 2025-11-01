# 🚀 ServerByte Deployment Guide

## Pre-Deployment Checklist

✅ Project cleaned and optimized
✅ Build successful with zero errors
✅ All assets organized
✅ Configuration files ready

---

## Build & Export

### Step 1: Clean Build
```bash
# Remove old build artifacts
rm -rf .next out

# Install dependencies (if needed)
npm install

# Build for production
npm run build
```

### Step 2: Verify Export
After build, you should see:
```
✓ Exporting (8/11)
✓ Finalizing page optimization
```

And an `out/` directory will be created with all static files.

---

## ServerByte Deployment

### Option 1: FTP/cPanel Upload

1. **Login to your ServerByte cPanel**
2. **Navigate to File Manager** → `public_html` or your domain folder
3. **Upload all files from `out/` directory**:
   - Select all files in the `out/` folder
   - Upload via FTP (FileZilla, WinSCP) or cPanel File Manager
   - Maintain folder structure

4. **Verify `.htaccess` is uploaded**:
   - The `.htaccess` file should be in root directory
   - It handles routing, HTTPS, caching, and security

### Option 2: Git Deploy (if available)

```bash
# Initialize git (if not done)
git init
git add .
git commit -m "Production ready for ServerByte deployment"

# Push to your repository
git remote add origin <your-repo-url>
git push -u origin main

# Then deploy via ServerByte Git integration if available
```

---

## Post-Deployment Steps

### 1. Test Your Site
- ✅ Visit your domain
- ✅ Test all pages: /brands, /services, /contact, etc.
- ✅ Verify images load correctly
- ✅ Check mobile responsiveness

### 2. SSL Certificate (HTTPS)
- ServerByte usually provides free Let's Encrypt SSL
- Enable in cPanel → SSL/TLS
- The `.htaccess` will redirect HTTP → HTTPS automatically

### 3. Domain Configuration
- If using a custom domain, update DNS records
- Point to ServerByte nameservers
- Allow 24-48 hours for DNS propagation

### 4. Performance Optimization
- Enable caching in ServerByte cPanel
- Use CDN if available (Cloudflare recommended)
- Monitor via ServerByte dashboard

---

## Troubleshooting

### Issue: 404 on All Pages Except Homepage
**Solution**: Ensure `.htaccess` is uploaded and Apache mod_rewrite is enabled

### Issue: Images Not Loading
**Solution**: Check image paths are correct in `public/images/`

### Issue: Slow Loading
**Solution**: Enable compression and caching in cPanel

### Issue: Build Fails
**Solution**: 
```bash
# Clear cache and rebuild
rm -rf .next out node_modules
npm install
npm run build
```

---

## Environment Variables (if needed)

If you need to add environment variables later:

1. Create `.env.local` in root
2. Add variables like:
   ```
   NEXT_PUBLIC_API_URL=https://your-api.com
   ```
3. Rebuild: `npm run build`

---

## File Upload Checklist

```
out/
├── .htaccess              ✅ REQUIRED - Upload this
├── index.html             ✅ Homepage
├── _next/                 ✅ Next.js assets
├── images/                ✅ All images
├── brands/                ✅ Brands page
├── contact/               ✅ Contact page
├── portfolio/             ✅ Portfolio page
├── services/              ✅ Services page
├── testimonials/          ✅ Testimonials page
├── why-us/                ✅ Why Us page
└── favicon.ico            ✅ Icon
```

---

## Support

- **ServerByte Support**: https://serverbyte.com/support
- **Next.js Docs**: https://nextjs.org/docs/deployment
- **GitHub Issues**: Report any problems with deployment

---

## 🎉 Success!

Once deployed, your site should be live at: `https://yourdomain.com`

**Congratulations! Your Quantalyze Digital Agency website is now live on ServerByte!** 🚀

