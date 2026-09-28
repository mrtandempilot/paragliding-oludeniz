export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

const GRAPH = 'https://graph.facebook.com/v18.0'
const AD_ACCOUNT = process.env.META_AD_ACCOUNT_ID
// Reuse Instagram token — same Facebook user token works for ads
function getToken() {
  return process.env.FACEBOOK_ACCESS_TOKEN || process.env.INSTAGRAM_ACCESS_TOKEN
}

// GET /api/admin/meta-ads?type=campaigns|adsets|ads|account|insights|insights_daily|insights_by_campaign
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'campaigns'
  const datePreset = searchParams.get('date_preset') || 'last_30d'
  const token = getToken()

  if (!token || !AD_ACCOUNT) {
    return NextResponse.json({ error: 'Meta Ads not configured' }, { status: 500 })
  }

  try {
    let url = ''
    const base = `act_${AD_ACCOUNT}`

    if (type === 'billing') {
      url = `${GRAPH}/${base}?fields=funding_source_details,is_prepay_account,account_status&access_token=${token}`
    } else if (type === 'account') {
      url = `${GRAPH}/${base}?fields=name,account_status,currency,balance,spend_cap,amount_spent,min_daily_budget&access_token=${token}`
    } else if (type === 'campaigns') {
      url = `${GRAPH}/${base}/campaigns?fields=id,name,status,objective,daily_budget,lifetime_budget,start_time,stop_time&access_token=${token}&limit=50`
    } else if (type === 'insights') {
      url = `${GRAPH}/${base}/insights?fields=spend,impressions,clicks,ctr,cpc,cpm,reach,actions,date_start,date_stop&date_preset=${datePreset}&access_token=${token}`
    } else if (type === 'insights_daily') {
      // Gunluk kirilim — trend grafikleri icin (harcama/gosterim/tiklama zaman serisi)
      url = `${GRAPH}/${base}/insights?fields=spend,impressions,clicks,ctr,reach,date_start,date_stop&time_increment=1&date_preset=${datePreset}&access_token=${token}&limit=90`
    } else if (type === 'insights_by_campaign') {
      // Kampanya bazinda kirilim — kampanya karsilastirma grafigi icin
      url = `${GRAPH}/${base}/insights?level=campaign&fields=campaign_id,campaign_name,spend,impressions,clicks&date_preset=${datePreset}&access_token=${token}&limit=50`
    } else if (type === 'campaign_insights') {
      const campaignId = searchParams.get('campaign_id')
      url = `${GRAPH}/${campaignId}/insights?fields=spend,impressions,clicks,ctr,cpc,cpm,reach,actions&date_preset=${datePreset}&access_token=${token}`
    }

    const res = await fetch(url)
    const data = await res.json()

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/admin/meta-ads — create campaign
export async function POST(request: Request) {
  const token = getToken()
  if (!token || !AD_ACCOUNT) {
    return NextResponse.json({ error: 'Meta Ads not configured' }, { status: 500 })
  }

  const body = await request.json()
  const { action } = body

  try {
    if (action === 'create_campaign') {
      return await createCampaign(body, token)
    } else if (action === 'create_adset') {
      return await createAdSet(body, token)
    } else if (action === 'create_ad') {
      return await createAd(body, token)
    } else if (action === 'toggle_campaign') {
      return await toggleCampaign(body, token)
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

async function createCampaign(body: any, token: string) {
  const base = `act_${AD_ACCOUNT}`
  const url = `${GRAPH}/${base}/campaigns`

  const params = new URLSearchParams({
    name: body.name,
    objective: body.objective || 'OUTCOME_TRAFFIC',
    status: body.status || 'PAUSED',
    special_ad_categories: '[]',
    access_token: token,
  })

  const res = await fetch(url, { method: 'POST', body: params })
  const data = await res.json()

  if (data.error) return NextResponse.json({ error: data.error.message }, { status: 400 })
  return NextResponse.json({ success: true, campaign_id: data.id })
}

async function createAdSet(body: any, token: string) {
  const base = `act_${AD_ACCOUNT}`
  const url = `${GRAPH}/${base}/adsets`

  const includeFacebook = body.include_facebook === true

  const publisherPlatforms = includeFacebook
    ? ['instagram', 'facebook']
    : ['instagram']

  const targeting: Record<string, unknown> = {
    geo_locations: { countries: ['TR', 'GB', 'DE', 'NL', 'FR', 'US'] },
    age_min: 22,
    age_max: 55,
    publisher_platforms: publisherPlatforms,
    instagram_positions: ['stream', 'story', 'reels'],
  }

  if (includeFacebook) {
    targeting.facebook_positions = ['feed', 'story', 'reels']
  }

  const params = new URLSearchParams({
    name: body.name,
    campaign_id: body.campaign_id,
    daily_budget: String(body.daily_budget_try * 100), // in cents
    billing_event: 'IMPRESSIONS',
    optimization_goal: body.optimization_goal || 'LINK_CLICKS',
    targeting: JSON.stringify(targeting),
    status: 'PAUSED',
    access_token: token,
  })

  const res = await fetch(url, { method: 'POST', body: params })
  const data = await res.json()

  if (data.error) return NextResponse.json({ error: data.error.message }, { status: 400 })
  return NextResponse.json({ success: true, adset_id: data.id })
}

async function createAd(body: any, token: string) {
  const base = `act_${AD_ACCOUNT}`

  // 1. Create creative
  const creativeUrl = `${GRAPH}/${base}/adcreatives`
  const creativeParams = new URLSearchParams({
    name: `${body.name} Creative`,
    object_story_spec: JSON.stringify({
      instagram_actor_id: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID,
      link_data: {
        image_url: body.image_url,
        link: body.link || process.env.NEXT_PUBLIC_SITE_URL,
        message: body.caption,
        call_to_action: { type: 'LEARN_MORE', value: { link: body.link || process.env.NEXT_PUBLIC_SITE_URL } },
      },
    }),
    access_token: token,
  })

  const creativeRes = await fetch(creativeUrl, { method: 'POST', body: creativeParams })
  const creative = await creativeRes.json()
  if (creative.error) return NextResponse.json({ error: creative.error.message }, { status: 400 })

  // 2. Create ad
  const adUrl = `${GRAPH}/${base}/ads`
  const adParams = new URLSearchParams({
    name: body.name,
    adset_id: body.adset_id,
    creative: JSON.stringify({ creative_id: creative.id }),
    status: 'PAUSED',
    access_token: token,
  })

  const adRes = await fetch(adUrl, { method: 'POST', body: adParams })
  const ad = await adRes.json()

  if (ad.error) return NextResponse.json({ error: ad.error.message }, { status: 400 })
  return NextResponse.json({ success: true, ad_id: ad.id, creative_id: creative.id })
}

async function toggleCampaign(body: any, token: string) {
  const url = `${GRAPH}/${body.campaign_id}`
  const params = new URLSearchParams({
    status: body.status, // ACTIVE or PAUSED
    access_token: token,
  })

  const res = await fetch(url, { method: 'POST', body: params })
  const data = await res.json()

  if (data.error) return NextResponse.json({ error: data.error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
