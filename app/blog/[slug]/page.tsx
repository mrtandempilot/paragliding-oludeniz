import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Clock, ArrowLeft, ArrowRight } from 'lucide-react'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { blogPosts, getBlogPost } from '@/lib/blog'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getBlogPost(params.slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `https://paragliding-oludeniz.com/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      images: [{ url: post.image, width: 1200, height: 630 }],
    },
  }
}

export default function BlogPostPage({ params }: Props) {
  const post = getBlogPost(params.slug)
  if (!post) notFound()

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
    author: {
      '@type': 'Organization',
      name: 'Paragliding Ölüdeniz',
      url: 'https://paragliding-oludeniz.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Paragliding Ölüdeniz',
      logo: {
        '@type': 'ImageObject',
        url: 'https://paragliding-oludeniz.com/images/logo.png',
      },
    },
  }

  // Simple markdown-ish content renderer
  const renderContent = (content: string) => {
    return content
      .trim()
      .split('\n\n')
      .map((block, i) => {
        if (block.startsWith('## ')) {
          return <h2 key={i} className="text-2xl font-bold text-slate-900 mt-10 mb-4">{block.replace('## ', '')}</h2>
        }
        if (block.startsWith('### ')) {
          return <h3 key={i} className="text-xl font-bold text-slate-900 mt-8 mb-3">{block.replace('### ', '')}</h3>
        }
        if (block.startsWith('**') && block.includes('**:')) {
          const parts = block.split('\n').map((line, j) => {
            if (line.startsWith('**')) {
              const match = line.match(/\*\*(.+?)\*\*(.*)/)
              if (match) return <p key={j} className="mb-2"><strong className="text-slate-900">{match[1]}</strong>{match[2]}</p>
            }
            return <p key={j} className="text-slate-600 mb-2">{line}</p>
          })
          return <div key={i} className="mb-4">{parts}</div>
        }
        if (block.startsWith('- ') || block.includes('\n- ')) {
          const items = block.split('\n').filter(l => l.startsWith('- '))
          return (
            <ul key={i} className="list-disc list-inside space-y-2 my-4 text-slate-600">
              {items.map((item, j) => <li key={j}>{item.replace('- ', '')}</li>)}
            </ul>
          )
        }
        if (block.includes('|') && block.includes('\n')) {
          const rows = block.split('\n').filter(r => r.includes('|') && !r.match(/^[\|\-\s]+$/))
          if (rows.length > 1) {
            return (
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
        }
        return <p key={i} className="text-slate-700 leading-relaxed mb-4">{block}</p>
      })
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero Image */}
      <div className="relative h-72 md:h-96 mt-16 md:mt-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${post.image}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="container-default">
            <span className="inline-block bg-orange-500 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
              {post.category}
            </span>
            <h1 className="text-2xl md:text-4xl font-bold text-white max-w-3xl text-balance">
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3">
          <BreadcrumbNav items={[{ label: 'Blog', href: '/blog' }, { label: post.title }]} />
        </div>
      </div>

      {/* Article */}
      <article className="section-padding bg-white">
        <div className="container-default">
          <div className="max-w-3xl mx-auto">
            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-slate-500 mb-8 pb-6 border-b border-slate-100">
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{post.readTime}</span>
              <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span>By Paragliding Ölüdeniz Team</span>
            </div>

            {/* Content */}
            <div className="prose-custom">
              {renderContent(post.content)}
            </div>

            {/* CTA */}
            <div className="mt-12">
              <BookingCTA title="Ready to Fly?" subtitle="Book your tandem paragliding flight in Ölüdeniz. Free cancellation. Certified pilots." />
            </div>

            {/* Prev/Next */}
            <div className="mt-10 pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevPost && (
                <Link href={`/blog/${prevPost.slug}`}
                  className="card p-4 hover:shadow-md transition-all group">
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                    <ArrowLeft className="w-4 h-4" /> Previous
                  </div>
                  <p className="font-semibold text-slate-900 text-sm group-hover:text-orange-600 transition-colors leading-snug">
                    {prevPost.title}
                  </p>
                </Link>
              )}
              {nextPost && (
                <Link href={`/blog/${nextPost.slug}`}
                  className="card p-4 hover:shadow-md transition-all group sm:text-right">
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-2 sm:justify-end">
                    Next <ArrowRight className="w-4 h-4" />
                  </div>
                  <p className="font-semibold text-slate-900 text-sm group-hover:text-orange-600 transition-colors leading-snug">
                    {nextPost.title}
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
