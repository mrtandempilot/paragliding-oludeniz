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
  const t = {en:"Cross Country Paragliding Oludeniz",tr:"Oludeniz Kros Paraşüt",de:"Streckenflug Paragliding Oludeniz",ru:"Маршрутный парапланеризм Олюдениз"}
  const d = {en:"XC flying from Babadağ across the Fethiye region.",tr:"Babadağ'dan Fethiye bölgesi üzerinde XC uçuşu.",de:"XC-Fliegen vom Babadağ über die Fethiye-Region.",ru:"XC полёты с Бабадага над регионом Фетхие."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/cross-country-flights'),
    openGraph: { url: localeUrl(locale, '/cross-country-flights'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "Why Babadağ Is a World-Class XC Base", "ps": ["Cross-country from Babadağ combines what XC pilots dream about: a 1,960m start almost two kilometres above your landing options, reliable Mediterranean thermals, ridgelines running inland toward the Taurus, and a seven-month season.", "Whether your goal is a first 20km out-and-return or a 100km+ inland adventure, the mountain offers a route for it — with the unique comfort of a beach landing waiting back home."]}, {"h2": "What XC Flying Here Looks Like", "ps": ["The typical XC day:"], "bullets": ["Launch mid-morning from 1700m+ as the thermal cycle organises", "Climb above the summit on house thermals, then commit inland along the ridgelines", "Classic lines run toward the mountains behind Ovacık and Fethiye or east along the coast", "Retrieve service brings you back — or you fly the return leg to the beach for the full glory lap"]}, {"h2": "Who Should Fly XC at Babadağ", "ps": ["Confident thermalling skills and mountain experience are the entry ticket. Local knowledge of routes, airspace and valley winds shortens the learning curve dramatically — our pilot services cover briefings, guided XC days, radio hire and retrieval so visiting pilots can focus on flying."]}], "faqTitle": "FAQ – XC from Babadağ", "faqs": [{"q": "How far can you fly XC from Babadağ?", "a": "Day-flight potential regularly reaches tens of kilometres, and long inland lines beyond 100km have been flown in peak conditions. The realistic number depends on the day's cloudbase, wind and your line."}, {"q": "Is there a retrieval service for XC pilots?", "a": "Yes — our team offers retrieval as part of pilot services, alongside route briefings and radio hire. Landing out is part of XC; being collected quickly is part of the service."}, {"q": "When is XC season at its best?", "a": "May–June and September often give the best XC balance of strong-but-organised thermals and friendly winds; July–August delivers the highest cloudbases and the boldest lines."}], "relatedTitle": "Explore More", "related": [{"href": "/cross-country-flights/routes", "label": "XC Routes"}, {"href": "/cross-country-flights/seasons", "label": "XC Seasons"}, {"href": "/pilot-services/retrieval", "label": "Retrieval Service"}, {"href": "/thermals-guide", "label": "Thermals Guide"}]}, "tr": {"sections": [{"h2": "Babadağ Neden Dünya Klasmanı Bir XC Üssü?", "ps": ["Babadağ'dan cross-country, XC pilotlarının hayalini kurduğu şeyleri birleştirir: iniş seçeneklerinizin neredeyse iki kilometre üzerinde 1.960m'lik bir başlangıç, güvenilir Akdeniz termikleri, iç kesimlere Toroslara doğru uzanan sırt hatları ve yedi aylık sezon.", "Hedefiniz ilk 20 km gidiş-dönüş de olsa 100 km+ iç bölge macerası da olsa dağ bunun için bir rota sunar — üstelik evde sizi bekleyen plaj inişi konforuyla."]}, {"h2": "Burada XC Uçuşu Nasıl Görünür?", "ps": ["Tipik XC günü:"], "bullets": ["Termik döngüsü organize olurken sabah ortası 1700m+ pistten kalkın", "Ev termiklerinde zirvenin üzerine tırmanın, sonra sırt hatları boyunca iç kesime yönelin", "Klasik hatlar Ovacık ve Fethiye arkasındaki dağlara ya da doğuya, kıyı boyunca uzanır", "Retrieval servisi sizi geri getirir — ya da tam şeref turu için dönüş bacağını plaja uçarsınız"]}, {"h2": "Babadağ'da Kimler XC Uçmalı?", "ps": ["Giriş bileti; özgüvenli termik becerisi ve dağ deneyimidir. Rotalar, hava sahası ve vadi rüzgarlarına dair yerel bilgi öğrenme eğrisini ciddi kısaltır — pilot hizmetlerimiz brifingleri, rehberli XC günlerini, telsiz kiralamayı ve retrieval'ı kapsar; misafir pilotlar uçuşa odaklanır."]}], "faqTitle": "SSS – Babadağ'dan XC", "faqs": [{"q": "Babadağ'dan XC ile ne kadar uzağa uçulur?", "a": "Günlük uçuş potansiyeli düzenli olarak onlarca kilometreye ulaşır; zirve koşullarında 100 km'yi aşan iç hat uçuşları yapılmıştır. Gerçekçi rakam günün bulut tabanına, rüzgara ve hattınıza bağlıdır."}, {"q": "XC pilotları için retrieval servisi var mı?", "a": "Evet — ekibimiz rota brifingleri ve telsiz kiralamayla birlikte pilot hizmetlerinin parçası olarak retrieval sunar. Dışarı inmek XC'nin parçası; hızla alınmak servisin parçasıdır."}, {"q": "XC sezonu en iyi ne zaman?", "a": "Mayıs–Haziran ve Eylül; güçlü ama düzenli termikler ile dost rüzgarların en iyi XC dengesini verir. Temmuz–Ağustos en yüksek bulut tabanlarını ve en cesur hatları getirir."}], "relatedTitle": "Daha Fazlasını Keşfedin", "related": [{"href": "/cross-country-flights/routes", "label": "XC Rotaları"}, {"href": "/cross-country-flights/seasons", "label": "XC Sezonları"}, {"href": "/pilot-services/retrieval", "label": "Retrieval Servisi"}, {"href": "/thermals-guide", "label": "Termik Rehberi"}]}, "de": {"sections": [{"h2": "Warum der Babadağ eine Weltklasse-XC-Basis ist", "ps": ["Streckenfliegen vom Babadağ vereint, wovon XC-Piloten träumen: ein 1.960m-Start fast zwei Kilometer über den Landeoptionen, zuverlässige Mittelmeerthermik, Kammlinien landeinwärts Richtung Taurus und eine siebenmonatige Saison.", "Ob das Ziel ein erstes 20-km-Jojo oder ein 100km+-Abenteuer im Landesinneren ist — der Berg hat die Route dafür, mit dem einzigartigen Komfort einer Strandlandung, die zu Hause wartet."]}, {"h2": "So sieht XC-Fliegen hier aus", "ps": ["Der typische XC-Tag:"], "bullets": ["Start am Vormittag ab 1700m+, während sich der Thermikzyklus organisiert", "Über den Hausbärten den Gipfel übersteigen, dann entlang der Kammlinien landeinwärts", "Klassische Linien laufen zu den Bergen hinter Ovacık und Fethiye oder ostwärts die Küste entlang", "Der Rückholservice bringt Sie zurück — oder Sie fliegen die Rückkehr zum Strand für die volle Ehrenrunde"]}, {"h2": "Für wen ist XC am Babadağ?", "ps": ["Sicheres Thermikfliegen und Gebirgserfahrung sind die Eintrittskarte. Lokalwissen zu Routen, Luftraum und Talwinden verkürzt die Lernkurve drastisch — unsere Pilotenservices umfassen Briefings, geführte XC-Tage, Funkverleih und Rückholung, damit Gastpiloten sich aufs Fliegen konzentrieren."]}], "faqTitle": "FAQ – XC vom Babadağ", "faqs": [{"q": "Wie weit kann man vom Babadağ XC fliegen?", "a": "Das Tagespotenzial erreicht regelmäßig Dutzende Kilometer; in Spitzenbedingungen wurden Inlandslinien jenseits der 100 km geflogen. Die realistische Zahl hängt von Basis, Wind und Ihrer Linie ab."}, {"q": "Gibt es einen Rückholservice für XC-Piloten?", "a": "Ja — unser Team bietet Rückholung als Teil der Pilotenservices, neben Routenbriefings und Funkverleih. Außenlanden gehört zum XC; schnell abgeholt zu werden gehört zum Service."}, {"q": "Wann ist die XC-Saison am besten?", "a": "Mai–Juni und September bieten oft die beste Balance aus kräftiger, aber organisierter Thermik und freundlichen Winden; Juli–August liefert die höchsten Basen und die kühnsten Linien."}], "relatedTitle": "Mehr entdecken", "related": [{"href": "/cross-country-flights/routes", "label": "XC-Routen"}, {"href": "/cross-country-flights/seasons", "label": "XC-Saisons"}, {"href": "/pilot-services/retrieval", "label": "Rückholservice"}, {"href": "/thermals-guide", "label": "Thermik-Guide"}]}, "ru": {"sections": [{"h2": "Почему Бабадаг — маршрутная база мирового класса", "ps": ["Маршрутные полёты с Бабадага сочетают всё, о чём мечтают XC-пилоты: старт 1 960 м почти в двух километрах над посадочными вариантами, надёжные средиземноморские термики, хребты, уходящие вглубь к Тавру, и семимесячный сезон.", "Будь ваша цель — первые 20 км туда-обратно или приключение вглубь материка на 100+ км, у горы есть маршрут для этого — с уникальным комфортом пляжной посадки, ждущей дома."]}, {"h2": "Как выглядит XC-полёт здесь", "ps": ["Типичный маршрутный день:"], "bullets": ["Старт в середине утра с 1700м+, пока термический цикл организуется", "Набор над вершиной в «домашних» термиках, затем уход вглубь вдоль хребтов", "Классические линии идут к горам за Оваджиком и Фетхие или на восток вдоль побережья", "Служба подбора вернёт вас — или пролетите обратный отрезок до пляжа для полного круга почёта"]}, {"h2": "Кому стоит летать XC на Бабадаге", "ps": ["Входной билет — уверенная работа в термиках и горный опыт. Местные знания маршрутов, воздушного пространства и долинных ветров резко сокращают кривую обучения — наши услуги для пилотов включают брифинги, XC-дни с гидом, аренду раций и подбор, чтобы приезжие пилоты сосредоточились на полётах."]}], "faqTitle": "FAQ – XC с Бабадага", "faqs": [{"q": "Как далеко можно улететь маршрутом с Бабадага?", "a": "Дневной потенциал регулярно достигает десятков километров, а в пиковые условия летали линии вглубь материка за 100 км. Реальная цифра зависит от кромки, ветра и вашей линии."}, {"q": "Есть ли подбор для XC-пилотов?", "a": "Да — наша команда предлагает подбор в составе услуг для пилотов, вместе с брифингами по маршрутам и арендой раций. Посадка вне зоны — часть XC; быстрый подбор — часть сервиса."}, {"q": "Когда лучший XC-сезон?", "a": "Май–июнь и сентябрь часто дают лучший баланс сильных, но организованных термиков и дружелюбных ветров; июль–август приносят самые высокие кромки и самые смелые линии."}], "relatedTitle": "Узнайте больше", "related": [{"href": "/cross-country-flights/routes", "label": "Маршруты XC"}, {"href": "/cross-country-flights/seasons", "label": "Сезоны XC"}, {"href": "/pilot-services/retrieval", "label": "Служба подбора"}, {"href": "/thermals-guide", "label": "Гид по термикам"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'crossCountry' })
  const titles = {en:"Cross Country Paragliding Oludeniz",tr:"Oludeniz Kros Paraşüt",de:"Streckenflug Paragliding Oludeniz",ru:"Маршрутный парапланеризм Олюдениз"}
  const subs = {en:"XC flying from Babadağ across the Fethiye region.",tr:"Babadağ'dan Fethiye bölgesi üzerinde XC uçuşu.",de:"XC-Fliegen vom Babadağ über die Fethiye-Region.",ru:"XC полёты с Бабадага над регионом Фетхие."}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <ServiceSchema name="Cross Country Paragliding" description="XC paragliding from Babadağ: routes, thermal maps and landing zones for licensed pilots." path="/cross-country-flights" serviceType="Cross Country Paragliding" />
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7bd4/rtDjiycQ-CNoCYjmlrN3-.jpg" />
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
