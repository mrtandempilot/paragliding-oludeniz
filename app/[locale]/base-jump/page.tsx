import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Base Jumping Oludeniz",tr:"Oludeniz Base Jumping",de:"Base-Jumping Oludeniz",ru:"Бэйс-джампинг Олюдениз"}
  return { title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'baseJump' })
  const titles = {en:"Base Jumping Oludeniz",tr:"Oludeniz Base Jumping",de:"Base-Jumping Oludeniz",ru:"Бэйс-джампинг Олюдениз"}
  const subs = {en:"Oludeniz is a renowned base jumping location in Turkey.",tr:"Oludeniz, Türkiye'de tanınmış bir base jumping lokasyonudur.",de:"Oludeniz ist ein bekannter Base-Jumping-Standort in der Türkei.",ru:"Олюдениз — известное место для бэйс-джампинга в Турции."}
  const bodies: Record<string,string[]> = {
    en: ["Oludeniz and the surrounding Babadağ cliffs and Butterfly Valley have attracted base jumpers since the 1990s. The area offers limestone cliffs of various heights and aspects, with safe water landings available in the bay.","All base jumping in Turkey requires permits from SHGM and local authorities. Permit requirements change periodically — contact us before planning a trip. We can connect you with the local base jumping community.","We do not operate base jumping as a commercial activity, but we support the community and can provide information on the area, current permit status, and local contacts."],
    tr: ["Oludeniz ve çevresi, 1990'lardan beri base jumping tutkunlarını çekmektedir. Türkiye'de tüm base jumping faaliyetleri SHGM izni gerektirmektedir.","Base jumping ticari bir faaliyet olarak işletmiyoruz, ancak yerel topluluğu destekliyor ve bilgi sağlıyoruz."],
    de: ["Oludeniz and the surrounding Babadağ cliffs and Butterfly Valley have attracted base jumpers since the 1990s. The area offers limestone cliffs of various heights and aspects, with safe water landings available in the bay.","All base jumping in Turkey requires permits from SHGM and local authorities. Permit requirements change periodically — contact us before planning a trip. We can connect you with the local base jumping community.","We do not operate base jumping as a commercial activity, but we support the community and can provide information on the area, current permit status, and local contacts."],
    ru: ["Oludeniz and the surrounding Babadağ cliffs and Butterfly Valley have attracted base jumpers since the 1990s. The area offers limestone cliffs of various heights and aspects, with safe water landings available in the bay.","All base jumping in Turkey requires permits from SHGM and local authorities. Permit requirements change periodically — contact us before planning a trip. We can connect you with the local base jumping community.","We do not operate base jumping as a commercial activity, but we support the community and can provide information on the area, current permit status, and local contacts."],
  }
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = bodies[locale]||bodies.en
  return (
    <>
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c0e/5dF2dxA0ErV0Pcg9kh6CJ.jpg" />
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3"><BreadcrumbNav items={[{ label: title }]} /></div>
      </div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl space-y-4">
          {body.map((p, i) => <p key={i} className="text-slate-600 leading-relaxed">{p}</p>)}
        </div>
      </section>
      <BookingCTA />
    </>
  )
}
