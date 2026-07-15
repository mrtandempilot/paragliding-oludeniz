import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Pilot Certifications",tr:"Pilot Sertifikaları",de:"Pilotenzertifizierungen",ru:"Сертификаты пилотов"}
  const d = {en:"Our pilots hold the highest international paragliding certifications.",tr:"Pilotlarımız en yüksek uluslararası paraşüt sertifikalarına sahiptir.",de:"Unsere Piloten halten die höchsten internationalen Paragliding-Zertifizierungen.",ru:"Наши пилоты имеют высшие международные сертификаты парапланеризма."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/certifications'),
    openGraph: { url: localeUrl(locale, '/certifications'), description: (d as any)[locale] || d.en, images: ['https://www.atmosparagliding.com/certifications/opengraph-image'] },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "What Certification Do Our Pilots Hold?", "ps": ["All our pilots are certified by SHGM (Sivil Havacılık Genel Müdürlüğü), the Turkish Civil Aviation Authority — a legal requirement to operate commercial tandem flights in Turkey. In addition, our senior pilots hold ratings from BHPA (British Hang Gliding and Paragliding Association) or the German DHV, the two most respected international paragliding bodies."]}, {"h2": "What Does It Take to Earn These Ratings?", "ps": ["BHPA and DHV ratings require written examinations, practical flight assessments, and ongoing continuing education — they aren't a one-time qualification. All pilots also hold current First Aid certification and complete biannual refresher courses, with emergency procedures practised regularly at the launch and landing zones."]}, {"h2": "How Much Experience Do Our Pilots Have?", "ps": ["Our tandem pilots have a combined total of over 200,000 tandem flights. The most experienced members of our team have been flying from Babadağ since the late 1990s."]}], "faqTitle": "FAQ – Pilot Certifications", "faqs": [{"q": "Is SHGM certification legally required?", "a": "Yes — it's the Turkish Civil Aviation Authority licence required to operate commercial tandem paragliding flights in Turkey."}, {"q": "What is BHPA or DHV certification?", "a": "International paragliding qualifications from the UK and Germany respectively — widely regarded as the two most respected bodies globally, requiring exams, flight assessments and continuing education."}, {"q": "How experienced are your pilots?", "a": "Our team has a combined total of over 200,000 tandem flights, with our most experienced pilots flying from Babadağ since the late 1990s."}], "relatedTitle": "More on Safety", "related": [{"href": "/safety-record", "label": "Safety Record"}, {"href": "/tandem-paragliding/safety-guide", "label": "Tandem Safety Guide"}, {"href": "/about-us", "label": "About Us"}, {"href": "/book-now", "label": "Book Your Flight"}]}, "tr": {"sections": [{"h2": "Pilotlarımız Hangi Sertifikaya Sahip?", "ps": ["Tüm pilotlarımız Türkiye Sivil Havacılık Genel Müdürlüğü (SHGM) tarafından sertifikalandırılmıştır — Türkiye'de ticari tandem uçuş işletmek için yasal bir gerekliliktir. Ayrıca kıdemli pilotlarımız, dünyanın en saygın iki uluslararası paraşüt kuruluşu olan BHPA (İngiliz) veya DHV (Alman) derecelerine sahiptir."]}, {"h2": "Bu Dereceleri Almak Ne Gerektirir?", "ps": ["BHPA ve DHV dereceleri yazılı sınavlar, pratik uçuş değerlendirmeleri ve sürekli eğitim gerektirir — tek seferlik bir yeterlilik değildir. Tüm pilotlar ayrıca geçerli İlk Yardım sertifikasına sahiptir ve yılda iki kez tazeleme kursu tamamlar; acil durum prosedürleri kalkış ve iniş alanlarında düzenli olarak uygulanır."]}, {"h2": "Pilotlarımızın Ne Kadar Tecrübesi Var?", "ps": ["Tandem pilotlarımızın toplamda 200.000'den fazla tandem uçuşu bulunmaktadır. Ekibimizin en deneyimli üyeleri 1990'ların sonundan bu yana Babadağ'dan uçmaktadır."]}], "faqTitle": "SSS – Pilot Sertifikaları", "faqs": [{"q": "SHGM sertifikası yasal olarak zorunlu mu?", "a": "Evet — Türkiye'de ticari tandem yamaç paraşütü uçuşu işletmek için gereken Sivil Havacılık Genel Müdürlüğü lisansıdır."}, {"q": "BHPA veya DHV sertifikası nedir?", "a": "Sırasıyla İngiltere ve Almanya'dan uluslararası paraşüt yeterlilikleridir — dünya genelinde en saygın iki kuruluş olarak kabul edilir, sınav, uçuş değerlendirmesi ve sürekli eğitim gerektirir."}, {"q": "Pilotlarınız ne kadar tecrübeli?", "a": "Ekibimizin toplamda 200.000'den fazla tandem uçuşu bulunmaktadır; en deneyimli pilotlarımız 1990'ların sonundan bu yana Babadağ'dan uçmaktadır."}], "relatedTitle": "Güvenlik Hakkında Daha Fazlası", "related": [{"href": "/safety-record", "label": "Güvenlik Rekoru"}, {"href": "/tandem-paragliding/safety-guide", "label": "Tandem Güvenlik Rehberi"}, {"href": "/about-us", "label": "Hakkımızda"}, {"href": "/book-now", "label": "Uçuşunuzu Ayırtın"}]}, "de": {"sections": [{"h2": "Welche Zertifizierungen haben unsere Piloten?", "ps": ["Alle unsere Piloten sind von der SHGM (türkische Zivilluftfahrtbehörde) zertifiziert — eine gesetzliche Voraussetzung für den Betrieb kommerzieller Tandemflüge in der Türkei. Zusätzlich verfügen unsere erfahrenen Piloten über Ratings der BHPA (British Hang Gliding and Paragliding Association) oder des deutschen DHV, den zwei angesehensten internationalen Paragliding-Verbänden."]}, {"h2": "Was braucht es für diese Ratings?", "ps": ["BHPA- und DHV-Ratings erfordern schriftliche Prüfungen, praktische Flugbewertungen und laufende Weiterbildung — sie sind keine einmalige Qualifikation. Alle Piloten verfügen zudem über aktuelle Erste-Hilfe-Zertifizierung und absolvieren halbjährliche Auffrischungskurse, wobei Notfallverfahren regelmäßig am Start- und Landeplatz geübt werden."]}, {"h2": "Wie viel Erfahrung haben unsere Piloten?", "ps": ["Unsere Tandempiloten haben zusammen über 200.000 Tandemflüge absolviert. Die erfahrensten Mitglieder unseres Teams fliegen seit den späten 1990er-Jahren vom Babadağ."]}], "faqTitle": "FAQ – Pilotenzertifizierungen", "faqs": [{"q": "Ist die SHGM-Zertifizierung gesetzlich vorgeschrieben?", "a": "Ja — sie ist die Lizenz der türkischen Zivilluftfahrtbehörde, die für den Betrieb kommerzieller Tandem-Paragliding-Flüge in der Türkei erforderlich ist."}, {"q": "Was ist eine BHPA- oder DHV-Zertifizierung?", "a": "Internationale Paragliding-Qualifikationen aus Großbritannien bzw. Deutschland — weithin als die zwei angesehensten Verbände weltweit anerkannt, mit Prüfungen, Flugbewertungen und laufender Weiterbildung."}, {"q": "Wie erfahren sind Ihre Piloten?", "a": "Unser Team hat zusammen über 200.000 Tandemflüge absolviert, mit unseren erfahrensten Piloten, die seit den späten 1990er-Jahren vom Babadağ fliegen."}], "relatedTitle": "Mehr zur Sicherheit", "related": [{"href": "/safety-record", "label": "Sicherheitsbilanz"}, {"href": "/tandem-paragliding/safety-guide", "label": "Tandem-Sicherheitsleitfaden"}, {"href": "/about-us", "label": "Über uns"}, {"href": "/book-now", "label": "Flug buchen"}]}, "ru": {"sections": [{"h2": "Какую сертификацию имеют наши пилоты?", "ps": ["Все наши пилоты сертифицированы SHGM (Главным управлением гражданской авиации Турции) — это законодательное требование для проведения коммерческих тандемных полётов в Турции. Кроме того, наши старшие пилоты имеют рейтинги BHPA (Британская ассоциация дельтапланеризма и парапланеризма) или немецкого DHV — двух самых уважаемых международных организаций парапланеризма."]}, {"h2": "Что нужно для получения этих рейтингов?", "ps": ["Рейтинги BHPA и DHV требуют письменных экзаменов, практической оценки полётов и постоянного повышения квалификации — это не разовая квалификация. Все пилоты также имеют действующий сертификат первой помощи и проходят курсы повышения квалификации дважды в год, регулярно отрабатывая аварийные процедуры на местах старта и посадки."]}, {"h2": "Какой опыт у наших пилотов?", "ps": ["Наши тандемные пилоты в совокупности выполнили более 200 000 тандемных полётов. Самые опытные члены нашей команды летают с Бабадага с конца 1990-х годов."]}], "faqTitle": "FAQ – сертификация пилотов", "faqs": [{"q": "Обязательна ли сертификация SHGM по закону?", "a": "Да — это лицензия Главного управления гражданской авиации Турции, необходимая для проведения коммерческих тандемных полётов на параплане в Турции."}, {"q": "Что такое сертификация BHPA или DHV?", "a": "Международные квалификации по парапланеризму из Великобритании и Германии соответственно — широко признанные две самые авторитетные организации в мире, требующие экзаменов, оценки полётов и постоянного повышения квалификации."}, {"q": "Насколько опытны ваши пилоты?", "a": "Наша команда в совокупности выполнила более 200 000 тандемных полётов, а самые опытные пилоты летают с Бабадага с конца 1990-х годов."}], "relatedTitle": "Больше о безопасности", "related": [{"href": "/safety-record", "label": "Рекорд безопасности"}, {"href": "/tandem-paragliding/safety-guide", "label": "Гид по безопасности тандема"}, {"href": "/about-us", "label": "О нас"}, {"href": "/book-now", "label": "Забронировать полёт"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'certifications' })
  const titles = {en:"Pilot Certifications",tr:"Pilot Sertifikaları",de:"Pilotenzertifizierungen",ru:"Сертификаты пилотов"}
  const subs = {en:"Our pilots hold the highest international paragliding certifications.",tr:"Pilotlarımız en yüksek uluslararası paraşüt sertifikalarına sahiptir.",de:"Unsere Piloten halten die höchsten internationalen Paragliding-Zertifizierungen.",ru:"Наши пилоты имеют высшие международные сертификаты парапланеризма."}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"Article\", \"headline\": \"Paragliding Certifications and Qualifications\", \"description\": \"Certifications and qualifications required for paragliding in Turkey and internationally.\", \"url\": \"https://www.atmosparagliding.com/certifications\", \"author\": {\"@type\": \"Person\", \"name\": \"Ceyhun\", \"url\": \"https://www.atmosparagliding.com/en/about-us\"}, \"publisher\": {\"@type\": \"Organization\", \"name\": \"Atmos Paragliding\", \"url\": \"https://www.atmosparagliding.com\"}}" }} />
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c0e/5dF2dxA0ErV0Pcg9kh6CJ.jpg" />
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
