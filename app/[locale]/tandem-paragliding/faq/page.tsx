import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'
import ServiceSchema from '@/components/shared/ServiceSchema'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Tandem Paragliding FAQ",tr:"Tandem Paraşüt SSS",de:"Tandem-Paragliding FAQ",ru:"Вопросы и ответы о тандемном парапланеризме", zh: "双人滑翔伞常见问题"}
  const d = {en:"Answers to the most common questions about tandem paragliding in Oludeniz.",tr:"Oludeniz'de tandem paraşüt hakkında en sık sorulan soruların yanıtları.",de:"Antworten auf die häufigsten Fragen zum Tandem-Paragliding in Oludeniz.",ru:"Ответы на самые распространённые вопросы о тандемном парапланеризме в Олюдениз.", zh: "关于厄卢代尼兹双人滑翔伞最常见问题的解答。"}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/tandem-paragliding/faq'),
    openGraph: { url: localeUrl(locale, '/tandem-paragliding/faq'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'faq' })
  const titles = {en:"Tandem Paragliding FAQ",tr:"Tandem Paraşüt SSS",de:"Tandem-Paragliding FAQ",ru:"Вопросы и ответы о тандемном парапланеризме", zh: "双人滑翔伞常见问题"}
  const subs = {en:"Answers to the most common questions about tandem paragliding in Oludeniz.",tr:"Oludeniz'de tandem paraşüt hakkında en sık sorulan soruların yanıtları.",de:"Antworten auf die häufigsten Fragen zum Tandem-Paragliding in Oludeniz.",ru:"Ответы на самые распространённые вопросы о тандемном парапланеризме в Олюдениз.", zh: "关于厄卢代尼兹双人滑翔伞最常见问题的解答。"}
  const bodies = {en:["How long is the flight? Standard flights last 25-35 minutes (1200m launch) or 35-50 minutes (1700m launch). Sunset flights last 20-30 minutes. Actual duration depends on weather conditions.","Is it safe? Tandem paragliding with a certified pilot has an excellent safety record. Our operation has completed over 50,000 flights without a serious passenger injury. See our safety record page for full details.","What is the weight limit? Maximum 110kg per passenger. There is no minimum weight. Children should be able to follow instructions and are welcome from age 5+ with parent approval.","Can I take photos? Yes. We recommend securing your phone with a wrist strap. We also offer photo and video packages.","What if the weather is bad? We monitor conditions daily. If we cancel due to weather, you receive a full refund or free rescheduling."],tr:["Uçuş süresi ne kadar? Standart uçuşlar 25-35 dakika (1200m) veya 35-50 dakika (1700m) sürer. Ağırlık sınırı? Yolcu başına maksimum 110 kg. Hava kötüyse tam iade veya ücretsiz yeniden planlama."],de:["Wie lange dauert der Flug? Standardflüge 25-35 Min. (1200m) oder 35-50 Min. (1700m). Gewichtslimit: max. 110kg. Bei Wetterausfall: vollständige Rückerstattung oder kostenlose Umplanung."],ru:["Сколько длится полёт? Стандартные полёты 25-35 минут (1200м) или 35-50 минут (1700м). Лимит веса: максимум 110 кг. При отмене из-за погоды: полный возврат или бесплатный перенос."], zh: ["飞行时间有多长？标准飞行持续 25–35 分钟（1200 米起飞点）或 35–50 分钟（1700 米起飞点）。日落飞行持续 20–30 分钟。实际时长取决于天气条件。","安全吗？由认证飞行员带飞的双人滑翔伞拥有出色的安全记录。我们已完成超过 50,000 次飞行，没有发生一起乘客严重受伤事故。完整详情请见我们的安全记录页面。","体重限制是多少？每位乘客最多 110 公斤。没有最低体重限制。儿童需能听从指示，经家长同意后 5 岁以上即可参加。","可以拍照吗？可以。我们建议用腕带固定好您的手机。我们也提供照片和视频套餐。","如果天气不好怎么办？我们每天监测天气条件。如因天气原因取消，您将获得全额退款或免费改期。"]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <ServiceSchema name="Paragliding FAQ Oludeniz" description="Frequently asked questions about tandem paragliding in Oludeniz from Babadağ Mountain." path="/tandem-paragliding/faq" serviceType="Tandem Paragliding Flight" />
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c09/2htlcwkJ6pcLBY7gPtf7z.jpg" />
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
