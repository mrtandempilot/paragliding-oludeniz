import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'BASE Jump Exit Points Babadağ | Cliff Locations Ölüdeniz',
  description: 'BASE jumping exit points on Babadağ, Ölüdeniz. Cliff locations, altitudes, clearances and access routes for experienced BASE jumpers.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/base-jump/exit-points' },
}

export default function ExitPointsPage() {
  return (
    <>
      <PageHero title="BASE Exit Points — Babadağ" subtitle="Known cliff faces and exit locations on the Babadağ massif." badge="Exit Points" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'BASE Jump', href: '/base-jump' }, { label: 'Exit Points' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8 text-sm text-red-800">
            <strong>Warning:</strong> Exit point information is provided for reference only. Legal status, safety conditions, and access routes change frequently. Always obtain current, verified information from local jumpers and authorities before jumping from any exit. We accept no responsibility for decisions made based on this information.
          </div>

          <p className="text-slate-600 leading-relaxed mb-8">Babadağ's limestone massif includes several sections with viable BASE exit potential. The mountain's south and southwest faces are the most prominent, with cliff bands at various altitudes between 800m and 1,700m ASL.</p>

          <div className="space-y-5 mb-10">
            {[
              {
                name: 'South Face Upper Cliff Band',
                altitude: '~1,500–1,700m ASL',
                height: 'Approx. 200–350m free fall potential',
                status: 'Historically used — verify permit status',
                desc: 'The highest and most prominent cliff section. Clean limestone faces with good exit clearance. Access via the 1700m launch area. Landing in the valley below. Long opening altitude available.',
              },
              {
                name: 'Mid-Mountain Cliff Section',
                altitude: '~1,100–1,300m ASL',
                height: 'Approx. 100–180m free fall potential',
                status: 'Access route verification required',
                desc: 'Lower cliff band with shorter delay potential. Suitable for lower-delay jumps. Terrain below is mixed — thorough ground reconnaissance essential.',
              },
              {
                name: 'Western Ridge Features',
                altitude: '~900–1,100m ASL',
                height: 'Variable — site survey essential',
                status: 'Terrain survey required',
                desc: 'The western aspects of Babadağ include several rocky features with potential for technical jumps. This area requires thorough on-foot reconnaissance. Not suitable as a first jump at this location.',
              },
            ].map(ep => (
              <div key={ep.name} className="card p-6">
                <h3 className="font-bold text-slate-900 mb-3">{ep.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3 text-sm">
                  <div><span className="text-slate-500">Altitude: </span><span className="font-semibold text-slate-700">{ep.altitude}</span></div>
                  <div><span className="text-slate-500">Object height: </span><span className="font-semibold text-slate-700">{ep.height}</span></div>
                  <div><span className="text-slate-500">Status: </span><span className="font-semibold text-orange-700">{ep.status}</span></div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{ep.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-3">Ground Reconnaissance Essential</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Every exit on Babadağ requires thorough on-foot ground reconnaissance before jumping. Check cliff top edge conditions, potential snag points, and landing zone access. Conditions change after each winter — what was clean one season may not be the next.</p>
          </div>
        </div>
      </section>
    </>
  )
}
