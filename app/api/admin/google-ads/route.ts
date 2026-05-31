import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const GOOGLE_ADS_API = 'https://googleads.googleapis.com/v16'

function getCustomerId() {
  // Dashes olmadan: "123-456-7890" → "1234567890"
  return (process.env.GOOGLE_ADS_CUSTOMER_ID || '').replace(/-/g, '')
}

async function getAccessToken(): Promise<string> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_ADS_CLIENT_ID || '',
      client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET || '',
      refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN || '',
      grant_type: 'refresh_token',
    }),
  })
  const data = await res.json()
  if (!data.access_token) throw new Error('Google OAuth2 token alınamadı: ' + JSON.stringify(data))
  return data.access_token
}

function getHeaders(accessToken: string) {
  return {
    Authorization: `Bearer ${accessToken}`,
    'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN || '',
    'Content-Type': 'application/json',
  }
}

async function authCheck() {
  try {
    const cookieStore = cookies()
    const session = cookieStore.get('admin_session')
    return session?.value === process.env.ADMIN_PASSWORD
  } catch {
    return false
  }
}

// ─── GET ─────────────────────────────────────────────────────────────────────
export async function GET(request: Request) {
  try {
    if (!(await authCheck())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'campaigns'
    const customerId = getCustomerId()

    if (!customerId || !process.env.GOOGLE_ADS_DEVELOPER_TOKEN) {
      return NextResponse.json({ error: 'Google Ads credentials not configured', configured: false }, { status: 200 })
    }

    const accessToken = await getAccessToken()
    const headers = getHeaders(accessToken)

    if (type === 'campaigns') {
      const query = `
        SELECT
          campaign.id,
          campaign.name,
          campaign.status,
          campaign.advertising_channel_type,
          campaign.bidding_strategy_type,
          campaign_budget.amount_micros,
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros,
          metrics.ctr,
          metrics.average_cpc,
          metrics.conversions
        FROM campaign
        WHERE campaign.status != 'REMOVED'
        ORDER BY campaign.id DESC
        LIMIT 50
      `
      const res = await fetch(`${GOOGLE_ADS_API}/customers/${customerId}/googleAds:searchStream`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query }),
      })
      const data = await res.json()
      if (data.error) return NextResponse.json({ error: data.error.message }, { status: 400 })
      // searchStream returns array of batches
      const rows = (data || []).flatMap((batch: any) => batch.results || [])
      return NextResponse.json({ campaigns: rows })
    }

    if (type === 'metrics') {
      const dateRange = searchParams.get('range') || 'LAST_30_DAYS'
      const query = `
        SELECT
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros,
          metrics.ctr,
          metrics.average_cpc,
          metrics.conversions,
          metrics.conversions_value
        FROM customer
        WHERE segments.date DURING ${dateRange}
      `
      const res = await fetch(`${GOOGLE_ADS_API}/customers/${customerId}/googleAds:searchStream`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query }),
      })
      const data = await res.json()
      if (data.error) return NextResponse.json({ error: data.error.message }, { status: 400 })
      const rows = (data || []).flatMap((batch: any) => batch.results || [])
      // Aggregate
      const totals = rows.reduce((acc: any, row: any) => {
        const m = row.metrics || {}
        acc.impressions += Number(m.impressions || 0)
        acc.clicks += Number(m.clicks || 0)
        acc.cost_micros += Number(m.cost_micros || 0)
        acc.conversions += Number(m.conversions || 0)
        return acc
      }, { impressions: 0, clicks: 0, cost_micros: 0, conversions: 0 })
      totals.cost_try = (totals.cost_micros / 1_000_000).toFixed(2)
      totals.ctr = totals.impressions > 0 ? ((totals.clicks / totals.impressions) * 100).toFixed(2) : '0'
      totals.avg_cpc = totals.clicks > 0 ? (totals.cost_micros / 1_000_000 / totals.clicks).toFixed(2) : '0'
      return NextResponse.json(totals)
    }

    return NextResponse.json({ error: 'Unknown type' }, { status: 400 })
  } catch (err: any) {
    console.error('[google-ads GET error]', err)
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 })
  }
}

// ─── POST ─────────────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
  if (!(await authCheck())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const customerId = getCustomerId()
  if (!customerId || !process.env.GOOGLE_ADS_DEVELOPER_TOKEN) {
    return NextResponse.json({ error: 'Google Ads credentials not configured' }, { status: 400 })
  }

  const body = await request.json()
  const { action } = body

  try {
    const accessToken = await getAccessToken()
    const headers = getHeaders(accessToken)

    if (action === 'create_campaign') {
      return await createCampaign(body, customerId, headers)
    }
    if (action === 'create_maps_campaign') {
      return await createMapsCampaign(body, customerId, headers)
    }
    if (action === 'toggle_campaign') {
      return await toggleCampaign(body, customerId, headers)
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (err: any) {
    console.error('[google-ads POST error]', err)
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 })
  }
}

async function createCampaign(body: any, customerId: string, headers: Record<string, string>) {
  const dailyBudgetMicros = body.daily_budget_try * 1_000_000 // TRY → micros

  // 1. Budget oluştur
  const budgetRes = await fetch(`${GOOGLE_ADS_API}/customers/${customerId}/campaignBudgets:mutate`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      operations: [{
        create: {
          name: `${body.name} Budget`,
          amountMicros: dailyBudgetMicros,
          deliveryMethod: 'STANDARD',
        },
      }],
    }),
  })
  const budgetData = await budgetRes.json()
  if (budgetData.partialFailureError) {
    return NextResponse.json({ error: budgetData.partialFailureError.message }, { status: 400 })
  }
  const budgetResourceName = budgetData.results?.[0]?.resourceName
  if (!budgetResourceName) {
    return NextResponse.json({ error: 'Budget oluşturulamadı: ' + JSON.stringify(budgetData) }, { status: 400 })
  }

  // 2. Kampanya oluştur
  const isSearch = body.campaign_type === 'SEARCH'
  const campaignPayload: Record<string, any> = {
    name: body.name,
    status: 'PAUSED',
    advertisingChannelType: body.campaign_type || 'SEARCH',
    campaignBudget: budgetResourceName,
    networkSettings: isSearch
      ? { targetGoogleSearch: true, targetSearchNetwork: true, targetContentNetwork: false }
      : { targetContentNetwork: true, targetGoogleSearch: false, targetSearchNetwork: false },
    geoTargetTypeSetting: {
      positiveGeoTargetType: 'PRESENCE_OR_INTEREST',
    },
  }

  // Bidding strategy
  if (isSearch) {
    campaignPayload.manualCpc = { enhancedCpcEnabled: true }
    campaignPayload.biddingStrategyType = 'MANUAL_CPC'
  } else {
    campaignPayload.targetCpa = { targetCpaMicros: body.target_cpa_try ? body.target_cpa_try * 1_000_000 : 50_000_000 }
  }

  const campRes = await fetch(`${GOOGLE_ADS_API}/customers/${customerId}/campaigns:mutate`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      operations: [{ create: campaignPayload }],
    }),
  })
  const campData = await campRes.json()
  if (campData.partialFailureError) {
    return NextResponse.json({ error: campData.partialFailureError.message }, { status: 400 })
  }
  const campaignResourceName = campData.results?.[0]?.resourceName
  if (!campaignResourceName) {
    return NextResponse.json({ error: 'Kampanya oluşturulamadı: ' + JSON.stringify(campData) }, { status: 400 })
  }

  // 3. Keywords (sadece Search)
  if (isSearch && body.keywords?.length > 0) {
    const adGroupRes = await fetch(`${GOOGLE_ADS_API}/customers/${customerId}/adGroups:mutate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        operations: [{
          create: {
            name: `${body.name} — Ana Grup`,
            campaign: campaignResourceName,
            status: 'ENABLED',
            type: 'SEARCH_STANDARD',
            cpcBidMicros: (body.cpc_bid_try || 5) * 1_000_000,
          },
        }],
      }),
    })
    const adGroupData = await adGroupRes.json()
    const adGroupName = adGroupData.results?.[0]?.resourceName

    if (adGroupName) {
      const kwOps = body.keywords.map((kw: string) => ({
        create: {
          adGroup: adGroupName,
          text: kw.trim(),
          matchType: 'BROAD',
          status: 'ENABLED',
        },
      }))
      await fetch(`${GOOGLE_ADS_API}/customers/${customerId}/adGroupCriteria:mutate`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ operations: kwOps }),
      })
    }
  }

  return NextResponse.json({ success: true, campaign_resource: campaignResourceName })
}

async function createMapsCampaign(body: any, customerId: string, headers: Record<string, string>) {
  const dailyBudgetMicros = (body.daily_budget_try || 200) * 1_000_000

  // 1. Budget
  const budgetRes = await fetch(`${GOOGLE_ADS_API}/customers/${customerId}/campaignBudgets:mutate`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      operations: [{
        create: {
          name: `${body.campaign_name} Budget`,
          amountMicros: dailyBudgetMicros,
          deliveryMethod: 'STANDARD',
        },
      }],
    }),
  })
  const budgetData = await budgetRes.json()
  if (budgetData.partialFailureError) {
    return NextResponse.json({ error: budgetData.partialFailureError.message }, { status: 400 })
  }
  const budgetResourceName = budgetData.results?.[0]?.resourceName
  if (!budgetResourceName) {
    return NextResponse.json({ error: 'Budget oluşturulamadı: ' + JSON.stringify(budgetData) }, { status: 400 })
  }

  // 2. LOCAL kampanya oluştur (Maps-Only = LOCAL channel type)
  const campaignPayload: Record<string, any> = {
    name: body.campaign_name,
    status: 'PAUSED',
    advertisingChannelType: 'LOCAL',
    campaignBudget: budgetResourceName,
    localCampaignSetting: {
      locationSourceType: 'GOOGLE_MY_BUSINESS',
    },
    optimizationGoalSetting: {
      optimizationGoalTypes: ['CALL_CLICKS', 'DRIVING_DIRECTIONS'],
    },
    targetingSetting: {
      targetRestrictions: [{
        targetingDimension: 'LOCATION',
        bidOnly: false,
      }],
    },
  }

  const campRes = await fetch(`${GOOGLE_ADS_API}/customers/${customerId}/campaigns:mutate`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ operations: [{ create: campaignPayload }] }),
  })
  const campData = await campRes.json()
  if (campData.partialFailureError) {
    return NextResponse.json({ error: campData.partialFailureError.message }, { status: 400 })
  }
  const campaignResourceName = campData.results?.[0]?.resourceName
  if (!campaignResourceName) {
    return NextResponse.json({ error: 'Kampanya oluşturulamadı: ' + JSON.stringify(campData) }, { status: 400 })
  }

  // 3. Ad group
  const adGroupRes = await fetch(`${GOOGLE_ADS_API}/customers/${customerId}/adGroups:mutate`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      operations: [{
        create: {
          name: `${body.campaign_name} — Maps Group`,
          campaign: campaignResourceName,
          status: 'ENABLED',
          type: 'LOCAL',
        },
      }],
    }),
  })
  const adGroupData = await adGroupRes.json()
  const adGroupResourceName = adGroupData.results?.[0]?.resourceName

  // 4. Local ad
  if (adGroupResourceName) {
    await fetch(`${GOOGLE_ADS_API}/customers/${customerId}/ads:mutate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        operations: [{
          create: {
            adGroup: adGroupResourceName,
            status: 'ENABLED',
            ad: {
              localAd: {
                headlines: [
                  { text: body.business_name },
                  { text: 'Paragliding Ölüdeniz' },
                  { text: 'Babadağ\'dan Uç — Rezervasyon Yap' },
                ],
                descriptions: [
                  { text: '25+ yıl deneyim · Sertifikalı pilot · Mavi Lagün üzerinde uç' },
                  { text: 'Ücretsiz transfer · Anında rezervasyon · En iyi fiyat garantisi' },
                ],
                callToActions: [{ text: 'Rezervasyon Yap' }],
              },
            },
          },
        }],
      }),
    })
  }

  const campaignId = campaignResourceName.split('/').pop()
  return NextResponse.json({ success: true, campaign_id: campaignId, campaign_resource: campaignResourceName })
}

async function toggleCampaign(body: any, customerId: string, headers: Record<string, string>) {
  const res = await fetch(`${GOOGLE_ADS_API}/customers/${customerId}/campaigns:mutate`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      operations: [{
        update: {
          resourceName: body.resource_name,
          status: body.status, // ENABLED veya PAUSED
        },
        updateMask: 'status',
      }],
    }),
  })
  const data = await res.json()
  if (data.partialFailureError) return NextResponse.json({ error: data.partialFailureError.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
