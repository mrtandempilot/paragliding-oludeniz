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
  const t = {en:"Licence Recognition",tr:"Lisans Tanınması",de:"Lizenzanerkennung",ru:"Признание лицензий"}
  const d = {en:"Foreign paragliding licences at Oludeniz.",tr:"Oludeniz'de yabancı paraşüt lisansları.",de:"Ausländische Paragliding-Lizenzen in Oludeniz.",ru:"Иностранные лицензии парапланеризма в Олюдениз."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/training/licence-recognition'),
    openGraph: { url: localeUrl(locale, '/training/licence-recognition'), description: (d as any)[locale] || d.en, images: ['https://www.atmosparagliding.com/opengraph-image'] },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "Which Foreign Licences Does Turkey Recognize?", "ps": ["Turkey recognizes paragliding licences issued by CIVL member nations under the CIVL reciprocal licence agreement. This includes BHPA (UK), DHV (Germany), FFVL (France), PMA (Australia), and most other national associations."]}, {"h2": "How Do You Fly Solo at Babadağ with a Foreign Licence?", "ps": ["Present your licence card and logbook at our operations desk on arrival. We will confirm your eligibility and issue a briefing pack covering local airspace, procedures and emergency contacts."]}, {"h2": "What About Insurance?", "ps": ["Third-party liability insurance is mandatory to fly at Babadağ. BHPA and DHV memberships include this. If your association doesn't provide cover in Turkey, we can advise on suitable policies."]}, {"h2": "Does the Recognized List Ever Change?", "ps": ["Yes — SHGM periodically updates its reciprocal recognition list. Contact us before your visit to confirm your licence is currently recognized."]}], "faqTitle": "FAQ – Licence Recognition", "faqs": [{"q": "Is my BHPA or DHV licence valid at Babadağ?", "a": "Yes, under the CIVL reciprocal agreement, along with most other national associations — present it at our operations desk on arrival."}, {"q": "Do I need insurance to fly solo?", "a": "Yes, third-party liability insurance is mandatory. BHPA and DHV memberships usually include this."}, {"q": "Should I check before travelling?", "a": "Yes — SHGM's recognition list is updated periodically, so contact us before your trip to confirm."}], "relatedTitle": "More Training Options", "related": [{"href": "/training/beginner-courses", "label": "Beginner Courses"}, {"href": "/training/advanced-courses", "label": "Advanced Courses"}, {"href": "/training/siv-clinic", "label": "SIV Clinic"}, {"href": "/training/instructor-info", "label": "Instructor Info"}]}, "tr": {"sections": [{"h2": "Türkiye Hangi Yabancı Lisansları Tanıyor?", "ps": ["Türkiye, CIVL karşılıklı lisans anlaşması kapsamında CIVL üyesi uluslar tarafından verilen paraşüt lisanslarını tanır. Buna BHPA (İngiltere), DHV (Almanya), FFVL (Fransa), PMA (Avustralya) ve çoğu diğer ulusal dernek dahildir."]}, {"h2": "Yabancı Lisansla Babadağ'da Nasıl Solo Uçulur?", "ps": ["Varışta operasyon masamıza lisans kartınızı ve kayıt defterinizi gösterin. Uygunluğunuzu teyit eder ve yerel hava sahası, prosedürler ve acil durum kişilerini kapsayan bir brifing paketi veririz."]}, {"h2": "Sigorta Konusunda Ne Olacak?", "ps": ["Babadağ'da uçmak için üçüncü şahıs sorumluluk sigortası zorunludur. BHPA ve DHV üyelikleri bunu içerir. Derneğiniz Türkiye'de kapsama sağlamıyorsa, uygun poliçeler konusunda tavsiyede bulunabiliriz."]}, {"h2": "Tanınan Liste Değişir mi?", "ps": ["Evet — SHGM karşılıklı tanıma listesini periyodik olarak günceller. Lisansınızın hâlâ tanındığını teyit etmek için ziyaretinizden önce bize ulaşın."]}], "faqTitle": "SSS – Lisans Tanınması", "faqs": [{"q": "BHPA veya DHV lisansım Babadağ'da geçerli mi?", "a": "Evet, CIVL karşılıklı anlaşması kapsamında, çoğu diğer ulusal dernekle birlikte — varışta operasyon masamıza gösterin."}, {"q": "Solo uçmak için sigortaya ihtiyacım var mı?", "a": "Evet, üçüncü şahıs sorumluluk sigortası zorunludur. BHPA ve DHV üyelikleri genellikle bunu içerir."}, {"q": "Seyahat etmeden önce kontrol etmeli miyim?", "a": "Evet — SHGM'nin tanıma listesi periyodik olarak güncellenir, bu yüzden teyit için seyahatinizden önce bize ulaşın."}], "relatedTitle": "Diğer Eğitim Seçenekleri", "related": [{"href": "/training/beginner-courses", "label": "Başlangıç Kursları"}, {"href": "/training/advanced-courses", "label": "İleri Düzey Kurslar"}, {"href": "/training/siv-clinic", "label": "SIV Kliniği"}, {"href": "/training/instructor-info", "label": "Eğitmen Bilgileri"}]}, "de": {"sections": [{"h2": "Welche ausländischen Lizenzen erkennt die Türkei an?", "ps": ["Die Türkei erkennt Paragliding-Lizenzen an, die von CIVL-Mitgliedsnationen im Rahmen des CIVL-Gegenseitigkeitsabkommens ausgestellt wurden. Dazu gehören BHPA (UK), DHV (Deutschland), FFVL (Frankreich), PMA (Australien) und die meisten anderen nationalen Verbände."]}, {"h2": "Wie fliegt man mit ausländischer Lizenz solo am Babadağ?", "ps": ["Legen Sie bei Ankunft Ihre Lizenzkarte und Ihr Flugbuch an unserem Operationsdesk vor. Wir bestätigen Ihre Berechtigung und stellen ein Briefing-Paket zu lokalem Luftraum, Verfahren und Notfallkontakten bereit."]}, {"h2": "Wie sieht es mit der Versicherung aus?", "ps": ["Eine Haftpflichtversicherung ist Pflicht, um am Babadağ zu fliegen. BHPA- und DHV-Mitgliedschaften beinhalten diese. Falls Ihr Verband keine Deckung in der Türkei bietet, beraten wir Sie zu geeigneten Policen."]}, {"h2": "Ändert sich die Liste der anerkannten Verbände?", "ps": ["Ja — die SHGM aktualisiert ihre Liste der gegenseitigen Anerkennung regelmäßig. Kontaktieren Sie uns vor Ihrer Reise, um zu bestätigen, dass Ihre Lizenz aktuell anerkannt wird."]}], "faqTitle": "FAQ – Lizenzanerkennung", "faqs": [{"q": "Ist meine BHPA- oder DHV-Lizenz am Babadağ gültig?", "a": "Ja, im Rahmen des CIVL-Gegenseitigkeitsabkommens, zusammen mit den meisten anderen nationalen Verbänden — legen Sie sie bei Ankunft an unserem Operationsdesk vor."}, {"q": "Brauche ich eine Versicherung für Soloflüge?", "a": "Ja, eine Haftpflichtversicherung ist Pflicht. BHPA- und DHV-Mitgliedschaften beinhalten diese meist."}, {"q": "Sollte ich vor der Reise prüfen?", "a": "Ja — die Anerkennungsliste der SHGM wird regelmäßig aktualisiert, kontaktieren Sie uns daher vor Ihrer Reise zur Bestätigung."}], "relatedTitle": "Weitere Trainingsoptionen", "related": [{"href": "/training/beginner-courses", "label": "Anfängerkurse"}, {"href": "/training/advanced-courses", "label": "Fortgeschrittenenkurse"}, {"href": "/training/siv-clinic", "label": "SIV-Klinik"}, {"href": "/training/instructor-info", "label": "Instruktorinformationen"}]}, "ru": {"sections": [{"h2": "Какие иностранные лицензии признаёт Турция?", "ps": ["Турция признаёт лицензии парапланеризма, выданные странами-членами CIVL, в рамках соглашения о взаимном признании CIVL. Сюда входят BHPA (Великобритания), DHV (Германия), FFVL (Франция), PMA (Австралия) и большинство других национальных ассоциаций."]}, {"h2": "Как летать соло на Бабадаге с иностранной лицензией?", "ps": ["Предъявите карту лицензии и лётную книжку на нашей операционной стойке по прибытии. Мы подтвердим ваше право и выдадим пакет инструктажа по местному воздушному пространству, процедурам и контактам на случай ЧС."]}, {"h2": "А как насчёт страховки?", "ps": ["Страхование гражданской ответственности обязательно для полётов на Бабадаге. Членство в BHPA и DHV обычно его включает. Если ваша ассоциация не предоставляет покрытие в Турции, мы посоветуем подходящие полисы."]}, {"h2": "Меняется ли список признанных ассоциаций?", "ps": ["Да — SHGM периодически обновляет список взаимного признания. Свяжитесь с нами перед поездкой, чтобы подтвердить, что ваша лицензия признаётся в настоящее время."]}], "faqTitle": "FAQ – признание лицензий", "faqs": [{"q": "Действительна ли моя лицензия BHPA или DHV на Бабадаге?", "a": "Да, в рамках соглашения о взаимном признании CIVL, вместе с большинством других национальных ассоциаций — предъявите её на операционной стойке по прибытии."}, {"q": "Нужна ли страховка для соло-полётов?", "a": "Да, страхование гражданской ответственности обязательно. Членство в BHPA и DHV обычно его включает."}, {"q": "Стоит ли проверить перед поездкой?", "a": "Да — список признания SHGM периодически обновляется, свяжитесь с нами перед поездкой для подтверждения."}], "relatedTitle": "Другие варианты обучения", "related": [{"href": "/training/beginner-courses", "label": "Курсы для начинающих"}, {"href": "/training/advanced-courses", "label": "Продвинутые курсы"}, {"href": "/training/siv-clinic", "label": "SIV клиника"}, {"href": "/training/instructor-info", "label": "Информация об инструкторах"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'training' })
  const titles = {en:"Licence Recognition",tr:"Lisans Tanınması",de:"Lizenzanerkennung",ru:"Признание лицензий"}
  const subs = {en:"Foreign paragliding licences at Oludeniz.",tr:"Oludeniz'de yabancı paraşüt lisansları.",de:"Ausländische Paragliding-Lizenzen in Oludeniz.",ru:"Иностранные лицензии парапланеризма в Олюдениз."}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <ServiceSchema name="Paragliding Licence Recognition Turkey" description="Information about paragliding licence recognition for international pilots in Turkey." path="/training/licence-recognition" serviceType="Paragliding Training Course" />
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
