import { supabase } from '@/lib/supabase'
import InstagramClient from './InstagramClient'

export default async function AdminInstagramPage() {
  const { data } = await supabase
    .from('instagram_posts')
    .select('*')
    .order('created_at', { ascending: false })

  return <InstagramClient posts={data || []} />
}
