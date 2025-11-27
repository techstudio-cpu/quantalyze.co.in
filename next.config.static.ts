import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Enable static export for Serverbyt deployment
  eslint: {
    ignoreDuringBuilds: true, // Allow build even with ESLint warnings
  },
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
    ],
  },
  trailingSlash: true, // Better compatibility with traditional servers
};

export default nextConfig;
