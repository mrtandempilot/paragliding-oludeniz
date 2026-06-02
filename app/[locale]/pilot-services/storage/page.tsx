import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Equipment Storage Babadağ | Paragliding Gear Ölüdeniz',
  description: 'Equipment storage facilities at Babadağ for visiting paraglider pilots. Daily and weekly storage rates, security, access hours and what can be stored.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/pilot-services/storage' },
}

export default function StoragePage() {
  return (
    <>
      <PageHero title="Equipment Storage" subtitle="Secure storage for your paragliding gear at the Babadağ 1700m launch area." badge="Storage" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Pilot Services', href: '/pilot-services' }, { label: 'Storage' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <p className="text-slate-600 leading-relaxed mb-8">Visiting solo pilots who are staying in Ölüdeniz for multiple days can store their paragliding equipment at the Babadağ Association storage facility at the 1700m launch area. This avoids carrying a full paragliding kit up and down the mountain each day.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            {[
              { title: 'What Can Be Stored', emoji: '🎒', desc: 'Paraglider bag (wing + harness + reserve), helmet, and personal gear bags. The facility is designed for full paragliding kit — large items are accepted. Fragile items (instruments, electronics) stored at your own risk.' },
              { title: 'Security', emoji: '🔒', desc: 'The storage area is locked when the Association office is closed. A pilot number system tracks stored equipment. No incidents of theft have been reported. Valuable electronics are best carried with you each day.' },
              { title: 'Access Hours', emoji: '🕐', desc: 'Storage is accessible during Association office hours — typically 08:00–18:00 in season. You will need to collect your equipment before the office closes each evening if you want to fly the following morning without waiting.' },
              { title: 'Rates', emoji: '💰', desc: 'Daily and weekly storage rates are set by the Babadağ Association and charged at a nominal fee. Confirm current rates at the Association office on arrival — they change seasonally. Association members typically receive a discount.' },
            ].map(item => (
              <div key={item.title} className="card p-5">
                <span className="text-2xl mb-3 block">{item.emoji}</span>
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
            <h3 className="font-bold text-slate-900 mb-2">Alternative: Hotel Storage</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Many hotels and pensions in Ölüdeniz village are accustomed to hosting paragliding guests and have storage areas for equipment bags. If your accommodation offers this, it may be more convenient than storing at the launch — particularly if your hotel offers minibus transport to the launch each morning.</p>
          </div>
        </div>
      </section>
    </>
  )
}
