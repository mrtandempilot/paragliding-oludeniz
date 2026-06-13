import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Tandem Paragliding FAQ",tr:"Tandem Paraşüt SSS",de:"Tandem-Paragliding FAQ",ru:"Вопросы и ответы о тандемном парапланеризме"}
  const d = {en:"Answers to the most common questions about tandem paragliding in Oludeniz.",tr:"Oludeniz'de tandem paraşüt hakkında en sık sorulan soruların yanıtları.",de:"Antworten auf die häufigsten Fragen zum Tandem-Paragliding in Oludeniz.",ru:"Ответы на самые распространённые вопросы о тандемном парапланеризме в Олюдениз."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/tandem-paragliding/faq'),
    openGraph: { url: localeUrl(locale, '/tandem-paragliding/faq'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'faq' })
  const titles = {en:"Tandem Paragliding FAQ",tr:"Tandem Paraşüt SSS",de:"Tandem-Paragliding FAQ",ru:"Вопросы и ответы о тандемном парапланеризме"}
  const subs = {en:"Answers to the most common questions about tandem paragliding in Oludeniz.",tr:"Oludeniz'de tandem paraşüt hakkında en sık sorulan soruların yanıtları.",de:"Antworten auf die häufigsten Fragen zum Tandem-Paragliding in Oludeniz.",ru:"Ответы на самые распространённые вопросы о тандемном парапланеризме в Олюдениз."}
  const bodies = {en:["How long is the flight? Standard flights last 25-35 minutes (1200m launch) or 35-50 minutes (1700m launch). Sunset flights last 20-30 minutes. Actual duration depends on weather conditions.","Is it safe? Tandem paragliding with a certified pilot has an excellent safety record. Our operation has completed over 50,000 flights without a serious passenger injury. See our safety record page for full details.","What is the weight limit? Maximum 110kg per passenger. There is no minimum weight. Children should be able to follow instructions and are welcome from age 5+ with parent approval.","Can I take photos? Yes. We recommend securing your phone with a wrist strap. We also offer photo and video packages.","What if the weather is bad? We monitor conditions daily. If we cancel due to weather, you receive a full refund or free rescheduling."],tr:["Uçuş süresi ne kadar? Standart uçuşlar 25-35 dakika (1200m) veya 35-50 dakika (1700m) sürer. Ağırlık sınırı? Yolcu başına maksimum 110 kg. Hava kötüyse tam iade veya ücretsiz yeniden planlama."],de:["Wie lange dauert der Flug? Standardflüge 25-35 Min. (1200m) oder 35-50 Min. (1700m). Gewichtslimit: max. 110kg. Bei Wetterausfall: vollständige Rückerstattung oder kostenlose Umplanung."],ru:["Сколько длится полёт? Стандартные полёты 25-35 минут (1200м) или 35-50 минут (1700м). Лимит веса: максимум 110 кг. При отмене из-за погоды: полный возврат или бесплатный перенос."]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
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
