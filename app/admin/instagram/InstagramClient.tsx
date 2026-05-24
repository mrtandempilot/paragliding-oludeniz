'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Sparkles, Edit2, Trash2, Send, Clock, CheckCircle, XCircle, X, Loader2, Instagram, Calendar, Hash, Image as ImageIcon, AlignLeft, Upload, Film, BookImage, Tv2 } from 'lucide-react'
import type { InstagramPost } from '@/lib/supabase'

type PostType = 'image' | 'reel' | 'story' | 'carousel'

const POST_TYPES: { type: PostType; label: string; icon: React.ReactNode; desc: string; color: string }[] = [
  { type: 'image',    label: 'Photo',    icon: <ImageIcon className="w-5 h-5" />, desc: 'Single image post',        color: 'border-orange-400 bg-orange-50 text-orange-700' },
  { type: 'reel',     label: 'Reel',     icon: <Film className="w-5 h-5" />,      desc: 'Short video (Reels)',       color: 'border-purple-400 bg-purple-50 text-purple-700' },
  { type: 'story',    label: 'Story',    icon: <Tv2 className="w-5 h-5" />,       desc: 'Story (image or video)',    color: 'border-sky-400 bg-sky-50 text-sky-700' },
  { type: 'carousel', label: 'Carousel', icon: <BookImage className="w-5 h-5" />, desc: 'Multiple images (2–10)',    color: 'border-green-400 bg-green-50 text-green-700' },
]

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-slate-100 text-slate-500',
  scheduled: 'bg-blue-100 text-blue-700',
  posted: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
}

const STATUS_ICONS: Record<string, React.ReactNode> = {
  draft: <Edit2 className="w-3 h-3" />,
  scheduled: <Clock className="w-3 h-3" />,
  posted: <CheckCircle className="w-3 h-3" />,
  failed: <XCircle className="w-3 h-3" />,
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
  const router = useRouter()

  // AI generator state
  const [aiDescription, setAiDescription] = useState('')
  const [aiTone, setAiTone] = useState('Exciting & Inspiring')

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
    carousel_urls: '' as string, // newline-separated
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
      setForm(prev => ({
        ...prev,
        caption: data.caption || prev.caption,
        hashtags: data.hashtags || prev.hashtags,
      }))
      setShowForm(true)
    } catch {
      alert('Failed to generate caption')
    } finally {
      setGenerating(false)
    }
  }

  async function savePost(andPublish = false) {
    setLoading(andPublish ? 'publish_now' : 'save')
    try {
      // Adım 1: Supabase'e kaydet
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

      if (saved.error) {
        alert('❌ Supabase hatası: ' + saved.error)
        setLoading(null)
        return
      }

      if (editPost) {
        setPosts(prev => prev.map(p => p.id === editPost.id ? { ...p, ...form } : p))
      } else {
        setPosts(prev => [saved, ...prev])
      }

      if (andPublish) {
        const postId = saved.id || editPost?.id
        if (!postId) {
          alert('❌ Post ID alınamadı, Instagram\'a gönderilemedi')
          setLoading(null)
          return
        }

        // Adım 2: Instagram'a gönder (10sn bekler)
        const pubRes = await fetch('/api/admin/instagram/publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: postId }),
        })

        if (!pubRes.ok) {
          const txt = await pubRes.text()
          alert(`❌ Publish hatası (${pubRes.status}): ${txt}`)
          setLoading(null)
          return
        }

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
    if (!confirm('Delete this post?')) return
    setLoading(id)
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
    await fetch('/api/admin/instagram', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: post.id, status }),
    })
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, status } : p))
    setLoading(null)
  }

  async function publishToInstagram(post: InstagramPost) {
    if (!confirm('Post this to Instagram now?')) return
    setLoading(post.id + '_publish')
    const res = await fetch('/api/admin/instagram/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: post.id }),
    })
    const data = await res.json()
    if (data.error) {
      alert('Instagram error: ' + data.error)
    } else {
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, status: 'posted' } : p))
      alert('✅ Posted to Instagram!')
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
            <Instagram className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Instagram Posts</h1>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      {/* AI Caption Generator */}
      <div className="bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200 rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-pink-600" />
          <h2 className="font-bold text-pink-900">Generate Caption with Claude AI</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-pink-700 mb-1">Describe the image *</label>
            <input
              value={aiDescription}
              onChange={e => setAiDescription(e.target.value)}
              placeholder="e.g. Aerial view of Ölüdeniz lagoon from 1500m altitude, sunset colors"
              className="w-full px-3 py-2 text-sm border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-pink-700 mb-1">Tone</label>
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
          className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors"
        >
          {generating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate Caption</>}
        </button>
        {generating && <p className="text-xs text-pink-600 mt-2">Claude is crafting your caption...</p>}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {(['all', 'draft', 'scheduled', 'posted', 'failed'] as const).map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${activeFilter === f ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            {f !== 'all' && STATUS_ICONS[f]}
            <span className="capitalize">{f}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeFilter === f ? 'bg-white/20' : 'bg-slate-100'}`}>{counts[f]}</span>
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          No {activeFilter !== 'all' ? activeFilter : ''} posts yet. Generate one with Claude AI above!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(post => (
            <div key={post.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Image Preview */}
              <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
                {post.image_url ? (
                  <img src={post.image_url} alt="" className="w-full h-full object-cover" />
                ) : (post as any).video_url ? (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-slate-900">
                    <Film className="w-10 h-10 text-purple-400" />
                    <span className="text-xs text-purple-300 font-semibold">Reel</span>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-slate-300" />
                  </div>
                )}
                {/* Status badge — top right */}
                <div className="absolute top-2 right-2">
                  <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${STATUS_COLORS[post.status]}`}>
                    {STATUS_ICONS[post.status]}
                    <span className="capitalize">{post.status}</span>
                  </span>
                </div>
                {/* Post type badge — top left */}
                {(() => {
                  const type = (post as any).post_type || 'image'
                  const typeConfig: Record<string, { icon: React.ReactNode; label: string; cls: string }> = {
                    reel:     { icon: <Film className="w-3 h-3" />,      label: 'Reel',     cls: 'bg-purple-600 text-white' },
                    story:    { icon: <Tv2 className="w-3 h-3" />,       label: 'Story',    cls: 'bg-sky-600 text-white' },
                    carousel: { icon: <BookImage className="w-3 h-3" />, label: 'Carousel', cls: 'bg-green-600 text-white' },
                  }
                  const cfg = typeConfig[type]
                  if (!cfg) return null
                  return (
                    <div className="absolute top-2 left-2">
                      <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${cfg.cls}`}>
                        {cfg.icon}{cfg.label}
                      </span>
                    </div>
                  )
                })()}
              </div>

              {/* Content */}
              <div className="p-4">
                {post.caption && (
                  <p className="text-sm text-slate-700 line-clamp-3 mb-2">{post.caption}</p>
                )}
                {post.hashtags && (
                  <p className="text-xs text-blue-500 line-clamp-1 mb-3">{post.hashtags}</p>
                )}

                {post.scheduled_at && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(post.scheduled_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(post)}
                      className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deletePost(post.id)}
                      disabled={loading === post.id}
                      className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Status change buttons */}
                  <div className="flex gap-1">
                    {post.status === 'draft' && (
                      <button
                        onClick={() => updateStatus(post, 'scheduled')}
                        disabled={loading === post.id}
                        className="flex items-center gap-1 text-xs px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors font-semibold"
                      >
                        <Clock className="w-3 h-3" /> Schedule
                      </button>
                    )}
                    {(post.status === 'draft' || post.status === 'scheduled') && (
                      <>
                        <button
                          onClick={() => publishToInstagram(post)}
                          disabled={!!loading}
                          className="flex items-center gap-1 text-xs px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-colors font-semibold"
                          title="Publish directly to Instagram"
                        >
                          {loading === post.id + '_publish' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />} Publish
                        </button>
                        <button
                          onClick={() => updateStatus(post, 'posted')}
                          disabled={!!loading}
                          className="flex items-center gap-1 text-xs px-2 py-1 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors font-semibold"
                        >
                          <Send className="w-3 h-3" /> Mark Posted
                        </button>
                      </>
                    )}
                    {post.status === 'failed' && (
                      <button
                        onClick={() => updateStatus(post, 'draft')}
                        disabled={loading === post.id}
                        className="flex items-center gap-1 text-xs px-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors font-semibold"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="font-bold text-slate-900">{editPost ? 'Edit Post' : 'New Instagram Post'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">

              {/* Post Type Selector */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Post Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {POST_TYPES.map(pt => (
                    <button
                      key={pt.type}
                      type="button"
                      onClick={() => setPostType(pt.type)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-center ${
                        postType === pt.type ? pt.color + ' border-current' : 'border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      {pt.icon}
                      <span className="text-xs font-bold">{pt.label}</span>
                      <span className="text-xs opacity-70 leading-tight">{pt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Media Fields — based on post type */}
              {(postType === 'image') && (
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-1">
                    <ImageIcon className="w-4 h-4" /> Image URL *
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      value={unsplashQuery}
                      onChange={e => setUnsplashQuery(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && searchUnsplash()}
                      placeholder="Search Unsplash..."
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button type="button" onClick={searchUnsplash} disabled={unsplashLoading}
                      className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50">
                      {unsplashLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />} Unsplash
                    </button>
                  </div>
                  {showPhotoPicker && unsplashPhotos.length > 0 && (
                    <div className="mb-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-slate-500">Bir fotoğraf seç</p>
                        <button onClick={() => setShowPhotoPicker(false)}><X className="w-4 h-4 text-slate-400" /></button>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5">
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
                    placeholder="https://... or paste Cloudinary URL"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  {form.image_url && (
                    <div className="mt-2 w-24 h-24 rounded-xl overflow-hidden border border-slate-200">
                      <img src={form.image_url} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              )}

              {(postType === 'reel') && (
                <div className="space-y-3">
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-1">
                      <Film className="w-4 h-4" /> Video URL * <span className="font-normal text-slate-400">(public MP4)</span>
                    </label>
                    <input value={form.video_url} onChange={e => setForm(p => ({ ...p, video_url: e.target.value }))}
                      placeholder="https://res.cloudinary.com/.../video.mp4"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    <p className="text-xs text-slate-400 mt-1">Must be a public URL. Use Cloudinary for video hosting.</p>
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-1">
                      <ImageIcon className="w-4 h-4" /> Cover Image <span className="font-normal text-slate-400">(optional)</span>
                    </label>
                    <input value={form.cover_url} onChange={e => setForm(p => ({ ...p, cover_url: e.target.value }))}
                      placeholder="https://... thumbnail image URL"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                  {/* TikTok cross-post */}
                  <label className="flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all border-slate-200 hover:border-slate-300">
                    <input
                      type="checkbox"
                      checked={postToTikTok}
                      onChange={e => setPostToTikTok(e.target.checked)}
                      className="w-4 h-4 accent-black"
                    />
                    <span className="text-sm font-semibold text-slate-700">🎵 Aynı anda TikTok'a da at</span>
                  </label>
                </div>
              )}

              {(postType === 'story') && (
                <div className="space-y-3">
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-1">
                      <ImageIcon className="w-4 h-4" /> Image URL
                    </label>
                    <input value={form.image_url} onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))}
                      placeholder="https://... image URL for story"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
                  </div>
                  <p className="text-xs text-slate-400 text-center">— or —</p>
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-1">
                      <Film className="w-4 h-4" /> Video URL
                    </label>
                    <input value={form.video_url} onChange={e => setForm(p => ({ ...p, video_url: e.target.value }))}
                      placeholder="https://... video URL for story"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
                  </div>
                </div>
              )}

              {(postType === 'carousel') && (
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-1">
                    <BookImage className="w-4 h-4" /> Image URLs * <span className="font-normal text-slate-400">(2–10, one per line)</span>
                  </label>
                  <textarea value={form.carousel_urls}
                    onChange={e => setForm(p => ({ ...p, carousel_urls: e.target.value }))}
                    rows={5}
                    placeholder={"https://image1.jpg\nhttps://image2.jpg\nhttps://image3.jpg"}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-mono resize-none" />
                  <p className="text-xs text-slate-400 mt-1">
                    {form.carousel_urls.split('\n').filter(s => s.trim()).length} / 10 images
                  </p>
                  {/* Preview thumbnails */}
                  {form.carousel_urls.split('\n').filter(s => s.trim()).length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {form.carousel_urls.split('\n').filter(s => s.trim()).slice(0, 10).map((url, i) => (
                        <div key={i} className="w-14 h-14 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                          <img src={url.trim()} alt="" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.opacity = '0.3')} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Caption */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-1">
                  <AlignLeft className="w-4 h-4" /> Caption *
                </label>
                <textarea
                  value={form.caption}
                  onChange={e => setForm(p => ({ ...p, caption: e.target.value }))}
                  rows={4}
                  placeholder="Write your caption... ✈️"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
                <p className={`text-xs mt-1 ${charCount > 2200 ? 'text-red-500' : 'text-slate-400'}`}>{charCount} / 2200 chars</p>
              </div>

              {/* Hashtags */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-1">
                  <Hash className="w-4 h-4" /> Hashtags
                </label>
                <textarea
                  value={form.hashtags}
                  onChange={e => setForm(p => ({ ...p, hashtags: e.target.value }))}
                  rows={2}
                  placeholder="#paragliding #oludeniz #babadagmountain ..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none font-mono text-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm(p => ({ ...p, status: e.target.value as 'draft' | 'scheduled' | 'posted' | 'failed' }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="posted">Posted</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                {/* Scheduled At */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-1">
                    <Calendar className="w-4 h-4" /> Schedule Date
                  </label>
                  <input
                    type="datetime-local"
                    value={form.scheduled_at}
                    onChange={e => setForm(p => ({ ...p, scheduled_at: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Internal Notes</label>
                <input
                  value={form.notes}
                  onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  placeholder="Optional notes for yourself..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Character preview */}
              {(form.caption || form.hashtags) && (
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
                  <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
                    <Instagram className="w-3.5 h-3.5" /> Preview
                  </p>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{form.caption}</p>
                  {form.hashtags && <p className="text-sm text-blue-500 mt-2">{form.hashtags}</p>}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 flex-wrap">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">İptal</button>
              <button
                onClick={() => savePost(false)}
                disabled={!!loading || !form.caption}
                className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 disabled:opacity-50 text-slate-700 rounded-xl text-sm font-bold transition-colors"
              >
                {loading === 'save' ? <><Loader2 className="w-4 h-4 animate-spin" /> Kaydediliyor...</> : 'Taslak Kaydet'}
              </button>
              {form.scheduled_at && (
                <button
                  onClick={() => { setForm(p => ({ ...p, status: 'scheduled' })); savePost(false) }}
                  disabled={!!loading || !form.caption}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-colors"
                >
                  {loading === 'save' ? <><Loader2 className="w-4 h-4 animate-spin" /> Zamanlanıyor...</> : <><Calendar className="w-4 h-4" /> Zamanla</>}
                </button>
              )}
              <button
                onClick={() => savePost(true)}
                disabled={!!loading || !form.caption}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-colors"
              >
                {loading === 'publish_now'
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Gönderiliyor (~10sn)...</>
                  : <><Upload className="w-4 h-4" /> Şimdi Yayınla</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
