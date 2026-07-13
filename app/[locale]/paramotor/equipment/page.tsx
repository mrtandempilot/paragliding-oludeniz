import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Paramotor Equipment Guide",tr:"Paramotor Ekipman Rehberi",de:"Paramotor Equipment Guide",ru:"Paramotor Equipment Guide"}
  const d = {en:"Powered paragliding information for Oludeniz.",tr:"Oludeniz için motorlu paraşüt bilgileri.",de:"Motorisiertes Paragliding-Informationen für Oludeniz.",ru:"Информация о моторизованном парапланеризме для Олюдениз."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/paramotor/equipment'),
    openGraph: { url: localeUrl(locale, '/paramotor/equipment'), description: (d as any)[locale] || d.en, images: ['https://www.atmosparagliding.com/opengraph-image'] },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "What Equipment Does Paramotoring Require?", "ps": ["A paramotor setup has two parts: the motor unit — frame, engine, propeller and harness — and a paramotor-specific wing, which is built with reinforcement to handle the extra stress of powered flight compared to a free-flying paraglider."]}, {"h2": "Can You Hire Equipment Locally?", "ps": ["Yes — we can advise on equipment selection based on your experience and have hire equipment available for visiting pilots who don't want to travel with their own gear."]}], "faqTitle": "FAQ – Paramotor Equipment", "faqs": [{"q": "Is a paramotor wing the same as a regular paraglider wing?", "a": "No — paramotor wings are built specifically to handle the extra stresses of powered flight and generally fly differently than free-flying wings."}, {"q": "Do I need to bring my own equipment?", "a": "Not necessarily — hire equipment is available. Contact us to discuss what's available for your dates and experience level."}], "relatedTitle": "More on Paramotoring", "related": [{"href": "/paramotor", "label": "Paramotor Overview"}, {"href": "/paramotor/training", "label": "Training Courses"}, {"href": "/contact", "label": "Contact Us"}]}, "tr": {"sections": [{"h2": "Paramotor İçin Hangi Ekipman Gerekli?", "ps": ["Bir paramotor kurulumu iki parçadan oluşur: motor ünitesi — şase, motor, pervane ve koşum takımı — ve paramotora özel kanat; bu kanat, serbest uçan bir yamaç paraşütüne kıyasla motorlu uçuşun ek stresini karşılayacak şekilde güçlendirilmiş olarak üretilir."]}, {"h2": "Yerel Olarak Ekipman Kiralayabilir Misiniz?", "ps": ["Evet — tecrübenize göre ekipman seçimi konusunda tavsiyede bulunabilir ve kendi ekipmanıyla seyahat etmek istemeyen ziyaretçi pilotlar için kiralık ekipman sağlayabiliriz."]}], "faqTitle": "SSS – Paramotor Ekipmanı", "faqs": [{"q": "Paramotor kanadı normal bir yamaç paraşütü kanadıyla aynı mı?", "a": "Hayır — paramotor kanatları özellikle motorlu uçuşun ek streslerini karşılayacak şekilde üretilir ve genellikle serbest uçan kanatlardan farklı uçar."}, {"q": "Kendi ekipmanımı getirmem gerekir mi?", "a": "Şart değil — kiralık ekipman mevcuttur. Tarihleriniz ve tecrübe seviyeniz için nelerin uygun olduğunu görüşmek üzere bize ulaşın."}], "relatedTitle": "Paramotor Hakkında Daha Fazlası", "related": [{"href": "/paramotor", "label": "Paramotor Genel Bakış"}, {"href": "/paramotor/training", "label": "Eğitim Kursları"}, {"href": "/contact", "label": "Bize Ulaşın"}]}, "de": {"sections": [{"h2": "Welche Ausrüstung braucht man für Paramotoring?", "ps": ["Ein Paramotor-Setup besteht aus zwei Teilen: der Motoreinheit — Rahmen, Motor, Propeller und Gurtzeug — und einem paramotor-spezifischen Schirm, der verstärkt gebaut ist, um die zusätzliche Belastung des motorisierten Flugs im Vergleich zu einem freifliegenden Gleitschirm zu bewältigen."]}, {"h2": "Kann man Ausrüstung vor Ort mieten?", "ps": ["Ja — wir beraten Sie bei der Ausrüstungswahl basierend auf Ihrer Erfahrung und haben Mietausrüstung für besuchende Piloten, die nicht mit eigenem Equipment anreisen möchten."]}], "faqTitle": "FAQ – Paramotor-Ausrüstung", "faqs": [{"q": "Ist ein Paramotor-Schirm dasselbe wie ein normaler Gleitschirm?", "a": "Nein — Paramotor-Schirme sind speziell gebaut, um die zusätzliche Belastung des motorisierten Flugs zu bewältigen, und fliegen sich meist anders als freifliegende Schirme."}, {"q": "Muss ich meine eigene Ausrüstung mitbringen?", "a": "Nicht unbedingt — Mietausrüstung ist verfügbar. Kontaktieren Sie uns, um zu besprechen, was für Ihre Reisedaten und Ihr Erfahrungslevel verfügbar ist."}], "relatedTitle": "Mehr zum Paramotoring", "related": [{"href": "/paramotor", "label": "Paramotor Übersicht"}, {"href": "/paramotor/training", "label": "Trainingskurse"}, {"href": "/contact", "label": "Kontakt"}]}, "ru": {"sections": [{"h2": "Какое снаряжение нужно для паратрайка?", "ps": ["Установка паратрайка состоит из двух частей: мотоустановки — рама, двигатель, винт и подвесная система — и крыла, специально разработанного для паратрайка, усиленного для дополнительной нагрузки моторного полёта по сравнению со свободным парапланом."]}, {"h2": "Можно ли арендовать снаряжение на месте?", "ps": ["Да — мы можем посоветовать снаряжение исходя из вашего опыта, и у нас есть снаряжение в аренду для приезжих пилотов, которые не хотят везти своё."]}], "faqTitle": "FAQ – снаряжение для паратрайка", "faqs": [{"q": "Крыло паратрайка такое же, как обычное крыло параплана?", "a": "Нет — крылья для паратрайка изготавливаются специально для дополнительных нагрузок моторного полёта и обычно летают иначе, чем крылья для свободного полёта."}, {"q": "Нужно ли привозить своё снаряжение?", "a": "Не обязательно — доступна аренда снаряжения. Свяжитесь с нами, чтобы обсудить, что доступно на ваши даты и уровень опыта."}], "relatedTitle": "Больше о паратрайке", "related": [{"href": "/paramotor", "label": "Обзор паратрайка"}, {"href": "/paramotor/training", "label": "Учебные курсы"}, {"href": "/contact", "label": "Связаться с нами"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'paramotor' })
  const titles = {en:"Paramotor Equipment Guide",tr:"Paramotor Ekipman Rehberi",de:"Paramotor Equipment Guide",ru:"Paramotor Equipment Guide"}
  const subs = {en:"Powered paragliding information for Oludeniz.",tr:"Oludeniz için motorlu paraşüt bilgileri.",de:"Motorisiertes Paragliding-Informationen für Oludeniz.",ru:"Информация о моторизованном парапланеризме для Олюдениз."}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"Article\", \"headline\": \"Paramotor Equipment Guide Oludeniz\", \"description\": \"Guide to paramotor equipment for flying in Oludeniz, Turkey.\", \"url\": \"https://www.atmosparagliding.com/paramotor/equipment\", \"author\": {\"@type\": \"Person\", \"name\": \"Ceyhun\", \"url\": \"https://www.atmosparagliding.com/en/about-us\"}, \"publisher\": {\"@type\": \"Organization\", \"name\": \"Atmos Paragliding\", \"url\": \"https://www.atmosparagliding.com\"}}" }} />
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
