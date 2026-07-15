import { Link } from '@/i18n/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { getLocale } from 'next-intl/server'
import { localeUrl } from '@/lib/seo'

const HOME_LABEL: Record<string, string> = {
  en: 'Home',
  tr: 'Ana Sayfa',
  de: 'Startseite',
  ru: '\u0413\u043b\u0430\u0432\u043d\u0430\u044f',
}

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[]
}

export default async function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  const locale = await getLocale()
  const homeLabel = HOME_LABEL[locale] || HOME_LABEL.en
  const allItems = [{ label: homeLabel, href: '/' }, ...items]

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href ? localeUrl(locale, item.href) : undefined,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-slate-500 flex-wrap">
        {allItems.map((item, index) => (
          <span key={index} className="flex items-center gap-1.5">
            {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />}
            {index === 0 && <Home className="w-3.5 h-3.5" />}
            {item.href && index < allItems.length - 1 ? (
              <Link href={item.href} className="hover:text-orange-600 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={index === allItems.length - 1 ? 'text-slate-700 font-medium' : ''}>
                {item.label}
              </span>
            )}
          </span>
        ))}
      </nav>
    </>
  )
}
