import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Babadag Road Guide",tr:"Babadag Yol Rehberi",de:"Babadag Strassenführer",ru:"Дорожный гид Бабадаг"}
  const d = {en:"How to get to Babadag launch by road.",tr:"Babadag kalki noktasina yolla nasil gidilir.",de:"So gelangen Sie zum Babadag-Start.",ru:"Как добраться до Бабадага по дороге."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/babadag-guide/babadag-road-guide'), title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'babadagGuide' })
  const titles = {en:"Babadag Road Guide",tr:"Babadag Yol Rehberi",de:"Babadag Strassenführer",ru:"Дорожный гид Бабадаг"}
  const subs = {en:"How to get to Babadag launch by road.",tr:"Babadag kalki noktasina yolla nasil gidilir.",de:"So gelangen Sie zum Babadag-Start.",ru:"Как добраться до Бабадага по дороге."}
  const bodies: Record<string,string[]> = {
    en: ["The mountain road to Babadağ starts from the Oludeniz junction on the main D400 highway and climbs approximately 1700m. The road is well-maintained tarmac with passing places. Drive time from Oludeniz beach: 30-35 minutes.","All tandem flight transfers are included in our packages. Solo pilots can park at designated areas at the 1200m and 1700m launch points. Road opens daily at 07:00 during season."],
    tr: ["Babadağ dağ yolu, ana D400 karayolundaki Oludeniz kavşağından başlar ve yaklaşık 1700m'ye tırmanır. Oludeniz plajından sürüş süresi 30-35 dakikadır.","Tüm tandem uçuş transferleri paketlerimize dahildir. Solo pilotlar 1200m ve 1700m kalkış noktalarındaki belirlenen alanlara park edebilir."],
    de: ["The mountain road to Babadağ starts from the Oludeniz junction on the main D400 highway and climbs approximately 1700m. The road is well-maintained tarmac with passing places. Drive time from Oludeniz beach: 30-35 minutes.","All tandem flight transfers are included in our packages. Solo pilots can park at designated areas at the 1200m and 1700m launch points. Road opens daily at 07:00 during season."],
    ru: ["The mountain road to Babadağ starts from the Oludeniz junction on the main D400 highway and climbs approximately 1700m. The road is well-maintained tarmac with passing places. Drive time from Oludeniz beach: 30-35 minutes.","All tandem flight transfers are included in our packages. Solo pilots can park at designated areas at the 1200m and 1700m launch points. Road opens daily at 07:00 during season."],
  }
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = bodies[locale]||bodies.en
  return (
    <>
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c08/BbYEw0ihhZaLcaN29vTrs.jpg" />
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3"><BreadcrumbNav items={[{ label: title }]} /></div>
      </div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl space-y-4">
          {body.map((p, i) => <p key={i} className="text-slate-600 leading-relaxed">{p}</p>)}
        </div>
      </section>
      <BookingCTA />
    </>
  )
}
