import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Atmos Paragliding Tandem — Book Your Flight from Babadağ'
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
              MOST POPULAR
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
            Tandem Paragliding{'\n'}Ölüdeniz
          </div>

          <div
            style={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: 28,
              lineHeight: 1.4,
            }}
          >
            No experience needed. Fly with a certified pilot over the Blue Lagoon.
          </div>

          <div
            style={{
              display: 'flex',
              marginTop: 44,
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
              <span>25–50 min flight</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ color: '#f97316' }}>€</span>
              <span>From €80 per person</span>
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
          <span>Atmos Paragliding · atmosparagliding.com</span>
          <span>Babadağ Mountain, 1960m</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
