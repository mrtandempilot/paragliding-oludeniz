import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Best Months to Paraglide in Oludeniz",tr:"Oludeniz Paraşüt İçin En İyi Aylar",de:"Beste Monate zum Paragliding in Oludeniz",ru:"Лучшие месяцы для парапланеризма в Олюдениз"}
  return { title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'weatherGuide' })
  const titles = {en:"Best Months to Paraglide in Oludeniz",tr:"Oludeniz Paraşüt İçin En İyi Aylar",de:"Beste Monate zum Paragliding in Oludeniz",ru:"Лучшие месяцы для парапланеризма в Олюдениз"}
  const subs = {en:"May-June and September-October are perfect. July-August are busy but still excellent.",tr:"Mayıs-Haziran ve Eylül-Ekim mükemmeldir. Temmuz-Ağustos yoğun ama hâlâ mükemmel.",de:"Mai-Juni und September-Oktober sind perfekt. Juli-August sind belebt, aber immer noch ausgezeichnet.",ru:"Май-июнь и сентябрь-октябрь идеальны. Июль-август — оживлённо, но всё равно отлично."}
  const bodies = {en:["May and June: arguably the best months for paragliding in Oludeniz. Thermals are strong and predictable, wind direction is reliable, the crowds are manageable, and the scenery is stunning with spring flowers on the hillsides. Temperature at launch (1200m) is comfortable at around 18-22°C. Highly recommended.","September and October: the second best window. Thermals have calmed slightly from the August peak, making conditions ideal for tandem passengers and XC pilots alike. October hosts the Oludeniz Air Games. Sea temperature is still warm for swimming after your flight.","July and August: the peak tourist season. Flying happens every day but thermals can be strong and punchy in the afternoon. Morning flights (before 11:00) are smoother. The beach is busiest for landing. Slots fill quickly — book well in advance.","November to March: we fly on good days but conditions are inconsistent. Not recommended for specifically planning a paragliding holiday, though experienced pilots may find good XC days."],tr:["Mayıs ve Haziran: Oludeniz'de paraşüt için tartışmasız en iyi aylar. Termikler güçlü ve öngörülebilir, rüzgar yönü güvenilir.","Eylül ve Ekim: ikinci en iyi pencere. Ekim ayında Oludeniz Air Games düzenlenir.","Temmuz ve Ağustos: en yoğun turist sezonu. Öğleden önceki uçuşlar (11:00'den önce) daha pürüzsüzdür. Slotlar hızlı dolar, önceden rezervasyon yapın."],de:["Mai und Juni: die besten Monate. Thermik ist stark und vorhersehbar. September und Oktober: ebenfalls ausgezeichnet, der Oktober beherbergt die Oludeniz Air Games. Juli und August: Hochsaison, Morgenflüge sind glatter."],ru:["Май и июнь: лучшие месяцы. Термики сильные и предсказуемые. Сентябрь и октябрь: второе лучшее окно. В октябре — Oludeniz Air Games. Июль и август: пик сезона, утренние полёты плавнее."]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <PageHero title={title} subtitle={sub} size="sm" />
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
