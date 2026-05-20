import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

const FLIGHT_PRICES: Record<string, number> = {
  standard: 80,
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
    let addonPrice = 0
    if (addon_bundle) addonPrice = 45
    else if (addon_photo && addon_video) addonPrice = 45
    else if (addon_photo) addonPrice = 25
    else if (addon_video) addonPrice = 30

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

    // Send email notification via Resend (if configured)
    if (process.env.RESEND_API_KEY) {
      try {
        const addons = []
        if (addon_bundle) addons.push('Photo + Video Bundle (+€45)')
        else {
          if (addon_photo) addons.push('Photo Package (+€25)')
          if (addon_video) addons.push('Video Package (+€30)')
        }

        const emailBody = `
New booking request from ${first_name} ${last_name}

Flight: ${FLIGHT_LABELS[flight_type]}
Date: ${new Date(flight_date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
Guests: ${guestCount}${addons.length ? '\nAdd-ons: ' + addons.join(', ') : ''}

--- Guest Info ---
Name: ${first_name} ${last_name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Notes: ${notes || 'None'}

--- Pricing ---
Base price: €${basePrice}${addonPrice ? '\nAdd-ons: €' + addonPrice : ''}
Total: €${totalPrice}${guestCount >= 4 ? ' (group discount applied)' : ''}

--- Action Required ---
Reply to confirm or contact the guest.
View in admin: https://paragliding-oludeniz.com/admin/bookings
        `.trim()

        const fromAddress = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
        const toAddress = process.env.OWNER_EMAIL || 'mrtandempilot@gmail.com'

        const emailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromAddress,
            to: toAddress,
            subject: `New Booking: ${first_name} ${last_name} — ${new Date(flight_date).toLocaleDateString('en-GB')} — €${totalPrice}`,
            text: emailBody,
          }),
        })

        if (!emailRes.ok) {
          const errText = await emailRes.text()
          console.error('[Bookings] Resend error:', errText)
        }

        // Update notified_at
        await supabase
          .from('bookings')
          .update({ notified_at: new Date().toISOString() })
          .eq('id', booking.id)
      } catch (emailErr) {
        console.error('[Bookings] Email send failed:', emailErr)
        // Don't fail the request — booking is saved
      }
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
