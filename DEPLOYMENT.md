# Deployment Guide

This guide will help you deploy your Quantalyze website to various hosting platforms.

## 📋 Pre-Deployment Checklist

Before deploying, make sure you've:

- [ ] Updated all placeholder content with real information
- [ ] Replaced placeholder images with actual images
- [ ] Updated contact information (email, phone, address)
- [ ] Added real social media links
- [ ] Tested the website locally (`npm run build && npm start`)
- [ ] Configured EmailJS for contact form (if needed)
- [ ] Updated meta tags and SEO information
- [ ] Set up environment variables (if any)
- [ ] Tested on multiple devices and browsers
- [ ] Removed any console.log statements
- [ ] Optimized images for web

## 🚀 Deployment Options

### Option 1: Vercel (Recommended) ⭐

Vercel is the creators of Next.js and offers the best performance and easiest deployment.

#### Steps:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin your-github-repo-url
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy"

3. **Configure Domain** (Optional)
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update your domain's DNS settings as instructed

**Pros:**
- Zero configuration needed
- Automatic deployments on git push
- Built-in CDN
- Serverless functions support
- Free SSL certificates
- Excellent performance

**Pricing:** Free for personal projects

---

### Option 2: Netlify

Another excellent choice for static site hosting with great features.

#### Steps:

1. **Build the Project**
   ```bash
   npm run build
   ```

2. **Deploy on Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/Login
   - Drag and drop your `.next` folder OR
   - Connect your GitHub repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

**Pros:**
- Easy to use
- Automatic deployments
- Free SSL
- Form handling
- Split testing

**Pricing:** Free tier available

---

### Option 3: AWS Amplify

Great for those already using AWS services.

#### Steps:

1. **Connect GitHub Repository**
   - Go to AWS Amplify Console
   - Connect your repository

2. **Configure Build Settings**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

3. **Deploy**
   - Click "Save and Deploy"

**Pros:**
- Integrated with AWS ecosystem
- Good for enterprise
- Automatic CI/CD

**Pricing:** Pay-as-you-go

---

### Option 4: DigitalOcean App Platform

Simple deployment with DigitalOcean's reliability.

#### Steps:

1. **Create New App**
   - Go to [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform)
   - Click "Create App"
   - Connect your GitHub repository

2. **Configure**
   - Build Command: `npm run build`
   - Run Command: `npm start`

3. **Deploy**
   - Choose your plan
   - Click "Launch App"

**Pros:**
- Simple pricing
- Good documentation
- Managed services

**Pricing:** Starting from $5/month

---

### Option 5: Traditional Hosting (cPanel/Shared Hosting)

For traditional web hosting providers.

#### Steps:

1. **Build for Production**
   ```bash
   npm run build
   ```

2. **Export Static Site** (if possible)
   - Update `next.config.ts`:
   ```typescript
   const nextConfig = {
     output: 'export',
     images: {
       unoptimized: true,
     },
   };
   ```
   - Run: `npm run build`
   - Upload the `out` folder to your hosting

⚠️ **Note:** Some Next.js features won't work with static export (SSR, API routes)

**Pros:**
- Works with existing hosting
- No platform lock-in

**Cons:**
- Limited Next.js features
- More manual work
- Slower than modern platforms

---

## 🔧 Environment Variables

If you're using environment variables, set them up in your hosting platform:

### Vercel
1. Go to Project Settings → Environment Variables
2. Add your variables:
   - `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
   - `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
   - `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`
   - etc.

### Netlify
1. Go to Site Settings → Build & Deploy → Environment
2. Add your variables

### Others
Similar process - check your platform's documentation

---

## 🌐 Custom Domain Setup

### DNS Configuration

For most platforms, you'll need to add these DNS records:

**Option A: Using A Records (Root Domain)**
```
Type: A
Name: @
Value: [Platform's IP address]
```

**Option B: Using CNAME (Subdomain)**
```
Type: CNAME
Name: www
Value: [Platform's domain]
```

**Example for Vercel:**
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### SSL Certificate

Most modern platforms (Vercel, Netlify, etc.) automatically provide free SSL certificates via Let's Encrypt. Just wait a few minutes after adding your domain.

---

## 🔍 Post-Deployment Checklist

After deployment, verify:

- [ ] Website loads correctly on the production URL
- [ ] All images display properly
- [ ] Navigation works (all links functional)
- [ ] Forms submit correctly
- [ ] Contact form emails are received
- [ ] Mobile responsiveness
- [ ] Dark mode works
- [ ] SSL certificate is active (https://)
- [ ] Performance (use PageSpeed Insights)
- [ ] SEO tags are correct (check with social media debuggers)
- [ ] Analytics tracking works (if configured)
- [ ] All external links work
- [ ] No console errors

---

## 📊 Performance Optimization

After deployment, optimize for better performance:

1. **Enable Caching**
   - Configure cache headers in your platform
   - Use CDN for static assets

2. **Image Optimization**
   - Use WebP format
   - Implement lazy loading
   - Use Next.js Image component

3. **Monitor Performance**
   - Use Google PageSpeed Insights
   - Monitor Core Web Vitals
   - Set up monitoring (Vercel Analytics, etc.)

4. **Configure Compression**
   - Enable Gzip/Brotli compression
   - Minify CSS/JS (Next.js does this automatically)

---

## 🐛 Troubleshooting

### Build Fails

**Problem:** Build fails during deployment

**Solutions:**
- Check build logs for specific errors
- Ensure all dependencies are in `package.json`
- Test build locally: `npm run build`
- Check Node.js version compatibility

### Images Not Loading

**Problem:** Images don't display after deployment

**Solutions:**
- Ensure images are in the `/public` folder
- Check image paths (use absolute paths: `/images/...`)
- Configure `next.config.ts` for external images
- Verify image files are actually deployed

### Forms Not Working

**Problem:** Contact form doesn't send emails

**Solutions:**
- Check EmailJS configuration
- Verify environment variables are set
- Check browser console for errors
- Test EmailJS credentials separately

### 404 Errors on Refresh

**Problem:** Page shows 404 when refreshing on sub-routes

**Solutions:**
- Configure redirects/rewrites in platform
- Ensure SSR is enabled (not using static export)
- Check platform-specific SPA configuration

---

## 📈 Monitoring & Analytics

### Google Analytics

Add to `src/app/layout.tsx`:

```tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script async src={`https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID`}></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `
        }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Vercel Analytics

- Go to Project Settings → Analytics
- Enable Vercel Analytics (free for hobby projects)

---

## 🔄 Continuous Deployment

Set up automatic deployments:

1. **Connect Git Repository**
   - Most platforms auto-deploy on push to main branch

2. **Configure Branch Deploys**
   - Production: `main` or `master` branch
   - Preview: feature branches

3. **Set up Webhooks** (Optional)
   - For custom deployment triggers
   - For CMS integration

---

## 📝 Maintenance Tips

1. **Regular Updates**
   - Keep dependencies updated: `npm update`
   - Check for security vulnerabilities: `npm audit`

2. **Backups**
   - Keep your code in version control (GitHub)
   - Export database/content regularly (if using CMS)

3. **Monitoring**
   - Set up uptime monitoring
   - Monitor error logs
   - Track performance metrics

---

## 🎉 You're Live!

Congratulations on deploying your website! 

### Share Your Site
- Test thoroughly before announcing
- Share on social media
- Update business listings with new URL
- Add to your email signature

### Next Steps
- Set up Google Search Console
- Submit sitemap to search engines
- Start creating content/blog posts
- Monitor analytics and user behavior

---

## 📞 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs/deployment
- **Netlify Docs**: https://docs.netlify.com
- **GitHub Discussions**: Check your framework's community

Good luck with your launch! 🚀

