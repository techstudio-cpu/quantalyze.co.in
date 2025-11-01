================================================================================
🚀 QUANTALYZE DIGITAL AGENCY - SERVERBYTE DEPLOYMENT PACKAGE
================================================================================

📋 WHAT TO UPLOAD TO SERVERBYTE
================================================================================

✅ Upload EVERYTHING inside the "out" folder to your ServerByte server

FOLDER STRUCTURE TO UPLOAD:
----------------------------
out/
├── .htaccess           ← MUST UPLOAD (for routing, HTTPS, caching)
├── index.html          ← Homepage
├── favicon.ico         ← Website icon
├── 404.html            ← Error page
├── _next/              ← Next.js core files (keep folder structure)
│   └── ... all files inside
├── images/             ← All images
│   ├── Hero.png
│   ├── quantalyze.png
│   ├── quantalyze.ico
│   └── Brands We Worked With/
│       └── 1.jpg through 26.jpg
├── brands/             ← Brands page
├── contact/            ← Contact page
├── portfolio/          ← Portfolio page
├── services/           ← Services page
├── testimonials/       ← Testimonials page
└── why-us/             ← Why Us page

================================================================================
📝 UPLOAD INSTRUCTIONS
================================================================================

METHOD 1: FileZilla (FTP)
--------------------------
1. Connect to ServerByte via FTP
2. Navigate to public_html (or your domain folder)
3. Upload ALL contents of "out" folder
4. Maintain folder structure

METHOD 2: cPanel File Manager
-------------------------------
1. Login to cPanel
2. Open File Manager
3. Go to public_html
4. Click "Upload" → Select all files from "out" folder
5. Extract if uploaded as ZIP

================================================================================
✨ POST-DEPLOYMENT CHECKLIST
================================================================================

After uploading, verify:

☐ Website loads at your domain
☐ All pages work (brands, contact, portfolio, etc.)
☐ Images display correctly
☐ Mobile view looks good
☐ HTTPS is enabled (check SSL certificate)
☐ 404 page works

================================================================================
🔧 TROUBLESHOOTING
================================================================================

ISSUE: 404 on all pages except homepage
FIX: Make sure .htaccess file was uploaded to root directory

ISSUE: Images not loading
FIX: Verify images folder is uploaded with correct structure

ISSUE: Style not loading
FIX: Ensure _next folder is uploaded completely

================================================================================
📞 SUPPORT
================================================================================

ServerByte Support: https://serverbyte.com/support

================================================================================
🎉 READY TO GO LIVE!
================================================================================

Your Quantalyze website is production-ready!

================================================================================

