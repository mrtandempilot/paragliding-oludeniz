import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Paramotor Equipment Turkey | PPG Gear for Hot Conditions',
  description: 'Paramotor equipment guide for flying in Turkey. Wing selection, motor choice, harness and accessories for hot-weather PPG flying near Ölüdeniz.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/paramotor/equipment' },
}

export default function ParamotorEquipmentPage() {
  return (
    <>
      <PageHero title="Paramotor Equipment Guide" subtitle="Choosing the right gear for paramotor flying in the Turkish climate." badge="Equipment" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Paramotor', href: '/paramotor' }, { label: 'Equipment' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <p className="text-slate-600 leading-relaxed mb-8">Flying paramotor in southern Turkey's heat requires some specific equipment considerations. The high summer temperatures affect motor performance, wing handling, and pilot comfort significantly compared to flying in northern Europe.</p>

          <div className="space-y-6">
            {[
              {
                category: 'Wing (Canopy)',
                emoji: '🪂',
                items: [
                  { name: 'EN-A / EN-B PPG Wings', recommended: true, note: 'Most suitable for the Fethiye region conditions. Forgiving in the thermic afternoon air.' },
                  { name: 'High-aspect XC wings', recommended: false, note: 'Not recommended for beginners in thermically active conditions.' },
                  { name: 'Reflex wings', recommended: true, note: 'Good choice for faster cruise speeds — better for coastal flights in sea-breeze conditions.' },
                ],
                tip: 'In summer, fly a wing 0.5–1 size larger than usual for your weight. Hot air is less dense, so you\'ll be flying at a higher effective all-up weight.',
              },
              {
                category: 'Motor Unit',
                emoji: '⚙️',
                items: [
                  { name: 'Single cylinder 80–130cc', recommended: true, note: 'Adequate for most pilots up to 85kg in sea-level conditions.' },
                  { name: 'Twin cylinder 200cc+', recommended: true, note: 'Better power reserve in high-temperature conditions where single-cylinder performance drops.' },
                  { name: 'Electric paramotor', recommended: false, note: 'Range limitations make long coastal flights impractical with current battery technology.' },
                ],
                tip: 'In summer temperatures above 35°C, budget for 15–20% power reduction in single-cylinder motors. The Fethiye area\'s sea-level altitude means this is less critical than in mountainous regions.',
              },
              {
                category: 'Pilot Clothing & Comfort',
                emoji: '👕',
                items: [
                  { name: 'Lightweight summer suit', recommended: true, note: 'Thin, breathable full-body suit. Protects from prop wash and sun.' },
                  { name: 'Full winter gear', recommended: false, note: 'Far too hot for summer flying in Turkey.' },
                  { name: 'Hydration system', recommended: true, note: 'Essential for flights over 30 minutes in summer heat.' },
                ],
                tip: 'Fly early morning. Once ground temperature exceeds 30°C, conditions become increasingly turbulent and physically demanding for the pilot.',
              },
            ].map(cat => (
              <div key={cat.category} className="card p-6">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><span>{cat.emoji}</span> {cat.category}</h3>
                <div className="space-y-3 mb-4">
                  {cat.items.map(item => (
                    <div key={item.name} className="flex items-start gap-3">
                      <span className={`mt-1 text-lg flex-shrink-0 ${item.recommended ? 'text-green-500' : 'text-red-400'}`}>{item.recommended ? '✓' : '✗'}</span>
                      <div>
                        <span className="font-medium text-slate-800 text-sm">{item.name}</span>
                        <p className="text-slate-500 text-xs mt-0.5">{item.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-800"><strong>Tip:</strong> {cat.tip}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
