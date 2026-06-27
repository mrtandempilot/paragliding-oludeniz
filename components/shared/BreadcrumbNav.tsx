import { Link } from '@/i18n/navigation'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[]
}

export default function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  const allItems = [{ label: 'Home', href: '/' }, ...items]

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href ? `https://atmosparagliding.com${item.href}` : undefined,
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
