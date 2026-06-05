import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Licence Recognition",tr:"Lisans Tanınması",de:"Lizenzanerkennung",ru:"Признание лицензий"}
  return { title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'training' })
  const titles = {en:"Licence Recognition",tr:"Lisans Tanınması",de:"Lizenzanerkennung",ru:"Признание лицензий"}
  const subs = {en:"Foreign paragliding licences at Oludeniz.",tr:"Oludeniz'de yabancı paraşüt lisansları.",de:"Ausländische Paragliding-Lizenzen in Oludeniz.",ru:"Иностранные лицензии парапланеризма в Олюдениз."}
  const bodies = {en:["Turkey recognizes paragliding licences issued by CIVL member nations under the CIVL reciprocal licence agreement. This includes BHPA (UK), DHV (Germany), FFVL (France), PMA (Australia), and most other national associations.","To fly solo at Babadağ with a foreign licence: present your licence card and logbook at our operations desk on arrival. We will confirm your eligibility and issue a briefing pack covering local airspace, procedures, and emergency contacts.","Insurance: third-party liability insurance is mandatory to fly at Babadağ. BHPA and DHV memberships include this. If your association does not provide cover in Turkey, we can advise on suitable policies.","Note: SHGM periodically updates its reciprocal recognition list. Contact us before your visit to confirm your licence is currently recognized."],tr:["Türkiye, CIVL üyesi uluslar tarafından verilen lisansları tanır. Babadağ'da yabancı lisansla uçmak için varışta operasyon masamıza lisans kartınızı ve kayıt defterinizi gösterin."],de:["Die Türkei erkennt Lizenzen der CIVL-Mitgliedsnationen an. Um mit einer ausländischen Lizenz am Babadağ zu fliegen, präsentieren Sie Ihre Lizenzkarte bei unserem Operationsdesk."],ru:["Турция признаёт лицензии стран-членов CIVL. Для полётов на Бабадаге с иностранной лицензией предъявите карту лицензии на нашем операционном столе по прибытии."]}
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
