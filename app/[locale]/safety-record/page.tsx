import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Our Safety Record",tr:"Güvenlik Rekorumuz",de:"Unsere Sicherheitsbilanz",ru:"Наш рекорд безопасности", zh: "我们的安全记录"}
  const d = {en:"25+ years. Thousands of flights. Zero serious incidents.",tr:"25+ yıl. Binlerce uçuş. Sıfır ciddi kaza.",de:"25+ Jahre. Tausende Flüge. Null ernste Zwischenfälle.",ru:"25+ лет. Тысячи полётов. Ноль серьёзных инцидентов.", zh: "25 年以上经验。成千上万次飞行。零严重事故。"}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/safety-record'),
    openGraph: { url: localeUrl(locale, '/safety-record'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'safetyRecord' })
  const titles = {en:"Our Safety Record",tr:"Güvenlik Rekorumuz",de:"Unsere Sicherheitsbilanz",ru:"Наш рекорд безопасности", zh: "我们的安全记录"}
  const subs = {en:"25+ years. Thousands of flights. Zero serious incidents.",tr:"25+ yıl. Binlerce uçuş. Sıfır ciddi kaza.",de:"25+ Jahre. Tausende Flüge. Null ernste Zwischenfälle.",ru:"25+ лет. Тысячи полётов. Ноль серьёзных инцидентов.", zh: "25 年以上经验。成千上万次飞行。零严重事故。"}
  const bodies = {en:["Our safety record is the foundation of everything we do. Since our first flight in 1999, we have completed over 50,000 tandem flights without a single serious passenger injury. This is not luck — it is the result of strict protocols, rigorous equipment maintenance, and a culture where safety always comes before revenue.","Pilot certification: all our pilots hold current SHGM (Turkish Civil Aviation Authority) tandem ratings, plus international BHPA or DHV certifications. Annual refresher training is mandatory. Pilots who are not current do not fly, regardless of demand.","Equipment: we replace main canopies on a strict cycle, regardless of apparent condition. Reserve parachutes are repacked every 180 days by certified riggers. Harnesses and helmets are inspected daily and replaced at the first sign of wear.","Weather protocols: we monitor three weather stations continuously and hold daily morning briefings. We have a no-fly policy for crosswinds above 8km/h, gusts above 25km/h, or any frontal activity. We would rather refund a booking than fly in marginal conditions.","We are proud members of the Oludeniz Paragliding Association and adhere to all Turkish Civil Aviation regulations and international best-practice guidelines."],tr:["Güvenlik rekorumuz yaptığımız her şeyin temelini oluşturur. 1999'daki ilk uçuşumuzdan bu yana tek bir ciddi yolcu yaralanması olmaksızın 50.000'den fazla tandem uçuşu tamamladık.","Pilotlarımız SHGM sertifikalı ve uluslararası BHPA veya DHV sertifikalarına sahiptir. Hava koşulları protokolleri katıdır ve sınır koşullarda uçmak yerine rezervasyonu iade etmeyi tercih ederiz."],de:["Unser Sicherheitsrekord ist die Grundlage von allem, was wir tun. Seit unserem ersten Flug 1999 haben wir über 50.000 Tandemflüge ohne eine einzige ernste Passagierverletzung abgeschlossen.","Alle unsere Piloten sind SHGM-zertifiziert und haben internationale BHPA- oder DHV-Zertifizierungen. Wir haben strikte Wetterproktokolle."],ru:["Наш рекорд безопасности — основа всего, что мы делаем. С 1999 года мы выполнили более 50 000 тандемных полётов без единой серьёзной травмы пассажира.","Все наши пилоты имеют сертификацию SHGM и международные сертификаты BHPA или DHV. У нас строгие погодные протоколы."], zh: ["安全记录是我们一切工作的基础。自 1999 年首次飞行以来，我们已完成超过 50,000 次双人飞行，没有发生一起乘客严重受伤事故。这不是运气——而是严格的规程、一丝不苟的装备维护，以及安全永远优先于收益的文化的结果。","飞行员资质：我们所有的飞行员都持有有效的土耳其民航总局（SHGM）双人飞行资质，以及国际 BHPA 或 DHV 认证。每年必须参加复训。资质不在有效期内的飞行员无论需求多大都不会飞行。","装备：无论外观状况如何，我们都会按照严格的周期更换主伞。备用伞由认证叠伞员每 180 天重新折叠一次。吊带和头盔每天检查，一有磨损迹象就立即更换。","天气规程：我们持续监测三个气象站，并每天早上召开简报会。侧风超过 8 公里/小时、阵风超过 25 公里/小时或有任何锋面活动时，我们一律禁飞。我们宁愿退还预订款，也不会在临界条件下飞行。","我们自豪地成为厄卢代尼兹滑翔伞协会的会员，并遵守所有土耳其民航法规和国际最佳实践准则。"]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"Article\", \"headline\": \"Paragliding Safety Record Oludeniz\", \"description\": \"Our safety record and commitment to safe tandem paragliding in Oludeniz.\", \"url\": \"https://atmosparagliding.com/safety-record\", \"author\": {\"@type\": \"Person\", \"name\": \"Ceyhun\", \"url\": \"https://atmosparagliding.com/en/about-us\"}, \"publisher\": {\"@type\": \"Organization\", \"name\": \"Atmos Paragliding\", \"url\": \"https://atmosparagliding.com\"}}" }} />
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c0e/5dF2dxA0ErV0Pcg9kh6CJ.jpg" />
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
