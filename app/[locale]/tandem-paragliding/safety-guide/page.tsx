import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t: Record<string,string> = {en:"Paragliding Safety Guide Oludeniz",tr:"Paraşüt Güvenlik Rehberi",de:"Paragliding-Sicherheitsleitfaden",ru:"Руководство по безопасности"}
  return { title: `${t[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'tandem' })
  const titles: Record<string,string> = {en:"Paragliding Safety Guide Oludeniz",tr:"Paraşüt Güvenlik Rehberi",de:"Paragliding-Sicherheitsleitfaden",ru:"Руководство по безопасности"}
  const subs: Record<string,string> = {en:"25+ years. Zero serious incidents. Here is how we keep you safe.",tr:"25+ yıl. Sıfır ciddi kaza. İşte sizi nasıl güvende tuttuğumuz.",de:"25+ Jahre. Null ernste Zwischenfälle. So halten wir Sie sicher.",ru:"25+ лет. Ноль серьёзных инцидентов. Как мы обеспечиваем вашу безопасность."}
  const bodies: Record<string,string[]> = {
    en:["All our pilots are certified by the Turkish Civil Aviation Authority (SHGM) and hold international BHPA or DHV ratings. Each pilot completes annual proficiency checks and first aid recertification.","Our equipment is maintained to the highest standards. Every wing is inspected before each flight day. Harnesses are checked for wear and replaced on a strict rotation. Helmets are individually fitted to each passenger.","We monitor weather conditions continuously from 06:00 every morning. We use three independent weather stations — at the beach, at 1200m, and at 1960m summit. If conditions are not perfect, we do not fly. Your refund or rescheduling is guaranteed.","Weight and health: maximum passenger weight is 110kg. We ask that you do not fly if pregnant, if you have a serious heart condition, or have had recent surgery. Children under 18 require written parental consent."],
    tr:["Tüm pilotlarımız Sivil Havacılık Genel Müdürlüğü (SHGM) tarafından sertifikalandırılmış ve uluslararası BHPA veya DHV derecelerine sahiptir. Her pilot yıllık yeterlilik kontrolü ve ilk yardım yenileme eğitiminden geçer.","Ekipmanlarımız en yüksek standartlarda bakımı yapılır. Her kanat, her uçuş günü öncesinde incelenir. Paraşütler katı bir rotasyona göre değiştirilir. Kasklar her yolcuya bireysel olarak ayarlanır.","Hava koşullarını her sabah 06:00'dan itibaren sürekli takip ediyoruz. Koşullar mükemmel değilse uçmuyoruz. Para iadesi veya yeniden planlama garantiludur.","Azami yolcu ağırlığı 110 kg'dır. Hamile, ciddi kalp rahatsızlığı olan veya yakın zamanda ameliyat geçirmiş yolcuların uçmamasını tavsiye ederiz."],
    de:["Alle unsere Piloten sind von der türkischen Zivilluftfahrtbehörde (SHGM) zertifiziert und haben internationale BHPA- oder DHV-Bewertungen. Jeder Pilot absolviert jährliche Eignungsprüfungen.","Unsere Ausrüstung wird nach höchsten Standards gewartet. Jeder Schirm wird vor jedem Flugtag inspiziert. Wenn die Bedingungen nicht perfekt sind, fliegen wir nicht. Rückerstattung oder Umplanung ist garantiert.","Maximales Passagiergewicht: 110 kg. Wir bitten, nicht zu fliegen, wenn Sie schwanger sind, eine ernste Herzerkrankung haben oder sich kürzlich einer Operation unterzogen haben."],
    ru:["Все наши пилоты сертифицированы Турецким управлением гражданской авиации (SHGM) и имеют международные рейтинги BHPA или DHV. Каждый пилот ежегодно проходит проверку квалификации.","Наше оборудование обслуживается по высшим стандартам. Если условия не идеальны, мы не летим. Возврат средств или перенос гарантированы.","Максимальный вес пассажира: 110 кг. Просим не летать при беременности, серьёзных сердечных заболеваниях или недавних операциях."],
  }
  const title = titles[locale]||titles.en
  const sub = subs[locale]||subs.en
  const body = bodies[locale]||bodies.en
  return (
    <>
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c09/2htlcwkJ6pcLBY7gPtf7z.jpg" />
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3"><BreadcrumbNav items={[{ label: title }]} /></div>
      </div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl space-y-4">
          {body.map((p,i) => <p key={i} className="text-slate-600 leading-relaxed">{p}</p>)}
        </div>
      </section>
      <BookingCTA />
    </>
  )
}
