import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import FAQAccordion from '@/components/shared/FAQAccordion'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'BASE Jump Ölüdeniz | Babadağ Cliff Jumping Turkey',
  description: 'BASE jumping at Babadağ, Ölüdeniz. Exit points, permissions, community and safety information for experienced BASE jumpers visiting Turkey.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/base-jump' },
}

const subPages = [
  { href: '/base-jump/exit-points', title: 'Exit Points', desc: 'Known exit points on the Babadağ cliffs and legal status of each.', emoji: '📍' },
  { href: '/base-jump/permissions', title: 'Permissions & Legality', desc: 'Turkish BASE jumping laws, permits required, and how to get authorisation.', emoji: '📋' },
  { href: '/base-jump/community', title: 'BASE Community', desc: 'The small but active BASE jumping community at Ölüdeniz and how to connect.', emoji: '👥' },
]

const faqItems = [
  { question: 'Is BASE jumping legal at Babadağ?', answer: 'BASE jumping in Turkey requires specific permits and must be authorised by the relevant authorities. Jumping without permission is illegal and could result in fines or detention. Always obtain proper authorisation before jumping. Contact the Babadağ Association for current guidance.' },
  { question: 'What is the best exit point on Babadağ?', answer: 'Several cliff faces on the Babadağ massif have been used historically by BASE jumpers. The specific locations and legal status change with regulations. Consult with the local BASE community and verify current permissions before planning any jump.' },
  { question: 'Is Ölüdeniz good for wingsuit BASE?', answer: 'The terrain around Babadağ includes rocky cliff sections that have been used for wingsuit BASE. However, this is an extreme discipline requiring extensive BASE and wingsuit experience. Local conditions and legal status must be verified each season.' },
  { question: 'Are there BASE jump operators in Ölüdeniz?', answer: 'There are no commercial BASE jump operators in the traditional sense. The BASE community here is small and self-organised. Visiting jumpers typically connect through international BASE communities and arrange their own logistics.' },
]

export default function BaseJumpPage() {
  return (
    <>
      <PageHero title="BASE Jumping at Babadağ" subtitle="The vertical cliffs of Babadağ attract experienced BASE jumpers from across Europe." badge="BASE Jump" size="md" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'BASE Jump' }]} /></div></div>

      <section className="section-padding bg-white">
        <div className="container-default max-w-4xl">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-10">
            <p className="text-red-800 text-sm"><strong>Safety Notice:</strong> BASE jumping is one of the most dangerous sports in the world. This page is intended for experienced, licensed BASE jumpers only. Always verify legal status, obtain proper permits, and consult with local experts before attempting any BASE jump. Fatalities occur globally every year in this sport.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start mb-16">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Babadağ for BASE Jumpers</h2>
              <p className="text-slate-600 leading-relaxed mb-4">Babadağ's dramatic cliff faces and 1966m summit have attracted BASE jumpers for years. The mountain's geology includes near-vertical limestone cliff sections that offer clean exits with good clearance and open landing areas below.</p>
              <p className="text-slate-600 leading-relaxed mb-4">The same conditions that make Babadağ exceptional for paragliding — reliable thermals, consistent wind patterns, and dramatic terrain — make it interesting for BASE jumpers who understand these factors.</p>
              <p className="text-slate-600 leading-relaxed">The local jumping community is small but experienced. Visiting jumpers who make contact in advance are welcomed into the community and can benefit from local knowledge about conditions and exits.</p>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Summit Altitude', value: '1,966m' },
                { label: 'Cliff Faces', value: 'Multiple limestone sections' },
                { label: 'Season', value: 'April – October' },
                { label: 'Minimum Experience', value: '200+ BASE jumps recommended' },
                { label: 'Permits Required', value: 'Yes — Turkish authorities' },
                { label: 'Landing Zones', value: 'Multiple options' },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="text-slate-600 text-sm">{item.label}</span>
                  <span className="font-semibold text-slate-900 text-sm">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-6">BASE Jump Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
            {subPages.map(p => (
              <Link key={p.href} href={p.href} className="card p-6 hover:shadow-lg transition-shadow group">
                <span className="text-3xl mb-3 block">{p.emoji}</span>
                <h3 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors mb-2">{p.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{p.desc}</p>
              </Link>
            ))}
          </div>

          <FAQAccordion items={faqItems} title="BASE Jump FAQ" />
        </div>
      </section>

      <BookingCTA title="Explore Ölüdeniz from the Air" subtitle="Not ready for BASE? Experience the same views on a tandem paraglider flight from Babadağ." variant="dark" />
    </>
  )
}
