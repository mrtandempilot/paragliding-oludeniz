import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Paramotor Training Oludeniz",tr:"Oludeniz Paramotor Eğitimi",de:"Paramotor Training Oludeniz",ru:"Paramotor Training Oludeniz"}
  const d = {en:"Powered paragliding information for Oludeniz.",tr:"Oludeniz için motorlu paraşüt bilgileri.",de:"Motorisiertes Paragliding-Informationen für Oludeniz.",ru:"Информация о моторизованном парапланеризме для Олюдениз."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/paramotor/training'),
    openGraph: { url: localeUrl(locale, '/paramotor/training'), description: (d as any)[locale] || d.en, images: ['https://www.atmosparagliding.com/paramotor/opengraph-image'] },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "What Paramotor Training Courses Are Available at Ölüdeniz?", "ps": ["We offer both introductory and full paramotor training courses, taking students from first flight through to independent flying. Courses run alongside our tandem and solo paragliding operations, using the same flat launch areas south of Fethiye."]}, {"h2": "What Certification Do You Get?", "ps": ["Full courses lead to SHGM paramotor certification, the licence required to fly solo in Turkey. Contact us for current course dates and pricing — schedules depend on group size and weather."]}], "faqTitle": "FAQ – Paramotor Training", "faqs": [{"q": "Do I need prior paragliding experience to start paramotor training?", "a": "Not necessarily — introductory courses are designed for newcomers, though any free-flying experience helps. Contact us to discuss the right starting point for you."}, {"q": "How long does a full course take?", "a": "This varies by student progress and weather — contact us for current course structure and typical timelines."}], "relatedTitle": "More on Paramotoring", "related": [{"href": "/paramotor", "label": "Paramotor Overview"}, {"href": "/paramotor/equipment", "label": "Equipment Guide"}, {"href": "/contact", "label": "Contact Us"}]}, "tr": {"sections": [{"h2": "Ölüdeniz'de Hangi Paramotor Eğitim Kursları Mevcut?", "ps": ["Öğrencileri ilk uçuştan bağımsız uçuşa kadar götüren hem giriş hem de tam paramotor eğitim kursları sunuyoruz. Kurslar, Fethiye'nin güneyindeki aynı düz kalkış alanlarını kullanarak tandem ve solo yamaç paraşütü operasyonlarımızla birlikte yürütülür."]}, {"h2": "Hangi Sertifikayı Alırsınız?", "ps": ["Tam kurslar, Türkiye'de solo uçmak için gereken lisans olan SHGM paramotor sertifikasyonuna götürür. Güncel kurs tarihleri ve fiyatlandırma için bize ulaşın — program grup büyüklüğüne ve havaya bağlıdır."]}], "faqTitle": "SSS – Paramotor Eğitimi", "faqs": [{"q": "Paramotor eğitimine başlamak için önceden yamaç paraşütü tecrübesi gerekli mi?", "a": "Şart değil — giriş kursları yeni başlayanlar için tasarlanmıştır, ancak herhangi bir serbest uçuş tecrübesi yardımcı olur. Sizin için doğru başlangıç noktasını görüşmek üzere bize ulaşın."}, {"q": "Tam kurs ne kadar sürer?", "a": "Bu, öğrencinin ilerlemesine ve havaya göre değişir — güncel kurs yapısı ve tipik süreler için bize ulaşın."}], "relatedTitle": "Paramotor Hakkında Daha Fazlası", "related": [{"href": "/paramotor", "label": "Paramotor Genel Bakış"}, {"href": "/paramotor/equipment", "label": "Ekipman Rehberi"}, {"href": "/contact", "label": "Bize Ulaşın"}]}, "de": {"sections": [{"h2": "Welche Paramotor-Trainingskurse gibt es in Ölüdeniz?", "ps": ["Wir bieten sowohl Einführungs- als auch Vollkurse im Paramotoring an, die Schüler vom ersten Flug bis zum selbstständigen Fliegen begleiten. Die Kurse laufen parallel zu unserem Tandem- und Solo-Paragliding-Betrieb und nutzen dieselben flachen Startflächen südlich von Fethiye."]}, {"h2": "Welche Zertifizierung erhält man?", "ps": ["Vollkurse führen zur SHGM-Paramotor-Zertifizierung, der in der Türkei für Soloflüge erforderlichen Lizenz. Kontaktieren Sie uns für aktuelle Kurstermine und Preise — der Zeitplan hängt von Gruppengröße und Wetter ab."]}], "faqTitle": "FAQ – Paramotor-Training", "faqs": [{"q": "Brauche ich Vorerfahrung im Paragliding, um mit dem Paramotor-Training zu beginnen?", "a": "Nicht unbedingt — Einführungskurse sind für Neulinge konzipiert, wobei jede Freiflug-Erfahrung hilft. Kontaktieren Sie uns, um den richtigen Einstiegspunkt für Sie zu besprechen."}, {"q": "Wie lange dauert ein Vollkurs?", "a": "Das variiert je nach Fortschritt des Schülers und Wetter — kontaktieren Sie uns für aktuelle Kursstruktur und typische Zeitrahmen."}], "relatedTitle": "Mehr zum Paramotoring", "related": [{"href": "/paramotor", "label": "Paramotor Übersicht"}, {"href": "/paramotor/equipment", "label": "Ausrüstungsleitfaden"}, {"href": "/contact", "label": "Kontakt"}]}, "ru": {"sections": [{"h2": "Какие курсы обучения паратрайку доступны в Олюденизе?", "ps": ["Мы предлагаем как вводные, так и полные курсы обучения паратрайку, ведущие студентов от первого полёта до самостоятельных полётов. Курсы проходят параллельно с нашими тандемными и соло-полётами на параплане, используя те же плоские стартовые площадки к югу от Фетхие."]}, {"h2": "Какую сертификацию вы получаете?", "ps": ["Полные курсы ведут к сертификации SHGM по паратрайку — лицензии, необходимой для самостоятельных полётов в Турции. Свяжитесь с нами для уточнения актуальных дат курсов и цен — расписание зависит от размера группы и погоды."]}], "faqTitle": "FAQ – обучение паратрайку", "faqs": [{"q": "Нужен ли предварительный опыт парапланеризма для начала обучения паратрайку?", "a": "Не обязательно — вводные курсы рассчитаны на новичков, хотя любой опыт свободного полёта помогает. Свяжитесь с нами, чтобы обсудить подходящую отправную точку для вас."}, {"q": "Сколько длится полный курс?", "a": "Это зависит от прогресса студента и погоды — свяжитесь с нами для уточнения актуальной структуры курса и типичных сроков."}], "relatedTitle": "Больше о паратрайке", "related": [{"href": "/paramotor", "label": "Обзор паратрайка"}, {"href": "/paramotor/equipment", "label": "Гид по снаряжению"}, {"href": "/contact", "label": "Связаться с нами"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'paramotor' })
  const titles = {en:"Paramotor Training Oludeniz",tr:"Oludeniz Paramotor Eğitimi",de:"Paramotor Training Oludeniz",ru:"Paramotor Training Oludeniz"}
  const subs = {en:"Powered paragliding information for Oludeniz.",tr:"Oludeniz için motorlu paraşüt bilgileri.",de:"Motorisiertes Paragliding-Informationen für Oludeniz.",ru:"Информация о моторизованном парапланеризме для Олюдениз."}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"Article\", \"headline\": \"Paramotor Training Oludeniz\", \"description\": \"Paramotor training courses available in the Oludeniz and Fethiye area.\", \"url\": \"https://www.atmosparagliding.com/paramotor/training\", \"author\": {\"@type\": \"Person\", \"name\": \"Ceyhun\", \"url\": \"https://www.atmosparagliding.com/en/about-us\"}, \"publisher\": {\"@type\": \"Organization\", \"name\": \"Atmos Paragliding\", \"url\": \"https://www.atmosparagliding.com\"}}" }} />
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c0d/dOEuj7ebfM-MdyvUcunPD.jpg" />
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
