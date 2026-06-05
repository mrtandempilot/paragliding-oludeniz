'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Loader2 } from 'lucide-react'

export default function AddTopicForm() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [keywords, setKeywords] = useState('')
  const [priority, setPriority] = useState('50')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)

    try {
      const res = await fetch('/api/admin/topics', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
          priority: parseInt(priority) || 50,
          status: 'pending',
        }),
      })

      if (!res.ok) throw new Error(await res.text())

      setTitle('')
      setKeywords('')
      setPriority('50')
      setOpen(false)
      router.refresh()
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
      >
        <Plus className="w-4 h-4" />
        Add Topic
      </button>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-purple-200 p-6">
      <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
        <Plus className="w-4 h-4 text-purple-600" />
        Add New SEO Topic
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Topic Title *</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Best time to paraglide in Ölüdeniz"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Keywords <span className="text-slate-400">(comma separated)</span>
          </label>
          <input
            type="text"
            value={keywords}
            onChange={e => setKeywords(e.target.value)}
            placeholder="paragliding oludeniz, best time, weather"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Priority <span className="text-slate-400">(1–100, higher = runs first)</span>
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={priority}
            onChange={e => setPriority(e.target.value)}
            className="w-32 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-xl text-sm font-medium transition-colors"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {loading ? 'Adding...' : 'Add Topic'}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="px-5 py-2.5 text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
