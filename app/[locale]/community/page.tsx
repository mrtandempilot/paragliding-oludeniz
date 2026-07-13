import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Paragliding Community Oludeniz",tr:"Oludeniz Paraşüt Topluluğu",de:"Paragliding-Community Oludeniz",ru:"Сообщество парапланеристов Олюдениз"}
  const d = {en:"Join one of the world's most vibrant paragliding communities.",tr:"Dünyanın en canlı paraşüt topluluklarından birine katılın.",de:"Treten Sie einer der lebendigsten Paragliding-Communities der Welt bei.",ru:"Присоединяйтесь к одному из самых живых сообществ парапланеристов мира."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/community'),
    openGraph: { url: localeUrl(locale, '/community'), description: (d as any)[locale] || d.en, images: ['https://www.atmosparagliding.com/opengraph-image'] },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "What Makes Ölüdeniz's Paragliding Community Special?", "ps": ["Ölüdeniz has one of the most active and welcoming paragliding communities in the world. Pilots from over 60 countries visit every season, from weekend warriors to world champions — the atmosphere on launch is uniquely international, with pilots from Germany, the UK, Russia, Australia, Brazil and everywhere in between."]}, {"h2": "What Events Bring the Community Together?", "ps": ["The Ölüdeniz Air Games, held annually in October, is one of the world's premier paragliding events, attracting top XC and acro pilots for a week of competitions, demos and social flying."]}, {"h2": "Where Does the Community Gather?", "ps": ["Year-round, the flying community gathers at the launch, at the beach bar, and at weekly pilot meetups. Whether you're a student on your first hill soar or a competition XC pilot, you'll find your people here. Follow us on Instagram and Facebook for daily conditions reports, flight videos and community news."]}], "faqTitle": "FAQ – The Ölüdeniz Paragliding Community", "faqs": [{"q": "Do I need to know anyone to fly here?", "a": "Not at all — the launch is a naturally social place, and pilots from dozens of countries mix easily every season."}, {"q": "When is the Ölüdeniz Air Games?", "a": "Annually in October, bringing together top XC and acro pilots for a week of competitions, demos and social flying."}, {"q": "How do I keep up with local conditions and community news?", "a": "Follow us on Instagram and Facebook for daily conditions reports, flight videos and community updates."}], "relatedTitle": "More on Ölüdeniz Flying", "related": [{"href": "/solo-paragliding", "label": "Solo Paragliding"}, {"href": "/cross-country-flights", "label": "Cross Country Flying"}, {"href": "/acro-flights", "label": "Acro Flights"}, {"href": "/pilot-services", "label": "Pilot Services"}]}, "tr": {"sections": [{"h2": "Ölüdeniz'in Paraşüt Topluluğunu Özel Kılan Ne?", "ps": ["Ölüdeniz, dünyanın en aktif ve sıcak paraşüt topluluklarından birine sahiptir. Her sezon 60'tan fazla ülkeden pilot ziyaret eder — hafta sonu meraklılarından dünya şampiyonlarına kadar. Kalkıştaki atmosfer eşsiz derecede uluslararasıdır; Almanya, İngiltere, Rusya, Avustralya, Brezilya ve daha nice ülkeden pilotlarla tanışırsınız."]}, {"h2": "Topluluğu Bir Araya Getiren Etkinlikler Neler?", "ps": ["Her yıl Ekim ayında düzenlenen Ölüdeniz Air Games, dünyanın önde gelen paraşüt etkinliklerinden biridir; üst düzey XC ve akro pilotlarını bir hafta boyunca yarışmalar, gösteriler ve sosyal uçuşlar için bir araya getirir."]}, {"h2": "Topluluk Nerede Bir Araya Geliyor?", "ps": ["Yıl boyunca uçuş topluluğu kalkış noktasında, plaj barında ve haftalık pilot buluşmalarında toplanır. İster ilk tepe uçuşunu yapan bir öğrenci, ister yarışmacı bir XC pilotu olun, burada kendi insanlarınızı bulacaksınız. Günlük koşul raporları, uçuş videoları ve topluluk haberleri için Instagram ve Facebook'ta bizi takip edin."]}], "faqTitle": "SSS – Ölüdeniz Paraşüt Topluluğu", "faqs": [{"q": "Burada uçmak için birini tanımam gerekir mi?", "a": "Hiç gerekmez — kalkış noktası doğal olarak sosyal bir yerdir ve her sezon onlarca ülkeden pilot kolayca kaynaşır."}, {"q": "Ölüdeniz Air Games ne zaman?", "a": "Her yıl Ekim ayında; üst düzey XC ve akro pilotlarını bir hafta süren yarışma, gösteri ve sosyal uçuşlar için bir araya getirir."}, {"q": "Yerel koşulları ve topluluk haberlerini nasıl takip ederim?", "a": "Günlük koşul raporları, uçuş videoları ve topluluk güncellemeleri için Instagram ve Facebook'ta bizi takip edin."}], "relatedTitle": "Ölüdeniz'de Uçuş Hakkında Daha Fazlası", "related": [{"href": "/solo-paragliding", "label": "Solo Yamaç Paraşütü"}, {"href": "/cross-country-flights", "label": "Cross Country Uçuşlar"}, {"href": "/acro-flights", "label": "Akro Uçuşları"}, {"href": "/pilot-services", "label": "Pilot Hizmetleri"}]}, "de": {"sections": [{"h2": "Was macht die Paragliding-Community von Ölüdeniz besonders?", "ps": ["Ölüdeniz hat eine der aktivsten und einladendsten Paragliding-Communities der Welt. Piloten aus über 60 Ländern besuchen jede Saison — vom Wochenendflieger bis zum Weltmeister. Die Atmosphäre am Startplatz ist einzigartig international, mit Piloten aus Deutschland, Großbritannien, Russland, Australien, Brasilien und vielen weiteren Ländern."]}, {"h2": "Welche Events bringen die Community zusammen?", "ps": ["Die jährlich im Oktober stattfindenden Ölüdeniz Air Games sind eines der weltweit bedeutendsten Paragliding-Events und ziehen Top-XC- und Acro-Piloten für eine Woche voller Wettkämpfe, Vorführungen und geselligem Fliegen an."]}, {"h2": "Wo trifft sich die Community?", "ps": ["Das ganze Jahr über trifft sich die Flug-Community am Startplatz, an der Strandbar und bei wöchentlichen Pilotentreffen. Ob Sie Schüler bei Ihrem ersten Hangflug oder Wettkampf-XC-Pilot sind — hier finden Sie Ihre Leute. Folgen Sie uns auf Instagram und Facebook für tägliche Bedingungsberichte, Flugvideos und Community-News."]}], "faqTitle": "FAQ – Die Paragliding-Community von Ölüdeniz", "faqs": [{"q": "Muss ich hier jemanden kennen, um zu fliegen?", "a": "Überhaupt nicht — der Startplatz ist von Natur aus ein sozialer Ort, und Piloten aus Dutzenden Ländern mischen sich jede Saison mühelos."}, {"q": "Wann finden die Ölüdeniz Air Games statt?", "a": "Jährlich im Oktober, mit Top-XC- und Acro-Piloten für eine Woche voller Wettkämpfe, Vorführungen und geselligem Fliegen."}, {"q": "Wie bleibe ich über lokale Bedingungen und Community-News informiert?", "a": "Folgen Sie uns auf Instagram und Facebook für tägliche Bedingungsberichte, Flugvideos und Community-Updates."}], "relatedTitle": "Mehr zum Fliegen in Ölüdeniz", "related": [{"href": "/solo-paragliding", "label": "Solo-Paragliding"}, {"href": "/cross-country-flights", "label": "Streckenflug (XC)"}, {"href": "/acro-flights", "label": "Acro-Flüge"}, {"href": "/pilot-services", "label": "Pilotendienste"}]}, "ru": {"sections": [{"h2": "Что делает сообщество парапланеристов Олюдениза особенным?", "ps": ["Олюдениз имеет одно из самых активных и гостеприимных сообществ парапланеристов в мире. Пилоты из более чем 60 стран приезжают каждый сезон — от энтузиастов выходного дня до чемпионов мира. Атмосфера на старте уникально интернациональна: здесь встречаются пилоты из Германии, Великобритании, России, Австралии, Бразилии и многих других стран."]}, {"h2": "Какие события объединяют сообщество?", "ps": ["Oludeniz Air Games, проводимые ежегодно в октябре, — одно из ведущих мировых событий парапланеризма, собирающее лучших XC- и акро-пилотов на неделю соревнований, демонстраций и совместных полётов."]}, {"h2": "Где собирается сообщество?", "ps": ["Круглый год лётное сообщество собирается на старте, в пляжном баре и на еженедельных встречах пилотов. Будь вы студент на своём первом склоновом полёте или соревнующийся XC-пилот — здесь вы найдёте своих людей. Подписывайтесь на нас в Instagram и Facebook для ежедневных отчётов об условиях, видео полётов и новостей сообщества."]}], "faqTitle": "FAQ – сообщество парапланеристов Олюдениза", "faqs": [{"q": "Нужно ли мне кого-то знать, чтобы летать здесь?", "a": "Вовсе нет — старт по своей природе место общения, и пилоты из десятков стран легко находят общий язык каждый сезон."}, {"q": "Когда проходят Oludeniz Air Games?", "a": "Ежегодно в октябре, собирая лучших XC- и акро-пилотов на неделю соревнований, демонстраций и совместных полётов."}, {"q": "Как быть в курсе местных условий и новостей сообщества?", "a": "Подписывайтесь на нас в Instagram и Facebook для ежедневных отчётов об условиях, видео полётов и обновлений сообщества."}], "relatedTitle": "Больше о полётах в Олюденизе", "related": [{"href": "/solo-paragliding", "label": "Соло-парапланеризм"}, {"href": "/cross-country-flights", "label": "Маршрутные полёты (XC)"}, {"href": "/acro-flights", "label": "Акро-полёты"}, {"href": "/pilot-services", "label": "Услуги для пилотов"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'community' })
  const titles = {en:"Paragliding Community Oludeniz",tr:"Oludeniz Paraşüt Topluluğu",de:"Paragliding-Community Oludeniz",ru:"Сообщество парапланеристов Олюдениз"}
  const subs = {en:"Join one of the world's most vibrant paragliding communities.",tr:"Dünyanın en canlı paraşüt topluluklarından birine katılın.",de:"Treten Sie einer der lebendigsten Paragliding-Communities der Welt bei.",ru:"Присоединяйтесь к одному из самых живых сообществ парапланеристов мира."}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"Article\", \"headline\": \"Paragliding Community Oludeniz\", \"description\": \"The paragliding community in Oludeniz \\u2014 pilots, events and local knowledge.\", \"url\": \"https://www.atmosparagliding.com/community\", \"author\": {\"@type\": \"Person\", \"name\": \"Ceyhun\", \"url\": \"https://www.atmosparagliding.com/en/about-us\"}, \"publisher\": {\"@type\": \"Organization\", \"name\": \"Atmos Paragliding\", \"url\": \"https://www.atmosparagliding.com\"}}" }} />
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7bd4/rtDjiycQ-CNoCYjmlrN3-.jpg" />
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
