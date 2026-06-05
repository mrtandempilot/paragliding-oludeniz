import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Summer Thermals Oludeniz",tr:"Oludeniz Yaz Termikleri",de:"Sommer-Thermik Oludeniz",ru:"Летние термики Олюдениз"}
  return { title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'weatherGuide' })
  const titles = {en:"Summer Thermals Oludeniz",tr:"Oludeniz Yaz Termikleri",de:"Sommer-Thermik Oludeniz",ru:"Летние термики Олюдениз"}
  const subs = {en:"Understanding thermals in July and August.",tr:"Temmuz ve Ağustos'ta termikleri anlamak.",de:"Thermik im Juli und August verstehen.",ru:"Понимание термиков в июле и августе."}
  const bodies = {en:["July and August produce the strongest thermals of the year at Babadağ. The high sun angle, long days, and hot land surface create powerful convective lift from late morning onwards. Thermals can reach 4-5 m/s (strong) between 12:00-16:00.","For tandem passengers: summer afternoon thermals can feel bumpy. If you are prone to motion sickness or want a smooth first experience, book a morning slot (before 10:30) or our sunset flight. Morning air is thermally inactive and very smooth.","For solo pilots: summer thermals are the best in the season for XC flying. With strong, reliable lift and low cloud base (typically 2200-2600m), experienced pilots can fly 50-100km routes across the Fethiye region.","Summer flying tip: hydrate well, wear sunscreen, and bring a buff or sun hat for the launch wait. Temperatures at 1200m launch can reach 30°C+."],tr:["Temmuz ve Ağustos, Babadağ'daki yılın en güçlü termiklerini üretir. Tandem yolcular için: sabah slotları (10:30'dan önce) daha pürüzsüzdür.","Solo pilotlar için: yaz termikleri sezondaki XC uçuşu için en iyisidir."],de:["Juli und August produzieren die stärkste Thermik am Babadağ. Für Tandempassagiere: Morgenstarts (vor 10:30) sind glatter. Für Solopiloten: Sommerthermik ist ideal für XC-Fliegen."],ru:["Июль и август дают самые сильные термики на Бабадаге. Для тандемных пассажиров: утренние старты (до 10:30) более плавные. Для соло-пилотов: летние термики идеальны для XC полётов."]}
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
