import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Acro Safety Guide",tr:"Akro Güvenlik Rehberi",de:"Acro Safety Guide",ru:"Acro Safety Guide"}
  const d = {en:"Advanced paragliding for experienced pilots.",tr:"Deneyimli pilotlar için ileri düzey paraşüt.",de:"Fortgeschrittenes Paragliding für erfahrene Piloten.",ru:"Продвинутый парапланеризм для опытных пилотов."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/acro-flights/safety'),
    openGraph: { url: localeUrl(locale, '/acro-flights/safety'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'acro' })
  const titles = {en:"Acro Safety Guide",tr:"Akro Güvenlik Rehberi",de:"Acro Safety Guide",ru:"Acro Safety Guide"}
  const subs = {en:"Advanced paragliding for experienced pilots.",tr:"Deneyimli pilotlar için ileri düzey paraşüt.",de:"Fortgeschrittenes Paragliding für erfahrene Piloten.",ru:"Продвинутый парапланеризм для опытных пилотов."}
  const bodies = {en:["Acro paragliding carries higher risk than standard flying and requires specific equipment, training, and experience. All acro flying at Oludeniz must be conducted over designated water areas with appropriate safety equipment.","Contact us for more information: +90 536 461 6674"],tr:["Acro paragliding carries higher risk than standard flying and requires specific equipment, training, and experience. All acro flying at Oludeniz must be conducted over designated water areas with appropriate safety equipment.","Daha fazla bilgi için bize ulaşın: +90 536 461 6674"],de:["Acro paragliding carries higher risk than standard flying and requires specific equipment, training, and experience. All acro flying at Oludeniz must be conducted over designated water areas with appropriate safety equipment.","Kontaktieren Sie uns: +90 536 461 6674"],ru:["Acro paragliding carries higher risk than standard flying and requires specific equipment, training, and experience. All acro flying at Oludeniz must be conducted over designated water areas with appropriate safety equipment.","Свяжитесь с нами: +90 536 461 6674"]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"Article\", \"headline\": \"Acro Paragliding Safety Oludeniz\", \"description\": \"Safety guidelines and requirements for acrobatic paragliding in Oludeniz.\", \"url\": \"https://atmosparagliding.com/acro-flights/safety\", \"author\": {\"@type\": \"Person\", \"name\": \"Ceyhun\", \"url\": \"https://atmosparagliding.com/en/about-us\"}, \"publisher\": {\"@type\": \"Organization\", \"name\": \"Atmos Paragliding\", \"url\": \"https://atmosparagliding.com\"}}" }} />
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c0b/Ma1uD1AUlcpoxL-48cgg4.jpg" />
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
