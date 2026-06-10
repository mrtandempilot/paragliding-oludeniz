import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Beginner Paragliding Courses",tr:"Başlangıç Paraşüt Kursları",de:"Anfänger-Paragliding-Kurse",ru:"Курсы парапланеризма для начинающих"}
  const d = {en:"Learn to fly from scratch with our certified instructors.",tr:"Sertifikalı eğitmenlerimizle sıfırdan uçmayı öğrenin.",de:"Lernen Sie mit unseren zertifizierten Lehrern von Grund auf zu fliegen.",ru:"Научитесь летать с нуля с нашими сертифицированными инструкторами."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/training/beginner-courses'), title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'training' })
  const titles = {en:"Beginner Paragliding Courses",tr:"Başlangıç Paraşüt Kursları",de:"Anfänger-Paragliding-Kurse",ru:"Курсы парапланеризма для начинающих"}
  const subs = {en:"Learn to fly from scratch with our certified instructors.",tr:"Sertifikalı eğitmenlerimizle sıfırdan uçmayı öğrenin.",de:"Lernen Sie mit unseren zertifizierten Lehrern von Grund auf zu fliegen.",ru:"Научитесь летать с нуля с нашими сертифицированными инструкторами."}
  const bodies = {en:["Our beginner courses cover everything from ground handling to your first solo flights. We offer BHPA Elementary Pilot (EP) and Club Pilot (CP) equivalent certification, recognized internationally.","Course structure: Day 1-2: ground handling and kite flying on the training hill. Day 3-4: first tandem flights to experience the air. Day 5-7: first solo flights from the training hill with radio guidance. Day 8-10: consolidation flights and assessment.","All courses include equipment hire, instruction, and a certificate on completion. Maximum 4 students per instructor for personalized teaching.","Contact us for course dates and pricing. Courses run April-October. Minimum age 16."],tr:["Başlangıç kurslarımız yer kullanımından ilk solo uçuşlarınıza kadar her şeyi kapsar. BHPA Elementary Pilot veya Club Pilot eşdeğeri sertifikasyon sunuyoruz.","Kurs yapısı: Gün 1-2: eğitim tepesinde yer kullanımı. Gün 3-4: havayı deneyimlemek için ilk tandem uçuşlar. Gün 5-10: konsolidasyon ve değerlendirme."],de:["Unsere Anfängerkurse decken alles von Bodenhandling bis zu Ihren ersten Soloflügen ab. Wir bieten BHPA EP/CP-äquivalente Zertifizierung an. Kurse laufen April-Oktober."],ru:["Наши курсы для начинающих охватывают всё от наземной отработки до первых соло полётов. Мы предлагаем сертификацию BHPA EP/CP. Курсы проводятся апрель-октябрь."]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
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
