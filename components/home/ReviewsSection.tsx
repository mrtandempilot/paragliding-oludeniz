'use client'

import { Star } from 'lucide-react'
import { useTranslations } from 'next-intl'

const reviews = [
  {
    name: 'Sarah M.',
    country: '🇬🇧 United Kingdom',
    rating: 5,
    text: 'Absolutely the most incredible experience of my life. The views over the Blue Lagoon are indescribable. My pilot was calm, professional and made me feel completely safe from start to finish.',
    date: 'May 2025',
  },
  {
    name: 'Klaus W.',
    country: '🇩🇪 Germany',
    rating: 5,
    text: 'I have paraglided in many places around the world but Ölüdeniz from Babadağ is truly special. The altitude, the scenery, the thermals — everything is perfect. Will be back next season.',
    date: 'April 2025',
  },
  {
    name: 'Priya K.',
    country: '🇮🇳 India',
    rating: 5,
    text: 'I was terrified of heights but wanted to push myself. Best decision I ever made. The pilot was incredibly reassuring and the flight was smooth and magical. I cried from joy at the top!',
    date: 'June 2025',
  },
  {
    name: 'Marco R.',
    country: '🇮🇹 Italy',
    rating: 5,
    text: 'Professional operation from start to finish. The equipment looked immaculate, the briefing was thorough and the flight over the lagoon lasted about 40 minutes. Worth every lira.',
    date: 'July 2025',
  },
  {
    name: 'Emma L.',
    country: '🇦🇺 Australia',
    rating: 5,
    text: 'We booked for our whole group of 8 and everyone had an amazing time. They handled the logistics perfectly. The sunset flight was absolutely magical — highly recommend.',
    date: 'August 2025',
  },
  {
    name: 'James T.',
    country: '🇺🇸 United States',
    rating: 5,
    text: 'Came to Ölüdeniz specifically for the paragliding after seeing it on YouTube. Lived up to every expectation. The launch from 1700m was breathtaking. Book it — you will not regret it.',
    date: 'May 2025',
  },
]

export default function ReviewsSection() {
  const t = useTranslations('reviews')

  return (
    <section className="section-padding bg-white">
      <div className="container-default">
        <div className="text-center mb-14">
          <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">
            {t('badge')}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">
            {t('title')}
          </h2>
          <div className="flex items-center justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            ))}
            <span className="text-slate-700 font-bold text-lg ml-1">4.9</span>
            <span className="text-slate-500">/ 5</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div key={review.name} className="card p-6 flex flex-col">
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
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

        <div className="text-center mt-10">
          <a href="/reviews" className="btn-secondary">
            {t('cta')}
          </a>
        </div>
      </div>
    </section>
  )
}
