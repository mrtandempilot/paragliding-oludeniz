import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Babadag Cable Car (Teleferik)",tr:"Babadag Teleferik",de:"Babadag Seilbahn (Teleferik)",ru:"Канатная дорога Бабадаг (Телеферик)"}
  const d = {en:"The Babadağ cable car — an alternative to the mountain road.",tr:"Babadağ teleferik — dağ yoluna bir alternatif.",de:"Die Babadağ-Seilbahn — eine Alternative zur Bergstraße.",ru:"Канатная дорога Бабадаг — альтернатива горной дороге."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/babadag-teleferik'),
    openGraph: { url: localeUrl(locale, '/babadag-teleferik'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'babadagGuide' })
  const titles = {en:"Babadag Cable Car (Teleferik)",tr:"Babadag Teleferik",de:"Babadag Seilbahn (Teleferik)",ru:"Канатная дорога Бабадаг (Телеферик)"}
  const subs = {en:"The Babadağ cable car — an alternative to the mountain road.",tr:"Babadağ teleferik — dağ yoluna bir alternatif.",de:"Die Babadağ-Seilbahn — eine Alternative zur Bergstraße.",ru:"Канатная дорога Бабадаг — альтернатива горной дороге."}
  const bodies = {en:["The Babadağ teleferik (cable car) runs from a base station near the Oludeniz main road up to the 1960m summit. It is primarily a tourist attraction and panoramic ride, but is also used by some pilots to access the upper launch points.","Operation times: typically 08:00-20:00 daily in season, weather permitting. Tickets are available at the base station. The journey takes approximately 20 minutes and provides spectacular views over the bay.","For paragliding: passengers who wish to hike up from the summit or access the 1960m launch can use the cable car. Note that all tandem paragliding with our operation uses road transfers, which are faster and more flexible.","The cable car is very popular — queues can be long in July and August. Visit early morning or late afternoon for shorter waits."],tr:["Babadağ teleferik, Oludeniz ana yolunun yakınındaki bir alt istasyondan 1960m zirvesine çıkar. Yolculuk yaklaşık 20 dakika sürer. Temmuz ve Ağustos'ta kuyruklar uzun olabilir — daha kısa bekleme için sabah erken ya da öğleden sonra geç saatlerde gidin."],de:["Die Babadağ-Seilbahn fährt von einer Basisstation nahe der Oludeniz-Hauptstraße bis zum 1960m-Gipfel. Die Fahrt dauert ca. 20 Minuten. Im Juli und August können die Warteschlangen lang sein."],ru:["Канатная дорога Бабадаг идёт от базовой станции у главной дороги Олюдениза до вершины 1960м. Поездка занимает около 20 минут. В июле и августе очереди могут быть длинными."]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c08/BbYEw0ihhZaLcaN29vTrs.jpg" />
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
