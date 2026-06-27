/** @type {import('next-sitemap').IConfig} */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://atmosparagliding.com'
const LOCALES = ['en', 'tr', 'de', 'ru']

module.exports = {
  siteUrl: SITE_URL,
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
    // Skip non-locale paths (they redirect, shouldn't be in sitemap)
    const isLocalePath = LOCALES.some(l => path.startsWith(`/${l}/`) || path === `/${l}`)
    if (!isLocalePath) return null

    // Extract the locale and the rest of the path
    const localeMatch = path.match(/^\/([a-z]{2})(\/.+)?$/)
    if (!localeMatch) return null
    const currentLocale = localeMatch[1]
    const subPath = localeMatch[2] || ''

    // Build hreflang alternates for all locales
    const alternateRefs = LOCALES.map(locale => ({
      href: `${SITE_URL}/${locale}${subPath}`,
      hreflang: locale,
    }))
    // Add x-default pointing to /en
    alternateRefs.push({
      href: `${SITE_URL}/en${subPath}`,
      hreflang: 'x-default',
    })

    // Priority by path type
    let priority = 0.6
    let changefreq = 'weekly'
    if (path === '/en' || path === '/') { priority = 1.0; changefreq = 'daily' }
    else if (subPath === '' || ['/tandem-paragliding', '/babadag-guide', '/book-now', '/prices'].includes(subPath)) {
      priority = currentLocale === 'en' ? 0.9 : 0.7
    }
    else if (subPath.startsWith('/blog/')) { priority = 0.7; changefreq = 'monthly' }

    return { loc: path, changefreq, priority, alternateRefs }
  },
}
