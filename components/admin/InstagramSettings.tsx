'use client'

import { useState } from 'react'
import { Instagram, MapPin, Check, ToggleLeft, ToggleRight, Save } from 'lucide-react'

// Instagram Graph API Location IDs for key Oludeniz spots
// Get these from: https://www.facebook.com/places/
const LOCATIONS = [
  {
    id: '110580865639319',
    name: 'Ölüdeniz',
    description: 'Blue Lagoon & beach area',
    emoji: '🏖️',
    recommended: true,
  },
  {
    id: '112147865470706',
    name: 'Babadağ Mountain',
    description: 'Launch site, 1960m',
    emoji: '🏔️',
    recommended: false,
  },
  {
    id: '107661259254000',
    name: 'Fethiye',
    description: 'Wider regional reach',
    emoji: '🌊',
    recommended: false,
  },
  {
    id: '102172716466760',
    name: 'Ölüdeniz Beach',
    description: 'Beach & lagoon specific',
    emoji: '🪂',
    recommended: false,
  },
]

interface InstagramSettingsProps {
  initialAutoPost?: boolean
  initialLocationId?: string
  initialRotate?: boolean
}

export default function InstagramSettings({
  initialAutoPost = false,
  initialLocationId = '110580865639319',
  initialRotate = true,
}: InstagramSettingsProps) {
  const [autoPost, setAutoPost] = useState(initialAutoPost)
  const [selectedLocation, setSelectedLocation] = useState(initialLocationId)
  const [rotateLocations, setRotateLocations] = useState(initialRotate)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  const saveSettings = async (overrides?: Partial<{ autoPost: boolean; locationId: string; rotateLocations: boolean }>) => {
    setSaving(true)
    setSaved(false)
    const vals = {
      autoPost,
      locationId: selectedLocation,
      rotateLocations,
      ...overrides,
    }
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ig_auto_post: String(vals.autoPost),
          ig_location_id: vals.locationId,
          ig_rotate_locations: String(vals.rotateLocations),
        }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      console.error('Kayıt hatası:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleToggleAutoPost = () => {
    const next = !autoPost
    setAutoPost(next)
    saveSettings({ autoPost: next })
  }

  const handleSelectLocation = (id: string) => {
    setSelectedLocation(id)
    saveSettings({ locationId: id })
  }

  const handleToggleRotate = () => {
    const next = !rotateLocations
    setRotateLocations(next)
    saveSettings({ rotateLocations: next })
  }

  const handleSave = () => saveSettings()

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
          <Instagram className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-slate-900 text-lg">Instagram Ayarları</h2>
          <p className="text-slate-500 text-sm">Otomatik post ve konum ayarları</p>
        </div>
      </div>

      <div className="p-6 space-y-8">

        {/* Auto Post Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900">Otomatik Post</h3>
            <p className="text-slate-500 text-sm mt-0.5">
              Yeni rezervasyon veya içerik eklendiğinde otomatik olarak paylaş
            </p>
          </div>
          <button
            onClick={handleToggleAutoPost}
            disabled={saving}
            className="flex-shrink-0"
            aria-label="Otomatik postu aç/kapat"
          >
            {autoPost ? (
              <ToggleRight className="w-10 h-10 text-orange-500" />
            ) : (
              <ToggleLeft className="w-10 h-10 text-slate-300" />
            )}
          </button>
        </div>

        {/* Location Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-orange-500" />
            <h3 className="font-semibold text-slate-900">Konum Etiketi</h3>
          </div>
          <p className="text-slate-500 text-sm mb-4">
            Her Instagram postuna otomatik olarak eklenecek konum. Turistler bu konumu tıklayarak seni bulabilir.
          </p>

          {/* Location Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {LOCATIONS.map((loc) => (
              <button
                key={loc.id}
                onClick={() => handleSelectLocation(loc.id)}
                disabled={saving}
                className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedLocation === loc.id
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xl mr-2">{loc.emoji}</span>
                    <span className="font-semibold text-slate-900">{loc.name}</span>
                    {loc.recommended && (
                      <span className="ml-2 text-xs bg-orange-100 text-orange-600 font-medium px-2 py-0.5 rounded-full">
                        Önerilen
                      </span>
                    )}
                    <p className="text-slate-500 text-xs mt-1 ml-8">{loc.description}</p>
                  </div>
                  {selectedLocation === loc.id && (
                    <Check className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Rotate Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <p className="font-medium text-slate-900 text-sm">Konumları Döndür</p>
              <p className="text-slate-500 text-xs mt-0.5">
                Her postda Ölüdeniz → Babadağ → Fethiye sırasıyla değişir (daha geniş erişim)
              </p>
            </div>
            <button
              onClick={handleToggleRotate}
              disabled={saving}
              className="flex-shrink-0 ml-4"
              aria-label="Konum döndürmeyi aç/kapat"
            >
              {rotateLocations ? (
                <ToggleRight className="w-9 h-9 text-orange-500" />
              ) : (
                <ToggleLeft className="w-9 h-9 text-slate-300" />
              )}
            </button>
          </div>
        </div>

        {/* Status bar */}
        <div className={`rounded-xl p-4 transition-colors duration-300 ${
          saved ? 'bg-green-50 border border-green-200' :
          saving ? 'bg-amber-50 border border-amber-200' :
          'bg-blue-50 border border-blue-100'
        }`}>
          <div className="flex items-center justify-between">
            <p className={`text-sm font-medium ${
              saved ? 'text-green-800' : saving ? 'text-amber-800' : 'text-blue-800'
            }`}>
              {saved ? '✅ Kaydedildi!' : saving ? '⏳ Kaydediliyor...' : 'Mevcut Ayar:'}
            </p>
            {!saving && !saved && (
              <button
                onClick={handleSave}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold underline"
              >
                Manuel Kaydet
              </button>
            )}
          </div>
          {!saving && (
            <p className={`text-sm mt-1 ${saved ? 'text-green-700' : 'text-blue-700'}`}>
              {autoPost ? '✅ Otomatik post açık' : '⏸️ Otomatik post kapalı'} —{' '}
              {rotateLocations
                ? 'Konumlar sırayla döner (Ölüdeniz, Babadağ, Fethiye)'
                : `Sabit konum: ${LOCATIONS.find((l) => l.id === selectedLocation)?.name}`}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
