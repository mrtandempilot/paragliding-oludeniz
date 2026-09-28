/** @type {import('next-sitemap').IConfig} */
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.atmosparagliding.com').replace(/\/$/, '')
const LOCALES = ['en', 'tr', 'de', 'ru', 'zh']

function getUrlForLocale(locale: string, subPath: string): string {
  const cleanSubPath = subPath === '/' ? '' : subPath
  return locale === 'en' ? `${SITE_URL}${cleanSubPath}` : `${SITE_URL}/${locale}${cleanSubPath}`
}

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
  transform: async (config, path) => {
    // Extract locale if present at start of path
    const match = path.match(/^\/([a-z]{2})(\/.*)?$/)
    let currentLocale = 'en'
    let subPath = path

    if (match && LOCALES.includes(match[1])) {
      currentLocale = match[1]
      subPath = match[2] || '/'
    }

    // Build hreflang alternates for all locales
    const alternateRefs = LOCALES.map(locale => ({
      href: getUrlForLocale(locale, subPath),
      hreflang: locale === 'zh' ? 'zh-Hans' : locale,
    }))

    // Add x-default pointing to English version
    alternateRefs.push({
      href: getUrlForLocale('en', subPath),
      hreflang: 'x-default',
    })

    // Priority by path type
    let priority = 0.6
    let changefreq = 'weekly'
    if (subPath === '/' || subPath === '') {
      priority = 1.0
      changefreq = 'daily'
    } else if (['/tandem-paragliding', '/babadag-guide', '/book-now', '/prices'].includes(subPath)) {
      priority = currentLocale === 'en' ? 0.9 : 0.7
    } else if (subPath.startsWith('/blog/')) {
      priority = 0.7
      changefreq = 'monthly'
    }

    const loc = getUrlForLocale(currentLocale, subPath)

    return { loc, changefreq, priority, alternateRefs }
  },
}
