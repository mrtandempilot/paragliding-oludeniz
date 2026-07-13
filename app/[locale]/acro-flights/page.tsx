import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'
import ServiceSchema from '@/components/shared/ServiceSchema'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'acro' })
  const d: Record<string, string> = {"en": "Extreme acro paragliding in Oludeniz: spirals, infinity tumbling and heart-pumping manoeuvres with world-class acro pilots over the Blue Lagoon.", "tr": "Ölüdeniz'de ekstrem akro yamaç paraşütü: dünya klasmanında akro pilotlarla spiral, infinity tumbling ve nefes kesen manevralar.", "de": "Extremes Acro-Paragliding in Ölüdeniz: Spiralen, Infinity Tumbling und atemberaubende Manöver mit Weltklasse-Acro-Piloten.", "ru": "Экстремальный акро-парапланеризм в Олюденизе: спирали, infinity tumbling и захватывающие манёвры с пилотами мирового класса."}
  return {
    description: d[locale] || d.en,
    alternates: localeAlternates(locale, '/acro-flights'),
    openGraph: { url: localeUrl(locale, '/acro-flights'), description: d[locale] || d.en },
    twitter: { card: 'summary_large_image', description: d[locale] || d.en }, title: `${t('title')}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "What Is Acro Paragliding and Why Is Ölüdeniz Famous for It?", "ps": ["Acro paragliding takes the wing beyond normal flight into deliberate spirals, wingovers, SATs and infinity tumbling — technical, high-energy manoeuvres performed by pilots who train specifically for it. Ölüdeniz's combination of altitude, reliable thermals and a wide bay has made it one of the world's top acro training and competition sites, hosting international events and drawing elite pilots every season."]}, {"h2": "Can You Try a Tandem Acro Flight as a Visitor?", "ps": ["Yes. A tandem acro flight is a step up from a standard sightseeing tandem — your pilot builds in controlled spirals and dynamic manoeuvres for passengers who want more intensity than a calm scenic flight. It's a good option if you've already done a standard tandem or simply want more adrenaline from the start."]}, {"h2": "Where Can You Watch Acro Flying in Ölüdeniz?", "ps": ["The bay in front of Ölüdeniz beach is the main stage — acro pilots often fly and train directly over the water where spectators can watch from the beach or promenade. Timing varies with conditions and events; our meeting points guide covers where locals gather."]}, {"h2": "How Do You Get Involved in the Local Acro Community?", "ps": ["Ölüdeniz has an established acro scene with regular training sessions and occasional competitions. See our dedicated pages on acro safety standards, pilots active in the area, upcoming events and common meeting points to get plugged in."]}], "faqTitle": "FAQ – Acro Paragliding", "faqs": [{"q": "Is acro paragliding safe for tandem passengers?", "a": "Tandem acro flights are flown by pilots specifically trained and current in acro manoeuvres, and the intensity is adjusted to what you're comfortable with — tell your pilot your limit before takeoff."}, {"q": "Do I need experience to try a tandem acro flight?", "a": "No prior experience is needed as a passenger. It's a good idea to have done a standard tandem flight first if you're unsure how you'll feel about the extra intensity."}, {"q": "When is the best time to watch acro flying at Ölüdeniz?", "a": "Acro flying happens through the flying season (April–October) when thermal and wind conditions suit it — afternoons often see the most activity over the bay."}], "relatedTitle": "Explore Acro Flying", "related": [{"href": "/acro-flights/safety", "label": "Acro Safety Standards"}, {"href": "/acro-flights/pilots", "label": "Local Acro Pilots"}, {"href": "/acro-flights/events", "label": "Acro Events"}, {"href": "/acro-flights/meeting-points", "label": "Meeting Points"}]}, "tr": {"sections": [{"h2": "Akro Yamaç Paraşütü Nedir ve Ölüdeniz Neden Ünlü?", "ps": ["Akro yamaç paraşütü, kanadı normal uçuşun ötesine taşıyarak kasıtlı spiraller, wingover'lar, SAT'lar ve infinity tumbling gibi özel eğitim gerektiren teknik, yüksek enerjili manevralar içerir. Ölüdeniz'in irtifa, güvenilir termikler ve geniş körfez kombinasyonu, onu dünyanın en iyi akro eğitim ve yarışma sahalarından biri yapmış; her sezon uluslararası etkinliklere ev sahipliği yapıyor ve seçkin pilotları çekiyor."]}, {"h2": "Ziyaretçi Olarak Tandem Akro Uçuşu Deneyebilir miyim?", "ps": ["Evet. Tandem akro uçuşu, standart manzara tandeminden bir üst seviyedir — pilotunuz sakin bir manzara uçuşundan daha fazla yoğunluk isteyen yolcular için kontrollü spiraller ve dinamik manevralar ekler. Daha önce standart bir tandem yaptıysanız veya baştan daha fazla adrenalin istiyorsanız iyi bir seçenektir."]}, {"h2": "Ölüdeniz'de Akro Uçuşunu Nerede İzleyebilirsiniz?", "ps": ["Ölüdeniz plajının önündeki körfez ana sahnedir — akro pilotları genellikle doğrudan suyun üzerinde uçar ve antrenman yapar; izleyiciler plajdan veya sahil yolundan izleyebilir. Zamanlama koşullara ve etkinliklere göre değişir; buluşma noktaları rehberimiz yerel toplanma yerlerini kapsar."]}, {"h2": "Yerel Akro Topluluğuna Nasıl Dahil Olunur?", "ps": ["Ölüdeniz'de düzenli antrenman seansları ve ara sıra yarışmalarla yerleşik bir akro sahnesi var. Bağlantı kurmak için akro güvenlik standartları, bölgede aktif pilotlar, yaklaşan etkinlikler ve yaygın buluşma noktaları hakkındaki özel sayfalarımıza bakın."]}], "faqTitle": "SSS – Akro Yamaç Paraşütü", "faqs": [{"q": "Akro yamaç paraşütü tandem yolcular için güvenli mi?", "a": "Tandem akro uçuşları özel olarak eğitilmiş ve akro manevralarında güncel pilotlar tarafından yapılır; yoğunluk sizin konforunuza göre ayarlanır — kalkıştan önce sınırınızı pilotunuza söyleyin."}, {"q": "Tandem akro uçuşu denemek için tecrübe gerekli mi?", "a": "Yolcu olarak önceden tecrübeye gerek yok. Ekstra yoğunluğa nasıl tepki vereceğinizden emin değilseniz önce standart bir tandem uçuş yapmak iyi bir fikirdir."}, {"q": "Ölüdeniz'de akro uçuşunu izlemek için en iyi zaman ne?", "a": "Akro uçuşu, termik ve rüzgar koşullarının uygun olduğu uçuş sezonu boyunca (Nisan-Ekim) gerçekleşir — öğleden sonraları körfez üzerinde genellikle en yoğun aktivite görülür."}], "relatedTitle": "Akro Uçuşunu Keşfedin", "related": [{"href": "/acro-flights/safety", "label": "Akro Güvenlik Standartları"}, {"href": "/acro-flights/pilots", "label": "Yerel Akro Pilotları"}, {"href": "/acro-flights/events", "label": "Akro Etkinlikleri"}, {"href": "/acro-flights/meeting-points", "label": "Buluşma Noktaları"}]}, "de": {"sections": [{"h2": "Was ist Acro-Paragliding und warum ist Ölüdeniz dafür berühmt?", "ps": ["Acro-Paragliding führt den Schirm über den normalen Flug hinaus in bewusste Spiralen, Wingover, SATs und Infinity Tumbling — technische, energiegeladene Manöver, die von speziell dafür trainierten Piloten geflogen werden. Die Kombination aus Höhe, verlässlicher Thermik und weiter Bucht hat Ölüdeniz zu einem der weltbesten Acro-Trainings- und Wettkampforte gemacht, der internationale Events ausrichtet und jede Saison Elite-Piloten anzieht."]}, {"h2": "Kann man als Besucher einen Tandem-Acro-Flug ausprobieren?", "ps": ["Ja. Ein Tandem-Acro-Flug ist eine Steigerung gegenüber einem normalen Sightseeing-Tandemflug — Ihr Pilot baut kontrollierte Spiralen und dynamische Manöver für Passagiere ein, die mehr Intensität als einen ruhigen Aussichtsflug möchten. Eine gute Option, wenn Sie bereits einen Standard-Tandemflug gemacht haben oder von Anfang an mehr Adrenalin wollen."]}, {"h2": "Wo kann man Acro-Fliegen in Ölüdeniz beobachten?", "ps": ["Die Bucht vor dem Strand von Ölüdeniz ist die Hauptbühne — Acro-Piloten fliegen und trainieren oft direkt über dem Wasser, wo Zuschauer vom Strand oder von der Promenade zusehen können. Der Zeitpunkt variiert je nach Bedingungen und Events; unser Leitfaden zu Treffpunkten zeigt, wo sich Einheimische versammeln."]}, {"h2": "Wie wird man Teil der lokalen Acro-Community?", "ps": ["Ölüdeniz hat eine etablierte Acro-Szene mit regelmäßigen Trainingseinheiten und gelegentlichen Wettkämpfen. Unsere Seiten zu Acro-Sicherheitsstandards, aktiven Piloten vor Ort, kommenden Events und üblichen Treffpunkten helfen Ihnen beim Einstieg."]}], "faqTitle": "FAQ – Acro-Paragliding", "faqs": [{"q": "Ist Acro-Paragliding für Tandempassagiere sicher?", "a": "Tandem-Acro-Flüge werden von speziell trainierten und aktuell zertifizierten Acro-Piloten geflogen, und die Intensität wird an Ihr Komfortniveau angepasst — teilen Sie Ihrem Piloten vor dem Start Ihre Grenze mit."}, {"q": "Brauche ich Erfahrung für einen Tandem-Acro-Flug?", "a": "Als Passagier ist keine Vorerfahrung nötig. Es ist ratsam, zuvor einen Standard-Tandemflug gemacht zu haben, wenn Sie unsicher sind, wie Sie auf die zusätzliche Intensität reagieren."}, {"q": "Wann ist die beste Zeit, um Acro-Fliegen in Ölüdeniz zu beobachten?", "a": "Acro-Fliegen findet während der gesamten Flugsaison (April–Oktober) statt, wenn Thermik und Wind passen — nachmittags ist über der Bucht meist am meisten los."}], "relatedTitle": "Acro-Fliegen entdecken", "related": [{"href": "/acro-flights/safety", "label": "Acro-Sicherheitsstandards"}, {"href": "/acro-flights/pilots", "label": "Lokale Acro-Piloten"}, {"href": "/acro-flights/events", "label": "Acro-Events"}, {"href": "/acro-flights/meeting-points", "label": "Treffpunkte"}]}, "ru": {"sections": [{"h2": "Что такое акро-парапланеризм и почему Олюдениз им знаменит?", "ps": ["Акро-парапланеризм выводит крыло за пределы обычного полёта в намеренные спирали, wingover, SAT и infinity tumbling — технически сложные, энергичные манёвры, которые выполняют специально подготовленные пилоты. Сочетание высоты, стабильных термиков и широкого залива сделало Олюдениз одним из лучших в мире мест для тренировок и соревнований по акро — здесь проходят международные события и каждый сезон собираются элитные пилоты."]}, {"h2": "Можно ли попробовать тандемный акро-полёт как гость?", "ps": ["Да. Тандемный акро-полёт — это шаг вперёд по сравнению со стандартным обзорным тандемом: пилот добавляет контролируемые спирали и динамичные манёвры для пассажиров, желающих больше интенсивности, чем спокойный обзорный полёт. Хороший вариант, если вы уже летали стандартным тандемом или сразу хотите больше адреналина."]}, {"h2": "Где можно посмотреть акро-полёты в Олюденизе?", "ps": ["Залив перед пляжем Олюдениз — главная сцена: акро-пилоты часто летают и тренируются прямо над водой, где зрители могут наблюдать с пляжа или набережной. Время зависит от условий и событий; наш гид по местам встреч покажет, где собираются местные."]}, {"h2": "Как присоединиться к местному акро-сообществу?", "ps": ["В Олюденизе сложилась устоявшаяся акро-сцена с регулярными тренировками и периодическими соревнованиями. Наши страницы о стандартах безопасности акро, активных в регионе пилотах, предстоящих событиях и обычных местах встреч помогут влиться."]}], "faqTitle": "FAQ – акро-парапланеризм", "faqs": [{"q": "Безопасен ли акро-парапланеризм для тандемных пассажиров?", "a": "Тандемные акро-полёты выполняют специально подготовленные и аттестованные пилоты, а интенсивность подстраивается под ваш уровень комфорта — сообщите пилоту свой предел перед взлётом."}, {"q": "Нужен ли опыт для тандемного акро-полёта?", "a": "Пассажиру предварительный опыт не нужен. Если не уверены, как отреагируете на дополнительную интенсивность, стоит сначала попробовать стандартный тандемный полёт."}, {"q": "Когда лучшее время для наблюдения за акро-полётами в Олюденизе?", "a": "Акро-полёты проходят весь сезон (апрель–октябрь), когда термики и ветер подходят — во второй половине дня над заливом обычно больше всего активности."}], "relatedTitle": "Исследуйте акро-полёты", "related": [{"href": "/acro-flights/safety", "label": "Стандарты безопасности акро"}, {"href": "/acro-flights/pilots", "label": "Местные акро-пилоты"}, {"href": "/acro-flights/events", "label": "Акро-события"}, {"href": "/acro-flights/meeting-points", "label": "Места встреч"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'acro' })
  const linkLabels: Record<string,string> = {"en": "Contact Us", "tr": "Bize Ulaşın", "de": "Kontakt", "ru": "Связаться"}
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  const linkLabel = linkLabels[locale]||linkLabels.en
  const linkHref = locale === 'en' ? '/contact' : `/${locale}/contact`

  return (
    <>
      <ServiceSchema name="Acro Paragliding Flight" description="Acrobatic tandem paragliding with spirals and extreme manoeuvres over Oludeniz." path="/acro-flights" serviceType="Acro Paragliding Flight" />
      <PageHero title={t('title')} subtitle={t('subtitle')} badge={t('badge')} bgImage="https://v3b.fal.media/files/b/0a9d7c0b/Ma1uD1AUlcpoxL-48cgg4.jpg" />
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3">
          <BreadcrumbNav items={[{ label: t('title') }]} />
        </div>
      </div>
            <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          {c.sections.map((s: any) => (
            <div key={s.h2} className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">{s.h2}</h2>
              {s.ps.map((p: string, i: number) => <p key={i} className="text-slate-600 leading-relaxed mb-4">{p}</p>)}
              {s.bullets && <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-4">{s.bullets.map((b: string, i: number) => <li key={i}>{b}</li>)}</ul>}
            </div>
          ))}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">{c.faqTitle}</h2>
            {c.faqs.map((f: any) => (
              <div key={f.q} className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{f.q}</h3>
                <p className="text-slate-600 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3">{c.relatedTitle}</h2>
            <ul className="space-y-2">
              {c.related.map((r: any) => (
                <li key={r.href}><Link href={lp(r.href)} className="text-orange-600 hover:underline">{r.label}</Link></li>
              ))}
            </ul>
          </div>
          <div className="pt-2">
            <Link href={linkHref} className="btn-primary">{linkLabel} <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>
      <BookingCTA />
    </>
  )
}
