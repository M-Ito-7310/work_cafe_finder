/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google OAuth画像
      },
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com', // X (Twitter) OAuth画像
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // Experimental: Use minimal static generation
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Leaflet requires canvas which is not available in Node.js
  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    return config;
  },
};

module.exports = nextConfig;
