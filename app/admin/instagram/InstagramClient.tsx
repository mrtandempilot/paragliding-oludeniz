'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Plus, Sparkles, Edit2, Trash2, Send, Clock, CheckCircle, XCircle,
  X, Loader2, Instagram, Calendar, Hash, Image as ImageIcon,
  AlignLeft, Upload, Film, BookImage, Tv2, LayoutGrid, List,
  MoreHorizontal, RefreshCw, BarChart2, Eye, Heart, Users, Bookmark, Share2,
} from 'lucide-react'
import type { InstagramPost } from '@/lib/supabase'

type PostType = 'image' | 'reel' | 'story' | 'carousel'
type ViewMode = 'grid' | 'list'

const POST_TYPES: { type: PostType; label: string; icon: React.ReactNode; desc: string }[] = [
  { type: 'image',    label: 'Photo',    icon: <ImageIcon className="w-4 h-4" />, desc: 'Tek fotoğraf' },
  { type: 'reel',     label: 'Reel',     icon: <Film className="w-4 h-4" />,      desc: 'Kısa video' },
  { type: 'story',    label: 'Story',    icon: <Tv2 className="w-4 h-4" />,       desc: 'Hikaye' },
  { type: 'carousel', label: 'Carousel', icon: <BookImage className="w-4 h-4" />, desc: '2–10 fotoğraf' },
]

const POST_TYPE_COLORS: Record<string, string> = {
  image:    'bg-orange-100 text-orange-700',
  reel:     'bg-purple-100 text-purple-700',
  story:    'bg-sky-100 text-sky-700',
  carousel: 'bg-green-100 text-green-700',
}

const STATUS_COLORS: Record<string, string> = {
  draft:     'bg-slate-100 text-slate-500',
  scheduled: 'bg-blue-100 text-blue-700',
  posted:    'bg-green-100 text-green-700',
  failed:    'bg-red-100 text-red-700',
}

const STATUS_ICONS: Record<string, React.ReactNode> = {
  draft:     <Edit2 className="w-3 h-3" />,
  scheduled: <Clock className="w-3 h-3" />,
  posted:    <CheckCircle className="w-3 h-3" />,
  failed:    <XCircle className="w-3 h-3" />,
}

const TONE_OPTIONS = [
  'Exciting & Inspiring',
  'Calm & Scenic',
  'Adventure Calling',
  'First-timer Friendly',
  'Professional & Trustworthy',
]

export default function InstagramClient({ posts: initial }: { posts: InstagramPost[] }) {
  const [posts, setPosts] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [editPost, setEditPost] = useState<InstagramPost | null>(null)
  const [generating, setGenerating] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [mainTab, setMainTab] = useState<'posts' | 'analytics'>('posts')
  const [insights, setInsights] = useState<any[]>([])
  const [insightsLoading, setInsightsLoading] = useState(false)
  const router = useRouter()

  async function loadInsights() {
    setInsightsLoading(true)
    try {
      const res = await fetch('/api/admin/instagram/insights')
      const data = await res.json()
      setInsights(data.insights || [])
    } catch (e) {
      console.error('Insights error:', e)
    }
    setInsightsLoading(false)
  }

  // AI generator state
  const [aiDescription, setAiDescription] = useState('')
  const [aiTone, setAiTone] = useState('Exciting & Inspiring')
  const [showAI, setShowAI] = useState(false)

  // Unsplash photo picker state
  const [unsplashQuery, setUnsplashQuery] = useState('paragliding oludeniz')
  const [unsplashPhotos, setUnsplashPhotos] = useState<any[]>([])
  const [unsplashLoading, setUnsplashLoading] = useState(false)
  const [showPhotoPicker, setShowPhotoPicker] = useState(false)

  async function searchUnsplash() {
    setUnsplashLoading(true)
    const res = await fetch(`/api/admin/unsplash-search?query=${encodeURIComponent(unsplashQuery)}`)
    const data = await res.json()
    setUnsplashPhotos(data.photos || [])
    setUnsplashLoading(false)
    setShowPhotoPicker(true)
  }

  function selectPhoto(url: string) {
    setForm(prev => ({ ...prev, image_url: url }))
    setShowPhotoPicker(false)
  }

  // Form state
  const [postType, setPostType] = useState<PostType>('image')
  const [postToTikTok, setPostToTikTok] = useState(false)
  const [form, setForm] = useState({
    image_url: '',
    video_url: '',
    cover_url: '',
    carousel_urls: '' as string,
    caption: '',
    hashtags: '',
    status: 'draft' as 'draft' | 'scheduled' | 'posted' | 'failed',
    scheduled_at: '',
    notes: '',
  })

  function openNew() {
    setEditPost(null)
    setPostType('image')
    setPostToTikTok(false)
    setForm({ image_url: '', video_url: '', cover_url: '', carousel_urls: '', caption: '', hashtags: '', status: 'draft', scheduled_at: '', notes: '' })
    setShowForm(true)
  }

  function openEdit(post: InstagramPost) {
    setEditPost(post)
    setPostType((post as any).post_type || 'image')
    setForm({
      image_url: post.image_url || '',
      video_url: (post as any).video_url || '',
      cover_url: (post as any).cover_url || '',
      carousel_urls: ((post as any).carousel_urls || []).join('\n'),
      caption: post.caption || '',
      hashtags: post.hashtags || '',
      status: post.status,
      scheduled_at: post.scheduled_at ? new Date(post.scheduled_at).toISOString().slice(0, 16) : '',
      notes: post.notes || '',
    })
    setShowForm(true)
    setOpenMenuId(null)
  }

  async function generateCaption() {
    if (!aiDescription) return
    setGenerating(true)
    try {
      const res = await fetch('/api/admin/generate-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageDescription: aiDescription, tone: aiTone }),
      })
      const data = await res.json()
      if (data.error) { alert('AI error: ' + data.error); return }
      setForm(prev => ({ ...prev, caption: data.caption || prev.caption, hashtags: data.hashtags || prev.hashtags }))
      setShowForm(true)
      setShowAI(false)
    } catch {
      alert('Caption oluşturulamadı')
    } finally {
      setGenerating(false)
    }
  }

  async function savePost(andPublish = false) {
    setLoading(andPublish ? 'publish_now' : 'save')
    try {
      const method = editPost ? 'PATCH' : 'POST'
      const carouselArr = form.carousel_urls.split('\n').map(s => s.trim()).filter(Boolean)
      const body = editPost
        ? { id: editPost.id, ...form, post_type: postType, carousel_urls: carouselArr, post_to_tiktok: postToTikTok }
        : { ...form, post_type: postType, carousel_urls: carouselArr, post_to_tiktok: postToTikTok }

      const res = await fetch('/api/admin/instagram', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const txt = await res.text()
        alert(`❌ Kayıt hatası (${res.status}): ${txt}`)
        setLoading(null)
        return
      }

      const saved = await res.json()
      if (saved.error) { alert('❌ Supabase hatası: ' + saved.error); setLoading(null); return }

      if (editPost) {
        setPosts(prev => prev.map(p => p.id === editPost.id ? { ...p, ...form, post_type: postType } as any : p))
      } else {
        setPosts(prev => [saved, ...prev])
      }

      if (andPublish) {
        const postId = saved.id || editPost?.id
        if (!postId) { alert('❌ Post ID alınamadı'); setLoading(null); return }

        const pubRes = await fetch('/api/admin/instagram/publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: postId }),
        })
        const pubData = await pubRes.json()

        if (pubData.error) {
          alert('❌ Instagram hatası: ' + pubData.error)
        } else {
          setPosts(prev => prev.map(p => p.id === postId ? { ...p, status: 'posted' } : p))
          alert('✅ Instagram\'a gönderildi! 🪂')
        }
      }

      setShowForm(false)
      router.refresh()
    } catch (err) {
      alert('❌ Beklenmeyen hata: ' + String(err))
    } finally {
      setLoading(null)
    }
  }

  async function deletePost(id: string) {
    if (!confirm('Bu postu sil?')) return
    setLoading(id)
    setOpenMenuId(null)
    await fetch('/api/admin/instagram', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setPosts(prev => prev.filter(p => p.id !== id))
    setLoading(null)
  }

  async function updateStatus(post: InstagramPost, status: 'draft' | 'scheduled' | 'posted' | 'failed') {
    setLoading(post.id)
    setOpenMenuId(null)
    await fetch('/api/admin/instagram', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: post.id, status }),
    })
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, status } : p))
    setLoading(null)
  }

  async function publishToInstagram(post: InstagramPost) {
    if (!confirm('Instagram\'a şimdi yayınla?')) return
    setLoading(post.id + '_publish')
    setOpenMenuId(null)
    const res = await fetch('/api/admin/instagram/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: post.id }),
    })
    const data = await res.json()
    if (data.error) {
      alert('Instagram hatası: ' + data.error)
    } else {
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, status: 'posted' } : p))
      alert('✅ Yayınlandı!')
    }
    setLoading(null)
    router.refresh()
  }

  const filtered = activeFilter === 'all' ? posts : posts.filter(p => p.status === activeFilter)
  const counts = {
    all: posts.length,
    draft: posts.filter(p => p.status === 'draft').length,
    scheduled: posts.filter(p => p.status === 'scheduled').length,
    posted: posts.filter(p => p.status === 'posted').length,
    failed: posts.filter(p => p.status === 'failed').length,
  }
  const charCount = form.caption.length + (form.hashtags ? form.hashtags.length + 2 : 0)

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
            <Instagram className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Instagram Posts</h1>
          <span className="text-sm text-slate-400">{posts.length} post</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAI(!showAI)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors border ${
              showAI ? 'bg-pink-50 border-pink-200 text-pink-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-4 h-4" /> AI Caption
          </button>
          <button
            onClick={openNew}
            className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-xl text-sm font-bold transition-colors"
          >
            <Plus className="w-4 h-4" /> Yeni Post
          </button>
        </div>
      </div>

      {/* ── AI Caption Generator (collapsible) ── */}
      {showAI && (
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200 rounded-2xl p-5 mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-pink-700 mb-1">Fotoğrafı tanımla</label>
              <input
                value={aiDescription}
                onChange={e => setAiDescription(e.target.value)}
                placeholder="ör. Ölüdeniz lagünü üzerinde 1500m'den hava görüntüsü, gün batımı"
                className="w-full px-3 py-2 text-sm border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-pink-700 mb-1">Ton</label>
              <select
                value={aiTone}
                onChange={e => setAiTone(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
              >
                {TONE_OPTIONS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <button
            onClick={generateCaption}
            disabled={generating || !aiDescription}
            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
          >
            {generating
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Yazıyor...</>
              : <><Sparkles className="w-4 h-4" /> Caption Oluştur</>}
          </button>
        </div>
      )}

      {/* ── Main tab switcher ── */}
      <div className="flex gap-2 mb-5 border-b border-slate-200">
        <button
          onClick={() => setMainTab('posts')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px ${mainTab === 'posts' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          <Instagram className="w-4 h-4" /> Posts
        </button>
        <button
          onClick={() => { setMainTab('analytics'); if (insights.length === 0) loadInsights() }}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px ${mainTab === 'analytics' ? 'border-purple-600 text-purple-700' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          <BarChart2 className="w-4 h-4" /> Analytics
        </button>
      </div>

      {/* ── Analytics Tab ── */}
      {mainTab === 'analytics' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-500">Son 30 yayınlanan postun metrikleri</p>
            <button
              onClick={loadInsights}
              disabled={insightsLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              {insightsLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
              Yenile
            </button>
          </div>

          {insightsLoading && insights.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
              <span className="ml-2 text-slate-500 text-sm">Metrikler yükleniyor...</span>
            </div>
          ) : insights.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <BarChart2 className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">Henüz yayınlanmış post yok</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              {/* Summary cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-b border-slate-100">
                {[
                  { label: 'Toplam Views', icon: <Eye className="w-4 h-4 text-purple-500" />, value: insights.reduce((s, i) => s + (i.views || 0), 0) },
                  { label: 'Toplam Reach', icon: <Users className="w-4 h-4 text-blue-500" />, value: insights.reduce((s, i) => s + (i.reach || 0), 0) },
                  { label: 'Toplam Likes', icon: <Heart className="w-4 h-4 text-pink-500" />, value: insights.reduce((s, i) => s + (i.likes || 0), 0) },
                  { label: 'Toplam Saves', icon: <Bookmark className="w-4 h-4 text-orange-500" />, value: insights.reduce((s, i) => s + (i.saved || 0), 0) },
                ].map(({ label, icon, value }) => (
                  <div key={label} className="p-4 border-r border-slate-100 last:border-r-0">
                    <div className="flex items-center gap-2 mb-1">{icon}<span className="text-xs text-slate-500">{label}</span></div>
                    <p className="text-2xl font-bold text-slate-900">{value.toLocaleString()}</p>
                  </div>
                ))}
              </div>

              {/* Per-post table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Post</th>
                      <th className="text-center px-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide"><Eye className="w-3.5 h-3.5 inline" /> Views</th>
                      <th className="text-center px-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide"><Users className="w-3.5 h-3.5 inline" /> Reach</th>
                      <th className="text-center px-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide"><Heart className="w-3.5 h-3.5 inline" /> Likes</th>
                      <th className="text-center px-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide"><Share2 className="w-3.5 h-3.5 inline" /> Shares</th>
                      <th className="text-center px-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide"><Bookmark className="w-3.5 h-3.5 inline" /> Saves</th>
                      <th className="text-center px-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Ort. İzl.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {insights.map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {item.image_url && (
                              <img src={item.image_url} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-slate-100" onError={e => { (e.target as HTMLImageElement).style.display='none' }} />
                            )}
                            <div className="min-w-0">
                              <p className="text-xs text-slate-700 line-clamp-2 leading-tight">{item.caption?.slice(0, 80) || '—'}</p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${item.post_type === 'reel' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                                  {item.post_type}
                                </span>
                                {item.posted_at && <span className="text-xs text-slate-400">{new Date(item.posted_at).toLocaleDateString('tr-TR')}</span>}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center font-semibold text-slate-800">{(item.views || 0).toLocaleString()}</td>
                        <td className="px-3 py-3 text-center text-slate-600">{(item.reach || 0).toLocaleString()}</td>
                        <td className="px-3 py-3 text-center text-pink-600 font-medium">{(item.likes || 0).toLocaleString()}</td>
                        <td className="px-3 py-3 text-center text-slate-600">{(item.shares || 0).toLocaleString()}</td>
                        <td className="px-3 py-3 text-center text-orange-600">{(item.saved || 0).toLocaleString()}</td>
                        <td className="px-3 py-3 text-center text-slate-500 text-xs">
                          {item.ig_reels_avg_watch_time ? `${(item.ig_reels_avg_watch_time / 1000).toFixed(1)}s` : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {mainTab === 'posts' && (
      <>{/* ── Filter bar + view toggle ── */}
      <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
        <div className="flex gap-1.5 flex-wrap">
          {(['all', 'draft', 'scheduled', 'posted', 'failed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === f
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {f !== 'all' && <span className={activeFilter === f ? '' : STATUS_COLORS[f].split(' ')[1]}>{STATUS_ICONS[f]}</span>}
              <span className="capitalize">{f === 'all' ? 'Tümü' : f}</span>
              <span className={`text-xs px-1 rounded-full ${activeFilter === f ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {counts[f]}
              </span>
            </button>
          ))}
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
            title="Liste görünümü"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
            title="Grid görünümü"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Posts ── */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Instagram className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">
            {activeFilter !== 'all' ? `${activeFilter} statüsünde post yok` : 'Henüz post yok — yukarıdan yeni oluştur'}
          </p>
        </div>
      ) : viewMode === 'list' ? (
        /* ── LIST VIEW ── */
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
          {filtered.map(post => {
            const type = (post as any).post_type || 'image'
            const isPublishing = loading === post.id + '_publish'
            return (
              <div key={post.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors group">
                {/* Thumbnail */}
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                  {post.image_url ? (
                    <img src={post.image_url} alt="" className="w-full h-full object-cover" />
                  ) : (post as any).video_url ? (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                      <Film className="w-5 h-5 text-purple-400" />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-slate-300" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${POST_TYPE_COLORS[type] || POST_TYPE_COLORS.image}`}>
                      {type}
                    </span>
                    <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[post.status]}`}>
                      {STATUS_ICONS[post.status]}
                      {post.status}
                    </span>
                    {post.scheduled_at && post.status === 'scheduled' && (
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        {new Date(post.scheduled_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-700 truncate">{post.caption || <span className="text-slate-300 italic">Caption yok</span>}</p>
                </div>

                {/* Quick actions */}
                <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  {(post.status === 'draft' || post.status === 'scheduled') && (
                    <button
                      onClick={() => publishToInstagram(post)}
                      disabled={!!loading}
                      className="flex items-center gap-1 text-xs px-2.5 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-semibold transition-colors"
                    >
                      {isPublishing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                      {isPublishing ? '~10sn' : 'Yayınla'}
                    </button>
                  )}
                  <button onClick={() => openEdit(post)} className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg transition-colors">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => deletePost(post.id)} className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* ── GRID VIEW — compact thumbnails ── */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map(post => {
            const type = (post as any).post_type || 'image'
            return (
              <div
                key={post.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group cursor-pointer"
                onClick={() => openEdit(post)}
              >
                {/* Thumbnail — fixed small height */}
                <div className="h-28 bg-slate-100 relative overflow-hidden">
                  {post.image_url ? (
                    <img src={post.image_url} alt="" className="w-full h-full object-cover" />
                  ) : (post as any).video_url ? (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                      <Film className="w-7 h-7 text-purple-400" />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-7 h-7 text-slate-300" />
                    </div>
                  )}
                  {/* Overlaid badges */}
                  <div className="absolute top-1.5 left-1.5">
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${POST_TYPE_COLORS[type] || POST_TYPE_COLORS.image}`}>
                      {type}
                    </span>
                  </div>
                  <div className="absolute top-1.5 right-1.5">
                    <span className={`flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded-md ${STATUS_COLORS[post.status]}`}>
                      {STATUS_ICONS[post.status]}
                    </span>
                  </div>
                </div>

                {/* Caption preview */}
                <div className="px-2.5 py-2">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {post.caption || <span className="text-slate-300 italic">Caption yok</span>}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Create/Edit Modal ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl my-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">{editPost ? 'Postu Düzenle' : 'Yeni Instagram Post'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">

              {/* Post Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Post Tipi</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {POST_TYPES.map(pt => (
                    <button
                      key={pt.type}
                      type="button"
                      onClick={() => setPostType(pt.type)}
                      className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 text-center text-xs transition-all ${
                        postType === pt.type
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      {pt.icon}
                      <span className="font-semibold">{pt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Media — Image */}
              {postType === 'image' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Fotoğraf</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      value={unsplashQuery}
                      onChange={e => setUnsplashQuery(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && searchUnsplash()}
                      placeholder="Unsplash'ta ara..."
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <button type="button" onClick={searchUnsplash} disabled={unsplashLoading}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold disabled:opacity-50">
                      {unsplashLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ara'}
                    </button>
                  </div>
                  {showPhotoPicker && unsplashPhotos.length > 0 && (
                    <div className="mb-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-xs font-semibold text-slate-500">Fotoğraf seç</p>
                        <button onClick={() => setShowPhotoPicker(false)}><X className="w-3.5 h-3.5 text-slate-400" /></button>
                      </div>
                      <div className="grid grid-cols-5 gap-1">
                        {unsplashPhotos.map(photo => (
                          <button key={photo.id} type="button" onClick={() => selectPhoto(photo.url)}
                            className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-orange-500 transition-all">
                            <img src={photo.thumb} alt={photo.alt} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <input value={form.image_url} onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))}
                    placeholder="https://... veya Cloudinary URL"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  {form.image_url && (
                    <div className="mt-2 flex items-center gap-2">
                      <img src={form.image_url} alt="" className="w-16 h-16 rounded-xl object-cover border border-slate-200" />
                      <span className="text-xs text-slate-400 truncate flex-1">{form.image_url}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Media — Reel */}
              {postType === 'reel' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Video URL (MP4)</label>
                    <input value={form.video_url} onChange={e => setForm(p => ({ ...p, video_url: e.target.value }))}
                      placeholder="https://res.cloudinary.com/.../video.mp4"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Kapak Görseli (opsiyonel)</label>
                    <input value={form.cover_url} onChange={e => setForm(p => ({ ...p, cover_url: e.target.value }))}
                      placeholder="https://... thumbnail URL"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
                  </div>
                  <label className="flex items-center gap-2.5 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                    <input type="checkbox" checked={postToTikTok} onChange={e => setPostToTikTok(e.target.checked)} className="w-4 h-4 accent-black" />
                    <span className="text-sm font-medium text-slate-700">🎵 TikTok'a da gönder</span>
                  </label>
                </div>
              )}

              {/* Media — Story */}
              {postType === 'story' && (
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Fotoğraf URL</label>
                    <input value={form.image_url} onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))}
                      placeholder="https://..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
                  </div>
                  <p className="text-xs text-center text-slate-400">— veya —</p>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Video URL</label>
                    <input value={form.video_url} onChange={e => setForm(p => ({ ...p, video_url: e.target.value }))}
                      placeholder="https://..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
                  </div>
                </div>
              )}

              {/* Media — Carousel */}
              {postType === 'carousel' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    Fotoğraf URL'leri (2–10, her satıra bir tane)
                  </label>
                  <textarea value={form.carousel_urls}
                    onChange={e => setForm(p => ({ ...p, carousel_urls: e.target.value }))}
                    rows={4}
                    placeholder={"https://image1.jpg\nhttps://image2.jpg"}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 font-mono resize-none" />
                  <p className="text-xs text-slate-400 mt-1">{form.carousel_urls.split('\n').filter(s => s.trim()).length} / 10</p>
                  {form.carousel_urls.split('\n').filter(s => s.trim()).length > 0 && (
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {form.carousel_urls.split('\n').filter(s => s.trim()).slice(0, 10).map((url, i) => (
                        <img key={i} src={url.trim()} alt="" className="w-12 h-12 rounded-lg object-cover border border-slate-200" onError={e => (e.currentTarget.style.opacity = '0.3')} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Caption */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Caption</label>
                  <span className={`text-xs ${charCount > 2200 ? 'text-red-500 font-semibold' : 'text-slate-400'}`}>{charCount}/2200</span>
                </div>
                <textarea
                  value={form.caption}
                  onChange={e => setForm(p => ({ ...p, caption: e.target.value }))}
                  rows={4}
                  placeholder="Caption yaz... ✈️"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                />
              </div>

              {/* Hashtags */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Hashtags</label>
                <textarea
                  value={form.hashtags}
                  onChange={e => setForm(p => ({ ...p, hashtags: e.target.value }))}
                  rows={2}
                  placeholder="#paragliding #oludeniz #babadagmountain"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none font-mono text-blue-600"
                />
              </div>

              {/* Status + Schedule */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Durum</label>
                  <select
                    value={form.status}
                    onChange={e => setForm(p => ({ ...p, status: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="posted">Posted</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Zamanlama</label>
                  <input
                    type="datetime-local"
                    value={form.scheduled_at}
                    onChange={e => setForm(p => ({ ...p, scheduled_at: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Not (iç kullanım)</label>
                <input
                  value={form.notes}
                  onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  placeholder="Opsiyonel not..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {/* Preview */}
              {(form.caption || form.hashtags) && (
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
                    <Instagram className="w-3.5 h-3.5" /> Önizleme
                  </p>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{form.caption}</p>
                  {form.hashtags && <p className="text-sm text-blue-500 mt-1.5">{form.hashtags}</p>}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 px-5 py-4 border-t border-slate-100 flex-wrap">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
                İptal
              </button>
              <button
                onClick={() => savePost(false)}
                disabled={!!loading || !form.caption}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 disabled:opacity-50 text-slate-700 rounded-xl text-sm font-bold transition-colors"
              >
                {loading === 'save' ? <><Loader2 className="w-4 h-4 animate-spin inline mr-1" />Kaydediliyor...</> : 'Taslak Kaydet'}
              </button>
              {form.scheduled_at && (
                <button
                  onClick={() => { setForm(p => ({ ...p, status: 'scheduled' })); savePost(false) }}
                  disabled={!!loading || !form.caption}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-colors"
                >
                  <Calendar className="w-4 h-4" /> Zamanla
                </button>
              )}
              <button
                onClick={() => savePost(true)}
                disabled={!!loading || !form.caption}
                className="flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-colors"
              >
                {loading === 'publish_now'
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Gönderiliyor (~10sn)...</>
                  : <><Upload className="w-4 h-4" /> Şimdi Yayınla</>}
              </button>
            </div>
          </div>
        </div>
      )}
      </>
      )}
    </div>
  )
}
