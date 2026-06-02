import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Babadağ Mountain Guide",tr:"Babadağ Rehberi",de:"Babadağ-Bergführer",ru:"Путеводитель по горе Бабадаг"}
  return { title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'babadagGuide' })
  const titles = {en:"Babadağ Mountain Guide",tr:"Babadağ Rehberi",de:"Babadağ-Bergführer",ru:"Путеводитель по горе Бабадаг"}
  const subs = {en:"Everything you need to know about the legendary Babadağ paragliding mountain.",tr:"Efsanevi Babadağ paraşüt dağı hakkında bilmeniz gereken her şey.",de:"Alles über den legendären Babadağ-Paragliding-Berg.",ru:"Всё о легендарной горе Бабадаг для парапланеризма."}
  const bodies: Record<string,string[]> = {
    en: ["Babadağ Mountain (1960m) rises directly above Oludeniz beach and the Blue Lagoon, making it one of the most spectacular paragliding sites in the world. The mountain offers four separate launch points between 1200m and 1960m for different skill levels.","Access: by mountain road (30-35 min from Oludeniz) or cable car (teleferik). Tandem flight transfers are included in all our packages.","Flying season: April to October. Peak months for perfect conditions are May-June and September-October.","Explore the guide sections below for detailed information on launch points, landing zones, weather, and access."],
    tr: ["Babadağ (1960m), Oludeniz plajının ve Mavi Lagünün hemen üzerinde yükselerek dünyanın en muhteşem paraşüt noktalarından biri olmaktadır. 1200m ile 1960m arasında farklı beceri seviyeleri için dört ayrı kalkış noktası sunar.","Erişim: dağ yoluyla (Oludeniz'den 30-35 dk) veya teleferikle. Uçuş sezonu Nisan'dan Ekim'e kadardır."],
    de: ["Babadağ Mountain (1960m) rises directly above Oludeniz beach and the Blue Lagoon, making it one of the most spectacular paragliding sites in the world. The mountain offers four separate launch points between 1200m and 1960m for different skill levels.","Access: by mountain road (30-35 min from Oludeniz) or cable car (teleferik). Tandem flight transfers are included in all our packages.","Flying season: April to October. Peak months for perfect conditions are May-June and September-October.","Explore the guide sections below for detailed information on launch points, landing zones, weather, and access."],
    ru: ["Babadağ Mountain (1960m) rises directly above Oludeniz beach and the Blue Lagoon, making it one of the most spectacular paragliding sites in the world. The mountain offers four separate launch points between 1200m and 1960m for different skill levels.","Access: by mountain road (30-35 min from Oludeniz) or cable car (teleferik). Tandem flight transfers are included in all our packages.","Flying season: April to October. Peak months for perfect conditions are May-June and September-October.","Explore the guide sections below for detailed information on launch points, landing zones, weather, and access."],
  }
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = bodies[locale]||bodies.en
  return (
    <>
      <PageHero title={title} subtitle={sub} size="sm" />
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
