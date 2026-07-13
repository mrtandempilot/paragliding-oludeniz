import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'
import ServiceSchema from '@/components/shared/ServiceSchema'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Beginner Paragliding Courses",tr:"Başlangıç Paraşüt Kursları",de:"Anfänger-Paragliding-Kurse",ru:"Курсы парапланеризма для начинающих"}
  const d = {en:"Learn to fly from scratch with our certified instructors.",tr:"Sertifikalı eğitmenlerimizle sıfırdan uçmayı öğrenin.",de:"Lernen Sie mit unseren zertifizierten Lehrern von Grund auf zu fliegen.",ru:"Научитесь летать с нуля с нашими сертифицированными инструкторами."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/training/beginner-courses'),
    openGraph: { url: localeUrl(locale, '/training/beginner-courses'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "What Does a Beginner Paragliding Course Cover?", "ps": ["Our beginner courses cover everything from ground handling to your first solo flights. We offer BHPA Elementary Pilot (EP) and Club Pilot (CP) equivalent certification, recognized internationally."]}, {"h2": "What Does the Course Structure Look Like?", "ps": ["Day 1–2: ground handling and kite flying on the training hill. Day 3–4: first tandem flights to experience the air. Day 5–7: first solo flights from the training hill with radio guidance. Day 8–10: consolidation flights and assessment."]}, {"h2": "What's Included and Who Can Join?", "ps": ["All courses include equipment hire, instruction and a certificate on completion, with a maximum of 4 students per instructor for personalized teaching. Courses run April–October, minimum age 16."]}], "faqTitle": "FAQ – Beginner Paragliding Courses", "faqs": [{"q": "How long is a beginner course?", "a": "Around 10 days, structured from ground handling through to consolidated solo flights and assessment."}, {"q": "What certification do I get?", "a": "BHPA Elementary Pilot (EP) or Club Pilot (CP) equivalent certification, recognized internationally."}, {"q": "What's the minimum age?", "a": "16 years, and courses run April through October."}], "relatedTitle": "More Training Options", "related": [{"href": "/training/beginner-courses", "label": "Beginner Courses"}, {"href": "/training/advanced-courses", "label": "Advanced Courses"}, {"href": "/training/siv-clinic", "label": "SIV Clinic"}, {"href": "/training/instructor-info", "label": "Instructor Info"}]}, "tr": {"sections": [{"h2": "Başlangıç Paraşüt Kursu Neleri Kapsar?", "ps": ["Başlangıç kurslarımız yer kullanımından ilk solo uçuşlarınıza kadar her şeyi kapsar. Uluslararası tanınan BHPA Elementary Pilot (EP) ve Club Pilot (CP) eşdeğeri sertifikasyon sunuyoruz."]}, {"h2": "Kurs Yapısı Nasıl İşliyor?", "ps": ["1-2. gün: eğitim tepesinde yer kullanımı ve uçurtma uçuşu. 3-4. gün: havayı deneyimlemek için ilk tandem uçuşlar. 5-7. gün: telsiz rehberliğiyle eğitim tepesinden ilk solo uçuşlar. 8-10. gün: konsolidasyon uçuşları ve değerlendirme."]}, {"h2": "Nelere Dahil ve Kimler Katılabilir?", "ps": ["Tüm kurslara ekipman kiralama, eğitim ve tamamlama sertifikası dahildir; kişiselleştirilmiş öğretim için eğitmen başına maksimum 4 öğrenci. Kurslar Nisan-Ekim arasında, minimum yaş 16."]}], "faqTitle": "SSS – Başlangıç Paraşüt Kursları", "faqs": [{"q": "Başlangıç kursu ne kadar sürer?", "a": "Yaklaşık 10 gün; yer kullanımından konsolide solo uçuşlara ve değerlendirmeye kadar yapılandırılmıştır."}, {"q": "Hangi sertifikayı alırım?", "a": "Uluslararası tanınan BHPA Elementary Pilot (EP) veya Club Pilot (CP) eşdeğeri sertifikasyon."}, {"q": "Minimum yaş nedir?", "a": "16 yaş, kurslar Nisan'dan Ekim'e kadar yapılır."}], "relatedTitle": "Diğer Eğitim Seçenekleri", "related": [{"href": "/training/beginner-courses", "label": "Başlangıç Kursları"}, {"href": "/training/advanced-courses", "label": "İleri Düzey Kurslar"}, {"href": "/training/siv-clinic", "label": "SIV Kliniği"}, {"href": "/training/instructor-info", "label": "Eğitmen Bilgileri"}]}, "de": {"sections": [{"h2": "Was umfasst ein Anfänger-Paragliding-Kurs?", "ps": ["Unsere Anfängerkurse decken alles von Bodenhandling bis zu Ihren ersten Soloflügen ab. Wir bieten international anerkannte BHPA Elementary Pilot (EP)- und Club Pilot (CP)-äquivalente Zertifizierung an."]}, {"h2": "Wie sieht der Kursaufbau aus?", "ps": ["Tag 1–2: Bodenhandling und Kiteflug am Übungshügel. Tag 3–4: erste Tandemflüge, um die Luft zu erleben. Tag 5–7: erste Soloflüge vom Übungshügel mit Funkbegleitung. Tag 8–10: Festigungsflüge und Bewertung."]}, {"h2": "Was ist enthalten und wer kann teilnehmen?", "ps": ["Alle Kurse beinhalten Ausrüstungsverleih, Unterricht und ein Abschlusszertifikat, mit maximal 4 Schülern pro Instruktor für individuellen Unterricht. Kurse laufen von April bis Oktober, Mindestalter 16 Jahre."]}], "faqTitle": "FAQ – Anfänger-Paragliding-Kurse", "faqs": [{"q": "Wie lange dauert ein Anfängerkurs?", "a": "Etwa 10 Tage, aufgebaut vom Bodenhandling bis zu gefestigten Soloflügen und der Bewertung."}, {"q": "Welche Zertifizierung erhalte ich?", "a": "International anerkannte BHPA Elementary Pilot (EP)- oder Club Pilot (CP)-äquivalente Zertifizierung."}, {"q": "Was ist das Mindestalter?", "a": "16 Jahre, Kurse laufen von April bis Oktober."}], "relatedTitle": "Weitere Trainingsoptionen", "related": [{"href": "/training/beginner-courses", "label": "Anfängerkurse"}, {"href": "/training/advanced-courses", "label": "Fortgeschrittenenkurse"}, {"href": "/training/siv-clinic", "label": "SIV-Klinik"}, {"href": "/training/instructor-info", "label": "Instruktorinformationen"}]}, "ru": {"sections": [{"h2": "Что включает курс парапланеризма для начинающих?", "ps": ["Наши курсы для начинающих охватывают всё от наземной отработки до первых соло полётов. Мы предлагаем международно признанную сертификацию, эквивалентную BHPA Elementary Pilot (EP) и Club Pilot (CP)."]}, {"h2": "Как построен курс?", "ps": ["День 1-2: наземная отработка и полёты «китом» на учебном холме. День 3-4: первые тандемные полёты для знакомства с воздухом. День 5-7: первые соло полёты с учебного холма под радиосвязью. День 8-10: закрепляющие полёты и оценка."]}, {"h2": "Что входит и кто может участвовать?", "ps": ["Все курсы включают аренду снаряжения, обучение и сертификат по завершении, максимум 4 студента на инструктора для индивидуального обучения. Курсы проходят с апреля по октябрь, минимальный возраст 16 лет."]}], "faqTitle": "FAQ – курсы для начинающих", "faqs": [{"q": "Сколько длится курс для начинающих?", "a": "Около 10 дней, построен от наземной отработки до закреплённых соло полётов и оценки."}, {"q": "Какую сертификацию я получу?", "a": "Международно признанную сертификацию, эквивалентную BHPA Elementary Pilot (EP) или Club Pilot (CP)."}, {"q": "Какой минимальный возраст?", "a": "16 лет, курсы проходят с апреля по октябрь."}], "relatedTitle": "Другие варианты обучения", "related": [{"href": "/training/beginner-courses", "label": "Курсы для начинающих"}, {"href": "/training/advanced-courses", "label": "Продвинутые курсы"}, {"href": "/training/siv-clinic", "label": "SIV клиника"}, {"href": "/training/instructor-info", "label": "Информация об инструкторах"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'training' })
  const titles = {en:"Beginner Paragliding Courses",tr:"Başlangıç Paraşüt Kursları",de:"Anfänger-Paragliding-Kurse",ru:"Курсы парапланеризма для начинающих"}
  const subs = {en:"Learn to fly from scratch with our certified instructors.",tr:"Sertifikalı eğitmenlerimizle sıfırdan uçmayı öğrenin.",de:"Lernen Sie mit unseren zertifizierten Lehrern von Grund auf zu fliegen.",ru:"Научитесь летать с нуля с нашими сертифицированными инструкторами."}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <ServiceSchema name="Beginner Paragliding Course Oludeniz" description="Beginner paragliding courses in Oludeniz — learn to fly from Babadağ Mountain." path="/training/beginner-courses" serviceType="Paragliding Training Course" />
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c0c/Dn0br3flHariTrqYqhISR.jpg" />
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3"><BreadcrumbNav items={[{ label: title }]} /></div>
      </div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          {c.sections.map((s: any) => (
            <div key={s.h2} className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">{s.h2}</h2>
              {s.ps.map((p: string, i: number) => <p key={i} className="text-slate-600 leading-relaxed mb-4">{p}</p>)}
              {s.bullets && <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-4">{s.bullets.map((b: string, i: number) => <li key={i}>{b}</li>)}</ul>}
            </div>
          ))}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">{c.faqTitle}</h2>
            {c.faqs.map((f: any) => (
              <div key={f.q} className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{f.q}</h3>
                <p className="text-slate-600 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-3">{c.relatedTitle}</h2>
            <ul className="space-y-2">
              {c.related.map((r: any) => (
                <li key={r.href}><Link href={lp(r.href)} className="text-orange-600 hover:underline">{r.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <BookingCTA />
    </>
  )
}
