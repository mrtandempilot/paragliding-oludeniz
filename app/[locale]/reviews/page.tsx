import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { Star } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

const reviews = [
  { name: 'Sarah M.', country: '\ud83c\uddec\ud83c\udde7 United Kingdom', rating: 5, text: 'Absolutely the most incredible experience of my life. The views over the Blue Lagoon are indescribable.', date: 'May 2025' },
  { name: 'Klaus W.', country: '\ud83c\udde9\ud83c\uddea Germany', rating: 5, text: 'I have paraglided in many places but Öl\u00fcdeniz from Babadağ is truly special. Everything is perfect.', date: 'April 2025' },
  { name: 'Priya K.', country: '\ud83c\uddee\ud83c\uddf3 India', rating: 5, text: 'I was terrified of heights but wanted to push myself. Best decision I ever made!', date: 'June 2025' },
  { name: 'Marco R.', country: '\ud83c\uddee\ud83c\uddf9 Italy', rating: 5, text: 'Professional operation from start to finish. The flight over the lagoon lasted about 40 minutes.', date: 'July 2025' },
  { name: 'Emma L.', country: '\ud83c\udde6\ud83c\uddfa Australia', rating: 5, text: 'We booked for our whole group of 8. Everyone had an amazing time. The sunset flight was magical.', date: 'August 2025' },
  { name: 'James T.', country: '\ud83c\uddfa\ud83c\uddf8 United States', rating: 5, text: 'Came to Öl\u00fcdeniz specifically for the paragliding. Lived up to every expectation.', date: 'May 2025' },
  { name: 'Ana S.', country: '\ud83c\uddea\ud83c\uddf8 Spain', rating: 5, text: 'Una experiencia incre\u00edble. Los pilotos son muy profesionales y el paisaje es impresionante.', date: 'June 2025' },
  { name: 'Fatma Y.', country: '\ud83c\uddf9\ud83c\uddf7 Turkey', rating: 5, text: 'Harika bir deneyimdi! Pilotlar \u00e7ok profesyonel, manzara muhteşemdi.', date: 'July 2025' },
  { name: 'Dmitri V.', country: '\ud83c\uddf7\ud83c\uddfa Russia', rating: 5, text: '\u041d\u0435\u0432\u0435\u0440\u043e\u044f\u0442\u043d\u044b\u0439 \u043e\u043f\u044b\u0442! \u0413\u043e\u043b\u0443\u0431\u0430\u044f \u041b\u0430\u0433\u0443\u043d\u0430 \u0441 \u0432\u044b\u0441\u043e\u0442\u044b \u2014 \u044d\u0442\u043e \u0447\u0442\u043e-\u0442\u043e \u043e\u0441\u043e\u0431\u0435\u043d\u043d\u043e\u0435.', date: 'August 2025' },
]

const SECTION_TITLE: Record<string, string> = {
  en: 'What Our Passengers Say',
  tr: 'Yolcularımız Ne Diyor',
  de: 'Das sagen unsere Passagiere',
  ru: 'Что говорят наши пассажиры',
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'reviews' })
  const d: Record<string, string> = {"en": "2,400+ five-star reviews from paragliding passengers in Oludeniz. Read real experiences of tandem flights from Babadağ over the Blue Lagoon.", "tr": "Öl\u00fcdeniz'de yamaç paraşütü yapan misafirlerden 2.400+ beş yıldızlı yorum. Babadağ'dan Mavi Lagün üzerine gerçek uçuş deneyimleri.", "de": "Über 2.400 Fünf-Sterne-Bewertungen von Paragliding-Passagieren in Öl\u00fcdeniz. Echte Erfahrungen von Tandemflügen vom Babadağ.", "ru": "Более 2400 пятизвёздочных отзывов пассажиров в Олюденизе. Реальные истории тандемных полётов с Бабадага над Голубой лагуной."}
  return {
    description: d[locale] || d.en,
    alternates: localeAlternates(locale, '/reviews'),
    openGraph: { url: localeUrl(locale, '/reviews'), description: d[locale] || d.en },
    twitter: { card: 'summary_large_image', description: d[locale] || d.en }, title: `${t('pageTitle')}` }
}

export default async function ReviewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'reviews' })
  const sectionTitle = SECTION_TITLE[locale] || SECTION_TITLE.en

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"Article\", \"headline\": \"Paragliding Reviews Oludeniz\", \"description\": \"Reviews and testimonials from customers who have done tandem paragliding in Oludeniz.\", \"url\": \"https://www.atmosparagliding.com/reviews\", \"author\": {\"@type\": \"Person\", \"name\": \"Ceyhun\", \"url\": \"https://www.atmosparagliding.com/en/about-us\"}, \"publisher\": {\"@type\": \"Organization\", \"name\": \"Atmos Paragliding\", \"url\": \"https://www.atmosparagliding.com\"}}" }} />
      <PageHero title={t('pageTitle')} subtitle={t('pageSubtitle')} badge={t('badge')} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c09/2htlcwkJ6pcLBY7gPtf7z.jpg" />
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3">
          <BreadcrumbNav items={[{ label: t('pageTitle') }]} />
        </div>
      </div>
      <section className="section-padding bg-white">
        <div className="container-default">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">{sectionTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((r) => (
              <div key={r.name} className="card p-6 flex flex-col">
                <div className="flex gap-1 mb-4">
                  {[...Array(r.rating)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed flex-1 italic mb-4">&ldquo;{r.text}&rdquo;</p>
                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{r.name}</p>
                    <p className="text-slate-500 text-xs">{r.country}</p>
                  </div>
                  <span className="text-slate-400 text-xs">{r.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <BookingCTA />
    </>
  )
}
