/** @type {import('next').NextConfig} */

// Static export configuration for ServerByt deployment
// This generates pure HTML/CSS/JS files that work on any static hosting
// API routes and admin pages are excluded (they stay on Railway)

const RAILWAY_API_URL = process.env.RAILWAY_API_URL || 'https://quantalyze.up.railway.app';

const staticConfig = {
  // Enable static HTML export
  output: 'export',
  
  // Disable image optimization (not supported in static export)
  images: {
    unoptimized: true,
  },
  
  // Trailing slash for Apache compatibility
  trailingSlash: true,
  
  // Environment variables for static build
  env: {
    NEXT_PUBLIC_API_URL: RAILWAY_API_URL,
    NEXT_PUBLIC_SITE_URL: 'https://quantalyze.co.in',
  },
  
  // Production optimizations
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Compression
  compress: true,
  
  // Power by header
  poweredByHeader: false,
  
  // Note: API and admin routes are excluded by the build script
  // (temporarily moved before build, restored after)
};

module.exports = staticConfig;
