import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const titles: Record<string,string> = {en:"Sunset Paragliding Oludeniz",tr:"Gün Batımı Paraşüt Uçuşu",de:"Sonnenuntergangs-Paragliding",ru:"Закатный полёт на параплане"}
  return { title: `${titles[locale]||titles.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'tandem' })
  const titles: Record<string,string> = {en:"Sunset Paragliding Oludeniz",tr:"Gün Batımı Paraşüt Uçuşu",de:"Sonnenuntergangs-Paragliding",ru:"Закатный полёт на параплане"}
  const subtitles: Record<string,string> = {en:"The most magical flight in Oludeniz — golden hour over the Blue Lagoon.",tr:"Oludeniz'in en büyülü uçuşu — Mavi Lagün üzerinde altın saat.",de:"Der magischste Flug in Oludeniz — goldene Stunde über der Blauen Lagune.",ru:"Самый волшебный полёт в Олюдениз — золотой час над Голубой Лагуной."}
  const bodies: Record<string,string[]> = {en:["Sunset flights launch from the 1200m takeoff point in the late afternoon (typically 17:00-18:30, depending on season). The air is calmer, the thermals are gentler, and the light is extraordinary.","As you soar above the Blue Lagoon, the sky transforms from blue to gold to deep orange. The silhouette of Babadag behind you, the islands in the distance, the turquoise water below — photographers agree this is one of the most beautiful paragliding experiences in the world.","Sunset flights last approximately 20-30 minutes. We include a professional photo package with all sunset flights. Slots are very limited — book at least 2-3 days in advance in peak season.","Price: from €110 per person. Includes all equipment, transfer to launch, pilot, and photo package."],tr:["Gün batımı uçuşları öğleden sonra geç saatlerde 1200m kalkış noktasından yapılır (genellikle sezona bağlı olarak 17:00-18:30). Hava daha sakin, termikler daha yumuşak ve ışık olağanüstü.","Mavi Lagün üzerinde süzülürken gökyüzü maviden altına ve derin turuncuya dönüşür. Arkanda Babadağ'ın silüeti, uzakta adalar, aşağıda turkuaz sular — fotoğrafçılar bunun dünyanın en güzel paraşüt deneyimlerinden biri olduğu konusunda hemfikir.","Gün batımı uçuşları yaklaşık 20-30 dakika sürer. Tüm gün batımı uçuşlarına profesyonel fotoğraf paketi dahildir. Yoğun sezonda en az 2-3 gün önceden rezervasyon yapın.","Fiyat: kişi başı 110€'dan. Tüm ekipman, kalkışa transfer, pilot ve fotoğraf paketi dahildir."],de:["Sonnenuntergangsflüge starten am späten Nachmittag vom 1200m Startplatz (typischerweise 17:00-18:30, je nach Saison). Die Luft ist ruhiger, die Thermik sanfter und das Licht außergewöhnlich.","Während Sie über die Blaue Lagune gleiten, verwandelt sich der Himmel von Blau in Gold und tiefes Orange. Die Silhouette des Babadağ hinter Ihnen, die Inseln in der Ferne, das türkisfarbene Wasser unten — Fotografen sind sich einig, dass dies eines der schönsten Paragliding-Erlebnisse der Welt ist.","Sonnenuntergangsflüge dauern ca. 20-30 Minuten. Alle Sonnenuntergangsflüge beinhalten ein professionelles Fotopaket. Plätze sind sehr begrenzt — buchen Sie in der Hochsaison mindestens 2-3 Tage im Voraus.","Preis: ab €110 pro Person. Inklusive Ausrüstung, Transfer zum Start, Pilot und Fotopaket."],ru:["Закатные полёты стартуют с площадки 1200м в конце дня (обычно 17:00-18:30, в зависимости от сезона). Воздух спокойнее, термики мягче, а освещение исключительное.","Паря над Голубой Лагуной, небо меняется от синего к золотому и тёмно-оранжевому. Силуэт Бабадага позади, острова вдали, бирюзовая вода внизу — фотографы согласны, что это один из самых красивых парапланерных опытов в мире.","Закатные полёты длятся около 20-30 минут. Все закатные полёты включают профессиональный фотопакет. Места очень ограничены — бронируйте за 2-3 дня в пик сезона.","Цена: от €110 за человека. Включает всё снаряжение, трансфер к месту старта, пилота и фотопакет."]}
  const title = titles[locale]||titles.en
  const subtitle = subtitles[locale]||subtitles.en
  const body = bodies[locale]||bodies.en

  return (
    <>
      <PageHero title={title} subtitle={subtitle} size="sm" bgImage="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&q=85" />
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
