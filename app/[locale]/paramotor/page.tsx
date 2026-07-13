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
  const t = {en:"Paramotor Oludeniz",tr:"Oludeniz Paramotor",de:"Paramotor Oludeniz",ru:"Паратрайк Олюдениз"}
  const d = {en:"Motorised paragliding along the Oludeniz coastline.",tr:"Oludeniz kıyı şeridinde motorlu paraşüt.",de:"Motorisiertes Paragliding entlang der Oludeniz-Küste.",ru:"Моторизованный парапланеризм вдоль побережья Олюдениз."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/paramotor'),
    openGraph: { url: localeUrl(locale, '/paramotor'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "What Is Paramotoring and Why Fly It Along the Ölüdeniz Coast?", "ps": ["Paramotoring — powered paragliding — lets pilots fly without depending on thermals, using a motor unit strapped to the harness for thrust. The flat agricultural land south of Fethiye gives ideal launch and landing conditions, and the coastline from Fethiye to Butterfly Valley makes for a spectacular low-level route."]}, {"h2": "What Paramotor Options Are Available?", "ps": ["We offer paramotor flight experiences, training courses and equipment hire. Tandem paramotoring — flying with a passenger — is available on request for those who want the experience without holding a rating themselves."]}, {"h2": "What Certification and Airspace Rules Apply?", "ps": ["All paramotor operations require a valid SHGM paramotor rating. The Dalaman Airport control zone (CTR) affects operations south of Ölüdeniz, so every pilot flying with us gets a full airspace briefing before takeoff."]}], "faqTitle": "FAQ – Paramotoring at Ölüdeniz", "faqs": [{"q": "Do I need a licence to paramotor here?", "a": "Yes, a valid SHGM paramotor rating is required for solo flying. If you don't hold one, tandem paramotoring lets you experience it as a passenger."}, {"q": "Can I hire equipment locally?", "a": "Yes — see our equipment guide for what's involved and what's available to hire."}, {"q": "Is there training available for beginners?", "a": "Yes, we offer introductory and full training courses leading to SHGM paramotor certification — see our training page for details."}], "relatedTitle": "Paramotor Resources", "related": [{"href": "/paramotor/equipment", "label": "Equipment Guide"}, {"href": "/paramotor/training", "label": "Training Courses"}, {"href": "/contact", "label": "Contact Us"}]}, "tr": {"sections": [{"h2": "Paramotor Nedir ve Ölüdeniz Kıyısında Neden Uçulur?", "ps": ["Paramotor — motorlu yamaç paraşütü — pilotların termiğe bağlı kalmadan uçmasını sağlar; koşum takımına bağlı motor ünitesi itiş gücü verir. Fethiye'nin güneyindeki düz tarım arazileri ideal kalkış ve iniş koşulları sunar, Fethiye'den Kelebek Vadisi'ne uzanan kıyı şeridi ise etkileyici bir alçak irtifa rotası oluşturur."]}, {"h2": "Hangi Paramotor Seçenekleri Mevcut?", "ps": ["Paramotor uçuş deneyimleri, eğitim kursları ve ekipman kiralama sunuyoruz. Kendi ehliyeti olmadan deneyimlemek isteyenler için talep üzerine tandem paramotor (yolcuyla uçuş) da mevcuttur."]}, {"h2": "Hangi Sertifikasyon ve Hava Sahası Kuralları Geçerli?", "ps": ["Tüm paramotor operasyonları geçerli bir SHGM paramotor derecesi gerektirir. Dalaman Havalimanı kontrol bölgesi (CTR) Ölüdeniz'in güneyindeki operasyonları etkiler; bizimle uçan her pilota kalkıştan önce tam hava sahası brifingi verilir."]}], "faqTitle": "SSS – Ölüdeniz'de Paramotor", "faqs": [{"q": "Burada paramotor uçmak için lisans gerekli mi?", "a": "Evet, solo uçuş için geçerli bir SHGM paramotor derecesi gereklidir. Lisansınız yoksa tandem paramotor ile yolcu olarak deneyimleyebilirsiniz."}, {"q": "Yerel olarak ekipman kiralayabilir miyim?", "a": "Evet — nelerin dahil olduğunu ve kiralık ekipmanları öğrenmek için ekipman rehberimize bakın."}, {"q": "Yeni başlayanlar için eğitim var mı?", "a": "Evet, SHGM paramotor sertifikasyonuna götüren giriş ve tam eğitim kursları sunuyoruz — detaylar için eğitim sayfamıza bakın."}], "relatedTitle": "Paramotor Kaynakları", "related": [{"href": "/paramotor/equipment", "label": "Ekipman Rehberi"}, {"href": "/paramotor/training", "label": "Eğitim Kursları"}, {"href": "/contact", "label": "Bize Ulaşın"}]}, "de": {"sections": [{"h2": "Was ist Paramotoring und warum entlang der Küste von Ölüdeniz fliegen?", "ps": ["Paramotoring — motorisiertes Paragliding — ermöglicht Piloten das Fliegen unabhängig von Thermik, mit einer am Gurtzeug befestigten Motoreinheit für den Schub. Das flache Agrarland südlich von Fethiye bietet ideale Start- und Landebedingungen, und die Küste von Fethiye bis zum Schmetterlingstal ergibt eine spektakuläre Route im Tiefflug."]}, {"h2": "Welche Paramotor-Optionen gibt es?", "ps": ["Wir bieten Paramotor-Flugerlebnisse, Trainingskurse und Ausrüstungsverleih. Tandem-Paramotoring — Fliegen mit einem Passagier — ist auf Anfrage verfügbar für alle, die das Erlebnis ohne eigene Lizenz möchten."]}, {"h2": "Welche Zertifizierungs- und Luftraumregeln gelten?", "ps": ["Alle Paramotor-Aktivitäten erfordern eine gültige SHGM-Paramotor-Lizenz. Die Kontrollzone (CTR) des Flughafens Dalaman betrifft Aktivitäten südlich von Ölüdeniz, daher erhält jeder Pilot bei uns vor dem Start ein vollständiges Luftraum-Briefing."]}], "faqTitle": "FAQ – Paramotoring in Ölüdeniz", "faqs": [{"q": "Brauche ich eine Lizenz zum Paramotoring hier?", "a": "Ja, für Soloflüge ist eine gültige SHGM-Paramotor-Lizenz erforderlich. Ohne Lizenz können Sie es beim Tandem-Paramotoring als Passagier erleben."}, {"q": "Kann ich vor Ort Ausrüstung mieten?", "a": "Ja — Details und verfügbare Mietausrüstung finden Sie in unserem Ausrüstungsleitfaden."}, {"q": "Gibt es Training für Anfänger?", "a": "Ja, wir bieten Einführungs- und Vollkurse an, die zur SHGM-Paramotor-Zertifizierung führen — Details auf unserer Trainingsseite."}], "relatedTitle": "Paramotor-Ressourcen", "related": [{"href": "/paramotor/equipment", "label": "Ausrüstungsleitfaden"}, {"href": "/paramotor/training", "label": "Trainingskurse"}, {"href": "/contact", "label": "Kontakt"}]}, "ru": {"sections": [{"h2": "Что такое паратрайк и почему стоит летать вдоль побережья Олюдениза?", "ps": ["Паратрайк (моторизованный параплан) позволяет пилотам летать независимо от термиков, используя мотоустановку, закреплённую на подвесной системе, для создания тяги. Плоские сельскохозяйственные земли к югу от Фетхие дают идеальные условия для старта и посадки, а побережье от Фетхие до Долины Бабочек создаёт впечатляющий маршрут на малой высоте."]}, {"h2": "Какие варианты паратрайка доступны?", "ps": ["Мы предлагаем полёты на паратрайке, учебные курсы и аренду снаряжения. Тандемный паратрайк — полёт с пассажиром — доступен по запросу для тех, кто хочет получить опыт без собственной лицензии."]}, {"h2": "Какие сертификация и правила воздушного пространства применяются?", "ps": ["Для всех операций на паратрайке требуется действующая лицензия SHGM. Диспетчерская зона (CTR) аэропорта Даламан влияет на полёты к югу от Олюдениза, поэтому каждый пилот у нас получает полный инструктаж по воздушному пространству перед взлётом."]}], "faqTitle": "FAQ – паратрайк в Олюденизе", "faqs": [{"q": "Нужна ли лицензия для полётов на паратрайке здесь?", "a": "Да, для самостоятельных полётов требуется действующая лицензия SHGM. Без лицензии можно испытать это как пассажир тандемного паратрайка."}, {"q": "Можно ли арендовать снаряжение на месте?", "a": "Да — подробности и доступное для аренды снаряжение смотрите в нашем гиде по снаряжению."}, {"q": "Есть ли обучение для новичков?", "a": "Да, мы предлагаем вводные и полные курсы, ведущие к сертификации SHGM по паратрайку — подробности на странице обучения."}], "relatedTitle": "Ресурсы по паратрайку", "related": [{"href": "/paramotor/equipment", "label": "Гид по снаряжению"}, {"href": "/paramotor/training", "label": "Учебные курсы"}, {"href": "/contact", "label": "Связаться с нами"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'paramotor' })
  const titles = {en:"Paramotor Oludeniz",tr:"Oludeniz Paramotor",de:"Paramotor Oludeniz",ru:"Паратрайк Олюдениз"}
  const subs = {en:"Motorised paragliding along the Oludeniz coastline.",tr:"Oludeniz kıyı şeridinde motorlu paraşüt.",de:"Motorisiertes Paragliding entlang der Oludeniz-Küste.",ru:"Моторизованный парапланеризм вдоль побережья Олюдениз."}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <ServiceSchema name="Paramotor Flight Oludeniz" description="Powered paragliding flights and training along the Oludeniz coastline." path="/paramotor" serviceType="Paramotor Flight" />
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
