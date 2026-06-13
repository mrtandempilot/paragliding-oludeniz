import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Corporate Group Paragliding",tr:"Kurumsal Grup Paraşütü",de:"Firmengruppenparagliding",ru:"Корпоративный парапланеризм"}
  const d = {en:"Team-building and corporate events with paragliding at Oludeniz.",tr:"Oludeniz'de paraşütle ekip oluşturma ve kurumsal etkinlikler.",de:"Teambuilding und Firmenevents mit Paragliding in Oludeniz.",ru:"Тимбилдинг и корпоративные мероприятия с парапланеризмом в Олюдениз."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/groups/corporate'),
    openGraph: { url: localeUrl(locale, '/groups/corporate'), description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'groups' })
  const titles = {en:"Corporate Group Paragliding",tr:"Kurumsal Grup Paraşütü",de:"Firmengruppenparagliding",ru:"Корпоративный парапланеризм"}
  const subs = {en:"Team-building and corporate events with paragliding at Oludeniz.",tr:"Oludeniz'de paraşütle ekip oluşturma ve kurumsal etkinlikler.",de:"Teambuilding und Firmenevents mit Paragliding in Oludeniz.",ru:"Тимбилдинг и корпоративные мероприятия с парапланеризмом в Олюдениз."}
  const bodies = {en:["Paragliding is an extraordinary team-building activity. Watching your colleagues conquer their fear of heights and land on the beach creates shared memories that no boardroom exercise can replicate.","We handle all logistics for corporate groups: hotel pick-up, transfer to launch, individual flight slots, group photography package, and a debrief session on the beach.","Corporate packages include priority booking, dedicated group coordinator, professional photography and video package, branded merchandise options, and catering arrangements on request.","Suitable for groups of 4-50. Minimum 48 hours notice required. Contact us for a custom corporate quote."],tr:["Paraşüt olağanüstü bir ekip oluşturma aktivitesidir. 4-50 kişilik gruplar için uygundur. Özel kurumsal teklif için bize ulaşın."],de:["Paragliding ist eine außergewöhnliche Teambuilding-Aktivität. Geeignet für Gruppen von 4-50 Personen. Kontaktieren Sie uns für ein maßgeschneidertes Angebot."],ru:["Парапланеризм — исключительная тимбилдинговая активность. Подходит для групп 4-50 человек. Свяжитесь с нами для индивидуального корпоративного предложения."]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c09/2htlcwkJ6pcLBY7gPtf7z.jpg" />
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
