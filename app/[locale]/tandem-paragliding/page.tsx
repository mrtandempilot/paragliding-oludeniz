import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, ArrowRight } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import FAQAccordion from '@/components/shared/FAQAccordion'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'
import ServiceSchema from '@/components/shared/ServiceSchema'

// ---- Long-form localized page content (SEO) ----
type Step = { t: string; d: string }
type Opt = { name: string; price: string; desc: string }
type FaqItem = { question: string; answer: string }
type PageContent = {
  whyTitle: string; whyBody: string
  stepsTitle: string; steps: Step[]; stepsOutro: string
  optTitle: string; options: Opt[]; optNote: string
  safetyTitle: string; safetyBody: string
  timeTitle: string; timeBody: string
  knowTitle: string; knowBody: string
  atmosTitle: string; atmosBody: string
  faq: FaqItem[]
}

const CONTENT: Record<string, PageContent> = {
  en: {
    whyTitle: 'Why Oludeniz Is the World\u2019s Most Famous Paragliding Destination',
    whyBody: 'Oludeniz is one of the very few places on earth where a 1,960-metre mountain drops almost straight into a turquoise lagoon. That combination \u2014 Babadag\u2019s height, reliable thermals, and a wide, sandy landing zone right on the beach \u2014 is why pilots from every continent come here, and why tandem paragliding in Oludeniz is on so many bucket lists. Flights run daily from April to November, with launch points between 1,200 m and 1,900 m chosen to match the day\u2019s wind and weather. You don\u2019t need any experience, any fitness level beyond walking a few steps, or any equipment \u2014 your pilot takes care of everything.',
    stepsTitle: 'How Your Tandem Flight Works, Step by Step',
    steps: [
      { t: '1. Meeting & transfer (about 40 minutes)', d: 'We meet in Oludeniz and drive you up Babadag in our shuttle. The road itself is an experience \u2014 pine forest, hairpin bends, and the lagoon shrinking below you.' },
      { t: '2. Briefing at launch (10\u201315 minutes)', d: 'Your pilot fits your harness and helmet, explains the takeoff, and answers every question. The most important instruction is the simplest one: when the pilot says run, keep running until your feet stop touching the ground.' },
      { t: '3. Takeoff (a few seconds)', d: 'You run 5\u201310 steps together, the wing inflates above you, and the mountain simply falls away. Most passengers say this moment is far gentler than they expected \u2014 there is no jump and no free-fall.' },
      { t: '4. The flight (25\u201345 minutes)', d: 'You sit back in a comfortable harness while your pilot rides the thermals over the Blue Lagoon, Belcekiz Beach and Butterfly Valley. Want a calm, scenic glide? Say so. Want spirals and G-force? Ask for acrobatics \u2014 it\u2019s your flight.' },
      { t: '5. Beach landing', d: 'You touch down softly on the promenade at Belcekiz Beach, usually to an audience of applauding sunbathers.' },
    ],
    stepsOutro: 'Total experience: around 2 hours door to door.',
    optTitle: 'Choose Your Flight',
    options: [
      { name: 'Standard Flight (from 1,700 m)', price: '\u20AC100', desc: '25\u201335 minutes over the lagoon \u2014 the classic Oludeniz experience.' },
      { name: 'High-Altitude Flight (from 1,900 m)', price: '\u20AC100', desc: 'The longest views from near the summit, subject to weather.' },
      { name: 'Sunset Flight', price: '\u20AC110', desc: 'Golden-hour light over the Aegean \u2014 the photographers\u2019 favourite.' },
    ],
    optNote: 'Photo & video packages are optional extras \u2014 your pilot films the whole flight with a gimbal-mounted action camera.',
    safetyTitle: 'Safety Is Not a Feature \u2014 It\u2019s the Whole System',
    safetyBody: 'Every Atmos pilot is SHGM-licensed (Turkish Directorate General of Civil Aviation) with thousands of tandem flights logged. Wings, harnesses and reserves are inspected daily and replaced on manufacturer schedules, not when they wear out. Every flight includes third-party liability insurance, and we simply don\u2019t fly when conditions aren\u2019t right \u2014 if the wind says no, we reschedule you free of charge. Oludeniz has hosted millions of tandem flights over three decades; flown with a licensed professional, it is one of the safest adventure sports you can do.',
    timeTitle: 'The Best Time to Fly',
    timeBody: 'The season runs late April to early November. June to September brings the most reliable conditions and the longest flying days; May and October offer clearer air, softer light and fewer crowds. Morning flights are typically the smoothest \u2014 ideal if you\u2019re nervous. Afternoon thermals give longer, more dynamic flights. July and August sell out days in advance, so book early in high season.',
    knowTitle: 'Good to Know Before You Fly',
    knowBody: 'Wear comfortable clothes and closed shoes \u2014 trainers are perfect. Bring a light jacket even in August; it\u2019s noticeably cooler at 1,900 m. Sunglasses are recommended. Maximum passenger weight is 110 kg, and under-18s need parental consent. Glasses and phones can fly with you, but secure them \u2014 the lagoon keeps what it catches.',
    atmosTitle: 'Fly Direct with a Local Pilot Team',
    atmosBody: 'When you book through resellers, a large commission goes to a middleman who has never touched a glider. Atmos is a local, pilot-owned operation flying from Babadag for over 25 years. Booking direct means better prices, direct WhatsApp contact with your actual pilot, and free rescheduling when the weather shifts.',
    faq: [
      { question: 'Do I need any experience to do tandem paragliding?', answer: 'No experience is needed at all. In a tandem flight, you are attached to a certified pilot who controls everything. Your only job is to run a few steps at launch and enjoy the flight.' },
      { question: 'Is there a weight or age limit?', answer: 'Maximum passenger weight is 110kg. Passengers under 18 require parental consent.' },
      { question: 'What should I wear?', answer: 'Comfortable, layered clothing and closed-toe shoes. Bring a light jacket \u2014 it can be cooler at altitude.' },
      { question: 'How long is the flight?', answer: 'Flights last 25\u201345 minutes depending on your package and weather conditions.' },
      { question: 'Is paragliding in Oludeniz safe?', answer: 'Flown with an SHGM-licensed professional pilot, tandem paragliding in Oludeniz is one of the safest adventure activities. Equipment is inspected daily, every flight is insured, and flights only launch when wind and weather are within safe limits.' },
      { question: 'What happens if the weather is bad?', answer: 'Safety comes first: if conditions are not suitable, your flight is rescheduled to the next available slot free of charge. If you cannot rebook, you are not charged.' },
      { question: 'Can I bring my phone or camera?', answer: 'Yes, but it must be secured with a strap or zipped pocket. Most guests prefer our photo & video package \u2014 the pilot films hands-free with a gimbal camera while you just enjoy the view.' },
      { question: 'How do I book and do I pay a deposit?', answer: 'Book online in two minutes or message us on WhatsApp. You can secure your slot without prepayment in most seasons; July\u2013August dates may require a small deposit due to demand.' },
      { question: 'Where exactly do we meet?', answer: 'We meet in central Oludeniz near Belcekiz Beach \u2014 the exact meeting point and time are confirmed on WhatsApp the evening before your flight. Hotel pickup around Oludeniz can be arranged.' },
    ],
  },
  tr: {
    whyTitle: 'Neden Ölüdeniz Dünyanın En Ünlü Yamaç Paraşütü Noktası?',
    whyBody: '1.960 metrelik bir dağın turkuaz bir lagüne neredeyse dik indiği dünyada çok az yer vardır; Ölüdeniz bunlardan biridir. Babadağ\u2019ın yüksekliği, güvenilir termikleri ve plajın hemen üstündeki geniş kumlu iniş alanı \u2014 her kıtadan pilotun buraya gelmesinin ve Ölüdeniz\u2019de tandem uçuşun bu kadar popüler olmasının sebebi bu kombinasyondur. Uçuşlar Nisan\u2019dan Kasım\u2019a kadar her gün yapılır; kalkış noktası (1.200\u20131.900 m) günün rüzgâr ve hava durumuna göre seçilir. Deneyim, özel bir kondisyon veya ekipman gerekmez \u2014 her şeyi pilotunuz halleder.',
    stepsTitle: 'Tandem Uçuşunuz Adım Adım Nasıl Geçer?',
    steps: [
      { t: '1. Buluşma ve transfer (yaklaşık 40 dakika)', d: 'Ölüdeniz\u2019de buluşur, servisimizle Babadağ\u2019a çıkarız. Yolun kendisi bile bir deneyimdir \u2014 çam ormanı, virajlar ve aşağıda küçülen lagün.' },
      { t: '2. Kalkışta brifing (10\u201315 dakika)', d: 'Pilotunuz harness ve kaskınızı takar, kalkışı anlatır, tüm sorularınızı yanıtlar. En önemli talimat en basitidir: pilot koş dediğinde, ayaklarınız yerden kesilene kadar koşmaya devam edin.' },
      { t: '3. Kalkış (birkaç saniye)', d: 'Birlikte 5\u201310 adım koşarsınız, kanat üzerinizde dolar ve dağ ayaklarınızın altından çekilir. Çoğu misafir bu anın beklediğinden çok daha yumuşak olduğunu söyler \u2014 atlama ve serbest düşüş yoktur.' },
      { t: '4. Uçuş (25\u201345 dakika)', d: 'Rahat bir koltukta oturursunuz; pilotunuz Kumburnu, Belcekız Plajı ve Kelebekler Vadisi üzerinde termiklerle süzülür. Sakin bir uçuş mu istersiniz? Söylemeniz yeterli. Spiral ve G kuvveti mi? Akrobasi isteyin \u2014 uçuş sizin.' },
      { t: '5. Plaja iniş', d: 'Belcekız Plajı\u2019ndaki yürüyüş yoluna yumuşakça inersiniz \u2014 genellikle alkışlayan bir seyirci kitlesi eşliğinde.' },
    ],
    stepsOutro: 'Toplam süre: kapıdan kapıya yaklaşık 2 saat.',
    optTitle: 'Uçuşunuzu Seçin',
    options: [
      { name: 'Standart Uçuş (1.700 m)', price: '\u20AC100', desc: 'Lagün üzerinde 25\u201335 dakika \u2014 klasik Ölüdeniz deneyimi.' },
      { name: 'Yüksek İrtifa Uçuşu (1.900 m)', price: '\u20AC100', desc: 'Zirveye yakın kalkışla en uzun manzara; hava durumuna bağlıdır.' },
      { name: 'Gün Batımı Uçuşu', price: '\u20AC110', desc: 'Ege üzerinde altın saat ışığı \u2014 fotoğrafçıların favorisi.' },
    ],
    optNote: 'Foto ve video paketleri opsiyonel ektir \u2014 pilotunuz tüm uçuşu gimbal kamerayla çeker.',
    safetyTitle: 'Güvenlik Bir Özellik Değil, Sistemin Kendisidir',
    safetyBody: 'Her Atmos pilotu SHGM lisanslıdır ve binlerce tandem uçuşa sahiptir. Kanatlar, harnessler ve yedek paraşütler her gün kontrol edilir; eskidiğinde değil, üretici takvimine göre değiştirilir. Her uçuşta üçüncü şahıs sorumluluk sigortası vardır ve koşullar uygun değilse uçmayız \u2014 rüzgâr hayır diyorsa uçuşunuzu ücretsiz erteleriz. Ölüdeniz otuz yılda milyonlarca tandem uçuşa ev sahipliği yaptı; lisanslı bir profesyonelle yapıldığında en güvenli macera sporlarından biridir.',
    timeTitle: 'Uçmak İçin En İyi Zaman',
    timeBody: 'Sezon Nisan sonundan Kasım başına sürer. Haziran\u2013Eylül en istikrarlı koşulları ve en uzun uçuş günlerini sunar; Mayıs ve Ekim daha berrak hava, yumuşak ışık ve az kalabalık demektir. Sabah uçuşları genellikle en sakinidir \u2014 heyecanlıysanız idealdir. Öğleden sonra termikleri daha uzun ve hareketli uçuşlar verir. Temmuz ve Ağustos günler öncesinden dolar; yüksek sezonda erken rezervasyon yapın.',
    knowTitle: 'Uçuştan Önce Bilmeniz Gerekenler',
    knowBody: 'Rahat kıyafet ve kapalı ayakkabı giyin \u2014 spor ayakkabı idealdir. Ağustos\u2019ta bile ince bir mont alın; 1.900 m\u2019de hava belirgin şekilde serindir. Güneş gözlüğü önerilir. Maksimum yolcu kilosu 110 kg\u2019dır; 18 yaş altı için veli onayı gerekir. Gözlük ve telefon uçabilir ama sabitleyin \u2014 lagün yakaladığını geri vermez.',
    atmosTitle: 'Aracısız, Yerel Pilot Ekibiyle Uçun',
    atmosBody: 'Aracılar üzerinden rezervasyonda büyük bir komisyon, eline hiç kanat almamış bir aracının cebine gider. Atmos, 25 yılı aşkın süredir Babadağ\u2019dan uçan, pilotların sahibi olduğu yerel bir ekiptir. Doğrudan rezervasyon daha iyi fiyat, pilotunuzla doğrudan WhatsApp iletişimi ve hava değiştiğinde ücretsiz erteleme demektir.',
    faq: [
      { question: 'Tandem uçuş için deneyim gerekir mi?', answer: 'Hayır, hiçbir deneyim gerekmez. Tandem uçuşta her şeyi kontrol eden sertifikalı bir pilota bağlısınız. Tek işiniz kalkışta birkaç adım koşmak ve uçuşun tadını çıkarmak.' },
      { question: 'Kilo veya yaş sınırı var mı?', answer: 'Maksimum yolcu ağırlığı 110 kg\u2019dır. 18 yaş altı yolcular için veli onayı gerekir.' },
      { question: 'Ne giymeliyim?', answer: 'Rahat, katmanlı kıyafet ve kapalı ayakkabı. Yanınıza ince bir mont alın \u2014 yükseklerde hava serin olabilir.' },
      { question: 'Uçuş ne kadar sürer?', answer: 'Pakete ve hava koşullarına göre 25\u201345 dakika arası.' },
      { question: 'Ölüdeniz\u2019de yamaç paraşütü güvenli mi?', answer: 'SHGM lisanslı profesyonel pilotla yapılan tandem uçuş en güvenli macera aktivitelerinden biridir. Ekipman her gün kontrol edilir, her uçuş sigortalıdır ve yalnızca güvenli koşullarda uçuş yapılır.' },
      { question: 'Hava kötü olursa ne olur?', answer: 'Önce güvenlik: koşullar uygun değilse uçuşunuz ücretsiz olarak bir sonraki müsait saate ertelenir. Yeni tarih bulamazsanız ücret alınmaz.' },
      { question: 'Telefonumu veya kameramı getirebilir miyim?', answer: 'Evet, ancak askılı veya fermuarlı cepte sabitlenmelidir. Çoğu misafir foto-video paketimizi tercih eder \u2014 pilot gimbal kamerayla çekerken siz manzaranın tadını çıkarırsınız.' },
      { question: 'Nasıl rezervasyon yapılır, kapora gerekir mi?', answer: 'İki dakikada online rezervasyon yapabilir veya WhatsApp\u2019tan yazabilirsiniz. Çoğu dönemde ön ödemesiz yer ayırtabilirsiniz; Temmuz\u2013Ağustos için talep nedeniyle küçük bir kapora istenebilir.' },
      { question: 'Tam olarak nerede buluşuyoruz?', answer: 'Ölüdeniz merkezde, Belcekız Plajı yakınında buluşuyoruz \u2014 kesin nokta ve saat uçuştan önceki akşam WhatsApp\u2019tan teyit edilir. Ölüdeniz çevresinde otelden alma ayarlanabilir.' },
    ],
  },
  de: {
    whyTitle: 'Warum Oludeniz das beruhmteste Paragliding-Ziel der Welt ist',
    whyBody: 'Oludeniz ist einer der ganz wenigen Orte der Welt, an dem ein 1.960 Meter hoher Berg fast senkrecht in eine turkisfarbene Lagune abfallt. Diese Kombination \u2014 die Hohe des Babadag, zuverlassige Thermik und eine breite, sandige Landezone direkt am Strand \u2014 zieht Piloten von allen Kontinenten an. Geflogen wird taglich von April bis November, mit Startplatzen zwischen 1.200 m und 1.900 m je nach Wind und Wetter. Sie brauchen keine Erfahrung, keine besondere Fitness und keine Ausrustung \u2014 Ihr Pilot kummert sich um alles.',
    stepsTitle: 'So lauft Ihr Tandemflug ab \u2014 Schritt fur Schritt',
    steps: [
      { t: '1. Treffpunkt & Transfer (ca. 40 Minuten)', d: 'Wir treffen uns in Oludeniz und fahren Sie mit unserem Shuttle auf den Babadag \u2014 Pinienwald, Serpentinen und die immer kleiner werdende Lagune inklusive.' },
      { t: '2. Briefing am Startplatz (10\u201315 Minuten)', d: 'Ihr Pilot legt Ihnen Gurtzeug und Helm an, erklart den Start und beantwortet alle Fragen. Die wichtigste Regel ist die einfachste: Wenn der Pilot laufen sagt, laufen Sie weiter, bis die Fusse den Boden nicht mehr beruhren.' },
      { t: '3. Start (wenige Sekunden)', d: 'Sie laufen gemeinsam 5\u201310 Schritte, der Schirm fullt sich uber Ihnen, und der Berg gleitet einfach davon. Kein Sprung, kein freier Fall \u2014 sanfter als erwartet.' },
      { t: '4. Der Flug (25\u201345 Minuten)', d: 'Sie sitzen bequem im Gurtzeug, wahrend Ihr Pilot uber der Blauen Lagune, dem Belcekiz-Strand und dem Schmetterlingstal die Thermik nutzt. Lieber ruhig und szenisch? Sagen Sie es. Lieber Spiralen und G-Krafte? Fragen Sie nach Akrobatik.' },
      { t: '5. Strandlandung', d: 'Sie landen sanft auf der Promenade am Belcekiz-Strand \u2014 meist unter Applaus der Badegaste.' },
    ],
    stepsOutro: 'Gesamtdauer: rund 2 Stunden von Tur zu Tur.',
    optTitle: 'Wahlen Sie Ihren Flug',
    options: [
      { name: 'Standardflug (ab 1.700 m)', price: '\u20AC100', desc: '25\u201335 Minuten uber der Lagune \u2014 das klassische Oludeniz-Erlebnis.' },
      { name: 'Hohenflug (ab 1.900 m)', price: '\u20AC100', desc: 'Die langste Aussicht nahe dem Gipfel, wetterabhangig.' },
      { name: 'Sonnenuntergangsflug', price: '\u20AC110', desc: 'Goldenes Licht uber der Agais \u2014 der Favorit der Fotografen.' },
    ],
    optNote: 'Foto- und Videopakete sind optionale Extras \u2014 Ihr Pilot filmt den gesamten Flug mit einer Gimbal-Actionkamera.',
    safetyTitle: 'Sicherheit ist kein Extra \u2014 sie ist das ganze System',
    safetyBody: 'Jeder Atmos-Pilot ist SHGM-lizenziert (turkische Zivilluftfahrtbehorde) und hat tausende Tandemfluge im Logbuch. Schirme, Gurtzeuge und Rettungssysteme werden taglich gepruft und nach Herstellerplan ersetzt. Jeder Flug beinhaltet eine Haftpflichtversicherung \u2014 und bei ungeeigneten Bedingungen fliegen wir schlicht nicht: Sagt der Wind nein, verschieben wir kostenlos. Mit einem lizenzierten Profi ist Tandemfliegen in Oludeniz eine der sichersten Abenteuersportarten uberhaupt.',
    timeTitle: 'Die beste Zeit zum Fliegen',
    timeBody: 'Die Saison lauft von Ende April bis Anfang November. Juni bis September bieten die stabilsten Bedingungen; Mai und Oktober klarere Luft, weicheres Licht und weniger Andrang. Morgenfluge sind meist am ruhigsten \u2014 ideal fur Nervose. Nachmittagsthermik bringt langere, dynamischere Fluge. Juli und August sind oft Tage im Voraus ausgebucht.',
    knowTitle: 'Gut zu wissen vor dem Flug',
    knowBody: 'Tragen Sie bequeme Kleidung und feste Schuhe \u2014 Turnschuhe sind perfekt. Nehmen Sie auch im August eine leichte Jacke mit; auf 1.900 m ist es spurbar kuhler. Sonnenbrille empfohlen. Maximales Passagiergewicht: 110 kg; unter 18 Jahren ist die Zustimmung der Eltern erforderlich. Brille und Handy konnen mitfliegen \u2014 aber gut gesichert.',
    atmosTitle: 'Direkt fliegen \u2014 mit einem lokalen Pilotenteam',
    atmosBody: 'Bei Wiederverkaufern geht eine hohe Provision an Zwischenhandler, die nie einen Gleitschirm beruhrt haben. Atmos ist ein lokales, pilotengefuhrtes Team, das seit uber 25 Jahren vom Babadag fliegt. Direktbuchung bedeutet bessere Preise, direkten WhatsApp-Kontakt zu Ihrem Piloten und kostenloses Umbuchen bei Wetterumschwung.',
    faq: [
      { question: 'Brauche ich Erfahrung fur einen Tandemflug?', answer: 'Nein, uberhaupt keine. Beim Tandemflug sind Sie mit einem zertifizierten Piloten verbunden, der alles steuert. Ihre einzige Aufgabe: beim Start ein paar Schritte laufen und den Flug geniessen.' },
      { question: 'Gibt es ein Gewichts- oder Alterslimit?', answer: 'Das maximale Passagiergewicht betragt 110 kg. Unter 18 Jahren ist die Zustimmung der Eltern erforderlich.' },
      { question: 'Was soll ich anziehen?', answer: 'Bequeme Kleidung im Zwiebellook und geschlossene Schuhe. Nehmen Sie eine leichte Jacke mit \u2014 in der Hohe ist es kuhler.' },
      { question: 'Wie lange dauert der Flug?', answer: 'Je nach Paket und Wetter 25\u201345 Minuten.' },
      { question: 'Ist Paragliding in Oludeniz sicher?', answer: 'Mit einem SHGM-lizenzierten Profi ist Tandem-Paragliding in Oludeniz eine der sichersten Abenteueraktivitaten. Ausrustung wird taglich gepruft, jeder Flug ist versichert, gestartet wird nur bei sicheren Bedingungen.' },
      { question: 'Was passiert bei schlechtem Wetter?', answer: 'Sicherheit zuerst: Bei ungeeigneten Bedingungen wird Ihr Flug kostenlos verschoben. Finden Sie keinen neuen Termin, zahlen Sie nichts.' },
      { question: 'Kann ich Handy oder Kamera mitnehmen?', answer: 'Ja, aber nur gut gesichert. Die meisten Gaste wahlen unser Foto-Video-Paket \u2014 der Pilot filmt mit Gimbal-Kamera, Sie geniessen die Aussicht.' },
      { question: 'Wie buche ich \u2014 mit Anzahlung?', answer: 'Online in zwei Minuten oder per WhatsApp. Meist ohne Vorauszahlung; fur Juli\u2013August kann wegen der Nachfrage eine kleine Anzahlung notig sein.' },
      { question: 'Wo genau treffen wir uns?', answer: 'Im Zentrum von Oludeniz nahe dem Belcekiz-Strand \u2014 Treffpunkt und Uhrzeit bestatigen wir am Vorabend per WhatsApp. Hotelabholung rund um Oludeniz ist moglich.' },
    ],
  },
  ru: {
    whyTitle: '\u041F\u043E\u0447\u0435\u043C\u0443 \u041E\u043B\u044E\u0434\u0435\u043D\u0438\u0437 \u2014 \u0441\u0430\u043C\u043E\u0435 \u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E\u0435 \u043C\u0435\u0441\u0442\u043E \u0434\u043B\u044F \u043F\u0430\u0440\u0430\u043F\u043B\u0430\u043D\u0435\u0440\u0438\u0437\u043C\u0430 \u0432 \u043C\u0438\u0440\u0435',
    whyBody: '\u041E\u043B\u044E\u0434\u0435\u043D\u0438\u0437 \u2014 \u043E\u0434\u043D\u043E \u0438\u0437 \u043D\u0435\u043C\u043D\u043E\u0433\u0438\u0445 \u043C\u0435\u0441\u0442 \u043D\u0430 \u0417\u0435\u043C\u043B\u0435, \u0433\u0434\u0435 \u0433\u043E\u0440\u0430 \u0432\u044B\u0441\u043E\u0442\u043E\u0439 1960 \u043C \u043E\u0431\u0440\u044B\u0432\u0430\u0435\u0442\u0441\u044F \u043F\u0440\u044F\u043C\u043E \u0432 \u0431\u0438\u0440\u044E\u0437\u043E\u0432\u0443\u044E \u043B\u0430\u0433\u0443\u043D\u0443. \u0412\u044B\u0441\u043E\u0442\u0430 \u0411\u0430\u0431\u0430\u0434\u0430\u0433\u0430, \u0441\u0442\u0430\u0431\u0438\u043B\u044C\u043D\u044B\u0435 \u0442\u0435\u0440\u043C\u0438\u043A\u0438 \u0438 \u0448\u0438\u0440\u043E\u043A\u0430\u044F \u043F\u0435\u0441\u0447\u0430\u043D\u0430\u044F \u0437\u043E\u043D\u0430 \u043F\u0440\u0438\u0437\u0435\u043C\u043B\u0435\u043D\u0438\u044F \u043F\u0440\u044F\u043C\u043E \u043D\u0430 \u043F\u043B\u044F\u0436\u0435 \u2014 \u0432\u043E\u0442 \u043F\u043E\u0447\u0435\u043C\u0443 \u0441\u044E\u0434\u0430 \u043F\u0440\u0438\u0435\u0437\u0436\u0430\u044E\u0442 \u043F\u0438\u043B\u043E\u0442\u044B \u0441\u043E \u0432\u0441\u0435\u0445 \u043A\u043E\u043D\u0442\u0438\u043D\u0435\u043D\u0442\u043E\u0432. \u041F\u043E\u043B\u0451\u0442\u044B \u2014 \u0435\u0436\u0435\u0434\u043D\u0435\u0432\u043D\u043E \u0441 \u0430\u043F\u0440\u0435\u043B\u044F \u043F\u043E \u043D\u043E\u044F\u0431\u0440\u044C, \u0441\u0442\u0430\u0440\u0442\u044B \u0441 1200\u20131900 \u043C \u0432 \u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E\u0441\u0442\u0438 \u043E\u0442 \u0432\u0435\u0442\u0440\u0430. \u041E\u043F\u044B\u0442, \u0444\u0438\u0437\u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0430 \u0438 \u0441\u043D\u0430\u0440\u044F\u0436\u0435\u043D\u0438\u0435 \u043D\u0435 \u043D\u0443\u0436\u043D\u044B \u2014 \u043E\u0431\u043E \u0432\u0441\u0451\u043C \u043F\u043E\u0437\u0430\u0431\u043E\u0442\u0438\u0442\u0441\u044F \u043F\u0438\u043B\u043E\u0442.',
    stepsTitle: '\u041A\u0430\u043A \u043F\u0440\u043E\u0445\u043E\u0434\u0438\u0442 \u0442\u0430\u043D\u0434\u0435\u043C\u043D\u044B\u0439 \u043F\u043E\u043B\u0451\u0442 \u2014 \u0448\u0430\u0433 \u0437\u0430 \u0448\u0430\u0433\u043E\u043C',
    steps: [
      { t: '1. \u0412\u0441\u0442\u0440\u0435\u0447\u0430 \u0438 \u0442\u0440\u0430\u043D\u0441\u0444\u0435\u0440 (\u043E\u043A\u043E\u043B\u043E 40 \u043C\u0438\u043D\u0443\u0442)', d: '\u0412\u0441\u0442\u0440\u0435\u0447\u0430\u0435\u043C\u0441\u044F \u0432 \u041E\u043B\u044E\u0434\u0435\u043D\u0438\u0437\u0435 \u0438 \u043F\u043E\u0434\u043D\u0438\u043C\u0430\u0435\u043C\u0441\u044F \u043D\u0430 \u0411\u0430\u0431\u0430\u0434\u0430\u0433 \u043D\u0430 \u043D\u0430\u0448\u0435\u043C \u0448\u0430\u0442\u0442\u043B\u0435: \u0441\u043E\u0441\u043D\u043E\u0432\u044B\u0439 \u043B\u0435\u0441, \u0441\u0435\u0440\u043F\u0430\u043D\u0442\u0438\u043D \u0438 \u0443\u043C\u0435\u043D\u044C\u0448\u0430\u044E\u0449\u0430\u044F\u0441\u044F \u0432\u043D\u0438\u0437\u0443 \u043B\u0430\u0433\u0443\u043D\u0430.' },
      { t: '2. \u0418\u043D\u0441\u0442\u0440\u0443\u043A\u0442\u0430\u0436 \u043D\u0430 \u0441\u0442\u0430\u0440\u0442\u0435 (10\u201315 \u043C\u0438\u043D\u0443\u0442)', d: '\u041F\u0438\u043B\u043E\u0442 \u043D\u0430\u0434\u0435\u043D\u0435\u0442 \u043D\u0430 \u0432\u0430\u0441 \u043F\u043E\u0434\u0432\u0435\u0441\u043A\u0443 \u0438 \u0448\u043B\u0435\u043C \u0438 \u043E\u0442\u0432\u0435\u0442\u0438\u0442 \u043D\u0430 \u0432\u0441\u0435 \u0432\u043E\u043F\u0440\u043E\u0441\u044B. \u0413\u043B\u0430\u0432\u043D\u043E\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u043E \u043F\u0440\u043E\u0441\u0442\u043E\u0435: \u043A\u043E\u0433\u0434\u0430 \u043F\u0438\u043B\u043E\u0442 \u0433\u043E\u0432\u043E\u0440\u0438\u0442 \u0431\u0435\u0436\u0430\u0442\u044C \u2014 \u0431\u0435\u0433\u0438\u0442\u0435, \u043F\u043E\u043A\u0430 \u043D\u043E\u0433\u0438 \u043D\u0435 \u043E\u0442\u043E\u0440\u0432\u0443\u0442\u0441\u044F \u043E\u0442 \u0437\u0435\u043C\u043B\u0438.' },
      { t: '3. \u0421\u0442\u0430\u0440\u0442 (\u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0441\u0435\u043A\u0443\u043D\u0434)', d: '\u0412\u044B \u0432\u043C\u0435\u0441\u0442\u0435 \u043F\u0440\u043E\u0431\u0435\u0433\u0430\u0435\u0442\u0435 5\u201310 \u0448\u0430\u0433\u043E\u0432, \u043A\u0440\u044B\u043B\u043E \u043D\u0430\u043F\u043E\u043B\u043D\u044F\u0435\u0442\u0441\u044F \u2014 \u0438 \u0433\u043E\u0440\u0430 \u043F\u0440\u043E\u0441\u0442\u043E \u0443\u0445\u043E\u0434\u0438\u0442 \u0432\u043D\u0438\u0437. \u041D\u0438\u043A\u0430\u043A\u043E\u0433\u043E \u043F\u0440\u044B\u0436\u043A\u0430 \u0438 \u0441\u0432\u043E\u0431\u043E\u0434\u043D\u043E\u0433\u043E \u043F\u0430\u0434\u0435\u043D\u0438\u044F.' },
      { t: '4. \u041F\u043E\u043B\u0451\u0442 (25\u201345 \u043C\u0438\u043D\u0443\u0442)', d: '\u0412\u044B \u0443\u0434\u043E\u0431\u043D\u043E \u0441\u0438\u0434\u0438\u0442\u0435 \u0432 \u043F\u043E\u0434\u0432\u0435\u0441\u043A\u0435, \u043F\u043E\u043A\u0430 \u043F\u0438\u043B\u043E\u0442 \u043F\u0430\u0440\u0438\u0442 \u043D\u0430\u0434 \u0413\u043E\u043B\u0443\u0431\u043E\u0439 \u043B\u0430\u0433\u0443\u043D\u043E\u0439, \u043F\u043B\u044F\u0436\u0435\u043C \u0411\u0435\u043B\u044C\u0434\u0436\u0435\u043A\u0438\u0437 \u0438 \u0414\u043E\u043B\u0438\u043D\u043E\u0439 \u0431\u0430\u0431\u043E\u0447\u0435\u043A. \u0425\u043E\u0442\u0438\u0442\u0435 \u0441\u043F\u043E\u043A\u043E\u0439\u043D\u043E \u2014 \u0441\u043A\u0430\u0436\u0438\u0442\u0435. \u0425\u043E\u0442\u0438\u0442\u0435 \u0441\u043F\u0438\u0440\u0430\u043B\u0438 \u0438 \u043F\u0435\u0440\u0435\u0433\u0440\u0443\u0437\u043A\u0438 \u2014 \u043F\u043E\u043F\u0440\u043E\u0441\u0438\u0442\u0435 \u0430\u043A\u0440\u043E\u0431\u0430\u0442\u0438\u043A\u0443.' },
      { t: '5. \u041F\u043E\u0441\u0430\u0434\u043A\u0430 \u043D\u0430 \u043F\u043B\u044F\u0436', d: '\u041C\u044F\u0433\u043A\u043E \u043F\u0440\u0438\u0437\u0435\u043C\u043B\u044F\u0435\u0442\u0435\u0441\u044C \u043D\u0430 \u043D\u0430\u0431\u0435\u0440\u0435\u0436\u043D\u043E\u0439 \u043F\u043B\u044F\u0436\u0430 \u0411\u0435\u043B\u044C\u0434\u0436\u0435\u043A\u0438\u0437 \u2014 \u043E\u0431\u044B\u0447\u043D\u043E \u043F\u043E\u0434 \u0430\u043F\u043B\u043E\u0434\u0438\u0441\u043C\u0435\u043D\u0442\u044B \u043E\u0442\u0434\u044B\u0445\u0430\u044E\u0449\u0438\u0445.' },
    ],
    stepsOutro: '\u0412\u0441\u0451 \u0432\u043C\u0435\u0441\u0442\u0435 \u2014 \u043E\u043A\u043E\u043B\u043E 2 \u0447\u0430\u0441\u043E\u0432.',
    optTitle: '\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0441\u0432\u043E\u0439 \u043F\u043E\u043B\u0451\u0442',
    options: [
      { name: '\u0421\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u043D\u044B\u0439 \u043F\u043E\u043B\u0451\u0442 (\u0441 1700 \u043C)', price: '\u20AC100', desc: '25\u201335 \u043C\u0438\u043D\u0443\u0442 \u043D\u0430\u0434 \u043B\u0430\u0433\u0443\u043D\u043E\u0439 \u2014 \u043A\u043B\u0430\u0441\u0441\u0438\u043A\u0430 \u041E\u043B\u044E\u0434\u0435\u043D\u0438\u0437\u0430.' },
      { name: '\u0412\u044B\u0441\u043E\u0442\u043D\u044B\u0439 \u043F\u043E\u043B\u0451\u0442 (\u0441 1900 \u043C)', price: '\u20AC100', desc: '\u0421\u0430\u043C\u044B\u0435 \u0434\u043E\u043B\u0433\u0438\u0435 \u0432\u0438\u0434\u044B \u0441 \u0432\u044B\u0441\u043E\u0442\u044B \u0443 \u0432\u0435\u0440\u0448\u0438\u043D\u044B; \u0437\u0430\u0432\u0438\u0441\u0438\u0442 \u043E\u0442 \u043F\u043E\u0433\u043E\u0434\u044B.' },
      { name: '\u0417\u0430\u043A\u0430\u0442\u043D\u044B\u0439 \u043F\u043E\u043B\u0451\u0442', price: '\u20AC110', desc: '\u0417\u043E\u043B\u043E\u0442\u043E\u0439 \u0447\u0430\u0441 \u043D\u0430\u0434 \u042D\u0433\u0435\u0439\u0441\u043A\u0438\u043C \u043C\u043E\u0440\u0435\u043C \u2014 \u043B\u044E\u0431\u0438\u043C\u0435\u0446 \u0444\u043E\u0442\u043E\u0433\u0440\u0430\u0444\u043E\u0432.' },
    ],
    optNote: '\u0424\u043E\u0442\u043E \u0438 \u0432\u0438\u0434\u0435\u043E \u2014 \u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E: \u043F\u0438\u043B\u043E\u0442 \u0441\u043D\u0438\u043C\u0430\u0435\u0442 \u0432\u0435\u0441\u044C \u043F\u043E\u043B\u0451\u0442 \u043D\u0430 \u044D\u043A\u0448\u043D-\u043A\u0430\u043C\u0435\u0440\u0443 \u0441\u043E \u0441\u0442\u0430\u0431\u0438\u043B\u0438\u0437\u0430\u0442\u043E\u0440\u043E\u043C.',
    safetyTitle: '\u0411\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u044C \u2014 \u044D\u0442\u043E \u0432\u0441\u044F \u0441\u0438\u0441\u0442\u0435\u043C\u0430, \u0430 \u043D\u0435 \u043E\u043F\u0446\u0438\u044F',
    safetyBody: '\u041A\u0430\u0436\u0434\u044B\u0439 \u043F\u0438\u043B\u043E\u0442 Atmos \u0438\u043C\u0435\u0435\u0442 \u043B\u0438\u0446\u0435\u043D\u0437\u0438\u044E SHGM (\u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0433\u0440\u0430\u0436\u0434\u0430\u043D\u0441\u043A\u043E\u0439 \u0430\u0432\u0438\u0430\u0446\u0438\u0438 \u0422\u0443\u0440\u0446\u0438\u0438) \u0438 \u0442\u044B\u0441\u044F\u0447\u0438 \u0442\u0430\u043D\u0434\u0435\u043C\u043D\u044B\u0445 \u043F\u043E\u043B\u0451\u0442\u043E\u0432. \u041A\u0440\u044B\u043B\u044C\u044F, \u043F\u043E\u0434\u0432\u0435\u0441\u043A\u0438 \u0438 \u0437\u0430\u043F\u0430\u0441\u043D\u044B\u0435 \u043F\u0430\u0440\u0430\u0448\u044E\u0442\u044B \u043F\u0440\u043E\u0432\u0435\u0440\u044F\u044E\u0442\u0441\u044F \u0435\u0436\u0435\u0434\u043D\u0435\u0432\u043D\u043E. \u041A\u0430\u0436\u0434\u044B\u0439 \u043F\u043E\u043B\u0451\u0442 \u0437\u0430\u0441\u0442\u0440\u0430\u0445\u043E\u0432\u0430\u043D, \u0430 \u043F\u0440\u0438 \u043D\u0435\u043F\u043E\u0434\u0445\u043E\u0434\u044F\u0449\u0438\u0445 \u0443\u0441\u043B\u043E\u0432\u0438\u044F\u0445 \u043C\u044B \u043F\u0440\u043E\u0441\u0442\u043E \u043D\u0435 \u043B\u0435\u0442\u0430\u0435\u043C \u2014 \u043F\u0435\u0440\u0435\u043D\u043E\u0441\u0438\u043C \u0431\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u043E. \u0421 \u043B\u0438\u0446\u0435\u043D\u0437\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u043C \u043F\u0440\u043E\u0444\u0435\u0441\u0441\u0438\u043E\u043D\u0430\u043B\u043E\u043C \u044D\u0442\u043E \u043E\u0434\u0438\u043D \u0438\u0437 \u0441\u0430\u043C\u044B\u0445 \u0431\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u044B\u0445 \u0432\u0438\u0434\u043E\u0432 \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0433\u043E \u043E\u0442\u0434\u044B\u0445\u0430.',
    timeTitle: '\u041B\u0443\u0447\u0448\u0435\u0435 \u0432\u0440\u0435\u043C\u044F \u0434\u043B\u044F \u043F\u043E\u043B\u0451\u0442\u0430',
    timeBody: '\u0421\u0435\u0437\u043E\u043D \u2014 \u0441 \u043A\u043E\u043D\u0446\u0430 \u0430\u043F\u0440\u0435\u043B\u044F \u0434\u043E \u043D\u0430\u0447\u0430\u043B\u0430 \u043D\u043E\u044F\u0431\u0440\u044F. \u0418\u044E\u043D\u044C\u2013\u0441\u0435\u043D\u0442\u044F\u0431\u0440\u044C \u2014 \u0441\u0430\u043C\u044B\u0435 \u0441\u0442\u0430\u0431\u0438\u043B\u044C\u043D\u044B\u0435 \u0443\u0441\u043B\u043E\u0432\u0438\u044F; \u043C\u0430\u0439 \u0438 \u043E\u043A\u0442\u044F\u0431\u0440\u044C \u2014 \u043F\u0440\u043E\u0437\u0440\u0430\u0447\u043D\u044B\u0439 \u0432\u043E\u0437\u0434\u0443\u0445 \u0438 \u043C\u0435\u043D\u044C\u0448\u0435 \u043B\u044E\u0434\u0435\u0439. \u0423\u0442\u0440\u0435\u043D\u043D\u0438\u0435 \u043F\u043E\u043B\u0451\u0442\u044B \u0441\u0430\u043C\u044B\u0435 \u0441\u043F\u043E\u043A\u043E\u0439\u043D\u044B\u0435 \u2014 \u0438\u0434\u0435\u0430\u043B\u044C\u043D\u043E \u0434\u043B\u044F \u0432\u043E\u043B\u043D\u0443\u044E\u0449\u0438\u0445\u0441\u044F. \u0414\u043D\u0435\u0432\u043D\u044B\u0435 \u0442\u0435\u0440\u043C\u0438\u043A\u0438 \u0434\u0430\u044E\u0442 \u0431\u043E\u043B\u0435\u0435 \u0434\u043E\u043B\u0433\u0438\u0435 \u0438 \u0434\u0438\u043D\u0430\u043C\u0438\u0447\u043D\u044B\u0435 \u043F\u043E\u043B\u0451\u0442\u044B. \u0418\u044E\u043B\u044C \u0438 \u0430\u0432\u0433\u0443\u0441\u0442 \u0440\u0430\u0441\u043A\u0443\u043F\u0430\u044E\u0442\u0441\u044F \u0437\u0430 \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0434\u043D\u0435\u0439 \u2014 \u0431\u0440\u043E\u043D\u0438\u0440\u0443\u0439\u0442\u0435 \u0437\u0430\u0440\u0430\u043D\u0435\u0435.',
    knowTitle: '\u041F\u043E\u043B\u0435\u0437\u043D\u043E \u0437\u043D\u0430\u0442\u044C \u043F\u0435\u0440\u0435\u0434 \u043F\u043E\u043B\u0451\u0442\u043E\u043C',
    knowBody: '\u041D\u0430\u0434\u0435\u043D\u044C\u0442\u0435 \u0443\u0434\u043E\u0431\u043D\u0443\u044E \u043E\u0434\u0435\u0436\u0434\u0443 \u0438 \u0437\u0430\u043A\u0440\u044B\u0442\u0443\u044E \u043E\u0431\u0443\u0432\u044C \u2014 \u043A\u0440\u043E\u0441\u0441\u043E\u0432\u043A\u0438 \u0438\u0434\u0435\u0430\u043B\u044C\u043D\u044B. \u0414\u0430\u0436\u0435 \u0432 \u0430\u0432\u0433\u0443\u0441\u0442\u0435 \u0432\u043E\u0437\u044C\u043C\u0438\u0442\u0435 \u043B\u0451\u0433\u043A\u0443\u044E \u043A\u0443\u0440\u0442\u043A\u0443: \u043D\u0430 1900 \u043C \u0437\u0430\u043C\u0435\u0442\u043D\u043E \u043F\u0440\u043E\u0445\u043B\u0430\u0434\u043D\u0435\u0435. \u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u044B\u0439 \u0432\u0435\u0441 \u043F\u0430\u0441\u0441\u0430\u0436\u0438\u0440\u0430 \u2014 110 \u043A\u0433; \u0434\u043E 18 \u043B\u0435\u0442 \u043D\u0443\u0436\u043D\u043E \u0441\u043E\u0433\u043B\u0430\u0441\u0438\u0435 \u0440\u043E\u0434\u0438\u0442\u0435\u043B\u0435\u0439. \u041E\u0447\u043A\u0438 \u0438 \u0442\u0435\u043B\u0435\u0444\u043E\u043D \u043C\u043E\u0436\u043D\u043E \u0432\u0437\u044F\u0442\u044C, \u043D\u043E \u0437\u0430\u043A\u0440\u0435\u043F\u0438\u0442\u0435 \u0438\u0445 \u2014 \u043B\u0430\u0433\u0443\u043D\u0430 \u043D\u0435 \u0432\u043E\u0437\u0432\u0440\u0430\u0449\u0430\u0435\u0442 \u0442\u043E, \u0447\u0442\u043E \u043B\u043E\u0432\u0438\u0442.',
    atmosTitle: '\u041B\u0435\u0442\u0430\u0439\u0442\u0435 \u043D\u0430\u043F\u0440\u044F\u043C\u0443\u044E \u0441 \u043C\u0435\u0441\u0442\u043D\u043E\u0439 \u043A\u043E\u043C\u0430\u043D\u0434\u043E\u0439 \u043F\u0438\u043B\u043E\u0442\u043E\u0432',
    atmosBody: '\u041F\u0440\u0438 \u0431\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0438 \u0447\u0435\u0440\u0435\u0437 \u043F\u043E\u0441\u0440\u0435\u0434\u043D\u0438\u043A\u043E\u0432 \u0431\u043E\u043B\u044C\u0448\u0430\u044F \u043A\u043E\u043C\u0438\u0441\u0441\u0438\u044F \u0443\u0445\u043E\u0434\u0438\u0442 \u0442\u0435\u043C, \u043A\u0442\u043E \u043D\u0438\u043A\u043E\u0433\u0434\u0430 \u043D\u0435 \u0434\u0435\u0440\u0436\u0430\u043B \u043A\u0440\u044B\u043B\u043E \u0432 \u0440\u0443\u043A\u0430\u0445. Atmos \u2014 \u043C\u0435\u0441\u0442\u043D\u0430\u044F \u043A\u043E\u043C\u0430\u043D\u0434\u0430, \u043F\u0440\u0438\u043D\u0430\u0434\u043B\u0435\u0436\u0430\u0449\u0430\u044F \u0441\u0430\u043C\u0438\u043C \u043F\u0438\u043B\u043E\u0442\u0430\u043C, \u0441 \u0431\u043E\u043B\u0435\u0435 \u0447\u0435\u043C 25-\u043B\u0435\u0442\u043D\u0438\u043C \u043E\u043F\u044B\u0442\u043E\u043C \u043F\u043E\u043B\u0451\u0442\u043E\u0432 \u0441 \u0411\u0430\u0431\u0430\u0434\u0430\u0433\u0430. \u041F\u0440\u044F\u043C\u043E\u0435 \u0431\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u2014 \u044D\u0442\u043E \u043B\u0443\u0447\u0448\u0430\u044F \u0446\u0435\u043D\u0430, \u043F\u0440\u044F\u043C\u043E\u0439 WhatsApp \u0441 \u0432\u0430\u0448\u0438\u043C \u043F\u0438\u043B\u043E\u0442\u043E\u043C \u0438 \u0431\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u044B\u0439 \u043F\u0435\u0440\u0435\u043D\u043E\u0441 \u043F\u0440\u0438 \u0441\u043C\u0435\u043D\u0435 \u043F\u043E\u0433\u043E\u0434\u044B.',
    faq: [
      { question: '\u041D\u0443\u0436\u0435\u043D \u043B\u0438 \u043E\u043F\u044B\u0442 \u0434\u043B\u044F \u0442\u0430\u043D\u0434\u0435\u043C\u043D\u043E\u0433\u043E \u043F\u043E\u043B\u0451\u0442\u0430?', answer: '\u041D\u0435\u0442, \u043E\u043F\u044B\u0442 \u043D\u0435 \u043D\u0443\u0436\u0435\u043D. \u0412\u044B \u043F\u0440\u0438\u0441\u0442\u0451\u0433\u043D\u0443\u0442\u044B \u043A \u0441\u0435\u0440\u0442\u0438\u0444\u0438\u0446\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u043E\u043C\u0443 \u043F\u0438\u043B\u043E\u0442\u0443, \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u0443\u043F\u0440\u0430\u0432\u043B\u044F\u0435\u0442 \u0432\u0441\u0435\u043C. \u0412\u0430\u0448\u0430 \u0437\u0430\u0434\u0430\u0447\u0430 \u2014 \u043F\u0440\u043E\u0431\u0435\u0436\u0430\u0442\u044C \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0448\u0430\u0433\u043E\u0432 \u043D\u0430 \u0441\u0442\u0430\u0440\u0442\u0435.' },
      { question: '\u0415\u0441\u0442\u044C \u043B\u0438 \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u0438\u044F \u043F\u043E \u0432\u0435\u0441\u0443 \u0438 \u0432\u043E\u0437\u0440\u0430\u0441\u0442\u0443?', answer: '\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u044B\u0439 \u0432\u0435\u0441 \u2014 110 \u043A\u0433. \u041F\u0430\u0441\u0441\u0430\u0436\u0438\u0440\u0430\u043C \u0434\u043E 18 \u043B\u0435\u0442 \u0442\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044F \u0441\u043E\u0433\u043B\u0430\u0441\u0438\u0435 \u0440\u043E\u0434\u0438\u0442\u0435\u043B\u0435\u0439.' },
      { question: '\u0427\u0442\u043E \u043D\u0430\u0434\u0435\u0442\u044C?', answer: '\u0423\u0434\u043E\u0431\u043D\u0443\u044E \u043C\u043D\u043E\u0433\u043E\u0441\u043B\u043E\u0439\u043D\u0443\u044E \u043E\u0434\u0435\u0436\u0434\u0443 \u0438 \u0437\u0430\u043A\u0440\u044B\u0442\u0443\u044E \u043E\u0431\u0443\u0432\u044C. \u0412\u043E\u0437\u044C\u043C\u0438\u0442\u0435 \u043B\u0451\u0433\u043A\u0443\u044E \u043A\u0443\u0440\u0442\u043A\u0443 \u2014 \u043D\u0430 \u0432\u044B\u0441\u043E\u0442\u0435 \u043F\u0440\u043E\u0445\u043B\u0430\u0434\u043D\u043E.' },
      { question: '\u0421\u043A\u043E\u043B\u044C\u043A\u043E \u0434\u043B\u0438\u0442\u0441\u044F \u043F\u043E\u043B\u0451\u0442?', answer: '25\u201345 \u043C\u0438\u043D\u0443\u0442 \u0432 \u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E\u0441\u0442\u0438 \u043E\u0442 \u043F\u0430\u043A\u0435\u0442\u0430 \u0438 \u043F\u043E\u0433\u043E\u0434\u044B.' },
      { question: '\u0411\u0435\u0437\u043E\u043F\u0430\u0441\u0435\u043D \u043B\u0438 \u043F\u0430\u0440\u0430\u043F\u043B\u0430\u043D\u0435\u0440\u0438\u0437\u043C \u0432 \u041E\u043B\u044E\u0434\u0435\u043D\u0438\u0437\u0435?', answer: '\u0421 \u043B\u0438\u0446\u0435\u043D\u0437\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u043C \u043F\u0438\u043B\u043E\u0442\u043E\u043C SHGM \u044D\u0442\u043E \u043E\u0434\u0438\u043D \u0438\u0437 \u0441\u0430\u043C\u044B\u0445 \u0431\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u044B\u0445 \u0432\u0438\u0434\u043E\u0432 \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0433\u043E \u043E\u0442\u0434\u044B\u0445\u0430: \u0435\u0436\u0435\u0434\u043D\u0435\u0432\u043D\u044B\u0435 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0438 \u0441\u043D\u0430\u0440\u044F\u0436\u0435\u043D\u0438\u044F, \u0441\u0442\u0440\u0430\u0445\u043E\u0432\u043A\u0430 \u0438 \u043F\u043E\u043B\u0451\u0442\u044B \u0442\u043E\u043B\u044C\u043A\u043E \u0432 \u0431\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u044B\u0445 \u0443\u0441\u043B\u043E\u0432\u0438\u044F\u0445.' },
      { question: '\u0427\u0442\u043E \u0431\u0443\u0434\u0435\u0442 \u043F\u0440\u0438 \u043F\u043B\u043E\u0445\u043E\u0439 \u043F\u043E\u0433\u043E\u0434\u0435?', answer: '\u0411\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u044C \u043F\u0440\u0435\u0436\u0434\u0435 \u0432\u0441\u0435\u0433\u043E: \u043F\u043E\u043B\u0451\u0442 \u0431\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u043E \u043F\u0435\u0440\u0435\u043D\u043E\u0441\u0438\u0442\u0441\u044F \u043D\u0430 \u0431\u043B\u0438\u0436\u0430\u0439\u0448\u0435\u0435 \u0441\u0432\u043E\u0431\u043E\u0434\u043D\u043E\u0435 \u0432\u0440\u0435\u043C\u044F. \u0415\u0441\u043B\u0438 \u043D\u0435 \u043F\u043E\u043B\u0443\u0447\u0430\u0435\u0442\u0441\u044F \u2014 \u0432\u044B \u043D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043F\u043B\u0430\u0442\u0438\u0442\u0435.' },
      { question: '\u041C\u043E\u0436\u043D\u043E \u043B\u0438 \u0432\u0437\u044F\u0442\u044C \u0442\u0435\u043B\u0435\u0444\u043E\u043D \u0438\u043B\u0438 \u043A\u0430\u043C\u0435\u0440\u0443?', answer: '\u0414\u0430, \u043D\u043E \u0442\u043E\u043B\u044C\u043A\u043E \u043D\u0430\u0434\u0451\u0436\u043D\u043E \u0437\u0430\u043A\u0440\u0435\u043F\u0438\u0432. \u0411\u043E\u043B\u044C\u0448\u0438\u043D\u0441\u0442\u0432\u043E \u0433\u043E\u0441\u0442\u0435\u0439 \u0432\u044B\u0431\u0438\u0440\u0430\u0435\u0442 \u0444\u043E\u0442\u043E-\u0432\u0438\u0434\u0435\u043E \u043F\u0430\u043A\u0435\u0442 \u2014 \u043F\u0438\u043B\u043E\u0442 \u0441\u043D\u0438\u043C\u0430\u0435\u0442, \u0432\u044B \u043E\u0442\u0434\u044B\u0445\u0430\u0435\u0442\u0435.' },
      { question: '\u041A\u0430\u043A \u0431\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u0442\u044C? \u041D\u0443\u0436\u0435\u043D \u043B\u0438 \u0434\u0435\u043F\u043E\u0437\u0438\u0442?', answer: '\u041E\u043D\u043B\u0430\u0439\u043D \u0437\u0430 \u0434\u0432\u0435 \u043C\u0438\u043D\u0443\u0442\u044B \u0438\u043B\u0438 \u0447\u0435\u0440\u0435\u0437 WhatsApp. \u041E\u0431\u044B\u0447\u043D\u043E \u0431\u0435\u0437 \u043F\u0440\u0435\u0434\u043E\u043F\u043B\u0430\u0442\u044B; \u0432 \u0438\u044E\u043B\u0435\u2013\u0430\u0432\u0433\u0443\u0441\u0442\u0435 \u0432\u043E\u0437\u043C\u043E\u0436\u0435\u043D \u043D\u0435\u0431\u043E\u043B\u044C\u0448\u043E\u0439 \u0434\u0435\u043F\u043E\u0437\u0438\u0442.' },
      { question: '\u0413\u0434\u0435 \u0438\u043C\u0435\u043D\u043D\u043E \u043C\u044B \u0432\u0441\u0442\u0440\u0435\u0447\u0430\u0435\u043C\u0441\u044F?', answer: '\u0412 \u0446\u0435\u043D\u0442\u0440\u0435 \u041E\u043B\u044E\u0434\u0435\u043D\u0438\u0437\u0430 \u0443 \u043F\u043B\u044F\u0436\u0430 \u0411\u0435\u043B\u044C\u0434\u0436\u0435\u043A\u0438\u0437. \u0422\u043E\u0447\u043D\u043E\u0435 \u043C\u0435\u0441\u0442\u043E \u0438 \u0432\u0440\u0435\u043C\u044F \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0430\u0435\u043C \u043D\u0430\u043A\u0430\u043D\u0443\u043D\u0435 \u0432 WhatsApp. \u0412\u043E\u0437\u043C\u043E\u0436\u0435\u043D \u0442\u0440\u0430\u043D\u0441\u0444\u0435\u0440 \u0438\u0437 \u043E\u0442\u0435\u043B\u044F.' },
    ],
  },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'tandem' })
  const d: Record<string, string> = {"en": "Tandem paragliding in Oludeniz with certified pilots. No experience needed \u2014 full briefing, all equipment, transfers and beach landing included.", "tr": "Sertifikal\u0131 pilotlarla \u00D6l\u00FCdeniz'de tandem yama\u00E7 para\u015F\u00FCt\u00FC. Deneyim gerekmez \u2014 brifing, t\u00FCm ekipman, transfer ve plaja ini\u015F dahil.", "de": "Tandem-Paragliding in \u00D6l\u00FCdeniz mit zertifizierten Piloten. Keine Erfahrung n\u00F6tig \u2014 Briefing, Ausr\u00FCstung, Transfer und Strandlandung inklusive.", "ru": "\u0422\u0430\u043D\u0434\u0435\u043C\u043D\u044B\u0435 \u043F\u043E\u043B\u0451\u0442\u044B \u043D\u0430 \u043F\u0430\u0440\u0430\u043F\u043B\u0430\u043D\u0435 \u0432 \u041E\u043B\u044E\u0434\u0435\u043D\u0438\u0437\u0435 \u0441 \u0441\u0435\u0440\u0442\u0438\u0444\u0438\u0446\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u043C\u0438 \u043F\u0438\u043B\u043E\u0442\u0430\u043C\u0438. \u041E\u043F\u044B\u0442 \u043D\u0435 \u043D\u0443\u0436\u0435\u043D \u2014 \u0438\u043D\u0441\u0442\u0440\u0443\u043A\u0442\u0430\u0436, \u0441\u043D\u0430\u0440\u044F\u0436\u0435\u043D\u0438\u0435 \u0438 \u0442\u0440\u0430\u043D\u0441\u0444\u0435\u0440 \u0432\u043A\u043B\u044E\u0447\u0435\u043D\u044B."}
  return {
    description: d[locale] || d.en,
    title: `${t('title')} | Book from Babada\u011F`,
    alternates: localeAlternates(locale, '/tandem-paragliding'),
    openGraph: { url: localeUrl(locale, '/tandem-paragliding'), title: `${t('title')} | Book from Babada\u011F`, description: d[locale] || d.en },
    twitter: { card: 'summary_large_image', description: d[locale] || d.en },
  }
}

export default async function TandemPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const lp = (href: string) => locale === 'en' ? href : `/${locale}${href}`
  const t = await getTranslations({ locale, namespace: 'tandem' })
  const c = CONTENT[locale] || CONTENT.en

  const included = [t('inc1'), t('inc2'), t('inc3'), t('inc4'), t('inc5'), t('inc6'), t('inc7')]

  const subPages = [
    { href: '/tandem-paragliding/first-time', title: t('firstTime'), desc: t('firstTimeDesc'), emoji: '\u{1F389}' },
    { href: '/tandem-paragliding/sunset-flight', title: t('sunsetTitle'), desc: t('sunsetDesc'), emoji: '\u{1F305}' },
    { href: '/tandem-paragliding/group-flights', title: t('groupTitle'), desc: t('groupDesc'), emoji: '\u{1F465}' },
    { href: '/tandem-paragliding/safety-guide', title: t('safetyTitle'), desc: t('safetyDesc'), emoji: '\u{1F6E1}\uFE0F' },
  ]

  return (
    <>
      <ServiceSchema name="Tandem Paragliding Flight in Oludeniz" description="Tandem paragliding flight from Babadağ with a certified pilot, including briefing, equipment, transfer and beach landing." path="/tandem-paragliding" serviceType="Tandem Paragliding Flight" />
      <PageHero title={t('title')} subtitle={t('subtitle')} badge={t('badge')} bgImage="https://v3b.fal.media/files/b/0a9d7c09/2htlcwkJ6pcLBY7gPtf7z.jpg" />
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3">
          <BreadcrumbNav items={[{ label: t('title') }]} />
        </div>
      </div>

      <section className="section-padding bg-white">
        <div className="container-default">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">{t('included')}</h2>
              <ul className="space-y-3 mb-8">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-4 flex-wrap">
                <Link href={lp("/book-now")} className="btn-primary">{t('bookNow')} <ArrowRight className="w-4 h-4" /></Link>
                <Link href={lp("/prices")} className="btn-secondary">{t('viewPrices')}</Link>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {subPages.map((p) => (
                <Link key={p.href} href={lp(p.href)} className="card p-5 hover:shadow-md transition-shadow group">
                  <span className="text-3xl mb-3 block">{p.emoji}</span>
                  <h3 className="font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">{p.title}</h3>
                  <p className="text-sm text-slate-600">{p.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Long-form SEO content */}
      <section className="section-padding bg-slate-50">
        <div className="container-default max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">{c.whyTitle}</h2>
          <p className="text-slate-700 leading-relaxed mb-10">{c.whyBody}</p>

          <h2 className="text-2xl font-bold text-slate-900 mb-6">{c.stepsTitle}</h2>
          <div className="space-y-5 mb-4">
            {c.steps.map((s) => (
              <div key={s.t}>
                <h3 className="font-bold text-slate-900 mb-1">{s.t}</h3>
                <p className="text-slate-700 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
          <p className="text-slate-700 font-medium mb-10">{c.stepsOutro}</p>

          <h2 className="text-2xl font-bold text-slate-900 mb-6">{c.optTitle}</h2>
          <div className="space-y-4 mb-3">
            {c.options.map((o) => (
              <div key={o.name} className="card p-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-900">{o.name}</h3>
                  <p className="text-sm text-slate-600">{o.desc}</p>
                </div>
                <span className="text-lg font-bold text-orange-600 whitespace-nowrap">{o.price}</span>
              </div>
            ))}
          </div>
          <p className="text-slate-700 mb-2">{c.optNote}</p>
          <p className="mb-10"><Link href={lp('/prices')} className="text-orange-600 font-medium hover:underline">{t('viewPrices')} →</Link></p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">{c.safetyTitle}</h2>
          <p className="text-slate-700 leading-relaxed mb-10">{c.safetyBody}</p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">{c.timeTitle}</h2>
          <p className="text-slate-700 leading-relaxed mb-10">{c.timeBody}</p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">{c.knowTitle}</h2>
          <p className="text-slate-700 leading-relaxed mb-10">{c.knowBody}</p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">{c.atmosTitle}</h2>
          <p className="text-slate-700 leading-relaxed">{c.atmosBody}</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <FAQAccordion items={c.faq} />
        </div>
      </section>

      <BookingCTA />
    </>
  )
}
