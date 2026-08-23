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
      // Keyword-cannibalization cleanup (SEO audit, Aug 2026): these pairs/
      // triple targeted the same primary keyword with near-duplicate H2
      // structure. Redirect the weaker/duplicate version into the stronger
      // canonical one instead of leaving both indexed.
      {
        source: '/blog/best-time-to-paraglide-oludeniz-2026',
        destination: '/blog/best-time-to-paraglide-in-oludeniz',
        permanent: true,
      },
      {
        source: '/:locale(tr|de|ru)/blog/best-time-to-paraglide-oludeniz-2026',
        destination: '/:locale/blog/best-time-to-paraglide-in-oludeniz',
        permanent: true,
      },
      {
        source: '/blog/gopro-paragliding-oludeniz-videos-photos-2026',
        destination: '/blog/gopro-paragliding-oludeniz-video-photos-2026',
        permanent: true,
      },
      {
        source: '/:locale(tr|de|ru)/blog/gopro-paragliding-oludeniz-videos-photos-2026',
        destination: '/:locale/blog/gopro-paragliding-oludeniz-video-photos-2026',
        permanent: true,
      },
      {
        source: '/blog/paragliding-weight-limit-oludeniz-2026-explained',
        destination: '/blog/paragliding-oludeniz-weight-limits-requirements-2026',
        permanent: true,
      },
      {
        source: '/:locale(tr|de|ru)/blog/paragliding-weight-limit-oludeniz-2026-explained',
        destination: '/:locale/blog/paragliding-oludeniz-weight-limits-requirements-2026',
        permanent: true,
      },
      {
        source: '/blog/tandem-paragliding-oludeniz-complete-guide-2026',
        destination: '/blog/babadag-tandem-paragliding-complete-guide',
        permanent: true,
      },
      {
        source: '/:locale(tr|de|ru)/blog/tandem-paragliding-oludeniz-complete-guide-2026',
        destination: '/:locale/blog/babadag-tandem-paragliding-complete-guide',
        permanent: true,
      },
      {
        source: '/blog/turkey-tandem-paragliding-flight-2026',
        destination: '/blog/babadag-tandem-paragliding-complete-guide',
        permanent: true,
      },
      {
        source: '/:locale(tr|de|ru)/blog/turkey-tandem-paragliding-flight-2026',
        destination: '/:locale/blog/babadag-tandem-paragliding-complete-guide',
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
          // CSP (SEO audit, Aug 2026): allowlists exactly the third-party
          // origins the site actually loads — GTM/GA (app/layout.tsx),
          // Cloudinary/Unsplash/fal.media images (next.config images.remotePatterns),
          // the Google Maps embed on /contact, and the YouTube-nocookie
          // embeds on /videos. 'unsafe-inline' is kept for script/style
          // because Next.js hydration + the inline gtag() bootstrap script
          // both require it; tightening further would need a nonce-based
          // setup via middleware, which is a bigger follow-up.
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://googleads.g.doubleclick.net",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com https://v3b.fal.media https://www.google-analytics.com https://www.googletagmanager.com https://i.ytimg.com",
              "font-src 'self' data:",
              "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://www.googletagmanager.com https://*.supabase.co",
              // maps.google.com/maps?...&output=embed 302s to www.google.com/maps/embed —
              // both hosts need to be allowed or the redirect target gets blocked.
              "frame-src 'self' https://www.googletagmanager.com https://www.youtube-nocookie.com https://maps.google.com https://www.google.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              'upgrade-insecure-requests',
            ].join('; '),
          },
        ],
      },
    ]
  },
}

module.exports = withNextIntl(nextConfig)
