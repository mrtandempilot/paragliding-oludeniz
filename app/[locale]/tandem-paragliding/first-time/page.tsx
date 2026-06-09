import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const titles: Record<string,string> = {en:"First Time Paragliding Oludeniz",tr:"İlk Kez Yamaç Paraşütü",de:"Erstmals Paragliding",ru:"Впервые на параплане"}
  return { title: `${titles[locale]||titles.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'tandem' })
  const titles: Record<string,string> = {en:"First Time Paragliding Oludeniz",tr:"İlk Kez Yamaç Paraşütü",de:"Erstmals Paragliding",ru:"Впервые на параплане"}
  const subtitles: Record<string,string> = {en:"Complete guide for first-time flyers.",tr:"İlk uçuş yapacaklar için eksiksiz rehber.",de:"Vollständiger Leitfaden für Erstflieger.",ru:"Полный гид для тех, кто летит впервые."}
  const bodies: Record<string,string[]> = {en:["No experience is needed for a tandem paragliding flight in Oludeniz. You fly attached to a certified pilot who handles everything from launch to landing.","On the day: arrive at our office on Oludeniz beach, we check your weight and confirm your booking. Then we drive you up to Babadag launch point (about 20 minutes). Your pilot gives you a 5-minute safety briefing — very simple and friendly.","At launch you run 3-5 steps downhill and you are airborne. Most people say this moment is pure magic. Your pilot flies you over the Blue Lagoon, Butterfly Valley and the turquoise Aegean for 25-45 minutes, then lands you gently on Oludeniz beach.","What to wear: closed-toe shoes (trainers or hiking boots, no sandals), comfortable trousers, a light jacket as it is 5-10 degrees cooler at altitude. Bring sunglasses with a strap."],tr:["Oludeniz'de tandem yamaç paraşütü uçuşu için herhangi bir deneyim gerekmez. Kalkıştan inişe kadar her şeyi kontrol eden sertifikalı bir pilota bağlı olarak uçarsınız.","Gün geldiğinde: Oludeniz plajındaki ofisimize gelin, ağırlığınızı kontrol ediyor ve rezervasyonunuzu onaylıyoruz. Ardından sizi Babadağ kalkış noktasına götürüyoruz (yaklaşık 20 dakika). Pilotunuz size 5 dakikalık güvenlik brifing veriyor — çok basit ve samimi.","Kalkışta 3-5 adım aşağı doğru koşuyorsunuz ve havaya yükseliyorsunuz. Çoğu kişi bu anı saf sihir olarak tanımlıyor. Pilotunuz sizi 25-45 dakika boyunca Mavi Lagün, Kelebek Vadisi ve turkuaz Ege üzerinde uçuruyor, ardından Oludeniz plajına yavaşça indiriyor.","Ne giymeli: kapalı burunlu ayakkabılar (spor ayakkabı veya yürüyüş botu, sandal yok), rahat pantolon, hafif ceket çünkü yüksekte 5-10 derece daha serin olabilir. Kayış olgularıyla güneş gözlüğü getirin."],de:["Für einen Tandem-Paragliding-Flug in Oludeniz ist keine Erfahrung erforderlich. Sie fliegen an einen zertifizierten Piloten gebunden, der alles vom Start bis zur Landung übernimmt.","Am Tag selbst: Kommen Sie zu unserem Büro am Oludeniz-Strand, wir prüfen Ihr Gewicht und bestätigen Ihre Buchung. Dann fahren wir Sie zum Babadağ-Startplatz (ca. 20 Minuten). Ihr Pilot gibt Ihnen ein 5-minütiges Sicherheitsbriefing — sehr einfach und freundlich.","Beim Start laufen Sie 3-5 Schritte den Hang hinunter und sind in der Luft. Die meisten Menschen beschreiben diesen Moment als pure Magie. Ihr Pilot fliegt Sie 25-45 Minuten über die Blaue Lagune, das Schmetterlingstal und das türkisfarbene Ägäische Meer, dann landet er Sie sanft am Oludeniz-Strand.","Was anziehen: geschlossene Schuhe (Turnschuhe oder Wanderschuhe, keine Sandalen), bequeme Hose, eine leichte Jacke, da es in der Höhe 5-10 Grad kühler sein kann. Bringen Sie Sonnenbrille mit Band mit."],ru:["Для тандемного полёта на параплане в Олюдениз опыт не нужен. Вы летите пристёгнутым к сертифицированному пилоту, который управляет всем от взлёта до посадки.","В день полёта: приходите в наш офис на пляже Олюдениз, мы проверим ваш вес и подтвердим бронирование. Затем мы отвезём вас к стартовой площадке Бабадаг (около 20 минут). Пилот проведёт 5-минутный инструктаж по безопасности — очень просто и дружелюбно.","На старте вы пробегаете 3-5 шагов вниз по склону и взлетаете. Большинство людей описывают этот момент как чистую магию. Пилот везёт вас 25-45 минут над Голубой Лагуной, Долиной Бабочек и бирюзовым Эгейским морем, затем мягко приземляет на пляже Олюдениз.","Что надеть: закрытая обувь (кроссовки или треккинговые ботинки, не сандалии), удобные брюки, лёгкая куртка, так как на высоте на 5-10 градусов прохладнее. Возьмите солнцезащитные очки с ремешком."]}
  const title = titles[locale]||titles.en
  const subtitle = subtitles[locale]||subtitles.en
  const body = bodies[locale]||bodies.en

  return (
    <>
      <PageHero title={title} subtitle={subtitle} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c09/2htlcwkJ6pcLBY7gPtf7z.jpg" />
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3">
          <BreadcrumbNav items={[{ label: title }]} />
        </div>
      </div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          {body.map((p, i) => <p key={i} className="text-slate-600 leading-relaxed mb-4">{p}</p>)}
        </div>
      </section>
      <BookingCTA />
    </>
  )
}
