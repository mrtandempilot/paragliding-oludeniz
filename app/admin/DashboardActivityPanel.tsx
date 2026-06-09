'use client'

import Image from 'next/image'
import { FileText, Instagram, ExternalLink, Clock } from 'lucide-react'

interface Article {
  id: string
  title: string
  slug: string
  image_url?: string
  created_at: string
  status: string
}

interface InstaPost {
  id: string
  image_url?: string
  caption?: string
  post_type?: string
  posted_at?: string
  instagram_id?: string
}

interface Props {
  articles: Article[]
  instaPosts: InstaPost[]
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins} dk önce`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} sa önce`
  return `${Math.floor(hrs / 24)} gün önce`
}

export default function DashboardActivityPanel({ articles, instaPosts }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
        <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center">
          <Clock className="w-4 h-4 text-slate-500" />
        </div>
        <h2 className="font-bold text-slate-900">Son Aktiviteler</h2>
      </div>

      <div className="divide-y divide-slate-50">
        {/* Blog Articles */}
        <div className="px-5 py-3">
          <div className="flex items-center gap-1.5 mb-3">
            <FileText className="w-3.5 h-3.5 text-purple-500" />
            <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Son Makaleler</p>
          </div>
          <div className="space-y-2.5">
            {articles.length === 0 && (
              <p className="text-xs text-slate-400">Henüz makale yok</p>
            )}
            {articles.map(a => (
              <div key={a.id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                  {a.image_url ? (
                    <img src={a.image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="w-4 h-4 text-slate-300" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{a.title}</p>
                  <p className="text-xs text-slate-400">{timeAgo(a.created_at)}</p>
                </div>
                <a
                  href={`/blog/${a.slug}`}
                  target="_blank"
                  className="text-slate-300 hover:text-slate-600 transition-colors flex-shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Instagram Posts */}
        <div className="px-5 py-3">
          <div className="flex items-center gap-1.5 mb-3">
            <Instagram className="w-3.5 h-3.5 text-pink-500" />
            <p className="text-xs font-semibold text-pink-600 uppercase tracking-wide">Son Instagram</p>
          </div>
          <div className="space-y-2.5">
            {instaPosts.length === 0 && (
              <p className="text-xs text-slate-400">Henüz post yok</p>
            )}
            {instaPosts.map(p => (
              <div key={p.id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                  {p.image_url ? (
                    <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Instagram className="w-4 h-4 text-slate-300" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 truncate">{p.caption?.slice(0, 50) || '—'}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded-full font-medium">
                      {p.post_type || 'image'}
                    </span>
                    <span className="text-xs text-slate-400">{p.posted_at ? timeAgo(p.posted_at) : '—'}</span>
                  </div>
                </div>
                {p.instagram_id && (
                  <a
                    href={`https://instagram.com/p/${p.instagram_id}`}
                    target="_blank"
                    className="text-slate-300 hover:text-pink-400 transition-colors flex-shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
