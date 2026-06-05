import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

interface Props {
  params: { slug: string }
}

export default async function Image({ params }: Props) {
  let title = 'Paragliding Ölüdeniz — Blog'
  let heroImage: string | null = null

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data } = await supabase
      .from('articles')
      .select('title, hero_image_url')
      .eq('slug', params.slug)
      .single()

    if (data) {
      title = data.title
      heroImage = data.hero_image_url
    }
  } catch {
    // fallback to default
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          background: '#0c4a6e',
        }}
      >
        {/* Background hero image if available */}
        {heroImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroImage}
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}

        {/* Dark overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: heroImage
              ? 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.2) 100%)'
              : 'linear-gradient(160deg, #0c4a6e 0%, #0369a1 45%, #0ea5e9 100%)',
            display: 'flex',
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '40px 80px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Category badge */}
          <div
            style={{
              display: 'flex',
              marginBottom: 16,
            }}
          >
            <div
              style={{
                background: '#f97316',
                borderRadius: 6,
                padding: '6px 16px',
                color: 'white',
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: '0.06em',
              }}
            >
              GUIDE
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              color: 'white',
              fontSize: title.length > 60 ? 42 : 52,
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: 20,
              maxWidth: 900,
            }}
          >
            {title}
          </div>

          {/* Footer */}
          <div
            style={{
              color: 'rgba(255,255,255,0.65)',
              fontSize: 18,
              display: 'flex',
              alignItems: 'center',
              gap: 20,
            }}
          >
            <span>Atmos Paragliding</span>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>·</span>
            <span>paragliding-oludeniz.com</span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
