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
  const t = {en:"Tandem Paragliding FAQ",tr:"Tandem Paraşüt SSS",de:"Tandem-Paragliding FAQ",ru:"Вопросы и ответы о тандемном парапланеризме"}
  const d = {en:"Answers to the most common questions about tandem paragliding in Oludeniz.",tr:"Oludeniz'de tandem paraşüt hakkında en sık sorulan soruların yanıtları.",de:"Antworten auf die häufigsten Fragen zum Tandem-Paragliding in Oludeniz.",ru:"Ответы на самые распространённые вопросы о тандемном парапланеризме в Олюдениз."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/tandem-paragliding/faq'),
    openGraph: { url: localeUrl(locale, '/tandem-paragliding/faq'), description: (d as any)[locale] || d.en, images: ['https://www.atmosparagliding.com/opengraph-image'] },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "How Long Is the Flight?", "ps": ["Standard flights last 25–35 minutes from the 1200m launch or 35–50 minutes from the 1700m launch. Sunset flights last 20–30 minutes. Actual duration depends on weather conditions."]}, {"h2": "Is Tandem Paragliding Safe?", "ps": ["Yes. Tandem paragliding with a certified pilot has an excellent safety record. Our operation has completed over 50,000 flights without a serious passenger injury. See our full safety guide for details."]}, {"h2": "What Is the Weight Limit?", "ps": ["Maximum 110kg per passenger, with no minimum weight. Children should be able to follow instructions and are welcome from age 5+ with parent approval."]}, {"h2": "Can I Take Photos During the Flight?", "ps": ["Yes. We recommend securing your phone with a wrist strap. We also offer professional photo and video packages if you'd rather keep your hands free."]}, {"h2": "What Happens If the Weather Is Bad?", "ps": ["We monitor conditions daily from three weather stations. If we cancel due to weather, you receive a full refund or free rescheduling — no exceptions."]}], "faqTitle": "Quick Answers", "faqs": [{"q": "Do I need experience to fly?", "a": "No, you fly attached to a certified pilot who handles everything from launch to landing."}, {"q": "How far in advance should I book?", "a": "We recommend booking 1-2 days ahead in peak season, though same-day slots are sometimes available."}, {"q": "Is there an age limit?", "a": "Minimum age 5 with parent approval; there's no strict upper age limit as long as you can walk to the launch point."}], "relatedTitle": "More on Tandem Paragliding", "related": [{"href": "/tandem-paragliding/first-time", "label": "First Time Flying"}, {"href": "/tandem-paragliding/safety-guide", "label": "Safety Guide"}, {"href": "/tandem-paragliding/sunset-flight", "label": "Sunset Flight"}, {"href": "/tandem-paragliding/group-flights", "label": "Group Flights"}]}, "tr": {"sections": [{"h2": "Uçuş Ne Kadar Sürer?", "ps": ["Standart uçuşlar 1200m kalkıştan 25-35 dakika veya 1700m kalkıştan 35-50 dakika sürer. Gün batımı uçuşları 20-30 dakika sürer. Gerçek süre hava koşullarına bağlıdır."]}, {"h2": "Tandem Paraşüt Güvenli mi?", "ps": ["Evet. Sertifikalı bir pilotla tandem yamaç paraşütü mükemmel bir güvenlik geçmişine sahiptir. İşletmemiz ciddi bir yolcu yaralanması olmadan 50.000'den fazla uçuş tamamladı."]}, {"h2": "Ağırlık Sınırı Nedir?", "ps": ["Yolcu başına maksimum 110 kg, minimum ağırlık yoktur. Çocuklar talimatları takip edebilecek durumda olmalı ve ebeveyn onayıyla 5 yaş ve üzeri kabul edilir."]}, {"h2": "Uçuş Sırasında Fotoğraf Çekebilir miyim?", "ps": ["Evet. Telefonunuzu bir bilek kayışıyla sabitlemenizi öneririz. Ellerinizi serbest bırakmak isterseniz profesyonel fotoğraf ve video paketleri de sunuyoruz."]}, {"h2": "Hava Kötü Olursa Ne Olur?", "ps": ["Koşulları üç hava istasyonundan günlük olarak izliyoruz. Hava nedeniyle iptal edersek, tam iade veya ücretsiz yeniden planlama alırsınız."]}], "faqTitle": "Hızlı Cevaplar", "faqs": [{"q": "Uçmak için deneyime ihtiyacım var mı?", "a": "Hayır, kalkıştan inişe kadar her şeyi yöneten sertifikalı bir pilota bağlı olarak uçarsınız."}, {"q": "Ne kadar önceden rezervasyon yapmalıyım?", "a": "Yoğun sezonda 1-2 gün öncesinden rezervasyon öneririz, bazen aynı gün yer de bulunabilir."}, {"q": "Yaş sınırı var mı?", "a": "Ebeveyn onayıyla minimum 5 yaş; kalkış noktasına yürüyebildiğiniz sürece üst yaş sınırı yoktur."}], "relatedTitle": "Tandem Paraşüt Hakkında Daha Fazla", "related": [{"href": "/tandem-paragliding/first-time", "label": "İlk Kez Uçuş"}, {"href": "/tandem-paragliding/safety-guide", "label": "Güvenlik Rehberi"}, {"href": "/tandem-paragliding/sunset-flight", "label": "Gün Batımı Uçuşu"}, {"href": "/tandem-paragliding/group-flights", "label": "Grup Uçuşları"}]}, "de": {"sections": [{"h2": "Wie lange dauert der Flug?", "ps": ["Standardflüge dauern 25-35 Minuten vom 1200m-Startplatz oder 35-50 Minuten vom 1700m-Startplatz. Sonnenuntergangsflüge dauern 20-30 Minuten. Die tatsächliche Dauer hängt von den Wetterbedingungen ab."]}, {"h2": "Ist Tandem-Paragliding sicher?", "ps": ["Ja. Tandem-Paragliding mit einem zertifizierten Piloten hat eine ausgezeichnete Sicherheitsbilanz. Unser Betrieb hat über 50.000 Flüge ohne ernsthafte Passagierverletzung absolviert."]}, {"h2": "Was ist das Gewichtslimit?", "ps": ["Maximal 110 kg pro Passagier, kein Mindestgewicht. Kinder sollten Anweisungen befolgen können und sind ab 5 Jahren mit Zustimmung der Eltern willkommen."]}, {"h2": "Kann ich während des Flugs fotografieren?", "ps": ["Ja. Wir empfehlen, Ihr Telefon mit einem Handgelenksband zu sichern. Wir bieten auch professionelle Foto- und Videopakete an."]}, {"h2": "Was passiert bei schlechtem Wetter?", "ps": ["Wir überwachen die Bedingungen täglich von drei Wetterstationen aus. Bei witterungsbedingter Absage erhalten Sie eine volle Rückerstattung oder kostenlose Umbuchung."]}], "faqTitle": "Kurze Antworten", "faqs": [{"q": "Brauche ich Erfahrung zum Fliegen?", "a": "Nein, Sie fliegen an einen zertifizierten Piloten gebunden, der alles vom Start bis zur Landung übernimmt."}, {"q": "Wie weit im Voraus sollte ich buchen?", "a": "Wir empfehlen 1-2 Tage im Voraus in der Hochsaison zu buchen, manchmal sind auch kurzfristige Termine verfügbar."}, {"q": "Gibt es eine Altersgrenze?", "a": "Mindestalter 5 Jahre mit Zustimmung der Eltern; keine strikte Obergrenze, solange Sie zum Startplatz laufen können."}], "relatedTitle": "Mehr zum Tandem-Paragliding", "related": [{"href": "/tandem-paragliding/first-time", "label": "Erster Flug"}, {"href": "/tandem-paragliding/safety-guide", "label": "Sicherheitsleitfaden"}, {"href": "/tandem-paragliding/sunset-flight", "label": "Sonnenuntergangsflug"}, {"href": "/tandem-paragliding/group-flights", "label": "Gruppenflüge"}]}, "ru": {"sections": [{"h2": "Сколько длится полёт?", "ps": ["Стандартные полёты длятся 25-35 минут со старта на 1200м или 35-50 минут со старта на 1700м. Закатные полёты длятся 20-30 минут. Фактическая продолжительность зависит от погодных условий."]}, {"h2": "Безопасен ли тандемный парапланеризм?", "ps": ["Да. Тандемный парапланеризм с сертифицированным пилотом имеет отличную историю безопасности. Наша компания выполнила более 50 000 полётов без серьёзных травм пассажиров."]}, {"h2": "Какой лимит веса?", "ps": ["Максимум 110 кг на пассажира, минимального веса нет. Дети должны уметь следовать инструкциям и допускаются от 5 лет с согласия родителей."]}, {"h2": "Можно ли фотографировать во время полёта?", "ps": ["Да. Рекомендуем закрепить телефон на запястье ремешком. Мы также предлагаем профессиональные фото- и видеопакеты."]}, {"h2": "Что если погода плохая?", "ps": ["Мы ежедневно отслеживаем условия с трёх метеостанций. При отмене из-за погоды вы получаете полный возврат средств или бесплатный перенос."]}], "faqTitle": "Быстрые ответы", "faqs": [{"q": "Нужен ли опыт для полёта?", "a": "Нет, вы летите пристёгнутым к сертифицированному пилоту, который управляет всем от взлёта до посадки."}, {"q": "За сколько нужно бронировать?", "a": "Рекомендуем бронировать за 1-2 дня в пик сезона, иногда доступны и места в тот же день."}, {"q": "Есть ли возрастные ограничения?", "a": "Минимальный возраст 5 лет с согласия родителей; строгого верхнего предела нет, если вы можете дойти до места старта."}], "relatedTitle": "Больше о тандемном парапланеризме", "related": [{"href": "/tandem-paragliding/first-time", "label": "Первый полёт"}, {"href": "/tandem-paragliding/safety-guide", "label": "Руководство по безопасности"}, {"href": "/tandem-paragliding/sunset-flight", "label": "Закатный полёт"}, {"href": "/tandem-paragliding/group-flights", "label": "Групповые полёты"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'faq' })
  const titles = {en:"Tandem Paragliding FAQ",tr:"Tandem Paraşüt SSS",de:"Tandem-Paragliding FAQ",ru:"Вопросы и ответы о тандемном парапланеризме"}
  const subs = {en:"Answers to the most common questions about tandem paragliding in Oludeniz.",tr:"Oludeniz'de tandem paraşüt hakkında en sık sorulan soruların yanıtları.",de:"Antworten auf die häufigsten Fragen zum Tandem-Paragliding in Oludeniz.",ru:"Ответы на самые распространённые вопросы о тандемном парапланеризме в Олюдениз."}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <ServiceSchema name="Paragliding FAQ Oludeniz" description="Frequently asked questions about tandem paragliding in Oludeniz from Babadağ Mountain." path="/tandem-paragliding/faq" serviceType="Tandem Paragliding Flight" />
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
