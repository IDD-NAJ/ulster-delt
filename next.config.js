/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  images: {
    domains: ['images.unsplash.com', "avatars.githubusercontent.com"],
  }
};

module.exports = nextConfig;
