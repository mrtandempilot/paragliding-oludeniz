import { NextResponse } from 'next/server'

// One-time call to subscribe Instagram account to webhook events
// GET /api/admin/instagram/subscribe-webhook
export async function GET() {
  const igAccountId = process.env.INSTAGRAM_ACCOUNT_ID || process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID
  const igToken = process.env.INSTAGRAM_ACCESS_TOKEN

  if (!igAccountId || !igToken) {
    return NextResponse.json({ error: 'Missing INSTAGRAM_BUSINESS_ACCOUNT_ID or INSTAGRAM_ACCESS_TOKEN' }, { status: 500 })
  }

  // Subscribe the Instagram account to webhook fields
  const res = await fetch(
    `https://graph.facebook.com/v19.0/${igAccountId}/subscribed_apps`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscribed_fields: 'comments,messages,mentions',
        access_token: igToken,
      }),
    }
  )

  const data = await res.json()

  if (data.error) {
    // Try with page ID approach
    return NextResponse.json({
      error: data.error.message,
      hint: 'You may need a Page access token instead of a User access token',
      igAccountId,
    }, { status: 400 })
  }

  return NextResponse.json({
    success: true,
    result: data,
    message: 'Instagram account subscribed to webhook events: comments, messages, mentions',
  })
}
