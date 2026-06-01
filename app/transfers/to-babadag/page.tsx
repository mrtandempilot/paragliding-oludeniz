import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Getting to Babadağ Launch | Transport from Ölüdeniz',
  description: 'How to get from Ölüdeniz to the Babadağ paragliding launch. Cable car, minibus, private car options and what is included in tandem flight packages.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/transfers/to-babadag' },
}

export default function ToBabadagPage() {
  return (
    <>
      <PageHero title="Getting to Babadağ Launch" subtitle="Transport options from Ölüdeniz village up to the 1700m paragliding launch area." badge="Launch Transfer" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Transfers', href: '/transfers' }, { label: 'To Babadağ' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-8 text-sm text-green-800">
            <strong>Tandem passengers:</strong> Your transfer to the launch is included in your tandem flight package. Your operator handles hotel pickup, transport to the mountain, and the return transfer after landing. You don't need to arrange anything separately.
          </div>
          <div className="space-y-5">
            {[
              { title: 'Cable Car (Teleferik)', emoji: '🚡', desc: 'The most scenic option — the Babadağ teleferik takes you from the base station (2km from Ölüdeniz beach) to the 1700m launch plateau in about 10 minutes. Operates daily in season. Tickets purchased at the base station or online via QR code. Equipment can be transported in the gondolas.' },
              { title: 'Tandem Operator Minibus', emoji: '🚐', desc: 'Most tandem paragliding packages include hotel pickup by minibus. The minibus either takes you directly up the mountain road to the 1700m launch, or transfers you to the teleferik base station. Confirm which route with your operator when booking.' },
              { title: 'Babadağ Association Minibus', emoji: '🏔️', desc: 'The Association operates a minibus service between the cable car base station and the 1700m launch for pilots and passengers. Useful if you take the teleferik up but need to access a different launch level.' },
              { title: 'Private Vehicle / Rental Car', emoji: '🚗', desc: 'Solo pilots with rental cars can drive the mountain road directly to the 1700m car park. Allow 25–30 minutes from Ölüdeniz. Parking is limited — arrive early in peak season. The road is paved throughout but steep and narrow in sections.' },
            ].map(item => (
              <div key={item.title} className="card p-5">
                <div className="flex gap-3 items-start">
                  <span className="text-2xl">{item.emoji}</span>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
