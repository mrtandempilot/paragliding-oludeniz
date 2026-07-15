import type { Metadata } from 'next'
import Hero from '@/components/home/Hero'
import WhyOludeniz from '@/components/home/WhyOludeniz'
import FlightTypesGrid from '@/components/home/FlightTypesGrid'
import BabadagIntro from '@/components/home/BabadagIntro'
import ReviewsSection from '@/components/home/ReviewsSection'
import HomeSeoIntro from '@/components/home/HomeSeoIntro'
import { localeAlternates, localeUrl } from '@/lib/seo'

const META: Record<string, { title: string; description: string; ogLocale: string }> = {
  en: {
    title: 'Atmos Paragliding | Tandem Flights from Babadağ',
    description:
      'Book tandem paragliding flights in Oludeniz, Turkey. Launch from Babadağ at 1960m and soar over the Blue Lagoon. Certified pilots, 25+ years experience.',
    ogLocale: 'en_US',
  },
  tr: {
    title: 'Ölüdeniz Yamaç Paraşütü | Babadağ Tandem Uçuşları',
    description:
      "Ölüdeniz'de tandem yamaç paraşütü rezervasyonu. 1960m Babadağ'dan havalanın, Mavi Lagün üzerinde süzülün. Sertifikalı pilotlar, 25+ yıl deneyim.",
    ogLocale: 'tr_TR',
  },
  de: {
    title: 'Gleitschirmfliegen Ölüdeniz | Tandemflüge vom Babadağ',
    description:
      'Tandem-Gleitschirmflüge in Ölüdeniz, Türkei buchen. Start vom Babadağ (1960 m), Flug über die Blaue Lagune. Zertifizierte Piloten, 25+ Jahre Erfahrung.',
    ogLocale: 'de_DE',
  },
  ru: {
    title: 'Параплан Олюдениз | Тандемные полёты с Бабадага',
    description:
      'Бронируйте тандемные полёты на параплане в Олюденизе. Старт с горы Бабадаг (1960 м), полёт над Голубой лагуной. Опыт 25+ лет.',
    ogLocale: 'ru_RU',
  },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const m = META[locale] || META.en
  return {
    // title.absolute bypasses the root layout template — prevents triple suffix
    title: { absolute: m.title },
    description: m.description,
    alternates: localeAlternates(locale, '/'),
    openGraph: {
      type: 'website',
      locale: m.ogLocale,
      url: localeUrl(locale, '/'),
      siteName: 'Atmos Paragliding',
      title: m.title,
      description: m.description,
      images: [
        {
          url: '/opengraph-image',
          width: 1200,
          height: 630,
          alt: 'Atmos Paragliding — Tandem Flights from Babadağ Mountain',
        },
      ],
    },
  }
}

const LOCAL_BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://www.atmosparagliding.com/#business',
  name: 'Atmos Paragliding',
  url: 'https://www.atmosparagliding.com',
  telephone: '+905364616674',
  email: 'info@paragliding-oludeniz.com',
  image: 'https://www.atmosparagliding.com/opengraph-image',
  priceRange: '€€',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Ölüdeniz, Fethiye',
    addressRegion: 'Muğla',
    addressCountry: 'TR',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 36.5497, longitude: 29.1167 },
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '2400' },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '07:00',
      closes: '19:00',
      validFrom: '2026-04-01',
      validThrough: '2026-10-31',
    },
  ],
  sameAs: [
    'https://instagram.com/paragliding.oludeniz',
    'https://facebook.com/paraglidingoludeniz',
  ],
}


const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Atmos Paragliding',
  url: 'https://www.atmosparagliding.com',
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_SCHEMA) }}
      />
      <Hero />
      <WhyOludeniz />
      <FlightTypesGrid />
      <BabadagIntro />
      <HomeSeoIntro locale={locale} />
      <ReviewsSection />
    </main>
  )
}
