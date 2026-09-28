import Link from 'next/link'

type SeoLink = { href: string; label: string }
type SeoContent = {
  title: string
  p1: string
  h2: string; p2: string
  h3: string; p3: string
  h4: string; p4: string
  linksTitle: string
  links: SeoLink[]
  h5: string; p5: string
}

const CONTENT: Record<string, SeoContent> = {
  en: {
    title: 'Paragliding in Ölüdeniz — Where Your Flight Begins',
    p1: 'Every morning from April to November, wings fill the sky between Babadağ and the Blue Lagoon. Ölüdeniz isn’t just Turkey’s paragliding capital — it’s one of the three most famous flying sites in the world, drawing over 100,000 tandem passengers every season. The reason is simple geography: nowhere else does a 1,960-metre launch, dependable coastal thermals and a soft beach landing sit within a single ten-minute glide.',
    h2: 'A flight, not just a ride',
    p2: 'A tandem flight here lasts 25–45 minutes — long enough to circle the lagoon, look down on Butterfly Valley’s 100-metre waterfall cliffs, and pick out your hotel on the coastline before touching down on Belcekız Beach. Your pilot handles everything; you just run a few steps and the Aegean does the rest.',
    h3: 'Flown by locals, owned by pilots',
    p3: 'Atmos Paragliding is a pilot-owned team that has launched from Babadağ for more than 25 years — through every wind pattern, every season, thousands of takeoffs. All our pilots hold SHGM licences, every flight is insured, and equipment is checked each morning before the first shuttle leaves. When you book with us, you’re booking the people who actually fly you — not a call centre.',
    h4: 'Simple, honest pricing',
    p4: 'Tandem flights are $150 per person, all-inclusive: transfer, all equipment, beach landing and a professional photo & video package are all included — one fixed price, no add-ons, no discounts. If the weather turns, we reschedule free or you don’t pay.',
    linksTitle: 'Plan your flight',
    links: [
      { href: '/tandem-paragliding', label: 'Tandem Paragliding — everything about your first flight' },
      { href: '/prices', label: 'Prices — packages and what’s included' },
      { href: '/babadag-guide', label: 'Babadağ Guide — the mountain, takeoffs and cable car' },
      { href: '/weather-guide', label: 'Weather Guide — the best months and daily conditions' },
    ],
    h5: 'Getting here is easy',
    p5: 'Ölüdeniz is 15 km from Fethiye and about an hour from Dalaman Airport (DLM). Flights run daily in season — morning slots are calmest, sunset slots are unforgettable. In July and August, book two or three days ahead.',
  },
  tr: {
    title: 'Ölüdeniz’de Yamaç Paraşütü — Uçuşunuz Burada Başlar',
    p1: 'Nisan’dan Kasım’a her sabah, Babadağ ile Kumburnu arasındaki gökyüzü kanatlarla dolar. Ölüdeniz sadece Türkiye’nin yamaç paraşütü başkenti değil — her sezon 100.000’den fazla tandem yolcusunu ağırlayan, dünyanın en ünlü üç uçuş noktasından biridir. Sebebi basit bir coğrafya: 1.960 metrelik kalkış, güvenilir kıyı termikleri ve yumuşak plaj inişi başka hiçbir yerde tek bir on dakikalık süzülüşün içine sığmaz.',
    h2: 'Sıradan bir tur değil, gerçek bir uçuş',
    p2: 'Burada tandem uçuş 25–45 dakika sürer — lagünün üzerinde tur atmaya, Kelebekler Vadisi’nin 100 metrelik şelale kayalıklarına yukarıdan bakmaya ve Belcekız Plajı’na inmeden önce kıyıda otelinizi seçmeye yetecek kadar. Her şeyi pilotunuz halleder; siz birkaç adım koşarsınız, gerisini Ege yapar.',
    h3: 'Yerel ekip, pilotların şirketi',
    p3: 'Atmos Paragliding, 25 yılı aşkın süredir Babadağ’dan havalanan, pilotların sahibi olduğu bir ekiptir — her rüzgâr düzeninde, her sezonda, binlerce kalkışta. Tüm pilotlarımız SHGM lisanslıdır, her uçuş sigortalıdır ve ekipman her sabah ilk servis kalkmadan kontrol edilir. Bizden rezervasyon yaptığınızda çağrı merkezine değil, sizi gerçekten uçuran insanlara rezervasyon yaparsınız.',
    h4: 'Basit ve dürüst fiyatlandırma',
    p4: 'Tandem uçuşlar kişi başı $150’dır ve her şey dahildir: transfer, tüm ekipman, plaja iniş ve profesyonel foto-video paketi dahildir — tek sabit fiyat, ek ücret yok, indirim yok. Hava bozarsa ücretsiz erteleriz ya da ödeme almayız.',
    linksTitle: 'Uçuşunuzu planlayın',
    links: [
      { href: '/tandem-paragliding', label: 'Tandem Yamaç Paraşütü — ilk uçuşunuz hakkında her şey' },
      { href: '/prices', label: 'Fiyatlar — paketler ve dahil olanlar' },
      { href: '/babadag-guide', label: 'Babadağ Rehberi — dağ, kalkış noktaları ve teleferik' },
      { href: '/weather-guide', label: 'Hava Durumu Rehberi — en iyi aylar ve günlük koşullar' },
    ],
    h5: 'Ulaşım çok kolay',
    p5: 'Ölüdeniz, Fethiye’ye 15 km, Dalaman Havalimanı’na (DLM) yaklaşık bir saat uzaklıktadır. Sezonda uçuşlar her gün yapılır — sabah saatleri en sakinidir, gün batımı uçuşları unutulmazdır. Temmuz ve Ağustos’ta iki üç gün önceden rezervasyon yapın.',
  },
  de: {
    title: 'Paragliding in Ölüdeniz — hier beginnt Ihr Flug',
    p1: 'Von April bis November füllen jeden Morgen Gleitschirme den Himmel zwischen Babadağ und der Blauen Lagune. Ölüdeniz ist nicht nur die Paragliding-Hauptstadt der Türkei — es ist eines der drei berühmtesten Fluggebiete der Welt mit über 100.000 Tandempassagieren pro Saison. Der Grund ist simple Geografie: Nirgendwo sonst liegen ein 1.960-Meter-Startplatz, verlässliche Küstenthermik und eine weiche Strandlandung in einem einzigen zehnminütigen Gleitflug.',
    h2: 'Ein Flug, keine blosse Attraktion',
    p2: 'Ein Tandemflug dauert hier 25–45 Minuten — genug, um die Lagune zu umkreisen, auf die 100-Meter-Wasserfallklippen des Schmetterlingstals hinabzublicken und Ihr Hotel an der Küste zu entdecken, bevor Sie am Belcekız-Strand landen. Ihr Pilot übernimmt alles; Sie laufen ein paar Schritte, den Rest erledigt die Ägäis.',
    h3: 'Geflogen von Einheimischen, geführt von Piloten',
    p3: 'Atmos Paragliding ist ein pilotengeführtes Team, das seit über 25 Jahren vom Babadağ startet — bei jedem Windmuster, in jeder Saison, mit tausenden Starts. Alle Piloten haben SHGM-Lizenzen, jeder Flug ist versichert, die Ausrüstung wird jeden Morgen geprüft. Wer bei uns bucht, bucht die Menschen, die ihn tatsächlich fliegen — kein Callcenter.',
    h4: 'Einfache, ehrliche Preise',
    p4: 'Tandemflüge kosten $150 pro Person — alles inklusive: Transfer, komplette Ausrüstung, Strandlandung und ein professionelles Foto- und Videopaket sind bereits enthalten — ein Festpreis, keine Zusatzkosten, keine Rabatte. Bei Wetterumschwung verschieben wir kostenlos oder Sie zahlen nichts.',
    linksTitle: 'Planen Sie Ihren Flug',
    links: [
      { href: '/tandem-paragliding', label: 'Tandem-Paragliding — alles über Ihren ersten Flug' },
      { href: '/prices', label: 'Preise — Pakete und Leistungen' },
      { href: '/babadag-guide', label: 'Babadağ-Guide — Berg, Startplätze und Seilbahn' },
      { href: '/weather-guide', label: 'Wetter-Guide — die besten Monate und Bedingungen' },
    ],
    h5: 'Die Anreise ist einfach',
    p5: 'Ölüdeniz liegt 15 km von Fethiye und etwa eine Stunde vom Flughafen Dalaman (DLM) entfernt. In der Saison wird täglich geflogen — morgens am ruhigsten, zum Sonnenuntergang unvergesslich. Im Juli und August zwei bis drei Tage im Voraus buchen.',
  },
  ru: {
    title: 'Параплан в Олюденизе — ваш полёт начинается здесь',
    p1: 'Каждое утро с апреля по ноябрь небо между Бабадагом и Голубой лагуной наполняется крыльями. Олюдениз — не просто парапланерная столица Турции, это одно из трёх самых известных лётных мест мира: более 100 000 тандемных пассажиров за сезон. Причина — простая география: нигде больше старт с 1960 метров, стабильные прибрежные термики и мягкая посадка на пляж не умещаются в один десятиминутный полёт.',
    h2: 'Полёт, а не аттракцион',
    p2: 'Тандемный полёт здесь длится 25–45 минут — достаточно, чтобы облететь лагуну, посмотреть сверху на 100-метровые скалы Долины бабочек и найти свой отель на побережье, прежде чем приземлиться на пляже Бельджекиз. Пилот делает всё; вы пробегаете несколько шагов — остальное сделает Эгейское море.',
    h3: 'Местная команда, принадлежащая пилотам',
    p3: 'Atmos Paragliding — команда, принадлежащая самим пилотам, стартующая с Бабадага более 25 лет: в любой ветер, в любой сезон, тысячи взлётов. Все пилоты имеют лицензии SHGM, каждый полёт застрахован, снаряжение проверяется каждое утро. Бронируя у нас, вы бронируете людей, которые действительно с вами летят, — а не колл-центр.',
    h4: 'Простые и честные цены',
    p4: 'Тандемные полёты стоят $150 с человека, и всё уже включено: трансфер, всё снаряжение, посадка на пляж и профессиональный фото- и видеопакет — единая цена, без доплат и скидок. При плохой погоде мы бесплатно переносим полёт или вы не платите.',
    linksTitle: 'Спланируйте свой полёт',
    links: [
      { href: '/tandem-paragliding', label: 'Тандемный полёт — всё о вашем первом полёте' },
      { href: '/prices', label: 'Цены — пакеты и что включено' },
      { href: '/babadag-guide', label: 'Гид по Бабадагу — гора, старты и канатная дорога' },
      { href: '/weather-guide', label: 'Погодный гид — лучшие месяцы и условия' },
    ],
    h5: 'Добраться легко',
    p5: 'Олюдениз находится в 15 км от Фетхие и примерно в часе от аэропорта Даламан (DLM). В сезон полёты ежедневно: утро — самое спокойное время, закат — самое незабываемое. В июле и августе бронируйте за два-три дня.',
  }, zh: {
    title: "厄卢代尼兹滑翔伞——您的飞行从这里开始",
    p1: "从 4 月到 11 月，每天早上巴巴达山和蓝色泻湖之间的天空都布满了伞翼。厄卢代尼兹不仅是土耳其的滑翔伞之都——它还是世界上最著名的三大飞行场地之一，每个飞行季吸引超过 100,000 名双人飞行乘客。原因很简单，就是地理条件：没有其他地方能在短短十分钟的滑翔距离内，同时拥有 1960 米的起飞点、可靠的沿海热气流和柔软的海滩降落区。",
    h2: "这是一次飞行，而不只是一次乘坐",
    p2: "在这里，一次双人飞行持续 25–45 分钟——足够您绕着泻湖盘旋，俯瞰蝴蝶谷 100 米高的瀑布悬崖，在海岸线上找出您的酒店，然后降落在贝尔杰克兹海滩。一切都由飞行员负责；您只需跑几步，剩下的就交给爱琴海。",
    h3: "本地人带飞，飞行员自营",
    p3: "Atmos Paragliding 是一支由飞行员自主经营的团队，在巴巴达山起飞已超过 25 年——经历过各种风况、各个季节、成千上万次起飞。我们所有的飞行员都持有土耳其民航总局（SHGM）执照，每次飞行都有保险，每天早上第一班班车出发前都会检查装备。选择我们，就是直接预订真正带您飞行的人——而不是呼叫中心。",
    h4: "简单、诚实的价格",
    p4: "双人飞行每人 150 美元，全包：接送、全部装备、海滩降落以及专业照片和视频套餐全部包含——一口价，无附加费用，无折扣。如果天气变坏，我们免费为您改期，或者您无需付费。",
    linksTitle: "规划您的飞行",
    links: [
      { href: '/tandem-paragliding', label: "双人滑翔伞——关于您首次飞行的一切" },
      { href: '/prices', label: "价格——套餐及包含内容" },
      { href: '/babadag-guide', label: "巴巴达山指南——山峰、起飞点和缆车" },
      { href: '/weather-guide', label: "天气指南——最佳月份和每日天气条件" },
    ],
    h5: "交通便利",
    p5: "厄卢代尼兹距费特希耶 15 公里，距达拉曼机场（DLM）约一小时车程。飞行季期间每天都有飞行——上午时段最平静，日落时段最难忘。7 月和 8 月请提前两三天预订。",
  },
}

export default function HomeSeoIntro({ locale }: { locale: string }) {
  const c = CONTENT[locale] || CONTENT.en
  const lp = (href: string) => (locale === 'en' ? href : `/${locale}${href}`)
  return (
    <section className="section-padding bg-white">
      <div className="container-default max-w-3xl">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">{c.title}</h2>
        <p className="text-slate-700 leading-relaxed mb-8">{c.p1}</p>

        <h3 className="text-xl font-bold text-slate-900 mb-2">{c.h2}</h3>
        <p className="text-slate-700 leading-relaxed mb-8">{c.p2}</p>

        <h3 className="text-xl font-bold text-slate-900 mb-2">{c.h3}</h3>
        <p className="text-slate-700 leading-relaxed mb-8">{c.p3}</p>

        <h3 className="text-xl font-bold text-slate-900 mb-2">{c.h4}</h3>
        <p className="text-slate-700 leading-relaxed mb-8">{c.p4}</p>

        <h3 className="text-xl font-bold text-slate-900 mb-3">{c.linksTitle}</h3>
        <ul className="space-y-2 mb-8">
          {c.links.map((l) => (
            <li key={l.href}>
              <Link href={lp(l.href)} className="text-orange-600 font-medium hover:underline">
                {l.label} →
              </Link>
            </li>
          ))}
        </ul>

        <h3 className="text-xl font-bold text-slate-900 mb-2">{c.h5}</h3>
        <p className="text-slate-700 leading-relaxed">{c.p5}</p>
      </div>
    </section>
  )
}
