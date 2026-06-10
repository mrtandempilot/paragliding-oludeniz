import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates } from '@/lib/seo'
import ServiceSchema from '@/components/shared/ServiceSchema'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'acro' })
  const d: Record<string, string> = {"en": "Extreme acro paragliding in Oludeniz: spirals, infinity tumbling and heart-pumping manoeuvres with world-class acro pilots over the Blue Lagoon.", "tr": "Ölüdeniz'de ekstrem akro yamaç paraşütü: dünya klasmanında akro pilotlarla spiral, infinity tumbling ve nefes kesen manevralar.", "de": "Extremes Acro-Paragliding in Ölüdeniz: Spiralen, Infinity Tumbling und atemberaubende Manöver mit Weltklasse-Acro-Piloten.", "ru": "Экстремальный акро-парапланеризм в Олюденизе: спирали, infinity tumbling и захватывающие манёвры с пилотами мирового класса."}
  return {
    description: d[locale] || d.en,
    alternates: localeAlternates(locale, '/acro-flights'), title: `${t('title')} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'acro' })
  const bodies: Record<string,string[]> = {"en": ["Ölüdeniz is one of the world's premier acro paragliding destinations, hosting international competitions and attracting elite pilots from around the globe.", "Whether you want to watch acro flying, try an introductory acro flight, or join the local acro community, we can help."], "tr": ["Ölüdeniz, uluslararası yarışmalara ev sahipliği yapan ve dünyanın dört bir yanından seçkin pilotları çeken dünyanın en önde gelen akro paraşüt destinasyonlarından biridir.", "Akro uçuşunu izlemek, tanıtım akro uçuşu denemek veya yerel akro topluluğuna katılmak isteyip istemediğinizden bağımsız olarak yardımcı olabiliriz."], "de": ["Ölüdeniz ist eines der weltbesten Akro-Paragliding-Ziele, das internationale Wettkämpfe ausrichtet und Elite-Piloten aus aller Welt anzieht.", "Ob Sie Akro-Fliegen beobachten, einen Einführungs-Akroflug ausprobieren oder der lokalen Akro-Community beitreten möchten — wir helfen Ihnen."], "ru": ["Олюдениз — одно из ведущих мировых мест для акро-парапланеризма, принимающее международные соревнования и привлекающее элитных пилотов со всего мира.", "Хотите ли вы наблюдать за акро-полётами, попробовать вводный акро-полёт или присоединиться к местному акро-сообществу — мы поможем."]}
  const linkLabels: Record<string,string> = {"en": "Contact Us", "tr": "Bize Ulaşın", "de": "Kontakt", "ru": "Связаться"}
  const body = bodies[locale]||bodies.en
  const linkLabel = linkLabels[locale]||linkLabels.en
  const linkHref = locale === 'en' ? '/contact' : `/${locale}/contact`

  return (
    <>
      <ServiceSchema name="Acro Paragliding Flight" description="Acrobatic tandem paragliding with spirals and extreme manoeuvres over Oludeniz." path="/acro-flights" serviceType="Acro Paragliding Flight" />
      <PageHero title={t('title')} subtitle={t('subtitle')} badge={t('badge')} bgImage="https://v3b.fal.media/files/b/0a9d7c0b/Ma1uD1AUlcpoxL-48cgg4.jpg" />
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
