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
  const t = {en:"Advanced Paragliding Courses",tr:"İleri Düzey Paraşüt Kursları",de:"Fortgeschrittene Paragliding-Kurse",ru:"Продвинутые курсы парапланеризма", zh: "滑翔伞进阶课程"}
  const d = {en:"Take your flying to the next level with expert coaching.",tr:"Uzman koçlukla uçuşunuzu bir sonraki seviyeye taşıyın.",de:"Heben Sie Ihr Fliegen mit Expertencoaching auf die nächste Stufe.",ru:"Поднимите свои полёты на новый уровень с экспертным коучингом.", zh: "在专家指导下，让您的飞行更上一层楼。"}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/training/advanced-courses'),
    openGraph: { url: localeUrl(locale, '/training/advanced-courses'), description: (d as any)[locale] || d.en, images: ['https://www.atmosparagliding.com/training/opengraph-image'] },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "Who Are Advanced Courses For?", "ps": ["Our advanced courses are for pilots holding P2/CP or equivalent who want to develop XC skills, improve thermalling technique, or prepare for SIV training. Ölüdeniz is one of the best places in the world to advance your skills."]}, {"h2": "What Course Options Are Available?", "ps": ["XC coaching (route reading, thermal centering, decision making), mountain flying clinics (ridge soaring, valley flying, lee-side awareness), and competition preparation for the Ölüdeniz Air Games."]}, {"h2": "Who Delivers the Coaching?", "ps": ["All advanced coaching is led by our most experienced pilots, many of whom are competition pilots with national and international results. Contact us to discuss a tailored programme based on your current skill level and goals."]}], "faqTitle": "FAQ – Advanced Paragliding Courses", "faqs": [{"q": "What licence level do I need for advanced courses?", "a": "P2/CP or equivalent as a minimum."}, {"q": "Can I train for competitions?", "a": "Yes, we offer competition preparation coaching, including for the Ölüdeniz Air Games."}, {"q": "Is coaching tailored to me?", "a": "Yes, programmes are tailored to your current skill level and goals — contact us to discuss."}], "relatedTitle": "More Training Options", "related": [{"href": "/training/beginner-courses", "label": "Beginner Courses"}, {"href": "/training/advanced-courses", "label": "Advanced Courses"}, {"href": "/training/siv-clinic", "label": "SIV Clinic"}, {"href": "/training/instructor-info", "label": "Instructor Info"}]}, "tr": {"sections": [{"h2": "İleri Düzey Kurslar Kimler İçin?", "ps": ["İleri düzey kurslarımız, XC becerileri geliştirmek, termik alma tekniğini iyileştirmek veya SIV eğitimine hazırlanmak isteyen P2/CP veya eşdeğer lisansa sahip pilotlar içindir. Ölüdeniz, becerilerinizi ilerletmek için dünyanın en iyi yerlerinden biridir."]}, {"h2": "Hangi Kurs Seçenekleri Mevcut?", "ps": ["XC koçluğu (rota okuma, termik merkezleme, karar verme), dağ uçuş klinikleri (sırt süzülmesi, vadi uçuşu, rüzgar altı farkındalığı) ve Ölüdeniz Air Games için yarışma hazırlığı."]}, {"h2": "Koçluğu Kimler Veriyor?", "ps": ["Tüm ileri düzey koçluk, çoğu ulusal ve uluslararası sonuçlara sahip yarışmacı pilot olan en deneyimli pilotlarımız tarafından yürütülür. Mevcut beceri seviyenize ve hedeflerinize göre özel bir program görüşmek için bize ulaşın."]}], "faqTitle": "SSS – İleri Düzey Paraşüt Kursları", "faqs": [{"q": "İleri düzey kurslar için hangi lisans seviyesi gerekli?", "a": "Minimum P2/CP veya eşdeğeri."}, {"q": "Yarışmalar için antrenman yapabilir miyim?", "a": "Evet, Ölüdeniz Air Games dahil yarışma hazırlığı koçluğu sunuyoruz."}, {"q": "Koçluk bana özel mi ayarlanıyor?", "a": "Evet, programlar mevcut beceri seviyenize ve hedeflerinize göre özelleştirilir — görüşmek için bize ulaşın."}], "relatedTitle": "Diğer Eğitim Seçenekleri", "related": [{"href": "/training/beginner-courses", "label": "Başlangıç Kursları"}, {"href": "/training/advanced-courses", "label": "İleri Düzey Kurslar"}, {"href": "/training/siv-clinic", "label": "SIV Kliniği"}, {"href": "/training/instructor-info", "label": "Eğitmen Bilgileri"}]}, "de": {"sections": [{"h2": "Für wen sind Fortgeschrittenenkurse geeignet?", "ps": ["Unsere Fortgeschrittenenkurse richten sich an Piloten mit P2/CP oder gleichwertiger Lizenz, die XC-Fähigkeiten entwickeln, ihre Thermiktechnik verbessern oder sich auf SIV-Training vorbereiten möchten. Ölüdeniz ist einer der besten Orte der Welt, um Ihre Fähigkeiten weiterzuentwickeln."]}, {"h2": "Welche Kursoptionen gibt es?", "ps": ["XC-Coaching (Routenlesen, Thermikzentrierung, Entscheidungsfindung), Bergflugkliniken (Hangsoaring, Talfliegen, Lee-Bewusstsein) und Wettkampfvorbereitung für die Ölüdeniz Air Games."]}, {"h2": "Wer leitet das Coaching?", "ps": ["Alle Fortgeschrittenen-Coachings werden von unseren erfahrensten Piloten geleitet, von denen viele Wettkampfpiloten mit nationalen und internationalen Ergebnissen sind. Kontaktieren Sie uns, um ein maßgeschneidertes Programm basierend auf Ihrem aktuellen Können und Ihren Zielen zu besprechen."]}], "faqTitle": "FAQ – Fortgeschrittene Paragliding-Kurse", "faqs": [{"q": "Welches Lizenzniveau brauche ich für Fortgeschrittenenkurse?", "a": "Mindestens P2/CP oder gleichwertig."}, {"q": "Kann ich für Wettkämpfe trainieren?", "a": "Ja, wir bieten Wettkampfvorbereitungs-Coaching an, auch für die Ölüdeniz Air Games."}, {"q": "Ist das Coaching auf mich zugeschnitten?", "a": "Ja, die Programme werden auf Ihr aktuelles Können und Ihre Ziele zugeschnitten — kontaktieren Sie uns zur Besprechung."}], "relatedTitle": "Weitere Trainingsoptionen", "related": [{"href": "/training/beginner-courses", "label": "Anfängerkurse"}, {"href": "/training/advanced-courses", "label": "Fortgeschrittenenkurse"}, {"href": "/training/siv-clinic", "label": "SIV-Klinik"}, {"href": "/training/instructor-info", "label": "Instruktorinformationen"}]}, "ru": {"sections": [{"h2": "Для кого предназначены продвинутые курсы?", "ps": ["Наши продвинутые курсы предназначены для пилотов с уровнем P2/CP или эквивалентным, желающих развить XC-навыки, улучшить технику термичения или подготовиться к SIV-обучению. Олюдениз — одно из лучших мест в мире для развития навыков."]}, {"h2": "Какие варианты курсов доступны?", "ps": ["XC-коучинг (чтение маршрута, центрирование в термике, принятие решений), клиники горных полётов (парение вдоль склона, полёты в долине, осведомлённость о подветренной стороне) и подготовка к соревнованиям для Ölüdeniz Air Games."]}, {"h2": "Кто проводит коучинг?", "ps": ["Весь продвинутый коучинг ведут наши самые опытные пилоты, многие из которых являются соревнующимися пилотами с национальными и международными результатами. Свяжитесь с нами, чтобы обсудить программу, адаптированную под ваш текущий уровень и цели."]}], "faqTitle": "FAQ – продвинутые курсы парапланеризма", "faqs": [{"q": "Какой уровень лицензии нужен для продвинутых курсов?", "a": "Минимум P2/CP или эквивалент."}, {"q": "Могу ли я тренироваться к соревнованиям?", "a": "Да, мы предлагаем коучинг по подготовке к соревнованиям, включая Ölüdeniz Air Games."}, {"q": "Адаптирован ли коучинг под меня?", "a": "Да, программы адаптируются под ваш текущий уровень навыков и цели — свяжитесь с нами для обсуждения."}], "relatedTitle": "Другие варианты обучения", "related": [{"href": "/training/beginner-courses", "label": "Курсы для начинающих"}, {"href": "/training/advanced-courses", "label": "Продвинутые курсы"}, {"href": "/training/siv-clinic", "label": "SIV клиника"}, {"href": "/training/instructor-info", "label": "Информация об инструкторах"}]}, "zh": {"sections": [{"h2": "进阶课程面向哪些人？", "ps": ["我们的进阶课程面向持有 P2/CP 或同等资质、希望提升越野技能、改进热气流盘旋技术或为 SIV 训练做准备的飞行员。厄卢代尼兹是世界上提升飞行技能的最佳地点之一。"]}, {"h2": "有哪些课程选项？", "ps": ["越野指导（航线判读、热气流定心、决策）、山地飞行课程（山脊滑翔、山谷飞行、背风面意识），以及厄卢代尼兹航空节的比赛备赛。"]}, {"h2": "由谁提供指导？", "ps": ["所有进阶指导均由我们最有经验的飞行员带领，其中许多人是在国家级和国际级比赛中取得过成绩的比赛飞行员。请联系我们，根据您目前的技能水平和目标，讨论量身定制的课程方案。"]}], "faqTitle": "常见问题 – 滑翔伞进阶课程", "faqs": [{"q": "参加进阶课程需要什么执照等级？", "a": "至少需要 P2/CP 或同等资质。"}, {"q": "我可以为比赛进行训练吗？", "a": "可以，我们提供比赛备赛指导，包括厄卢代尼兹航空节。"}, {"q": "指导是为我量身定制的吗？", "a": "是的，课程方案会根据您目前的技能水平和目标量身定制——请联系我们详谈。"}], "relatedTitle": "更多培训选项", "related": [{"href": "/training/beginner-courses", "label": "初级课程"}, {"href": "/training/advanced-courses", "label": "进阶课程"}, {"href": "/training/siv-clinic", "label": "SIV 课程"}, {"href": "/training/instructor-info", "label": "教练信息"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'training' })
  const titles = {en:"Advanced Paragliding Courses",tr:"İleri Düzey Paraşüt Kursları",de:"Fortgeschrittene Paragliding-Kurse",ru:"Продвинутые курсы парапланеризма", zh: "滑翔伞进阶课程"}
  const subs = {en:"Take your flying to the next level with expert coaching.",tr:"Uzman koçlukla uçuşunuzu bir sonraki seviyeye taşıyın.",de:"Heben Sie Ihr Fliegen mit Expertencoaching auf die nächste Stufe.",ru:"Поднимите свои полёты на новый уровень с экспертным коучингом.", zh: "在专家指导下，让您的飞行更上一层楼。"}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <ServiceSchema name="Advanced Paragliding Course Oludeniz" description="Advanced paragliding training courses in Oludeniz for licensed pilots." path="/training/advanced-courses" serviceType="Paragliding Training Course" />
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c0c/Dn0br3flHariTrqYqhISR.jpg" />
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
