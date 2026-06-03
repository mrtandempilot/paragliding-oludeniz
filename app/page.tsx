import type { Metadata } from 'next'
import Hero from '@/components/home/Hero'
import WhyOludeniz from '@/components/home/WhyOludeniz'
import FlightTypesGrid from '@/components/home/FlightTypesGrid'
import BabadagIntro from '@/components/home/BabadagIntro'
import ReviewsSection from '@/components/home/ReviewsSection'

export const metadata: Metadata = {
  description:
    'Book tandem paragliding in Ölüdeniz, Turkey. Launch from Babadağ (1960m) and soar over the Blue Lagoon with certified pilots and 25+ years of experience.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/' },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://paragliding-oludeniz.com/#business',
  name: 'Paragliding Oludeniz',
  description:
    'Tandem paragliding flights in Ölüdeniz, Turkey, launching from Babadağ Mountain over the Blue Lagoon.',
  url: 'https://paragliding-oludeniz.com',
  image: 'https://paragliding-oludeniz.com/opengraph-image',
  priceRange: '€€',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Ölüdeniz',
    addressRegion: 'Muğla',
    addressCountry: 'TR',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 36.5497, longitude: 29.1164 },
  areaServed: ['Ölüdeniz', 'Fethiye', 'Babadağ', 'Turkey'],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '2400',
  },
}

export default function HomePage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Hero />
      <WhyOludeniz />
      <FlightTypesGrid />
      <BabadagIntro />
      <ReviewsSection />
    </main>
  )
}
