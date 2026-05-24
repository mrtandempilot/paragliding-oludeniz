import { NextRequest, NextResponse } from 'next/server'

const VERIFY_TOKEN = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN || 'oludeniz_paragliding_2024'

// Anahtar kelimeler — admin panelinden gelecek, şimdilik sabit
const KEYWORD_TRIGGERS = ['fiyat', 'price', 'rezervasyon', 'booking', 'cost', 'how much', 'ne kadar', 'info', 'bilgi']

const KEYWORD_DM = `Merhaba! Fiyat ve rezervasyon bilgisi icin:

Tandem ucus - 85 EUR
Sunset (gun batimi) ucus - 120 EUR
Grup indirimi (4+ kisi) - %15 indirim

Online rezervasyon: paragliding-oludeniz.com/book-now

Baska sorularin olursa buradayim!`

const GENERAL_DM = `Merhaba! Yorumun icin cok tesekkurler!

Oludeniz'den Babadag'a ucmak istersen sana yardimci olmaktan mutluluk duyarim.

Rezervasyon: paragliding-oludeniz.com/book-now`

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
    `https://graph.facebook.com/v19.0/${igUserId}/messages`,
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
