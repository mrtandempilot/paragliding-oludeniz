'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Settings, Save, Loader2, CheckCircle } from 'lucide-react'

const SLOTS = [
  { value: '06:00', label: '09:00 🇹🇷', desc: 'Sabah (06:00 UTC)' },
  { value: '12:00', label: '15:00 🇹🇷', desc: 'Öğleden sonra (12:00 UTC)' },
  { value: '18:00', label: '21:00 🇹🇷', desc: 'Akşam (18:00 UTC)' },
]

export default function ContentPilotSettings() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [enabled, setEnabled] = useState(true)
  const [activeSlots, setActiveSlots] = useState<string[]>(['06:00'])

  useEffect(() => {
    fetch('/api/admin/settings', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        setEnabled(data['pilot_enabled'] !== 'false')
        const slots = (data['pilot_active_slots'] || '06:00').split(',').map((s: string) => s.trim()).filter(Boolean)
        setActiveSlots(slots)
      })
      .finally(() => setLoading(false))
  }, [])

  function toggleSlot(slot: string) {
    setActiveSlots(prev =>
      prev.includes(slot)
        ? prev.filter(s => s !== slot)
        : [...prev, slot]
    )
  }

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pilot_enabled: String(enabled),
          pilot_active_slots: activeSlots.join(','),
          pilot_runs_per_day: String(activeSlots.length),
        }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/content-pilot" className="text-slate-400 hover:text-slate-700">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Settings className="w-6 h-6 text-purple-600" />
            ContentPilot Ayarları
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Otomatik çalışma takvimi</p>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center text-slate-400 animate-pulse">
          Yükleniyor...
        </div>
      ) : (
        <div className="space-y-5">

          {/* On/Off toggle */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">ContentPilot</p>
                <p className="text-sm text-slate-500 mt-0.5">
                  {enabled ? '✅ Otomatik çalışıyor' : '⏸️ Duraklatıldı'}
                </p>
              </div>
              <button
                onClick={() => setEnabled(!enabled)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${
                  enabled ? 'bg-purple-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                    enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Slot seçimi */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <p className="font-semibold text-slate-900 mb-1">Günlük çalışma saatleri</p>
            <p className="text-sm text-slate-500 mb-5">
              Her seçili saatte 1 makale yazılır ve Instagram'a post atılır.
              {activeSlots.length > 0 && (
                <span className="ml-1 font-medium text-purple-600">
                  Günde {activeSlots.length}x seçili.
                </span>
              )}
            </p>

            <div className="space-y-3">
              {SLOTS.map(slot => {
                const active = activeSlots.includes(slot.value)
                return (
                  <button
                    key={slot.value}
                    onClick={() => toggleSlot(slot.value)}
                    className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 transition-all ${
                      active
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="text-left">
                      <p className={`font-semibold ${active ? 'text-purple-900' : 'text-slate-700'}`}>
                        {slot.label}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{slot.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      active ? 'border-purple-600 bg-purple-600' : 'border-slate-300'
                    }`}>
                      {active && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                )
              })}
            </div>

            {activeSlots.length === 0 && (
              <p className="text-amber-600 text-sm mt-3 bg-amber-50 rounded-lg px-4 py-2">
                ⚠️ Hiçbir saat seçili değil — ContentPilot çalışmayacak.
              </p>
            )}
          </div>

          {/* Maliyet tahmini */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
            <p className="font-semibold text-slate-700 text-sm mb-3">💰 Tahmini aylık AI maliyeti</p>
            <div className="space-y-1.5 text-sm text-slate-600">
              {[1, 2, 3].map(n => (
                <div key={n} className={`flex justify-between ${activeSlots.length === n ? 'font-bold text-purple-700' : ''}`}>
                  <span>Günde {n}x ({n * 30} makale/ay)</span>
                  <span>${(n * 30 * 0.075).toFixed(2)}/ay</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-3">
              Makale başı ortalama ~$0.075 (SEO + Writer + Social)
            </p>
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all ${
              saved
                ? 'bg-green-500 text-white'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            {saving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Kaydediliyor...</>
            ) : saved ? (
              <><CheckCircle className="w-4 h-4" /> Kaydedildi!</>
            ) : (
              <><Save className="w-4 h-4" /> Ayarları Kaydet</>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
