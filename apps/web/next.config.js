/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['image.mux.com', 'lh3.googleusercontent.com'],
  },
  transpilePackages: ['@setpiece/ui', '@setpiece/db', '@setpiece/config'],
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/', destination: '/index.html' },
      ],
    }
  },
}

module.exports = nextConfig
