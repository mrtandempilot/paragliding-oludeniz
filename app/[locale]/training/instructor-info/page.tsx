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
  const t = {en:"Instructor Information",tr:"Eğitmen Bilgileri",de:"Instruktorinformationen",ru:"Информация об инструкторах"}
  const d = {en:"Our instructors are among the most experienced paragliding coaches in the region.",tr:"Eğitmenlerimiz bölgedeki en deneyimli paraşüt antrenörleri arasındadır.",de:"Unsere Instruktoren gehören zu den erfahrensten Paragliding-Coaches der Region.",ru:"Наши инструкторы — одни из самых опытных тренеров по парапланеризму в регионе."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/training/instructor-info'),
    openGraph: { url: localeUrl(locale, '/training/instructor-info'), description: (d as any)[locale] || d.en, images: ['https://www.atmosparagliding.com/training/opengraph-image'] },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "What Qualifications Do Our Instructors Hold?", "ps": ["All our instructors hold current SHGM instructor ratings plus international certifications from BHPA or DHV. The instructors who run our courses have been teaching at Babadağ for an average of 12 years."]}, {"h2": "How Do We Keep Class Sizes Small?", "ps": ["We keep student-instructor ratios low: maximum 4:1 for beginner courses, 3:1 for advanced coaching, and 6:1 for SIV clinics — ensuring maximum flight time and one-on-one coaching."]}, {"h2": "How Experienced Is Our Head Instructor?", "ps": ["Our head instructor has competed at national and international level and holds an advanced coaching qualification. All instructors complete annual instructor refresher training."]}], "faqTitle": "FAQ – Our Instructors", "faqs": [{"q": "What certifications do instructors need?", "a": "Current SHGM instructor ratings plus international BHPA or DHV certification."}, {"q": "How many students per instructor?", "a": "4:1 maximum for beginners, 3:1 for advanced coaching, 6:1 for SIV clinics."}, {"q": "How experienced are your instructors?", "a": "An average of 12 years teaching at Babadağ, with our head instructor holding national and international competition experience."}], "relatedTitle": "More Training Options", "related": [{"href": "/training/beginner-courses", "label": "Beginner Courses"}, {"href": "/training/advanced-courses", "label": "Advanced Courses"}, {"href": "/training/siv-clinic", "label": "SIV Clinic"}, {"href": "/training/instructor-info", "label": "Instructor Info"}]}, "tr": {"sections": [{"h2": "Eğitmenlerimiz Hangi Yeterliliklere Sahip?", "ps": ["Tüm eğitmenlerimiz güncel SHGM eğitmen derecelerine ve uluslararası BHPA veya DHV sertifikalarına sahiptir. Kurslarımızı yürüten eğitmenler Babadağ'da ortalama 12 yıldır eğitim vermektedir."]}, {"h2": "Sınıf Büyüklüklerini Nasıl Küçük Tutuyoruz?", "ps": ["Öğrenci-eğitmen oranlarını düşük tutuyoruz: başlangıç kursları için maksimum 4:1, ileri düzey koçluk için 3:1 ve SIV klinikleri için 6:1 — maksimum uçuş süresi ve bire bir koçluk sağlar."]}, {"h2": "Baş Eğitmenimiz Ne Kadar Deneyimli?", "ps": ["Baş eğitmenimiz ulusal ve uluslararası düzeyde yarışmıştır ve ileri düzey koçluk yeterliliğine sahiptir. Tüm eğitmenler yıllık eğitmen tazeleme eğitimini tamamlar."]}], "faqTitle": "SSS – Eğitmenlerimiz", "faqs": [{"q": "Eğitmenler hangi sertifikalara ihtiyaç duyar?", "a": "Güncel SHGM eğitmen dereceleri artı uluslararası BHPA veya DHV sertifikası."}, {"q": "Eğitmen başına kaç öğrenci düşüyor?", "a": "Başlangıç için maksimum 4:1, ileri düzey koçluk için 3:1, SIV klinikleri için 6:1."}, {"q": "Eğitmenleriniz ne kadar deneyimli?", "a": "Babadağ'da ortalama 12 yıllık eğitim tecrübesi; baş eğitmenimiz ulusal ve uluslararası yarışma tecrübesine sahiptir."}], "relatedTitle": "Diğer Eğitim Seçenekleri", "related": [{"href": "/training/beginner-courses", "label": "Başlangıç Kursları"}, {"href": "/training/advanced-courses", "label": "İleri Düzey Kurslar"}, {"href": "/training/siv-clinic", "label": "SIV Kliniği"}, {"href": "/training/instructor-info", "label": "Eğitmen Bilgileri"}]}, "de": {"sections": [{"h2": "Welche Qualifikationen haben unsere Instruktoren?", "ps": ["Alle unsere Instruktoren verfügen über aktuelle SHGM-Instruktoren-Ratings sowie internationale Zertifizierungen von BHPA oder DHV. Die Instruktoren unserer Kurse unterrichten seit durchschnittlich 12 Jahren am Babadağ."]}, {"h2": "Wie halten wir die Klassengrößen klein?", "ps": ["Wir halten das Schüler-Instruktoren-Verhältnis niedrig: maximal 4:1 für Anfängerkurse, 3:1 für Fortgeschrittenen-Coaching und 6:1 für SIV-Kliniken — für maximale Flugzeit und Einzelcoaching."]}, {"h2": "Wie erfahren ist unser Chefinstruktor?", "ps": ["Unser Chefinstruktor hat auf nationaler und internationaler Ebene an Wettkämpfen teilgenommen und verfügt über eine fortgeschrittene Coaching-Qualifikation. Alle Instruktoren absolvieren jährliches Auffrischungstraining."]}], "faqTitle": "FAQ – Unsere Instruktoren", "faqs": [{"q": "Welche Zertifizierungen brauchen Instruktoren?", "a": "Aktuelle SHGM-Instruktoren-Ratings sowie internationale BHPA- oder DHV-Zertifizierung."}, {"q": "Wie viele Schüler pro Instruktor?", "a": "Maximal 4:1 für Anfänger, 3:1 für Fortgeschrittenen-Coaching, 6:1 für SIV-Kliniken."}, {"q": "Wie erfahren sind Ihre Instruktoren?", "a": "Durchschnittlich 12 Jahre Unterrichtserfahrung am Babadağ, mit einem Chefinstruktor mit nationaler und internationaler Wettkampferfahrung."}], "relatedTitle": "Weitere Trainingsoptionen", "related": [{"href": "/training/beginner-courses", "label": "Anfängerkurse"}, {"href": "/training/advanced-courses", "label": "Fortgeschrittenenkurse"}, {"href": "/training/siv-clinic", "label": "SIV-Klinik"}, {"href": "/training/instructor-info", "label": "Instruktorinformationen"}]}, "ru": {"sections": [{"h2": "Какую квалификацию имеют наши инструкторы?", "ps": ["Все наши инструкторы имеют действующие рейтинги инструкторов SHGM, а также международные сертификаты BHPA или DHV. Инструкторы, ведущие наши курсы, преподают на Бабадаге в среднем 12 лет."]}, {"h2": "Как мы поддерживаем небольшой размер групп?", "ps": ["Мы поддерживаем низкое соотношение студент-инструктор: максимум 4:1 для курсов начинающих, 3:1 для продвинутого коучинга и 6:1 для SIV клиник — обеспечивая максимальное время в воздухе и индивидуальный подход."]}, {"h2": "Насколько опытен наш главный инструктор?", "ps": ["Наш главный инструктор соревновался на национальном и международном уровне и имеет продвинутую квалификацию коуча. Все инструкторы проходят ежегодное повышение квалификации."]}], "faqTitle": "FAQ – наши инструкторы", "faqs": [{"q": "Какие сертификаты нужны инструкторам?", "a": "Действующие рейтинги инструкторов SHGM плюс международная сертификация BHPA или DHV."}, {"q": "Сколько студентов на инструктора?", "a": "Максимум 4:1 для начинающих, 3:1 для продвинутого коучинга, 6:1 для SIV клиник."}, {"q": "Насколько опытны ваши инструкторы?", "a": "В среднем 12 лет преподавания на Бабадаге, а главный инструктор имеет национальный и международный соревновательный опыт."}], "relatedTitle": "Другие варианты обучения", "related": [{"href": "/training/beginner-courses", "label": "Курсы для начинающих"}, {"href": "/training/advanced-courses", "label": "Продвинутые курсы"}, {"href": "/training/siv-clinic", "label": "SIV клиника"}, {"href": "/training/instructor-info", "label": "Информация об инструкторах"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'training' })
  const titles = {en:"Instructor Information",tr:"Eğitmen Bilgileri",de:"Instruktorinformationen",ru:"Информация об инструкторах"}
  const subs = {en:"Our instructors are among the most experienced paragliding coaches in the region.",tr:"Eğitmenlerimiz bölgedeki en deneyimli paraşüt antrenörleri arasındadır.",de:"Unsere Instruktoren gehören zu den erfahrensten Paragliding-Coaches der Region.",ru:"Наши инструкторы — одни из самых опытных тренеров по парапланеризму в регионе."}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <ServiceSchema name="Paragliding Instructor Information Oludeniz" description="Information about becoming a paragliding instructor in Oludeniz, Turkey." path="/training/instructor-info" serviceType="Paragliding Training Course" />
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
