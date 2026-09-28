import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'
import ServiceSchema from '@/components/shared/ServiceSchema'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Equipment Requirements Oludeniz",tr:"Oludeniz Ekipman Gereksinimleri",de:"Ausrüstungsanforderungen Oludeniz",ru:"Требования к снаряжению Олюдениз", zh: "厄卢代尼兹装备要求"}
  const d = {en:"What equipment you need to fly solo at Babadağ.",tr:"Babadağ'da solo uçmak için ihtiyacınız olan ekipman.",de:"Welche Ausrüstung Sie brauchen, um solo am Babadağ zu fliegen.",ru:"Какое снаряжение нужно для соло полётов на Бабадаге.", zh: "在巴巴达山单人飞行需要哪些装备。"}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/solo-paragliding/equipment-requirements'),
    openGraph: { url: localeUrl(locale, '/solo-paragliding/equipment-requirements'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'solo' })
  const titles = {en:"Equipment Requirements Oludeniz",tr:"Oludeniz Ekipman Gereksinimleri",de:"Ausrüstungsanforderungen Oludeniz",ru:"Требования к снаряжению Олюдениз", zh: "厄卢代尼兹装备要求"}
  const subs = {en:"What equipment you need to fly solo at Babadağ.",tr:"Babadağ'da solo uçmak için ihtiyacınız olan ekipman.",de:"Welche Ausrüstung Sie brauchen, um solo am Babadağ zu fliegen.",ru:"Какое снаряжение нужно для соло полётов на Бабадаге.", zh: "在巴巴达山单人飞行需要哪些装备。"}
  const bodies = {en:["To fly solo at Babadağ you must have: a valid paraglider in current certification (EN B or above recommended for Babadağ conditions), a reserve parachute packed within 180 days, a suitable harness with back protection, a certified helmet, variometer and radio.","Wing certification: EN A gliders are welcome at Babadağ but pilots should be aware that conditions can be strong in the afternoon. EN B is recommended for the main season. EN C and above: suitable for experienced pilots only.","All equipment is subject to a visual inspection at our operations desk on your first visit. We reserve the right to decline access to the launch if we have safety concerns about equipment condition.","We hire equipment to visiting pilots who do not wish to travel with full kit. See our equipment hire page for details."],tr:["Babadağ'da solo uçmak için geçerli bir paraşüt, paketlenmiş yedek paraşüt (180 gün içinde), uygun bir koşum takımı ve sertifikalı kask gereklidir."],de:["Um solo am Babadağ zu fliegen, benötigen Sie: gültigen Gleitschirm (EN B oder höher empfohlen), Rettungsschirm (innerhalb 180 Tage gepackt), geeigneten Gurt und zertifizierten Helm."],ru:["Для соло полётов на Бабадаге необходимы: действующий параплан (рекомендуется EN B или выше), запасной парашют (упакованный в течение 180 дней), подвесная система и сертифицированный шлем."], zh: ["在巴巴达山单人飞行，您必须具备：一顶认证有效的滑翔伞（鉴于巴巴达山的条件，建议 EN B 级或以上）、180 天内折叠过的备用伞、带背部保护的合适吊带、认证头盔、升降仪和对讲机。","伞翼认证：巴巴达山欢迎 EN A 级伞翼，但飞行员应注意下午的条件可能较强。主飞行季建议使用 EN B 级。EN C 级及以上：仅适合经验丰富的飞行员。","您首次到访时，所有装备都需要在我们的运营服务台接受目视检查。如果我们对装备状况存在安全顾虑，我们保留拒绝您进入起飞点的权利。","我们向不想携带全套装备旅行的来访飞行员出租装备。详情请见我们的装备租赁页面。"]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <ServiceSchema name="Solo Paragliding Equipment Requirements Oludeniz" description="Equipment requirements for solo paragliding pilots flying in Oludeniz, Turkey." path="/solo-paragliding/equipment-requirements" serviceType="Paragliding Service" />
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c0d/dOEuj7ebfM-MdyvUcunPD.jpg" />
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3"><BreadcrumbNav items={[{ label: title }]} /></div>
      </div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl space-y-4">
          {body.map((p: string, i: number) => <p key={i} className="text-slate-600 leading-relaxed">{p}</p>)}
        </div>
      </section>
      <BookingCTA />
    </>
  )
}
