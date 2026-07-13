import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Acro Pilots Oludeniz",tr:"Oludeniz Akro Pilotları",de:"Acro Pilots Oludeniz",ru:"Acro Pilots Oludeniz"}
  const d = {en:"Advanced paragliding for experienced pilots.",tr:"Deneyimli pilotlar için ileri düzey paraşüt.",de:"Fortgeschrittenes Paragliding für erfahrene Piloten.",ru:"Продвинутый парапланеризм для опытных пилотов."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/acro-flights/pilots'),
    openGraph: { url: localeUrl(locale, '/acro-flights/pilots'), description: (d as any)[locale] || d.en, images: ['https://www.atmosparagliding.com/opengraph-image'] },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "Who Flies Acro at Babadağ?", "ps": ["Ölüdeniz has produced and attracted some of the sport's best: world-cup acro athletes train here, international stars migrate in for the events, and the local tandem corps includes pilots with thousands of dynamic flights over the bay.", "The mountain's role in acro history is real — the combination of altitude, sea and infrastructure made it one of the sport's original proving grounds, and today's SIV and acro courses continue that lineage."]}, {"h2": "What Sets an Acro Pilot Apart", "ps": ["Beyond a standard tandem licence:"], "bullets": ["Thousands of manoeuvre repetitions from spirals to advanced tricks", "SIV mastery — recovering a misbehaving wing is their daily bread", "Water-training experience and rescue-scenario drills", "For tandem acro: senior SHGM certification plus specific dynamic-flight experience"]}, {"h2": "Flying With Them", "ps": ["Book a tandem acro flight and the pilot assigned is one of our most senior — dynamic flying is a privilege we reserve for the pilots with the deepest margins.", "Solo pilots looking to enter acro should start with an SIV course over the bay; ask us about training options and the local acro community."]}], "faqTitle": "FAQ – Acro Pilots", "faqs": [{"q": "Are your acro tandem pilots specially qualified?", "a": "Yes — tandem acro is flown only by senior SHGM-certified pilots with extensive dynamic-flight experience. It is a smaller, hand-picked group within the team."}, {"q": "Do professional acro athletes really train at Ölüdeniz?", "a": "Yes — the bay is one of the sport's classic training arenas, and international acro events regularly bring the world's best to Babadağ. On many days you can watch them from the beach."}, {"q": "How do I start learning acro as a solo pilot?", "a": "The path runs through SIV: controlled manoeuvre training over water with radio guidance and boat cover. Ask us about SIV clinics and the local progression from there."}], "relatedTitle": "Explore More", "related": [{"href": "/acro-flights", "label": "Acro Flights"}, {"href": "/acro-flights/safety", "label": "Acro Safety"}, {"href": "/training/siv-clinic", "label": "SIV Clinics"}, {"href": "/book-now", "label": "Book Your Flight"}]}, "tr": {"sections": [{"h2": "Babadağ'da Akroyu Kim Uçar?", "ps": ["Ölüdeniz, sporun en iyilerinden bazılarını yetiştirdi ve çekti: dünya kupası akro sporcuları burada antrenman yapar, uluslararası yıldızlar etkinlikler için gelir ve yerel tandem kadrosu, körfez üzerinde binlerce dinamik uçuşu olan pilotları içerir.", "Dağın akro tarihindeki rolü gerçektir — irtifa, deniz ve altyapı kombinasyonu burayı sporun ilk sınav alanlarından biri yaptı; bugünün SIV ve akro kursları bu mirası sürdürüyor."]}, {"h2": "Bir Akro Pilotunu Farklı Kılan Ne?", "ps": ["Standart tandem lisansının ötesinde:"], "bullets": ["Spiralden ileri düzey hareketlere binlerce manevra tekrarı", "SIV ustalığı — huysuzlanan kanadı toparlamak onların günlük ekmeği", "Su üstü antrenman deneyimi ve kurtarma senaryosu tatbikatları", "Tandem akro için: kıdemli SHGM sertifikası artı özgül dinamik uçuş deneyimi"]}, {"h2": "Onlarla Uçmak", "ps": ["Tandem akro uçuşu ayırttığınızda atanan pilot en kıdemlilerimizden biridir — dinamik uçuş, en derin paylara sahip pilotlara ayırdığımız bir ayrıcalıktır.", "Akroya girmek isteyen solo pilotlar körfez üzerinde bir SIV kursuyla başlamalı; eğitim seçenekleri ve yerel akro topluluğu için bize sorun."]}], "faqTitle": "SSS – Akro Pilotları", "faqs": [{"q": "Akro tandem pilotlarınız özel olarak mı nitelikli?", "a": "Evet — tandem akro yalnızca kapsamlı dinamik uçuş deneyimine sahip kıdemli SHGM lisanslı pilotlarca uçulur. Ekip içinde elle seçilmiş daha küçük bir gruptur."}, {"q": "Profesyonel akro sporcuları gerçekten Ölüdeniz'de mi çalışıyor?", "a": "Evet — körfez sporun klasik antrenman arenalarından biridir ve uluslararası akro etkinlikleri dünyanın en iyilerini düzenli olarak Babadağ'a getirir. Birçok gün onları plajdan izleyebilirsiniz."}, {"q": "Solo pilot olarak akro öğrenmeye nasıl başlarım?", "a": "Yol SIV'den geçer: telsiz rehberliği ve tekne desteğiyle su üzerinde kontrollü manevra eğitimi. SIV klinikleri ve oradan yerel ilerleme için bize sorun."}], "relatedTitle": "Daha Fazlasını Keşfedin", "related": [{"href": "/acro-flights", "label": "Akro Uçuşları"}, {"href": "/acro-flights/safety", "label": "Akro Güvenliği"}, {"href": "/training/siv-clinic", "label": "SIV Klinikleri"}, {"href": "/book-now", "label": "Uçuşunuzu Ayırtın"}]}, "de": {"sections": [{"h2": "Wer fliegt Acro am Babadağ?", "ps": ["Ölüdeniz hat einige der Besten des Sports hervorgebracht und angezogen: Weltcup-Acro-Athleten trainieren hier, internationale Stars reisen zu den Events an, und das lokale Tandemkorps umfasst Piloten mit tausenden dynamischen Flügen über der Bucht.", "Die Rolle des Berges in der Acro-Geschichte ist real — die Kombination aus Höhe, Meer und Infrastruktur machte ihn zu einem der ursprünglichen Bewährungsfelder des Sports, und die heutigen SIV- und Acro-Kurse führen diese Linie fort."]}, {"h2": "Was einen Acro-Piloten auszeichnet", "ps": ["Über die Standard-Tandemlizenz hinaus:"], "bullets": ["Tausende Manöverwiederholungen von Spiralen bis zu fortgeschrittenen Tricks", "SIV-Meisterschaft — einen bockenden Schirm zu erholen ist ihr täglich Brot", "Wassertraining und Rettungsszenario-Übungen", "Für Tandem-Acro: Senior-SHGM-Zertifizierung plus spezifische Dynamikflug-Erfahrung"]}, {"h2": "Mit ihnen fliegen", "ps": ["Buchen Sie einen Tandem-Acro-Flug, und der zugeteilte Pilot gehört zu unseren erfahrensten — dynamisches Fliegen ist ein Privileg, das wir den Piloten mit den größten Reserven vorbehalten.", "Solopiloten mit Acro-Ambitionen starten am besten mit einem SIV-Kurs über der Bucht; fragen Sie uns nach Trainingsoptionen und der lokalen Acro-Community."]}], "faqTitle": "FAQ – Acro-Piloten", "faqs": [{"q": "Sind Ihre Acro-Tandempiloten besonders qualifiziert?", "a": "Ja — Tandem-Acro fliegen nur erfahrene SHGM-lizenzierte Piloten mit umfangreicher Dynamikflug-Erfahrung. Es ist eine kleinere, handverlesene Gruppe im Team."}, {"q": "Trainieren wirklich Profi-Acro-Athleten in Ölüdeniz?", "a": "Ja — die Bucht ist eine der klassischen Trainingsarenen des Sports, und internationale Acro-Events bringen regelmäßig die Weltbesten an den Babadağ. An vielen Tagen kann man ihnen vom Strand aus zusehen."}, {"q": "Wie beginne ich als Solopilot mit Acro?", "a": "Der Weg führt über SIV: kontrolliertes Manövertraining über Wasser mit Funkbetreuung und Bootsabsicherung. Fragen Sie uns nach SIV-Kursen und der lokalen Progression."}], "relatedTitle": "Mehr entdecken", "related": [{"href": "/acro-flights", "label": "Acro-Flüge"}, {"href": "/acro-flights/safety", "label": "Acro-Sicherheit"}, {"href": "/training/siv-clinic", "label": "SIV-Kurse"}, {"href": "/book-now", "label": "Flug buchen"}]}, "ru": {"sections": [{"h2": "Кто летает акро на Бабадаге?", "ps": ["Олюдениз вырастил и притянул одних из лучших в спорте: атлеты кубка мира по акро тренируются здесь, международные звёзды съезжаются на события, а местный тандемный состав включает пилотов с тысячами динамичных полётов над заливом.", "Роль горы в истории акро реальна — сочетание высоты, моря и инфраструктуры сделало её одним из первых полигонов спорта, и сегодняшние SIV- и акро-курсы продолжают эту линию."]}, {"h2": "Что отличает акро-пилота", "ps": ["Сверх стандартной тандемной лицензии:"], "bullets": ["Тысячи повторений манёвров — от спиралей до продвинутых трюков", "Мастерство SIV — вернуть взбунтовавшееся крыло к полёту для них обыденность", "Опыт тренировок над водой и отработка спасательных сценариев", "Для тандем-акро: старшая сертификация SHGM плюс особый опыт динамичных полётов"]}, {"h2": "Полетать с ними", "ps": ["Бронируете тандем-акро — назначенный пилот будет одним из самых старших: динамичные полёты — привилегия, которую мы оставляем пилотам с самыми глубокими запасами.", "Solo-пилотам, желающим войти в акро, стоит начать с курса SIV над заливом; спросите нас о вариантах обучения и местном акро-сообществе."]}], "faqTitle": "FAQ – акро-пилоты", "faqs": [{"q": "Ваши акро-тандем-пилоты имеют особую квалификацию?", "a": "Да — тандем-акро летают только старшие пилоты SHGM с обширным опытом динамичных полётов. Это небольшая, отобранная вручную группа внутри команды."}, {"q": "Профессиональные акро-атлеты правда тренируются в Олюденизе?", "a": "Да — залив входит в классические тренировочные арены спорта, и международные акро-события регулярно привозят лучших в мире на Бабадаг. Во многие дни за ними можно наблюдать с пляжа."}, {"q": "Как solo-пилоту начать учиться акро?", "a": "Путь лежит через SIV: контролируемая отработка манёвров над водой с радио-сопровождением и лодкой. Спросите нас о SIV-клиниках и дальнейшей местной прогрессии."}], "relatedTitle": "Узнайте больше", "related": [{"href": "/acro-flights", "label": "Акро-полёты"}, {"href": "/acro-flights/safety", "label": "Безопасность акро"}, {"href": "/training/siv-clinic", "label": "SIV-клиники"}, {"href": "/book-now", "label": "Забронировать полёт"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'acro' })
  const titles = {en:"Acro Pilots Oludeniz",tr:"Oludeniz Akro Pilotları",de:"Acro Pilots Oludeniz",ru:"Acro Pilots Oludeniz"}
  const subs = {en:"Advanced paragliding for experienced pilots.",tr:"Deneyimli pilotlar için ileri düzey paraşüt.",de:"Fortgeschrittenes Paragliding für erfahrene Piloten.",ru:"Продвинутый парапланеризм для опытных пилотов."}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"Article\", \"headline\": \"Acro Paragliding Pilots Oludeniz\", \"description\": \"Meet the certified acrobatic paragliding pilots based in Oludeniz.\", \"url\": \"https://www.atmosparagliding.com/acro-flights/pilots\", \"author\": {\"@type\": \"Person\", \"name\": \"Ceyhun\", \"url\": \"https://www.atmosparagliding.com/en/about-us\"}, \"publisher\": {\"@type\": \"Organization\", \"name\": \"Atmos Paragliding\", \"url\": \"https://www.atmosparagliding.com\"}}" }} />
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c0b/Ma1uD1AUlcpoxL-48cgg4.jpg" />
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
