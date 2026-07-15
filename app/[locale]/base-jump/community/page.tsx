import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Base Jump Community Oludeniz",tr:"Oludeniz Base Jump Topluluğu",de:"Base Jump Community Oludeniz",ru:"Base Jump Community Oludeniz"}
  const d = {en:"Information for base jumping at Oludeniz.",tr:"Oludeniz'de base jumping bilgileri.",de:"Informationen zum Base-Jumping in Oludeniz.",ru:"Информация о бэйс-джампинге в Олюдениз."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/base-jump/community'),
    openGraph: { url: localeUrl(locale, '/base-jump/community'), description: (d as any)[locale] || d.en, images: ['https://www.atmosparagliding.com/base-jump/opengraph-image'] },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "Is There an Active Base Jumping Community in Ölüdeniz?", "ps": ["Yes — a small but active community has grown around the Babadağ cliffs and Butterfly Valley since the 1990s, drawn by the combination of varied exits and safe water landings in the bay."]}, {"h2": "How Can Visiting Jumpers Connect Locally?", "ps": ["The community shares information on current conditions, permit status and exit access informally among members. As a licensed operator based at Babadağ, we can help put visiting jumpers in touch — reach out via WhatsApp or our contact page."]}], "faqTitle": "FAQ – Base Jump Community", "faqs": [{"q": "How do I meet local base jumpers?", "a": "Contact us and we'll help connect you with current community contacts and up-to-date site information."}, {"q": "Is the community only for experienced jumpers?", "a": "The community is generally made up of experienced jumpers given the permit and skill requirements involved, but newcomers are welcome to reach out for information."}], "relatedTitle": "More on Base Jumping", "related": [{"href": "/base-jump", "label": "Base Jumping Overview"}, {"href": "/base-jump/exit-points", "label": "Exit Points"}, {"href": "/base-jump/permissions", "label": "Permits & Regulations"}, {"href": "/contact", "label": "Contact Us"}]}, "tr": {"sections": [{"h2": "Ölüdeniz'de Aktif Bir Base Jumping Topluluğu Var mı?", "ps": ["Evet — 1990'lardan bu yana Babadağ kayalıkları ve Kelebek Vadisi çevresinde küçük ama aktif bir topluluk oluştu; çeşitli çıkışlar ve körfezde güvenli su inişi imkanının birleşimi bu topluluğu çekiyor."]}, {"h2": "Ziyaretçi Jumper'lar Yerel Olarak Nasıl Bağlantı Kurabilir?", "ps": ["Topluluk, güncel koşullar, izin durumu ve çıkış erişimi hakkında bilgiyi üyeler arasında gayri resmi olarak paylaşıyor. Babadağ merkezli lisanslı bir işletme olarak ziyaretçi jumper'ları buluşturmaya yardımcı olabiliriz — WhatsApp veya iletişim sayfamız üzerinden ulaşın."]}], "faqTitle": "SSS – Base Jump Topluluğu", "faqs": [{"q": "Yerel base jumper'larla nasıl tanışabilirim?", "a": "Bize ulaşın, güncel topluluk kişileriyle ve saha bilgisiyle sizi buluşturmaya yardımcı olalım."}, {"q": "Topluluk sadece tecrübeli jumper'lar için mi?", "a": "İzin ve beceri gereksinimleri nedeniyle topluluk genellikle tecrübeli jumper'lardan oluşur, ancak yeni başlayanlar da bilgi almak için bize ulaşabilir."}], "relatedTitle": "Base Jumping Hakkında Daha Fazlası", "related": [{"href": "/base-jump", "label": "Base Jumping Genel Bakış"}, {"href": "/base-jump/exit-points", "label": "Çıkış Noktaları"}, {"href": "/base-jump/permissions", "label": "İzinler ve Mevzuat"}, {"href": "/contact", "label": "Bize Ulaşın"}]}, "de": {"sections": [{"h2": "Gibt es eine aktive Base-Jumping-Community in Ölüdeniz?", "ps": ["Ja — seit den 1990er-Jahren ist rund um die Babadağ-Klippen und das Schmetterlingstal eine kleine, aber aktive Community entstanden, angezogen von der Kombination aus vielfältigen Absprungpunkten und sicheren Wasserlandungen in der Bucht."]}, {"h2": "Wie können Besucher lokal Kontakt aufnehmen?", "ps": ["Die Community teilt Informationen zu aktuellen Bedingungen, Genehmigungsstatus und Zugang zu Absprungpunkten informell untereinander. Als lizenzierter Betrieb am Babadağ können wir besuchende Jumper mit der Community in Kontakt bringen — schreiben Sie uns per WhatsApp oder über unser Kontaktformular."]}], "faqTitle": "FAQ – Base-Jump-Community", "faqs": [{"q": "Wie lerne ich lokale Base-Jumper kennen?", "a": "Kontaktieren Sie uns, und wir helfen Ihnen, aktuelle Community-Kontakte und Standortinformationen zu finden."}, {"q": "Ist die Community nur für erfahrene Jumper?", "a": "Aufgrund der Genehmigungs- und Könnensanforderungen besteht die Community überwiegend aus erfahrenen Jumpern, aber Neulinge können sich gerne für Informationen melden."}], "relatedTitle": "Mehr zum Base-Jumping", "related": [{"href": "/base-jump", "label": "Base-Jumping Übersicht"}, {"href": "/base-jump/exit-points", "label": "Absprungpunkte"}, {"href": "/base-jump/permissions", "label": "Genehmigungen & Vorschriften"}, {"href": "/contact", "label": "Kontakt"}]}, "ru": {"sections": [{"h2": "Есть ли активное сообщество бэйс-джамперов в Олюденизе?", "ps": ["Да — с 1990-х годов вокруг скал Бабадага и Долины Бабочек сформировалось небольшое, но активное сообщество, привлечённое сочетанием разнообразных точек прыжка и безопасной посадки на воду в заливе."]}, {"h2": "Как приезжие джамперы могут наладить контакты на месте?", "ps": ["Сообщество неформально делится информацией об актуальных условиях, статусе разрешений и доступе к точкам прыжка между участниками. Как лицензированный оператор на Бабадаге, мы можем связать приезжих джамперов с сообществом — напишите нам через WhatsApp или контактную форму."]}], "faqTitle": "FAQ – сообщество бэйс-джамперов", "faqs": [{"q": "Как познакомиться с местными бэйс-джамперами?", "a": "Свяжитесь с нами, и мы поможем связать вас с актуальными контактами сообщества и информацией о площадках."}, {"q": "Сообщество только для опытных джамперов?", "a": "Из-за требований к разрешениям и навыкам сообщество состоит в основном из опытных джамперов, но новичкам тоже рады — обращайтесь за информацией."}], "relatedTitle": "Больше о бэйс-джампинге", "related": [{"href": "/base-jump", "label": "Обзор бэйс-джампинга"}, {"href": "/base-jump/exit-points", "label": "Точки прыжка"}, {"href": "/base-jump/permissions", "label": "Разрешения и регламент"}, {"href": "/contact", "label": "Связаться с нами"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'baseJump' })
  const titles = {en:"Base Jump Community Oludeniz",tr:"Oludeniz Base Jump Topluluğu",de:"Base Jump Community Oludeniz",ru:"Base Jump Community Oludeniz"}
  const subs = {en:"Information for base jumping at Oludeniz.",tr:"Oludeniz'de base jumping bilgileri.",de:"Informationen zum Base-Jumping in Oludeniz.",ru:"Информация о бэйс-джампинге в Олюдениз."}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"Article\", \"headline\": \"Base Jump Community Oludeniz\", \"description\": \"The base jumping community in Oludeniz \\u2014 events, pilots and resources.\", \"url\": \"https://www.atmosparagliding.com/base-jump/community\", \"author\": {\"@type\": \"Person\", \"name\": \"Ceyhun\", \"url\": \"https://www.atmosparagliding.com/en/about-us\"}, \"publisher\": {\"@type\": \"Organization\", \"name\": \"Atmos Paragliding\", \"url\": \"https://www.atmosparagliding.com\"}}" }} />
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
