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
  const t = {en:"SIV Clinic Oludeniz",tr:"Oludeniz SIV Kliniği",de:"SIV-Klinik Oludeniz",ru:"SIV клиника Олюдениз"}
  const d = {en:"Safety and Incident Vivid training over the water at Oludeniz.",tr:"Oludeniz'de su üzerinde Güvenlik ve Olay Canlı eğitimi.",de:"SIV-Training über dem Wasser in Oludeniz.",ru:"SIV обучение над водой в Олюдениз."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/training/siv-clinic'),
    openGraph: { url: localeUrl(locale, '/training/siv-clinic'), description: (d as any)[locale] || d.en, images: ['https://www.atmosparagliding.com/training/opengraph-image'] },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "What Is an SIV Clinic?", "ps": ["SIV (Simulation d'Incident en Vol) clinics teach pilots how to actively manage their paraglider in extreme situations — collapses, spirals, stalls and emergency procedures. Training is conducted over water with boat rescue support."]}, {"h2": "Why Is Ölüdeniz a Great SIV Venue?", "ps": ["Ölüdeniz is one of the best SIV venues in the world. The protected bay provides safe water training, the thermals are consistent for practising active flying, and the altitude available from Babadağ allows extended exercises."]}, {"h2": "What Are the Requirements and Format?", "ps": ["Our SIV courses run in partnership with certified SIV instructors. Participants must hold a minimum P3/CP rating and appropriate third-party insurance. Course duration is 5 days, maximum 6 participants, with all training flights recorded by drone for debrief analysis."]}], "faqTitle": "FAQ – SIV Clinic", "faqs": [{"q": "What licence level do I need for SIV?", "a": "A minimum P3/CP rating, plus appropriate third-party insurance."}, {"q": "How long does the SIV course run?", "a": "5 days, with a maximum of 6 participants per clinic."}, {"q": "Is training footage available afterward?", "a": "Yes, all training flights are recorded by drone for debrief analysis."}], "relatedTitle": "More Training Options", "related": [{"href": "/training/beginner-courses", "label": "Beginner Courses"}, {"href": "/training/advanced-courses", "label": "Advanced Courses"}, {"href": "/training/siv-clinic", "label": "SIV Clinic"}, {"href": "/training/instructor-info", "label": "Instructor Info"}]}, "tr": {"sections": [{"h2": "SIV Kliniği Nedir?", "ps": ["SIV (Simulation d'Incident en Vol) klinikleri pilotlara ekstrem durumlarda — kapanmalar, spiraller, stall'lar ve acil durum prosedürleri — paraşütlerini aktif olarak nasıl yöneteceklerini öğretir. Eğitim, tekne kurtarma desteğiyle su üzerinde gerçekleştirilir."]}, {"h2": "Ölüdeniz Neden Harika Bir SIV Mekanı?", "ps": ["Ölüdeniz, dünyanın en iyi SIV mekanlarından biridir. Korunaklı körfez güvenli su eğitimi sağlar, termikler aktif uçuş pratiği için tutarlıdır ve Babadağ'dan elde edilen irtifa uzatılmış egzersizlere olanak tanır."]}, {"h2": "Gereksinimler ve Format Nedir?", "ps": ["SIV kurslarımız sertifikalı SIV eğitmenleriyle ortaklaşa yürütülür. Katılımcılar minimum P3/CP derecesine ve uygun üçüncü şahıs sigortasına sahip olmalıdır. Kurs süresi 5 gün, maksimum 6 katılımcı; tüm eğitim uçuşları değerlendirme analizi için drone ile kaydedilir."]}], "faqTitle": "SSS – SIV Kliniği", "faqs": [{"q": "SIV için hangi lisans seviyesi gerekli?", "a": "Minimum P3/CP derecesi, artı uygun üçüncü şahıs sigortası."}, {"q": "SIV kursu ne kadar sürüyor?", "a": "5 gün, klinik başına maksimum 6 katılımcı."}, {"q": "Eğitim görüntüleri sonrasında mevcut mu?", "a": "Evet, tüm eğitim uçuşları değerlendirme analizi için drone ile kaydedilir."}], "relatedTitle": "Diğer Eğitim Seçenekleri", "related": [{"href": "/training/beginner-courses", "label": "Başlangıç Kursları"}, {"href": "/training/advanced-courses", "label": "İleri Düzey Kurslar"}, {"href": "/training/siv-clinic", "label": "SIV Kliniği"}, {"href": "/training/instructor-info", "label": "Eğitmen Bilgileri"}]}, "de": {"sections": [{"h2": "Was ist eine SIV-Klinik?", "ps": ["SIV-Kliniken (Simulation d'Incident en Vol) lehren Piloten, ihren Gleitschirm in extremen Situationen aktiv zu managen — Klapper, Spiralen, Strömungsabriss und Notfallverfahren. Das Training findet über Wasser mit Bootsrettungsunterstützung statt."]}, {"h2": "Warum ist Ölüdeniz ein großartiger SIV-Standort?", "ps": ["Ölüdeniz ist einer der besten SIV-Standorte der Welt. Die geschützte Bucht bietet sicheres Wassertraining, die Thermik ist verlässlich zum Üben von aktivem Fliegen, und die vom Babadağ verfügbare Höhe ermöglicht ausgedehnte Übungen."]}, {"h2": "Welche Anforderungen und welches Format gelten?", "ps": ["Unsere SIV-Kurse werden in Partnerschaft mit zertifizierten SIV-Instruktoren durchgeführt. Teilnehmer benötigen mindestens ein P3/CP-Rating und angemessene Haftpflichtversicherung. Kursdauer 5 Tage, maximal 6 Teilnehmer, alle Trainingsflüge werden per Drohne für die Nachbesprechung aufgezeichnet."]}], "faqTitle": "FAQ – SIV-Klinik", "faqs": [{"q": "Welches Lizenzniveau brauche ich für SIV?", "a": "Mindestens ein P3/CP-Rating sowie angemessene Haftpflichtversicherung."}, {"q": "Wie lange dauert der SIV-Kurs?", "a": "5 Tage, mit maximal 6 Teilnehmern pro Klinik."}, {"q": "Ist Trainingsmaterial im Nachhinein verfügbar?", "a": "Ja, alle Trainingsflüge werden per Drohne für die Nachbesprechung aufgezeichnet."}], "relatedTitle": "Weitere Trainingsoptionen", "related": [{"href": "/training/beginner-courses", "label": "Anfängerkurse"}, {"href": "/training/advanced-courses", "label": "Fortgeschrittenenkurse"}, {"href": "/training/siv-clinic", "label": "SIV-Klinik"}, {"href": "/training/instructor-info", "label": "Instruktorinformationen"}]}, "ru": {"sections": [{"h2": "Что такое SIV клиника?", "ps": ["SIV-клиники (Simulation d'Incident en Vol) учат пилотов активно управлять парапланом в экстремальных ситуациях — складывания, спирали, срывы потока и аварийные процедуры. Тренировки проводятся над водой с поддержкой лодки."]}, {"h2": "Почему Олюдениз — отличное место для SIV?", "ps": ["Олюдениз — одно из лучших мест в мире для SIV. Защищённый залив обеспечивает безопасные тренировки над водой, термики стабильны для отработки активного пилотирования, а высота с Бабадага позволяет проводить продлённые упражнения."]}, {"h2": "Какие требования и формат?", "ps": ["Наши курсы SIV проводятся в партнёрстве с сертифицированными инструкторами SIV. Участники должны иметь минимум рейтинг P3/CP и соответствующую страховку гражданской ответственности. Длительность курса 5 дней, максимум 6 участников, все тренировочные полёты записываются на дрон для разбора."]}], "faqTitle": "FAQ – SIV клиника", "faqs": [{"q": "Какой уровень лицензии нужен для SIV?", "a": "Минимум рейтинг P3/CP плюс соответствующая страховка гражданской ответственности."}, {"q": "Сколько длится курс SIV?", "a": "5 дней, максимум 6 участников на клинику."}, {"q": "Доступны ли записи тренировок после?", "a": "Да, все тренировочные полёты записываются на дрон для разбора."}], "relatedTitle": "Другие варианты обучения", "related": [{"href": "/training/beginner-courses", "label": "Курсы для начинающих"}, {"href": "/training/advanced-courses", "label": "Продвинутые курсы"}, {"href": "/training/siv-clinic", "label": "SIV клиника"}, {"href": "/training/instructor-info", "label": "Информация об инструкторах"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'training' })
  const titles = {en:"SIV Clinic Oludeniz",tr:"Oludeniz SIV Kliniği",de:"SIV-Klinik Oludeniz",ru:"SIV клиника Олюдениз"}
  const subs = {en:"Safety and Incident Vivid training over the water at Oludeniz.",tr:"Oludeniz'de su üzerinde Güvenlik ve Olay Canlı eğitimi.",de:"SIV-Training über dem Wasser in Oludeniz.",ru:"SIV обучение над водой в Олюдениз."}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <ServiceSchema name="SIV Clinic Paragliding Oludeniz" description="SIV paragliding safety clinic in Oludeniz — essential training for all pilots." path="/training/siv-clinic" serviceType="Paragliding Training Course" />
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
