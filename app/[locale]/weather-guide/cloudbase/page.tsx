import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Cloudbase Guide Oludeniz",tr:"Oludeniz Bulut Tabanı Rehberi",de:"Wolkenbasis-Leitfaden Oludeniz",ru:"Гид по облачному основанию Олюдениз"}
  const d = {en:"Cloudbase at Babadağ and what it means for your flight.",tr:"Babadağ'da bulut tabanı ve uçuşunuz için ne anlama geldiği.",de:"Wolkenbasis am Babadağ und was das für Ihren Flug bedeutet.",ru:"Облачное основание на Бабадаге и что это значит для вашего полёта."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/weather-guide/cloudbase'),
    openGraph: { url: localeAlternates(locale, '/weather-guide/cloudbase').canonical! }, title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'weatherGuide' })
  const titles = {en:"Cloudbase Guide Oludeniz",tr:"Oludeniz Bulut Tabanı Rehberi",de:"Wolkenbasis-Leitfaden Oludeniz",ru:"Гид по облачному основанию Олюдениз"}
  const subs = {en:"Cloudbase at Babadağ and what it means for your flight.",tr:"Babadağ'da bulut tabanı ve uçuşunuz için ne anlama geldiği.",de:"Wolkenbasis am Babadağ und was das für Ihren Flug bedeutet.",ru:"Облачное основание на Бабадаге и что это значит для вашего полёта."}
  const bodies = {en:["Cloudbase (the base of cumulus clouds) at Oludeniz typically ranges from 1500m in spring to 2800m in summer. The ideal cloudbase for tandem flying is above 1600m — ensuring the launch (1200m) and flight path are comfortably below cloud.","Cloudbase below 1400m: we may delay flights or launch from a lower point. Cloudbase below 1200m (launch level): no flying. This is rare in the main season but can occur in early spring or after frontal systems.","For solo XC pilots, cloudbase is critical for route planning. Average summer cloudbase of 2200-2600m allows comfortable XC flying to 1800m+ heights, opening up routes to Fethiye, Gocek, and beyond.","We report current cloudbase on our WhatsApp status and Instagram every morning. Follow us for real-time conditions."],tr:["Oludeniz'de bulut tabanı, ilkbaharda 1500m'den yazın 2800m'ye kadar değişir. Tandem uçuş için ideal bulut tabanı 1600m üzerindedir."],de:["Die Wolkenbasis in Oludeniz reicht typischerweise von 1500m im Frühling bis 2800m im Sommer. Die ideale Wolkenbasis für Tandemfliegen liegt über 1600m."],ru:["Облачное основание в Олюдениз обычно от 1500м весной до 2800м летом. Идеальное облачное основание для тандемных полётов — выше 1600м."]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c0a/3Aur6SnimoW0BlFJ4cq8J.jpg" />
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
