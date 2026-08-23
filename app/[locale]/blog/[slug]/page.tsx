import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeUrl } from '@/lib/seo'
import { renderArticleHtml } from '@/lib/markdown'

export const revalidate = 300

// Non-English translations are stored as regular rows in the SAME `articles`
// table, distinguished only by a slug prefix (e.g. "i18n-tr-..."). This
// avoids a DB schema change — see agents/translate.ts. The URL segment stays
// clean (no visible prefix); we only prepend it when querying the DB.
function dbSlug(locale: string, urlSlug: string) {
  return locale === 'en' ? urlSlug : `i18n-${locale}-${urlSlug}`
}

// Reused across the homepage (app/[locale]/page.tsx) and here so og:locale
// always matches the page's actual language instead of defaulting to English.
const OG_LOCALE: Record<string, string> = { en: 'en_US', tr: 'tr_TR', de: 'de_DE', ru: 'ru_RU' }

async function getArticle(locale: string, slug: string) {
  try {
    const { data } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', dbSlug(locale, slug))
      .eq('status', 'published')
      .single()
    return data
  } catch {
    return null
  }
}

// Translated articles have a different slug per locale (not a literal
// translation of the URL), so cross-locale hreflang can't be built from the
// current path the way static pages do (localeAlternates assumes the same
// path in every locale). Instead we look up every published row sharing the
// same topic_id and derive each locale's real URL slug from its DB slug.
// Only locales that actually have a translation are included — we never
// assume one exists.
async function getBlogAlternates(locale: string, slug: string, topicId: string | null): Promise<Metadata['alternates']> {
  const selfUrl = localeUrl(locale, `/blog/${slug}`)
  if (!topicId) return { canonical: selfUrl }

  const { data } = await supabase
    .from('articles')
    .select('slug')
    .eq('topic_id', topicId)
    .eq('status', 'published')

  const languages: Record<string, string> = {}
  for (const row of data || []) {
    const m = row.slug.match(/^i18n-(tr|de|ru)-(.+)$/)
    const loc = m ? m[1] : 'en'
    const urlSlug = m ? m[2] : row.slug
    languages[loc] = localeUrl(loc, `/blog/${urlSlug}`)
  }
  if (languages.en) languages['x-default'] = languages.en

  return {
    canonical: selfUrl,
    languages: Object.keys(languages).length > 1 ? languages : undefined,
  }
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params
  const article = await getArticle(locale, slug)
  const alternates = await getBlogAlternates(locale, slug, article?.topic_id ?? null)
  return {
    title: article ? article.title : 'Blog',
    description: article?.meta_description || undefined,
    alternates,
    openGraph: {
      locale: OG_LOCALE[locale] || 'en_US',
      url: localeUrl(locale, `/blog/${slug}`),
      title: article ? article.title : 'Blog | Atmos Paragliding',
      description: article?.meta_description || undefined,
    },
    twitter: { card: 'summary_large_image', description: article?.meta_description || undefined },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  const t = await getTranslations({ locale, namespace: 'blog' })
  const article = await getArticle(locale, slug)

  if (!article) notFound()

  const articleUrl = localeUrl(locale, `/blog/${slug}`)
  const blogSchema = article ? {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.meta_description || '',
    image: article.hero_image_url || '',
    datePublished: article.published_at || article.created_at,
    dateModified: article.published_at || article.created_at,
    url: articleUrl,
    mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
    author: { '@type': 'Person', name: 'Ceyhun', url: localeUrl('en', '/about-us') },
    publisher: { '@type': 'Organization', name: 'Atmos Paragliding', url: localeUrl('en', '/') },
  } : null

  // Note: BreadcrumbNav (rendered below) already emits its own BreadcrumbList
  // JSON-LD schema matching the visible breadcrumb — no need to duplicate it here.

  // article.schema_markup (DB) is written by ContentPilot and is only ever
  // meant to supply Q&A (FAQPage) markup — never a second content-describing
  // node. Some batches accidentally also generated an Article/BlogPosting
  // node inside it (with placeholder dates and an inconsistent publisher
  // name, "Atmosparagliding" vs "Atmos Paragliding"), which duplicated and
  // conflicted with blogSchema above. Strip any such node before rendering
  // so blogSchema stays the single source of truth for who/when/publisher.
  const CONTENT_NODE_TYPES = new Set(['Article', 'BlogPosting', 'NewsArticle'])
  function stripDuplicateContentNode(raw: any): any {
    if (!raw) return null
    if (Array.isArray(raw['@graph'])) {
      const kept = raw['@graph'].filter((node: any) => !CONTENT_NODE_TYPES.has(node?.['@type']))
      if (kept.length === 0) return null
      if (kept.length === 1) return { '@context': raw['@context'] || 'https://schema.org', ...kept[0] }
      return { '@context': raw['@context'] || 'https://schema.org', '@graph': kept }
    }
    if (CONTENT_NODE_TYPES.has(raw['@type'])) return null
    return raw
  }
  const faqSchema = stripDuplicateContentNode(article.schema_markup)

  return (
    <>
      {blogSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <PageHero title={article.title} subtitle={article.excerpt || ''} size="sm" bgImage={article.hero_image_url || 'https://v3b.fal.media/files/b/0a9d7c0c/Dn0br3flHariTrqYqhISR.jpg'} />
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3">
          <BreadcrumbNav items={[{ label: t('title'), href: locale === 'en' ? '/blog' : `/${locale}/blog` }, { label: article.title }]} />
        </div>
      </div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          {article.hero_image_url && (
            <div className="relative w-full h-[360px] sm:h-[480px] rounded-xl overflow-hidden mb-8">
              <Image
                src={article.hero_image_url}
                alt={article.hero_image_alt || article.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
          )}
          <article
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: renderArticleHtml(article.content || '') }}
          />
        </div>
      </section>
      <BookingCTA />
    </>
  )
}
