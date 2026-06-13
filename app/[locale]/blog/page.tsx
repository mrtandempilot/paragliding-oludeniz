import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, ArrowRight } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import { blogPosts } from '@/lib/blog'
import { supabase } from '@/lib/supabase'
import { getTranslations } from 'next-intl/server'
import { localeAlternates } from '@/lib/seo'

export const revalidate = 300

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blog' })
  const d: Record<string, string> = {
    en: 'Paragliding news, guides and stories from Oludeniz — flight tips, Babadağ conditions, travel advice and more from local tandem pilots.',
    tr: "Ölüdeniz'den yamaç paraşütü haberleri, rehberler ve hikayeler — uçuş ipuçları, Babadağ koşulları ve yerel pilotlardan tavsiyeler.",
    de: 'Paragliding-News, Guides und Geschichten aus Ölüdeniz — Flugtipps, Babadağ-Bedingungen und Reisetipps von lokalen Tandempiloten.',
    ru: 'Новости, гиды и истории о парапланеризме из Олюдениза — советы по полётам, условия на Бабадаге и рекомендации местных пилотов.',
  }
  return {
    description: d[locale] || d.en,
    title: `${t('title')} | Paragliding Ölüdeniz`,
    alternates: localeAlternates(locale, '/blog'),
    openGraph: { url: localeAlternates(locale, '/blog').canonical! },
  }
}

async function getArticles() {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('slug, title, meta_description, published_at, word_count, hero_image_url, hero_image_alt')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(30)

    if (error) {
      console.error('[Blog] Supabase error:', error.message, error.code)
      return []
    }

    return (data || []).map((a: any) => ({
      ...a,
      excerpt: a.meta_description,
      read_time: a.word_count ? `${Math.max(1, Math.round(a.word_count / 200))} min read` : '5 min read',
    }))
  } catch (err) {
    console.error('[Blog] Unexpected error fetching articles:', err)
    return []
  }
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blog' })
  const articles = await getArticles()
  const posts = articles.length > 0 ? articles : blogPosts || []

  return (
    <>
      <PageHero title={t('title')} subtitle={t('subtitle')} badge={t('badge')} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c0c/Dn0br3flHariTrqYqhISR.jpg" />
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3">
          <BreadcrumbNav items={[{ label: t('title') }]} />
        </div>
      </div>
      <section className="section-padding bg-white">
        <div className="container-default">
          {posts.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <p className="text-lg">No articles yet — check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post: any) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="card overflow-hidden group hover:shadow-lg transition-shadow">
                  {post.hero_image_url && (
                    <div className="aspect-[16/9] overflow-hidden relative">
                      <Image
                        src={post.hero_image_url}
                        alt={post.hero_image_alt || post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    {post.category && (
                      <span className="text-xs font-semibold text-orange-500 uppercase tracking-wider">{post.category}</span>
                    )}
                    <h2 className="text-lg font-bold text-slate-900 mt-2 mb-3 group-hover:text-orange-600 transition-colors">{post.title}</h2>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{post.read_time || '5 min'}</span>
                      </div>
                      <span className="text-orange-500 font-medium flex items-center gap-1">
                        Read <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
