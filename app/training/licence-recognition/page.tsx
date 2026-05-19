import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Paragliding Licence Recognition Turkey | Foreign Pilots at Babadağ',
  description: 'Are foreign paragliding licences recognised at Babadağ? BHPA, FFVL, DHV, DULV and other European licences at Ölüdeniz — what is accepted and what you need to fly.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/training/licence-recognition' },
}

export default function LicenceRecognitionPage() {
  return (
    <>
      <PageHero title="Licence Recognition at Babadağ" subtitle="Which foreign paragliding licences are accepted at Ölüdeniz — what you need to fly solo." badge="Licence Info" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Training', href: '/training' }, { label: 'Licence Recognition' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-8">
            <p className="text-green-800 text-sm"><strong>Good News for Visiting Pilots:</strong> The Babadağ Association accepts most major European national association licences for recreational solo flying. Turkish law requires pilots to carry their licence and insurance documentation — but a Turkish licence is generally not required for foreign recreational pilots.</p>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-5">Recognised Licences</h2>
          <div className="space-y-3 mb-10">
            {[
              { org: 'BHPA (UK)', licence: 'Club Pilot (CP) / Pilot', status: 'Accepted', note: 'Most common European licence at Babadağ.' },
              { org: 'FFVL (France)', licence: 'Brevet Initial / Brevet de Pilote', status: 'Accepted', note: 'French national federation licence.' },
              { org: 'DHV (Germany)', licence: 'A-Schein / Gleitschirmpilot', status: 'Accepted', note: 'German national authority licence.' },
              { org: 'DULV (Germany)', licence: 'Gleitschirmführerschein', status: 'Accepted', note: 'German private association licence.' },
              { org: 'CIVL/FAI', licence: 'Sporting Licence', status: 'Accepted', note: 'International federation licence.' },
              { org: 'SHGM (Turkey)', licence: 'Yamaç Paraşütü Pilotu', status: 'Native', note: 'Turkish national licence — always accepted.' },
              { org: 'Other European national associations', licence: 'National pilot licence', status: 'Usually accepted', note: 'Check with Association on arrival.' },
            ].map(item => (
              <div key={item.org} className="card p-4 flex justify-between items-center">
                <div>
                  <span className="font-semibold text-slate-900">{item.org}</span>
                  <span className="text-slate-500 text-sm ml-2">({item.licence})</span>
                  <p className="text-slate-400 text-xs mt-0.5">{item.note}</p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${item.status === 'Accepted' || item.status === 'Native' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{item.status}</span>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {[
              { title: 'What to Bring', desc: 'Carry your original licence card, proof of insurance (your national association membership card usually covers this), and your logbook. The Babadağ Association checks documentation when issuing your pilot pass. Copies may not be accepted for insurance purposes — bring originals.' },
              { title: 'Pilot Pass Purchase', desc: 'All solo pilots flying from Babadağ must purchase a daily or weekly pilot pass from the Association office. The pass fee contributes to site maintenance, launch coordination, and rescue services. The pass is not issued without valid licence documentation.' },
              { title: 'Insurance Requirements', desc: 'Third-party liability insurance is legally required. Your home association\'s membership usually includes this for flying abroad (BHPA, FFVL, DHV all cover Turkey). Verify your policy covers Turkey before travelling. Without insurance, you cannot legally fly and may not be issued a pilot pass.' },
            ].map(item => (
              <div key={item.title} className="card p-5">
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
