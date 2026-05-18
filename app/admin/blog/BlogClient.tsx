'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Sparkles, Edit2, Trash2, Eye, EyeOff, ExternalLink, X, Loader2 } from 'lucide-react'
import type { BlogPostDB } from '@/lib/supabase'

const CATEGORIES = ['Beginner Guide', 'Safety', 'Weather & Conditions', 'Babadağ & Location', 'Pilot Guide', 'Comparison', 'Experience']

export default function BlogClient({ posts: initial }: { posts: BlogPostDB[] }) {
  const [posts, setPosts] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [editPost, setEditPost] = useState<BlogPostDB | null>(null)
  const [generating, setGenerating] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  // AI generator state
  const [aiTopic, setAiTopic] = useState('')
  const [aiKeyword, setAiKeyword] = useState('')
  const [aiCategory, setAiCategory] = useState('Beginner Guide')

  // Form state
  const [form, setForm] = useState({
    title: '', slug: '', description: '', content: '',
    category: 'Beginner Guide', read_time: '5 min read',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80',
    published: false,
  })

  function openNew() {
    setEditPost(null)
    setForm({ title: '', slug: '', description: '', content: '', category: 'Beginner Guide', read_time: '5 min read', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80', published: false })
    setShowForm(true)
  }

  function openEdit(post: BlogPostDB) {
    setEditPost(post)
    setForm({ title: post.title, slug: post.slug, description: post.description || '', content: post.content || '', category: post.category || 'Guide', read_time: post.read_time || '5 min read', image: post.image || '', published: post.published })
    setShowForm(true)
  }

  async function generateWithAI() {
    if (!aiTopic) return
    setGenerating(true)
    try {
      const res = await fetch('/api/admin/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: aiTopic, keyword: aiKeyword, category: aiCategory }),
      })
      const data = await res.json()
      if (data.error) { alert('AI error: ' + data.error); return }
      setForm(prev => ({
        ...prev,
        title: data.title || prev.title,
        slug: data.slug || prev.slug,
        description: data.description || prev.description,
        content: data.content || prev.content,
        category: data.category || prev.category,
        read_time: data.read_time || prev.read_time,
      }))
      setShowForm(true)
    } catch (e) {
      alert('Failed to generate post')
    } finally {
      setGenerating(false)
    }
  }

  async function savePost() {
    setLoading('save')
    const method = editPost ? 'PATCH' : 'POST'
    const body = editPost ? { id: editPost.id, ...form } : form

    const res = await fetch('/api/admin/blog', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const saved = await res.json()

    if (editPost) {
      setPosts(prev => prev.map(p => p.id === editPost.id ? { ...p, ...form } : p))
    } else {
      setPosts(prev => [saved, ...prev])
    }
    setShowForm(false)
    setLoading(null)
    router.refresh()
  }

  async function togglePublish(post: BlogPostDB) {
    setLoading(post.id)
    await fetch('/api/admin/blog', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: post.id, published: !post.published }),
    })
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, published: !p.published } : p))
    setLoading(null)
  }

  async function deletePost(id: string) {
    if (!confirm('Delete this post?')) return
    setLoading(id)
    await fetch('/api/admin/blog', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setPosts(prev => prev.filter(p => p.id !== id))
    setLoading(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Blog Posts</h1>
        <button onClick={openNew} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      {/* AI Generator Card */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h2 className="font-bold text-purple-900">Generate with Claude AI</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="sm:col-span-1">
            <label className="block text-xs font-semibold text-purple-700 mb-1">Topic *</label>
            <input
              value={aiTopic}
              onChange={e => setAiTopic(e.target.value)}
              placeholder="e.g. Scared of heights paragliding"
              className="w-full px-3 py-2 text-sm border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-purple-700 mb-1">Target Keyword</label>
            <input
              value={aiKeyword}
              onChange={e => setAiKeyword(e.target.value)}
              placeholder="e.g. paragliding oludeniz safe"
              className="w-full px-3 py-2 text-sm border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-purple-700 mb-1">Category</label>
            <select
              value={aiCategory}
              onChange={e => setAiCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            >
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <button
          onClick={generateWithAI}
          disabled={generating || !aiTopic}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors"
        >
          {generating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate Post</>}
        </button>
        {generating && <p className="text-xs text-purple-600 mt-2">Claude is writing your post... ~30 seconds</p>}
      </div>

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          No blog posts yet. Generate one with Claude AI above!
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-2xl border border-slate-200 px-5 py-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-slate-900 truncate">{post.title}</p>
                  <span className={`flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${post.published ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="flex gap-3 text-xs text-slate-400">
                  <span>{post.category}</span>
                  <span>/{post.slug}</span>
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                {post.published && (
                  <a href={`/blog/${post.slug}`} target="_blank" className="p-2 hover:bg-slate-100 text-slate-400 hover:text-orange-500 rounded-lg transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button onClick={() => openEdit(post)} className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => togglePublish(post)}
                  disabled={loading === post.id}
                  className={`p-2 rounded-lg transition-colors ${post.published ? 'hover:bg-red-50 text-green-500 hover:text-red-500' : 'hover:bg-green-50 text-slate-400 hover:text-green-500'}`}
                  title={post.published ? 'Unpublish' : 'Publish'}
                >
                  {post.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button onClick={() => deletePost(post.id)} disabled={loading === post.id} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Create Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="font-bold text-slate-900">{editPost ? 'Edit Post' : 'New Post'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Title *</label>
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Slug *</label>
                  <input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="url-friendly-slug" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Meta Description</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" />
                <p className="text-xs text-slate-400 mt-1">{form.description.length}/155 chars</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Image URL</label>
                <input value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Content (Markdown)</label>
                <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                  rows={16} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none font-mono" />
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" id="published" checked={form.published}
                  onChange={e => setForm(p => ({ ...p, published: e.target.checked }))}
                  className="w-4 h-4 accent-orange-500" />
                <label htmlFor="published" className="text-sm font-medium text-slate-700">Publish immediately</label>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
              <button onClick={savePost} disabled={loading === 'save' || !form.title || !form.slug}
                className="flex items-center gap-2 px-6 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-colors">
                {loading === 'save' ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Save Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
