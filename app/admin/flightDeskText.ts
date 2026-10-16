// Uçuş Masası — müşteriye giden hazır WhatsApp mesajları. Dil, telefonun ülke
// kodundan tahmin edilir; tanınmayan kodlarda İngilizce kullanılır.
export type Lang = 'en' | 'tr' | 'de' | 'ru' | 'zh'
export type Template = 'confirm' | 'pickup' | 'weather' | 'thanks'

export const LANG_LABEL: Record<Lang, string> = { en: 'EN', tr: 'TR', de: 'DE', ru: 'RU', zh: '中文' }
export const TEMPLATE_LABEL: Record<Template, string> = {
  confirm: 'Onay', pickup: 'Buluşma saati', weather: 'Hava: ertele', thanks: 'Teşekkür',
}

/** Telefonu wa.me için uluslararası rakamlara çevirir (0 ile başlayan yerel TR numarası → 90…). */
export function waDigits(phone: string) {
  let d = (phone || '').replace(/\D/g, '')
  if (d.startsWith('00')) d = d.slice(2)
  else if (d.startsWith('0')) d = '90' + d.slice(1)
  else if (d.length === 10 && d.startsWith('5')) d = '90' + d
  return d
}

export function langOf(phone: string): Lang {
  const d = waDigits(phone)
  if (d.startsWith('90')) return 'tr'
  if (/^(49|43|41)/.test(d)) return 'de'
  if (/^(7|375)/.test(d)) return 'ru'
  if (d.startsWith('86')) return 'zh'
  return 'en'
}

const LOCALE: Record<Lang, string> = { en: 'en-GB', tr: 'tr-TR', de: 'de-DE', ru: 'ru-RU', zh: 'zh-CN' }
const people = (lang: Lang, n: number) => ({
  en: n === 1 ? '1 person' : `${n} people`,
  tr: `${n} kişi`,
  de: n === 1 ? '1 Person' : `${n} Personen`,
  ru: `${n} чел.`,
  zh: `${n} 人`,
}[lang])
const yourHotel: Record<Lang, string> = { en: 'our office in Ölüdeniz', tr: 'Ölüdeniz ofisimiz', de: 'unserem Büro in Ölüdeniz', ru: 'наш офис в Олюденизе', zh: '我们在厄卢代尼兹的办公室' }

export function waMessage(t: Template, lang: Lang, x: { name: string; date: string; guests: number; time?: string; hotel?: string }) {
  const n = (x.name || '').trim().split(/\s+/)[0] || ''
  const date = new Intl.DateTimeFormat(LOCALE[lang], { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(x.date.slice(0, 10) + 'T12:00:00Z'))
  const g = people(lang, x.guests || 1)
  const time = x.time || '—'
  const hotel = x.hotel?.trim() || yourHotel[lang]
  const M: Record<Template, Record<Lang, string>> = {
    confirm: {
      en: `Hi ${n}! 🪂 Your tandem paragliding flight with Atmos Paragliding on ${date} (${g}) is confirmed. We meet at our office in Ölüdeniz and drive you up the mountain from there — we'll send your exact meeting time the day before. $150 per person, pay on the day — HD photos & video, the mountain transfer and the mountain fee are included.`,
      tr: `Merhaba ${n}! 🪂 Atmos Paragliding ile ${date} tarihli yamaç paraşütü uçuşunuz (${g}) onaylandı. Ölüdeniz ofisimizde buluşuyoruz, oradan sizi dağa çıkarıyoruz — kesin buluşma saatini bir gün önce bildireceğiz. Kişi başı $150, ödeme uçuş günü. HD foto ve video, dağa transfer ve dağ girişi dahil.`,
      de: `Hallo ${n}! 🪂 Ihr Tandem-Paragliding-Flug mit Atmos Paragliding am ${date} (${g}) ist bestätigt. Treffpunkt ist unser Büro in Ölüdeniz, von dort bringen wir Sie auf den Berg – die genaue Uhrzeit schicken wir Ihnen am Vortag. 150 $ pro Person, Zahlung am Flugtag – HD-Fotos & Video, Bergtransfer und Bergeintritt sind inklusive.`,
      ru: `Здравствуйте, ${n}! 🪂 Ваш тандемный полёт на параплане с Atmos Paragliding ${date} (${g}) подтверждён. Встречаемся в нашем офисе в Олюденизе, оттуда везём вас на гору — точное время встречи сообщим накануне. $150 с человека, оплата в день полёта — HD фото и видео, трансфер на гору и сбор за въезд включены.`,
      zh: `您好 ${n}！🪂 您在 ${date} 与 Atmos Paragliding 的双人滑翔伞飞行（${g}）已确认。我们在厄卢代尼兹的办公室集合，从那里送您上山——准确的集合时间会在前一天告知。每人 150 美元，飞行当天付款——含高清照片和视频、上山接送及山顶门票。`,
    },
    pickup: {
      en: `Hi ${n}! Meeting time for your paragliding flight on ${date}: ${time} at ${hotel}. 🚐 Please wear trainers and bring a light jacket. If the wind changes we'll message you here. See you! 🪂`,
      tr: `Merhaba ${n}! ${date} uçuşunuz için buluşma saati: ${time}, ${hotel}. 🚐 Spor ayakkabı giyin, ince bir ceket alın. Rüzgâr değişirse buradan haber veririz. Görüşmek üzere! 🪂`,
      de: `Hallo ${n}! Treffpunkt für Ihren Paragliding-Flug am ${date}: ${time} bei ${hotel}. 🚐 Bitte Turnschuhe tragen und eine leichte Jacke mitnehmen. Falls sich der Wind ändert, melden wir uns hier. Bis bald! 🪂`,
      ru: `Здравствуйте, ${n}! Время встречи на полёт ${date}: ${time}, ${hotel}. 🚐 Наденьте кроссовки и возьмите лёгкую куртку. Если ветер изменится, напишем здесь. До встречи! 🪂`,
      zh: `您好 ${n}！${date} 飞行的集合时间：${time}，地点：${hotel}。🚐 请穿运动鞋并带一件薄外套。如风况有变我们会在此通知您。到时见！🪂`,
    },
    weather: {
      en: `Hi ${n}, unfortunately the wind on Babadağ won't be safe for flying on ${date}. 😕 We can move your flight to another day free of charge, or give you a full refund. Which day suits you?`,
      tr: `Merhaba ${n}, maalesef ${date} günü Babadağ'da rüzgâr uçuş için güvenli görünmüyor. 😕 Uçuşunuzu ücretsiz olarak başka bir güne alabiliriz ya da tam iade yapabiliriz. Hangi gün uygun?`,
      de: `Hallo ${n}, leider wird der Wind am Babadağ am ${date} nicht sicher zum Fliegen sein. 😕 Wir können Ihren Flug kostenlos auf einen anderen Tag verschieben oder den vollen Betrag erstatten. Welcher Tag passt Ihnen?`,
      ru: `Здравствуйте, ${n}! К сожалению, ${date} ветер на Бабадаге будет небезопасен для полётов. 😕 Мы можем бесплатно перенести полёт на другой день или полностью вернуть деньги. Какой день вам удобен?`,
      zh: `您好 ${n}，很遗憾 ${date} 巴巴达山的风况不适合安全飞行。😕 我们可以免费为您改期，或全额退款。您哪天方便？`,
    },
    thanks: {
      en: `Thank you for flying with Atmos Paragliding, ${n}! 🪂 We hope you loved it. Tag us on Instagram @atmosparagliding when you share your video, and a short review would mean the world to us. 🙏`,
      tr: `Atmos Paragliding ile uçtuğunuz için teşekkürler ${n}! 🪂 Umarız çok keyif aldınız. Videonuzu paylaşırken Instagram'da @atmosparagliding etiketleyin. Kısa bir yorum bizim için çok değerli. 🙏`,
      de: `Danke, dass Sie mit Atmos Paragliding geflogen sind, ${n}! 🪂 Wir hoffen, es hat Ihnen gefallen. Markieren Sie uns auf Instagram @atmosparagliding, wenn Sie Ihr Video teilen – über eine kurze Bewertung würden wir uns sehr freuen. 🙏`,
      ru: `Спасибо, что летали с Atmos Paragliding, ${n}! 🪂 Надеемся, вам понравилось. Отметьте нас в Instagram @atmosparagliding, когда будете делиться видео, — короткий отзыв очень много для нас значит. 🙏`,
      zh: `感谢您选择 Atmos Paragliding，${n}！🪂 希望您玩得开心。分享视频时请在 Instagram 标记 @atmosparagliding，留下简短评价对我们意义重大。🙏`,
    },
  }
  return M[t][lang]
}

export function waUrl(phone: string, text?: string) {
  const base = `https://wa.me/${waDigits(phone)}`
  return text ? `${base}?text=${encodeURIComponent(text)}` : base
}
