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
  const t = {en:"Tandem Pilot Conversion Course",tr:"Tandem Pilot Dönüşüm Kursu",de:"Tandempiloten-Umschulungskurs",ru:"Курс переквалификации в тандем-пилоты", zh: "双人飞行员转换课程"}
  const d = {en:"Become a certified tandem paragliding pilot.",tr:"Sertifikalı tandem paraşüt pilotu olun.",de:"Werden Sie ein zertifizierter Tandemparagliding-Pilot.",ru:"Станьте сертифицированным тандем-пилотом.", zh: "成为认证的双人滑翔伞飞行员。"}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/training/tandem-conversion'),
    openGraph: { url: localeUrl(locale, '/training/tandem-conversion'), description: (d as any)[locale] || d.en, images: ['https://www.atmosparagliding.com/training/opengraph-image'] },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "Who Is the Tandem Conversion Course For?", "ps": ["Our tandem conversion course is designed for licensed solo pilots (minimum P4/Advance rating) who wish to carry passengers commercially. The course leads to SHGM tandem certification, valid for commercial operations in Turkey."]}, {"h2": "What Does the Course Cover?", "ps": ["Tandem equipment handling, pre-flight passenger briefings, tandem launch and landing techniques, emergency procedures with a passenger, passenger management in flight, and regulatory requirements."]}, {"h2": "How Long Does It Take and What's Required?", "ps": ["Course duration is 10 days minimum. You'll need to complete a minimum number of tandem flights and pass both written and practical examinations. This course is only available to holders of valid paragliding licences."]}], "faqTitle": "FAQ – Tandem Pilot Conversion", "faqs": [{"q": "What licence level do I need to start?", "a": "A minimum P4/Advance rating as a licensed solo pilot."}, {"q": "What certification do I finish with?", "a": "SHGM tandem certification, valid for commercial tandem operations in Turkey."}, {"q": "How long is the course?", "a": "10 days minimum, including a required number of tandem flights plus written and practical exams."}], "relatedTitle": "More Training Options", "related": [{"href": "/training/beginner-courses", "label": "Beginner Courses"}, {"href": "/training/advanced-courses", "label": "Advanced Courses"}, {"href": "/training/siv-clinic", "label": "SIV Clinic"}, {"href": "/training/instructor-info", "label": "Instructor Info"}]}, "tr": {"sections": [{"h2": "Tandem Dönüşüm Kursu Kimler İçin?", "ps": ["Tandem dönüşüm kursumuz, ticari olarak yolcu taşımak isteyen lisanslı solo pilotlar (minimum P4/Advance derecesi) için tasarlanmıştır. Kurs, Türkiye'de ticari operasyonlar için geçerli SHGM tandem sertifikasyonuna götürür."]}, {"h2": "Kurs Neleri Kapsıyor?", "ps": ["Tandem ekipman kullanımı, uçuş öncesi yolcu brifingleri, tandem kalkış ve iniş teknikleri, yolcuyla acil durum prosedürleri, uçuşta yolcu yönetimi ve mevzuat gereksinimleri."]}, {"h2": "Ne Kadar Sürer ve Neler Gerekir?", "ps": ["Kurs süresi minimum 10 gündür. Minimum sayıda tandem uçuş tamamlamanız ve hem yazılı hem pratik sınavları geçmeniz gerekir. Bu kurs yalnızca geçerli paraşüt lisansına sahip kişilere açıktır."]}], "faqTitle": "SSS – Tandem Pilot Dönüşümü", "faqs": [{"q": "Başlamak için hangi lisans seviyesi gerekli?", "a": "Lisanslı solo pilot olarak minimum P4/Advance derecesi."}, {"q": "Hangi sertifikayla tamamlıyorum?", "a": "Türkiye'de ticari tandem operasyonları için geçerli SHGM tandem sertifikasyonu."}, {"q": "Kurs ne kadar sürüyor?", "a": "Minimum 10 gün; gerekli sayıda tandem uçuş ile yazılı ve pratik sınavları içerir."}], "relatedTitle": "Diğer Eğitim Seçenekleri", "related": [{"href": "/training/beginner-courses", "label": "Başlangıç Kursları"}, {"href": "/training/advanced-courses", "label": "İleri Düzey Kurslar"}, {"href": "/training/siv-clinic", "label": "SIV Kliniği"}, {"href": "/training/instructor-info", "label": "Eğitmen Bilgileri"}]}, "de": {"sections": [{"h2": "Für wen ist der Tandem-Umschulungskurs geeignet?", "ps": ["Unser Tandem-Umschulungskurs richtet sich an lizenzierte Solopiloten (mindestens P4/Advance-Rating), die Passagiere kommerziell befördern möchten. Der Kurs führt zur SHGM-Tandemzertifizierung, gültig für kommerziellen Betrieb in der Türkei."]}, {"h2": "Was umfasst der Kurs?", "ps": ["Umgang mit Tandemausrüstung, Passagier-Briefings vor dem Flug, Tandem-Start- und Landetechniken, Notfallverfahren mit Passagier, Passagiermanagement im Flug und regulatorische Anforderungen."]}, {"h2": "Wie lange dauert es und was wird benötigt?", "ps": ["Die Kursdauer beträgt mindestens 10 Tage. Sie müssen eine Mindestanzahl an Tandemflügen absolvieren und sowohl schriftliche als auch praktische Prüfungen bestehen. Dieser Kurs steht nur Inhabern gültiger Paragliding-Lizenzen offen."]}], "faqTitle": "FAQ – Tandempiloten-Umschulung", "faqs": [{"q": "Welches Lizenzniveau brauche ich zum Start?", "a": "Mindestens ein P4/Advance-Rating als lizenzierter Solopilot."}, {"q": "Mit welcher Zertifizierung schließe ich ab?", "a": "SHGM-Tandemzertifizierung, gültig für kommerziellen Tandembetrieb in der Türkei."}, {"q": "Wie lange dauert der Kurs?", "a": "Mindestens 10 Tage, einschließlich einer erforderlichen Anzahl an Tandemflügen sowie schriftlicher und praktischer Prüfungen."}], "relatedTitle": "Weitere Trainingsoptionen", "related": [{"href": "/training/beginner-courses", "label": "Anfängerkurse"}, {"href": "/training/advanced-courses", "label": "Fortgeschrittenenkurse"}, {"href": "/training/siv-clinic", "label": "SIV-Klinik"}, {"href": "/training/instructor-info", "label": "Instruktorinformationen"}]}, "ru": {"sections": [{"h2": "Для кого предназначен курс переквалификации в тандем-пилоты?", "ps": ["Наш курс переквалификации предназначен для лицензированных соло-пилотов (минимум рейтинг P4/Advance), желающих коммерчески перевозить пассажиров. Курс ведёт к сертификации SHGM тандем, действительной для коммерческих операций в Турции."]}, {"h2": "Что охватывает курс?", "ps": ["Работа с тандемным снаряжением, инструктаж пассажиров перед полётом, техники тандемного старта и посадки, аварийные процедуры с пассажиром, управление пассажиром в полёте и нормативные требования."]}, {"h2": "Сколько длится и что требуется?", "ps": ["Длительность курса минимум 10 дней. Вам нужно будет выполнить минимальное количество тандемных полётов и сдать письменный и практический экзамены. Этот курс доступен только владельцам действующих лицензий парапланериста."]}], "faqTitle": "FAQ – переквалификация в тандем-пилоты", "faqs": [{"q": "Какой уровень лицензии нужен для начала?", "a": "Минимум рейтинг P4/Advance как лицензированный соло-пилот."}, {"q": "С какой сертификацией я завершу курс?", "a": "Сертификация SHGM тандем, действительная для коммерческих тандемных операций в Турции."}, {"q": "Сколько длится курс?", "a": "Минимум 10 дней, включая требуемое количество тандемных полётов плюс письменный и практический экзамены."}], "relatedTitle": "Другие варианты обучения", "related": [{"href": "/training/beginner-courses", "label": "Курсы для начинающих"}, {"href": "/training/advanced-courses", "label": "Продвинутые курсы"}, {"href": "/training/siv-clinic", "label": "SIV клиника"}, {"href": "/training/instructor-info", "label": "Информация об инструкторах"}]}, "zh": {"sections": [{"h2": "双人飞行员转换课程面向哪些人？", "ps": ["我们的双人转换课程专为希望以商业形式搭载乘客的持证单人飞行员（至少 P4/高级资质）设计。课程结业可获得土耳其民航总局（SHGM）双人飞行认证，可在土耳其从事商业运营。"]}, {"h2": "课程包含哪些内容？", "ps": ["双人装备操作、飞行前的乘客讲解、双人起飞和降落技术、带乘客时的紧急程序、飞行中的乘客管理，以及法规要求。"]}, {"h2": "需要多长时间？有什么要求？", "ps": ["课程时长至少 10 天。您需要完成最低数量的双人飞行，并通过笔试和实操考试。本课程仅面向持有有效滑翔伞执照的飞行员。"]}], "faqTitle": "常见问题 – 双人飞行员转换", "faqs": [{"q": "开始学习需要什么执照等级？", "a": "作为持证单人飞行员，至少需要 P4/高级资质。"}, {"q": "结业后能获得什么资质？", "a": "土耳其民航总局（SHGM）双人飞行认证，可在土耳其从事商业双人飞行运营。"}, {"q": "课程有多长？", "a": "至少 10 天，包括规定数量的双人飞行以及笔试和实操考试。"}], "relatedTitle": "更多培训选项", "related": [{"href": "/training/beginner-courses", "label": "初级课程"}, {"href": "/training/advanced-courses", "label": "进阶课程"}, {"href": "/training/siv-clinic", "label": "SIV 课程"}, {"href": "/training/instructor-info", "label": "教练信息"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'training' })
  const titles = {en:"Tandem Pilot Conversion Course",tr:"Tandem Pilot Dönüşüm Kursu",de:"Tandempiloten-Umschulungskurs",ru:"Курс переквалификации в тандем-пилоты", zh: "双人飞行员转换课程"}
  const subs = {en:"Become a certified tandem paragliding pilot.",tr:"Sertifikalı tandem paraşüt pilotu olun.",de:"Werden Sie ein zertifizierter Tandemparagliding-Pilot.",ru:"Станьте сертифицированным тандем-пилотом.", zh: "成为认证的双人滑翔伞飞行员。"}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <ServiceSchema name="Tandem Pilot Conversion Course Oludeniz" description="Tandem pilot conversion training in Oludeniz — become a certified tandem instructor." path="/training/tandem-conversion" serviceType="Paragliding Training Course" />
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
