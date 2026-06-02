import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'

export const metadata: Metadata = {
  title: 'Sunset Paragliding Ölüdeniz | Golden Hour Blue Lagoon',
  description: 'Watch the sun set over the Blue Lagoon from 1,200m during a tandem sunset paragliding flight in Ölüdeniz. Limited slots — book early.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/tandem-paragliding/sunset-flight' },
}

export default function SunsetFlightPage() {
  return (
    <>
      <PageHero title="Sunset Paragliding Flight" subtitle="Watch the sun set over the Blue Lagoon from 1,200 metres. The most magical experience in Ölüdeniz." badge="Premium Sunset" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Tandem Paragliding', href: '/tandem-paragliding' }, { label: 'Sunset Flight' }]} /></div></div>

      <section className="section-padding bg-white">
        <div className="container-default max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-12">
            <div>
              <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">Premium Experience</span>
              <h2 className="text-3xl font-bold text-slate-900 mt-2 mb-4">The Golden Hour from 1,200m</h2>
              <p className="text-slate-600 leading-relaxed mb-4">The sunset tandem flight is the most requested and most talked-about experience we offer. As the sun drops toward the horizon, the Blue Lagoon turns from turquoise to bronze, the mountains glow amber, and the entire Fethiye Bay is bathed in golden light.</p>
              <p className="text-slate-600 leading-relaxed mb-6">Evening flights also tend to have calmer, smoother air as the thermals fade — ideal if you want a gentle, peaceful flight rather than an active one. Many guests describe it as the most beautiful 25 minutes of their lives.</p>
              <div className="flex items-center gap-2 mb-6"><Star className="w-5 h-5 text-yellow-400 fill-yellow-400" /><span className="text-slate-700 font-medium">Rated our most popular premium experience</span></div>
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
                <p className="font-bold text-orange-800 mb-1">⚠️ Limited Slots</p>
                <p className="text-orange-700 text-sm">Only 6–8 sunset flights per day. These sell out weeks in advance in peak season (July–September). Book early.</p>
              </div>
              <Link href="/book-now" className="btn-primary">Book Sunset Flight — €110 <ArrowRight className="w-5 h-5" /></Link>
            </div>
            <div className="space-y-4">
              <div className="card p-5">
                <h3 className="font-bold text-slate-900 mb-3">What's Included</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  {['Certified tandem pilot', 'All safety equipment', 'Transfer to Babadağ launch', 'Professional photo package (included in sunset price)', '20–30 minute golden hour flight', 'Landing on Ölüdeniz beach'].map(i => <li key={i} className="flex gap-2"><span className="text-green-500">✓</span>{i}</li>)}
                </ul>
              </div>
              <div className="card p-5">
                <h3 className="font-bold text-slate-900 mb-3">Timing</h3>
                <div className="space-y-2 text-sm text-slate-600">
                  <p><strong>Departure:</strong> Approx. 2 hours before sunset (varies by season)</p>
                  <p><strong>Flight:</strong> Launch timed to catch golden hour descent</p>
                  <p><strong>Landing:</strong> At or just after sunset on the beach</p>
                  <p><strong>Season:</strong> May–October</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-white"><div className="container-default max-w-2xl"><BookingCTA title="Reserve Your Sunset Flight" subtitle="Limited to 6–8 flights per day. Early booking strongly recommended." /></div></section>
    </>
  )
}
