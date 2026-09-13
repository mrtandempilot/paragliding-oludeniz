import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// One-off internal helper used to fix low-CTR blog titles/meta descriptions
// found via Search Console analysis. Not linked from anywhere in the UI.
export async function PATCH(request: Request) {
  const { slug, title, meta_description } = await request.json()
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 })

  const update: Record<string, string> = {}
  if (title) update.title = title
  if (meta_description) update.meta_description = meta_description

  const { data, error } = await supabase
    .from('articles')
    .update(update)
    .eq('slug', slug)
    .select('slug, title, meta_description')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data })
}
