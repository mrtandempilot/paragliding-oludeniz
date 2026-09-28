import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Solo Paragliding in Ölüdeniz — Atmos Paragliding'
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
            padding: '70px 80px',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              fontSize: 30,
              fontWeight: 700,
              marginBottom: 24,
              color: 'rgba(255,255,255,0.75)',
              letterSpacing: '0.04em',
            }}
          >
            <span style={{ color: '#f97316' }}>Atmos</span>
            <span style={{ marginLeft: 10 }}>Paragliding</span>
          </div>

          <div
            style={{
              color: 'white',
              fontSize: 58,
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: 24,
              maxWidth: 1000,
            }}
          >
            Solo Paragliding in Ölüdeniz
          </div>

          <div
            style={{
              color: 'rgba(255,255,255,0.88)',
              fontSize: 28,
              lineHeight: 1.4,
              maxWidth: 900,
            }}
          >
            Flight rules, equipment & insurance for licensed pilots
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
          <span>atmosparagliding.com</span>
          <span>Babadağ Mountain, 1960m</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
