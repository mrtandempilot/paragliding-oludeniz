import type { Metadata } from 'next'
import Link from 'next/link'
import { Star } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'

export const metadata: Metadata = {
  title: 'Reviews | 2,400+ Five-Star Paragliding Guest Reviews',
  description:
    'Read 2,400+ genuine reviews from guests who have flown with Paragliding Ölüdeniz. Rated 4.9/5 across Google, TripAdvisor and Viator. Tandem paragliding from Babadağ Mountain.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/reviews' },
}

const reviews = [
  {
    name: 'Sarah M.',
    country: '🇬🇧 United Kingdom',
    rating: 5,
    text: 'Absolutely the most incredible experience of my life. The views over the Blue Lagoon are indescribable. My pilot was calm, professional and made me feel completely safe from start to finish.',
    date: 'May 2025',
    platform: 'Google',
  },
  {
    name: 'Klaus W.',
    country: '🇩🇪 Germany',
    rating: 5,
    text: 'I have paraglided in many places around the world but Ölüdeniz from Babadağ is truly special. The altitude, the scenery, the thermals — everything is perfect. Will be back next season.',
    date: 'April 2025',
    platform: 'TripAdvisor',
  },
  {
    name: 'Priya K.',
    country: '🇮🇳 India',
    rating: 5,
    text: 'I was terrified of heights but wanted to push myself. Best decision I ever made. The pilot was incredibly reassuring and the flight was smooth and magical. I cried from joy at the top!',
    date: 'June 2025',
    platform: 'Google',
  },
  {
    name: 'Marco R.',
    country: '🇮🇹 Italy',
    rating: 5,
    text: 'Professional operation from start to finish. The equipment looked immaculate, the briefing was thorough and the flight over the lagoon lasted about 40 minutes. Worth every lira.',
    date: 'July 2025',
    platform: 'Viator',
  },
  {
    name: 'Emma L.',
    country: '🇦🇺 Australia',
    rating: 5,
    text: 'We booked for our whole group of 8 and everyone had an amazing time. They handled the logistics perfectly. The sunset flight was absolutely magical — highly recommend.',
    date: 'August 2025',
    platform: 'Google',
  },
  {
    name: 'James T.',
    country: '🇺🇸 United States',
    rating: 5,
    text: 'Came to Ölüdeniz specifically for the paragliding after seeing it on YouTube. Lived up to every expectation. The launch from 1700m was breathtaking. Book it — you will not regret it.',
    date: 'May 2025',
    platform: 'TripAdvisor',
  },
  {
    name: 'Yuki H.',
    country: '🇯🇵 Japan',
    rating: 5,
    text: 'My pilot spoke perfect English and explained everything before and during the flight. The GoPro video they provided is something I will treasure forever. Exceptional service.',
    date: 'September 2025',
    platform: 'Google',
  },
  {
    name: 'Anna S.',
    country: '🇸🇪 Sweden',
    rating: 5,
    text: 'I booked the sunset flight and it was beyond anything I could have imagined. The sky turned orange and pink as we flew over the lagoon. A memory I will carry for the rest of my life.',
    date: 'August 2025',
    platform: 'Viator',
  },
  {
    name: 'Carlos M.',
    country: '🇪🇸 Spain',
    rating: 5,
    text: 'Very well organised. Pick-up from hotel, drive to mountain, clear briefing, smooth flight, beach landing. Every step was handled professionally. My second time flying with them.',
    date: 'June 2025',
    platform: 'Google',
  },
  {
    name: 'Fatima A.',
    country: '🇦🇪 UAE',
    rating: 5,
    text: 'I have been skydiving but paragliding here is completely different — it is peaceful and beautiful. The pilot pointed out all the landmarks and made the whole experience educational as well.',
    date: 'April 2025',
    platform: 'TripAdvisor',
  },
  {
    name: 'Tom B.',
    country: '🇨🇦 Canada',
    rating: 5,
    text: 'Three generations of our family flew the same day — my 70-year-old mother, myself and my teenage son. All of us had an incredible time. The team handled everyone with so much care.',
    date: 'July 2025',
    platform: 'Google',
  },
  {
    name: 'Lena K.',
    country: '🇷🇺 Russia',
    rating: 5,
    text: 'We were worried about safety but after meeting the team and seeing their equipment and certifications we felt completely reassured. The flight itself was simply stunning.',
    date: 'May 2025',
    platform: 'Viator',
  },
]

const platformColors: Record<string, string> = {
  Google: 'bg-blue-50 text-blue-700',
  TripAdvisor: 'bg-emerald-50 text-emerald-700',
  Viator: 'bg-orange-50 text-orange-700',
}

export default function ReviewsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Tandem Paragliding Ölüdeniz',
    description: 'Tandem paragliding flights from Babadağ Mountain over the Blue Lagoon of Ölüdeniz, Turkey.',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '2400',
      bestRating: '5',
    },
    review: reviews.slice(0, 6).map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.name },
      reviewRating: { '@type': 'Rating', ratingValue: r.rating },
      reviewBody: r.text,
      datePublished: r.date,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        title="What Our Guests Say"
        subtitle="2,400+ five-star reviews from guests who have flown with us from Babadağ Mountain."
        size="sm"
      />

      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3">
          <BreadcrumbNav items={[{ label: 'Reviews' }]} />
        </div>
      </div>

      {/* Rating Summary */}
      <section className="section-padding bg-white">
        <div className="container-default">
          <div className="flex flex-col items-center mb-14">
            <div className="flex items-center gap-2 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-8 h-8 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="text-5xl font-bold text-slate-900">4.9 <span className="text-2xl text-slate-400 font-normal">/ 5</span></p>
            <p className="text-slate-500 mt-2">Based on 2,400+ reviews across Google, TripAdvisor and Viator</p>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div key={review.name + review.date} className="card p-6 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${platformColors[review.platform]}`}>
                    {review.platform}
                  </span>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed flex-1 italic mb-4">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{review.name}</p>
                    <p className="text-slate-500 text-xs">{review.country}</p>
                  </div>
                  <span className="text-slate-400 text-xs">{review.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-slate-50">
        <div className="container-default max-w-2xl">
          <BookingCTA
            title="Ready to Create Your Own Story?"
            subtitle="Join 2,400+ guests who have experienced the world's most beautiful paragliding destination."
          />
        </div>
      </section>
    </>
  )
}
