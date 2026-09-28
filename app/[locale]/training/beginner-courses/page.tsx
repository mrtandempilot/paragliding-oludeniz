import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'
import ServiceSchema from '@/components/shared/ServiceSchema'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Beginner Paragliding Courses",tr:"Başlangıç Paraşüt Kursları",de:"Anfänger-Paragliding-Kurse",ru:"Курсы парапланеризма для начинающих", zh: "滑翔伞初级课程"}
  const d = {en:"Learn to fly from scratch with our certified instructors.",tr:"Sertifikalı eğitmenlerimizle sıfırdan uçmayı öğrenin.",de:"Lernen Sie mit unseren zertifizierten Lehrern von Grund auf zu fliegen.",ru:"Научитесь летать с нуля с нашими сертифицированными инструкторами.", zh: "跟随我们的认证教练从零开始学飞。"}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/training/beginner-courses'),
    openGraph: { url: localeUrl(locale, '/training/beginner-courses'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'training' })
  const titles = {en:"Beginner Paragliding Courses",tr:"Başlangıç Paraşüt Kursları",de:"Anfänger-Paragliding-Kurse",ru:"Курсы парапланеризма для начинающих", zh: "滑翔伞初级课程"}
  const subs = {en:"Learn to fly from scratch with our certified instructors.",tr:"Sertifikalı eğitmenlerimizle sıfırdan uçmayı öğrenin.",de:"Lernen Sie mit unseren zertifizierten Lehrern von Grund auf zu fliegen.",ru:"Научитесь летать с нуля с нашими сертифицированными инструкторами.", zh: "跟随我们的认证教练从零开始学飞。"}
  const bodies = {en:["Our beginner courses cover everything from ground handling to your first solo flights. We offer BHPA Elementary Pilot (EP) and Club Pilot (CP) equivalent certification, recognized internationally.","Course structure: Day 1-2: ground handling and kite flying on the training hill. Day 3-4: first tandem flights to experience the air. Day 5-7: first solo flights from the training hill with radio guidance. Day 8-10: consolidation flights and assessment.","All courses include equipment hire, instruction, and a certificate on completion. Maximum 4 students per instructor for personalized teaching.","Contact us for course dates and pricing. Courses run April-October. Minimum age 16."],tr:["Başlangıç kurslarımız yer kullanımından ilk solo uçuşlarınıza kadar her şeyi kapsar. BHPA Elementary Pilot veya Club Pilot eşdeğeri sertifikasyon sunuyoruz.","Kurs yapısı: Gün 1-2: eğitim tepesinde yer kullanımı. Gün 3-4: havayı deneyimlemek için ilk tandem uçuşlar. Gün 5-10: konsolidasyon ve değerlendirme."],de:["Unsere Anfängerkurse decken alles von Bodenhandling bis zu Ihren ersten Soloflügen ab. Wir bieten BHPA EP/CP-äquivalente Zertifizierung an. Kurse laufen April-Oktober."],ru:["Наши курсы для начинающих охватывают всё от наземной отработки до первых соло полётов. Мы предлагаем сертификацию BHPA EP/CP. Курсы проводятся апрель-октябрь."], zh: ["我们的初级课程涵盖从地面操控到首次单人飞行的全部内容。我们提供与 BHPA 初级飞行员（EP）和俱乐部飞行员（CP）同等的认证，获得国际认可。","课程安排：第 1–2 天：在训练坡上进行地面操控和放伞练习。第 3–4 天：首次双人飞行，体验空中感受。第 5–7 天：在无线电指导下从训练坡首次单人飞行。第 8–10 天：巩固飞行和考核。","所有课程均包含装备租赁、教学指导，结业时颁发证书。每位教练最多带 4 名学员，确保个性化教学。","请联系我们了解课程日期和价格。课程于 4 月至 10 月开课。最低年龄 16 岁。"]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <ServiceSchema name="Beginner Paragliding Course Oludeniz" description="Beginner paragliding courses in Oludeniz — learn to fly from Babadağ Mountain." path="/training/beginner-courses" serviceType="Paragliding Training Course" />
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c0c/Dn0br3flHariTrqYqhISR.jpg" />
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
