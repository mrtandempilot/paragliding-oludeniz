'use client'

import { useEffect, useRef, useState } from 'react'
import { X, Download, Copy, Plus, Trash2 } from 'lucide-react'

interface Booking {
  id: string
  created_at: string
  first_name: string
  last_name: string
  email: string
  phone: string
  flight_type: string
  flight_date: string
  guests: number
  addon_photo: boolean
  addon_video: boolean
  addon_bundle: boolean
  base_price: number
  addon_price: number
  total_price: number
  notes: string
  status: string
}

interface ExtraItem {
  label: string
  qty: number
  price: number
}

const FLIGHT_LABELS: Record<string, string> = {
  standard: 'Tandem Paragliding Flight — Standard (1200m)',
  high: 'Tandem Paragliding Flight — High Altitude (1700m)',
  sunset: 'Tandem Paragliding Flight — Sunset',
}

function generateRef(id: string) {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const shortId = (id || '').replace(/-/g, '').slice(-4).toUpperCase() || String(Math.floor(1000 + Math.random() * 9000))
  return `ATP-${y}${m}${day}-${shortId}`
}

function fmtDate(iso: string) {
  if (!iso) return '—'
  const d = new Date(iso.length <= 10 ? iso + 'T00:00:00' : iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
}

export default function TicketModal({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  const ticketRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  const [custName, setCustName] = useState(`${booking.first_name} ${booking.last_name}`.trim())
  const [agency, setAgency] = useState('')
  const [flightDate, setFlightDate] = useState((booking.flight_date || '').slice(0, 10))
  const [flightTime, setFlightTime] = useState('10:00')
  const [pax, setPax] = useState(booking.guests || 1)
  const [ref, setRef] = useState(generateRef(booking.id))
  const [location, setLocation] = useState('Ölüdeniz Beach / Hotel pickup')
  const [flightLabel, setFlightLabel] = useState(FLIGHT_LABELS[booking.flight_type] || booking.flight_type)
  const [flightAmount, setFlightAmount] = useState(booking.base_price || 0)
  const [addonOn, setAddonOn] = useState(!!(booking.addon_bundle || booking.addon_photo || booking.addon_video))
  const [addonAmount, setAddonAmount] = useState(booking.addon_price || 35)
  const [extraItems, setExtraItems] = useState<ExtraItem[]>([])
  const [note, setNote] = useState(booking.notes || '')

  useEffect(() => {
    if ((window as any).html2canvas) { setReady(true); return }
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
    script.async = true
    script.onload = () => setReady(true)
    document.body.appendChild(script)
    return () => { document.body.removeChild(script) }
  }, [])

  const total = flightAmount + (addonOn ? addonAmount : 0) + extraItems.reduce((s, i) => s + i.qty * i.price, 0)

  function addExtra() {
    setExtraItems([...extraItems, { label: '', qty: 1, price: 0 }])
  }
  function updateExtra(idx: number, patch: Partial<ExtraItem>) {
    setExtraItems(extraItems.map((it, i) => (i === idx ? { ...it, ...patch } : it)))
  }
  function removeExtra(idx: number) {
    setExtraItems(extraItems.filter((_, i) => i !== idx))
  }

  async function downloadTicket() {
    const el = ticketRef.current
    const html2canvas = (window as any).html2canvas
    if (!el || !html2canvas) {
      alert('Bilet görseli hazırlanıyor, birkaç saniye sonra tekrar dene.')
      return
    }
    const canvas = await html2canvas(el, { scale: 2, backgroundColor: '#ffffff', useCORS: true })
    const link = document.createElement('a')
    link.download = `${ref}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  function copyAsText() {
    let text = `*ATMOS PARAGLIDING — BOOKING VOUCHER*\n`
    text += `Ref: ${ref}\n`
    text += `Passenger: ${custName}\n`
    if (agency) text += `Agency: ${agency}\n`
    text += `Date: ${fmtDate(flightDate)}${flightTime ? ' · ' + flightTime : ''}\n`
    text += `Pax: ${pax}\n`
    text += `Meeting point: ${location}\n\n`
    text += `- ${flightLabel} x${pax}: $${flightAmount.toFixed(0)}\n`
    if (addonOn) text += `- Photo & Video Package x${pax}: $${addonAmount.toFixed(0)}\n`
    extraItems.forEach(it => {
      if (it.label && it.qty > 0) text += `- ${it.label} x${it.qty}: $${(it.qty * it.price).toFixed(0)}\n`
    })
    text += `\n*Total: $${total.toFixed(0)}*\n\n`
    text += `No payment required now — pay in cash on the day of the flight.\n`
    text += `+90 536 461 6674 · atmosparagliding.com`

    navigator.clipboard.writeText(text).then(
      () => alert('WhatsApp metni panoya kopyalandı ✅'),
      () => prompt('Kopyalamak için metni seç:', text)
    )
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start sm:items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-5xl my-6 shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="font-bold text-slate-900 text-lg">🎫 Bilet Bas — {booking.first_name} {booking.last_name}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 p-6">
          {/* Form */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Müşteri Adı</label>
              <input value={custName} onChange={e => setCustName(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Acente (opsiyonel)</label>
              <input value={agency} onChange={e => setAgency(e.target.value)} placeholder="Örn: Sunworld Travel" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Tarih</label>
                <input type="date" value={flightDate} onChange={e => setFlightDate(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Saat</label>
                <input type="time" value={flightTime} onChange={e => setFlightTime(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Kişi Sayısı</label>
                <input type="number" min={1} value={pax} onChange={e => setPax(parseInt(e.target.value) || 1)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Bilet No</label>
                <input value={ref} onChange={e => setRef(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Buluşma / Pickup Yeri</label>
              <input value={location} onChange={e => setLocation(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Uçuş Kalemi</label>
              <input value={flightLabel} onChange={e => setFlightLabel(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Uçuş Fiyatı (toplam, $)</label>
              <input type="number" min={0} value={flightAmount} onChange={e => setFlightAmount(parseFloat(e.target.value) || 0)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
            </div>

            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5">
              <input type="checkbox" checked={addonOn} onChange={e => setAddonOn(e.target.checked)} className="w-4 h-4 accent-orange-500" />
              <span className="flex-1 text-sm font-semibold">Foto &amp; Video Paketi</span>
              <input type="number" min={0} value={addonAmount} onChange={e => setAddonAmount(parseFloat(e.target.value) || 0)} className="w-24 border border-slate-200 rounded-lg px-2 py-1.5 text-sm" />
            </div>

            {extraItems.map((it, idx) => (
              <div key={idx} className="grid grid-cols-[1fr_56px_72px_auto] gap-1.5 items-center">
                <input placeholder="Kalem (örn. Transfer)" value={it.label} onChange={e => updateExtra(idx, { label: e.target.value })} className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm" />
                <input type="number" min={1} placeholder="Adet" value={it.qty} onChange={e => updateExtra(idx, { qty: parseFloat(e.target.value) || 0 })} className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm" />
                <input type="number" min={0} placeholder="$" value={it.price} onChange={e => updateExtra(idx, { price: parseFloat(e.target.value) || 0 })} className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm" />
                <button onClick={() => removeExtra(idx)} className="text-red-600 hover:bg-red-50 rounded-lg p-1.5">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button onClick={addExtra} className="w-full flex items-center justify-center gap-1.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg py-2">
              <Plus className="w-4 h-4" /> Ekstra Kalem Ekle
            </button>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Not (opsiyonel)</label>
              <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
            </div>

            <button onClick={downloadTicket} className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg mt-2">
              <Download className="w-4 h-4" /> Bileti Görsel Olarak İndir
            </button>
            <button onClick={copyAsText} className="w-full flex items-center justify-center gap-2 bg-sky-700 hover:bg-sky-800 text-white font-semibold py-2.5 rounded-lg">
              <Copy className="w-4 h-4" /> WhatsApp Metni Olarak Kopyala
            </button>
            <p className="text-xs text-slate-400 leading-relaxed">
              İndirilen görseli WhatsApp&apos;tan gönderebilirsin. Fiyatları serbestçe değiştirebilirsin.
            </p>
          </div>

          {/* Ticket preview */}
          <div className="bg-slate-100 rounded-xl p-4 sm:p-6 flex items-start justify-center overflow-x-auto">
            <div ref={ticketRef} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200 w-[480px] flex-shrink-0">
              <div className="bg-gradient-to-br from-brand-dark via-[#1e3a5f] to-brand-blue px-6 py-5 flex items-center gap-4 text-white">
                <img src="/images/logo.jpg" alt="Atmos Paragliding" className="w-12 h-12 rounded-lg object-cover shadow" />
                <div>
                  <div className="text-lg font-extrabold tracking-wide">ATMOS PARAGLIDING</div>
                  <div className="text-xs text-slate-300 mt-0.5">Tandem Paragliding · Ölüdeniz, Turkey</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-orange-400">Booking Voucher</div>
                  <div className="text-sm font-bold mt-0.5">{ref}</div>
                </div>
              </div>

              <div className="px-6 pt-5 pb-2">
                <div className="grid grid-cols-2 gap-3.5 pb-4 mb-4 border-b border-dashed border-slate-200">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Passenger</div>
                    <div className="text-sm font-semibold text-slate-900">{custName || '—'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Agency</div>
                    <div className="text-sm font-semibold text-slate-900">{agency || '—'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Date &amp; Time</div>
                    <div className="text-sm font-semibold text-slate-900">{fmtDate(flightDate)}{flightTime ? ` · ${flightTime}` : ''}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Passengers</div>
                    <div className="text-sm font-semibold text-slate-900">{pax} {pax > 1 ? 'people' : 'person'}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Meeting Point</div>
                    <div className="text-sm font-semibold text-slate-900">{location || '—'}</div>
                  </div>
                </div>

                <table className="w-full mb-1">
                  <thead>
                    <tr className="border-b-2 border-slate-900">
                      <th className="text-left text-[10px] font-bold uppercase tracking-wide text-slate-400 pb-2">Item</th>
                      <th className="text-right text-[10px] font-bold uppercase tracking-wide text-slate-400 pb-2">Qty</th>
                      <th className="text-right text-[10px] font-bold uppercase tracking-wide text-slate-400 pb-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="py-2 text-sm">{flightLabel}</td>
                      <td className="py-2 text-sm text-right">{pax}</td>
                      <td className="py-2 text-sm text-right">${flightAmount.toFixed(0)}</td>
                    </tr>
                    {addonOn && (
                      <tr className="border-b border-slate-100">
                        <td className="py-2 text-sm">Photo &amp; Video Package</td>
                        <td className="py-2 text-sm text-right">{pax}</td>
                        <td className="py-2 text-sm text-right">${addonAmount.toFixed(0)}</td>
                      </tr>
                    )}
                    {extraItems.filter(it => it.label && it.qty > 0).map((it, idx) => (
                      <tr key={idx} className="border-b border-slate-100">
                        <td className="py-2 text-sm">{it.label}</td>
                        <td className="py-2 text-sm text-right">{it.qty}</td>
                        <td className="py-2 text-sm text-right">${(it.qty * it.price).toFixed(0)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td className="pt-3.5 text-xs font-bold uppercase tracking-wide text-slate-400">Total</td>
                      <td></td>
                      <td className="pt-3.5 text-lg font-extrabold text-right text-slate-900">${total.toFixed(0)}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="mt-1.5 mb-1 flex gap-2 items-start bg-emerald-50 border border-emerald-200 rounded-lg px-3.5 py-3 text-emerald-700 text-sm font-semibold">
                  <span>✅</span>
                  <span>No payment required now — full amount payable in cash on the day of the flight.</span>
                </div>
                {note && <div className="text-xs text-slate-500 mt-2">Note: {note}</div>}
              </div>

              <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">
                <div>📞 <strong className="text-slate-900">+90 536 461 6674</strong></div>
                <div>✉️ <strong className="text-slate-900">info@paragliding-oludeniz.com</strong></div>
                <div>🌐 <strong className="text-slate-900">atmosparagliding.com</strong></div>
              </div>
              <div className="text-center py-3.5 px-6 text-sm font-bold text-sky-700">
                Thank you for choosing Atmos Paragliding — Fly high over the Blue Lagoon! 🪂
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
