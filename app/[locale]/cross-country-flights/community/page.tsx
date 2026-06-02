import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'XC Paragliding Community Ölüdeniz | Babadağ Pilot Groups',
  description: 'Connect with the XC paragliding community in Ölüdeniz. Weekly XC days, Telegram groups, local pilot contacts and where pilots meet.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/cross-country-flights/community' },
}

export default function XCCommunityPage() {
  return (
    <>
      <PageHero title="XC Pilot Community" subtitle="Connect with the cross country paragliding community in Ölüdeniz and Babadağ." badge="XC Community" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Cross Country Flights', href: '/cross-country-flights' }, { label: 'Community' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Weekly XC Days', emoji: '📅', desc: 'The Babadağ XC community organises informal XC group days, typically on Tuesdays and Thursdays during summer. All experience levels welcome. Meet at the 1700m launch at 09:00. Ask at the Babadağ Association office for current schedule.' },
              { title: 'Telegram Group', emoji: '💬', desc: 'The primary communication channel for Babadağ pilots. Weather discussions, XC day planning, landing zone reports and general pilot chat. Ask at the Association office for the current group link — it changes periodically.' },
              { title: 'Pilot Cafes', emoji: '☕', desc: 'Two cafes at the 1700m area are pilot hubs. Most XC planning conversations happen over coffee here before the morning\'s first thermal. A great place to find local beta and meet experienced pilots.' },
              { title: 'XC Record Board', emoji: '🏆', desc: 'The XC distance records for Babadağ are tracked informally in the pilot community. Current season records are discussed daily. If you fly a big XC, share it on the Telegram group with your XContest tracklog.' },
              { title: 'WhatsApp Groups', emoji: '📱', desc: 'Several WhatsApp groups exist for different sub-communities — tandem pilots, acro pilots, XC pilots, and international visitor groups. Ask local pilots for relevant invitations on arrival.' },
              { title: 'Evening Meetups', emoji: '🍺', desc: 'Pilot social evenings happen regularly in Ölüdeniz town, usually Thursday evenings. Venue changes — check the Telegram group. A relaxed way to meet the local and international pilot community.' },
            ].map(item => (
              <div key={item.title} className="card p-5">
                <span className="text-2xl mb-3 block">{item.emoji}</span>
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
