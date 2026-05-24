import { NextResponse } from 'next/server'

// One-time call to subscribe Instagram account to webhook events
// GET /api/admin/instagram/subscribe-webhook
export async function GET() {
  const igAccountId = process.env.INSTAGRAM_ACCOUNT_ID || process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID
  const igToken = process.env.INSTAGRAM_ACCESS_TOKEN

  if (!igAccountId || !igToken) {
    return NextResponse.json({ error: 'Missing INSTAGRAM_BUSINESS_ACCOUNT_ID or INSTAGRAM_ACCESS_TOKEN' }, { status: 500 })
  }

  // Step 1: Get connected Facebook Pages
  const pagesRes = await fetch(
    `https://graph.facebook.com/v19.0/me/accounts?access_token=${igToken}`
  )
  const pagesData = await pagesRes.json()

  if (pagesData.error) {
    return NextResponse.json({ error: pagesData.error.message, step: 'get_pages' }, { status: 400 })
  }

  const pages = pagesData.data || []
  if (pages.length === 0) {
    return NextResponse.json({ error: 'No Facebook Pages found for this token', pages: [] }, { status: 400 })
  }

  // Step 2: Subscribe each page to webhook
  const results = []
  for (const page of pages) {
    const subRes = await fetch(
      `https://graph.facebook.com/v19.0/${page.id}/subscribed_apps`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscribed_fields: 'feed,mention,name,picture,category,description,conversations,instagram_manage_comments,instagram_manage_insights,leadgen,location,messages,messaging_optins,messaging_postbacks,standby,tab_added,user_action',
          access_token: page.access_token,
        }),
      }
    )
    const subData = await subRes.json()
    results.push({ pageId: page.id, pageName: page.name, result: subData })
  }

  return NextResponse.json({
    success: true,
    pages: pages.map((p: any) => ({ id: p.id, name: p.name })),
    subscriptions: results,
    message: 'Pages subscribed to webhook',
  })
}
