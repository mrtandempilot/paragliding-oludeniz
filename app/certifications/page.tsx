import type { Metadata } from 'next'
import Link from 'next/link'
import { Award, Shield, FileCheck, CheckCircle } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'

export const metadata: Metadata = {
  title: 'Certifications | Licensed & Insured Tandem Pilots Ölüdeniz',
  description:
    'View the official certifications of Paragliding Ölüdeniz. Turkish Civil Aviation Authority licensed pilots, full passenger liability insurance, certified equipment. Fly with confidence.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/certifications' },
}

const certifications = [
  {
    icon: Award,
    color: 'text-orange-500',
    bg: 'bg-orange-50',
    title: 'Turkish Civil Aviation Authority (SHGM) Licence',
    body: 'All our tandem pilots hold a current paragliding licence issued by the Turkish Civil Aviation Authority (Sivil Havacılık Genel Müdürlüğü — SHGM). This is the official national licence required by Turkish law to carry passengers on tandem paragliding flights.',
  },
  {
    icon: Shield,
    color: 'text-sky-500',
    bg: 'bg-sky-50',
    title: 'Full Passenger Liability Insurance',
    body: 'We carry comprehensive passenger liability insurance covering all tandem flights. This insurance is renewed annually and satisfies both Turkish regulatory requirements and international standards. You are covered from the moment you put on your harness to the moment you land.',
  },
  {
    icon: FileCheck,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    title: 'EN-Certified Equipment',
    body: 'All our tandem wings, harnesses and reserve parachutes are certified to European EN standards — the internationally recognised benchmark for paragliding equipment safety. Equipment is maintained, inspected and retired according to manufacturer and regulatory schedules.',
  },
  {
    icon: CheckCircle,
    color: 'text-purple-500',
    bg: 'bg-purple-50',
    title: 'Ölüdeniz Paragliding Association Member',
    body: 'We are founding members of the Ölüdeniz Paragliding Association, which coordinates flight safety standards, launch procedures and airspace management across the entire Ölüdeniz flying site. Membership requires compliance with local site safety rules.',
  },
  {
    icon: Award,
    color: 'text-rose-500',
    bg: 'bg-rose-50',
    title: 'Annual Medical & Licence Renewal',
    body: 'Every pilot undergoes an annual medical examination and licence renewal as required by SHGM regulations. We do not allow pilots to operate on an expired licence or medical certificate — regardless of experience level.',
  },
  {
    icon: Shield,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    title: 'Registered Business & Tax Compliance',
    body: 'Paragliding Ölüdeniz is a legally registered Turkish business with full tax registration. All bookings come with official receipts. We operate fully above-board — important when purchasing travel insurance that may cover booked activities.',
  },
]

export default function CertificationsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Certifications — Paragliding Ölüdeniz',
    description: 'Official certifications and licences of Paragliding Ölüdeniz.',
    url: 'https://paragliding-oludeniz.com/certifications',
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        title="Our Certifications"
        subtitle="Licensed pilots, insured flights, certified equipment. Everything you need to fly with confidence."
        size="sm"
      />

      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3">
          <BreadcrumbNav items={[{ label: 'Certifications' }]} />
        </div>
      </div>

      <section className="section-padding bg-white">
        <div className="container-default max-w-4xl">
          {/* Intro */}
          <div className="max-w-3xl mb-14">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Fully Certified for Your Peace of Mind</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              When you book a tandem paragliding flight in Ölüdeniz, you have every right to ask about certifications and insurance. We are transparent about this because we believe an informed passenger is a confident passenger.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Below is a summary of our key certifications and what each one means for your safety and peace of mind. If you have any questions or would like to see specific documents before booking, please contact us — we are happy to share.
            </p>
          </div>

          {/* Certifications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
            {certifications.map((cert) => {
              const Icon = cert.icon
              return (
                <div key={cert.title} className="card p-6">
                  <div className={`w-12 h-12 ${cert.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${cert.color}`} />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-3">{cert.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{cert.body}</p>
                </div>
              )
            })}
          </div>

          {/* Questions CTA */}
          <div className="p-6 bg-orange-50 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div>
              <p className="font-semibold text-slate-900">Want to see the actual documents?</p>
              <p className="text-slate-500 text-sm mt-1">
                Contact us and we will share our licence and insurance documents directly.
              </p>
            </div>
            <Link href="/contact" className="btn-primary whitespace-nowrap">
              Contact Us
            </Link>
          </div>

          {/* Safety record link */}
          <div className="p-6 bg-slate-50 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-slate-900">See our safety record</p>
              <p className="text-slate-500 text-sm mt-1">
                25+ years, 50,000+ flights, zero serious incidents.
              </p>
            </div>
            <Link href="/safety-record" className="btn-secondary whitespace-nowrap">
              Safety Record
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="container-default max-w-2xl">
          <BookingCTA
            title="Book With a Certified Team"
            subtitle="Licensed pilots, insured flights, 25+ years of safe operations."
          />
        </div>
      </section>
    </>
  )
}
