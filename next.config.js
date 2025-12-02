/** @type {import('next').NextConfig} */
const nextConfig = {
  // Railway deployment configuration
  output: undefined,
  
  // Production optimizations
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Image optimization for production
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'railway.app',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Compression
  compress: true,
  
  // Power by header
  poweredByHeader: false,
  
  // IMPORTANT: trailingSlash breaks API routes with POST requests (causes 308 redirect)
  // Removed to fix admin login and other API functionality
  trailingSlash: false,
  
  // Skip trailing slash redirect for API routes
  skipTrailingSlashRedirect: true,
  
  // Next.js 15 experimental features
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: ['lucide-react', '@heroicons/react', 'react-icons'],
  },
  
  // Logging configuration for development
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

module.exports = nextConfig;
