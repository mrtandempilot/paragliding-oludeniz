import type { Metadata } from 'next'
import Hero from '@/components/home/Hero'
import WhyOludeniz from '@/components/home/WhyOludeniz'
import FlightTypesGrid from '@/components/home/FlightTypesGrid'
import BabadagIntro from '@/components/home/BabadagIntro'
import ReviewsSection from '@/components/home/ReviewsSection'
import BookingCTABanner from '@/components/home/BookingCTABanner'

export const metadata: Metadata = {
  title: 'Paragliding Ölüdeniz | Tandem Flights from Babadağ Mountain',
  description:
    'Book world-class tandem paragliding in Ölüdeniz, Turkey. Fly over the Blue Lagoon from Babadağ Mountain at 1960m. Certified pilots, safe flights, unforgettable views.',
  alternates: {
    canonical: 'https://paragliding-oludeniz.com',
  },
}

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        '@id': 'https://paragliding-oludeniz.com/#business',
        name: 'Paragliding Ölüdeniz',
        description:
          'World-class tandem paragliding from Babadağ Mountain over the Blue Lagoon of Ölüdeniz, Turkey.',
        url: 'https://paragliding-oludeniz.com',
        telephone: '+905364616674',
        email: 'info@paragliding-oludeniz.com',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Ölüdeniz Mahallesi',
          addressLocality: 'Fethiye',
          addressRegion: 'Muğla',
          addressCountry: 'TR',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 36.5497,
          longitude: 29.1164,
        },
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
          ],
          opens: '08:00',
          closes: '19:00',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '2400',
          bestRating: '5',
        },
        priceRange: '$$',
        currenciesAccepted: 'TRY, EUR, USD, GBP',
        paymentAccepted: 'Cash, Credit Card',
        image: 'https://paragliding-oludeniz.com/images/og-default.jpg',
      },
      {
        '@type': 'WebSite',
        '@id': 'https://paragliding-oludeniz.com/#website',
        url: 'https://paragliding-oludeniz.com',
        name: 'Paragliding Ölüdeniz',
        description: 'World-class paragliding from Babadağ Mountain in Ölüdeniz, Turkey',
        publisher: {
          '@id': 'https://paragliding-oludeniz.com/#business',
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://paragliding-oludeniz.com/blog?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <WhyOludeniz />
      <FlightTypesGrid />
      <BabadagIntro />
      <ReviewsSection />
      <BookingCTABanner />
    </>
  )
}
