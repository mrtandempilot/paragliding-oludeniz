import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Paragliding Fethiye",tr:"Fethiye Paraşütü",de:"Paragliding Fethiye",ru:"Парапланеризм Фетхие"}
  const d = {en:"Fethiye is the gateway to Oludeniz — 15 minutes from the world's best paragliding.",tr:"Fethiye, Oludeniz'e açılan kapıdır — dünyanın en iyi paraşüt noktasına 15 dakika.",de:"Fethiye ist das Tor zu Oludeniz — 15 Minuten vom weltbesten Paragliding.",ru:"Фетхие — ворота в Олюдениз, в 15 минутах от лучшего парапланеризма."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/fethiye-paragliding'),
    openGraph: { url: localeUrl(locale, '/fethiye-paragliding'), description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'fethiyePara' })
  const titles = {en:"Paragliding Fethiye",tr:"Fethiye Paraşütü",de:"Paragliding Fethiye",ru:"Парапланеризм Фетхие"}
  const subs = {en:"Fethiye is the gateway to Oludeniz — 15 minutes from the world's best paragliding.",tr:"Fethiye, Oludeniz'e açılan kapıdır — dünyanın en iyi paraşüt noktasına 15 dakika.",de:"Fethiye ist das Tor zu Oludeniz — 15 Minuten vom weltbesten Paragliding.",ru:"Фетхие — ворота в Олюдениз, в 15 минутах от лучшего парапланеризма."}
  const bodies = {en:["Most visitors staying in Fethiye choose to paraglide from Babadağ in Oludeniz, just 15 kilometres away. We offer a free transfer from Fethiye centre to our Oludeniz office as part of your booking.","The Fethiye region as a whole offers exceptional flying. The bay of Fethiye, the Lycian coast, and the mountains behind Babadağ create a microclimate that is ideal for paragliding from April to October.","If you are staying in Fethiye, Calis Beach, Hisaronu, Ovacik, or Yaniklar, we can arrange pick-up directly from your hotel or accommodation. Contact us to confirm your collection point."],tr:["Fethiye'de kalan ziyaretçilerin çoğu, yalnızca 15 kilometre uzaklıktaki Oludeniz'deki Babadağ'dan paraşüt yapmayı tercih eder. Rezervasyonunuzun bir parçası olarak Fethiye merkezinden ofisimize ücretsiz transfer sunuyoruz.","Fethiye'de, Calis Plajı'nda, Hisarönü'nde, Ovacık'ta veya Yanıklar'da kalıyorsanız doğrudan otelinizden alış yapabiliriz."],de:["Die meisten Besucher in Fethiye wählen Paragliding vom Babadağ in Oludeniz, nur 15 Kilometer entfernt. Wir bieten einen kostenlosen Transfer vom Fethiye-Zentrum zu unserem Büro an.","Wenn Sie in Fethiye, Calis Beach, Hisaronu oder Ovacik übernachten, können wir Sie direkt vom Hotel abholen."],ru:["Большинство гостей, остановившихся в Фетхие, выбирают парапланеризм с Бабадага в Олюдениз, всего в 15 километрах. Мы предлагаем бесплатный трансфер из центра Фетхие в наш офис.","Если вы остановились в Фетхие, на пляже Кальш, в Хисаронню или Овачик, мы можем забрать вас прямо из отеля."]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7bd4/rtDjiycQ-CNoCYjmlrN3-.jpg" />
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3"><BreadcrumbNav items={[{ label: title }]} /></div>
      </div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl space-y-4">
          {body.map((p: string, i: number) => <p key={i} className="text-slate-600 leading-relaxed">{p}</p>)}
        </div>
      </section>
      <BookingCTA />
    </>
  )
}
