import { supabase } from '@/lib/supabase'
import BlogClient from './BlogClient'

export default async function AdminBlogPage() {
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })

  return <BlogClient posts={data || []} />
}
