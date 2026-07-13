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
  const t: Record<string,string> = {en:"Group Paragliding Flights Oludeniz",tr:"Grup Paraşüt Uçuşları",de:"Gruppenflüge Paragliding",ru:"Групповые полёты"}
  const d = {en:"We love groups. From 4 to 40+, we handle everything.",tr:"Grupları seviyoruz. 4\'ten 40\'a kadar her şeyi biz hallederiz.",de:"Wir lieben Gruppen. Von 4 bis 40+, wir übernehmen alles.",ru:"Мы любим группы. От 4 до 40+ человек — всё организуем."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/tandem-paragliding/group-flights'),
    openGraph: { url: localeUrl(locale, '/tandem-paragliding/group-flights'), description: (d as any)[locale] || d.en, images: ['https://www.atmosparagliding.com/opengraph-image'] },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${t[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "Do Groups Get a Discount?", "ps": ["Yes. Groups of 4 or more receive 10% off, and groups of 8 or more receive 15% off. We coordinate all transfers, launch times, and logistics so your group experiences the least possible wait time."]}, {"h2": "What Kinds of Groups Do You Handle?", "ps": ["We accommodate hen parties, stag parties, birthday groups, corporate team days, school trips, and tour operator packages. Each person flies individually with their own certified pilot — you are never more than one wing apart."]}, {"h2": "Can We Fly Together and Watch Each Other?", "ps": ["Yes, we can arrange consecutive launches from the same takeoff point so your group watches each other fly. A dedicated group coordinator handles your booking from start to finish."]}], "faqTitle": "FAQ – Group Flights", "faqs": [{"q": "How do I get a group quote?", "a": "Contact us directly via WhatsApp on +90 536 461 6674 or email info@paragliding-oludeniz.com."}, {"q": "What's the minimum group size for a discount?", "a": "4 people for 10% off, 8 people or more for 15% off."}, {"q": "Do all group members fly at the same time?", "a": "We arrange consecutive launches from the same takeoff point so the group flies close together and can watch each other."}], "relatedTitle": "More on Tandem Paragliding", "related": [{"href": "/groups", "label": "All Group Options"}, {"href": "/tandem-paragliding/first-time", "label": "First Time Flying"}, {"href": "/tandem-paragliding/safety-guide", "label": "Safety Guide"}, {"href": "/tandem-paragliding/sunset-flight", "label": "Sunset Flight"}, {"href": "/tandem-paragliding/group-flights", "label": "Group Flights"}]}, "tr": {"sections": [{"h2": "Gruplara İndirim Var mı?", "ps": ["Evet. 4 veya daha fazla kişilik gruplara %10, 8 veya daha fazla kişilik gruplara %15 indirim uygulanır. Tüm transferleri, kalkış zamanlarını ve lojistiği biz koordine ediyoruz."]}, {"h2": "Hangi Grup Türlerine Hizmet Veriyorsunuz?", "ps": ["Bekarlığa veda partileri, kurumsal etkinlikler, doğum günü grupları, okul gezileri ve tur operatörü paketleri için hizmet veriyoruz. Her kişi kendi sertifikalı pilotuyla bireysel olarak uçar."]}, {"h2": "Birlikte Uçup Birbirimizi İzleyebilir miyiz?", "ps": ["Evet, grubunuzun birbirini uçarken izleyebilmesi için aynı kalkış noktasından ardışık kalkışlar düzenleyebiliyoruz. Özel bir grup koordinatörü baştan sona rezervasyonunuzu yönetir."]}], "faqTitle": "SSS – Grup Uçuşları", "faqs": [{"q": "Grup teklifi nasıl alırım?", "a": "WhatsApp +90 536 461 6674 veya email info@paragliding-oludeniz.com üzerinden doğrudan bizimle iletişime geçin."}, {"q": "İndirim için minimum grup büyüklüğü nedir?", "a": "%10 indirim için 4 kişi, %15 indirim için 8 kişi veya daha fazlası."}, {"q": "Tüm grup üyeleri aynı anda mı uçuyor?", "a": "Grubun yakın uçmasını ve birbirini izleyebilmesini sağlamak için aynı kalkış noktasından ardışık kalkışlar düzenliyoruz."}], "relatedTitle": "Tandem Paraşüt Hakkında Daha Fazla", "related": [{"href": "/groups", "label": "Tüm Grup Seçenekleri"}, {"href": "/tandem-paragliding/first-time", "label": "İlk Kez Uçuş"}, {"href": "/tandem-paragliding/safety-guide", "label": "Güvenlik Rehberi"}, {"href": "/tandem-paragliding/sunset-flight", "label": "Gün Batımı Uçuşu"}, {"href": "/tandem-paragliding/group-flights", "label": "Grup Uçuşları"}]}, "de": {"sections": [{"h2": "Gibt es einen Gruppenrabatt?", "ps": ["Ja. Gruppen ab 4 Personen erhalten 10% Rabatt, ab 8 Personen 15% Rabatt. Wir koordinieren alle Transfers, Startzeiten und die Logistik."]}, {"h2": "Welche Gruppen betreuen Sie?", "ps": ["Wir betreuen Junggesellenabschiede, Firmenevents, Geburtstagsgruppen, Schulausflüge und Reiseveranstalter-Pakete. Jede Person fliegt individuell mit ihrem eigenen zertifizierten Piloten."]}, {"h2": "Können wir zusammen fliegen und uns gegenseitig zusehen?", "ps": ["Ja, wir können aufeinanderfolgende Starts vom gleichen Startplatz organisieren, damit Ihre Gruppe sich gegenseitig fliegen sehen kann. Ein persönlicher Gruppenkoordinator kümmert sich um Ihre Buchung von Anfang bis Ende."]}], "faqTitle": "FAQ – Gruppenflüge", "faqs": [{"q": "Wie bekomme ich ein Gruppenangebot?", "a": "Kontaktieren Sie uns direkt per WhatsApp unter +90 536 461 6674 oder per E-Mail an info@paragliding-oludeniz.com."}, {"q": "Wie groß muss die Gruppe für einen Rabatt sein?", "a": "4 Personen für 10% Rabatt, ab 8 Personen 15% Rabatt."}, {"q": "Fliegen alle Gruppenmitglieder gleichzeitig?", "a": "Wir organisieren aufeinanderfolgende Starts vom gleichen Startplatz, damit die Gruppe eng beieinander fliegt und sich gegenseitig zusehen kann."}], "relatedTitle": "Mehr zum Tandem-Paragliding", "related": [{"href": "/groups", "label": "Alle Gruppenoptionen"}, {"href": "/tandem-paragliding/first-time", "label": "Erster Flug"}, {"href": "/tandem-paragliding/safety-guide", "label": "Sicherheitsleitfaden"}, {"href": "/tandem-paragliding/sunset-flight", "label": "Sonnenuntergangsflug"}, {"href": "/tandem-paragliding/group-flights", "label": "Gruppenflüge"}]}, "ru": {"sections": [{"h2": "Есть ли скидка для групп?", "ps": ["Да. Группы от 4 человек получают скидку 10%, от 8 человек — 15%. Мы координируем все трансферы, время старта и логистику."]}, {"h2": "С какими группами вы работаете?", "ps": ["Мы обслуживаем мальчишники, девичники, дни рождения, корпоративные мероприятия, школьные поездки и пакеты для туроператоров. Каждый летит индивидуально со своим сертифицированным пилотом."]}, {"h2": "Можем ли мы лететь вместе и наблюдать друг за другом?", "ps": ["Да, мы можем организовать последовательные старты с одной точки, чтобы ваша группа могла наблюдать друг за другом. Персональный координатор группы ведёт ваше бронирование от начала до конца."]}], "faqTitle": "FAQ – групповые полёты", "faqs": [{"q": "Как получить предложение для группы?", "a": "Свяжитесь с нами напрямую через WhatsApp +90 536 461 6674 или по email info@paragliding-oludeniz.com."}, {"q": "Какой минимальный размер группы для скидки?", "a": "4 человека для скидки 10%, от 8 человек — скидка 15%."}, {"q": "Все члены группы летят одновременно?", "a": "Мы организуем последовательные старты с одной точки, чтобы группа летела рядом и могла наблюдать друг за другом."}], "relatedTitle": "Больше о тандемном парапланеризме", "related": [{"href": "/groups", "label": "Все групповые варианты"}, {"href": "/tandem-paragliding/first-time", "label": "Первый полёт"}, {"href": "/tandem-paragliding/safety-guide", "label": "Руководство по безопасности"}, {"href": "/tandem-paragliding/sunset-flight", "label": "Закатный полёт"}, {"href": "/tandem-paragliding/group-flights", "label": "Групповые полёты"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'tandem' })
  const titles: Record<string,string> = {en:"Group Paragliding Flights Oludeniz",tr:"Grup Paraşüt Uçuşları",de:"Gruppenflüge Paragliding",ru:"Групповые полёты"}
  const subs: Record<string,string> = {en:"We love groups. From 4 to 40+, we handle everything.",tr:"Grupları seviyoruz. 4\'ten 40\'a kadar her şeyi biz hallederiz.",de:"Wir lieben Gruppen. Von 4 bis 40+, wir übernehmen alles.",ru:"Мы любим группы. От 4 до 40+ человек — всё организуем."}
  const title = titles[locale]||titles.en
  const sub = subs[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <ServiceSchema name="Group Paragliding Flights Oludeniz" description="Group tandem paragliding in Oludeniz. Special rates for 4+ people launching from Babadağ." path="/tandem-paragliding/group-flights" serviceType="Tandem Paragliding Flight" />
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
