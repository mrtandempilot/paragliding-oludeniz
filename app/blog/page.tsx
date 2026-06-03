import type { Metadata } from 'next'
import Link from 'next/link'
import { Clock, ArrowRight } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import { blogPosts } from '@/lib/blog'
import { createClient } from '@supabase/supabase-js'

export const revalidate = 3600 // ISR — her saat güncelle

export const metadata: Metadata = {
  title: 'Paragliding Ölüdeniz Blog | Guides, Tips & Expert Advice',
  description:
    'Expert paragliding guides, Babadağ tips, weather advice, and local knowledge from the Ölüdeniz flying community. Updated regularly.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/blog' },
}

async function getArticles() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data } = await supabase
      .from('articles')
      .select('slug, title, meta_description, hero_image_url, word_count, created_at, status')
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    return (data || []).map(a => ({
      slug: a.slug,
      title: a.title,
      description: a.meta_description || '',
      date: a.created_at,
      category: 'AI Guide',
      readTime: a.word_count ? `${Math.ceil(a.word_count / 200)} min read` : '6 min read',
      image: a.hero_image_url || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80',
      source: 'ai' as const,
    }))
  } catch {
    return []
  }
}

export default async function BlogPage() {
  const aiArticles = await getArticles()

  // Statik yazıları da dahil et, AI yazılarını öne al
  const staticPosts = blogPosts.map(p => ({ ...p, source: 'static' as const }))
  const allPosts = [...aiArticles, ...staticPosts]

  const categories = ['All', ...Array.from(new Set(allPosts.map(p => p.category)))]

  return (
    <>
      <PageHero
        title="Paragliding Ölüdeniz Blog"
        subtitle="Expert guides, local knowledge, weather tips and everything paragliding in Ölüdeniz and Babadağ."
        size="sm"
      />

      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3">
          <BreadcrumbNav items={[{ label: 'Blog' }]} />
        </div>
      </div>

      <section className="section-padding bg-white">
        <div className="container-default">
          {/* Featured Post */}
          {allPosts[0] && (
            <div className="mb-12">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Featured Article</h2>
              <Link href={`/blog/${allPosts[0].slug}`}
                className="group grid grid-cols-1 md:grid-cols-2 gap-6 card overflow-hidden hover:shadow-lg transition-all">
                <div
                  className="aspect-video md:aspect-auto bg-cover bg-center min-h-48"
                  style={{ backgroundImage: `url('${allPosts[0].image}')` }}
                />
                <div className="p-6 flex flex-col justify-center">
                  <span className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-2">
                    {allPosts[0].category}
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-orange-600 transition-colors">
                    {allPosts[0].title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-4">{allPosts[0].description}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{allPosts[0].readTime}</span>
                    <span>{new Date(allPosts[0].date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-1 text-orange-500 font-medium text-sm mt-4">
                    Read article <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* All Posts Grid */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">All Articles</h2>
            <span className="text-sm text-slate-400">{allPosts.length} articles</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPosts.slice(1).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}
                className="group card overflow-hidden hover:shadow-md transition-all hover:-translate-y-1">
                <div
                  className="aspect-video bg-cover bg-center"
                  style={{ backgroundImage: `url('${post.image}')` }}
                />
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">
                      {post.category}
                    </span>
                    {post.source === 'ai' && (
                      <span className="text-xs bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded font-medium">AI</span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 mt-1 mb-2 leading-snug group-hover:text-orange-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 text-sm line-clamp-2 mb-3">{post.description}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                    <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
