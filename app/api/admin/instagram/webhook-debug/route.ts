import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // 1. Check which key is being used
  const usingServiceRole = !!process.env.SUPABASE_SERVICE_ROLE_KEY

  // 2. Check if settings are readable
  const { data: settings, error: settingsError } = await supabase
    .from('settings')
    .select('key, value')
    .in('key', ['ig_dm_enabled', 'ig_dm_trigger_words', 'ig_dm_message'])

  // 3. Check if dm_log is writable
  const { error: insertError } = await supabase
    .from('instagram_dm_log')
    .insert({
      trigger_type: 'comment',
      comment_id: 'debug-test',
      comment_text: 'debug',
      sender_username: 'debug',
      dm_sent: 'debug test',
    })

  // 4. Check verify token
  const verifyToken = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN
  const igToken = !!process.env.INSTAGRAM_ACCESS_TOKEN
  const igAccountId = process.env.INSTAGRAM_ACCOUNT_ID || process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID

  return NextResponse.json({
    usingServiceRole,
    verifyTokenSet: !!verifyToken,
    igTokenSet: igToken,
    igAccountId,
    settings: settings || [],
    settingsError: settingsError?.message || null,
    dmLogInsertError: insertError?.message || null,
    dmLogInsertOk: !insertError,
  })
}
