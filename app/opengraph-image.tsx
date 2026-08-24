import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Atmos Paragliding — Tandem Flights from Babadağ Mountain'
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
        {/* Top content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            padding: '60px 80px 40px',
            justifyContent: 'center',
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'flex',
              marginBottom: 28,
            }}
          >
            <div
              style={{
                background: '#f97316',
                borderRadius: 8,
                padding: '8px 20px',
                color: 'white',
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: '0.08em',
              }}
            >
              ATMOS PARAGLIDING
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              color: 'white',
              fontSize: 68,
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: 20,
            }}
          >
            Tandem Paragliding{'\n'}in Ölüdeniz
          </div>

          {/* Subtitle */}
          <div
            style={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: 28,
              lineHeight: 1.4,
            }}
          >
            Fly over the Blue Lagoon from Babadağ Mountain
          </div>

          {/* Stats row */}
          <div
            style={{
              display: 'flex',
              marginTop: 44,
              gap: 40,
              color: 'rgba(255,255,255,0.9)',
              fontSize: 22,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#fbbf24' }}>★</span>
              <span>4.9 / 5 Rating</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#86efac' }}>✓</span>
              <span>25+ Years Experience</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#86efac' }}>✓</span>
              <span>From €100</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            padding: '18px 80px',
            borderTop: '1px solid rgba(255,255,255,0.2)',
            color: 'rgba(255,255,255,0.55)',
            fontSize: 18,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>atmosparagliding.com</span>
          <span>Ölüdeniz, Turkey</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
