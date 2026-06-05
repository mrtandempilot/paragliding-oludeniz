/**
 * Bu script app/ klasöründeki gerekli dosyaları oluşturur.
 * Çalıştırmak için: node setup-app-files.js
 */

const fs = require('fs')
const path = require('path')

const files = {
  // ─── ROOT LAYOUT ────────────────────────────────────────────────
  'app/layout.tsx': `import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://paragliding-oludeniz.com'),
  title: {
    default: 'Paragliding Oludeniz | Tandem Flights from Babadağ',
    template: '%s | Paragliding Oludeniz',
  },
  description:
    'Book tandem paragliding flights in Oludeniz, Turkey. Launch from Babadağ at 1960m and soar over the Blue Lagoon. Certified pilots, 25+ years experience.',
  keywords: [
    'paragliding oludeniz',
    'tandem paragliding oludeniz',
    'paragliding fethiye',
    'babadag paragliding',
    'oludeniz paragliding booking',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://paragliding-oludeniz.com',
    siteName: 'Paragliding Oludeniz',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Tandem Paragliding Oludeniz' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Paragliding Oludeniz | Tandem Flights from Babadağ',
    description: 'Soar over the Blue Lagoon. Book your tandem paragliding flight today.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
`,

  // ─── HOMEPAGE ───────────────────────────────────────────────────
  'app/page.tsx': `import Hero from '@/components/home/Hero'
import WhyOludeniz from '@/components/home/WhyOludeniz'
import FlightTypesGrid from '@/components/home/FlightTypesGrid'
import BabadagIntro from '@/components/home/BabadagIntro'
import ReviewsSection from '@/components/home/ReviewsSection'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <WhyOludeniz />
      <FlightTypesGrid />
      <BabadagIntro />
      <ReviewsSection />
    </main>
  )
}
`,

  // ─── ADMIN LAYOUT ───────────────────────────────────────────────
  'app/admin/layout.tsx': `import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}
`,

  // ─── ADMIN DASHBOARD PAGE ───────────────────────────────────────
  'app/admin/page.tsx': `import { CalendarCheck, Users, Star, TrendingUp } from 'lucide-react'

const stats = [
  { label: 'Bu Ay Rezervasyon', value: '—', icon: CalendarCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Toplam Misafir', value: '—', icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Ortalama Puan', value: '4.9', icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { label: 'Bu Hafta Gelir', value: '—', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
]

export default function AdminDashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Merhaba Ceyhun 👋</h1>
        <p className="text-slate-500 mt-1">İşte bugünün özeti</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className={\`w-10 h-10 \${stat.bg} rounded-xl flex items-center justify-center mb-3\`}>
                <Icon className={\`w-5 h-5 \${stat.color}\`} />
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-slate-500 text-sm mt-1">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="font-bold text-slate-900 mb-4">Hızlı Erişim</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a href="/admin/bookings" className="p-4 bg-slate-50 rounded-xl hover:bg-orange-50 transition-colors text-sm font-medium text-slate-700 hover:text-orange-600">
            📋 Rezervasyonları Görüntüle
          </a>
          <a href="/admin/instagram" className="p-4 bg-slate-50 rounded-xl hover:bg-purple-50 transition-colors text-sm font-medium text-slate-700 hover:text-purple-600">
            📸 Instagram Ayarları
          </a>
          <a href="/admin/photos" className="p-4 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors text-sm font-medium text-slate-700 hover:text-blue-600">
            🖼️ Fotoğraf Yönetimi
          </a>
        </div>
      </div>
    </div>
  )
}
`,

  // ─── DM AUTOMATION PAGE ─────────────────────────────────────────
  'app/admin/dm-automation/page.tsx': `import DmAutomation from '@/components/admin/DmAutomation'

export const metadata = {
  title: 'DM Automation',
}

export default function DmAutomationPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Otomatik DM Ayarları</h1>
        <p className="text-slate-500 mt-1">
          Biri yoruma yazdığında otomatik DM gönder — fiyat soranlar anında bilgi alsın.
        </p>
      </div>
      <div className="max-w-2xl">
        <DmAutomation />
      </div>
    </div>
  )
}
`,

  // ─── INSTAGRAM WEBHOOK ───────────────────────────────────────────
  'app/api/instagram/webhook/route.ts': `import { NextRequest, NextResponse } from 'next/server'

const VERIFY_TOKEN = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN || 'oludeniz_paragliding_2024'

// Anahtar kelimeler — admin panelinden gelecek, şimdilik sabit
const KEYWORD_TRIGGERS = ['fiyat', 'price', 'rezervasyon', 'booking', 'cost', 'how much', 'ne kadar', 'info', 'bilgi']

const KEYWORD_DM = \`Merhaba! Fiyat ve rezervasyon bilgisi icin:

Tandem ucus - 85 EUR
Sunset (gun batimi) ucus - 120 EUR
Grup indirimi (4+ kisi) - %15 indirim

Online rezervasyon: paragliding-oludeniz.com/book-now

Baska sorularin olursa buradayim!\`

const GENERAL_DM = \`Merhaba! Yorumun icin cok tesekkurler!

Oludeniz'den Babadag'a ucmak istersen sana yardimci olmaktan mutluluk duyarim.

Rezervasyon: paragliding-oludeniz.com/book-now\`

// Instagram webhook doğrulama (GET)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 })
  }
  return new NextResponse('Forbidden', { status: 403 })
}

// Instagram webhook olayları (POST)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        if (change.field === 'comments') {
          const comment = change.value
          const commentText: string = (comment.text || '').toLowerCase()
          const commenterId: string = comment.from?.id

          if (!commenterId) continue

          const hasKeyword = KEYWORD_TRIGGERS.some((kw) => commentText.includes(kw))
          const messageToSend = hasKeyword ? KEYWORD_DM : GENERAL_DM

          // DM gönder
          await sendInstagramDM(commenterId, messageToSend)
        }
      }
    }

    return NextResponse.json({ status: 'ok' })
  } catch (err) {
    console.error('Webhook hatası:', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

async function sendInstagramDM(recipientId: string, message: string) {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
  const igUserId = process.env.INSTAGRAM_USER_ID

  if (!accessToken || !igUserId) {
    console.error('Instagram API bilgileri eksik (.env dosyasını kontrol et)')
    return
  }

  const res = await fetch(
    \`https://graph.facebook.com/v19.0/\${igUserId}/messages\`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text: message },
        access_token: accessToken,
      }),
    }
  )

  if (!res.ok) {
    const err = await res.json()
    console.error('DM gönderilemedi:', err)
  }
}
`,

  // ─── INSTAGRAM SETTINGS PAGE ────────────────────────────────────
  'app/admin/instagram/page.tsx': `import InstagramSettings from '@/components/admin/InstagramSettings'
import { Instagram } from 'lucide-react'

export const metadata = {
  title: 'Instagram Ayarları',
}

export default function InstagramPage() {
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Instagram className="w-6 h-6 text-purple-500" />
          <h1 className="text-2xl font-bold text-slate-900">Instagram Ayarları</h1>
        </div>
        <p className="text-slate-500">
          Otomatik post ve konum etiketlerini buradan yönet.
          Her post'a otomatik olarak Ölüdeniz, Babadağ veya Fethiye konumu eklenir.
        </p>
      </div>

      <div className="max-w-2xl">
        <InstagramSettings
          initialAutoPost={false}
          initialLocationId="110580865639319"
          initialRotate={true}
        />

        {/* Info Box */}
        <div className="mt-6 bg-amber-50 border border-amber-100 rounded-xl p-5">
          <p className="font-semibold text-amber-800 mb-2">📌 Konum Neden Önemli?</p>
          <ul className="text-amber-700 text-sm space-y-1.5">
            <li>• Instagram'da "Ölüdeniz" konumunu gezenlerin önüne çıkıyorsun</li>
            <li>• Tatil planlayanlar seni konuma bakarak keşfedebilir</li>
            <li>• Konumları döndürerek 3 farklı kitleye ulaşırsın</li>
            <li>• Ücretsiz organik erişim = daha fazla müşteri</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
`,
}

// Dosyaları oluştur
let created = 0
for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filePath)
  const dir = path.dirname(fullPath)

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  fs.writeFileSync(fullPath, content, 'utf-8')
  console.log('✅ Oluşturuldu:', filePath)
  created++
}

console.log('\n🚀 ' + created + ' dosya başarıyla oluşturuldu!')
console.log('Simdi: npm run dev')
