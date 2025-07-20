/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker deployment
  output: 'standalone',
  
  // Optimize for production
  swcMinify: true,
  
  // Environment variables that should be available on the client side
  env: {
    CUSTOM_KEY: 'VIT_SMARTBOT',
  },
  
  // Image optimization configuration
  images: {
    domains: [],
    unoptimized: false,
  },
  
  // Experimental features
  experimental: {
    serverComponentsExternalPackages: ['mongoose', 'mongodb'],
  },
  
  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
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
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  
  // Redirects for clean URLs
  async redirects() {
    return [
      {
        source: '/chat',
        destination: '/chatbot',
        permanent: true,
      },
      {
        source: '/bot',
        destination: '/chatbot',
        permanent: true,
      },
    ]
  },
  
  // Webpack configuration for better builds
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Handle node modules that might cause issues
    config.externals = config.externals || []
    
    if (!isServer) {
      config.externals.push({
        'natural': 'natural',
        'mongodb': 'mongodb',
        'mongoose': 'mongoose'
      })
    }
    
    return config
  },
}

export default nextConfig
