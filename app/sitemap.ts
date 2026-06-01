import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const BASE_URL = 'https://paragliding-oludeniz.com'

export const revalidate = 3600 // her saat güncelle

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // Helper to create a sitemap entry
  const page = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'monthly'
  ): MetadataRoute.Sitemap[number] => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  })

  // Statik sayfalar
  const staticPages: MetadataRoute.Sitemap = [
    // Core
    page('/', 1.0, 'weekly'),
    page('/book-now', 0.95, 'weekly'),
    page('/prices', 0.9, 'weekly'),
    page('/contact', 0.8, 'monthly'),
    page('/faq', 0.8, 'monthly'),
    page('/blog', 0.85, 'daily'),
    page('/reviews', 0.8, 'weekly'),
    page('/about-us', 0.7, 'monthly'),
    page('/safety-record', 0.75, 'monthly'),
    page('/certifications', 0.7, 'monthly'),
    page('/live-weather', 0.7, 'weekly'),
    page('/community', 0.6, 'monthly'),

    // Main landing pages
    page('/oludeniz-paragliding', 0.9, 'monthly'),
    page('/tandem-paragliding', 0.9, 'monthly'),
    page('/fethiye-paragliding', 0.85, 'monthly'),
    page('/blue-lagoon-paragliding', 0.85, 'monthly'),
    page('/butterfly-valley-paragliding', 0.85, 'monthly'),
    page('/turkey-paragliding', 0.8, 'monthly'),

    // Tandem paragliding sub-pages
    page('/tandem-paragliding/first-time', 0.8, 'monthly'),
    page('/tandem-paragliding/safety-guide', 0.8, 'monthly'),
    page('/tandem-paragliding/sunset-flight', 0.8, 'monthly'),
    page('/tandem-paragliding/group-flights', 0.75, 'monthly'),
    page('/tandem-paragliding/faq', 0.75, 'monthly'),

    // Babadag guide
    page('/babadag-guide', 0.85, 'monthly'),
    page('/babadag-guide/babadag-mountain', 0.8, 'monthly'),
    page('/babadag-guide/babadag-altitude-sickness', 0.75, 'monthly'),
    page('/babadag-guide/babadag-road-guide', 0.75, 'monthly'),
    page('/babadag-guide/babadag-teleferik', 0.75, 'monthly'),
    page('/babadag-guide/babadag-teleferik/qr-ticket-guide', 0.7, 'monthly'),
    page('/babadag-guide/takeoff-1200m', 0.75, 'monthly'),
    page('/babadag-guide/takeoff-1700m', 0.75, 'monthly'),
    page('/babadag-guide/takeoff-1800m', 0.75, 'monthly'),
    page('/babadag-guide/takeoff-1900m', 0.75, 'monthly'),
    page('/babadag-guide/landing-main-beach', 0.75, 'monthly'),
    page('/babadag-guide/landing-alternatives', 0.7, 'monthly'),
    page('/babadag-guide/landing-crosswind', 0.7, 'monthly'),
    page('/babadag-guide/landing-emergency', 0.7, 'monthly'),
    page('/babadag-guide/landing-light-wind', 0.7, 'monthly'),
    page('/babadag-guide/landing-south-wind', 0.7, 'monthly'),
    page('/babadag-guide/landing-strong-wind', 0.7, 'monthly'),

    // Redirect legacy URLs (still exist as pages)
    page('/babadag-road-guide', 0.5, 'monthly'),
    page('/babadag-teleferik', 0.5, 'monthly'),

    // Weather guide
    page('/weather-guide', 0.8, 'monthly'),
    page('/weather-guide/best-months', 0.75, 'monthly'),
    page('/weather-guide/cloudbase', 0.7, 'monthly'),
    page('/weather-guide/summer-thermals', 0.7, 'monthly'),
    page('/weather-guide/wind-directions', 0.7, 'monthly'),
    page('/weather-guide/winter-flying', 0.7, 'monthly'),

    // Thermals guide
    page('/thermals-guide', 0.75, 'monthly'),
    page('/thermals-guide/reading-thermals', 0.7, 'monthly'),
    page('/thermals-guide/cloudbase-guide', 0.7, 'monthly'),
    page('/thermals-guide/thermal-triggers', 0.7, 'monthly'),
    page('/thermals-guide/thermal-safety', 0.7, 'monthly'),

    // Training
    page('/training', 0.8, 'monthly'),
    page('/training/beginner-courses', 0.75, 'monthly'),
    page('/training/advanced-courses', 0.75, 'monthly'),
    page('/training/siv-clinic', 0.75, 'monthly'),
    page('/training/tandem-conversion', 0.75, 'monthly'),
    page('/training/instructor-info', 0.7, 'monthly'),
    page('/training/licence-recognition', 0.7, 'monthly'),

    // Solo paragliding
    page('/solo-paragliding', 0.8, 'monthly'),
    page('/solo-paragliding/flight-rules', 0.75, 'monthly'),
    page('/solo-paragliding/equipment-requirements', 0.75, 'monthly'),
    page('/solo-paragliding/insurance-permissions', 0.7, 'monthly'),

    // Acro flights
    page('/acro-flights', 0.75, 'monthly'),
    page('/acro-flights/pilots', 0.7, 'monthly'),
    page('/acro-flights/safety', 0.7, 'monthly'),
    page('/acro-flights/events', 0.7, 'monthly'),
    page('/acro-flights/meeting-points', 0.65, 'monthly'),

    // Cross-country flights
    page('/cross-country-flights', 0.75, 'monthly'),
    page('/cross-country-flights/routes', 0.7, 'monthly'),
    page('/cross-country-flights/thermal-maps', 0.7, 'monthly'),
    page('/cross-country-flights/landing-zones', 0.7, 'monthly'),
    page('/cross-country-flights/seasons', 0.7, 'monthly'),
    page('/cross-country-flights/community', 0.65, 'monthly'),

    // Paramotor
    page('/paramotor', 0.75, 'monthly'),
    page('/paramotor/training', 0.7, 'monthly'),
    page('/paramotor/equipment', 0.7, 'monthly'),
    page('/paramotor/launch-sites', 0.7, 'monthly'),
    page('/paramotor/rules', 0.65, 'monthly'),

    // Base jump
    page('/base-jump', 0.7, 'monthly'),
    page('/base-jump/exit-points', 0.65, 'monthly'),
    page('/base-jump/permissions', 0.65, 'monthly'),
    page('/base-jump/community', 0.6, 'monthly'),

    // Pilot services
    page('/pilot-services', 0.75, 'monthly'),
    page('/pilot-services/equipment-rental', 0.7, 'monthly'),
    page('/pilot-services/storage', 0.7, 'monthly'),
    page('/pilot-services/retrieval', 0.7, 'monthly'),
    page('/pilot-services/radio-hire', 0.65, 'monthly'),
    page('/pilot-services/photography', 0.65, 'monthly'),
    page('/pilot-services/gopro-video', 0.65, 'monthly'),
    page('/pilot-services/meteorology', 0.65, 'monthly'),

    // Groups
    page('/groups', 0.75, 'monthly'),
    page('/groups/corporate', 0.7, 'monthly'),
    page('/groups/hen-stag', 0.7, 'monthly'),
    page('/groups/schools', 0.7, 'monthly'),
    page('/groups/tour-operators', 0.65, 'monthly'),

    // Transfers
    page('/transfers', 0.75, 'monthly'),
    page('/transfers/to-babadag', 0.7, 'monthly'),
    page('/transfers/dalaman-airport', 0.7, 'monthly'),
    page('/transfers/from-fethiye', 0.7, 'monthly'),
    page('/transfers/from-marmaris', 0.65, 'monthly'),
    page('/transfers/private-transfer', 0.65, 'monthly'),
  ]

  // Supabase'den tüm published makaleleri çek
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data: articles } = await supabase
      .from('articles')
      .select('slug, updated_at, created_at')
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    const articlePages: MetadataRoute.Sitemap = (articles || []).map(article => ({
      url: `${BASE_URL}/blog/${article.slug}`,
      lastModified: new Date(article.updated_at || article.created_at),
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    }))

    return [...staticPages, ...articlePages]
  } catch {
    // Supabase hata verirse sadece statik sayfaları döndür
    return staticPages
  }
}
