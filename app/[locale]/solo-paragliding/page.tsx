import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'solo' })
  return { title: `${t('title')} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'solo' })
  const bodies: Record<string,string[]> = {"en": ["Ölüdeniz is a world-class destination for solo and XC pilots. With reliable thermals, 300+ flying days per year, and multiple launch points on Babadağ, it attracts pilots from all over the world.", "We offer pilot services including equipment hire, meteorology briefings, retrieve services, and storage facilities."], "tr": ["Ölüdeniz, solo ve XC pilotlar için dünya klasmanında bir destinasyondur. 300'den fazla uçuş günü ve Babadağ'daki çoklu kalkış noktalarıyla dünyanın her yerinden pilot çekmektedir.", "Ekipman kiralama, meteoroloji brifingleri, geri alma hizmetleri ve depolama dahil pilot hizmetleri sunuyoruz."], "de": ["Ölüdeniz ist ein Weltklasse-Ziel für Solo- und XC-Piloten. Mit 300+ Flugtagen pro Jahr und mehreren Startplätzen am Babadağ zieht es Piloten aus aller Welt an.", "Wir bieten Pilotendienste an: Ausrüstungsverleih, Meteorologie-Briefings, Abholservice und Lagerung."], "ru": ["Олюдениз — место мирового класса для соло и XC пилотов. С 300+ лётными днями в год и несколькими стартовыми площадками на Бабадаге, он привлекает пилотов со всего мира.", "Мы предлагаем услуги пилотам: аренда снаряжения, метео-брифинги, услуга подбора и хранение."]}
  const linkLabels: Record<string,string> = {"en": "Pilot Services", "tr": "Pilot Hizmetleri", "de": "Pilotendienste", "ru": "Услуги пилотам"}
  const body = bodies[locale]||bodies.en
  const linkLabel = linkLabels[locale]||linkLabels.en
  const linkHref = locale === 'en' ? '/pilot-services' : `/${locale}/pilot-services`

  return (
    <>
      <PageHero title={t('title')} subtitle={t('subtitle')} badge={t('badge')} bgImage="https://v3b.fal.media/files/b/0a9d7c0d/dOEuj7ebfM-MdyvUcunPD.jpg" />
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3">
          <BreadcrumbNav items={[{ label: t('title') }]} />
        </div>
      </div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl space-y-4">
          {body.map((p, i) => <p key={i} className="text-slate-600 leading-relaxed">{p}</p>)}
          <div className="pt-4">
            <Link href={linkHref} className="btn-primary">{linkLabel} <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>
      <BookingCTA />
    </>
  )
}
