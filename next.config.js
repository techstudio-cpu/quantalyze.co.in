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
  
  // Trailing slash for better compatibility
  trailingSlash: true,
  
  // Environment-specific settings
  ...(process.env.NODE_ENV === 'production' && {
    // Production-only optimizations
  }),
};

module.exports = nextConfig;
