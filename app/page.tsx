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
  '@type': 'TouristAttraction',
  '@id': 'https://paragliding-oludeniz.com/#business',
  name: 'Paragliding Oludeniz',
  alternateName: ['Oludeniz Paragliding', 'Paragliding Ölüdeniz', 'Babadağ Paragliding'],
  description: 'Tandem paragliding flights in Ölüdeniz, Turkey. Launch from Babadağ Mountain at 1960m and soar over the world-famous Blue Lagoon. Certified pilots, 25+ years experience.',
  url: 'https://paragliding-oludeniz.com',
  telephone: '+905364616674',
  email: 'info@paragliding-oludeniz.com',
  image: [
    'https://paragliding-oludeniz.com/opengraph-image',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200',
  ],
  priceRange: '€€',
  currenciesAccepted: 'EUR, USD, GBP, TRY',
  paymentAccepted: 'Cash, Credit Card',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Ölüdeniz Mahallesi',
    addressLocality: 'Ölüdeniz',
    addressRegion: 'Muğla',
    postalCode: '48300',
    addressCountry: 'TR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 36.5497,
    longitude: 29.1164,
  },
  hasMap: 'https://maps.google.com/?q=Paragliding+Oludeniz+Turkey',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
      opens: '08:00',
      closes: '19:00',
    },
  ],
  areaServed: [
    { '@type': 'City', name: 'Ölüdeniz' },
    { '@type': 'City', name: 'Fethiye' },
    { '@type': 'AdministrativeArea', name: 'Muğla' },
    { '@type': 'Country', name: 'Turkey' },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '2400',
    bestRating: '5',
    worstRating: '1',
  },
  sameAs: [
    'https://www.instagram.com/paragliding.oludeniz',
    'https://www.facebook.com/paraglidingoludeniz',
    'https://www.tripadvisor.com/Attraction_Review-g312737',
  ],
  touristType: ['Adventure tourists', 'Paragliders', 'Thrill seekers'],
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Certified Pilots', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Safety Equipment', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Photo Package', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Free Transfer to Launch', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Beach Landing', value: true },
  ],
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
