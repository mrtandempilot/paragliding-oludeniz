import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'
import ServiceSchema from '@/components/shared/ServiceSchema'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Cross Country Paragliding Oludeniz",tr:"Oludeniz Kros Paraşüt",de:"Streckenflug Paragliding Oludeniz",ru:"Маршрутный парапланеризм Олюдениз", zh: "厄卢代尼兹越野滑翔伞"}
  const d = {en:"XC flying from Babadağ across the Fethiye region.",tr:"Babadağ'dan Fethiye bölgesi üzerinde XC uçuşu.",de:"XC-Fliegen vom Babadağ über die Fethiye-Region.",ru:"XC полёты с Бабадага над регионом Фетхие.", zh: "从巴巴达山出发，飞越费特希耶地区的越野飞行。"}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/cross-country-flights'),
    openGraph: { url: localeUrl(locale, '/cross-country-flights'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'crossCountry' })
  const titles = {en:"Cross Country Paragliding Oludeniz",tr:"Oludeniz Kros Paraşüt",de:"Streckenflug Paragliding Oludeniz",ru:"Маршрутный парапланеризм Олюдениз", zh: "厄卢代尼兹越野滑翔伞"}
  const subs = {en:"XC flying from Babadağ across the Fethiye region.",tr:"Babadağ'dan Fethiye bölgesi üzerinde XC uçuşu.",de:"XC-Fliegen vom Babadağ über die Fethiye-Region.",ru:"XC полёты с Бабадага над регионом Фетхие.", zh: "从巴巴达山出发，飞越费特希耶地区的越野飞行。"}
  const bodies = {en:["Cross country (XC) paragliding from Babadağ offers some of the best routes in the Mediterranean. With reliable thermals from April to October, a diverse landscape of mountains, valleys, and coastline, and strong local pilot knowledge, Oludeniz is a destination for serious XC pilots.","The standard XC corridor runs north from Babadağ along the Taurus foothills to Fethiye, with options to extend to Gocek, Dalaman, and beyond. Triangle routes returning to Oludeniz beach are possible on good days. Goal-and-return routes using Fethiye as a turnpoint are popular.","We provide pilot services including meteorology briefings, retrieve service (vehicle pick-up from your landing field), equipment storage, and local knowledge packs. Contact us to arrange your XC support package.","Requirements: minimum P3/CP rating, appropriate equipment inspection on arrival, and a briefing from our operations team. Foreign licenses recognized under CIVL reciprocal agreements."],tr:["Babadağ'dan kros paraşüt, Akdeniz'deki en iyi rotalardan bazılarını sunar. Standart XC koridoru Babadağ'dan kuzeye Fethiye'ye doğru uzanır.","Meteoroloji brifingleri, geri alma hizmeti ve ekipman depolama dahil pilot hizmetleri sunuyoruz."],de:["XC-Fliegen vom Babadağ bietet einige der besten Routen im Mittelmeer. Wir bieten Pilotendienste wie Meteorologie-Briefings, Abholservice und Ausrüstungslagerung an."],ru:["XC парапланеризм с Бабадага предлагает одни из лучших маршрутов в Средиземноморье. Мы предоставляем услуги пилотам: метео-брифинги, подбор и хранение снаряжения."], zh: ["从巴巴达山出发的越野（XC）滑翔伞拥有地中海地区最好的一些航线。4 月至 10 月热气流稳定，地貌涵盖山脉、河谷和海岸线，加上深厚的本地飞行员经验，厄卢代尼兹是认真的越野飞行员的理想目的地。","标准越野航线从巴巴达山沿托罗斯山麓向北飞往费特希耶，还可以延伸至格奇克、达拉曼及更远的地方。条件好的日子可以飞返回厄卢代尼兹海滩的三角航线。以费特希耶为转折点的往返航线也很受欢迎。","我们提供飞行员服务，包括气象简报、回收服务（从您的降落场地开车接您）、装备存放和本地知识资料包。请联系我们安排您的越野支持套餐。","要求：至少 P3/CP 等级，抵达时进行相应的装备检查，并听取我们运营团队的简报。根据 CIVL 互认协议认可外国执照。"]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <ServiceSchema name="Cross Country Paragliding" description="XC paragliding from Babadağ: routes, thermal maps and landing zones for licensed pilots." path="/cross-country-flights" serviceType="Cross Country Paragliding" />
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7bd4/rtDjiycQ-CNoCYjmlrN3-.jpg" />
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
