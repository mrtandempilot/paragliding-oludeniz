import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Equipment Rental",tr:"Ekipman Kiralama",de:"Ausrüstungsverleih",ru:"Прокат снаряжения"}
  return { title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'pilotServices' })
  const titles = {en:"Equipment Rental",tr:"Ekipman Kiralama",de:"Ausrüstungsverleih",ru:"Прокат снаряжения"}
  const subs = {en:"Professional services for licensed paragliding pilots visiting Oludeniz.",tr:"Oludeniz'i ziyaret eden lisanslı paraşüt pilotları için profesyonel hizmetler.",de:"Professionelle Dienste für lizenzierte Paragliding-Piloten, die Oludeniz besuchen.",ru:"Профессиональные услуги для лицензированных пилотов, посещающих Олюдениз."}
  const bodies = {en:["We hire out a full range of paragliding equipment to visiting pilots with valid licences. All hire equipment is inspected and in current certification. Contact us in advance to reserve your preferred equipment.","Contact us at +90 536 461 6674 or visit our office on Oludeniz beach."],tr:["Geçerli lisansa sahip ziyaretçi pilotlara tam paraşüt ekipmanı kiralıyoruz.","Oludeniz plajındaki ofisimizi ziyaret edin veya +90 536 461 6674 numaralı telefonu arayın."],de:["We hire out a full range of paragliding equipment to visiting pilots with valid licences. All hire equipment is inspected and in current certification. Contact us in advance to reserve your preferred equipment.","Besuchen Sie unser Büro am Oludeniz-Strand oder rufen Sie uns an: +90 536 461 6674."],ru:["We hire out a full range of paragliding equipment to visiting pilots with valid licences. All hire equipment is inspected and in current certification. Contact us in advance to reserve your preferred equipment.","Посетите наш офис на пляже Олюдениз или позвоните нам: +90 536 461 6674."]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=85" />
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
