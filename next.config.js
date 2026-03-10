/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['github.com', 'avatars.githubusercontent.com'],
  },
  output: 'standalone', // Add this for Vercel
}

module.exports = nextConfig