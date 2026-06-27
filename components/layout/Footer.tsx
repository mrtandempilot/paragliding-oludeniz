import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'
import { getLocale } from 'next-intl/server'
import Image from 'next/image'

const footerLinks = {
  'Tandem Flights': [
    { label: 'Book Now', href: '/book-now' },
    { label: 'Prices', href: '/prices' },
    { label: 'First Time Guide', href: '/tandem-paragliding/first-time' },
    { label: 'Sunset Flights', href: '/tandem-paragliding/sunset-flight' },
    { label: 'Group Flights', href: '/tandem-paragliding/group-flights' },
    { label: 'Safety Guide', href: '/tandem-paragliding/safety-guide' },
  ],
  'Babadağ Mountain': [
    { label: 'Babadağ Guide', href: '/babadag-guide' },
    { label: 'Takeoff Points', href: '/babadag-guide/takeoff-1200m' },
    { label: 'Landing Zones', href: '/babadag-guide/landing-main-beach' },
    { label: 'Cable Car Guide', href: '/babadag-teleferik' },
    { label: 'Road Guide', href: '/babadag-road-guide' },
    { label: 'Altitude Info', href: '/babadag-guide/babadag-altitude-sickness' },
  ],
  'Flying & Pilots': [
    { label: 'Solo Paragliding', href: '/solo-paragliding' },
    { label: 'Cross Country XC', href: '/cross-country-flights' },
    { label: 'Acro Flights', href: '/acro-flights' },
    { label: 'Paramotor', href: '/paramotor' },
    { label: 'Training Courses', href: '/training' },
    { label: 'Pilot Services', href: '/pilot-services' },
  ],
  'Info & Help': [
    { label: 'Weather Guide', href: '/weather-guide' },
    { label: 'Live Weather', href: '/live-weather' },
    { label: 'FAQ', href: '/faq' },
    { label: 'About Us', href: '/about-us' },
    { label: 'Safety Record', href: '/safety-record' },
    { label: 'Blog', href: '/blog' },
  ],
}

export default async function Footer() {
  let locale = 'en'
  try {
    locale = await getLocale()
  } catch {
    // outside next-intl context (e.g. admin routes)
  }
  const lp = (href: string) =>
    locale === 'en' ? href : href === '/' ? `/${locale}` : `/${locale}${href}`
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href={lp('/')} className="inline-flex items-center gap-2 mb-4">
              <Image
                src="/images/logo.jpg"
                alt="Atmos Paragliding"
                width={32}
                height={32}
                className="rounded-full h-8 w-8 object-cover"
              />
              <span className="text-xl font-bold text-white">
                <span className="text-orange-500">Atmos</span> Paragliding
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              World-class tandem paragliding from Babadağ Mountain over the famous Blue Lagoon of
              Ölüdeniz, Turkey.
            </p>
            {/* Contact */}
            <div className="space-y-2 text-sm">
              <a href="tel:+905364616674" className="flex items-center gap-2 text-slate-400 hover:text-orange-400 transition-colors">
                <Phone className="w-4 h-4 flex-shrink-0" />
                +90 536 461 6674
              </a>
              <a href="mailto:info@paragliding-oludeniz.com" className="flex items-center gap-2 text-slate-400 hover:text-orange-400 transition-colors">
                <Mail className="w-4 h-4 flex-shrink-0" />
                info@paragliding-oludeniz.com
              </a>
              <div className="flex items-start gap-2 text-slate-400">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Ölüdeniz, Fethiye, Muğla, Turkey</span>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                {category}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={lp(link.href)} className="text-sm text-slate-400 hover:text-orange-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left: TURSAB badge + copyright */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.tursab.org.tr/belgem/6819"
              target="_blank"
              rel="noopener noreferrer"
              title="TÜRSAB Üye Belgesi No: 6819"
              className="flex-shrink-0 bg-white rounded px-2 py-1 opacity-90 hover:opacity-100 transition-opacity"
            >
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-[10px] text-slate-400 font-medium tracking-wide">Acrux Travel 6819</span>
                <Image
                  src="/images/tursab-50.png"
                  alt="TÜRSAB 50. Yıl Üye Belgesi"
                  width={160}
                  height={55}
                  className="h-10 w-auto"
                />
              </div>
            </a>
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} Atmos Paragliding. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link href={lp('/about-us')} className="hover:text-slate-300 transition-colors">About</Link>
            <Link href={lp('/certifications')} className="hover:text-slate-300 transition-colors">Certifications</Link>
            <Link href={lp('/safety-record')} className="hover:text-slate-300 transition-colors">Safety</Link>
            <Link href={lp('/contact')} className="hover:text-slate-300 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
