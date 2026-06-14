import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@supabase/supabase-js'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

async function getArticle(slug: string) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()
    return data
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params
  const article = await getArticle(slug)
  return {
    title: article ? article.title : 'Blog',
    description: article?.meta_description || undefined,
    alternates: localeAlternates(locale, `/blog/${slug}`),
    openGraph: { url: localeUrl(locale, `/blog/${slug}`), title: article ? article.title : 'Blog | Paragliding Oludeniz', description: article?.meta_description || undefined },
    twitter: { card: 'summary_large_image', description: article?.meta_description || undefined },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  const t = await getTranslations({ locale, namespace: 'blog' })
  const article = await getArticle(slug)

  if (!article) notFound()

  const articleUrl = `https://paragliding-oludeniz.com/${locale}/blog/${slug}`
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
    author: { '@type': 'Person', name: 'Ceyhun', url: 'https://paragliding-oludeniz.com/en/about-us' },
    publisher: { '@type': 'Organization', name: 'Paragliding Oludeniz', url: 'https://paragliding-oludeniz.com' },
  } : null

  return (
    <>
      {blogSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
        />
      )}
      <PageHero title={article.title} subtitle={article.excerpt || ''} size="sm" bgImage={article.hero_image_url || 'https://v3b.fal.media/files/b/0a9d7c0c/Dn0br3flHariTrqYqhISR.jpg'} />
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3">
          <BreadcrumbNav items={[{ label: t('title'), href: '/blog' }, { label: article.title }]} />
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
            dangerouslySetInnerHTML={{ __html: article.content || '' }}
          />
        </div>
      </section>
      <BookingCTA />
    </>
  )
}
