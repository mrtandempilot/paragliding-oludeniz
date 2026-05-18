/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://paragliding-oludeniz.com',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'weekly',
  priority: 0.7,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: '/api/' },
    ],
  },
  additionalPaths: async (config) => {
    return []
  },
  transform: async (config, path) => {
    // Homepage gets highest priority
    if (path === '/') {
      return { loc: path, changefreq: 'daily', priority: 1.0 }
    }
    // Main pages
    if (['/tandem-paragliding', '/babadag-guide', '/book-now', '/prices'].includes(path)) {
      return { loc: path, changefreq: 'weekly', priority: 0.9 }
    }
    // Blog posts
    if (path.startsWith('/blog/')) {
      return { loc: path, changefreq: 'monthly', priority: 0.7 }
    }
    return { loc: path, changefreq: 'weekly', priority: 0.6 }
  },
}
