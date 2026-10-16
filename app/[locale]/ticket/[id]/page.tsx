import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { MapPin, Calendar, Clock, Users, Phone, CheckCircle } from 'lucide-react'
import { MEETING_MAP_URL, fmtTicketDate, ticketRef, timeOf, type TicketBooking } from '@/lib/ticket'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Your Flight Ticket | Atmos Paragliding',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
}

async function getBooking(id: string): Promise<(TicketBooking & { status?: string }) | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null
  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data } = await db.from('bookings').select('*').eq('id', id).maybeSingle()
  return (data as any) || null
}

export default async function TicketPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { id } = await params
  const b = await getBooking(id)
  if (!b) notFound()
  const t = timeOf(b)
  const cancelled = b.status === 'cancelled'

  const Row = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <div className="flex items-start gap-3 py-3 border-b border-dashed border-slate-200 last:border-0">
      <div className="mt-0.5 text-orange-500">{icon}</div>
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</div>
        <div className="text-base font-semibold text-slate-900">{value}</div>
      </div>
    </div>
  )

  return (
    <main className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="mx-auto max-w-md bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200">
        <div className="bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#0369a1] px-6 py-6 text-white">
          <div className="text-xl font-extrabold tracking-wide">ATMOS PARAGLIDING</div>
          <div className="text-xs text-slate-300 mt-0.5">Tandem Paragliding · Ölüdeniz, Turkey</div>
          <div className="mt-4 inline-block rounded-full bg-orange-500 px-3 py-1 text-xs font-bold tracking-widest">
            {cancelled ? 'CANCELLED' : 'FLIGHT TICKET'} · {ticketRef(b)}
          </div>
        </div>

        <div className="px-6 pt-4 pb-2">
          <p className="text-slate-700 py-2">
            <span className="font-bold text-slate-900">{`${b.first_name} ${b.last_name || ''}`.trim()}</span>
          </p>
          <Row icon={<Calendar className="w-5 h-5" />} label="Date" value={fmtTicketDate(b.flight_date)} />
          <Row icon={<Clock className="w-5 h-5" />} label="Time" value={t || 'To be confirmed on WhatsApp'} />
          <Row icon={<Users className="w-5 h-5" />} label="Passengers" value={`${b.guests} ${b.guests === 1 ? 'person' : 'people'}`} />
          <Row icon={<MapPin className="w-5 h-5" />} label="Meeting point" value="Our office in Ölüdeniz — please arrive 15 min early" />

          <a href={MEETING_MAP_URL} target="_blank" rel="noopener" className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-[#0369a1] hover:bg-sky-800 py-3.5 font-bold text-white">
            <MapPin className="w-5 h-5" /> Open meeting point in Maps
          </a>

          <div className="mt-5 rounded-xl bg-slate-50 border border-slate-200 p-4">
            <div className="flex justify-between text-sm text-slate-500"><span>Total</span><span className="text-2xl font-black text-slate-900">${b.total_price}</span></div>
            <p className="mt-2 flex items-start gap-2 text-sm font-semibold text-emerald-700">
              <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /> No payment now — pay on the day of your flight.
            </p>
            <p className="mt-1 text-xs text-slate-500">Includes the transfer up Babadağ, HD photos &amp; video and the mountain fee.</p>
          </div>
        </div>

        <div className="mt-4 bg-slate-50 border-t border-slate-200 px-6 py-4 text-sm text-slate-600 space-y-2">
          <a href="https://wa.me/905364616674" className="flex items-center gap-2 font-semibold text-slate-900"><Phone className="w-4 h-4" /> +90 536 461 6674 (WhatsApp)</a>
          <p className="text-xs">Wear trainers and bring a light jacket. If the wind isn&apos;t safe we&apos;ll move your flight for free or refund you.</p>
        </div>
      </div>
    </main>
  )
}
