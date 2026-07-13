import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Base Jumping Oludeniz",tr:"Oludeniz Base Jumping",de:"Base-Jumping Oludeniz",ru:"Бэйс-джампинг Олюдениз"}
  const d = {en:"Oludeniz is a renowned base jumping location in Turkey.",tr:"Oludeniz, Türkiye'de tanınmış bir base jumping lokasyonudur.",de:"Oludeniz ist ein bekannter Base-Jumping-Standort in der Türkei.",ru:"Олюдениз — известное место для бэйс-джампинга в Турции."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/base-jump'),
    openGraph: { url: localeUrl(locale, '/base-jump'), description: (d as any)[locale] || d.en, images: ['https://www.atmosparagliding.com/opengraph-image'] },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "Why Is Ölüdeniz a Well-Known Base Jumping Location?", "ps": ["The limestone cliffs around Babadağ and Butterfly Valley have attracted base jumpers since the 1990s, offering exits of varying heights and aspects with the option of a safe water landing in the bay below."]}, {"h2": "What Permits Do You Need to Base Jump in Turkey?", "ps": ["All base jumping in Turkey requires permits from SHGM (the Turkish Civil Aviation Authority) and local municipality approval. Requirements are reviewed periodically, so always confirm current status before planning a trip — see our permissions guide for details."]}, {"h2": "Where Do Local Jumpers Use as Exit Points?", "ps": ["Established exits are found around the Babadağ cliffs and Butterfly Valley — see our exit points guide for specifics on height, aspect and landing options."]}, {"h2": "How Do You Connect with the Local Community?", "ps": ["We don't operate base jumping as a commercial activity ourselves, but we support the local community and can put visiting jumpers in touch with current contacts, permit status and site information."]}], "faqTitle": "FAQ – Base Jumping in Ölüdeniz", "faqs": [{"q": "Does Atmos Paragliding organise base jumps?", "a": "No — we focus on tandem and solo paragliding. We do support the local base jumping community and can share information and contacts."}, {"q": "Do I need a permit to base jump near Babadağ?", "a": "Yes, permits from SHGM and local authorities are required for all base jumping in Turkey. Contact us before your trip for the current requirements."}, {"q": "Is there water landing access?", "a": "Yes, several exits around the bay allow a water landing as an option, which is part of what makes the area popular with visiting jumpers."}], "relatedTitle": "Base Jumping Resources", "related": [{"href": "/base-jump/exit-points", "label": "Exit Points"}, {"href": "/base-jump/permissions", "label": "Permits & Regulations"}, {"href": "/base-jump/community", "label": "Local Community"}, {"href": "/contact", "label": "Contact Us"}]}, "tr": {"sections": [{"h2": "Ölüdeniz Neden Bilinen Bir Base Jumping Lokasyonu?", "ps": ["Babadağ ve Kelebek Vadisi çevresindeki kireçtaşı kayalıklar 1990'lardan beri base jumper'ları çekiyor; farklı yükseklik ve yönlerde çıkışlar ve aşağıdaki körfeze güvenli su inişi seçeneği sunuyor."]}, {"h2": "Türkiye'de Base Jump İçin Hangi İzinler Gerekli?", "ps": ["Türkiye'de tüm base jumping faaliyetleri SHGM (Sivil Havacılık Genel Müdürlüğü) ve yerel belediye onayı gerektirir. Gereksinimler periyodik olarak gözden geçirilir, bu yüzden seyahat planlamadan önce güncel durumu her zaman teyit edin — detaylar için izinler rehberimize bakın."]}, {"h2": "Yerel Jumper'lar Hangi Çıkış Noktalarını Kullanıyor?", "ps": ["Yerleşik çıkışlar Babadağ kayalıkları ve Kelebek Vadisi çevresinde bulunur — yükseklik, yön ve iniş seçenekleri için çıkış noktaları rehberimize bakın."]}, {"h2": "Yerel Toplulukla Nasıl Bağlantı Kurulur?", "ps": ["Base jumping'i kendimiz ticari bir faaliyet olarak işletmiyoruz, ancak yerel topluluğu destekliyoruz ve ziyaretçi jumper'ları güncel kişilerle, izin durumuyla ve saha bilgisiyle buluşturabiliriz."]}], "faqTitle": "SSS – Ölüdeniz'de Base Jumping", "faqs": [{"q": "Atmos Paragliding base jump organize ediyor mu?", "a": "Hayır — biz tandem ve solo yamaç paraşütüne odaklanıyoruz. Yerel base jumping topluluğunu destekliyor, bilgi ve kişi paylaşabiliyoruz."}, {"q": "Babadağ yakınında base jump için izin gerekli mi?", "a": "Evet, Türkiye'de tüm base jumping faaliyetleri için SHGM ve yerel makamlardan izin gereklidir. Güncel gereksinimler için seyahatinizden önce bize ulaşın."}, {"q": "Su inişi imkanı var mı?", "a": "Evet, körfez çevresindeki birçok çıkış su inişi seçeneği sunar; bu da bölgeyi ziyaretçi jumper'lar arasında popüler kılan unsurlardan biridir."}], "relatedTitle": "Base Jumping Kaynakları", "related": [{"href": "/base-jump/exit-points", "label": "Çıkış Noktaları"}, {"href": "/base-jump/permissions", "label": "İzinler ve Mevzuat"}, {"href": "/base-jump/community", "label": "Yerel Topluluk"}, {"href": "/contact", "label": "Bize Ulaşın"}]}, "de": {"sections": [{"h2": "Warum ist Ölüdeniz ein bekannter Base-Jumping-Standort?", "ps": ["Die Kalksteinklippen rund um den Babadağ und das Schmetterlingstal ziehen seit den 1990er-Jahren Base-Jumper an und bieten Absprungpunkte unterschiedlicher Höhe und Ausrichtung mit der Option einer sicheren Wasserlandung in der Bucht darunter."]}, {"h2": "Welche Genehmigungen braucht man für Base-Jumping in der Türkei?", "ps": ["Jegliches Base-Jumping in der Türkei erfordert Genehmigungen der SHGM (türkische Zivilluftfahrtbehörde) sowie die Zustimmung der lokalen Gemeinde. Die Anforderungen werden regelmäßig überprüft — bestätigen Sie daher vor der Reiseplanung immer den aktuellen Stand; Details in unserem Genehmigungsleitfaden."]}, {"h2": "Welche Absprungpunkte nutzen lokale Jumper?", "ps": ["Etablierte Absprungpunkte finden sich rund um die Babadağ-Klippen und das Schmetterlingstal — Details zu Höhe, Ausrichtung und Landeoptionen in unserem Leitfaden zu Absprungpunkten."]}, {"h2": "Wie kommt man mit der lokalen Community in Kontakt?", "ps": ["Wir betreiben Base-Jumping nicht selbst kommerziell, unterstützen aber die lokale Community und können Besucher mit aktuellen Kontakten, dem Genehmigungsstatus und Standortinformationen verbinden."]}], "faqTitle": "FAQ – Base-Jumping in Ölüdeniz", "faqs": [{"q": "Organisiert Atmos Paragliding Base-Jumps?", "a": "Nein — wir konzentrieren uns auf Tandem- und Solo-Paragliding. Wir unterstützen die lokale Base-Jumping-Community und teilen gerne Informationen und Kontakte."}, {"q": "Brauche ich eine Genehmigung für Base-Jumping am Babadağ?", "a": "Ja, Genehmigungen der SHGM und lokaler Behörden sind für jegliches Base-Jumping in der Türkei erforderlich. Kontaktieren Sie uns vor Ihrer Reise für die aktuellen Anforderungen."}, {"q": "Gibt es Zugang für Wasserlandungen?", "a": "Ja, mehrere Absprungpunkte rund um die Bucht ermöglichen eine Wasserlandung — das macht das Gebiet bei Besuchern besonders beliebt."}], "relatedTitle": "Base-Jumping-Ressourcen", "related": [{"href": "/base-jump/exit-points", "label": "Absprungpunkte"}, {"href": "/base-jump/permissions", "label": "Genehmigungen & Vorschriften"}, {"href": "/base-jump/community", "label": "Lokale Community"}, {"href": "/contact", "label": "Kontakt"}]}, "ru": {"sections": [{"h2": "Почему Олюдениз известен как место для бэйс-джампинга?", "ps": ["Известняковые скалы вокруг Бабадага и Долины Бабочек привлекают бэйс-джамперов с 1990-х годов, предлагая точки прыжка разной высоты и ориентации с возможностью безопасной посадки на воду в заливе внизу."]}, {"h2": "Какие разрешения нужны для бэйс-джампинга в Турции?", "ps": ["Любой бэйс-джампинг в Турции требует разрешений SHGM (Главного управления гражданской авиации Турции) и одобрения местных властей. Требования периодически пересматриваются, поэтому всегда уточняйте актуальный статус перед планированием поездки — подробности в нашем гиде по разрешениям."]}, {"h2": "Какие точки прыжка используют местные джамперы?", "ps": ["Устоявшиеся точки прыжка находятся вокруг скал Бабадага и Долины Бабочек — подробности о высоте, ориентации и вариантах посадки в нашем гиде по точкам прыжка."]}, {"h2": "Как связаться с местным сообществом?", "ps": ["Мы сами не занимаемся бэйс-джампингом коммерчески, но поддерживаем местное сообщество и можем связать приезжих джамперов с актуальными контактами, статусом разрешений и информацией о местах."]}], "faqTitle": "FAQ – бэйс-джампинг в Олюденизе", "faqs": [{"q": "Организует ли Atmos Paragliding бэйс-джампы?", "a": "Нет — мы специализируемся на тандемном и соло-парапланеризме. Мы поддерживаем местное сообщество бэйс-джамперов и делимся информацией и контактами."}, {"q": "Нужно ли разрешение для бэйс-джампинга возле Бабадага?", "a": "Да, для любого бэйс-джампинга в Турции требуются разрешения SHGM и местных властей. Свяжитесь с нами перед поездкой для уточнения актуальных требований."}, {"q": "Есть ли возможность посадки на воду?", "a": "Да, несколько точек прыжка вокруг залива позволяют приземлиться на воду — это одна из причин популярности региона среди приезжих джамперов."}], "relatedTitle": "Ресурсы по бэйс-джампингу", "related": [{"href": "/base-jump/exit-points", "label": "Точки прыжка"}, {"href": "/base-jump/permissions", "label": "Разрешения и регламент"}, {"href": "/base-jump/community", "label": "Местное сообщество"}, {"href": "/contact", "label": "Связаться с нами"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'baseJump' })
  const titles = {en:"Base Jumping Oludeniz",tr:"Oludeniz Base Jumping",de:"Base-Jumping Oludeniz",ru:"Бэйс-джампинг Олюдениз"}
  const subs = {en:"Oludeniz is a renowned base jumping location in Turkey.",tr:"Oludeniz, Türkiye'de tanınmış bir base jumping lokasyonudur.",de:"Oludeniz ist ein bekannter Base-Jumping-Standort in der Türkei.",ru:"Олюдениз — известное место для бэйс-джампинга в Турции."}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"Article\", \"headline\": \"Base Jumping in Oludeniz\", \"description\": \"Guide to base jumping from Babada\\u011f Mountain in Oludeniz, Turkey.\", \"url\": \"https://www.atmosparagliding.com/base-jump\", \"author\": {\"@type\": \"Person\", \"name\": \"Ceyhun\", \"url\": \"https://www.atmosparagliding.com/en/about-us\"}, \"publisher\": {\"@type\": \"Organization\", \"name\": \"Atmos Paragliding\", \"url\": \"https://www.atmosparagliding.com\"}}" }} />
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
