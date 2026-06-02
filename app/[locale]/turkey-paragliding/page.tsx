import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'

export const metadata: Metadata = {
  title: 'Paragliding in Turkey | Why Ölüdeniz is Turkey\'s Best Site',
  description: 'Paragliding in Turkey — comparing the top sites. Why Ölüdeniz and Babadağ Mountain consistently rank as Turkey\'s best and most famous paragliding destination.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/turkey-paragliding' },
}

const sites = [
  { name: 'Ölüdeniz (Babadağ)', region: 'Aegean Coast', altitude: '1,969m', rating: 5, notes: 'World-class. Best infrastructure, scenery and conditions in Turkey.' },
  { name: 'Kaş', region: 'Mediterranean', altitude: '~800m', rating: 4, notes: 'Beautiful coastal site. Good XC terrain but less altitude than Babadağ.' },
  { name: 'Antalya (Tünektepe)', region: 'Mediterranean', altitude: '600m', rating: 3, notes: 'Popular tandem site near Antalya city. Good for beginners, lower altitude.' },
  { name: 'Pamukkale', region: 'Inland Aegean', altitude: '~400m', rating: 3, notes: 'Unique landscape over the travertine terraces. Lower altitude, calmer conditions.' },
  { name: 'Cappadocia', region: 'Central Anatolia', altitude: 'Flatland', rating: 3, notes: 'Hot air balloon destination — not a primary paragliding site.' },
]

export default function TurkeyParaglidingPage() {
  return (
    <>
      <PageHero title="Paragliding in Turkey" subtitle="Turkey has several great paragliding sites — but one stands above them all." badge="Turkey Guide" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Turkey Paragliding' }]} /></div></div>

      <section className="section-padding bg-white">
        <div className="container-default max-w-4xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Turkey's Top Paragliding Sites Compared</h2>
          <p className="text-slate-600 leading-relaxed mb-8">Turkey is one of the world's great paragliding destinations. Its combination of Mediterranean climate, varied terrain, and long coastlines with high mountains makes it ideal for the sport. But not all sites are equal — here's how the main ones compare.</p>

          <div className="card overflow-hidden mb-10">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>{['Site', 'Region', 'Launch Alt.', 'Rating', 'Notes'].map(h => <th key={h} className="text-left px-4 py-3 font-semibold text-slate-700">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sites.map((s, i) => (
                    <tr key={s.name} className={i === 0 ? 'bg-orange-50' : 'hover:bg-slate-50'}>
                      <td className="px-4 py-3 font-semibold text-slate-900">{s.name}{i === 0 && <span className="ml-2 text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">Best</span>}</td>
                      <td className="px-4 py-3 text-slate-600">{s.region}</td>
                      <td className="px-4 py-3 text-slate-600">{s.altitude}</td>
                      <td className="px-4 py-3">{'★'.repeat(s.rating)}{'☆'.repeat(5 - s.rating)}</td>
                      <td className="px-4 py-3 text-slate-600 text-xs">{s.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-4">Why Ölüdeniz Wins</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {['Highest launch altitude in Turkey at 1,969m', '300+ flyable days per year', 'Only site with dedicated XC and acro infrastructure', 'Annual Air Games attract 60+ countries', 'World-famous Blue Lagoon landing zone', 'Cable car access to launch — no mountain driving needed', 'Full pilot services, equipment, rescue on site', '30+ years of established safety record'].map(r => (
              <div key={r} className="flex gap-2 text-sm text-slate-700"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />{r}</div>
            ))}
          </div>

          <Link href="/book-now" className="btn-primary">Book the Best in Turkey <ArrowRight className="w-5 h-5" /></Link>
        </div>
      </section>
      <section className="py-16 bg-white"><div className="container-default max-w-2xl"><BookingCTA /></div></section>
    </>
  )
}
