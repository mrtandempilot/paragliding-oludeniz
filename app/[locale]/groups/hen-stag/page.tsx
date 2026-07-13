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
  const t = {en:"Hen and Stag Party Paragliding",tr:"Bekarlığa Veda Partisi Paraşütü",de:"Junggesellinnen-Abschieds-Paragliding",ru:"Девичник и мальчишник на параплане"}
  const d = {en:"Make your hen or stag party unforgettable with paragliding over the Blue Lagoon.",tr:"Mavi Lagün üzerinde paraşütle bekarlığa veda partinizi unutulmaz kılın.",de:"Machen Sie Ihren Junggesellen-Abschied mit Paragliding über die Blaue Lagune unvergesslich.",ru:"Сделайте девичник или мальчишник незабываемым с парапланеризмом над Голубой Лагуной."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/groups/hen-stag'),
    openGraph: { url: localeUrl(locale, '/groups/hen-stag'), description: (d as any)[locale] || d.en, images: ['https://www.atmosparagliding.com/opengraph-image'] },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "Why Choose Paragliding for a Hen or Stag Party?", "ps": ["Paragliding is one of the most talked-about hen and stag party activities in Ölüdeniz. Groups of 4–20 can fly on the same day with our coordinated group booking service."]}, {"h2": "How Does a Group Flight Day Work?", "ps": ["We launch participants in succession from the same point, so the group can watch and cheer each person take off. Photo and video packages are available for the full group to keep the memories."]}, {"h2": "Can You Arrange the Full Day?", "ps": ["Yes — we work with local accommodation, restaurants and activity providers to create complete hen or stag day packages. Ask about our full-day coordination service."]}, {"h2": "How Far in Advance Should You Book?", "ps": ["Book at least 3–5 days in advance for groups of 6+. In peak summer season, book 1–2 weeks ahead. Contact us on WhatsApp for the fastest response: +90 536 461 6674."]}], "faqTitle": "FAQ – Hen & Stag Party Paragliding", "faqs": [{"q": "Can our whole group fly together?", "a": "Groups of 4–20 can fly the same day, launching in succession so everyone can watch each flight."}, {"q": "How early should we book for a peak-season party?", "a": "1–2 weeks ahead in peak summer season; 3–5 days for smaller groups outside peak times."}, {"q": "Can you help plan the rest of the day?", "a": "Yes, we work with local accommodation, restaurants and activity providers for a full-day package."}], "relatedTitle": "Group Options", "related": [{"href": "/groups/corporate", "label": "Corporate Groups"}, {"href": "/tandem-paragliding/group-flights", "label": "Group Flights"}, {"href": "/prices", "label": "Prices & Packages"}, {"href": "/book-now", "label": "Book Your Flight"}]}, "tr": {"sections": [{"h2": "Bekarlığa Veda Partisi İçin Neden Paraşüt?", "ps": ["Paraşüt, Ölüdeniz'deki en çok konuşulan bekarlığa veda partisi aktivitelerinden biridir. 4-20 kişilik gruplar, koordineli grup rezervasyon hizmetimizle aynı gün uçabilir."]}, {"h2": "Grup Uçuş Günü Nasıl İşliyor?", "ps": ["Katılımcıları aynı noktadan sırayla havalandırıyoruz; böylece grup her kişinin kalkışını izleyip tezahürat yapabilir. Anıları saklamak için tüm grup için fotoğraf ve video paketleri mevcuttur."]}, {"h2": "Tüm Günü Ayarlayabilir Misiniz?", "ps": ["Evet — eksiksiz bekarlığa veda günü paketleri oluşturmak için yerel konaklama, restoran ve aktivite sağlayıcılarıyla çalışıyoruz. Tam gün koordinasyon hizmetimiz hakkında bilgi alın."]}, {"h2": "Ne Kadar Önceden Rezervasyon Yapılmalı?", "ps": ["6+ kişilik gruplar için en az 3-5 gün önceden rezervasyon yapın. Yoğun yaz sezonunda 1-2 hafta önceden rezervasyon yapın. En hızlı yanıt için WhatsApp'tan bize ulaşın: +90 536 461 6674."]}], "faqTitle": "SSS – Bekarlığa Veda Partisi Paraşütü", "faqs": [{"q": "Tüm grubumuz birlikte uçabilir mi?", "a": "4-20 kişilik gruplar aynı gün uçabilir; herkesin her uçuşu izleyebilmesi için sırayla kalkış yapılır."}, {"q": "Yoğun sezonda parti için ne kadar erken rezervasyon yapmalıyız?", "a": "Yoğun yaz sezonunda 1-2 hafta önceden; yoğun olmayan zamanlarda küçük gruplar için 3-5 gün."}, {"q": "Günün geri kalanını planlamama yardım edebilir misiniz?", "a": "Evet, tam gün paketi için yerel konaklama, restoran ve aktivite sağlayıcılarıyla çalışıyoruz."}], "relatedTitle": "Grup Seçenekleri", "related": [{"href": "/groups/corporate", "label": "Kurumsal Gruplar"}, {"href": "/tandem-paragliding/group-flights", "label": "Grup Uçuşları"}, {"href": "/prices", "label": "Fiyatlar ve Paketler"}, {"href": "/book-now", "label": "Uçuşunuzu Ayırtın"}]}, "de": {"sections": [{"h2": "Warum Paragliding für einen Junggesellenabschied wählen?", "ps": ["Paragliding ist eine der meistdiskutierten Aktivitäten für Junggesellenabschiede in Ölüdeniz. Gruppen von 4–20 Personen können mit unserem koordinierten Gruppenbuchungsservice am selben Tag fliegen."]}, {"h2": "Wie läuft ein Gruppenflugtag ab?", "ps": ["Wir lassen die Teilnehmer nacheinander vom selben Punkt starten, sodass die Gruppe jeden Start beobachten und anfeuern kann. Foto- und Videopakete sind für die ganze Gruppe verfügbar, um die Erinnerungen festzuhalten."]}, {"h2": "Können Sie den ganzen Tag organisieren?", "ps": ["Ja — wir arbeiten mit lokalen Unterkünften, Restaurants und Aktivitätsanbietern zusammen, um komplette Junggesellenabschied-Pakete zu erstellen. Fragen Sie nach unserem Ganztages-Koordinationsservice."]}, {"h2": "Wie weit im Voraus sollten Sie buchen?", "ps": ["Buchen Sie mindestens 3–5 Tage im Voraus für Gruppen ab 6 Personen. In der Hochsaison im Sommer buchen Sie 1–2 Wochen im Voraus. Kontaktieren Sie uns für die schnellste Antwort per WhatsApp: +90 536 461 6674."]}], "faqTitle": "FAQ – Junggesellenabschied-Paragliding", "faqs": [{"q": "Kann unsere ganze Gruppe zusammen fliegen?", "a": "Gruppen von 4–20 Personen können am selben Tag fliegen, wobei nacheinander gestartet wird, damit alle jeden Flug sehen können."}, {"q": "Wie früh sollten wir für eine Feier in der Hochsaison buchen?", "a": "1–2 Wochen im Voraus in der Hochsaison im Sommer; 3–5 Tage für kleinere Gruppen außerhalb der Hochsaison."}, {"q": "Können Sie beim Rest des Tages helfen?", "a": "Ja, wir arbeiten mit lokalen Unterkünften, Restaurants und Aktivitätsanbietern für ein Ganztagespaket zusammen."}], "relatedTitle": "Gruppenoptionen", "related": [{"href": "/groups/corporate", "label": "Firmengruppen"}, {"href": "/tandem-paragliding/group-flights", "label": "Gruppenflüge"}, {"href": "/prices", "label": "Preise & Pakete"}, {"href": "/book-now", "label": "Flug buchen"}]}, "ru": {"sections": [{"h2": "Почему стоит выбрать парапланеризм для девичника или мальчишника?", "ps": ["Парапланеризм — одна из самых обсуждаемых активностей для девичников и мальчишников в Олюденизе. Группы от 4 до 20 человек могут летать в один день благодаря нашей скоординированной групповой системе бронирования."]}, {"h2": "Как проходит день групповых полётов?", "ps": ["Мы запускаем участников по очереди с одной точки, чтобы группа могла наблюдать и подбадривать каждого при взлёте. Доступны фото- и видеопакеты для всей группы, чтобы сохранить воспоминания."]}, {"h2": "Можете ли вы организовать весь день?", "ps": ["Да — мы работаем с местными отелями, ресторанами и организаторами активностей, чтобы создать полный пакет для дня девичника или мальчишника. Спросите про нашу услугу координации на весь день."]}, {"h2": "За сколько нужно бронировать?", "ps": ["Бронируйте минимум за 3–5 дней для групп от 6 человек. В пик летнего сезона бронируйте за 1–2 недели. Свяжитесь с нами через WhatsApp для самого быстрого ответа: +90 536 461 6674."]}], "faqTitle": "FAQ – парапланеризм для девичника и мальчишника", "faqs": [{"q": "Может ли вся наша группа лететь вместе?", "a": "Группы от 4 до 20 человек могут летать в один день, стартуя по очереди, чтобы все могли увидеть каждый полёт."}, {"q": "Насколько заранее бронировать вечеринку в пик сезона?", "a": "За 1–2 недели в пик летнего сезона; за 3–5 дней для небольших групп вне пикового времени."}, {"q": "Можете ли вы помочь спланировать остаток дня?", "a": "Да, мы работаем с местными отелями, ресторанами и организаторами активностей для полного дневного пакета."}], "relatedTitle": "Групповые варианты", "related": [{"href": "/groups/corporate", "label": "Корпоративные группы"}, {"href": "/tandem-paragliding/group-flights", "label": "Групповые полёты"}, {"href": "/prices", "label": "Цены и пакеты"}, {"href": "/book-now", "label": "Забронировать полёт"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'groups' })
  const titles = {en:"Hen and Stag Party Paragliding",tr:"Bekarlığa Veda Partisi Paraşütü",de:"Junggesellinnen-Abschieds-Paragliding",ru:"Девичник и мальчишник на параплане"}
  const subs = {en:"Make your hen or stag party unforgettable with paragliding over the Blue Lagoon.",tr:"Mavi Lagün üzerinde paraşütle bekarlığa veda partinizi unutulmaz kılın.",de:"Machen Sie Ihren Junggesellen-Abschied mit Paragliding über die Blaue Lagune unvergesslich.",ru:"Сделайте девичник или мальчишник незабываемым с парапланеризмом над Голубой Лагуной."}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <ServiceSchema name="Hen and Stag Paragliding Oludeniz" description="Paragliding experiences for hen and stag parties in Oludeniz, Turkey." path="/groups/hen-stag" serviceType="Tandem Paragliding Flight" />
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
