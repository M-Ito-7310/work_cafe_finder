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
  },
  // Leaflet requires canvas which is not available in Node.js
  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    return config;
  },
};

module.exports = nextConfig;
