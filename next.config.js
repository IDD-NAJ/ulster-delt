/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['images.unsplash.com', "avatars.githubusercontent.com"],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000']
    }
  },
};

module.exports = nextConfig;
