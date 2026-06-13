import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Butterfly Valley Paragliding",tr:"Kelebek Vadisi Paraşütü",de:"Schmetterlingstal Paragliding",ru:"Парапланеризм над Долиной Бабочек"}
  const d = {en:"Soar above one of Turkey's most stunning natural wonders.",tr:"Türkiye'nin en etkileyici doğal harikalarından birinin üzerinde süzülün.",de:"Gleiten Sie über eines der atemberaubendsten Naturwunder der Türkei.",ru:"Парите над одним из самых впечатляющих природных чудес Турции."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/butterfly-valley-paragliding'),
    openGraph: { url: localeUrl(locale, '/butterfly-valley-paragliding'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'butterfly' })
  const titles = {en:"Butterfly Valley Paragliding",tr:"Kelebek Vadisi Paraşütü",de:"Schmetterlingstal Paragliding",ru:"Парапланеризм над Долиной Бабочек"}
  const subs = {en:"Soar above one of Turkey's most stunning natural wonders.",tr:"Türkiye'nin en etkileyici doğal harikalarından birinin üzerinde süzülün.",de:"Gleiten Sie über eines der atemberaubendsten Naturwunder der Türkei.",ru:"Парите над одним из самых впечатляющих природных чудес Турции."}
  const bodies = {en:["Butterfly Valley (Kelebek Vadisi) is a stunning, steep-sided canyon just south of Oludeniz, accessible only by boat or a difficult cliff path. From the air, it is one of the most dramatic landscapes in Turkey.","Every paragliding flight from Babadağ passes alongside or directly above Butterfly Valley. Your pilot will point it out during your flight and you can ask to extend your time over the valley if conditions allow.","The valley is named after the Jersey Tiger moth, which breeds here in large numbers. The valley floor contains a small beach, a waterfall, and camping facilities for those arriving by boat.","Butterfly Valley is visible from launch on a clear day — a deep green canyon cutting through the limestone cliffs to a white pebble beach. From 1200m altitude, the full scale of the valley is impossible to appreciate from ground level."],tr:["Kelebek Vadisi, yalnızca tekne veya zorlu bir kayalık yolla ulaşılabilen çarpıcı bir kanyondur. Havadan bakıldığında Türkiye'nin en dramatik manzaralarından biridir.","Babadağ'dan her paraşüt uçuşu Kelebek Vadisi'nin yanından veya üzerinden geçer."],de:["Das Schmetterlingstal ist ein atemberaubender, steilwandiger Canyon südlich von Oludeniz. Jeder Paragliding-Flug vom Babadağ führt an oder über das Schmetterlingstal."],ru:["Долина Бабочек — потрясающий каньон к югу от Олюдениза. Каждый полёт с Бабадага проходит вдоль или прямо над Долиной Бабочек."]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7bd4/rtDjiycQ-CNoCYjmlrN3-.jpg" />
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
