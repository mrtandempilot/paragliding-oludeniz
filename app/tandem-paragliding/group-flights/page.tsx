import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Users, CheckCircle } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'

export const metadata: Metadata = {
  title: 'Group Paragliding Ölüdeniz | Group Flights & Discounts',
  description: 'Group paragliding packages in Ölüdeniz. Flights for families, friends, hen/stag parties and corporate groups. Discounts for 4+ people. Easy group booking.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/tandem-paragliding/group-flights' },
}

export default function GroupFlightsPage() {
  return (
    <>
      <PageHero title="Group Paragliding Flights" subtitle="Fly together. Special rates for groups of 4 or more — families, friends, team events." badge="Group Packages" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Tandem Paragliding', href: '/tandem-paragliding' }, { label: 'Group Flights' }]} /></div></div>

      <section className="section-padding bg-white">
        <div className="container-default max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">The Perfect Group Adventure</h2>
              <p className="text-slate-600 leading-relaxed mb-4">Paragliding in Ölüdeniz is one of the best group activities you can do on the Turquoise Coast. Whether it's a family holiday, a group of friends, a hen or stag party, or a corporate event — flying together over the Blue Lagoon creates memories that last a lifetime.</p>
              <p className="text-slate-600 leading-relaxed mb-6">We operate multiple tandem gliders simultaneously and can accommodate groups of any size. Everyone launches within a short window so you're all in the air at the same time, watching each other fly.</p>

              <div className="space-y-3 mb-8">
                {[
                  { size: '4–7 guests', discount: '10% discount', rate: 'Standard rate minus 10%' },
                  { size: '8–15 guests', discount: '15% discount', rate: 'Best value group rate' },
                  { size: '16+ guests', discount: 'Custom quote', rate: 'Contact us for bespoke pricing' },
                ].map(g => (
                  <div key={g.size} className="card p-4 flex justify-between items-center">
                    <div><p className="font-semibold text-slate-900">{g.size}</p><p className="text-sm text-slate-500">{g.rate}</p></div>
                    <span className="bg-green-100 text-green-700 font-bold text-sm px-3 py-1 rounded-full">{g.discount}</span>
                  </div>
                ))}
              </div>

              <Link href="/contact" className="btn-primary">Get a Group Quote <ArrowRight className="w-5 h-5" /></Link>
            </div>

            <div className="space-y-4">
              <div className="card p-5">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><Users className="w-5 h-5 text-orange-500" /> What We Handle</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  {['Coordinating multiple simultaneous flights', 'Group transfer to and from Babadağ', 'Individual pilot briefings for each guest', 'Photo and video packages for the whole group', 'Flexible scheduling for your group\'s plans', 'Special launch timing so you all fly together'].map(i => <li key={i} className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />{i}</li>)}
                </ul>
              </div>
              <div className="card p-5">
                <h3 className="font-bold text-slate-900 mb-3">Popular Group Types</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['Family holidays', 'Hen parties', 'Stag groups', 'Birthday trips', 'Corporate events', 'School groups', 'Sports clubs', 'Tour groups'].map(t => <span key={t} className="bg-slate-100 text-slate-700 text-xs px-3 py-1.5 rounded-lg text-center">{t}</span>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-white"><div className="container-default max-w-2xl"><BookingCTA title="Book Your Group Flight" subtitle="Contact us for group pricing and availability. We'll handle everything." /></div></section>
    </>
  )
}
