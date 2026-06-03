import Link from 'next/link'
import { ArrowRight, Mountain } from 'lucide-react'

const stats = [
  { value: '1960m', label: 'Summit Altitude' },
  { value: '4', label: 'Launch Points' },
  { value: '300+', label: 'Flying Days / Year' },
  { value: '60+', label: 'Countries Represented' },
]

export default function BabadagIntro() {
  return (
    <section className="section-padding bg-white overflow-hidden">
      <div className="container-default">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85')",
                }}
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 bg-orange-500 text-white rounded-2xl p-4 shadow-xl">
              <Mountain className="w-6 h-6 mb-1" />
              <p className="font-bold text-lg leading-none">1960m</p>
              <p className="text-xs text-orange-100">Above Sea Level</p>
            </div>
          </div>

          {/* Right — Content */}
          <div>
            <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">
              The Launch Mountain
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-6">
              Babadağ Mountain — A Paragliding Legend
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Rising to 1,960 metres above the turquoise waters of Ölüdeniz, Babadağ is not just
              a mountain — it&apos;s the heartbeat of one of the world&apos;s greatest paragliding
              destinations. Every year, thousands of pilots and first-time flyers take off from its
              legendary slopes.
            </p>
            <p className="text-slate-600 leading-relaxed mb-8">
              With four separate launch points ranging from 1,200m to 1,900m, Babadağ caters to
              every level — from nervous first-timers to world-class acro and XC pilots. The cable
              car (teleferik) makes access easy, and the views from the top are simply jaw-dropping.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-slate-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-orange-500">{stat.value}</p>
                  <p className="text-sm text-slate-600 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <Link href="/babadag-guide" className="btn-primary">
              Explore Babadağ Guide
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
