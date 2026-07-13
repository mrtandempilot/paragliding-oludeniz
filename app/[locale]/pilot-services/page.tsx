import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'
import ServiceSchema from '@/components/shared/ServiceSchema'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Pilot Services Oludeniz",tr:"Oludeniz Pilot Hizmetleri",de:"Pilotendienste Oludeniz",ru:"Услуги пилотам Олюдениз"}
  const d = {en:"Everything a visiting pilot needs at Babadağ.",tr:"Babadağ'ı ziyaret eden bir pilotun ihtiyacı olan her şey.",de:"Alles, was ein Gastpilot am Babadağ braucht.",ru:"Всё, что нужно приезжему пилоту на Бабадаге."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/pilot-services'),
    openGraph: { url: localeUrl(locale, '/pilot-services'), description: (d as any)[locale] || d.en, images: ['https://www.atmosparagliding.com/opengraph-image'] },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "What Services Are Available to Visiting Pilots at Babadağ?", "ps": ["We support solo and XC pilots with a full range of services: equipment hire (harnesses, helmets, reserve parachutes), meteorology briefings, retrieve service, secure equipment storage, GoPro and photography, and radio hire — whether you're here for a day or a full season."]}, {"h2": "What Do You Need on Your First Visit?", "ps": ["All pilots must present a valid licence and logbook on first visit. We provide a full airspace, procedures and emergency contacts briefing pack, plus access to our daily pilot WhatsApp group for real-time conditions updates."]}, {"h2": "What Are the Operating Hours?", "ps": ["Pilot services run 07:00–19:00 daily during the main season (April–October). Off-season, services are available by appointment."]}], "faqTitle": "FAQ – Pilot Services", "faqs": [{"q": "What do I need to bring on my first visit?", "a": "A valid pilot licence and logbook — we'll take you through airspace, procedures and emergency contacts once you check in."}, {"q": "Can I get a weather briefing before flying?", "a": "Yes, we run daily 07:30 meteorology briefings covering wind, cloudbase, thermal forecast and a go/no-go recommendation."}, {"q": "Is retrieve service available for XC flights?", "a": "Yes — pre-book before launch so we know your planned route, and we track your location via WhatsApp during the flight."}], "relatedTitle": "Pilot Services", "related": [{"href": "/pilot-services/equipment-rental", "label": "Equipment Rental"}, {"href": "/pilot-services/meteorology", "label": "Meteorology Briefings"}, {"href": "/pilot-services/retrieval", "label": "Retrieve Service"}, {"href": "/pilot-services/radio-hire", "label": "Radio Hire"}, {"href": "/pilot-services/storage", "label": "Equipment Storage"}, {"href": "/pilot-services/gopro-video", "label": "GoPro Video"}, {"href": "/pilot-services/photography", "label": "Photography"}, {"href": "/solo-paragliding", "label": "Solo Paragliding"}]}, "tr": {"sections": [{"h2": "Babadağ'ı Ziyaret Eden Pilotlar İçin Hangi Hizmetler Mevcut?", "ps": ["Solo ve XC pilotlarını tam bir hizmet yelpazesiyle destekliyoruz: ekipman kiralama (koşum takımı, kask, yedek paraşüt), meteoroloji brifingleri, geri alma hizmeti, güvenli ekipman depolama, GoPro ve fotoğrafçılık, telsiz kiralama — ister bir gün ister tüm sezon burada olun."]}, {"h2": "İlk Ziyaretinizde Neye İhtiyacınız Var?", "ps": ["Tüm pilotlar ilk ziyarette geçerli bir lisans ve pilot kayıt defteri (logbook) sunmalıdır. Tam bir hava sahası, prosedürler ve acil durum kişileri brifing paketi ile günlük koşullar için pilot WhatsApp grubuna erişim sağlıyoruz."]}, {"h2": "Çalışma Saatleri Nedir?", "ps": ["Pilot hizmetleri ana sezonda (Nisan-Ekim) her gün 07:00-19:00 arasında çalışır. Sezon dışında randevu ile hizmet verilir."]}], "faqTitle": "SSS – Pilot Hizmetleri", "faqs": [{"q": "İlk ziyaretimde neyi yanımda getirmeliyim?", "a": "Geçerli bir pilot lisansı ve logbook — check-in yaptığınızda hava sahası, prosedürler ve acil durum kişileri konusunda sizi bilgilendiririz."}, {"q": "Uçmadan önce hava durumu brifingi alabilir miyim?", "a": "Evet, rüzgar, bulut tabanı, termik tahmini ve go/no-go önerisini kapsayan günlük 07:30 meteoroloji brifingleri düzenliyoruz."}, {"q": "XC uçuşlar için geri alma hizmeti var mı?", "a": "Evet — planladığınız rotayı bilmemiz için kalkıştan önce rezervasyon yapın, uçuş sırasında WhatsApp üzerinden konumunuzu takip ediyoruz."}], "relatedTitle": "Pilot Hizmetleri", "related": [{"href": "/pilot-services/equipment-rental", "label": "Ekipman Kiralama"}, {"href": "/pilot-services/meteorology", "label": "Meteoroloji Brifingleri"}, {"href": "/pilot-services/retrieval", "label": "Geri Alma Hizmeti"}, {"href": "/pilot-services/radio-hire", "label": "Telsiz Kiralama"}, {"href": "/pilot-services/storage", "label": "Ekipman Depolama"}, {"href": "/pilot-services/gopro-video", "label": "GoPro Video"}, {"href": "/pilot-services/photography", "label": "Fotoğrafçılık"}, {"href": "/solo-paragliding", "label": "Solo Yamaç Paraşütü"}]}, "de": {"sections": [{"h2": "Welche Dienste stehen Gastpiloten am Babadağ zur Verfügung?", "ps": ["Wir unterstützen Solo- und XC-Piloten mit einem vollständigen Serviceangebot: Ausrüstungsverleih (Gurtzeuge, Helme, Rettungsschirme), Meteorologie-Briefings, Abholservice, sichere Ausrüstungslagerung, GoPro und Fotografie sowie Funkgeräteverleih — egal ob Sie einen Tag oder eine ganze Saison hier sind."]}, {"h2": "Was brauchen Sie bei Ihrem ersten Besuch?", "ps": ["Alle Piloten müssen bei ihrem ersten Besuch eine gültige Lizenz und ein Flugbuch vorlegen. Wir stellen ein vollständiges Briefing-Paket zu Luftraum, Verfahren und Notfallkontakten bereit sowie Zugang zu unserer täglichen Piloten-WhatsApp-Gruppe für Echtzeit-Updates zu den Bedingungen."]}, {"h2": "Wie sind die Öffnungszeiten?", "ps": ["Die Pilotendienste sind während der Hauptsaison (April–Oktober) täglich von 07:00–19:00 Uhr verfügbar. Außerhalb der Saison nach Vereinbarung."]}], "faqTitle": "FAQ – Pilotendienste", "faqs": [{"q": "Was muss ich bei meinem ersten Besuch mitbringen?", "a": "Eine gültige Pilotenlizenz und ein Flugbuch — beim Check-in führen wir Sie durch Luftraum, Verfahren und Notfallkontakte."}, {"q": "Kann ich vor dem Flug ein Wetterbriefing bekommen?", "a": "Ja, wir bieten tägliche Briefings um 07:30 Uhr mit Wind, Wolkenbasis, Thermikprognose und einer Go/No-Go-Empfehlung."}, {"q": "Gibt es Abholservice für Streckenflüge?", "a": "Ja — buchen Sie vor dem Start, damit wir Ihre geplante Route kennen, und wir verfolgen Ihren Standort während des Flugs über WhatsApp."}], "relatedTitle": "Pilotendienste", "related": [{"href": "/pilot-services/equipment-rental", "label": "Ausrüstungsverleih"}, {"href": "/pilot-services/meteorology", "label": "Meteorologie-Briefings"}, {"href": "/pilot-services/retrieval", "label": "Abholservice"}, {"href": "/pilot-services/radio-hire", "label": "Funkvermietung"}, {"href": "/pilot-services/storage", "label": "Ausrüstungslagerung"}, {"href": "/pilot-services/gopro-video", "label": "GoPro-Video"}, {"href": "/pilot-services/photography", "label": "Fotografie"}, {"href": "/solo-paragliding", "label": "Solo-Paragliding"}]}, "ru": {"sections": [{"h2": "Какие услуги доступны приезжим пилотам на Бабадаге?", "ps": ["Мы поддерживаем соло- и XC-пилотов полным спектром услуг: аренда снаряжения (подвесные системы, шлемы, запасные парашюты), метео-брифинги, услуга подбора, надёжное хранение снаряжения, GoPro и фотография, аренда раций — независимо от того, здесь вы на день или на весь сезон."]}, {"h2": "Что нужно при первом визите?", "ps": ["Все пилоты должны предъявить действующую лицензию и лётную книжку при первом визите. Мы предоставляем полный инструктаж по воздушному пространству, процедурам и контактам на случай ЧС, а также доступ к нашей ежедневной группе WhatsApp для пилотов с актуальными условиями."]}, {"h2": "Каковы часы работы?", "ps": ["Услуги для пилотов работают ежедневно с 07:00 до 19:00 в течение основного сезона (апрель–октябрь). Вне сезона — по предварительной записи."]}], "faqTitle": "FAQ – услуги для пилотов", "faqs": [{"q": "Что нужно взять с собой при первом визите?", "a": "Действующую лицензию пилота и лётную книжку — при регистрации мы расскажем о воздушном пространстве, процедурах и контактах на случай ЧС."}, {"q": "Можно ли получить метеобрифинг перед полётом?", "a": "Да, мы проводим ежедневные брифинги в 07:30, охватывающие ветер, облачность, прогноз термиков и рекомендацию go/no-go."}, {"q": "Доступна ли услуга подбора для XC-полётов?", "a": "Да — забронируйте заранее перед стартом, чтобы мы знали ваш планируемый маршрут, и мы отслеживаем ваше местоположение через WhatsApp во время полёта."}], "relatedTitle": "Услуги для пилотов", "related": [{"href": "/pilot-services/equipment-rental", "label": "Аренда снаряжения"}, {"href": "/pilot-services/meteorology", "label": "Метео-брифинги"}, {"href": "/pilot-services/retrieval", "label": "Услуга подбора"}, {"href": "/pilot-services/radio-hire", "label": "Аренда раций"}, {"href": "/pilot-services/storage", "label": "Хранение снаряжения"}, {"href": "/pilot-services/gopro-video", "label": "GoPro-видео"}, {"href": "/pilot-services/photography", "label": "Фотография"}, {"href": "/solo-paragliding", "label": "Соло-парапланеризм"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'pilotServices' })
  const titles = {en:"Pilot Services Oludeniz",tr:"Oludeniz Pilot Hizmetleri",de:"Pilotendienste Oludeniz",ru:"Услуги пилотам Олюдениз"}
  const subs = {en:"Everything a visiting pilot needs at Babadağ.",tr:"Babadağ'ı ziyaret eden bir pilotun ihtiyacı olan her şey.",de:"Alles, was ein Gastpilot am Babadağ braucht.",ru:"Всё, что нужно приезжему пилоту на Бабадаге."}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <ServiceSchema name="Pilot Services Oludeniz" description="Equipment rental, storage, retrieval, radio hire and photography services for visiting pilots." path="/pilot-services" serviceType="Pilot Services" />
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c13/VVJ_THDhVNeRP66pu_Ew8.jpg" />
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3"><BreadcrumbNav items={[{ label: title }]} /></div>
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
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-3">{c.relatedTitle}</h2>
            <ul className="space-y-2">
              {c.related.map((r: any) => (
                <li key={r.href}><Link href={lp(r.href)} className="text-orange-600 hover:underline">{r.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <BookingCTA />
    </>
  )
}
