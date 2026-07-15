import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Base Jump Exit Points Oludeniz",tr:"Oludeniz Base Jump Çıkış Noktaları",de:"Base Jump Exit Points Oludeniz",ru:"Base Jump Exit Points Oludeniz"}
  const d = {en:"Information for base jumping at Oludeniz.",tr:"Oludeniz'de base jumping bilgileri.",de:"Informationen zum Base-Jumping in Oludeniz.",ru:"Информация о бэйс-джампинге в Олюдениз."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/base-jump/exit-points'),
    openGraph: { url: localeUrl(locale, '/base-jump/exit-points'), description: (d as any)[locale] || d.en, images: ['https://www.atmosparagliding.com/base-jump/opengraph-image'] },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "What Exit Points Are Used Around Ölüdeniz?", "ps": ["Established exits are found on the limestone cliffs around Babadağ and Butterfly Valley, at a range of heights and aspects. Exact site conditions and access change over time, so always confirm current status locally before a jump."]}, {"h2": "What Should You Check Before Choosing an Exit?", "ps": ["Wind direction and strength, cliff aspect, and landing zone conditions all vary between exits — factors best assessed on-site with current local knowledge rather than from a guide alone. Water landings are available at some sites in the bay below."]}], "faqTitle": "FAQ – Base Jump Exit Points", "faqs": [{"q": "Are exit points marked or maintained?", "a": "Conditions vary by site and season. Connect with the local community or contact us for current, on-the-ground information before planning a jump."}, {"q": "Can I land in the water?", "a": "Several exits around the bay offer a water landing option, which is part of what makes the area attractive to visiting jumpers."}, {"q": "Do I need a permit for a specific exit point?", "a": "Yes — all base jumping in Turkey requires SHGM and local permits regardless of which exit you use. See our permissions guide."}], "relatedTitle": "More on Base Jumping", "related": [{"href": "/base-jump", "label": "Base Jumping Overview"}, {"href": "/base-jump/permissions", "label": "Permits & Regulations"}, {"href": "/base-jump/community", "label": "Local Community"}, {"href": "/contact", "label": "Contact Us"}]}, "tr": {"sections": [{"h2": "Ölüdeniz Çevresinde Hangi Çıkış Noktaları Kullanılıyor?", "ps": ["Yerleşik çıkışlar Babadağ ve Kelebek Vadisi çevresindeki kireçtaşı kayalıklarda, çeşitli yükseklik ve yönlerde bulunur. Tam saha koşulları ve erişim zamanla değişir, bu yüzden atlayış öncesi güncel durumu her zaman yerel olarak teyit edin."]}, {"h2": "Çıkış Seçmeden Önce Neler Kontrol Edilmeli?", "ps": ["Rüzgar yönü ve şiddeti, kayalık yönü ve iniş bölgesi koşulları çıkışlar arasında değişir — bu faktörler sadece bir rehberden değil, güncel yerel bilgiyle sahada değerlendirilmelidir. Bazı sahalarda aşağıdaki körfeze su inişi imkanı vardır."]}], "faqTitle": "SSS – Base Jump Çıkış Noktaları", "faqs": [{"q": "Çıkış noktaları işaretli veya bakımlı mı?", "a": "Koşullar sahaya ve mevsime göre değişir. Atlayış planlamadan önce güncel, sahadaki bilgi için yerel toplulukla bağlantı kurun veya bize ulaşın."}, {"q": "Suya iniş yapabilir miyim?", "a": "Körfez çevresindeki birçok çıkış su inişi seçeneği sunar; bu da bölgeyi ziyaretçi jumper'lar için cazip kılan unsurlardan biridir."}, {"q": "Belirli bir çıkış noktası için izin gerekli mi?", "a": "Evet — hangi çıkışı kullanırsanız kullanın, Türkiye'de tüm base jumping SHGM ve yerel izinler gerektirir. İzinler rehberimize bakın."}], "relatedTitle": "Base Jumping Hakkında Daha Fazlası", "related": [{"href": "/base-jump", "label": "Base Jumping Genel Bakış"}, {"href": "/base-jump/permissions", "label": "İzinler ve Mevzuat"}, {"href": "/base-jump/community", "label": "Yerel Topluluk"}, {"href": "/contact", "label": "Bize Ulaşın"}]}, "de": {"sections": [{"h2": "Welche Absprungpunkte werden rund um Ölüdeniz genutzt?", "ps": ["Etablierte Absprungpunkte finden sich an den Kalksteinklippen rund um den Babadağ und das Schmetterlingstal, in unterschiedlichen Höhen und Ausrichtungen. Genaue Standortbedingungen und Zugang ändern sich mit der Zeit — bestätigen Sie daher vor einem Sprung immer den aktuellen Stand vor Ort."]}, {"h2": "Was sollten Sie vor der Wahl eines Absprungpunkts prüfen?", "ps": ["Windrichtung und -stärke, Ausrichtung der Klippe und Bedingungen der Landezone variieren zwischen den Absprungpunkten — Faktoren, die am besten vor Ort mit aktuellem lokalem Wissen beurteilt werden, nicht allein anhand eines Leitfadens. An einigen Standorten ist eine Wasserlandung in der Bucht darunter möglich."]}], "faqTitle": "FAQ – Base-Jump-Absprungpunkte", "faqs": [{"q": "Sind Absprungpunkte markiert oder gepflegt?", "a": "Die Bedingungen variieren je nach Standort und Saison. Nehmen Sie vor der Planung eines Sprungs Kontakt zur lokalen Community auf oder kontaktieren Sie uns für aktuelle Informationen vor Ort."}, {"q": "Kann ich im Wasser landen?", "a": "Mehrere Absprungpunkte rund um die Bucht bieten eine Wasserlandungsoption — das macht das Gebiet bei Besuchern besonders attraktiv."}, {"q": "Brauche ich für einen bestimmten Absprungpunkt eine Genehmigung?", "a": "Ja — unabhängig vom genutzten Absprungpunkt ist für jegliches Base-Jumping in der Türkei eine SHGM- und Lokalgenehmigung erforderlich. Siehe unseren Genehmigungsleitfaden."}], "relatedTitle": "Mehr zum Base-Jumping", "related": [{"href": "/base-jump", "label": "Base-Jumping Übersicht"}, {"href": "/base-jump/permissions", "label": "Genehmigungen & Vorschriften"}, {"href": "/base-jump/community", "label": "Lokale Community"}, {"href": "/contact", "label": "Kontakt"}]}, "ru": {"sections": [{"h2": "Какие точки прыжка используются вокруг Олюдениза?", "ps": ["Устоявшиеся точки прыжка находятся на известняковых скалах вокруг Бабадага и Долины Бабочек, на разной высоте и с разной ориентацией. Точные условия и доступ на местах меняются со временем, поэтому всегда уточняйте актуальный статус на месте перед прыжком."]}, {"h2": "Что стоит проверить перед выбором точки прыжка?", "ps": ["Направление и сила ветра, ориентация скалы и условия зоны приземления различаются между точками — эти факторы лучше оценивать на месте с актуальными местными знаниями, а не только по гиду. На некоторых площадках возможна посадка на воду в заливе внизу."]}], "faqTitle": "FAQ – точки прыжка для бэйс-джампинга", "faqs": [{"q": "Отмечены ли точки прыжка или поддерживаются ли они?", "a": "Условия варьируются в зависимости от площадки и сезона. Свяжитесь с местным сообществом или с нами для получения актуальной информации на месте перед планированием прыжка."}, {"q": "Могу ли я приземлиться на воду?", "a": "Несколько точек прыжка вокруг залива предлагают вариант посадки на воду — это одна из причин привлекательности региона для приезжих джамперов."}, {"q": "Нужно ли разрешение для конкретной точки прыжка?", "a": "Да — независимо от используемой точки прыжка, для любого бэйс-джампинга в Турции требуются разрешения SHGM и местных властей. См. наш гид по разрешениям."}], "relatedTitle": "Больше о бэйс-джампинге", "related": [{"href": "/base-jump", "label": "Обзор бэйс-джампинга"}, {"href": "/base-jump/permissions", "label": "Разрешения и регламент"}, {"href": "/base-jump/community", "label": "Местное сообщество"}, {"href": "/contact", "label": "Связаться с нами"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'baseJump' })
  const titles = {en:"Base Jump Exit Points Oludeniz",tr:"Oludeniz Base Jump Çıkış Noktaları",de:"Base Jump Exit Points Oludeniz",ru:"Base Jump Exit Points Oludeniz"}
  const subs = {en:"Information for base jumping at Oludeniz.",tr:"Oludeniz'de base jumping bilgileri.",de:"Informationen zum Base-Jumping in Oludeniz.",ru:"Информация о бэйс-джампинге в Олюдениз."}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"Article\", \"headline\": \"Base Jump Exit Points Oludeniz\", \"description\": \"Base jumping exit points around Babada\\u011f Mountain and Oludeniz.\", \"url\": \"https://www.atmosparagliding.com/base-jump/exit-points\", \"author\": {\"@type\": \"Person\", \"name\": \"Ceyhun\", \"url\": \"https://www.atmosparagliding.com/en/about-us\"}, \"publisher\": {\"@type\": \"Organization\", \"name\": \"Atmos Paragliding\", \"url\": \"https://www.atmosparagliding.com\"}}" }} />
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
