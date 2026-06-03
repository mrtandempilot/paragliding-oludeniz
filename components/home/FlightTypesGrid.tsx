import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const flightTypes = [
  {
    title: 'Tandem Paragliding',
    subtitle: 'No experience needed',
    description:
      'Fly with a certified pilot. No experience required — just courage and a sense of adventure.',
    href: '/tandem-paragliding',
    emoji: '🪂',
    badge: 'Most Popular',
    badgeColor: 'bg-orange-500',
    gradient: 'from-sky-500 to-blue-600',
  },
  {
    title: 'Sunset Flights',
    subtitle: 'Golden hour magic',
    description:
      'Watch the sun set over the Blue Lagoon from 1,200 metres in the air. Truly unforgettable.',
    href: '/tandem-paragliding/sunset-flight',
    emoji: '🌅',
    badge: 'Premium',
    badgeColor: 'bg-amber-500',
    gradient: 'from-amber-400 to-orange-500',
  },
  {
    title: 'Solo / XC Flying',
    subtitle: 'Licensed pilots',
    description:
      'Certified pilots can launch from Babadağ and fly cross-country over the Fethiye region.',
    href: '/cross-country-flights',
    emoji: '🏔️',
    badge: 'Licensed Pilots',
    badgeColor: 'bg-emerald-600',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    title: 'Acro Paragliding',
    subtitle: 'Extreme aerobatics',
    description:
      'Ölüdeniz is a world-class acro destination. Watch or join the elite acro community.',
    href: '/acro-flights',
    emoji: '🌀',
    badge: 'Advanced',
    badgeColor: 'bg-purple-600',
    gradient: 'from-purple-500 to-indigo-600',
  },
  {
    title: 'Paramotor',
    subtitle: 'Motorised freedom',
    description:
      'Explore the Ölüdeniz coastline by powered paraglider. Available for flights and training.',
    href: '/paramotor',
    emoji: '⚙️',
    badge: '',
    badgeColor: '',
    gradient: 'from-rose-500 to-pink-600',
  },
  {
    title: 'Group Flights',
    subtitle: 'Fly together',
    description:
      'Coming with friends, family or a corporate group? We handle groups of all sizes.',
    href: '/tandem-paragliding/group-flights',
    emoji: '👥',
    badge: 'Group Discount',
    badgeColor: 'bg-sky-600',
    gradient: 'from-slate-600 to-slate-800',
  },
]

export default function FlightTypesGrid() {
  return (
    <section className="section-padding bg-slate-50">
      <div className="container-default">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">
            Flight Types
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">
            Find Your Perfect Flight
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            From first-time tandem flights to world-class XC and acro — Ölüdeniz has something
            for every level of flyer.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {flightTypes.map((type) => (
            <Link
              key={type.href}
              href={type.href}
              className="group card overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Card Top */}
              <div className={`bg-gradient-to-br ${type.gradient} p-8 text-center relative`}>
                <span className="text-5xl">{type.emoji}</span>
                {type.badge && (
                  <span
                    className={`absolute top-3 right-3 ${type.badgeColor} text-white text-xs font-bold px-2.5 py-1 rounded-full`}
                  >
                    {type.badge}
                  </span>
                )}
              </div>
              {/* Card Body */}
              <div className="p-5">
                <p className="text-xs font-semibold text-orange-500 uppercase tracking-wider mb-1">
                  {type.subtitle}
                </p>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{type.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">{type.description}</p>
                <div className="flex items-center text-orange-500 font-medium text-sm group-hover:gap-2 transition-all gap-1">
                  Learn more <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
