'use client'

import { useEffect, useState } from 'react'
import { ShieldCheck, ShieldAlert, ShieldX, RefreshCw, Users, Image as ImageIcon, ExternalLink } from 'lucide-react'

interface TokenStatus {
  configured: boolean
  valid?: boolean
  expiresAt?: number | null
  daysLeft?: number | null
  neverExpires?: boolean
  username?: string | null
  followersCount?: number | null
  mediaCount?: number | null
  scopes?: string[]
  error?: string
}

export default function TokenStatusWidget() {
  const [status, setStatus] = useState<TokenStatus | null>(null)
  const [loading, setLoading] = useState(true)

  async function fetchStatus() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/instagram/token-status')
      const data = await res.json()
      setStatus(data)
    } catch {
      setStatus({ configured: false, error: 'API\'ye ulaşılamadı' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStatus() }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-3 text-slate-400">
        <RefreshCw className="w-5 h-5 animate-spin" />
        <span className="text-sm">Token durumu kontrol ediliyor...</span>
      </div>
    )
  }

  if (!status) return null

  // Determine visual state
  const isGood = status.configured && status.valid && (status.neverExpires || (status.daysLeft != null && status.daysLeft > 14))
  const isWarning = status.configured && status.valid && status.daysLeft != null && status.daysLeft <= 14 && status.daysLeft > 0
  const isBad = !status.configured || !status.valid || (status.daysLeft != null && status.daysLeft <= 0)

  const colors = isBad
    ? { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-500', text: 'text-red-800', sub: 'text-red-600' }
    : isWarning
    ? { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-500', text: 'text-amber-800', sub: 'text-amber-600' }
    : { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'text-emerald-500', text: 'text-emerald-800', sub: 'text-emerald-600' }

  const Icon = isBad ? ShieldX : isWarning ? ShieldAlert : ShieldCheck

  const statusLabel = !status.configured
    ? 'Token ayarlanmamış'
    : !status.valid
    ? 'Token geçersiz!'
    : status.neverExpires
    ? 'Token geçerli (sonsuz)'
    : status.daysLeft != null && status.daysLeft <= 0
    ? 'Token süresi dolmuş!'
    : isWarning
    ? `Token ${status.daysLeft} gün içinde dolacak — yenile!`
    : `Token geçerli — ${status.daysLeft} gün kaldı`

  return (
    <div className={`rounded-2xl border ${colors.bg} ${colors.border} overflow-hidden`}>
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <Icon className={`w-6 h-6 ${colors.icon}`} />
          <div>
            <p className={`font-semibold text-sm ${colors.text}`}>{statusLabel}</p>
            {status.username && (
              <p className={`text-xs mt-0.5 ${colors.sub}`}>@{status.username}</p>
            )}
            {status.error && (
              <p className={`text-xs mt-0.5 ${colors.sub}`}>{status.error}</p>
            )}
          </div>
        </div>
        <button
          onClick={fetchStatus}
          className={`p-2 rounded-xl hover:bg-white/50 transition-colors ${colors.icon}`}
          title="Yenile"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Stats row */}
      {(status.followersCount != null || status.mediaCount != null) && (
        <div className={`flex gap-6 px-5 pb-4 border-t ${colors.border} pt-3`}>
          {status.followersCount != null && (
            <div className="flex items-center gap-1.5">
              <Users className={`w-3.5 h-3.5 ${colors.icon}`} />
              <span className={`text-sm font-semibold ${colors.text}`}>
                {status.followersCount.toLocaleString('tr-TR')}
              </span>
              <span className={`text-xs ${colors.sub}`}>takipçi</span>
            </div>
          )}
          {status.mediaCount != null && (
            <div className="flex items-center gap-1.5">
              <ImageIcon className={`w-3.5 h-3.5 ${colors.icon}`} />
              <span className={`text-sm font-semibold ${colors.text}`}>{status.mediaCount}</span>
              <span className={`text-xs ${colors.sub}`}>toplam post</span>
            </div>
          )}
        </div>
      )}

      {/* Token yenileme uyarısı */}
      {(isBad || isWarning) && status.configured && (
        <div className={`px-5 pb-4`}>
          <a
            href="https://developers.facebook.com/tools/explorer/"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 text-xs font-semibold underline ${colors.sub}`}
          >
            Facebook Graph API Explorer'da token yenile
            <ExternalLink className="w-3 h-3" />
          </a>
          <p className={`text-xs mt-1 ${colors.sub}`}>
            Yeni token'ı <code className="bg-white/70 px-1 rounded">INSTAGRAM_ACCESS_TOKEN</code> env değişkenine yapıştır ve redeploy yap.
          </p>
        </div>
      )}
    </div>
  )
}
