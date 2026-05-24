import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, Award, CheckCircle, Users } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'

export const metadata: Metadata = {
  title: 'Safety Record | Paragliding Ölüdeniz — 25 Years, Zero Serious Incidents',
  description:
    'Our safety record at Paragliding Ölüdeniz. 25+ years of tandem flights from Babadağ Mountain with zero serious incidents. Certified pilots, maintained equipment, rigorous standards.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/safety-record' },
}

const safetyStats = [
  { value: '25+', label: 'Years operating', icon: Award, color: 'text-orange-500', bg: 'bg-orange-50' },
  { value: '50,000+', label: 'Tandem flights', icon: Users, color: 'text-sky-500', bg: 'bg-sky-50' },
  { value: '0', label: 'Serious incidents', icon: Shield, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { value: '100%', label: 'Certified pilots', icon: CheckCircle, color: 'text-purple-500', bg: 'bg-purple-50' },
]

const safetyPractices = [
  {
    title: 'Certified & Licensed Pilots',
    body: 'Every pilot on our team holds a full tandem licence issued by the Turkish Civil Aviation Authority (SHGM) and is current with all required medical and licence checks. We do not allow unlicensed pilots to fly passengers — no exceptions.',
  },
  {
    title: 'Equipment Inspection Before Every Flight',
    body: 'Our harnesses, carabiners, parachutes and wing lines are inspected before every single flight. Equipment is retired on schedule — not when it looks worn. We use certified EN-D tandem gliders from leading manufacturers maintained to manufacturer specifications.',
  },
  {
    title: 'Reserve Parachutes on Every Flight',
    body: 'All tandem pilots carry a properly packed reserve parachute. Reserves are repacked by certified riggers on schedule. In 25+ years we have never had to deploy a reserve in a passenger flight — but they are always there.',
  },
  {
    title: 'Weather Decision Protocol',
    body: 'We use a multi-source weather assessment every morning — local station data, wind forecasts and on-mountain observation. If conditions do not meet our internal standards, we do not fly. Commercial pressure never overrides pilot judgment.',
  },
  {
    title: 'Pre-Flight Passenger Briefing',
    body: 'Every passenger receives a full briefing before take-off covering run-up technique, in-flight communication, and landing procedure. We do not rush this briefing regardless of how busy the launch is.',
  },
  {
    title: 'Emergency Procedures & Landing Options',
    body: 'Our pilots know every emergency landing option in the entire Ölüdeniz flying area. We maintain radio contact with the ground team throughout every flight. All pilots are first-aid trained and the Ölüdeniz area has good emergency service access.',
  },
]

export default function SafetyRecordPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Safety Record — Paragliding Ölüdeniz',
    description: 'Safety record and standards of Paragliding Ölüdeniz. 25+ years of tandem flights from Babadağ Mountain.',
    url: 'https://paragliding-oludeniz.com/safety-record',
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        title="Our Safety Record"
        subtitle="25 years. 50,000+ flights. Zero serious incidents. Safety is not a feature — it is the foundation."
        size="sm"
      />

      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3">
          <BreadcrumbNav items={[{ label: 'Safety Record' }]} />
        </div>
      </div>

      {/* Stats */}
      <section className="section-padding bg-white">
        <div className="container-default max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {safetyStats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className={`${stat.bg} rounded-2xl p-6 text-center`}>
                  <Icon className={`w-7 h-7 ${stat.color} mx-auto mb-3`} />
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-slate-600 text-sm mt-1">{stat.label}</p>
                </div>
              )
            })}
          </div>

          {/* Intro */}
          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Safety Is Our Core Value</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              At Paragliding Ölüdeniz, safety is not a marketing claim — it is a daily operational commitment that every member of our team takes personally. Since our first tandem flight in the late 1990s, we have maintained an unblemished safety record across more than 50,000 passenger flights.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              We have achieved this not by luck but by design: strict equipment maintenance schedules, rigorous pilot certification requirements, honest weather decision-making, and a culture where no pilot is ever pressured to fly in conditions they are not comfortable with.
            </p>
            <p className="text-slate-600 leading-relaxed">
              When you fly with us, you are not taking a risk — you are having an adventure managed by professionals who have made safety their life&apos;s work.
            </p>
          </div>

          {/* Practices */}
          <h2 className="text-2xl font-bold text-slate-900 mb-8">How We Maintain Our Record</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {safetyPractices.map((practice) => (
              <div key={practice.title} className="card p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">{practice.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{practice.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Certifications Link */}
          <div className="mt-12 p-6 bg-slate-50 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-slate-900">Want to see our certifications?</p>
              <p className="text-slate-500 text-sm mt-1">View our pilot licences, insurance documents and official certifications.</p>
            </div>
            <Link href="/certifications" className="btn-secondary whitespace-nowrap">
              View Certifications
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="container-default max-w-2xl">
          <BookingCTA
            title="Fly With Confidence"
            subtitle="25 years of safe flights from Babadağ. Your adventure is in experienced hands."
          />
        </div>
      </section>
    </>
  )
}
