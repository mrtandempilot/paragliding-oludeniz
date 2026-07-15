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
  const t = {en:"Equipment Requirements Oludeniz",tr:"Oludeniz Ekipman Gereksinimleri",de:"Ausrüstungsanforderungen Oludeniz",ru:"Требования к снаряжению Олюдениз"}
  const d = {en:"What equipment you need to fly solo at Babadağ.",tr:"Babadağ'da solo uçmak için ihtiyacınız olan ekipman.",de:"Welche Ausrüstung Sie brauchen, um solo am Babadağ zu fliegen.",ru:"Какое снаряжение нужно для соло полётов на Бабадаге."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/solo-paragliding/equipment-requirements'),
    openGraph: { url: localeUrl(locale, '/solo-paragliding/equipment-requirements'), description: (d as any)[locale] || d.en, images: ['https://www.atmosparagliding.com/solo-paragliding/opengraph-image'] },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "What Equipment Do Solo Pilots Need at Babadağ?", "ps": ["The standard airworthy kit applies — nothing exotic, but everything checked: certified wing appropriate to your rating, harness with protector, in-date reserve parachute, helmet, and instruments suited to a busy site.", "Site officials may ask to see equipment documentation at registration, so travel with your paperwork in order."]}, {"h2": "The Checklist", "ps": ["What to bring — and what gets checked:"], "bullets": ["Certified glider matching your licence level, with a current check report", "Harness with back protector and an in-date, professionally repacked reserve", "Helmet (mandatory), sturdy footwear, gloves for the higher launches", "Vario/GPS recommended — altitude awareness matters under a controlled-airspace ceiling", "Radio recommended; hire is available locally if you travel light"]}, {"h2": "Travelling with Gear vs Renting Locally", "ps": ["Most airlines take glider bags as sports luggage — book it in advance. If you prefer to travel light, local equipment rental covers wings, harnesses and instruments through our pilot services.", "Storage between flying days is also available, so you do not have to haul gear to your hotel."]}], "faqTitle": "FAQ – Equipment", "faqs": [{"q": "Is a reserve parachute mandatory at Babadağ?", "a": "Yes — an in-date reserve is part of the required kit, and documentation may be checked at site registration. Fly nothing less."}, {"q": "Can I rent paragliding equipment in Ölüdeniz?", "a": "Yes — certified wings, harnesses and instruments are available through local rental, including our pilot services. Book ahead in peak season."}, {"q": "What instruments do I really need here?", "a": "A vario with altitude readout is the practical minimum — the site sits under an airspace ceiling. GPS logging and radio round out the recommended kit."}], "relatedTitle": "Explore More", "related": [{"href": "/solo-paragliding", "label": "Solo Paragliding Guide"}, {"href": "/solo-paragliding/flight-rules", "label": "Flight Rules"}, {"href": "/pilot-services/equipment-rental", "label": "Equipment Rental"}, {"href": "/pilot-services", "label": "Pilot Services"}]}, "tr": {"sections": [{"h2": "Babadağ'da Solo Pilotlara Hangi Ekipman Gerekir?", "ps": ["Standart uçuşa elverişli kit geçerlidir — egzotik bir şey yok ama her şey kontrollü: seviyenize uygun sertifikalı kanat, koruyuculu harness, tarihi geçerli yedek paraşüt, kask ve yoğun bir sahaya uygun aletler.", "Saha yetkilileri kayıtta ekipman belgelerini görmek isteyebilir; evraklarınız düzenli şekilde seyahat edin."]}, {"h2": "Kontrol Listesi", "ps": ["Getirilecekler — ve kontrol edilenler:"], "bullets": ["Lisans seviyenize uygun, güncel check raporlu sertifikalı kanat", "Sırt koruyuculu harness ve tarihi geçerli, profesyonelce yeniden paketlenmiş yedek paraşüt", "Kask (zorunlu), sağlam ayakkabı, üst pistler için eldiven", "Vario/GPS önerilir — kontrollü hava sahası tavanı altında irtifa farkındalığı önemlidir", "Telsiz önerilir; hafif seyahat ediyorsanız yerinde kiralama mevcuttur"]}, {"h2": "Ekipmanla Seyahat mi, Yerinde Kiralama mı?", "ps": ["Çoğu havayolu kanat çantalarını spor bagajı olarak taşır — önceden rezerve edin. Hafif seyahati tercih ederseniz pilot hizmetlerimiz üzerinden yerel kiralama; kanat, harness ve aletleri kapsar.", "Uçuş günleri arasında depolama da mevcuttur; ekipmanı otelinize taşımak zorunda kalmazsınız."]}], "faqTitle": "SSS – Ekipman", "faqs": [{"q": "Babadağ'da yedek paraşüt zorunlu mu?", "a": "Evet — tarihi geçerli yedek paraşüt gerekli kitin parçasıdır ve belgeler saha kaydında kontrol edilebilir. Daha azıyla uçmayın."}, {"q": "Ölüdeniz'de yamaç paraşütü ekipmanı kiralanır mı?", "a": "Evet — sertifikalı kanatlar, harnessler ve aletler, pilot hizmetlerimiz dahil yerel kiralamayla mevcut. Yoğun sezonda önceden ayırtın."}, {"q": "Burada gerçekten hangi aletlere ihtiyacım var?", "a": "İrtifa gösteren bir vario pratik minimumdur — saha bir hava sahası tavanının altındadır. GPS kaydı ve telsiz, önerilen kiti tamamlar."}], "relatedTitle": "Daha Fazlasını Keşfedin", "related": [{"href": "/solo-paragliding", "label": "Solo Yamaç Paraşütü Rehberi"}, {"href": "/solo-paragliding/flight-rules", "label": "Uçuş Kuralları"}, {"href": "/pilot-services/equipment-rental", "label": "Ekipman Kiralama"}, {"href": "/pilot-services", "label": "Pilot Hizmetleri"}]}, "de": {"sections": [{"h2": "Welche Ausrüstung brauchen Solopiloten am Babadağ?", "ps": ["Es gilt das lufttüchtige Standard-Kit — nichts Exotisches, aber alles geprüft: zertifizierter Schirm passend zur Einstufung, Gurtzeug mit Protektor, Rettungsschirm mit gültigem Packintervall, Helm und Instrumente für ein stark frequentiertes Gebiet.", "Die Geländeoffiziellen können bei der Registrierung Ausrüstungsnachweise sehen wollen — reisen Sie mit geordneten Unterlagen."]}, {"h2": "Die Checkliste", "ps": ["Was mitkommt — und was geprüft wird:"], "bullets": ["Zertifizierter Schirm passend zum Lizenzlevel, mit aktuellem Check-Bericht", "Gurtzeug mit Rückenprotektor und fristgerecht, professionell neu gepackter Rettung", "Helm (Pflicht), festes Schuhwerk, Handschuhe für die höheren Startplätze", "Vario/GPS empfohlen — Höhenbewusstsein zählt unter einer Luftraum-Obergrenze", "Funkgerät empfohlen; vor Ort mietbar, wenn Sie leicht reisen"]}, {"h2": "Mit Ausrüstung reisen oder vor Ort mieten?", "ps": ["Die meisten Airlines nehmen Schirmpacksäcke als Sportgepäck — im Voraus anmelden. Wer leicht reisen möchte: Lokale Vermietung deckt Schirme, Gurtzeuge und Instrumente ab, auch über unsere Pilotenservices.", "Zwischen den Flugtagen gibt es außerdem Lagerung — Sie müssen die Ausrüstung nicht ins Hotel schleppen."]}], "faqTitle": "FAQ – Ausrüstung", "faqs": [{"q": "Ist ein Rettungsschirm am Babadağ Pflicht?", "a": "Ja — eine Rettung mit gültigem Packintervall gehört zum geforderten Kit, und die Nachweise können bei der Registrierung geprüft werden. Mit weniger fliegt man nicht."}, {"q": "Kann ich in Ölüdeniz Gleitschirmausrüstung mieten?", "a": "Ja — zertifizierte Schirme, Gurtzeuge und Instrumente gibt es lokal zur Miete, auch über unsere Pilotenservices. In der Hochsaison vorab reservieren."}, {"q": "Welche Instrumente brauche ich hier wirklich?", "a": "Ein Vario mit Höhenanzeige ist das praktische Minimum — das Gebiet liegt unter einer Luftraum-Obergrenze. GPS-Logging und Funk runden das empfohlene Kit ab."}], "relatedTitle": "Mehr entdecken", "related": [{"href": "/solo-paragliding", "label": "Solo-Paragliding Guide"}, {"href": "/solo-paragliding/flight-rules", "label": "Flugregeln"}, {"href": "/pilot-services/equipment-rental", "label": "Ausrüstungsverleih"}, {"href": "/pilot-services", "label": "Pilotenservices"}]}, "ru": {"sections": [{"h2": "Какое снаряжение нужно solo-пилоту на Бабадаге?", "ps": ["Действует стандартный лётнопригодный комплект — ничего экзотического, но всё проверенное: сертифицированное крыло по вашему уровню, подвеска с протектором, запасной парашют с действующей переукладкой, шлем и приборы, подходящие для загруженного места.", "Официальные лица могут попросить документы на снаряжение при регистрации — держите бумаги в порядке."]}, {"h2": "Чек-лист", "ps": ["Что взять — и что проверяют:"], "bullets": ["Сертифицированное крыло по уровню лицензии с актуальным чек-отчётом", "Подвеска с протектором спины и запаска с действующей профессиональной переукладкой", "Шлем (обязателен), крепкая обувь, перчатки для верхних стартов", "Рекомендуются варио/GPS — под потолком контролируемого пространства важно знать высоту", "Рекомендуется рация; при лёгких путешествиях доступна аренда на месте"]}, {"h2": "Везти снаряжение или арендовать на месте?", "ps": ["Большинство авиакомпаний принимают парапланерные рюкзаки как спортивный багаж — бронируйте заранее. Предпочитаете налегке — местная аренда покрывает крылья, подвески и приборы, в том числе через наши услуги для пилотов.", "Между лётными днями доступно хранение — таскать снаряжение в отель не придётся."]}], "faqTitle": "FAQ – снаряжение", "faqs": [{"q": "Обязательна ли запаска на Бабадаге?", "a": "Да — запасной парашют с действующей переукладкой входит в обязательный комплект, документы могут проверить при регистрации. Меньшим комплектом не летают."}, {"q": "Можно ли арендовать снаряжение в Олюденизе?", "a": "Да — сертифицированные крылья, подвески и приборы доступны в местной аренде, в том числе через наши услуги для пилотов. В высокий сезон бронируйте заранее."}, {"q": "Какие приборы здесь действительно нужны?", "a": "Варио с индикацией высоты — практический минимум: место находится под потолком воздушного пространства. GPS-логгер и рация дополняют рекомендуемый набор."}], "relatedTitle": "Узнайте больше", "related": [{"href": "/solo-paragliding", "label": "Гид по solo-полётам"}, {"href": "/solo-paragliding/flight-rules", "label": "Правила полётов"}, {"href": "/pilot-services/equipment-rental", "label": "Аренда снаряжения"}, {"href": "/pilot-services", "label": "Услуги для пилотов"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'solo' })
  const titles = {en:"Equipment Requirements Oludeniz",tr:"Oludeniz Ekipman Gereksinimleri",de:"Ausrüstungsanforderungen Oludeniz",ru:"Требования к снаряжению Олюдениз"}
  const subs = {en:"What equipment you need to fly solo at Babadağ.",tr:"Babadağ'da solo uçmak için ihtiyacınız olan ekipman.",de:"Welche Ausrüstung Sie brauchen, um solo am Babadağ zu fliegen.",ru:"Какое снаряжение нужно для соло полётов на Бабадаге."}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <ServiceSchema name="Solo Paragliding Equipment Requirements Oludeniz" description="Equipment requirements for solo paragliding pilots flying in Oludeniz, Turkey." path="/solo-paragliding/equipment-requirements" serviceType="Paragliding Service" />
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c0d/dOEuj7ebfM-MdyvUcunPD.jpg" />
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
