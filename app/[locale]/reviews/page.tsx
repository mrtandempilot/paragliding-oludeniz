import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { Star } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { localeAlternates } from '@/lib/seo'

const reviews = [
  { name: 'Sarah M.', country: '🇬🇧 United Kingdom', rating: 5, text: 'Absolutely the most incredible experience of my life. The views over the Blue Lagoon are indescribable.', date: 'May 2025' },
  { name: 'Klaus W.', country: '🇩🇪 Germany', rating: 5, text: 'I have paraglided in many places but Ölüdeniz from Babadağ is truly special. Everything is perfect.', date: 'April 2025' },
  { name: 'Priya K.', country: '🇮🇳 India', rating: 5, text: 'I was terrified of heights but wanted to push myself. Best decision I ever made!', date: 'June 2025' },
  { name: 'Marco R.', country: '🇮🇹 Italy', rating: 5, text: 'Professional operation from start to finish. The flight over the lagoon lasted about 40 minutes.', date: 'July 2025' },
  { name: 'Emma L.', country: '🇦🇺 Australia', rating: 5, text: 'We booked for our whole group of 8. Everyone had an amazing time. The sunset flight was magical.', date: 'August 2025' },
  { name: 'James T.', country: '🇺🇸 United States', rating: 5, text: 'Came to Ölüdeniz specifically for the paragliding. Lived up to every expectation.', date: 'May 2025' },
  { name: 'Ana S.', country: '🇪🇸 Spain', rating: 5, text: 'Una experiencia increíble. Los pilotos son muy profesionales y el paisaje es impresionante.', date: 'June 2025' },
  { name: 'Fatma Y.', country: '🇹🇷 Turkey', rating: 5, text: 'Harika bir deneyimdi! Pilotlar çok profesyonel, manzara muhteşemdi.', date: 'July 2025' },
  { name: 'Dmitri V.', country: '🇷🇺 Russia', rating: 5, text: 'Невероятный опыт! Голубая Лагуна с высоты — это что-то особенное.', date: 'August 2025' },
]

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'reviews' })
  return {
    alternates: localeAlternates(locale, '/reviews'), title: `${t('pageTitle')} | Paragliding Ölüdeniz` }
}

export default async function ReviewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'reviews' })

  return (
    <>
      <PageHero title={t('pageTitle')} subtitle={t('pageSubtitle')} badge={t('badge')} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c09/2htlcwkJ6pcLBY7gPtf7z.jpg" />
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3">
          <BreadcrumbNav items={[{ label: t('pageTitle') }]} />
        </div>
      </div>
      <section className="section-padding bg-white">
        <div className="container-default">
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
