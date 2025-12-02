/**
 * Build for Netlify Deployment
 * 
 * This script:
 * 1. Temporarily excludes API and admin routes (they run on Railway)
 * 2. Builds static export with Next.js
 * 3. Outputs to /out folder (Netlify default)
 * 4. Restores original files
 * 
 * Usage: npm run build:netlify
 * 
 * Architecture:
 * - Netlify: Static frontend (/, /about, /services, /contact, etc.)
 * - Railway: Dynamic backend (/api/*, /admin/*)
 * - Railway MySQL: Database
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const RAILWAY_API = process.env.NEXT_PUBLIC_API_URL || 'https://quantalyze.up.railway.app';

console.log('🚀 Building for Netlify...\n');
console.log(`📡 Railway API: ${RAILWAY_API}\n`);

// Paths
const originalConfig = path.join(ROOT_DIR, 'next.config.js');
const backupConfig = path.join(ROOT_DIR, 'next.config.backup.js');
const appDir = path.join(ROOT_DIR, 'src', 'app');
const apiDir = path.join(appDir, 'api');
const adminDir = path.join(appDir, 'admin');
const apiBackup = path.join(ROOT_DIR, '_api_backup');
const adminBackup = path.join(ROOT_DIR, '_admin_backup');

// Step 1: Backup original next.config.js
console.log('1️⃣ Backing up config...');
if (fs.existsSync(originalConfig)) {
  fs.copyFileSync(originalConfig, backupConfig);
}

// Step 2: Create Netlify-specific next.config.js
console.log('2️⃣ Creating Netlify config...');
const netlifyConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: '${RAILWAY_API}',
    NEXT_PUBLIC_SITE_URL: 'https://quantalyze.co.in',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
`;
fs.writeFileSync(originalConfig, netlifyConfig);

// Step 3: Create stub route files instead of moving folders
// This prevents "module not found" errors while still excluding dynamic routes
console.log('3️⃣ Creating stub routes for static export...');

// Backup and stub API folder
if (fs.existsSync(apiDir)) {
  fs.renameSync(apiDir, apiBackup);
  fs.mkdirSync(apiDir, { recursive: true });
  // Create a placeholder to prevent errors
  fs.writeFileSync(path.join(apiDir, '.gitkeep'), '');
  console.log('   ✓ Stubbed /api folder');
}

// Backup and stub admin folder  
if (fs.existsSync(adminDir)) {
  fs.renameSync(adminDir, adminBackup);
  fs.mkdirSync(adminDir, { recursive: true });
  // Create minimal page that redirects to Railway
  const stubPage = `'use client';
import { useEffect } from 'react';
export default function AdminRedirect() {
  useEffect(() => {
    window.location.href = '${RAILWAY_API}/admin';
  }, []);
  return <div>Redirecting to admin...</div>;
}
`;
  fs.writeFileSync(path.join(adminDir, 'page.tsx'), stubPage);
  console.log('   ✓ Stubbed /admin folder with redirect');
}

// Step 4: Build
console.log('4️⃣ Building static export...');
try {
  execSync('npx next build', {
    cwd: ROOT_DIR,
    stdio: 'inherit',
    env: {
      ...process.env,
      NEXT_PUBLIC_API_URL: RAILWAY_API,
    }
  });
  console.log('   ✓ Build successful');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  restoreAll();
  process.exit(1);
}

// Step 5: Restore everything
restoreAll();

console.log('\n✅ Netlify build complete!');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📁 Output folder: out/');
console.log('🌐 Frontend:      Netlify');
console.log('🔧 Backend:       ' + RAILWAY_API);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

function restoreAll() {
  console.log('5️⃣ Restoring original files...');
  
  // Restore config
  if (fs.existsSync(backupConfig)) {
    fs.copyFileSync(backupConfig, originalConfig);
    fs.unlinkSync(backupConfig);
    console.log('   ✓ Restored next.config.js');
  }
  
  // Restore API folder
  if (fs.existsSync(apiBackup)) {
    fs.renameSync(apiBackup, apiDir);
    console.log('   ✓ Restored /api folder');
  }
  
  // Restore admin folder
  if (fs.existsSync(adminBackup)) {
    fs.renameSync(adminBackup, adminDir);
    console.log('   ✓ Restored /admin folder');
  }
}
