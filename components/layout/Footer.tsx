import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'
import { getLocale } from 'next-intl/server'
import Image from 'next/image'

type L = Record<string, string>

const CATEGORIES: { key: string; title: L; links: { href: string; label: L }[] }[] = [
  {
    key: 'tandem',
    title: { en: 'Tandem Flights', tr: 'Tandem U\u00e7u\u015flar', de: 'Tandemfl\u00fcge', ru: '\u0422\u0430\u043d\u0434\u0435\u043c\u043d\u044b\u0435 \u043f\u043e\u043b\u0451\u0442\u044b' },
    links: [
      { href: '/book-now', label: { en: 'Book Now', tr: 'Rezervasyon', de: 'Jetzt Buchen', ru: '\u0417\u0430\u0431\u0440\u043e\u043d\u0438\u0440\u043e\u0432\u0430\u0442\u044c' } },
      { href: '/prices', label: { en: 'Prices', tr: 'Fiyatlar', de: 'Preise', ru: '\u0426\u0435\u043d\u044b' } },
      { href: '/tandem-paragliding/first-time', label: { en: 'First Time Guide', tr: '\u0130lk Kez U\u00e7u\u015f', de: 'Erster Flug', ru: '\u041f\u0435\u0440\u0432\u044b\u0439 \u043f\u043e\u043b\u0451\u0442' } },
      { href: '/tandem-paragliding/sunset-flight', label: { en: 'Sunset Flights', tr: 'G\u00fcn Bat\u0131m\u0131 U\u00e7u\u015fu', de: 'Sonnenuntergangsflug', ru: '\u0417\u0430\u043a\u0430\u0442\u043d\u044b\u0439 \u043f\u043e\u043b\u0451\u0442' } },
      { href: '/tandem-paragliding/group-flights', label: { en: 'Group Flights', tr: 'Grup U\u00e7u\u015flar\u0131', de: 'Gruppenfl\u00fcge', ru: '\u0413\u0440\u0443\u043f\u043f\u043e\u0432\u044b\u0435 \u043f\u043e\u043b\u0451\u0442\u044b' } },
      { href: '/tandem-paragliding/safety-guide', label: { en: 'Safety Guide', tr: 'G\u00fcvenlik Rehberi', de: 'Sicherheitsleitfaden', ru: '\u0420\u0443\u043a\u043e\u0432\u043e\u0434\u0441\u0442\u0432\u043e \u043f\u043e \u0431\u0435\u0437\u043e\u043f\u0430\u0441\u043d\u043e\u0441\u0442\u0438' } },
      { href: '/groups', label: { en: 'Group Bookings', tr: 'Grup Rezervasyonları', de: 'Gruppenbuchungen', ru: 'Групповые бронирования' } },
      { href: '/transfers', label: { en: 'Transfers', tr: 'Transferler', de: 'Transfers', ru: 'Трансферы' } },
    ],
  },
  {
    key: 'babadag',
    title: { en: 'Babada\u011f Mountain', tr: 'Babada\u011f Da\u011f\u0131', de: 'Babada\u011f Berg', ru: '\u0413\u043e\u0440\u0430 \u0411\u0430\u0431\u0430\u0434\u0430\u0433' },
    links: [
      { href: '/babadag-guide', label: { en: 'Babada\u011f Guide', tr: 'Babada\u011f Rehberi', de: 'Babada\u011f-Leitfaden', ru: '\u0413\u0438\u0434 \u043f\u043e \u0411\u0430\u0431\u0430\u0434\u0430\u0433\u0443' } },
      { href: '/babadag-guide/takeoff-1200m', label: { en: 'Takeoff Points', tr: 'Kalk\u0131\u015f Noktalar\u0131', de: 'Startpl\u00e4tze', ru: '\u0422\u043e\u0447\u043a\u0438 \u0441\u0442\u0430\u0440\u0442\u0430' } },
      { href: '/babadag-guide/landing-main-beach', label: { en: 'Landing Zones', tr: '\u0130ni\u015f Alanlar\u0131', de: 'Landezonen', ru: '\u0417\u043e\u043d\u044b \u043f\u043e\u0441\u0430\u0434\u043a\u0438' } },
      { href: '/babadag-teleferik', label: { en: 'Cable Car Guide', tr: 'Teleferik Rehberi', de: 'Seilbahn-Leitfaden', ru: '\u0413\u0438\u0434 \u043f\u043e \u043a\u0430\u043d\u0430\u0442\u043d\u043e\u0439 \u0434\u043e\u0440\u043e\u0433\u0435' } },
      { href: '/babadag-road-guide', label: { en: 'Road Guide', tr: 'Yol Rehberi', de: 'Stra\u00dfenleitfaden', ru: '\u0413\u0438\u0434 \u043f\u043e \u0434\u043e\u0440\u043e\u0433\u0435' } },
      { href: '/babadag-guide/babadag-altitude-sickness', label: { en: 'Altitude Info', tr: '\u0130rtifa Bilgisi', de: 'H\u00f6heninfo', ru: '\u0418\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f \u043e \u0432\u044b\u0441\u043e\u0442\u0435' } },
    ],
  },
  {
    key: 'flying',
    title: { en: 'Flying & Pilots', tr: 'U\u00e7u\u015f & Pilotlar', de: 'Fliegen & Piloten', ru: '\u041f\u043e\u043b\u0451\u0442\u044b \u0438 \u043f\u0438\u043b\u043e\u0442\u044b' },
    links: [
      { href: '/solo-paragliding', label: { en: 'Solo Paragliding', tr: 'Solo Yama\u00e7 Para\u015f\u00fct\u00fc', de: 'Solo-Paragliding', ru: '\u0421\u043e\u043b\u043e-\u043f\u043e\u043b\u0451\u0442\u044b' } },
      { href: '/cross-country-flights', label: { en: 'Cross Country XC', tr: 'XC (Yol) U\u00e7u\u015fu', de: 'Streckenflug XC', ru: '\u041c\u0430\u0440\u0448\u0440\u0443\u0442\u043d\u044b\u0439 \u043f\u043e\u043b\u0451\u0442 XC' } },
      { href: '/acro-flights', label: { en: 'Acro Flights', tr: 'Akrobatik U\u00e7u\u015flar', de: 'Akrobatikfl\u00fcge', ru: '\u0410\u043a\u0440\u043e\u0431\u0430\u0442\u0438\u043a\u0430' } },
      { href: '/paramotor', label: { en: 'Paramotor', tr: 'Paramotor', de: 'Paramotor', ru: '\u041f\u0430\u0440\u0430\u043c\u043e\u0442\u043e\u0440' } },
      { href: '/training', label: { en: 'Training Courses', tr: 'E\u011fitim Kurslar\u0131', de: 'Ausbildungskurse', ru: '\u041a\u0443\u0440\u0441\u044b \u043e\u0431\u0443\u0447\u0435\u043d\u0438\u044f' } },
      { href: '/pilot-services', label: { en: 'Pilot Services', tr: 'Pilot Hizmetleri', de: 'Pilotendienste', ru: '\u0423\u0441\u043b\u0443\u0433\u0438 \u0434\u043b\u044f \u043f\u0438\u043b\u043e\u0442\u043e\u0432' } },
    ],
  },
  {
    key: 'destinations',
    title: { en: 'Destinations', tr: 'Bölgeler', de: 'Reiseziele', ru: 'Направления' },
    links: [
      { href: '/oludeniz-paragliding', label: { en: 'Oludeniz Paragliding', tr: 'Ölüdeniz Yamaç Paraşütü', de: 'Gleitschirmfliegen Ölüdeniz', ru: 'Парапланеризм в Олюденизе' } },
      { href: '/fethiye-paragliding', label: { en: 'Fethiye Paragliding', tr: 'Fethiye Yamaç Paraşütü', de: 'Gleitschirmfliegen Fethiye', ru: 'Парапланеризм в Фетхие' } },
      { href: '/blue-lagoon-paragliding', label: { en: 'Blue Lagoon Paragliding', tr: 'Mavi Lagün Yamaç Paraşütü', de: 'Gleitschirmfliegen Blaue Lagune', ru: 'Парапланеризм над Голубой лагуной' } },
      { href: '/butterfly-valley-paragliding', label: { en: 'Butterfly Valley Paragliding', tr: 'Kelebekler Vadisi Yamaç Paraşütü', de: 'Gleitschirmfliegen Schmetterlingstal', ru: 'Парапланеризм над Долиной бабочек' } },
      { href: '/turkey-paragliding', label: { en: 'Turkey Paragliding', tr: 'Türkiye Yamaç Paraşütü', de: 'Gleitschirmfliegen Türkei', ru: 'Парапланеризм в Турции' } },
    ],
  },
  {
    key: 'info',
    title: { en: 'Info & Help', tr: 'Bilgi & Yard\u0131m', de: 'Info & Hilfe', ru: '\u0418\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f \u0438 \u043f\u043e\u043c\u043e\u0449\u044c' },
    links: [
      { href: '/weather-guide', label: { en: 'Weather Guide', tr: 'Hava Rehberi', de: 'Wetterleitfaden', ru: '\u0413\u0438\u0434 \u043f\u043e \u043f\u043e\u0433\u043e\u0434\u0435' } },
      { href: '/live-weather', label: { en: 'Live Weather', tr: 'Canl\u0131 Hava Durumu', de: 'Live-Wetter', ru: '\u041f\u043e\u0433\u043e\u0434\u0430 \u0432 \u0440\u0435\u0430\u043b\u044c\u043d\u043e\u043c \u0432\u0440\u0435\u043c\u0435\u043d\u0438' } },
      { href: '/videos', label: { en: 'Videos', tr: 'Videolar', de: 'Videos', ru: '\u0412\u0438\u0434\u0435\u043e' } },
      { href: '/faq', label: { en: 'FAQ', tr: 'SSS', de: 'FAQ', ru: 'FAQ' } },
      { href: '/about-us', label: { en: 'About Us', tr: 'Hakk\u0131m\u0131zda', de: '\u00dcber uns', ru: '\u041e \u043d\u0430\u0441' } },
      { href: '/safety-record', label: { en: 'Safety Record', tr: 'G\u00fcvenlik Ge\u00e7mi\u015fi', de: 'Sicherheitsbilanz', ru: '\u0418\u0441\u0442\u043e\u0440\u0438\u044f \u0431\u0435\u0437\u043e\u043f\u0430\u0441\u043d\u043e\u0441\u0442\u0438' } },
      { href: '/blog', label: { en: 'Blog', tr: 'Blog', de: 'Blog', ru: '\u0411\u043b\u043e\u0433' } },
    ],
  },
]

const TAGLINE: L = {
  en: 'World-class tandem paragliding from Babada\u011f Mountain over the famous Blue Lagoon of \u00d6l\u00fcdeniz, Turkey.',
  tr: 'T\u00fcrkiye, \u00d6l\u00fcdeniz\u2019in \u00fcnl\u00fc Mavi Lagün\u00fc \u00fczerinde, Babada\u011f\u2019dan d\u00fcnya standartlar\u0131nda tandem yama\u00e7 para\u015f\u00fct\u00fc.',
  de: 'Erstklassiges Tandem-Paragliding vom Babada\u011f-Berg \u00fcber der ber\u00fchmten Blauen Lagune von \u00d6l\u00fcdeniz, T\u00fcrkei.',
  ru: '\u041f\u0430\u0440\u0430\u043f\u043b\u0430\u043d\u0435\u0440\u0438\u0437\u043c \u043c\u0438\u0440\u043e\u0432\u043e\u0433\u043e \u0443\u0440\u043e\u0432\u043d\u044f \u0441 \u0433\u043e\u0440\u044b \u0411\u0430\u0431\u0430\u0434\u0430\u0433 \u043d\u0430\u0434 \u0437\u043d\u0430\u043c\u0435\u043d\u0438\u0442\u043e\u0439 \u0413\u043e\u043b\u0443\u0431\u043e\u0439 \u041b\u0430\u0433\u0443\u043d\u043e\u0439 \u041e\u043b\u044e\u0434\u0435\u043d\u0438\u0437\u0430, \u0422\u0443\u0440\u0446\u0438\u044f.',
}

const RIGHTS: L = { en: 'All rights reserved.', tr: 'T\u00fcm haklar\u0131 sakl\u0131d\u0131r.', de: 'Alle Rechte vorbehalten.', ru: '\u0412\u0441\u0435 \u043f\u0440\u0430\u0432\u0430 \u0437\u0430\u0449\u0438\u0449\u0435\u043d\u044b.' }

const BOTTOM_LINKS: { href: string; label: L }[] = [
  { href: '/about-us', label: { en: 'About', tr: 'Hakk\u0131m\u0131zda', de: '\u00dcber uns', ru: '\u041e \u043d\u0430\u0441' } },
  { href: '/certifications', label: { en: 'Certifications', tr: 'Sertifikalar', de: 'Zertifizierungen', ru: '\u0421\u0435\u0440\u0442\u0438\u0444\u0438\u043a\u0430\u0442\u044b' } },
  { href: '/safety-record', label: { en: 'Safety', tr: 'G\u00fcvenlik', de: 'Sicherheit', ru: '\u0411\u0435\u0437\u043e\u043f\u0430\u0441\u043d\u043e\u0441\u0442\u044c' } },
  { href: '/contact', label: { en: 'Contact', tr: '\u0130leti\u015fim', de: 'Kontakt', ru: '\u041a\u043e\u043d\u0442\u0430\u043a\u0442\u044b' } },
]

export default async function Footer() {
  let locale = 'en'
  try {
    locale = await getLocale()
  } catch {
    // outside next-intl context (e.g. admin routes)
  }
  const lp = (href: string) =>
    locale === 'en' ? href : href === '/' ? `/${locale}` : `/${locale}${href}`
  const t = (l: L) => l[locale] || l.en

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
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
              {t(TAGLINE)}
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
                <span>\u00d6l\u00fcdeniz, Fethiye, Mu\u011fla, Turkey</span>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {CATEGORIES.map((category) => (
            <div key={category.key}>
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                {t(category.title)}
              </h3>
              <ul className="space-y-2.5">
                {category.links.map((link) => (
                  <li key={link.href}>
                    <Link href={lp(link.href)} className="text-sm text-slate-400 hover:text-orange-400 transition-colors">
                      {t(link.label)}
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
              title="T\u00dcRSAB \u00dcye Belgesi No: 6819"
              className="flex-shrink-0 bg-white rounded px-2 py-1 opacity-90 hover:opacity-100 transition-opacity"
            >
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-[10px] text-slate-600 font-medium tracking-wide">Acrux Travel 6819</span>
                <Image
                  src="/images/tursab-50.png"
                  alt="T\u00dcRSAB 50. Y\u0131l \u00dcye Belgesi"
                  width={160}
                  height={55}
                  className="h-10 w-auto"
                />
              </div>
            </a>
            <p className="text-sm text-slate-400">
              \u00a9 {new Date().getFullYear()} Atmos Paragliding. {t(RIGHTS)}
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            {BOTTOM_LINKS.map((l) => (
              <Link key={l.href} href={lp(l.href)} className="hover:text-slate-300 transition-colors">{t(l.label)}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
