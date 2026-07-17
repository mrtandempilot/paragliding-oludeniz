import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Atmos Paragliding Prices 2026 — Transparent Pricing from $160'
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
            flex: 1,
            padding: '60px 80px 40px',
            gap: 80,
            alignItems: 'center',
          }}
        >
          {/* Left: title */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ display: 'flex', marginBottom: 24 }}>
              <div
                style={{
                  background: '#f97316',
                  borderRadius: 8,
                  padding: '8px 20px',
                  color: 'white',
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                2026 PRICES
              </div>
            </div>
            <div
              style={{
                color: 'white',
                fontSize: 60,
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: 16,
              }}
            >
              Paragliding{'\n'}Prices Ölüdeniz
            </div>
            <div
              style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: 24,
              }}
            >
              Transparent pricing. No hidden fees.
            </div>
          </div>

          {/* Right: price cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 280 }}>
            {[
              { label: 'Standard (1200m)', price: '$160', note: '25–35 min' },
              { label: 'High Altitude (1700m)', price: '$160', note: '35–50 min', highlight: true },
              { label: 'Sunset Flight', price: '$160', note: '20–30 min' },
            ].map((pkg) => (
              <div
                key={pkg.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: pkg.highlight ? 'rgba(249,115,22,0.25)' : 'rgba(255,255,255,0.1)',
                  border: pkg.highlight ? '1px solid rgba(249,115,22,0.6)' : '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 12,
                  padding: '14px 20px',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', color: 'white' }}>
                  <span style={{ fontSize: 16, fontWeight: 600 }}>{pkg.label}</span>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{pkg.note}</span>
                </div>
                <span style={{ color: '#fb923c', fontSize: 28, fontWeight: 800 }}>{pkg.price}</span>
              </div>
            ))}
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
          <span>Free cancellation up to 24h</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
