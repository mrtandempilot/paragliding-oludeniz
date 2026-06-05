import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Boş string'leri null'a çevir (UUID alanlar için)
function cleanData(data: Record<string, any>) {
  const cleaned: Record<string, any> = {}
  for (const [key, val] of Object.entries(data)) {
    cleaned[key] = val === '' ? null : val
  }
  return cleaned
}

export async function POST(request: Request) {
  const data = await request.json()
  const { error, data: post } = await supabase
    .from('instagram_posts')
    .insert(cleanData(data))
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(post)
}

export async function PATCH(request: Request) {
  const { id, ...data } = await request.json()
  const { error } = await supabase.from('instagram_posts').update(cleanData(data)).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  const { error } = await supabase.from('instagram_posts').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
