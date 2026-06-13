import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Insurance & Permissions for Solo Pilots",tr:"Solo Pilotlar İçin Sigorta ve İzinler",de:"Versicherung und Genehmigungen für Solopiloten",ru:"Страховка и разрешения для соло-пилотов"}
  const d = {en:"What insurance and permissions you need to fly at Oludeniz.",tr:"Oludeniz'de uçmak için ihtiyacınız olan sigorta ve izinler.",de:"Welche Versicherung und Genehmigungen Sie für Oludeniz benötigen.",ru:"Какая страховка и разрешения нужны для полётов в Олюдениз."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/solo-paragliding/insurance-permissions'),
    openGraph: { url: localeUrl(locale, '/solo-paragliding/insurance-permissions'), description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'solo' })
  const titles = {en:"Insurance & Permissions for Solo Pilots",tr:"Solo Pilotlar İçin Sigorta ve İzinler",de:"Versicherung und Genehmigungen für Solopiloten",ru:"Страховка и разрешения для соло-пилотов"}
  const subs = {en:"What insurance and permissions you need to fly at Oludeniz.",tr:"Oludeniz'de uçmak için ihtiyacınız olan sigorta ve izinler.",de:"Welche Versicherung und Genehmigungen Sie für Oludeniz benötigen.",ru:"Какая страховка и разрешения нужны для полётов в Олюдениз."}
  const bodies = {en:["Third-party liability insurance is mandatory to fly at Babadağ. This covers injury or damage to third parties caused by your paraglider. BHPA and DHV memberships both include this cover when flying in Turkey.","If your national association membership does not provide liability cover outside your home country, you will need a standalone paragliding insurance policy. We can recommend insurers on request.","No prior permission is required to fly at Babadağ as a licensed pilot — present your licence and insurance at our desk and collect your briefing pack. Flying without a valid licence and insurance is strictly prohibited.","Commercial operations (filming, advertising flights, tandem flights) require SHGM commercial permits. Contact us if you need assistance with commercial permit applications."],tr:["Babadağ'da uçmak için üçüncü şahıs sorumluluk sigortası zorunludur. BHPA ve DHV üyelikleri Türkiye'de uçarken bu kapsamı içerir."],de:["Haftpflichtversicherung ist am Babadağ Pflicht. BHPA- und DHV-Mitgliedschaften beinhalten diese Deckung beim Fliegen in der Türkei."],ru:["Страхование гражданской ответственности обязательно для полётов на Бабадаге. Членство в BHPA и DHV включает эту страховку при полётах в Турции."]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c0d/dOEuj7ebfM-MdyvUcunPD.jpg" />
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
