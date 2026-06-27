import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Atmos Paragliding Blog — Tips, Guides & Latest News'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(160deg, #0c4a6e 0%, #0369a1 45%, #0ea5e9 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            padding: '60px 80px 40px',
            justifyContent: 'center',
          }}
        >
          <div style={{ display: 'flex', marginBottom: 28 }}>
            <div
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 8,
                padding: '8px 20px',
                color: 'white',
                fontSize: 18,
                letterSpacing: '0.06em',
              }}
            >
              BLOG & GUIDES
            </div>
          </div>

          <div
            style={{
              color: 'white',
              fontSize: 68,
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: 20,
            }}
          >
            Paragliding Tips,{'\n'}Guides & News
          </div>

          <div
            style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: 26,
            }}
          >
            Everything you need to know about flying in Ölüdeniz
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            padding: '18px 80px',
            borderTop: '1px solid rgba(255,255,255,0.2)',
            color: 'rgba(255,255,255,0.55)',
            fontSize: 18,
            justifyContent: 'space-between',
          }}
        >
          <span>Atmos Paragliding · atmosparagliding.com</span>
          <span>Ölüdeniz, Turkey</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
