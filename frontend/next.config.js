/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Static HTML export - the ONLY mode that works reliably on Azure Static Web Apps
  output: 'export',
  distDir: '.next',
  trailingSlash: true, // Required for Azure Static Web Apps routing
  images: {
    unoptimized: true, // Required for static export
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:7071/api',
  },
}

module.exports = nextConfig

