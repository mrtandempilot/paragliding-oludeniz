import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Bypass Next.js's persistent Data Cache for Supabase reads — content is edited
// via the admin panel / AI agents outside of a deploy, so it must never be served stale.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }),
  },
})

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'
export type InstagramStatus = 'draft' | 'scheduled' | 'posted' | 'failed'

export interface Reservation {
  id: string
  created_at: string
  name: string
  email: string
  phone?: string
  date: string
  flight_type: string
  passengers: number
  weight_kg?: number
  message?: string
  status: ReservationStatus
  notes?: string
  source?: string
}

export interface BlogPostDB {
  id: string
  created_at: string
  updated_at: string
  slug: string
  title: string
  description?: string
  content?: string
  category?: string
  read_time?: string
  image?: string
  published: boolean
  published_at?: string
  author?: string
  seo_title?: string
  seo_description?: string
}

export interface InstagramPost {
  id: string
  created_at: string
  image_url: string
  caption: string
  hashtags?: string
  status: InstagramStatus
  scheduled_at?: string
  posted_at?: string
  instagram_id?: string
  linked_blog_post_id?: string
  notes?: string
}
