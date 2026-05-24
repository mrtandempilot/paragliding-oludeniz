import { createClient } from '@supabase/supabase-js'
import InstagramClient from './InstagramClient'
import InstagramSettings from '@/components/admin/InstagramSettings'
import TokenStatusWidget from './TokenStatusWidget'
import type { InstagramPost } from '@/lib/supabase'

export const metadata = {
  title: 'Instagram Yönetimi',
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export default async function InstagramPage() {
  const supabase = getSupabase()

  const { data: posts } = await supabase
    .from('instagram_posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  // Fetch location settings
  const { data: settingsRows } = await supabase
    .from('settings')
    .select('key,value')
    .in('key', ['ig_auto_post', 'ig_location_id', 'ig_rotate_locations'])

  const settings: Record<string, string> = {}
  for (const row of (settingsRows || [])) settings[row.key] = row.value

  return (
    <div className="space-y-8">
      {/* Token Status */}
      <TokenStatusWidget />

      {/* Post Manager */}
      <InstagramClient posts={(posts as InstagramPost[]) || []} />

      {/* Location Settings */}
      <div className="border-t border-slate-200 pt-8">
        <h2 className="text-lg font-bold text-slate-900 mb-1">Konum Ayarları</h2>
        <p className="text-sm text-slate-500 mb-5">
          Her auto-post'a otomatik olarak Ölüdeniz, Babadağ veya Fethiye konumu eklenir.
        </p>
        <div className="max-w-2xl">
          <InstagramSettings
            initialAutoPost={settings['ig_auto_post'] === 'true'}
            initialLocationId={settings['ig_location_id'] || '110580865639319'}
            initialRotate={settings['ig_rotate_locations'] !== 'false'}
          />
          <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-4">
            <p className="font-semibold text-amber-800 mb-1.5 text-sm">📌 Konum Neden Önemli?</p>
            <ul className="text-amber-700 text-sm space-y-1">
              <li>• Instagram'da "Ölüdeniz" konumunu gezenlerin önüne çıkıyorsun</li>
              <li>• Tatil planlayanlar seni konuma bakarak keşfedebilir</li>
              <li>• Konumları döndürerek 3 farklı kitleye ulaşırsın</li>
              <li>• Ücretsiz organik erişim = daha fazla müşteri</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
