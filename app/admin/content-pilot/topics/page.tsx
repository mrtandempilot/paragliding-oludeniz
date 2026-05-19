import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { Target, ArrowLeft } from 'lucide-react'
import AddTopicForm from './AddTopicForm'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function TopicsPage() {
  const { data: topics } = await supabase
    .from('topics')
    .select('*')
    .order('priority', { ascending: false })

  const all = topics || []
  const pending = all.filter(t => t.status === 'pending')
  const used = all.filter(t => t.status === 'used')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/content-pilot" className="text-slate-400 hover:text-slate-700">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <Target className="w-6 h-6 text-purple-600" />
              SEO Topics
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {pending.length} pending · {used.length} used
            </p>
          </div>
        </div>
      </div>

      {/* Add topic form */}
      <AddTopicForm />

      {/* Pending topics */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-purple-50">
          <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full" />
            Pending ({pending.length})
          </h2>
        </div>

        {pending.length === 0 ? (
          <div className="p-10 text-center text-slate-400 text-sm">
            No pending topics. Add some above — the agent picks the highest priority one each run.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pending.map(topic => (
              <div key={topic.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900">{topic.title}</p>
                  {topic.keywords?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {topic.keywords.map((kw: string) => (
                        <span key={kw} className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-100">
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{topic.priority}</div>
                    <div className="text-xs text-slate-400">priority</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Used topics */}
      {used.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h2 className="font-bold text-slate-500 text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-slate-400 rounded-full" />
              Used ({used.length})
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {used.map(topic => (
              <div key={topic.id} className="px-6 py-4 flex items-center justify-between gap-4 opacity-60">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-700 line-through">{topic.title}</p>
                  {topic.used_at && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      Used {new Date(topic.used_at).toLocaleDateString('tr-TR')}
                    </p>
                  )}
                </div>
                <span className="text-xs bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full font-medium">used</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
