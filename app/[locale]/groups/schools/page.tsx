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
  const t = {en:"School and University Group Flights",tr:"Okul ve Üniversite Grup Uçuşları",de:"Schul- und Universitätsgruppen-Flüge",ru:"Школьные и университетские групповые полёты"}
  const d = {en:"Educational paragliding experiences for school and university groups.",tr:"Okul ve üniversite grupları için eğitici paraşüt deneyimleri.",de:"Lehrreiche Paragliding-Erlebnisse für Schul- und Universitätsgruppen.",ru:"Образовательные парапланерные мероприятия для школьных и университетских групп."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/groups/schools'),
    openGraph: { url: localeUrl(locale, '/groups/schools'), description: (d as any)[locale] || d.en, images: ['https://www.atmosparagliding.com/opengraph-image'] },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "What Do School and University Group Flights Include?", "ps": ["We work with schools, colleges and universities visiting Ölüdeniz on educational or activity trips. Our student group packages include supervised flights, a pre-flight education session covering meteorology and flight physics, and a post-flight debrief."]}, {"h2": "What Are the Age and Consent Requirements?", "ps": ["All student participants under 18 require signed parental consent forms — we provide template consent documents on request. The minimum recommended age is 12 years."]}, {"h2": "How Does Group Pricing and Coordination Work?", "ps": ["School group pricing is available for groups of 10+. We work with tour operators and school trip organizers to coordinate the flying within your broader itinerary."]}], "faqTitle": "FAQ – School & University Group Flights", "faqs": [{"q": "What's the minimum age for student participants?", "a": "12 years is our recommended minimum age, with signed parental consent required for anyone under 18."}, {"q": "Do you provide consent form templates?", "a": "Yes, we provide template parental consent documents on request."}, {"q": "What group size gets school pricing?", "a": "Group pricing applies for 10 or more students."}], "relatedTitle": "Group Options", "related": [{"href": "/groups/corporate", "label": "Corporate Groups"}, {"href": "/groups/tour-operators", "label": "Tour Operators"}, {"href": "/tandem-paragliding/safety-guide", "label": "Safety Guide"}, {"href": "/contact", "label": "Contact Us"}]}, "tr": {"sections": [{"h2": "Okul ve Üniversite Grup Uçuşlarına Neler Dahil?", "ps": ["Ölüdeniz'i eğitim veya aktivite gezileriyle ziyaret eden okullar, kolejler ve üniversitelerle çalışıyoruz. Öğrenci grup paketlerimiz gözetimli uçuşlar, meteoroloji ve uçuş fiziğini kapsayan bir uçuş öncesi eğitim oturumu ve uçuş sonrası değerlendirmeyi içerir."]}, {"h2": "Yaş ve Onay Gereksinimleri Nelerdir?", "ps": ["18 yaş altındaki tüm öğrenci katılımcılar için imzalı veli onay formları gereklidir — talep üzerine şablon onay belgeleri sağlıyoruz. Önerilen minimum yaş 12'dir."]}, {"h2": "Grup Fiyatlandırması ve Koordinasyonu Nasıl İşliyor?", "ps": ["10+ kişilik gruplar için okul grubu fiyatlandırması mevcuttur. Uçuşu daha geniş gezi programınız içinde koordine etmek için tur operatörleri ve okul gezisi organizatörleriyle çalışıyoruz."]}], "faqTitle": "SSS – Okul ve Üniversite Grup Uçuşları", "faqs": [{"q": "Öğrenci katılımcılar için minimum yaş nedir?", "a": "Önerilen minimum yaş 12'dir; 18 yaş altındaki herkes için imzalı veli onayı gereklidir."}, {"q": "Onay formu şablonu sağlıyor musunuz?", "a": "Evet, talep üzerine şablon veli onay belgeleri sağlıyoruz."}, {"q": "Hangi grup büyüklüğü okul fiyatlandırmasından yararlanır?", "a": "Grup fiyatlandırması 10 veya daha fazla öğrenci için geçerlidir."}], "relatedTitle": "Grup Seçenekleri", "related": [{"href": "/groups/corporate", "label": "Kurumsal Gruplar"}, {"href": "/groups/tour-operators", "label": "Tur Operatörleri"}, {"href": "/tandem-paragliding/safety-guide", "label": "Güvenlik Rehberi"}, {"href": "/contact", "label": "Bize Ulaşın"}]}, "de": {"sections": [{"h2": "Was beinhalten Schul- und Universitätsgruppenflüge?", "ps": ["Wir arbeiten mit Schulen, Colleges und Universitäten zusammen, die Ölüdeniz auf Bildungs- oder Aktivitätsreisen besuchen. Unsere Schülergruppenpakete umfassen beaufsichtigte Flüge, eine Aufklärungseinheit vor dem Flug zu Meteorologie und Flugphysik sowie eine Nachbesprechung nach dem Flug."]}, {"h2": "Welche Alters- und Zustimmungsanforderungen gelten?", "ps": ["Alle Schülerteilnehmer unter 18 Jahren benötigen unterschriebene Einverständniserklärungen der Eltern — wir stellen auf Anfrage Vorlagen bereit. Das empfohlene Mindestalter beträgt 12 Jahre."]}, {"h2": "Wie funktionieren Gruppenpreise und Koordination?", "ps": ["Schulgruppenpreise gelten für Gruppen ab 10 Personen. Wir arbeiten mit Reiseveranstaltern und Organisatoren von Schulausflügen zusammen, um den Flug in Ihr größeres Reiseprogramm einzubinden."]}], "faqTitle": "FAQ – Schul- & Universitätsgruppenflüge", "faqs": [{"q": "Was ist das Mindestalter für Schülerteilnehmer?", "a": "12 Jahre ist unser empfohlenes Mindestalter, mit unterschriebener elterlicher Zustimmung für alle unter 18."}, {"q": "Stellen Sie Vorlagen für Einverständniserklärungen bereit?", "a": "Ja, wir stellen auf Anfrage Vorlagen für elterliche Einverständniserklärungen zur Verfügung."}, {"q": "Ab welcher Gruppengröße gilt der Schulpreis?", "a": "Gruppenpreise gelten ab 10 Schülern."}], "relatedTitle": "Gruppenoptionen", "related": [{"href": "/groups/corporate", "label": "Firmengruppen"}, {"href": "/groups/tour-operators", "label": "Reiseveranstalter"}, {"href": "/tandem-paragliding/safety-guide", "label": "Sicherheitsleitfaden"}, {"href": "/contact", "label": "Kontakt"}]}, "ru": {"sections": [{"h2": "Что включают школьные и университетские групповые полёты?", "ps": ["Мы работаем со школами, колледжами и университетами, посещающими Олюдениз с образовательными или активными поездками. Наши пакеты для студенческих групп включают полёты под наблюдением, образовательную сессию перед полётом о метеорологии и физике полёта, а также подведение итогов после полёта."]}, {"h2": "Какие требования по возрасту и согласию?", "ps": ["Все участники младше 18 лет должны предоставить подписанные формы согласия родителей — мы предоставляем шаблоны документов по запросу. Рекомендуемый минимальный возраст — 12 лет."]}, {"h2": "Как работают групповые цены и координация?", "ps": ["Групповые цены для школ доступны для групп от 10 человек. Мы работаем с туроператорами и организаторами школьных поездок, чтобы согласовать полёты в рамках вашего общего маршрута."]}], "faqTitle": "FAQ – школьные и университетские групповые полёты", "faqs": [{"q": "Какой минимальный возраст для участников-студентов?", "a": "Рекомендуемый минимальный возраст — 12 лет, с подписанным согласием родителей для всех младше 18."}, {"q": "Предоставляете ли вы шаблоны форм согласия?", "a": "Да, мы предоставляем шаблоны форм согласия родителей по запросу."}, {"q": "При каком размере группы действуют школьные цены?", "a": "Групповые цены действуют для 10 и более студентов."}], "relatedTitle": "Групповые варианты", "related": [{"href": "/groups/corporate", "label": "Корпоративные группы"}, {"href": "/groups/tour-operators", "label": "Туроператоры"}, {"href": "/tandem-paragliding/safety-guide", "label": "Гид по безопасности"}, {"href": "/contact", "label": "Связаться с нами"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'groups' })
  const titles = {en:"School and University Group Flights",tr:"Okul ve Üniversite Grup Uçuşları",de:"Schul- und Universitätsgruppen-Flüge",ru:"Школьные и университетские групповые полёты"}
  const subs = {en:"Educational paragliding experiences for school and university groups.",tr:"Okul ve üniversite grupları için eğitici paraşüt deneyimleri.",de:"Lehrreiche Paragliding-Erlebnisse für Schul- und Universitätsgruppen.",ru:"Образовательные парапланерные мероприятия для школьных и университетских групп."}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <ServiceSchema name="School Paragliding Trips Oludeniz" description="School and youth group paragliding trips in Oludeniz with certified instructors." path="/groups/schools" serviceType="Tandem Paragliding Flight" />
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c09/2htlcwkJ6pcLBY7gPtf7z.jpg" />
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
