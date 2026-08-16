const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'v3b.fal.media',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/babadag-road-guide',
        destination: '/babadag-guide/babadag-road-guide',
        permanent: true,
      },
      {
        source: '/:locale(tr|de|ru)/babadag-road-guide',
        destination: '/:locale/babadag-guide/babadag-road-guide',
        permanent: true,
      },
      {
        source: '/babadag-teleferik',
        destination: '/babadag-guide/babadag-teleferik',
        permanent: true,
      },
      {
        source: '/:locale(tr|de|ru)/babadag-teleferik',
        destination: '/:locale/babadag-guide/babadag-teleferik',
        permanent: true,
      },
      // Duplicate-topic article merge: redirect the older, weaker version
      // ('tips-before-you-fly') into the newer, clean one ('tips-2026').
      {
        source: '/blog/best-paragliding-photos-oludeniz-tips-before-you-fly',
        destination: '/blog/best-paragliding-photos-oludeniz-tips-2026',
        permanent: true,
      },
      {
        source: '/:locale(tr|de|ru)/blog/best-paragliding-photos-oludeniz-tips-before-you-fly',
        destination: '/:locale/blog/best-paragliding-photos-oludeniz-tips-2026',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ]
  },
}

module.exports = withNextIntl(nextConfig)
