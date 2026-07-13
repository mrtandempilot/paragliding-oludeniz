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
  const t: Record<string,string> = {en:"Paragliding Safety Guide Oludeniz",tr:"Paraşüt Güvenlik Rehberi",de:"Paragliding-Sicherheitsleitfaden",ru:"Руководство по безопасности"}
  const d = {en:"25+ years. Zero serious incidents. Here is how we keep you safe.",tr:"25+ yıl. Sıfır ciddi kaza. İşte sizi nasıl güvende tuttuğumuz.",de:"25+ Jahre. Null ernste Zwischenfälle. So halten wir Sie sicher.",ru:"25+ лет. Ноль серьёзных инцидентов. Как мы обеспечиваем вашу безопасность."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/tandem-paragliding/safety-guide'),
    openGraph: { url: localeUrl(locale, '/tandem-paragliding/safety-guide'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${t[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "How Are Our Pilots Certified?", "ps": ["All our pilots are certified by the Turkish Civil Aviation Authority (SHGM) and hold international BHPA or DHV ratings. Each pilot completes annual proficiency checks and first aid recertification."]}, {"h2": "How Is Equipment Maintained?", "ps": ["Our equipment is maintained to the highest standards. Every wing is inspected before each flight day. Harnesses are checked for wear and replaced on a strict rotation. Helmets are individually fitted to each passenger."]}, {"h2": "How Do You Monitor Weather Conditions?", "ps": ["We monitor weather conditions continuously from 06:00 every morning, using three independent weather stations — at the beach, at 1200m, and at the 1960m summit. If conditions are not perfect, we do not fly, and your refund or rescheduling is guaranteed."]}, {"h2": "Are There Weight or Health Restrictions?", "ps": ["Maximum passenger weight is 110kg. We ask that you do not fly if pregnant, if you have a serious heart condition, or have had recent surgery. Children under 18 require written parental consent."]}], "faqTitle": "FAQ – Safety", "faqs": [{"q": "What's your safety record?", "a": "25+ years of operation with zero serious incidents — see our dedicated safety record page for the full picture."}, {"q": "Do you fly in any weather?", "a": "No — we monitor conditions from three weather stations daily and cancel with a full refund or free rescheduling if conditions aren't right."}, {"q": "Is there a weight limit?", "a": "Maximum 110kg per passenger, with health restrictions for pregnancy, serious heart conditions, or recent surgery."}], "relatedTitle": "More on Tandem Paragliding", "related": [{"href": "/tandem-paragliding/first-time", "label": "First Time Flying"}, {"href": "/tandem-paragliding/safety-guide", "label": "Safety Guide"}, {"href": "/tandem-paragliding/sunset-flight", "label": "Sunset Flight"}, {"href": "/tandem-paragliding/group-flights", "label": "Group Flights"}]}, "tr": {"sections": [{"h2": "Pilotlarımız Nasıl Sertifikalandırılıyor?", "ps": ["Tüm pilotlarımız Sivil Havacılık Genel Müdürlüğü (SHGM) tarafından sertifikalandırılmış ve uluslararası BHPA veya DHV derecelerine sahiptir. Her pilot yıllık yeterlilik kontrolü ve ilk yardım yenileme eğitiminden geçer."]}, {"h2": "Ekipman Nasıl Bakımı Yapılıyor?", "ps": ["Ekipmanlarımız en yüksek standartlarda bakımı yapılır. Her kanat, her uçuş günü öncesinde incelenir. Paraşütler katı bir rotasyona göre değiştirilir. Kasklar her yolcuya bireysel olarak ayarlanır."]}, {"h2": "Hava Koşullarını Nasıl İzliyorsunuz?", "ps": ["Hava koşullarını her sabah 06:00'dan itibaren üç bağımsız hava istasyonundan (plaj, 1200m ve 1960m zirve) sürekli takip ediyoruz. Koşullar mükemmel değilse uçmuyoruz; para iadesi veya yeniden planlama garantilidir."]}, {"h2": "Ağırlık veya Sağlık Kısıtlaması Var mı?", "ps": ["Azami yolcu ağırlığı 110 kg'dır. Hamile, ciddi kalp rahatsızlığı olan veya yakın zamanda ameliyat geçirmiş yolcuların uçmamasını tavsiye ederiz. 18 yaş altı çocuklar için yazılı ebeveyn izni gereklidir."]}], "faqTitle": "SSS – Güvenlik", "faqs": [{"q": "Güvenlik geçmişiniz nedir?", "a": "25+ yıllık operasyon, sıfır ciddi kaza — tam bilgi için güvenlik kaydı sayfamıza bakın."}, {"q": "Her havada uçuyor musunuz?", "a": "Hayır — koşulları günlük olarak üç hava istasyonundan izliyoruz ve koşullar uygun değilse tam iade veya ücretsiz yeniden planlama ile iptal ediyoruz."}, {"q": "Ağırlık sınırı var mı?", "a": "Yolcu başına maksimum 110 kg; hamilelik, ciddi kalp rahatsızlığı veya yakın zamanda ameliyat için sağlık kısıtlamaları vardır."}], "relatedTitle": "Tandem Paraşüt Hakkında Daha Fazla", "related": [{"href": "/tandem-paragliding/first-time", "label": "İlk Kez Uçuş"}, {"href": "/tandem-paragliding/safety-guide", "label": "Güvenlik Rehberi"}, {"href": "/tandem-paragliding/sunset-flight", "label": "Gün Batımı Uçuşu"}, {"href": "/tandem-paragliding/group-flights", "label": "Grup Uçuşları"}]}, "de": {"sections": [{"h2": "Wie sind unsere Piloten zertifiziert?", "ps": ["Alle unsere Piloten sind von der türkischen Zivilluftfahrtbehörde (SHGM) zertifiziert und haben internationale BHPA- oder DHV-Bewertungen. Jeder Pilot absolviert jährliche Eignungsprüfungen und Erste-Hilfe-Auffrischungen."]}, {"h2": "Wie wird die Ausrüstung gewartet?", "ps": ["Unsere Ausrüstung wird nach höchsten Standards gewartet. Jeder Schirm wird vor jedem Flugtag inspiziert. Gurtzeuge werden auf Verschleiß geprüft und nach strikter Rotation ersetzt. Helme werden individuell an jeden Passagier angepasst."]}, {"h2": "Wie überwachen Sie die Wetterbedingungen?", "ps": ["Wir überwachen die Bedingungen kontinuierlich ab 06:00 Uhr jeden Morgen von drei unabhängigen Wetterstationen — am Strand, auf 1200m und am 1960m-Gipfel. Wenn die Bedingungen nicht perfekt sind, fliegen wir nicht; Rückerstattung oder Umplanung ist garantiert."]}, {"h2": "Gibt es Gewichts- oder Gesundheitsbeschränkungen?", "ps": ["Maximales Passagiergewicht: 110 kg. Wir bitten, nicht zu fliegen, wenn Sie schwanger sind, eine ernste Herzerkrankung haben oder sich kürzlich einer Operation unterzogen haben. Kinder unter 18 benötigen eine schriftliche Einverständniserklärung der Eltern."]}], "faqTitle": "FAQ – Sicherheit", "faqs": [{"q": "Wie ist Ihre Sicherheitsbilanz?", "a": "25+ Jahre Betrieb ohne ernsthafte Zwischenfälle — Details auf unserer Sicherheitsbilanz-Seite."}, {"q": "Fliegen Sie bei jedem Wetter?", "a": "Nein — wir überwachen die Bedingungen täglich von drei Wetterstationen und sagen bei ungeeigneten Bedingungen mit voller Rückerstattung oder kostenloser Umbuchung ab."}, {"q": "Gibt es ein Gewichtslimit?", "a": "Maximal 110 kg pro Passagier, mit gesundheitlichen Einschränkungen bei Schwangerschaft, ernsten Herzerkrankungen oder kürzlichen Operationen."}], "relatedTitle": "Mehr zum Tandem-Paragliding", "related": [{"href": "/tandem-paragliding/first-time", "label": "Erster Flug"}, {"href": "/tandem-paragliding/safety-guide", "label": "Sicherheitsleitfaden"}, {"href": "/tandem-paragliding/sunset-flight", "label": "Sonnenuntergangsflug"}, {"href": "/tandem-paragliding/group-flights", "label": "Gruppenflüge"}]}, "ru": {"sections": [{"h2": "Как сертифицированы наши пилоты?", "ps": ["Все наши пилоты сертифицированы Турецким управлением гражданской авиации (SHGM) и имеют международные рейтинги BHPA или DHV. Каждый пилот ежегодно проходит проверку квалификации и повышение по первой помощи."]}, {"h2": "Как обслуживается снаряжение?", "ps": ["Наше оборудование обслуживается по высшим стандартам. Каждое крыло проверяется перед каждым лётным днём. Подвесные системы проверяются на износ и заменяются по строгой ротации. Шлемы индивидуально подбираются каждому пассажиру."]}, {"h2": "Как вы отслеживаете погодные условия?", "ps": ["Мы непрерывно отслеживаем условия с 06:00 каждое утро с трёх независимых метеостанций — на пляже, на высоте 1200м и на вершине 1960м. Если условия не идеальны, мы не летаем; возврат средств или перенос гарантированы."]}, {"h2": "Есть ли ограничения по весу или здоровью?", "ps": ["Максимальный вес пассажира — 110 кг. Просим не летать при беременности, серьёзных заболеваниях сердца или недавних операциях. Детям до 18 лет требуется письменное согласие родителей."]}], "faqTitle": "FAQ – безопасность", "faqs": [{"q": "Какова ваша история безопасности?", "a": "25+ лет работы без серьёзных инцидентов — подробности на нашей странице истории безопасности."}, {"q": "Вы летаете в любую погоду?", "a": "Нет — мы ежедневно отслеживаем условия с трёх метеостанций и отменяем полёты с полным возвратом средств или бесплатным переносом при неподходящих условиях."}, {"q": "Есть ли ограничение по весу?", "a": "Максимум 110 кг на пассажира, с ограничениями по здоровью при беременности, серьёзных заболеваниях сердца или недавних операциях."}], "relatedTitle": "Больше о тандемном парапланеризме", "related": [{"href": "/tandem-paragliding/first-time", "label": "Первый полёт"}, {"href": "/tandem-paragliding/safety-guide", "label": "Руководство по безопасности"}, {"href": "/tandem-paragliding/sunset-flight", "label": "Закатный полёт"}, {"href": "/tandem-paragliding/group-flights", "label": "Групповые полёты"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'tandem' })
  const titles: Record<string,string> = {en:"Paragliding Safety Guide Oludeniz",tr:"Paraşüt Güvenlik Rehberi",de:"Paragliding-Sicherheitsleitfaden",ru:"Руководство по безопасности"}
  const subs: Record<string,string> = {en:"25+ years. Zero serious incidents. Here is how we keep you safe.",tr:"25+ yıl. Sıfır ciddi kaza. İşte sizi nasıl güvende tuttuğumuz.",de:"25+ Jahre. Null ernste Zwischenfälle. So halten wir Sie sicher.",ru:"25+ лет. Ноль серьёзных инцидентов. Как мы обеспечиваем вашу безопасность."}
  const title = titles[locale]||titles.en
  const sub = subs[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <ServiceSchema name="Paragliding Safety Guide Oludeniz" description="Safety information for tandem paragliding in Oludeniz with certified pilots." path="/tandem-paragliding/safety-guide" serviceType="Tandem Paragliding Flight" />
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
