export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

export async function GET() {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
  const igAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID

  if (!accessToken || !igAccountId) {
    return NextResponse.json({
      configured: false,
      error: 'INSTAGRAM_ACCESS_TOKEN veya INSTAGRAM_BUSINESS_ACCOUNT_ID eksik',
    })
  }

  try {
    // Check token validity + expiry via Facebook debug_token endpoint
    const debugRes = await fetch(
      `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${accessToken}`
    )
    const debug = await debugRes.json()

    if (debug.error) {
      return NextResponse.json({
        configured: true,
        valid: false,
        error: debug.error.message,
      })
    }

    const tokenData = debug.data || {}
    const expiresAt: number | null = tokenData.expires_at
      ? tokenData.expires_at * 1000
      : null
    const daysLeft = expiresAt
      ? Math.floor((expiresAt - Date.now()) / 86400000)
      : null

    // Also fetch basic account info (follower count, username)
    const accountRes = await fetch(
      `https://graph.facebook.com/v19.0/${igAccountId}?fields=username,followers_count,media_count&access_token=${accessToken}`
    )
    const account = await accountRes.json()

    return NextResponse.json({
      configured: true,
      valid: tokenData.is_valid ?? true,
      expiresAt,
      daysLeft,
      neverExpires: !expiresAt,
      username: account.username || null,
      followersCount: account.followers_count ?? null,
      mediaCount: account.media_count ?? null,
      scopes: tokenData.scopes || [],
    })
  } catch (err) {
    return NextResponse.json({
      configured: true,
      valid: false,
      error: String(err),
    })
  }
}
