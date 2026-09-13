import type { Metadata } from 'next'
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
    openGraph: { url: localeUrl(locale, '/tandem-paragliding/group-flights'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${t[locale]||t.en}` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'tandem' })
  const titles: Record<string,string> = {en:"Group Paragliding Flights Oludeniz",tr:"Grup Paraşüt Uçuşları",de:"Gruppenflüge Paragliding",ru:"Групповые полёты"}
  const subs: Record<string,string> = {en:"We love groups. From 4 to 40+, we handle everything.",tr:"Grupları seviyoruz. 4\'ten 40\'a kadar her şeyi biz hallederiz.",de:"Wir lieben Gruppen. Von 4 bis 40+, wir übernehmen alles.",ru:"Мы любим группы. От 4 до 40+ человек — всё организуем."}
  const bodies: Record<string,string[]> = {
    en:["Every person in your group pays the same fixed $150 all-inclusive price — no group discounts, no hidden fees. We coordinate all transfers, launch times, and logistics so your group experiences the least possible wait time.","We accommodate hen parties, stag parties, birthday groups, corporate team days, school trips, and tour operator packages. Each person flies individually with their own certified pilot — you are never more than one wing apart.","We can arrange consecutive launches from the same takeoff point so your group watches each other fly. A dedicated group coordinator handles your booking from start to finish.","Contact us directly for a group quote: WhatsApp +90 536 461 6674 or email info@paragliding-oludeniz.com"],
    tr:["Grubunuzdaki herkes aynı sabit $150 all-inclusive fiyatı öder — grup indirimi ya da gizli ücret yoktur. Tüm transferleri, kalkış zamanlarını ve lojistiği biz koordine ediyoruz.","Bekarlığa veda partileri, kurumsal etkinlikler, doğum günü grupları, okul gezileri ve tur operatörü paketleri için hizmet veriyoruz. Her kişi kendi sertifikalı pilotla bireysel olarak uçar.","Grubunuzun birbirini uçarken izleyebilmesi için aynı kalkış noktasından ardışık kalkışlar düzenleyebiliyoruz. Özel bir grup koordinatörü baştan sona rezervasyonunuzu yönetir.","Grup teklifi için doğrudan bizimle iletişime geçin: WhatsApp +90 536 461 6674 veya email info@paragliding-oludeniz.com"],
    de:["Jede Person in Ihrer Gruppe zahlt denselben Festpreis von $150, alles inklusive — keine Gruppenrabatte, keine versteckten Kosten. Wir koordinieren alle Transfers, Startzeiten und die Logistik.","Wir betreuen Junggesellenabschiede, Firmenevents, Geburtstagsgruppen, Schulausflüge und Reiseveranstalter-Pakete. Jede Person fliegt individuell mit ihrem eigenen zertifizierten Piloten.","Für ein Gruppenangebot kontaktieren Sie uns direkt: WhatsApp +90 536 461 6674 oder email info@paragliding-oludeniz.com"],
    ru:["Каждый участник вашей группы платит одну и ту же фиксированную цену $150, всё включено — без групповых скидок и скрытых доплат. Мы координируем все трансферы, время старта и логистику.","Мы обслуживаем мальчишники, девичники, корпоративные мероприятия, школьные поездки. Каждый летит индивидуально со своим сертифицированным пилотом.","Для получения предложения для группы свяжитесь с нами напрямую: WhatsApp +90 536 461 6674 или email info@paragliding-oludeniz.com"],
  }
  const title = titles[locale]||titles.en
  const sub = subs[locale]||subs.en
  const body = bodies[locale]||bodies.en
  return (
    <>
      <ServiceSchema name="Group Paragliding Flights Oludeniz" description="Group tandem paragliding in Oludeniz. Special rates for 4+ people launching from Babadağ." path="/tandem-paragliding/group-flights" serviceType="Tandem Paragliding Flight" />
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c09/2htlcwkJ6pcLBY7gPtf7z.jpg" />
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3"><BreadcrumbNav items={[{ label: title }]} /></div>
      </div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl space-y-4">
          {body.map((p,i) => <p key={i} className="text-slate-600 leading-relaxed">{p}</p>)}
        </div>
      </section>
      <BookingCTA />
    </>
  )
}
