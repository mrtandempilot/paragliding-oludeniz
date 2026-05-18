import { Mountain, Wind, Camera, Award, Users, MapPin } from 'lucide-react'

const reasons = [
  {
    icon: Mountain,
    title: '1960m Launch Altitude',
    description:
      'Babadağ Mountain offers one of the highest and most spectacular tandem paragliding launches in the world.',
    color: 'text-sky-600',
    bg: 'bg-sky-50',
  },
  {
    icon: Wind,
    title: 'Perfect Flying Conditions',
    description:
      'Ölüdeniz enjoys 300+ flyable days per year thanks to the unique microclimate created by the surrounding mountains.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: Camera,
    title: 'Iconic Scenery',
    description:
      'Fly over the world-famous Blue Lagoon, Butterfly Valley and the crystal-clear waters of the Aegean Sea.',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  {
    icon: Award,
    title: 'World Competition Venue',
    description:
      'Host of the annual Ölüdeniz Air Games, attracting elite paragliding pilots from over 60 countries every year.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    icon: Users,
    title: 'Expert Local Pilots',
    description:
      'Our certified tandem pilots have thousands of hours of flight experience on Babadağ — safety is our priority.',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
  },
  {
    icon: MapPin,
    title: 'Easy to Reach',
    description:
      'Just 15 minutes from Ölüdeniz beach by cable car or road. Transfer options available from Fethiye and Dalaman Airport.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
]

export default function WhyOludeniz() {
  return (
    <section className="section-padding bg-white">
      <div className="container-default">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">
            Why Ölüdeniz
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">
            The World&apos;s Most Beautiful Paragliding Destination
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Ölüdeniz is not just a paragliding site — it&apos;s a legendary experience that
            pilots and first-timers come back for year after year.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason) => {
            const Icon = reason.icon
            return (
              <div
                key={reason.title}
                className="card p-6 hover:shadow-md transition-shadow duration-300 group"
              >
                <div
                  className={`w-12 h-12 ${reason.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`w-6 h-6 ${reason.color}`} />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{reason.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{reason.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
