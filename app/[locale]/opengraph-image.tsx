import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Atmos Paragliding — Tandem Flights from Babadağ Mountain over the Blue Lagoon'
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
              fontSize: 56,
              fontWeight: 800,
              marginBottom: 22,
            }}
          >
            <span style={{ color: '#f97316' }}>Atmos</span>
            <span style={{ color: 'white', marginLeft: 16 }}>Paragliding</span>
          </div>

          <div
            style={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: 32,
              lineHeight: 1.4,
              maxWidth: 900,
              marginBottom: 40,
            }}
          >
            Tandem flights from Babadağ Mountain over Ölüdeniz&apos;s Blue Lagoon
          </div>

          <div
            style={{
              display: 'flex',
              gap: 40,
              color: 'rgba(255,255,255,0.9)',
              fontSize: 22,
            }}
          >
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ color: '#fbbf24' }}>★</span>
              <span>2,400+ Reviews</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ color: '#86efac' }}>✓</span>
              <span>Certified Pilots</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ color: '#86efac' }}>✓</span>
              <span>25+ Years Experience</span>
            </div>
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
