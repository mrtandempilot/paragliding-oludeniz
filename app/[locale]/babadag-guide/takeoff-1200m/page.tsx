import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"1200m Launch Point",tr:"1200m Kalkış Noktası",de:"1200m Startplatz",ru:"Стартовая площадка 1200м"}
  const d = {en:"The 1200m launch is the most popular and accessible takeoff point on Babadağ, used for standard tandem flights.",tr:"1200m kalkış, standart tandem uçuşlar için kullanılan Babadağ'ın en popüler ve erişilebilir kalkış noktasıdır.",de:"Der 1200m Start ist der beliebteste und zugänglichste Startplatz am Babadağ, der für Standard-Tandemflüge genutzt wird.",ru:"Стартовая площадка 1200м — самая популярная и доступная точка на Бабадаге для стандартных тандемных полётов."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/babadag-guide/takeoff-1200m'),
    openGraph: { url: localeUrl(locale, '/babadag-guide/takeoff-1200m'), description: (d as any)[locale] || d.en }, title: `${t[locale as keyof typeof t]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'babadagGuide' })
  const titles = {en:"1200m Launch Point",tr:"1200m Kalkış Noktası",de:"1200m Startplatz",ru:"Стартовая площадка 1200м"}
  const subs = {en:"The 1200m launch is the most popular and accessible takeoff point on Babadağ, used for standard tandem flights.",tr:"1200m kalkış, standart tandem uçuşlar için kullanılan Babadağ'ın en popüler ve erişilebilir kalkış noktasıdır.",de:"Der 1200m Start ist der beliebteste und zugänglichste Startplatz am Babadağ, der für Standard-Tandemflüge genutzt wird.",ru:"Стартовая площадка 1200м — самая популярная и доступная точка на Бабадаге для стандартных тандемных полётов."}
  const bodies = {en:["The 1200m launch is the most popular and accessible takeoff point on Babadağ, used for standard tandem flights. Contact us for access requirements and booking."],tr:["1200m kalkış, standart tandem uçuşlar için kullanılan Babadağ'ın en popüler ve erişilebilir kalkış noktasıdır. Erişim gereksinimleri ve rezervasyon için bize ulaşın."],de:["Der 1200m Start ist der beliebteste und zugänglichste Startplatz am Babadağ, der für Standard-Tandemflüge genutzt wird. Kontaktieren Sie uns für Zugangsanforderungen und Buchung."],ru:["Стартовая площадка 1200м — самая популярная и доступная точка на Бабадаге для стандартных тандемных полётов. Свяжитесь с нами для получения информации о доступе и бронировании."]}
  type L = keyof typeof titles
  const title = titles[locale as L]||titles.en
  const sub = subs[locale as L]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c08/BbYEw0ihhZaLcaN29vTrs.jpg" />
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3"><BreadcrumbNav items={[{ label: title }]} /></div>
      </div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl space-y-4">
          {body.map((p: string, i: number) => <p key={i} className="text-slate-600 leading-relaxed">{p}</p>)}
        </div>
      </section>
      <BookingCTA />
    </>
  )
}
