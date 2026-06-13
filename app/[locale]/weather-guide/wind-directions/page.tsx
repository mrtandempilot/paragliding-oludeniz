import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Wind Directions Guide Oludeniz",tr:"Oludeniz Rüzgar Yönleri Rehberi",de:"Windrichtungsführer Oludeniz",ru:"Гид по направлениям ветра Олюдениз"}
  const d = {en:"How different wind directions affect flying conditions.",tr:"Farklı rüzgar yönlerinin uçuş koşullarını nasıl etkilediği.",de:"Wie verschiedene Windrichtungen die Flugbedingungen beeinflussen.",ru:"Как разные направления ветра влияют на условия полётов."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/weather-guide/wind-directions'),
    openGraph: { url: localeUrl(locale, '/weather-guide/wind-directions'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'weatherGuide' })
  const titles = {en:"Wind Directions Guide Oludeniz",tr:"Oludeniz Rüzgar Yönleri Rehberi",de:"Windrichtungsführer Oludeniz",ru:"Гид по направлениям ветра Олюдениз"}
  const subs = {en:"How different wind directions affect flying conditions.",tr:"Farklı rüzgar yönlerinin uçuş koşullarını nasıl etkilediği.",de:"Wie verschiedene Windrichtungen die Flugbedingungen beeinflussen.",ru:"Как разные направления ветра влияют на условия полётов."}
  const bodies = {en:["North-west (NW): the ideal wind direction for Babadağ. Creates a clean, consistent flow across the launch ramp, good soaring conditions above the ridge, and a predictable final glide to the beach. NW winds of 8-15 km/h are ideal.","North (N): acceptable for flying, slightly crosswind at the 1200m launch but manageable. Good conditions overall. North winds bring clearer, cooler air.","West (W): acceptable but can create rotors behind the ridge. Our pilots assess carefully and may choose a different launch or delay until conditions improve.","South (S) or South-east (SE): generally not suitable for flying. South winds create turbulence behind the mountain and make the beach approach more complex. We do not fly in south or south-east winds above 10 km/h.","East (E): flyable in light conditions. Strong easterlies create lee-side turbulence on the Babadağ western face."],tr:["Kuzey-batı (KB): Babadağ için ideal rüzgar yönü. 8-15 km/h KU rüzgarları idealdir. Güney veya güneydoğu rüzgarlarında uçmuyoruz."],de:["Nordwest (NW): die ideale Windrichtung für den Babadağ. NW-Winde von 8-15 km/h sind ideal. Bei Süd- oder Südostwinden fliegen wir nicht."],ru:["Северо-запад (СЗ): идеальное направление для Бабадага. СЗ ветер 8-15 км/ч — идеален. При южном и юго-восточном ветре мы не летаем."]}
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
