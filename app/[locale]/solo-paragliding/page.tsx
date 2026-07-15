import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'solo' })
  const d: Record<string, string> = {"en": "Solo paragliding in Oludeniz: flight rules, equipment requirements, insurance and permissions for licensed pilots flying Babadağ.", "tr": "Ölüdeniz'de solo yamaç paraşütü: lisanslı pilotlar için uçuş kuralları, ekipman gereksinimleri, sigorta ve izinler.", "de": "Solo-Paragliding in Ölüdeniz: Flugregeln, Ausrüstungsanforderungen, Versicherung und Genehmigungen für lizenzierte Piloten.", "ru": "Соло-парапланеризм в Олюденизе: правила полётов, требования к снаряжению, страховка и разрешения для лицензированных пилотов."}
  return {
    description: d[locale] || d.en,
    alternates: localeAlternates(locale, '/solo-paragliding'),
    openGraph: { url: localeUrl(locale, '/solo-paragliding'), description: d[locale] || d.en, images: ['https://www.atmosparagliding.com/solo-paragliding/opengraph-image'] },
    twitter: { card: 'summary_large_image', description: d[locale] || d.en }, title: `${t('title')}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "Why Do Solo and XC Pilots Rate Ölüdeniz So Highly?", "ps": ["Ölüdeniz combines over 300 flying days a year with reliable coastal thermals and four launch points on Babadağ between 1,200m and 1,960m, giving pilots options across a wide range of conditions and experience levels — from relaxed local soaring to serious cross-country lines."]}, {"h2": "What Do You Need to Fly Solo Here?", "ps": ["You'll need your pilot licence/rating, insurance, and to follow local flight rules and airspace restrictions — see our dedicated pages on equipment requirements, flight rules and insurance/permissions for the specifics before you arrive."]}, {"h2": "What Pilot Services Are Available?", "ps": ["Beyond launch access, visiting pilots can arrange equipment hire, meteorology briefings, retrieval after XC flights, radio hire and secure gear storage — everything needed to fly efficiently without bringing or arranging it all yourself."]}], "faqTitle": "FAQ – Solo Paragliding in Ölüdeniz", "faqs": [{"q": "Can any licensed pilot fly solo at Babadağ?", "a": "Yes, provided you meet local requirements around licensing, insurance and site rules — see our flight rules and insurance/permissions pages for full details."}, {"q": "Is retrieval available after cross-country flights?", "a": "Yes, retrieval is one of our pilot services, alongside route briefings and radio hire for visiting XC pilots."}, {"q": "What's the best season for solo flying at Ölüdeniz?", "a": "The season runs April–October, with May–June and September–October offering the most reliable, well-organised thermals for both local soaring and XC."}], "relatedTitle": "Solo Pilot Resources", "related": [{"href": "/solo-paragliding/equipment-requirements", "label": "Equipment Requirements"}, {"href": "/solo-paragliding/flight-rules", "label": "Flight Rules"}, {"href": "/solo-paragliding/insurance-permissions", "label": "Insurance & Permissions"}, {"href": "/cross-country-flights", "label": "Cross Country Flying"}]}, "tr": {"sections": [{"h2": "Solo ve XC Pilotlar Ölüdeniz'i Neden Bu Kadar Yüksek Değerlendiriyor?", "ps": ["Ölüdeniz, yılda 300'den fazla uçuş gününü güvenilir kıyı termikleriyle ve Babadağ'da 1.200m ile 1.960m arasındaki dört kalkış noktasıyla birleştirir; bu da pilotlara rahat yerel süzülmeden ciddi cross-country rotalarına kadar geniş bir yelpazede seçenek sunar."]}, {"h2": "Burada Solo Uçmak İçin Neye İhtiyacınız Var?", "ps": ["Pilot lisansınız/ehliyetiniz, sigortanız olmalı ve yerel uçuş kurallarına ve hava sahası kısıtlamalarına uymalısınız — gelmeden önce detaylar için ekipman gereksinimleri, uçuş kuralları ve sigorta/izinler sayfalarımıza bakın."]}, {"h2": "Hangi Pilot Hizmetleri Mevcut?", "ps": ["Kalkış erişiminin ötesinde, ziyaretçi pilotlar ekipman kiralama, meteoroloji brifingleri, XC uçuşlar sonrası geri alma, telsiz kiralama ve güvenli ekipman depolama ayarlayabilir — hepsini kendiniz getirmeden veya organize etmeden verimli uçmak için gereken her şey."]}], "faqTitle": "SSS – Ölüdeniz'de Solo Yamaç Paraşütü", "faqs": [{"q": "Lisanslı herhangi bir pilot Babadağ'da solo uçabilir mi?", "a": "Evet, lisans, sigorta ve saha kurallarıyla ilgili yerel gereksinimleri karşılamak koşuluyla — tam detaylar için uçuş kuralları ve sigorta/izinler sayfalarımıza bakın."}, {"q": "Cross-country uçuşlar sonrası geri alma hizmeti var mı?", "a": "Evet, geri alma, ziyaretçi XC pilotlar için rota brifingleri ve telsiz kiralamayla birlikte pilot hizmetlerimizden biridir."}, {"q": "Ölüdeniz'de solo uçuş için en iyi sezon hangisi?", "a": "Sezon Nisan-Ekim arasıdır; Mayıs-Haziran ve Eylül-Ekim hem yerel süzülme hem XC için en güvenilir, düzenli termikleri sunar."}], "relatedTitle": "Solo Pilot Kaynakları", "related": [{"href": "/solo-paragliding/equipment-requirements", "label": "Ekipman Gereksinimleri"}, {"href": "/solo-paragliding/flight-rules", "label": "Uçuş Kuralları"}, {"href": "/solo-paragliding/insurance-permissions", "label": "Sigorta ve İzinler"}, {"href": "/cross-country-flights", "label": "Cross Country Uçuşlar"}]}, "de": {"sections": [{"h2": "Warum schätzen Solo- und XC-Piloten Ölüdeniz so hoch ein?", "ps": ["Ölüdeniz vereint über 300 Flugtage pro Jahr mit verlässlicher Küstenthermik und vier Startplätzen am Babadağ zwischen 1.200m und 1.960m — das bietet Piloten Optionen über ein breites Spektrum an Bedingungen und Erfahrungsstufen, von entspanntem lokalem Soaring bis zu ernsthaften Streckenflügen."]}, {"h2": "Was brauchen Sie, um hier solo zu fliegen?", "ps": ["Sie benötigen Ihre Pilotenlizenz, eine Versicherung und müssen die lokalen Flugregeln und Luftraumbeschränkungen einhalten — Details vor der Anreise auf unseren Seiten zu Ausrüstungsanforderungen, Flugregeln und Versicherung/Genehmigungen."]}, {"h2": "Welche Pilotendienste stehen zur Verfügung?", "ps": ["Über den Startzugang hinaus können besuchende Piloten Ausrüstungsverleih, Meteorologie-Briefings, Abholung nach Streckenflügen, Funkgeräteverleih und sichere Ausrüstungslagerung organisieren — alles, um effizient zu fliegen, ohne alles selbst mitzubringen oder zu organisieren."]}], "faqTitle": "FAQ – Solo-Paragliding in Ölüdeniz", "faqs": [{"q": "Kann jeder lizenzierte Pilot solo am Babadağ fliegen?", "a": "Ja, sofern Sie die lokalen Anforderungen zu Lizenzierung, Versicherung und Standortregeln erfüllen — Details auf unseren Seiten zu Flugregeln und Versicherung/Genehmigungen."}, {"q": "Gibt es Abholservice nach Streckenflügen?", "a": "Ja, Abholung ist einer unserer Pilotendienste, zusammen mit Routenbriefings und Funkgeräteverleih für besuchende XC-Piloten."}, {"q": "Welche Saison eignet sich am besten zum Solofliegen in Ölüdeniz?", "a": "Die Saison läuft von April bis Oktober, wobei Mai–Juni und September–Oktober die zuverlässigste, gut organisierte Thermik für lokales Soaring und XC bieten."}], "relatedTitle": "Ressourcen für Solo-Piloten", "related": [{"href": "/solo-paragliding/equipment-requirements", "label": "Ausrüstungsanforderungen"}, {"href": "/solo-paragliding/flight-rules", "label": "Flugregeln"}, {"href": "/solo-paragliding/insurance-permissions", "label": "Versicherung & Genehmigungen"}, {"href": "/cross-country-flights", "label": "Streckenflug (XC)"}]}, "ru": {"sections": [{"h2": "Почему соло- и XC-пилоты так высоко ценят Олюдениз?", "ps": ["Олюдениз сочетает более 300 лётных дней в году со стабильными прибрежными термиками и четырьмя стартовыми площадками на Бабадаге от 1 200м до 1 960м, давая пилотам варианты на любой уровень условий и опыта — от спокойного локального парения до серьёзных маршрутных полётов."]}, {"h2": "Что нужно для соло-полётов здесь?", "ps": ["Вам понадобятся лицензия пилота, страховка, а также соблюдение местных правил полётов и ограничений воздушного пространства — подробности на наших страницах о требованиях к снаряжению, правилах полётов и страховке/разрешениях перед приездом."]}, {"h2": "Какие услуги доступны пилотам?", "ps": ["Помимо доступа к старту, приезжие пилоты могут организовать аренду снаряжения, метео-брифинги, эвакуацию после XC-полётов, аренду раций и надёжное хранение снаряжения — всё необходимое для эффективных полётов без необходимости привозить или организовывать это самостоятельно."]}], "faqTitle": "FAQ – соло-парапланеризм в Олюденизе", "faqs": [{"q": "Может ли любой лицензированный пилот летать соло на Бабадаге?", "a": "Да, при соблюдении местных требований к лицензированию, страховке и правилам площадки — подробности на страницах о правилах полётов и страховке/разрешениях."}, {"q": "Доступна ли эвакуация после маршрутных полётов?", "a": "Да, эвакуация — одна из наших услуг для пилотов, наряду с брифингами по маршрутам и арендой раций для приезжих XC-пилотов."}, {"q": "Какой сезон лучший для соло-полётов в Олюденизе?", "a": "Сезон длится с апреля по октябрь, май–июнь и сентябрь–октябрь дают самые стабильные и предсказуемые термики как для локального парения, так и для XC."}], "relatedTitle": "Ресурсы для соло-пилотов", "related": [{"href": "/solo-paragliding/equipment-requirements", "label": "Требования к снаряжению"}, {"href": "/solo-paragliding/flight-rules", "label": "Правила полётов"}, {"href": "/solo-paragliding/insurance-permissions", "label": "Страховка и разрешения"}, {"href": "/cross-country-flights", "label": "Маршрутные полёты (XC)"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'solo' })
  const linkLabels: Record<string,string> = {"en": "Pilot Services", "tr": "Pilot Hizmetleri", "de": "Pilotendienste", "ru": "Услуги пилотам"}
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  const linkLabel = linkLabels[locale]||linkLabels.en
  const linkHref = locale === 'en' ? '/pilot-services' : `/${locale}/pilot-services`

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"Article\", \"headline\": \"Solo Paragliding in Oludeniz\", \"description\": \"Information for solo paragliding pilots visiting Oludeniz and flying from Babada\\u011f Mountain.\", \"url\": \"https://www.atmosparagliding.com/solo-paragliding\", \"author\": {\"@type\": \"Person\", \"name\": \"Ceyhun\", \"url\": \"https://www.atmosparagliding.com/en/about-us\"}, \"publisher\": {\"@type\": \"Organization\", \"name\": \"Atmos Paragliding\", \"url\": \"https://www.atmosparagliding.com\"}}" }} />
      <PageHero title={t('title')} subtitle={t('subtitle')} badge={t('badge')} bgImage="https://v3b.fal.media/files/b/0a9d7c0d/dOEuj7ebfM-MdyvUcunPD.jpg" />
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3">
          <BreadcrumbNav items={[{ label: t('title') }]} />
        </div>
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
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3">{c.relatedTitle}</h2>
            <ul className="space-y-2">
              {c.related.map((r: any) => (
                <li key={r.href}><Link href={lp(r.href)} className="text-orange-600 hover:underline">{r.label}</Link></li>
              ))}
            </ul>
          </div>
          <div className="pt-2">
            <Link href={linkHref} className="btn-primary">{linkLabel} <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>
      <BookingCTA />
    </>
  )
}
