'use client'

import { useState } from 'react'
import { MessageCircle, Zap, Save, Check, Plus, X } from 'lucide-react'

const DEFAULT_GENERAL_MESSAGE = `Merhaba! 😊 Yorumun için çok teşekkürler!

Ölüdeniz'den Babadağ'a uçmak istersen sana yardımcı olmaktan mutluluk duyarım 🪂

📅 Rezervasyon: atmosparagliding.com/book-now
📞 Direkt iletişim için buraya yaz!

Görüşmek üzere! ✨`

const DEFAULT_KEYWORD_MESSAGE = `Merhaba! 🪂 Fiyat ve rezervasyon bilgisi için:

✅ Tandem uçuş (Standart / Yüksek / Sunset) — $140 kişi başı
✅ Foto & Video paketi — +$35 (opsiyonel)
✅ Grup indirimi (4+ kişi) — %15 indirim

📅 Online rezervasyon: atmosparagliding.com/book-now

Başka soruların olursa buradayım! 😊`

const DEFAULT_KEYWORDS = ['fiyat', 'price', 'rezervasyon', 'booking', 'cost', 'how much', 'ne kadar', 'info', 'bilgi']

export default function DmAutomation() {
  const [generalEnabled, setGeneralEnabled] = useState(false)
  const [keywordEnabled, setKeywordEnabled] = useState(true)
  const [generalMessage, setGeneralMessage] = useState(DEFAULT_GENERAL_MESSAGE)
  const [keywordMessage, setKeywordMessage] = useState(DEFAULT_KEYWORD_MESSAGE)
  const [keywords, setKeywords] = useState<string[]>(DEFAULT_KEYWORDS)
  const [newKeyword, setNewKeyword] = useState('')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'general' | 'keyword'>('keyword')

  const addKeyword = () => {
    const kw = newKeyword.trim().toLowerCase()
    if (kw && !keywords.includes(kw)) {
      setKeywords([...keywords, kw])
      setNewKeyword('')
    }
  }

  const removeKeyword = (kw: string) => {
    setKeywords(keywords.filter((k) => k !== kw))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dm_general_enabled: String(generalEnabled),
          dm_keyword_enabled: String(keywordEnabled),
          dm_general_message: generalMessage,
          dm_keyword_message: keywordMessage,
          dm_keywords: keywords.join(','),
        }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error('Kayıt hatası:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">

      {/* Genel DM — Her Yorum */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Her Yoruma Otomatik DM</h2>
              <p className="text-slate-500 text-sm">Biri yorum yazdığında herkese DM gider</p>
            </div>
          </div>
          <button
            onClick={() => setGeneralEnabled(!generalEnabled)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              generalEnabled
                ? 'bg-blue-500 text-white'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {generalEnabled ? 'Açık' : 'Kapalı'}
          </button>
        </div>

        {generalEnabled && (
          <div className="p-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              DM Mesajı
            </label>
            <textarea
              value={generalMessage}
              onChange={(e) => setGeneralMessage(e.target.value)}
              rows={8}
              className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <p className="text-slate-400 text-xs mt-2">{generalMessage.length} / 1000 karakter</p>
          </div>
        )}
      </div>

      {/* Anahtar Kelime DM */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Anahtar Kelime DM</h2>
              <p className="text-slate-500 text-sm">"fiyat", "booking" gibi kelimeler geçince DM gider</p>
            </div>
          </div>
          <button
            onClick={() => setKeywordEnabled(!keywordEnabled)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              keywordEnabled
                ? 'bg-orange-500 text-white'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {keywordEnabled ? 'Açık' : 'Kapalı'}
          </button>
        </div>

        {keywordEnabled && (
          <div className="p-6 space-y-5">
            {/* Keywords */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Tetikleyici Kelimeler
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {keywords.map((kw) => (
                  <span
                    key={kw}
                    className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-700 text-sm font-medium px-3 py-1 rounded-full border border-orange-100"
                  >
                    {kw}
                    <button
                      onClick={() => removeKeyword(kw)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
                  placeholder="Yeni kelime ekle..."
                  className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
                <button
                  onClick={addKeyword}
                  className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Ekle
                </button>
              </div>
            </div>

            {/* Keyword Message */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Gönderilecek DM
              </label>
              <textarea
                value={keywordMessage}
                onChange={(e) => setKeywordMessage(e.target.value)}
                rows={9}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              <p className="text-slate-400 text-xs mt-2">{keywordMessage.length} / 1000 karakter</p>
            </div>

            {/* Preview */}
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Önizleme</p>
              <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm max-w-xs">
                <p className="text-sm text-slate-800 whitespace-pre-line">{keywordMessage}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Nasıl Çalışır */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
        <p className="font-semibold text-amber-800 mb-2">📌 Nasıl Çalışır?</p>
        <div className="text-amber-700 text-sm space-y-1.5">
          <p>1. Biri Instagram postuna yorum yazar</p>
          <p>2. Yorum "fiyat" veya "booking" gibi bir kelime içeriyorsa → fiyat DM'i gider</p>
          <p>3. "Her yoruma" açıksa → genel tanıtım DM'i gider</p>
          <p>4. Kişi birkaç dakika içinde DM'ini alır</p>
        </div>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 rounded-xl transition-colors"
      >
        {saved ? (
          <><Check className="w-5 h-5" /> Kaydedildi!</>
        ) : saving ? 'Kaydediliyor...' : (
          <><Save className="w-5 h-5" /> Ayarları Kaydet</>
        )}
      </button>
    </div>
  )
}
