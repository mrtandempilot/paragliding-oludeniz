import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
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

// Base query for "every published article in this locale" — reused by both
// the keyword-overlap pass and the recency fallback below.
function localeArticlesQuery(locale: string) {
  const q = supabase
    .from('articles')
    .select('slug, title, meta_description, hero_image_url')
    .eq('status', 'published')
  return locale === 'en' ? q.not('slug', 'like', 'i18n-%') : q.like('slug', `i18n-${locale}-%`)
}

function toRelatedItem(row: any) {
  const m = row.slug.match(/^i18n-(tr|de|ru)-(.+)$/)
  const urlSlug = m ? m[2] : row.slug
  return { urlSlug, title: row.title, description: row.meta_description, image: row.hero_image_url }
}

// SEO audit (Aug 2026) flagged that 63 blog articles almost never link to
// each other — this is the fix: 3 same-locale related articles per post,
// ranked by shared `keywords`, backfilled with the most recent articles in
// the same locale when there's no overlap. Never recommends the article
// itself or another locale's version of it.
async function getRelatedArticles(locale: string, currentSlug: string, keywords: string[] | null) {
  const currentDbSlug = dbSlug(locale, currentSlug)
  const kws = (keywords || []).filter(Boolean)

  let picks: any[] = []
  if (kws.length > 0) {
    const { data } = await localeArticlesQuery(locale)
      .neq('slug', currentDbSlug)
      .overlaps('keywords', kws)
      .limit(3)
    picks = data || []
  }

  if (picks.length < 3) {
    const seen = new Set(picks.map(p => p.slug))
    const { data: recent } = await localeArticlesQuery(locale)
      .neq('slug', currentDbSlug)
      .order('published_at', { ascending: false })
      .limit(3 + seen.size)
    for (const row of recent || []) {
      if (picks.length >= 3) break
      if (seen.has(row.slug)) continue
      picks.push(row)
      seen.add(row.slug)
    }
  }

  return picks.slice(0, 3).map(toRelatedItem)
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

  const related = await getRelatedArticles(locale, slug, article.keywords)

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
      {related.length > 0 && (
        <section className="section-padding bg-slate-50 border-t border-slate-200">
          <div className="container-default max-w-3xl">
            <h2 className="text-xl font-bold text-slate-900 mb-6">{t('related')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map(a => (
                <Link
                  key={a.urlSlug}
                  href={locale === 'en' ? `/blog/${a.urlSlug}` : `/${locale}/blog/${a.urlSlug}`}
                  className="group block bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {a.image && (
                    <div className="relative w-full h-36">
                      <Image
                        src={a.image}
                        alt={a.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors">
                      {a.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <BookingCTA />
    </>
  )
}
