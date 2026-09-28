import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Cloudbase Guide Oludeniz",tr:"Oludeniz Bulut Tabanı Rehberi",de:"Wolkenbasis-Leitfaden Oludeniz",ru:"Гид по облачному основанию Олюдениз", zh: "厄卢代尼兹云底高度指南"}
  const d = {en:"Cloudbase at Babadağ and what it means for your flight.",tr:"Babadağ'da bulut tabanı ve uçuşunuz için ne anlama geldiği.",de:"Wolkenbasis am Babadağ und was das für Ihren Flug bedeutet.",ru:"Облачное основание на Бабадаге и что это значит для вашего полёта.", zh: "巴巴达山的云底高度及其对您飞行的影响。"}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/weather-guide/cloudbase'),
    openGraph: { url: localeUrl(locale, '/weather-guide/cloudbase'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'weatherGuide' })
  const titles = {en:"Cloudbase Guide Oludeniz",tr:"Oludeniz Bulut Tabanı Rehberi",de:"Wolkenbasis-Leitfaden Oludeniz",ru:"Гид по облачному основанию Олюдениз", zh: "厄卢代尼兹云底高度指南"}
  const subs = {en:"Cloudbase at Babadağ and what it means for your flight.",tr:"Babadağ'da bulut tabanı ve uçuşunuz için ne anlama geldiği.",de:"Wolkenbasis am Babadağ und was das für Ihren Flug bedeutet.",ru:"Облачное основание на Бабадаге и что это значит для вашего полёта.", zh: "巴巴达山的云底高度及其对您飞行的影响。"}
  const bodies = {en:["Cloudbase (the base of cumulus clouds) at Oludeniz typically ranges from 1500m in spring to 2800m in summer. The ideal cloudbase for tandem flying is above 1600m — ensuring the launch (1200m) and flight path are comfortably below cloud.","Cloudbase below 1400m: we may delay flights or launch from a lower point. Cloudbase below 1200m (launch level): no flying. This is rare in the main season but can occur in early spring or after frontal systems.","For solo XC pilots, cloudbase is critical for route planning. Average summer cloudbase of 2200-2600m allows comfortable XC flying to 1800m+ heights, opening up routes to Fethiye, Gocek, and beyond.","We report current cloudbase on our WhatsApp status and Instagram every morning. Follow us for real-time conditions."],tr:["Oludeniz'de bulut tabanı, ilkbaharda 1500m'den yazın 2800m'ye kadar değişir. Tandem uçuş için ideal bulut tabanı 1600m üzerindedir."],de:["Die Wolkenbasis in Oludeniz reicht typischerweise von 1500m im Frühling bis 2800m im Sommer. Die ideale Wolkenbasis für Tandemfliegen liegt über 1600m."],ru:["Облачное основание в Олюдениз обычно от 1500м весной до 2800м летом. Идеальное облачное основание для тандемных полётов — выше 1600м."], zh: ["厄卢代尼兹的云底（积云底部）高度通常从春季的 1500 米到夏季的 2800 米不等。双人飞行理想的云底高度在 1600 米以上——确保起飞点（1200 米）和飞行航线都在云层下方，留有充足余量。","云底低于 1400 米：我们可能会推迟飞行或从较低的地点起飞。云底低于 1200 米（起飞点高度）：不飞行。这种情况在主飞行季很少见，但可能在早春或锋面过境后出现。","对于单人越野飞行员来说，云底高度对航线规划至关重要。夏季平均云底高度为 2200–2600 米，可以在 1800 米以上的高度舒适地进行越野飞行，打开通往费特希耶、格奇克及更远地方的航线。","我们每天早上都会在 WhatsApp 状态和 Instagram 上报告当前的云底高度。关注我们，获取实时天气条件。"]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"Article\", \"headline\": \"Cloudbase Guide for Paragliding Oludeniz\", \"description\": \"Understanding cloudbase and its effect on paragliding conditions in Oludeniz.\", \"url\": \"https://atmosparagliding.com/weather-guide/cloudbase\", \"author\": {\"@type\": \"Person\", \"name\": \"Ceyhun\", \"url\": \"https://atmosparagliding.com/en/about-us\"}, \"publisher\": {\"@type\": \"Organization\", \"name\": \"Atmos Paragliding\", \"url\": \"https://atmosparagliding.com\"}}" }} />
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
