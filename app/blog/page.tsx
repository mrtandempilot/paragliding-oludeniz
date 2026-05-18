import type { Metadata } from 'next'
import Link from 'next/link'
import { Clock, ArrowRight } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import { blogPosts, getBlogCategories } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Paragliding Ölüdeniz Blog | Guides, Tips & Expert Advice',
  description:
    'Expert paragliding guides, Babadağ tips, weather advice, and local knowledge from the Ölüdeniz flying community. Updated regularly.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/blog' },
}

export default function BlogPage() {
  const categories = getBlogCategories()

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
          {blogPosts[0] && (
            <div className="mb-12">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Featured Article</h2>
              <Link href={`/blog/${blogPosts[0].slug}`}
                className="group grid grid-cols-1 md:grid-cols-2 gap-6 card overflow-hidden hover:shadow-lg transition-all">
                <div
                  className="aspect-video md:aspect-auto bg-cover bg-center min-h-48"
                  style={{ backgroundImage: `url('${blogPosts[0].image}')` }}
                />
                <div className="p-6 flex flex-col justify-center">
                  <span className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-2">
                    {blogPosts[0].category}
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-orange-600 transition-colors">
                    {blogPosts[0].title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-4">{blogPosts[0].description}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{blogPosts[0].readTime}</span>
                    <span>{new Date(blogPosts[0].date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-1 text-orange-500 font-medium text-sm mt-4">
                    Read article <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* All Posts Grid */}
          <h2 className="text-xl font-bold text-slate-900 mb-6">All Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.slice(1).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}
                className="group card overflow-hidden hover:shadow-md transition-all hover:-translate-y-1">
                <div
                  className="aspect-video bg-cover bg-center"
                  style={{ backgroundImage: `url('${post.image}')` }}
                />
                <div className="p-5">
                  <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">
                    {post.category}
                  </span>
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
