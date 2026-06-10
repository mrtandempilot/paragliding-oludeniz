import type { Metadata } from 'next'
import Hero from '@/components/home/Hero'
import WhyOludeniz from '@/components/home/WhyOludeniz'
import FlightTypesGrid from '@/components/home/FlightTypesGrid'
import BabadagIntro from '@/components/home/BabadagIntro'
import ReviewsSection from '@/components/home/ReviewsSection'
import { localeAlternates } from '@/lib/seo'

const META: Record<string, { title: string; description: string; ogLocale: string }> = {
  en: {
    title: 'Paragliding Oludeniz | Tandem Flights from Babada\u011f',
    description:
      'Book tandem paragliding flights in Oludeniz, Turkey. Launch from Babada\u011f at 1960m and soar over the Blue Lagoon. Certified pilots, 25+ years experience.',
    ogLocale: 'en_US',
  },
  tr: {
    title: '\u00d6l\u00fcdeniz Yama\u00e7 Para\u015f\u00fct\u00fc | Babada\u011f Tandem U\u00e7u\u015flar\u0131',
    description:
      "\u00d6l\u00fcdeniz'de tandem yama\u00e7 para\u015f\u00fct\u00fc rezervasyonu. 1960m Babada\u011f'dan havalan\u0131n, Mavi Lag\u00fcn \u00fczerinde s\u00fcz\u00fcl\u00fcn. Sertifikal\u0131 pilotlar, 25+ y\u0131l deneyim.",
    ogLocale: 'tr_TR',
  },
  de: {
    title: 'Gleitschirmfliegen \u00d6l\u00fcdeniz | Tandemfl\u00fcge vom Babada\u011f',
    description:
      'Tandem-Gleitschirmfl\u00fcge in \u00d6l\u00fcdeniz, T\u00fcrkei buchen. Start vom Babada\u011f (1960 m), Flug \u00fcber die Blaue Lagune. Zertifizierte Piloten, 25+ Jahre Erfahrung.',
    ogLocale: 'de_DE',
  },
  ru: {
    title: '\u041f\u0430\u0440\u0430\u043f\u043b\u0430\u043d \u041e\u043b\u044e\u0434\u0435\u043d\u0438\u0437 | \u0422\u0430\u043d\u0434\u0435\u043c\u043d\u044b\u0435 \u043f\u043e\u043b\u0451\u0442\u044b \u0441 \u0411\u0430\u0431\u0430\u0434\u0430\u0433\u0430',
    description:
      '\u0411\u0440\u043e\u043d\u0438\u0440\u0443\u0439\u0442\u0435 \u0442\u0430\u043d\u0434\u0435\u043c\u043d\u044b\u0435 \u043f\u043e\u043b\u0451\u0442\u044b \u043d\u0430 \u043f\u0430\u0440\u0430\u043f\u043b\u0430\u043d\u0435 \u0432 \u041e\u043b\u044e\u0434\u0435\u043d\u0438\u0437\u0435. \u0421\u0442\u0430\u0440\u0442 \u0441 \u0433\u043e\u0440\u044b \u0411\u0430\u0431\u0430\u0434\u0430\u0433 (1960 \u043c), \u043f\u043e\u043b\u0451\u0442 \u043d\u0430\u0434 \u0413\u043e\u043b\u0443\u0431\u043e\u0439 \u043b\u0430\u0433\u0443\u043d\u043e\u0439. \u041e\u043f\u044b\u0442 25+ \u043b\u0435\u0442.',
    ogLocale: 'ru_RU',
  },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const m = META[locale] || META.en
  return {
    title: m.title,
    description: m.description,
    alternates: localeAlternates(locale, '/'),
    openGraph: {
      type: 'website',
      locale: m.ogLocale,
      url: locale === 'en' ? 'https://paragliding-oludeniz.com' : `https://paragliding-oludeniz.com/${locale}`,
      siteName: 'Paragliding Oludeniz',
      title: m.title,
      description: m.description,
      images: [
        {
          url: '/opengraph-image',
          width: 1200,
          height: 630,
          alt: 'Paragliding \u00d6l\u00fcdeniz \u2014 Tandem Flights from Babada\u011f Mountain',
        },
      ],
    },
  }
}

const LOCAL_BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://paragliding-oludeniz.com/#business',
  name: 'Paragliding Oludeniz',
  url: 'https://paragliding-oludeniz.com',
  telephone: '+905364616674',
  email: 'info@paragliding-oludeniz.com',
  image: 'https://paragliding-oludeniz.com/opengraph-image',
  priceRange: '\u20ac\u20ac',
  address: {
    '@type': 'PostalAddress',
    addressLocality: '\u00d6l\u00fcdeniz, Fethiye',
    addressRegion: 'Mu\u011fla',
    addressCountry: 'TR',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 36.5497, longitude: 29.1167 },
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '2400' },
  sameAs: [
    'https://instagram.com/paragliding.oludeniz',
    'https://facebook.com/paraglidingoludeniz',
  ],
}

export default function HomePage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_SCHEMA) }}
      />
      <Hero />
      <WhyOludeniz />
      <FlightTypesGrid />
      <BabadagIntro />
      <ReviewsSection />
    </main>
  )
}
