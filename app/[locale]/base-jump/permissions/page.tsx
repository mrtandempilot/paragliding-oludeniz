import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Base Jump Permits Turkey",tr:"Türkiye Base Jump İzinleri",de:"Base Jump Permits Turkey",ru:"Base Jump Permits Turkey"}
  const d = {en:"Information for base jumping at Oludeniz.",tr:"Oludeniz'de base jumping bilgileri.",de:"Informationen zum Base-Jumping in Oludeniz.",ru:"Информация о бэйс-джампинге в Олюдениз."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/base-jump/permissions'),
    openGraph: { url: localeUrl(locale, '/base-jump/permissions'), description: (d as any)[locale] || d.en, images: ['https://www.atmosparagliding.com/base-jump/opengraph-image'] },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "What Permits Does Turkish Law Require for Base Jumping?", "ps": ["Base jumping in Turkey requires permits from the Turkish Civil Aviation Authority (SHGM) along with local municipality approval. This applies to every jump, regardless of exit point or experience level."]}, {"h2": "How Do Requirements Change Over Time?", "ps": ["Permit requirements and the approval process are reviewed periodically by the authorities, so information that was accurate last season may not be current. Always confirm the latest requirements directly before planning a trip."]}, {"h2": "How Can Atmos Paragliding Help?", "ps": ["We don't operate base jumping commercially ourselves, but as a licensed aviation operator based at Babadağ, we can point you toward current permit information and connect you with the local jumping community."]}], "faqTitle": "FAQ – Base Jump Permits in Turkey", "faqs": [{"q": "Can I base jump without a permit?", "a": "No — SHGM and local municipality approval are required for all base jumping activity in Turkey."}, {"q": "How far in advance should I apply?", "a": "This varies and can take time, so it's best to start the process well before your trip and confirm current timelines directly with the relevant authority."}, {"q": "Who can I contact for current permit status?", "a": "Reach out to us via WhatsApp or contact — we can point you to the latest information and local contacts."}], "relatedTitle": "More on Base Jumping", "related": [{"href": "/base-jump", "label": "Base Jumping Overview"}, {"href": "/base-jump/exit-points", "label": "Exit Points"}, {"href": "/base-jump/community", "label": "Local Community"}, {"href": "/contact", "label": "Contact Us"}]}, "tr": {"sections": [{"h2": "Türk Hukuku Base Jump İçin Hangi İzinleri Şart Koşuyor?", "ps": ["Türkiye'de base jumping, SHGM (Sivil Havacılık Genel Müdürlüğü) izni ile birlikte yerel belediye onayı gerektirir. Bu, çıkış noktası veya tecrübe seviyesi ne olursa olsun her atlayış için geçerlidir."]}, {"h2": "Gereksinimler Zamanla Nasıl Değişiyor?", "ps": ["İzin gereksinimleri ve onay süreci yetkililer tarafından periyodik olarak gözden geçirilir; bu yüzden geçen sezon doğru olan bilgi güncel olmayabilir. Seyahat planlamadan önce en güncel gereksinimleri her zaman doğrudan teyit edin."]}, {"h2": "Atmos Paragliding Nasıl Yardımcı Olabilir?", "ps": ["Base jumping'i kendimiz ticari olarak işletmiyoruz, ancak Babadağ merkezli lisanslı bir havacılık işletmesi olarak sizi güncel izin bilgisine yönlendirebilir ve yerel atlayış topluluğuyla buluşturabiliriz."]}], "faqTitle": "SSS – Türkiye'de Base Jump İzinleri", "faqs": [{"q": "İzinsiz base jump yapabilir miyim?", "a": "Hayır — Türkiye'deki tüm base jumping faaliyetleri için SHGM ve yerel belediye onayı gereklidir."}, {"q": "Ne kadar önceden başvurmalıyım?", "a": "Bu değişkenlik gösterir ve zaman alabilir, bu yüzden sürece seyahatinizden çok önce başlamak ve güncel süreleri ilgili makamla doğrudan teyit etmek en iyisidir."}, {"q": "Güncel izin durumu için kiminle iletişime geçebilirim?", "a": "WhatsApp veya iletişim üzerinden bize ulaşın — sizi en güncel bilgiye ve yerel kişilere yönlendirebiliriz."}], "relatedTitle": "Base Jumping Hakkında Daha Fazlası", "related": [{"href": "/base-jump", "label": "Base Jumping Genel Bakış"}, {"href": "/base-jump/exit-points", "label": "Çıkış Noktaları"}, {"href": "/base-jump/community", "label": "Yerel Topluluk"}, {"href": "/contact", "label": "Bize Ulaşın"}]}, "de": {"sections": [{"h2": "Welche Genehmigungen schreibt das türkische Recht für Base-Jumping vor?", "ps": ["Base-Jumping in der Türkei erfordert eine Genehmigung der türkischen Zivilluftfahrtbehörde (SHGM) sowie die Zustimmung der lokalen Gemeinde. Dies gilt für jeden Sprung, unabhängig vom Absprungpunkt oder Erfahrungsstand."]}, {"h2": "Wie ändern sich die Anforderungen im Laufe der Zeit?", "ps": ["Genehmigungsanforderungen und das Antragsverfahren werden von den Behörden regelmäßig überprüft — Informationen, die letzte Saison korrekt waren, sind möglicherweise nicht mehr aktuell. Bestätigen Sie vor der Reiseplanung immer die neuesten Anforderungen direkt."]}, {"h2": "Wie kann Atmos Paragliding helfen?", "ps": ["Wir betreiben Base-Jumping nicht selbst kommerziell, können Sie aber als lizenzierter Luftfahrtbetrieb am Babadağ auf aktuelle Genehmigungsinformationen hinweisen und mit der lokalen Jumping-Community verbinden."]}], "faqTitle": "FAQ – Base-Jump-Genehmigungen in der Türkei", "faqs": [{"q": "Kann ich ohne Genehmigung Base-Jumping betreiben?", "a": "Nein — für jegliche Base-Jumping-Aktivität in der Türkei sind eine SHGM-Genehmigung und die Zustimmung der lokalen Gemeinde erforderlich."}, {"q": "Wie weit im Voraus sollte ich den Antrag stellen?", "a": "Das ist unterschiedlich und kann Zeit in Anspruch nehmen — starten Sie den Prozess am besten deutlich vor Ihrer Reise und bestätigen Sie aktuelle Fristen direkt bei der zuständigen Behörde."}, {"q": "An wen kann ich mich für den aktuellen Genehmigungsstatus wenden?", "a": "Kontaktieren Sie uns per WhatsApp oder über unser Kontaktformular — wir verweisen Sie gerne auf die aktuellsten Informationen und lokale Kontakte."}], "relatedTitle": "Mehr zum Base-Jumping", "related": [{"href": "/base-jump", "label": "Base-Jumping Übersicht"}, {"href": "/base-jump/exit-points", "label": "Absprungpunkte"}, {"href": "/base-jump/community", "label": "Lokale Community"}, {"href": "/contact", "label": "Kontakt"}]}, "ru": {"sections": [{"h2": "Какие разрешения требует турецкое законодательство для бэйс-джампинга?", "ps": ["Бэйс-джампинг в Турции требует разрешения от Главного управления гражданской авиации Турции (SHGM) вместе с одобрением местных властей. Это касается каждого прыжка, независимо от точки прыжка или уровня опыта."]}, {"h2": "Как требования меняются со временем?", "ps": ["Требования к разрешениям и процесс одобрения периодически пересматриваются властями, поэтому информация, актуальная в прошлом сезоне, может устареть. Всегда уточняйте последние требования напрямую перед планированием поездки."]}, {"h2": "Чем может помочь Atmos Paragliding?", "ps": ["Мы сами не занимаемся бэйс-джампингом коммерчески, но как лицензированный авиационный оператор, базирующийся на Бабадаге, можем указать вам актуальную информацию о разрешениях и связать с местным сообществом джамперов."]}], "faqTitle": "FAQ – разрешения на бэйс-джампинг в Турции", "faqs": [{"q": "Могу ли я прыгать без разрешения?", "a": "Нет — для любой деятельности по бэйс-джампингу в Турции требуется одобрение SHGM и местных властей."}, {"q": "За сколько времени нужно подавать заявку?", "a": "Это варьируется и может занять время, поэтому лучше начать процесс задолго до поездки и уточнить актуальные сроки напрямую у соответствующего органа."}, {"q": "К кому обратиться за актуальным статусом разрешения?", "a": "Свяжитесь с нами через WhatsApp или контактную форму — мы подскажем актуальную информацию и местные контакты."}], "relatedTitle": "Больше о бэйс-джампинге", "related": [{"href": "/base-jump", "label": "Обзор бэйс-джампинга"}, {"href": "/base-jump/exit-points", "label": "Точки прыжка"}, {"href": "/base-jump/community", "label": "Местное сообщество"}, {"href": "/contact", "label": "Связаться с нами"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'baseJump' })
  const titles = {en:"Base Jump Permits Turkey",tr:"Türkiye Base Jump İzinleri",de:"Base Jump Permits Turkey",ru:"Base Jump Permits Turkey"}
  const subs = {en:"Information for base jumping at Oludeniz.",tr:"Oludeniz'de base jumping bilgileri.",de:"Informationen zum Base-Jumping in Oludeniz.",ru:"Информация о бэйс-джампинге в Олюдениз."}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"Article\", \"headline\": \"Base Jump Permissions Turkey\", \"description\": \"Permissions and regulations for base jumping in Turkey and around Babada\\u011f.\", \"url\": \"https://www.atmosparagliding.com/base-jump/permissions\", \"author\": {\"@type\": \"Person\", \"name\": \"Ceyhun\", \"url\": \"https://www.atmosparagliding.com/en/about-us\"}, \"publisher\": {\"@type\": \"Organization\", \"name\": \"Atmos Paragliding\", \"url\": \"https://www.atmosparagliding.com\"}}" }} />
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
