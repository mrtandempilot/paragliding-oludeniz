import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { localeAlternates, localeUrl } from '@/lib/seo'

type Video = { id: string; title: string; desc: string }
type C = { title: string; sub: string; intro: string; videos: Video[]; channelCta: string }

const VIDEO_IDS = { women: 'LbEVpV-Iso0', xc: '3ca4LPORpZ0', kids: 'FAVJ2B7QA_E' }

const CONTENT: Record<string, C> = {
  en: {
    title: 'Flight Videos',
    sub: 'Real flights, real passengers — filmed over the Blue Lagoon.',
    intro: 'Every video below was filmed by our own pilots during real tandem flights from Babadağ. No stock footage, no drone tricks — this is exactly what your flight will look like. A professional photo & video package is available as a $35 add-on on every Atmos flight, so after you land you can take home a film like these of your own.',
    videos: [
      { id: VIDEO_IDS.women, title: 'Fly with a Woman Pilot', desc: 'One of our women tandem pilots takes a passenger over the lagoon — calm, professional and unforgettable.' },
      { id: VIDEO_IDS.xc, title: 'Cross-Country Flight', desc: 'Beyond the tandem classic: cross-country flying along the Lycian coast for licensed pilots.' },
      { id: VIDEO_IDS.kids, title: 'Flying with Children', desc: 'Tandem paragliding is a family experience — here’s what a flight with kids looks like.' },
    ],
    channelCta: 'More videos on our YouTube channel',
  },
  tr: {
    title: 'Uçuş Videoları',
    sub: 'Gerçek uçuşlar, gerçek yolcular — Kumburnu üzerinde çekildi.',
    intro: 'Aşağıdaki her video, Babadağ’dan yapılan gerçek tandem uçuşlarda kendi pilotlarımız tarafından çekildi. Stok görüntü yok, drone numarası yok — uçuşunuz tam olarak böyle görünecek. Her Atmos uçuşunda profesyonel foto & video paketi $35 karşılığında ek hizmet olarak sunulur; indiğinizde siz de kendi uçuşunuzun böyle bir filmiyle dönebilirsiniz.',
    videos: [
      { id: VIDEO_IDS.women, title: 'Kadın Pilotla Uçuş', desc: 'Kadın tandem pilotlarımızdan biri yolcusunu lagün üzerinde uçuruyor — sakin, profesyonel ve unutulmaz.' },
      { id: VIDEO_IDS.xc, title: 'XC (Yol) Uçuşu', desc: 'Klasik tandemin ötesi: lisanslı pilotlar için Likya kıyısı boyunca yol uçuşu.' },
      { id: VIDEO_IDS.kids, title: 'Çocuklarla Uçuş', desc: 'Tandem yamaç paraşütü bir aile deneyimidir — çocuklarla uçuş böyle görünüyor.' },
    ],
    channelCta: 'Daha fazla video YouTube kanalımızda',
  },
  de: {
    title: 'Flugvideos',
    sub: 'Echte Flüge, echte Passagiere — gefilmt über der Blauen Lagune.',
    intro: 'Jedes Video unten wurde von unseren eigenen Piloten bei echten Tandemflügen vom Babadağ gefilmt. Kein Stockmaterial, keine Drohnentricks — genau so wird Ihr Flug aussehen. Bei jedem Atmos-Flug ist ein professionelles Foto- & Videopaket als Zusatzoption für $35 erhältlich; nach der Landung können Sie einen Film wie diesen mit nach Hause nehmen.',
    videos: [
      { id: VIDEO_IDS.women, title: 'Flug mit Pilotin', desc: 'Eine unserer Tandempilotinnen fliegt mit einem Passagier über die Lagune — ruhig, professionell, unvergesslich.' },
      { id: VIDEO_IDS.xc, title: 'Streckenflug', desc: 'Jenseits des Tandem-Klassikers: Streckenfliegen entlang der lykischen Küste für lizenzierte Piloten.' },
      { id: VIDEO_IDS.kids, title: 'Fliegen mit Kindern', desc: 'Tandem-Paragliding ist ein Familienerlebnis — so sieht ein Flug mit Kindern aus.' },
    ],
    channelCta: 'Mehr Videos auf unserem YouTube-Kanal',
  },
  ru: {
    title: 'Видео полётов',
    sub: 'Настоящие полёты, настоящие пассажиры — снято над Голубой лагуной.',
    intro: 'Каждое видео ниже снято нашими пилотами во время настоящих тандемных полётов с Бабадага. Никаких стоковых кадров и дронов — именно так будет выглядеть ваш полёт. В каждом полёте Atmos доступен профессиональный фото- и видеопакет за $35: после посадки вы сможете забрать такой же фильм о собственном полёте.',
    videos: [
      { id: VIDEO_IDS.women, title: 'Полёт с женщиной-пилотом', desc: 'Одна из наших женщин-пилотов летит с пассажиром над лагуной — спокойно, профессионально, незабываемо.' },
      { id: VIDEO_IDS.xc, title: 'Маршрутный полёт (XC)', desc: 'За пределами классического тандема: маршрутные полёты вдоль ликийского побережья для лицензированных пилотов.' },
      { id: VIDEO_IDS.kids, title: 'Полёты с детьми', desc: 'Тандемный параплан — семейное приключение. Вот как выглядит полёт с детьми.' },
    ],
    channelCta: 'Больше видео на нашем YouTube-канале',
  },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const c = CONTENT[locale] || CONTENT.en
  const d: Record<string, string> = {
    en: 'Watch real tandem paragliding flights over Oludeniz: woman pilots, cross-country and family flights, filmed from Babadağ by Atmos pilots.',
    tr: 'Ölüdeniz üzerinde gerçek tandem uçuş videoları: kadın pilotlar, XC ve aile uçuşları — Babadağ’dan Atmos pilotlarınca çekildi.',
    de: 'Echte Tandemflüge über Ölüdeniz im Video: Pilotinnen, Streckenflüge und Familienflüge, gefilmt vom Babadağ.',
    ru: 'Настоящие тандемные полёты над Олюденизом на видео: женщины-пилоты, маршрутные и семейные полёты с Бабадага.',
  }
  return {
    title: c.title,
    description: d[locale] || d.en,
    alternates: localeAlternates(locale, '/videos'),
    openGraph: { url: localeUrl(locale, '/videos'), title: c.title, description: d[locale] || d.en },
    twitter: { card: 'summary_large_image', description: d[locale] || d.en },
  }
}

export default async function VideosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const c = CONTENT[locale] || CONTENT.en

  const videoSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: c.videos.map((v, i) => ({
      '@type': 'VideoObject',
      position: i + 1,
      name: v.title,
      description: v.desc,
      thumbnailUrl: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
      embedUrl: `https://www.youtube.com/embed/${v.id}`,
      contentUrl: `https://www.youtube.com/watch?v=${v.id}`,
      publisher: { '@type': 'Organization', name: 'Atmos Paragliding', url: 'https://www.atmosparagliding.com' },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }} />
      <PageHero title={c.title} subtitle={c.sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c09/2htlcwkJ6pcLBY7gPtf7z.jpg" />
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3"><BreadcrumbNav items={[{ label: c.title }]} /></div>
      </div>

      <section className="section-padding bg-white">
        <div className="container-default max-w-4xl">
          <p className="text-slate-700 leading-relaxed mb-10 max-w-3xl">{c.intro}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {c.videos.map((v) => (
              <div key={v.id} className="card overflow-hidden">
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${v.id}`}
                    title={v.title}
                    loading="lazy"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                <div className="p-5">
                  <h2 className="font-bold text-slate-900 mb-1">{v.title}</h2>
                  <p className="text-sm text-slate-600">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-10">
            <a href="https://www.youtube.com/@atmosparagliding" target="_blank" rel="noopener noreferrer" className="text-orange-600 font-medium hover:underline">
              {c.channelCta} →
            </a>
          </p>
        </div>
      </section>

      <BookingCTA />
    </>
  )
}
