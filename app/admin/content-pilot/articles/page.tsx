import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { BookOpen, ExternalLink, ArrowLeft } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function ArticlesPage() {
  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })

  const all = articles || []
  const published = all.filter(a => a.status === 'published').length
  const drafts = all.filter(a => a.status === 'draft').length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/content-pilot" className="text-slate-400 hover:text-slate-700">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-sky-600" />
            AI Articles
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {all.length} total · {published} published · {drafts} drafts
          </p>
        </div>
      </div>

      {all.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-16 text-center">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <p className="text-slate-500 font-medium">No articles yet</p>
          <p className="text-slate-400 text-sm mt-1">Run ContentPilot to generate your first SEO article.</p>
          <Link
            href="/admin/content-pilot"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
          >
            Go to ContentPilot →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Words</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {all.map(article => (
                  <tr key={article.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-900 line-clamp-1">{article.title}</p>
                        {article.meta_description && (
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{article.meta_description}</p>
                        )}
                        {article.keywords?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {article.keywords.slice(0, 3).map((kw: string) => (
                              <span key={kw} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                                {kw}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {article.word_count ? `${article.word_count.toLocaleString()}` : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        article.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {article.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs whitespace-nowrap">
                      {new Date(article.created_at).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {article.slug && (
                          <a
                            href={`/blog/${article.slug}`}
                            target="_blank"
                            className="text-slate-400 hover:text-purple-600 transition-colors"
                            title="View article"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        {article.hero_image_url && (
                          <a
                            href={article.hero_image_url}
                            target="_blank"
                            className="text-slate-400 hover:text-sky-600 transition-colors text-xs"
                            title="View image"
                          >
                            🖼️
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
