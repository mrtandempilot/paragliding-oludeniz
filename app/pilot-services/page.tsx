import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Shield, Wrench, GraduationCap, Users, Wind, CheckCircle } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'

export const metadata: Metadata = {
  title: 'Pilot Services Ölüdeniz | Training, Equipment & Community',
  description:
    'Services for paragliding pilots visiting Babadağ and Ölüdeniz. Equipment rental, local guiding, XC coaching, site briefings, and the local pilot community.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/pilot-services' },
}

const services = [
  {
    icon: Wrench,
    title: 'Equipment Rental',
    href: '/pilot-services/equipment-rental',
    desc: 'High-quality rental gliders, harnesses and reserves available for visiting pilots. EN-B and EN-C wings in multiple sizes.',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  {
    icon: GraduationCap,
    title: 'Training Courses',
    href: '/training',
    desc: 'CP, P1, P2 and P4 courses. SIV, XC clinics, and guided XC flying weeks on Babadağ. All levels welcome.',
    color: 'text-sky-600',
    bg: 'bg-sky-50',
  },
  {
    icon: Wind,
    title: 'Local Guiding',
    href: '/cross-country-flights',
    desc: 'Fly with an experienced local guide. Essential for first-time visitors to unlock the best routes and thermal streets.',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    icon: Users,
    title: 'Pilot Community',
    href: '/community',
    desc: 'Connect with local and visiting pilots. WhatsApp groups, weather briefings, and social flying every morning.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    icon: Wind,
    title: 'Acro & Aerobatics',
    href: '/acro-flights',
    desc: 'World-class acro flying over the Blue Lagoon. SIV training, acro camps and the annual Ölüdeniz Acro Show.',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
  },
]

const requirements = [
  'Valid paragliding licence (national or IPPI 4+)',
  'Third-party liability insurance (mandatory)',
  'Daily / weekly pilot pass from the Babadağ Association',
  'Knowledge of local airspace regulations',
  'Backup reserve parachute strongly recommended',
]

export default function PilotServicesPage() {
  return (
    <>
      <PageHero
        title="Pilot Services — Ölüdeniz & Babadağ"
        subtitle="Everything a visiting pilot needs to fly safely and make the most of Babadağ Mountain."
        badge="For Pilots"
        bgImage="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=1920&q=85"
      />

      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3">
          <BreadcrumbNav items={[{ label: 'Pilot Services' }]} />
        </div>
      </div>

      {/* Intro */}
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">
            For Licensed Pilots
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mt-2 mb-6">
            Your Base for Babadağ Flying
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Babadağ is one of the world&apos;s great paragliding sites and thousands of licensed pilots
            visit every year from all over Europe and beyond. Whether you are bringing your own
            equipment or arriving with just a rucksack, we can get you flying.
          </p>
          <p className="text-slate-600 leading-relaxed">
            We offer equipment rental, training at all levels, local guiding for XC and site
            discovery, and access to the Ölüdeniz pilot community. We also run daily weather
            briefings at the launch and can help visiting pilots understand the local airspace,
            landing options, and thermal patterns.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-slate-50">
        <div className="container-default">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">What We Offer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {services.map((s) => {
              const Icon = s.icon
              return (
                <Link
                  key={s.title}
                  href={s.href}
                  className="card p-6 hover:shadow-md transition-all hover:-translate-y-0.5 group"
                >
                  <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${s.color}`} />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-orange-600 transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">{s.desc}</p>
                  <div className="flex items-center gap-1 text-orange-500 text-sm font-semibold">
                    Learn more <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Requirements for Solo Pilots
              </h2>
              <p className="text-slate-600 mb-6">
                Flying from Babadağ as a solo licensed pilot requires meeting several formal
                requirements. These are enforced by the Babadağ Paragliding Association at the
                launch area.
              </p>
              <ul className="space-y-3">
                {requirements.map((req) => (
                  <li key={req} className="flex gap-3">
                    <Shield className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">{req}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Link
                  href="/solo-paragliding"
                  className="inline-flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700 transition-colors"
                >
                  Full solo flying guide <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Quick Contact */}
            <div className="bg-slate-900 text-white rounded-2xl p-8">
              <h3 className="font-bold text-xl mb-4">Get in Touch</h3>
              <p className="text-slate-400 mb-6 text-sm">
                Have questions about visiting as a pilot? We are happy to help with site briefings,
                equipment availability, or planning your trip.
              </p>
              <div className="space-y-3">
                <a
                  href="tel:+905364616674"
                  className="flex items-center gap-3 text-white hover:text-orange-400 transition-colors"
                >
                  📞 <span className="text-sm">+90 536 461 6674</span>
                </a>
                <a
                  href="mailto:pilots@paragliding-oludeniz.com"
                  className="flex items-center gap-3 text-white hover:text-orange-400 transition-colors"
                >
                  ✉️ <span className="text-sm">pilots@paragliding-oludeniz.com</span>
                </a>
                <a
                  href="https://wa.me/905364616674"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white hover:text-orange-400 transition-colors"
                >
                  💬 <span className="text-sm">WhatsApp</span>
                </a>
              </div>
              <div className="border-t border-slate-700 mt-6 pt-6">
                <p className="text-slate-400 text-xs">
                  We can also add you to the local pilot WhatsApp group for daily weather
                  briefings and fly coordination.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="container-default max-w-2xl">
          <BookingCTA
            title="Not a Licensed Pilot Yet?"
            subtitle="Experience paragliding as a passenger with one of our certified tandem pilots."
            variant="dark"
          />
        </div>
      </section>
    </>
  )
}
