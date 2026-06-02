import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Clock, ArrowLeft, ArrowRight } from 'lucide-react'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { blogPosts, getBlogPost } from '@/lib/blog'
import { createClient } from '@supabase/supabase-js'

export const revalidate = 3600

interface Props {
  params: { slug: string }
}

async function getArticleFromSupabase(slug: string) {
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

async function getAllSlugs() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data } = await supabase
      .from('articles')
      .select('slug')
      .eq('status', 'published')
    return (data || []).map(a => ({ slug: a.slug }))
  } catch {
    return []
  }
}

export async function generateStaticParams() {
  const staticSlugs = blogPosts.map(post => ({ slug: post.slug }))
  const aiSlugs = await getAllSlugs()
  return [...staticSlugs, ...aiSlugs]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Önce Supabase'e bak
  const aiArticle = await getArticleFromSupabase(params.slug)
  if (aiArticle) {
    return {
      title: aiArticle.meta_title || aiArticle.title,
      description: aiArticle.meta_description,
      alternates: { canonical: `https://paragliding-oludeniz.com/blog/${params.slug}` },
      openGraph: {
        title: aiArticle.meta_title || aiArticle.title,
        description: aiArticle.meta_description,
        images: aiArticle.hero_image_url ? [{ url: aiArticle.hero_image_url, width: 1200, height: 630 }] : [],
      },
    }
  }

  // Statik dosyaya bak
  const post = getBlogPost(params.slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `https://paragliding-oludeniz.com/blog/${params.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      images: [{ url: post.image, width: 1200, height: 630 }],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  // 1. Supabase'den dene
  const aiArticle = await getArticleFromSupabase(params.slug)

  // 2. Statik dosyadan dene
  const staticPost = getBlogPost(params.slug)

  if (!aiArticle && !staticPost) notFound()

  // AI makalesini göster
  if (aiArticle) {
    const wordCount = aiArticle.word_count || 0
    const readTime = wordCount ? `${Math.ceil(wordCount / 200)} min read` : '6 min read'

    const jsonLd = {
      '@context': 'https://schema.org',
      ...(aiArticle.schema_markup || {
        '@type': 'Article',
        headline: aiArticle.title,
        description: aiArticle.meta_description,
        image: aiArticle.hero_image_url,
        datePublished: aiArticle.created_at,
      }),
    }

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        {/* Hero Image */}
        <div className="relative h-72 md:h-96 mt-16 md:mt-20">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${aiArticle.hero_image_url || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80'}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div className="container-default">
              <span className="inline-block bg-orange-500 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                Guide
              </span>
              <h1 className="text-2xl md:text-4xl font-bold text-white max-w-3xl text-balance">
                {aiArticle.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="bg-slate-50 border-b border-slate-200">
          <div className="container-default py-3">
            <BreadcrumbNav items={[{ label: 'Blog', href: '/blog' }, { label: aiArticle.title }]} />
          </div>
        </div>

        {/* Article */}
        <article className="section-padding bg-white">
          <div className="container-default">
            <div className="max-w-3xl mx-auto">
              {/* Meta */}
              <div className="flex items-center gap-4 text-sm text-slate-500 mb-8 pb-6 border-b border-slate-100">
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{readTime}</span>
                <span>{new Date(aiArticle.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <span>By Paragliding Ölüdeniz Team</span>
              </div>

              {/* Content */}
              <div className="prose-custom">
                {renderContent(aiArticle.content)}
              </div>

              {/* CTA */}
              <div className="mt-12">
                <BookingCTA title="Ready to Fly?" subtitle="Book your tandem paragliding flight in Ölüdeniz. Free cancellation. Certified pilots." />
              </div>

              <div className="mt-8">
                <Link href="/blog" className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium text-sm">
                  <ArrowLeft className="w-4 h-4" /> Back to Blog
                </Link>
              </div>
            </div>
          </div>
        </article>
      </>
    )
  }

  // Statik makale göster (orijinal tasarım)
  const post = staticPost!
  const postIndex = blogPosts.findIndex((p) => p.slug === params.slug)
  const prevPost = postIndex > 0 ? blogPosts[postIndex - 1] : null
  const nextPost = postIndex < blogPosts.length - 1 ? blogPosts[postIndex + 1] : null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: post.image,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: 'Paragliding Ölüdeniz', url: 'https://paragliding-oludeniz.com' },
    publisher: { '@type': 'Organization', name: 'Paragliding Ölüdeniz', logo: { '@type': 'ImageObject', url: 'https://paragliding-oludeniz.com/images/logo.png' } },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="relative h-72 md:h-96 mt-16 md:mt-20">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${post.image}')` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="container-default">
            <span className="inline-block bg-orange-500 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">{post.category}</span>
            <h1 className="text-2xl md:text-4xl font-bold text-white max-w-3xl text-balance">{post.title}</h1>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3">
          <BreadcrumbNav items={[{ label: 'Blog', href: '/blog' }, { label: post.title }]} />
        </div>
      </div>

      <article className="section-padding bg-white">
        <div className="container-default">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 text-sm text-slate-500 mb-8 pb-6 border-b border-slate-100">
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{post.readTime}</span>
              <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span>By Paragliding Ölüdeniz Team</span>
            </div>
            <div className="prose-custom">{renderContent(post.content)}</div>
            <div className="mt-12"><BookingCTA title="Ready to Fly?" subtitle="Book your tandem paragliding flight in Ölüdeniz. Free cancellation. Certified pilots." /></div>
            <div className="mt-10 pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevPost && (
                <Link href={`/blog/${prevPost.slug}`} className="card p-4 hover:shadow-md transition-all group">
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-2"><ArrowLeft className="w-4 h-4" /> Previous</div>
                  <p className="font-semibold text-slate-900 text-sm group-hover:text-orange-600 transition-colors leading-snug">{prevPost.title}</p>
                </Link>
              )}
              {nextPost && (
                <Link href={`/blog/${nextPost.slug}`} className="card p-4 hover:shadow-md transition-all group sm:text-right">
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-2 sm:justify-end">Next <ArrowRight className="w-4 h-4" /></div>
                  <p className="font-semibold text-slate-900 text-sm group-hover:text-orange-600 transition-colors leading-snug">{nextPost.title}</p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </article>
    </>
  )
}

// Markdown renderer
function renderContent(content: string) {
  return content.trim().split('\n\n').map((block, i) => {
    if (block.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold text-slate-900 mt-10 mb-4">{block.replace('## ', '')}</h2>
    if (block.startsWith('### ')) return <h3 key={i} className="text-xl font-bold text-slate-900 mt-8 mb-3">{block.replace('### ', '')}</h3>
    if (block.startsWith('- ') || block.includes('\n- ')) {
      const items = block.split('\n').filter(l => l.startsWith('- '))
      return <ul key={i} className="list-disc list-inside space-y-2 my-4 text-slate-600">{items.map((item, j) => <li key={j}>{item.replace('- ', '')}</li>)}</ul>
    }
    if (block.includes('|') && block.includes('\n')) {
      const rows = block.split('\n').filter(r => r.includes('|') && !r.match(/^[\|\-\s]+$/))
      if (rows.length > 1) return (
        <div key={i} className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            {rows.map((row, j) => {
              const cells = row.split('|').filter(c => c.trim())
              if (j === 0) return <thead key={j}><tr>{cells.map((c, k) => <th key={k} className="text-left px-3 py-2 bg-slate-100 border border-slate-200 font-semibold text-slate-700">{c.trim()}</th>)}</tr></thead>
              return <tbody key={j}><tr>{cells.map((c, k) => <td key={k} className="px-3 py-2 border border-slate-200 text-slate-600">{c.trim()}</td>)}</tr></tbody>
            })}
          </table>
        </div>
      )
    }
    return <p key={i} className="text-slate-700 leading-relaxed mb-4">{block}</p>
  })
}
