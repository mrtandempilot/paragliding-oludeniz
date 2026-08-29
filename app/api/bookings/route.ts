export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

const FLIGHT_PRICES: Record<string, number> = {
  standard: 100,
  high: 100,
  sunset: 110,
}

const FLIGHT_LABELS: Record<string, string> = {
  standard: 'Standard Tandem — 1200m',
  high: 'High Altitude — 1700m',
  sunset: 'Sunset Flight — 1200m',
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabase()
    const body = await request.json()

    const {
      flight_type,
      flight_date,
      guests,
      first_name,
      last_name,
      email,
      phone,
      notes,
      addon_photo,
      addon_video,
      addon_bundle,
    } = body

    // Validate required fields
    if (!flight_type || !flight_date || !first_name || !last_name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Calculate price
    const guestCount = parseInt(guests) || 1
    const basePerPerson = FLIGHT_PRICES[flight_type] || 80
    // Add-ons are currently offered free of charge
    let addonPrice = 0

    // Group discount
    let basePrice = basePerPerson * guestCount
    if (guestCount >= 8) basePrice = Math.round(basePrice * 0.85)
    else if (guestCount >= 4) basePrice = Math.round(basePrice * 0.90)

    const totalPrice = basePrice + addonPrice

    // Save to Supabase
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        flight_type,
        flight_date,
        guests: guestCount,
        first_name,
        last_name,
        email,
        phone: phone || null,
        notes: notes || null,
        addon_photo: !!addon_photo,
        addon_video: !!addon_video,
        addon_bundle: !!addon_bundle,
        base_price: basePrice,
        addon_price: addonPrice,
        total_price: totalPrice,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      console.error('[Bookings] Supabase error:', error)
      return NextResponse.json({ error: 'Failed to save booking' }, { status: 500 })
    }

    // Send email notification via Gmail SMTP
    try {
      const GMAIL_USER = process.env.GMAIL_USER || 'mrtandempilot@gmail.com'
      const GMAIL_PASS = process.env.GMAIL_APP_PASSWORD

      if (!GMAIL_PASS) {
        console.error('[Bookings] GMAIL_APP_PASSWORD not set — skipping email')
      } else {
        const addons = []
        if (addon_bundle) addons.push('Photo + Video Bundle (Free)')
        else {
          if (addon_photo) addons.push('Photo Package (Free)')
          if (addon_video) addons.push('Video Package (Free)')
        }

        const dateStr = new Date(flight_date).toLocaleDateString('en-GB', {
          weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
        })

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: GMAIL_USER, pass: GMAIL_PASS },
        })

        await transporter.sendMail({
          from: `"Atmos Paragliding" <${GMAIL_USER}>`,
          to: GMAIL_USER,
          subject: `New Booking: ${first_name} ${last_name} - ${dateStr} - EUR${totalPrice}`,
          html: `
            <h2>New Booking Request</h2>
            <table style="border-collapse:collapse; width:100%; font-family:sans-serif; font-size:14px;">
              <tr><td style="padding:8px; background:#f8f9fa; font-weight:bold;">Flight</td><td style="padding:8px;">${FLIGHT_LABELS[flight_type]}</td></tr>
              <tr><td style="padding:8px; background:#f8f9fa; font-weight:bold;">Date</td><td style="padding:8px;">${dateStr}</td></tr>
              <tr><td style="padding:8px; background:#f8f9fa; font-weight:bold;">Guests</td><td style="padding:8px;">${guestCount}</td></tr>
              ${addons.length ? `<tr><td style="padding:8px; background:#f8f9fa; font-weight:bold;">Add-ons</td><td style="padding:8px;">${addons.join(', ')}</td></tr>` : ''}
              <tr><td colspan="2" style="padding:8px; border-top:2px solid #e9ecef;"></td></tr>
              <tr><td style="padding:8px; background:#f8f9fa; font-weight:bold;">Name</td><td style="padding:8px;">${first_name} ${last_name}</td></tr>
              <tr><td style="padding:8px; background:#f8f9fa; font-weight:bold;">Email</td><td style="padding:8px;"><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding:8px; background:#f8f9fa; font-weight:bold;">Phone</td><td style="padding:8px;">${phone || 'Not provided'}</td></tr>
              ${notes ? `<tr><td style="padding:8px; background:#f8f9fa; font-weight:bold;">Notes</td><td style="padding:8px;">${notes}</td></tr>` : ''}
              <tr><td colspan="2" style="padding:8px; border-top:2px solid #e9ecef;"></td></tr>
              <tr><td style="padding:8px; background:#f8f9fa; font-weight:bold;">Total</td><td style="padding:8px; font-size:18px; font-weight:bold; color:#f97316;">EUR${totalPrice}${guestCount >= 4 ? ' (group discount applied)' : ''}</td></tr>
            </table>
            <br>
            <a href="https://atmosparagliding.com/admin/bookings" style="display:inline-block; background:#f97316; color:white; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:bold;">View in Admin Panel</a>
          `,
        })

        console.log('[Bookings] Email sent via Gmail to', GMAIL_USER)
        await supabase
          .from('bookings')
          .update({ notified_at: new Date().toISOString() })
          .eq('id', booking.id)
      }
    } catch (emailErr) {
      console.error('[Bookings] Email send failed:', emailErr)
      // Don't fail the request — booking is saved
    }

    // Send WhatsApp notification to pilot (via Meta WhatsApp Cloud API)
    try {
      const WA_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID
      const WA_RECIPIENT = process.env.WHATSAPP_NOTIFY_PHONE
      const WA_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN

      if (!WA_PHONE_NUMBER_ID || !WA_RECIPIENT || !WA_TOKEN) {
        console.error('[Bookings] WHATSAPP_PHONE_NUMBER_ID / WHATSAPP_NOTIFY_PHONE / WHATSAPP_ACCESS_TOKEN not set — skipping WhatsApp notification')
      } else {
        const dateForWa = new Date(flight_date).toLocaleDateString('en-GB', {
          weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
        })

        const notifyText =
          `New booking request!\n` +
          `${FLIGHT_LABELS[flight_type]}\n` +
          `Date: ${dateForWa}\n` +
          `Guests: ${guestCount}\n` +
          `Name: ${first_name} ${last_name}\n` +
          `Phone: ${phone || 'not provided'}\n` +
          `Total: EUR${totalPrice}\n` +
          `https://atmosparagliding.com/admin/bookings`

        const waRes = await fetch(`https://graph.facebook.com/v21.0/${WA_PHONE_NUMBER_ID}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${WA_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: WA_RECIPIENT,
            type: 'text',
            text: { body: notifyText },
          }),
        })

        if (!waRes.ok) {
          console.error('[Bookings] WhatsApp notify failed:', waRes.status, await waRes.text())
        } else {
          console.log('[Bookings] WhatsApp notification sent to', WA_RECIPIENT)
        }
      }
    } catch (waErr) {
      console.error('[Bookings] WhatsApp notify error:', waErr)
      // Don't fail the request — booking is saved
    }

    // Send Telegram notification to pilot (Telegram Bot API)
    try {
      const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN
      const TG_CHAT_ID = process.env.TELEGRAM_CHAT_ID

      if (!TG_TOKEN || !TG_CHAT_ID) {
        console.warn('[Bookings] TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not set — skipping Telegram notification')
      } else {
        const dateForTg = new Date(flight_date).toLocaleDateString('en-GB', {
          weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
        })
        const tgText =
          `🪂 Yeni rezervasyon!\n` +
          `${FLIGHT_LABELS[flight_type]}\n` +
          `Tarih: ${dateForTg}\n` +
          `Misafir: ${guestCount}\n` +
          `İsim: ${first_name} ${last_name}\n` +
          `Telefon: ${phone || 'belirtilmedi'}\n` +
          `Toplam: €${totalPrice}\n` +
          `https://www.atmosparagliding.com/admin/bookings`

        const tgRes = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: TG_CHAT_ID, text: tgText }),
        })

        if (!tgRes.ok) {
          console.warn('[Bookings] Telegram notify failed:', tgRes.status, await tgRes.text())
        } else {
          console.log('[Bookings] Telegram notification sent')
        }
      }
    } catch (tgErr) {
      console.warn('[Bookings] Telegram notify error (non-fatal):', tgErr)
    }

    // Build WhatsApp pre-fill message for customer
    const dateFormatted = new Date(flight_date).toLocaleDateString('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    })
    const addonsText = addon_bundle
      ? ' + Photo & Video Bundle'
      : addon_photo && addon_video
        ? ' + Photo & Video'
        : addon_photo
          ? ' + Photo Package'
          : addon_video
            ? ' + Video Package'
            : ''

    const waMessage = encodeURIComponent(
      `Hi! I just submitted a booking request on your website.\n\n` +
      `Flight: ${FLIGHT_LABELS[flight_type]}${addonsText}\n` +
      `Date: ${dateFormatted}\n` +
      `Guests: ${guestCount}\n` +
      `Name: ${first_name} ${last_name}\n` +
      `Total: €${totalPrice}\n\n` +
      `Please confirm my booking. Thank you!`
    )

    return NextResponse.json({
      ok: true,
      booking_id: booking.id,
      total_price: totalPrice,
      whatsapp_url: `https://wa.me/905364616674?text=${waMessage}`,
    })
  } catch (err: any) {
    console.error('[Bookings] Fatal error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const supabase = getSupabase()
  // Admin only — list bookings
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const limit = parseInt(searchParams.get('limit') || '50')

  let query = supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (status) query = query.eq('status', status)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ bookings: data })
}

export async function PATCH(request: Request) {
  const supabase = getSupabase()
  // Admin: update booking status
  const body = await request.json()
  const { id, status, admin_notes } = body

  const { error } = await supabase
    .from('bookings')
    .update({ status, admin_notes })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
