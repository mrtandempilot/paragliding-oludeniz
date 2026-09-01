import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import FAQAccordion from '@/components/shared/FAQAccordion'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

type Item = { t: string; d: string }
type FaqItem = { question: string; answer: string }
type C = {
  introTitle: string; intro: string
  launchTitle: string; launchIntro: string; launches: Item[]; cable: string; babadagLink: string
  feelTitle: string; feel: string; feelLink: string
  seasonTitle: string; months: Item[]
  viewsTitle: string; views: string
  pilotsTitle: string; pilots: string; pilotLinks: { href: string; label: string }[]
  practicalTitle: string; practical: string
  faq: FaqItem[]
}

const CONTENT: Record<string, C> = {
  en: {
    introTitle: 'Turkey’s Paragliding Capital',
    intro: 'Ask any paraglider pilot to name the world’s great flying sites and Ölüdeniz will be in the first breath — alongside Interlaken and Queenstown. But neither of those lets you launch from nearly 2,000 metres and land on a Blue Flag beach 25 minutes later. Since the late 1980s, when the first pilots carried their wings up Babadağ’s forest tracks, this corner of Turkey’s Turquoise Coast has grown into the busiest tandem flying site on earth — and it has stayed special because the geography can’t be copied: a high mountain, a protected lagoon, and dependable coastal air, all within one glide.',
    launchTitle: 'Babadağ and Its Four Launch Points',
    launchIntro: 'Babadağ rises to 1,960 metres directly above the beach. Four launch points at different altitudes and orientations mean the mountain almost always has a safe, flyable option:',
    launches: [
      { t: '1,200 m — the training slope', d: 'Lower and gentler; used when upper winds are strong and by student pilots learning the mountain.' },
      { t: '1,700 m — the workhorse', d: 'The classic tandem launch: reliable conditions and a wide ramp facing the lagoon.' },
      { t: '1,800 m — the north launch', d: 'Opens up when wind directions shift, keeping Ölüdeniz flyable when other sites would close.' },
      { t: '1,900 m — near the summit', d: 'The high launch beside the cable-car top station: longest flights, biggest views, coolest air.' },
    ],
    cable: 'Since 2021 the Babadağ cable car carries pilots and passengers from sea level to the summit in under 20 minutes — one of the reasons Ölüdeniz logs more than 300 flyable days a year.',
    babadagLink: 'Explore the full Babadağ Guide',
    feelTitle: 'What a Tandem Flight Here Feels Like',
    feel: 'You don’t jump; you run a few steps and the ground leaves you. The air over the lagoon is smooth enough that most first-timers describe the flight as sitting in an armchair with the world’s best view. Your pilot can keep it calm and scenic, or finish with spirals and wingovers if you ask. Twenty-five to forty-five minutes later you touch down softly on the promenade at Belcekız Beach.',
    feelLink: 'Full step-by-step guide, prices and FAQ on our tandem paragliding page',
    seasonTitle: 'Season Guide, Month by Month',
    months: [
      { t: 'April – May', d: 'The season opens: crisp visibility, green mountainsides, uncrowded launches. Ideal if you prefer quiet mornings.' },
      { t: 'June – August', d: 'Peak season: strongest thermals, longest days and sunset flights at their finest. Book two or three days ahead.' },
      { t: 'September – October', d: 'Many pilots’ favourite months — warm sea, soft light, stable air, and the summer crowds gone.' },
      { t: 'November', d: 'The closing weeks: flyable on good days and quieter than any other time of the year.' },
    ],
    viewsTitle: 'What You See from the Air',
    views: 'The famous postcard view is real: the Blue Lagoon’s sandbar curling into turquoise water directly beneath your feet. Beyond it, Butterfly Valley’s 100-metre cliffs cut into the coast, Gemiler Island scatters Byzantine ruins across the sea, and on clear days the peaks of the Taurus range line the horizon. The flight ends over the beachfront hotels of Belcekız, where you land steps from the water.',
    pilotsTitle: 'For Licensed Pilots',
    pilots: 'Ölüdeniz is not only a tandem destination. Licensed pilots come for cross-country routes along the Lycian coast, world-class acro over the water, and relaxed evening soaring. If you fly solo, start here:',
    pilotLinks: [
      { href: '/solo-paragliding', label: 'Solo flying in Ölüdeniz' },
      { href: '/cross-country-flights', label: 'Cross-country routes' },
      { href: '/acro-flights', label: 'Acro flying' },
    ],
    practicalTitle: 'Practical Guide',
    practical: 'Ölüdeniz is 15 km from Fethiye and about an hour’s drive from Dalaman Airport (DLM). Tandem flights start from $140 including transfer, all equipment, insurance and beach landing — see current packages on our prices page. Booking direct with a local operator means you talk to the pilots themselves on WhatsApp, and rescheduling for weather costs nothing.',
    faq: [
      { question: 'What is the best month for paragliding in Ölüdeniz?', answer: 'Every month from late April to early November is good. June to September is the most reliable; May and October offer clearer air and fewer people. If you want sunset flights at their best, come in high summer.' },
      { question: 'How much does paragliding in Ölüdeniz cost?', answer: 'Tandem flights start from $140, including transfer to the launch, all equipment, insurance and beach landing. Photo and video packages are optional extras.' },
      { question: 'Is paragliding in Ölüdeniz safe?', answer: 'With a licensed professional, yes — it is one of the safest adventure activities. Ölüdeniz has hosted millions of tandem flights over three decades. Choose an operator with SHGM-licensed pilots, insurance on every flight, and daily equipment checks.' },
      { question: 'How do I choose a paragliding operator?', answer: 'Ask three things: are the pilots SHGM-licensed, is every flight insured, and can you see recent, real passenger reviews? A trustworthy operator answers all three instantly. Booking direct — rather than through a street agency — also means you know exactly who is flying you.' },
      { question: 'Can I ride the cable car up and not fly?', answer: 'Yes. The Babadağ cable car sells sightseeing tickets, and many families ride up together while one person flies. The summit café has the best terrace view on the coast.' },
      { question: 'Can children do tandem paragliding?', answer: 'Yes — children fly tandem here regularly. Passengers under 18 need parental consent, and the practical limits are the harness fit and a maximum passenger weight of 110 kg.' },
    ],
  },
  tr: {
    introTitle: 'Türkiye’nin Yamaç Paraşütü Başkenti',
    intro: 'Herhangi bir yamaç paraşütü pilotuna dünyanın en iyi uçuş noktalarını sorun; Ölüdeniz ilk nefeste söylenir — Interlaken ve Queenstown ile birlikte. Ama o ikisi, 2.000 metreye yakın bir kalkıştan 25 dakika sonra Mavi Bayraklı bir plaja inmenize izin vermez. İlk pilotların kanatlarını Babadağ’ın orman yollarından sırtında taşıdığı 1980’lerin sonundan bu yana, Turkuaz Kıyı’nın bu köşesi dünyanın en yoğun tandem uçuş noktası hâline geldi — ve özel kalmasının sebebi kopyalanamayan coğrafyası: yüksek bir dağ, korunaklı bir lagün ve güvenilir kıyı havası, hepsi tek bir süzülüşün içinde.',
    launchTitle: 'Babadağ ve Dört Kalkış Noktası',
    launchIntro: 'Babadağ, plajın hemen üzerinde 1.960 metreye yükselir. Farklı yükseklik ve yönlerdeki dört kalkış noktası sayesinde dağda neredeyse her zaman güvenli, uçulabilir bir seçenek vardır:',
    launches: [
      { t: '1.200 m — eğitim yamacı', d: 'Daha alçak ve sakin; üst rüzgârlar sertken ve öğrenci pilotların dağı öğrenmesinde kullanılır.' },
      { t: '1.700 m — işin yükünü çeken', d: 'Klasik tandem kalkışı: güvenilir koşullar ve lagüne bakan geniş bir rampa.' },
      { t: '1.800 m — kuzey kalkışı', d: 'Rüzgâr yönü değiştiğinde devreye girer; başka sahaların kapanacağı günlerde Ölüdeniz’i uçulabilir tutar.' },
      { t: '1.900 m — zirveye yakın', d: 'Teleferik üst istasyonunun yanındaki yüksek kalkış: en uzun uçuşlar, en büyük manzara, en serin hava.' },
    ],
    cable: '2021’den beri Babadağ Teleferiği pilotları ve yolcuları deniz seviyesinden zirveye 20 dakikanın altında taşıyor — Ölüdeniz’in yılda 300’den fazla uçuş günü kaydetmesinin nedenlerinden biri.',
    babadagLink: 'Babadağ Rehberi’nin tamamına bakın',
    feelTitle: 'Burada Tandem Uçuş Nasıl Bir His?',
    feel: 'Atlamazsınız; birkaç adım koşarsınız ve zemin sizi bırakır. Lagün üzerindeki hava o kadar yumuşaktır ki ilk kez uçanların çoğu uçuşu “dünyanın en iyi manzaralı koltuğunda oturmak” diye anlatır. Pilotunuz uçuşu sakin ve manzaralı tutabilir ya da isterseniz spiral ve wingover’larla bitirebilir. 25–45 dakika sonra Belcekız Plajı’ndaki yürüyüş yoluna yumuşakça inersiniz.',
    feelLink: 'Adım adım rehber, fiyatlar ve SSS için tandem yamaç paraşütü sayfamız',
    seasonTitle: 'Ay Ay Sezon Rehberi',
    months: [
      { t: 'Nisan – Mayıs', d: 'Sezon açılır: berrak görüş, yemyeşil yamaçlar, sakin kalkışlar. Sessiz sabahları sevenler için ideal.' },
      { t: 'Haziran – Ağustos', d: 'Yüksek sezon: en güçlü termikler, en uzun günler ve en iyi hâliyle gün batımı uçuşları. İki üç gün önceden rezervasyon yapın.' },
      { t: 'Eylül – Ekim', d: 'Birçok pilotun favori ayları — sıcak deniz, yumuşak ışık, stabil hava ve dağılmış yaz kalabalığı.' },
      { t: 'Kasım', d: 'Kapanış haftaları: iyi günlerde uçulabilir ve yılın en sakin dönemi.' },
    ],
    viewsTitle: 'Havadan Neler Görürsünüz?',
    views: 'Ünlü kartpostal manzarası gerçek: Kumburnu’nun turkuaz suya kıvrılan kum şeridi tam ayaklarınızın altında. Ötesinde Kelebekler Vadisi’nin 100 metrelik kayalıkları kıyıyı yarar, Gemiler Adası Bizans kalıntılarını denize serper ve açık günlerde Toros zirveleri ufku çizer. Uçuş, Belcekız’ın sahil otelleri üzerinde biter — suya birkaç adım mesafede yere inersiniz.',
    pilotsTitle: 'Lisanslı Pilotlar İçin',
    pilots: 'Ölüdeniz yalnızca bir tandem destinasyonu değildir. Lisanslı pilotlar Likya kıyısı boyunca XC rotaları, su üstünde dünya klasmanında akro ve keyifli akşam soaring’i için gelir. Solo uçuyorsanız buradan başlayın:',
    pilotLinks: [
      { href: '/solo-paragliding', label: 'Ölüdeniz’de solo uçuş' },
      { href: '/cross-country-flights', label: 'XC rotaları' },
      { href: '/acro-flights', label: 'Akro uçuşlar' },
    ],
    practicalTitle: 'Pratik Rehber',
    practical: 'Ölüdeniz, Fethiye’ye 15 km, Dalaman Havalimanı’na (DLM) yaklaşık bir saat mesafededir. Tandem uçuşlar transfer, tüm ekipman, sigorta ve plaja iniş dahil $140’den başlar — güncel paketler için fiyatlar sayfamıza bakın. Yerel operatörden doğrudan rezervasyon, WhatsApp’ta doğrudan pilotlarla konuşmak ve hava nedeniyle ertelemenin ücretsiz olması demektir.',
    faq: [
      { question: 'Ölüdeniz’de yamaç paraşütü için en iyi ay hangisi?', answer: 'Nisan sonundan Kasım başına her ay iyidir. Haziran–Eylül en istikrarlısıdır; Mayıs ve Ekim daha berrak hava ve az kalabalık sunar. Gün batımı uçuşlarının en iyisi için yaz ortasında gelin.' },
      { question: 'Ölüdeniz’de yamaç paraşütü ne kadar?', answer: 'Tandem uçuşlar kalkışa transfer, tüm ekipman, sigorta ve plaja iniş dahil $140’den başlar. Foto ve video paketleri opsiyoneldir.' },
      { question: 'Ölüdeniz’de yamaç paraşütü güvenli mi?', answer: 'Lisanslı bir profesyonelle evet — en güvenli macera aktivitelerinden biridir. Ölüdeniz otuz yılda milyonlarca tandem uçuşa ev sahipliği yaptı. SHGM lisanslı pilotları, her uçuşta sigortası ve günlük ekipman kontrolü olan bir operatör seçin.' },
      { question: 'Operatör nasıl seçilir?', answer: 'Üç şey sorun: pilotlar SHGM lisanslı mı, her uçuş sigortalı mı ve güncel, gerçek yolcu yorumlarını görebiliyor musunuz? Güvenilir bir operatör üçüne de anında cevap verir. Sokak acentesi yerine doğrudan rezervasyon, sizi kimin uçuracağını tam olarak bilmeniz demektir.' },
      { question: 'Teleferikle çıkıp uçmadan inebilir miyim?', answer: 'Evet. Babadağ Teleferiği gezi bileti satar; birçok aile biri uçarken birlikte zirveye çıkar. Zirve kafesinin terası kıyının en iyi manzarasına sahiptir.' },
      { question: 'Çocuklar tandem uçabilir mi?', answer: 'Evet — burada çocuklar düzenli olarak tandem uçuyor. 18 yaş altı için veli onayı gerekir; pratik sınırlar harness uyumu ve 110 kg maksimum yolcu ağırlığıdır.' },
    ],
  },
  de: {
    introTitle: 'Die Paragliding-Hauptstadt der Türkei',
    intro: 'Fragen Sie einen Gleitschirmpiloten nach den grossen Fluggebieten der Welt — Ölüdeniz fällt im ersten Atemzug, neben Interlaken und Queenstown. Doch nirgendwo sonst starten Sie von fast 2.000 Metern und landen 25 Minuten später an einem Strand mit Blauer Flagge. Seit Ende der 1980er, als die ersten Piloten ihre Schirme über Babadağs Waldpfade trugen, ist diese Ecke der Türkisküste zum meistgeflogenen Tandemgebiet der Welt geworden — besonders geblieben ist sie, weil sich die Geografie nicht kopieren lässt: hoher Berg, geschützte Lagune, verlässliche Küstenluft in einem einzigen Gleitflug.',
    launchTitle: 'Der Babadağ und seine vier Startplätze',
    launchIntro: 'Der Babadağ erhebt sich 1.960 Meter direkt über dem Strand. Vier Startplätze auf verschiedenen Höhen und Ausrichtungen bedeuten: Der Berg hat fast immer eine sichere, fliegbare Option:',
    launches: [
      { t: '1.200 m — der Übungshang', d: 'Niedriger und sanfter; genutzt bei starkem Höhenwind und von Flugschülern.' },
      { t: '1.700 m — das Arbeitspferd', d: 'Der klassische Tandemstart: verlässliche Bedingungen, breite Rampe zur Lagune.' },
      { t: '1.800 m — der Nordstart', d: 'Öffnet bei drehendem Wind — hält Ölüdeniz fliegbar, wenn andere Gebiete schliessen würden.' },
      { t: '1.900 m — nahe dem Gipfel', d: 'Der hohe Start neben der Seilbahn-Bergstation: längste Flüge, grösste Aussicht, kühlste Luft.' },
    ],
    cable: 'Seit 2021 bringt die Babadağ-Seilbahn Piloten und Passagiere in unter 20 Minuten vom Meer zum Gipfel — ein Grund, warum Ölüdeniz über 300 fliegbare Tage im Jahr zählt.',
    babadagLink: 'Zum vollständigen Babadağ-Guide',
    feelTitle: 'Wie sich ein Tandemflug hier anfühlt',
    feel: 'Sie springen nicht; Sie laufen ein paar Schritte, und der Boden lässt Sie los. Die Luft über der Lagune ist so ruhig, dass die meisten Erstflieger den Flug als Sessel mit der besten Aussicht der Welt beschreiben. Ihr Pilot hält es ruhig und szenisch — oder beendet den Flug auf Wunsch mit Spiralen und Wingovern. 25 bis 45 Minuten später landen Sie sanft an der Promenade des Belcekız-Strands.',
    feelLink: 'Schritt-für-Schritt-Guide, Preise und FAQ auf unserer Tandem-Seite',
    seasonTitle: 'Saison-Guide, Monat für Monat',
    months: [
      { t: 'April – Mai', d: 'Saisonstart: klare Sicht, grüne Hänge, leere Startplätze. Ideal für ruhige Morgen.' },
      { t: 'Juni – August', d: 'Hochsaison: stärkste Thermik, längste Tage, Sonnenuntergangsflüge in Bestform. Zwei bis drei Tage im Voraus buchen.' },
      { t: 'September – Oktober', d: 'Die Lieblingsmonate vieler Piloten — warmes Meer, weiches Licht, stabile Luft, keine Sommermassen.' },
      { t: 'November', d: 'Die letzten Wochen: an guten Tagen fliegbar und ruhiger als jede andere Zeit.' },
    ],
    viewsTitle: 'Was Sie aus der Luft sehen',
    views: 'Das berühmte Postkartenmotiv ist echt: die Sandbank der Blauen Lagune, die sich direkt unter Ihren Füssen ins Türkis schwingt. Dahinter schneiden die 100-Meter-Klippen des Schmetterlingstals in die Küste, Gemiler Island verstreut byzantinische Ruinen im Meer, und an klaren Tagen zeichnet das Taurusgebirge den Horizont. Der Flug endet über den Strandhotels von Belcekız — Sie landen wenige Schritte vom Wasser.',
    pilotsTitle: 'Für lizenzierte Piloten',
    pilots: 'Ölüdeniz ist nicht nur ein Tandemziel. Lizenzierte Piloten kommen für Streckenflüge entlang der lykischen Küste, Weltklasse-Acro über dem Wasser und entspanntes Abendsoaring. Wer solo fliegt, startet hier:',
    pilotLinks: [
      { href: '/solo-paragliding', label: 'Solofliegen in Ölüdeniz' },
      { href: '/cross-country-flights', label: 'XC-Routen' },
      { href: '/acro-flights', label: 'Acro-Fliegen' },
    ],
    practicalTitle: 'Praktischer Guide',
    practical: 'Ölüdeniz liegt 15 km von Fethiye und rund eine Stunde vom Flughafen Dalaman (DLM). Tandemflüge ab $140 inklusive Transfer, kompletter Ausrüstung, Versicherung und Strandlandung — aktuelle Pakete auf unserer Preisseite. Direkt beim lokalen Veranstalter buchen heisst: WhatsApp-Kontakt zu den Piloten selbst und kostenloses Verschieben bei Wetter.',
    faq: [
      { question: 'Welcher Monat ist der beste für Paragliding in Ölüdeniz?', answer: 'Jeder Monat von Ende April bis Anfang November ist gut. Juni bis September am zuverlässigsten; Mai und Oktober bieten klarere Luft und weniger Menschen. Für die schönsten Sonnenuntergangsflüge im Hochsommer kommen.' },
      { question: 'Was kostet Paragliding in Ölüdeniz?', answer: 'Tandemflüge ab $140, inklusive Transfer zum Startplatz, kompletter Ausrüstung, Versicherung und Strandlandung. Foto- und Videopakete sind optional.' },
      { question: 'Ist Paragliding in Ölüdeniz sicher?', answer: 'Mit einem lizenzierten Profi ja — eine der sichersten Abenteueraktivitäten. Ölüdeniz zählt Millionen Tandemflüge über drei Jahrzehnte. Wählen Sie einen Anbieter mit SHGM-lizenzierten Piloten, Versicherung und täglichen Materialchecks.' },
      { question: 'Wie wähle ich den Anbieter aus?', answer: 'Drei Fragen: Sind die Piloten SHGM-lizenziert? Ist jeder Flug versichert? Gibt es aktuelle, echte Bewertungen? Ein seriöser Anbieter beantwortet alle drei sofort. Direktbuchung statt Strassenagentur heisst ausserdem: Sie wissen genau, wer Sie fliegt.' },
      { question: 'Kann ich mit der Seilbahn hochfahren, ohne zu fliegen?', answer: 'Ja. Die Babadağ-Seilbahn verkauft Panoramatickets; viele Familien fahren gemeinsam hinauf, während einer fliegt. Das Gipfelcafé hat die beste Terrasse der Küste.' },
      { question: 'Können Kinder Tandem fliegen?', answer: 'Ja — Kinder fliegen hier regelmässig Tandem. Unter 18 Jahren ist die Zustimmung der Eltern nötig; praktische Grenzen sind die Gurtzeuggrösse und maximal 110 kg Passagiergewicht.' },
    ],
  },
  ru: {
    introTitle: 'Парапланерная столица Турции',
    intro: 'Спросите любого пилота-парапланериста о великих лётных местах мира — Олюдениз прозвучит на первом дыхании, рядом с Интерлакеном и Куинстауном. Но ни одно из них не позволяет стартовать почти с 2000 метров и через 25 минут приземлиться на пляж с Голубым флагом. С конца 1980-х, когда первые пилоты несли крылья по лесным тропам Бабадага, этот уголок Бирюзового побережья стал самым загруженным тандемным местом на планете — и остался особенным, потому что географию нельзя скопировать: высокая гора, защищённая лагуна и стабильный прибрежный воздух в одном полёте.',
    launchTitle: 'Бабадаг и его четыре старта',
    launchIntro: 'Бабадаг поднимается на 1960 метров прямо над пляжем. Четыре старта на разных высотах и направлениях означают, что у горы почти всегда есть безопасный лётный вариант:',
    launches: [
      { t: '1200 м — учебный склон', d: 'Ниже и спокойнее; используется при сильном верхнем ветре и учениками.' },
      { t: '1700 м — рабочая лошадка', d: 'Классический тандемный старт: надёжные условия и широкая площадка с видом на лагуну.' },
      { t: '1800 м — северный старт', d: 'Открывается при смене ветра — Олюдениз летает, когда другие места закрылись бы.' },
      { t: '1900 м — у вершины', d: 'Высокий старт у верхней станции канатной дороги: самые долгие полёты, самые большие виды.' },
    ],
    cable: 'С 2021 года канатная дорога Бабадага поднимает пилотов и пассажиров от моря до вершины менее чем за 20 минут — одна из причин, почему Олюдениз насчитывает более 300 лётных дней в году.',
    babadagLink: 'Полный гид по Бабадагу',
    feelTitle: 'Каково это — тандемный полёт здесь',
    feel: 'Вы не прыгаете; вы пробегаете несколько шагов, и земля отпускает вас. Воздух над лагуной настолько мягкий, что большинство новичков описывают полёт как кресло с лучшим видом в мире. Пилот может держать полёт спокойным и созерцательным — или закончить спиралями и вингиверами, если попросите. Через 25–45 минут вы мягко приземляетесь на набережной пляжа Бельджекиз.',
    feelLink: 'Пошаговый гид, цены и FAQ — на странице тандемных полётов',
    seasonTitle: 'Сезон по месяцам',
    months: [
      { t: 'Апрель – май', d: 'Открытие сезона: прозрачный воздух, зелёные склоны, свободные старты. Идеально для тихих утренних полётов.' },
      { t: 'Июнь – август', d: 'Пик сезона: самые сильные термики, длинные дни и лучшие закатные полёты. Бронируйте за два-три дня.' },
      { t: 'Сентябрь – октябрь', d: 'Любимые месяцы многих пилотов — тёплое море, мягкий свет, стабильный воздух и никаких толп.' },
      { t: 'Ноябрь', d: 'Последние недели: в хорошие дни летаем, и это самое тихое время года.' },
    ],
    viewsTitle: 'Что видно с высоты',
    views: 'Знаменитый открыточный вид — настоящий: песчаная коса Голубой лагуны изгибается в бирюзе прямо под ногами. Дальше — 100-метровые скалы Долины бабочек, остров Гемилер с византийскими руинами в море, а в ясные дни горизонт очерчивают вершины Тавра. Полёт заканчивается над прибрежными отелями Бельджекиза — вы приземляетесь в нескольких шагах от воды.',
    pilotsTitle: 'Для лицензированных пилотов',
    pilots: 'Олюдениз — не только тандемное направление. Лицензированные пилоты приезжают за маршрутами вдоль ликийского побережья, акро мирового уровня над водой и вечерним парением. Если вы летаете соло — начните отсюда:',
    pilotLinks: [
      { href: '/solo-paragliding', label: 'Соло-полёты в Олюденизе' },
      { href: '/cross-country-flights', label: 'Маршруты XC' },
      { href: '/acro-flights', label: 'Акро-полёты' },
    ],
    practicalTitle: 'Практический гид',
    practical: 'Олюдениз — в 15 км от Фетхие и примерно в часе езды от аэропорта Даламан (DLM). Тандемные полёты — от $140, включая трансфер, всё снаряжение, страховку и посадку на пляж; актуальные пакеты — на странице цен. Прямое бронирование у местного оператора — это WhatsApp с самими пилотами и бесплатный перенос по погоде.',
    faq: [
      { question: 'Какой месяц лучший для полётов в Олюденизе?', answer: 'Хорош каждый месяц с конца апреля до начала ноября. Июнь–сентябрь — самые стабильные; май и октябрь — прозрачный воздух и меньше людей. За лучшими закатными полётами приезжайте в разгар лета.' },
      { question: 'Сколько стоит полёт в Олюденизе?', answer: 'Тандемные полёты — от $140, включая трансфер к старту, всё снаряжение, страховку и посадку на пляж. Фото и видео — опционально.' },
      { question: 'Это безопасно?', answer: 'С лицензированным профессионалом — да, это один из самых безопасных видов активного отдыха. За три десятилетия Олюдениз принял миллионы тандемных полётов. Выбирайте оператора с лицензиями SHGM, страховкой каждого полёта и ежедневной проверкой снаряжения.' },
      { question: 'Как выбрать оператора?', answer: 'Задайте три вопроса: лицензированы ли пилоты SHGM, застрахован ли каждый полёт и есть ли свежие реальные отзывы? Надёжный оператор ответит мгновенно. Прямое бронирование вместо уличного агентства означает, что вы знаете, кто именно с вами летит.' },
      { question: 'Можно подняться по канатной дороге и не летать?', answer: 'Да. Канатная дорога Бабадага продаёт обзорные билеты; многие семьи поднимаются вместе, пока летит один. У кафе на вершине — лучшая терраса побережья.' },
      { question: 'Могут ли летать дети?', answer: 'Да — дети здесь регулярно летают в тандеме. До 18 лет нужно согласие родителей; практические ограничения — посадка подвески и максимальный вес пассажира 110 кг.' },
    ],
  },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Paragliding Oludeniz Turkey",tr:"Oludeniz Yamaç Paraşütü",de:"Paragliding Oludeniz Türkei",ru:"Парапланеризм Олюдениз Турция"}
  const d = {en:"The complete guide to paragliding in Oludeniz: Babadağ launch points, season by month, prices from $140, safety and how to book direct.",tr:"Ölüdeniz'de yamaç paraşütü için eksiksiz rehber: Babadağ kalkış noktaları, ay ay sezon, $140'den fiyatlar, güvenlik ve doğrudan rezervasyon.",de:"Der komplette Guide zum Paragliding in Ölüdeniz: Babadağ-Startplätze, Saison im Monatsüberblick, Preise ab $140, Sicherheit und Direktbuchung.",ru:"Полный гид по парапланеризму в Олюденизе: старты Бабадага, сезон по месяцам, цены от $140, безопасность и прямое бронирование."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/oludeniz-paragliding'),
    openGraph: { url: localeUrl(locale, '/oludeniz-paragliding'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'oludenizPara' })
  const lp = (href: string) => (locale === 'en' ? href : `/${locale}${href}`)
  const titles = {en:"Paragliding Oludeniz Turkey",tr:"Oludeniz Yamaç Paraşütü",de:"Paragliding Oludeniz Türkei",ru:"Парапланеризм Олюдениз Турция"}
  const subs = {en:"The complete guide to paragliding in Oludeniz.",tr:"Oludeniz'de yamaç paraşütü için eksiksiz rehber.",de:"Der vollständige Leitfaden zum Paragliding in Oludeniz.",ru:"Полный гид по парапланеризму в Олюдениз."}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c = CONTENT[locale] || CONTENT.en
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"Article\", \"headline\": \"Oludeniz Paragliding Complete Guide\", \"description\": \"Complete guide to paragliding in Oludeniz, Turkey \\u2014 the world's premier paragliding destination.\", \"url\": \"https://www.atmosparagliding.com/oludeniz-paragliding\", \"author\": {\"@type\": \"Person\", \"name\": \"Ceyhun\", \"url\": \"https://www.atmosparagliding.com/en/about-us\"}, \"publisher\": {\"@type\": \"Organization\", \"name\": \"Atmos Paragliding\", \"url\": \"https://www.atmosparagliding.com\"}}" }} />
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7bd4/rtDjiycQ-CNoCYjmlrN3-.jpg" />
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3"><BreadcrumbNav items={[{ label: title }]} /></div>
      </div>

      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">{c.introTitle}</h2>
          <p className="text-slate-700 leading-relaxed mb-10">{c.intro}</p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">{c.launchTitle}</h2>
          <p className="text-slate-700 leading-relaxed mb-5">{c.launchIntro}</p>
          <div className="space-y-4 mb-5">
            {c.launches.map((l) => (
              <div key={l.t} className="card p-5">
                <h3 className="font-bold text-slate-900 mb-1">{l.t}</h3>
                <p className="text-slate-700">{l.d}</p>
              </div>
            ))}
          </div>
          <p className="text-slate-700 leading-relaxed mb-2">{c.cable}</p>
          <p className="mb-10"><Link href={lp('/babadag-guide')} className="text-orange-600 font-medium hover:underline">{c.babadagLink} →</Link></p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">{c.feelTitle}</h2>
          <p className="text-slate-700 leading-relaxed mb-2">{c.feel}</p>
          <p className="mb-10"><Link href={lp('/tandem-paragliding')} className="text-orange-600 font-medium hover:underline">{c.feelLink} →</Link></p>

          <h2 className="text-2xl font-bold text-slate-900 mb-6">{c.seasonTitle}</h2>
          <div className="space-y-5 mb-10">
            {c.months.map((m) => (
              <div key={m.t}>
                <h3 className="font-bold text-slate-900 mb-1">{m.t}</h3>
                <p className="text-slate-700 leading-relaxed">{m.d}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">{c.viewsTitle}</h2>
          <p className="text-slate-700 leading-relaxed mb-10">{c.views}</p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">{c.pilotsTitle}</h2>
          <p className="text-slate-700 leading-relaxed mb-3">{c.pilots}</p>
          <ul className="space-y-2 mb-10">
            {c.pilotLinks.map((l) => (
              <li key={l.href}>
                <Link href={lp(l.href)} className="text-orange-600 font-medium hover:underline">{l.label} →</Link>
              </li>
            ))}
          </ul>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">{c.practicalTitle}</h2>
          <p className="text-slate-700 leading-relaxed">{c.practical}</p>
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="container-default max-w-3xl">
          <FAQAccordion items={c.faq} />
        </div>
      </section>

      <BookingCTA />
    </>
  )
}
