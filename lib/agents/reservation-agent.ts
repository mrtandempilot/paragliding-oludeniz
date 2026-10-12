// Rezervasyon ajanı — her sabah 08:00 (TR) çalışır:
// - Bugünün ve yarının uçuşlarını listeler
// - Yarın uçacak müşterilere hatırlatma e-postası yollar (bir kez)
// - 2 saatten uzun süredir "pending" kalan rezervasyonları Ceyhun'a bildirir
// - Yarın için Babadağ rüzgâr/yağış tahminini kontrol eder
// - Hepsini Telegram'dan özetler
import nodemailer from 'nodemailer'
import { db, runLogged, telegram, esc, getSetting, setSetting, trDay } from './core'

const REMINDED_KEY = 'reservation_agent_reminded'

async function tomorrowWeather() {
  try {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=36.5717&longitude=29.0578&daily=wind_speed_10m_max,wind_gusts_10m_max,precipitation_probability_max,weather_code&timezone=Europe%2FIstanbul&forecast_days=3'
    const j = await (await fetch(url, { cache: 'no-store' })).json()
    const i = 1
    const wind = j.daily?.wind_speed_10m_max?.[i], gust = j.daily?.wind_gusts_10m_max?.[i], rain = j.daily?.precipitation_probability_max?.[i]
    const risky = (gust ?? 0) >= 40 || (wind ?? 0) >= 25 || (rain ?? 0) >= 60
    return { wind, gust, rain, risky }
  } catch { return null }
}

function reminderHtml(b: any, dateStr: string) {
  return `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.55;color:#0f172a">
  <p>Hi ${esc(b.first_name?.trim())},</p>
  <p>Just a friendly reminder: your <b>tandem paragliding flight</b> with Atmos Paragliding is <b>tomorrow, ${esc(dateStr)}</b> (${b.guests} ${b.guests === 1 ? 'person' : 'people'}).</p>
  <ul>
    <li>Your HD photos &amp; video, hotel pickup and the mountain fee are all included.</li>
    <li>We'll message you on WhatsApp with your exact pickup time. Wear comfortable trainers and bring a light jacket.</li>
    <li>Flights depend on the weather — if conditions aren't safe we'll reschedule or refund you in full.</li>
  </ul>
  <p>Questions? Reply to this email or WhatsApp us: <a href="https://wa.me/905364616674">+90 536 461 66 74</a></p>
  <p>See you in the sky! 🪂<br/>Atmos Paragliding · Ölüdeniz</p></div>`
}

export async function runReservationAgent() {
  return runLogged('rezervasyon', 'günlük rezervasyon kontrolü', async () => {
    const today = trDay(0), tomorrow = trDay(1)
    const { data: rows, error } = await db().from('bookings').select('*').gte('flight_date', today).lte('flight_date', tomorrow).neq('status', 'cancelled').order('flight_date')
    if (error) throw new Error(error.message)
    const { data: pend } = await db().from('bookings').select('*').eq('status', 'pending').lt('created_at', new Date(Date.now() - 2 * 3600000).toISOString()).gte('flight_date', today)
    const todayB = (rows || []).filter(b => b.flight_date === today)
    const tomB = (rows || []).filter(b => b.flight_date === tomorrow)
    const weather = await tomorrowWeather()

    // reminders for tomorrow (once per booking)
    const reminded: string[] = await getSetting(REMINDED_KEY, [])
    const sent: string[] = []
    const pass = process.env.GMAIL_APP_PASSWORD, user = process.env.GMAIL_USER || 'mrtandempilot@gmail.com'
    if (pass) {
      const tx = nodemailer.createTransport({ service: 'gmail', auth: { user, pass } })
      for (const b of tomB) {
        if (!b.email || reminded.includes(b.id)) continue
        const dateStr = new Date(b.flight_date + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
        try {
          await tx.sendMail({ from: `"Atmos Paragliding" <${user}>`, to: b.email, replyTo: 'atmosparagliding@gmail.com', subject: `Reminder: your paragliding flight is tomorrow (${dateStr})`, html: reminderHtml(b, dateStr) })
          sent.push(b.id); reminded.push(b.id)
        } catch { /* keep going */ }
      }
      if (sent.length) await setSetting(REMINDED_KEY, reminded.slice(-500))
    }

    const line = (b: any) => `• ${esc(b.first_name?.trim())} ${esc(b.last_name?.trim())} — ${b.guests} kişi — ${esc(b.status)}${b.phone ? ' — ' + esc(b.phone) : ''}`
    const msg = [
      `🗓️ <b>Rezervasyon ajanı</b> — ${today}`,
      `\n<b>Bugün (${todayB.length})</b>\n${todayB.map(line).join('\n') || '—'}`,
      `\n<b>Yarın (${tomB.length})</b>\n${tomB.map(line).join('\n') || '—'}`,
      weather ? `\n🌬️ Yarın Babadağ: rüzgâr ${Math.round(weather.wind ?? 0)} km/s, hamle ${Math.round(weather.gust ?? 0)} km/s, yağış ihtimali %${weather.rain ?? 0}${weather.risky ? ' — ⚠️ <b>riskli olabilir, müşterileri önceden uyar</b>' : ''}` : '',
      sent.length ? `\n✅ ${sent.length} müşteriye yarın için hatırlatma e-postası gönderdim.` : '',
      pend?.length ? `\n⏳ <b>${pend.length} rezervasyon 2 saatten uzun süredir onay bekliyor</b>\n${pend.map(line).join('\n')}\n→ admin/bookings` : '',
    ].filter(Boolean).join('\n')
    await telegram(msg)

    return { today: todayB.length, tomorrow: tomB.length, remindersSent: sent.length, pendingOver2h: pend?.length || 0, weather }
  })
}
