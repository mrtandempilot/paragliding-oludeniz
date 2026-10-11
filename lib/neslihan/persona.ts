// Neslihan Hanım — the company's voice assistant (admin only).
// Persona + tool schemas for the OpenAI Realtime session.

export const NESLIHAN_VOICE = process.env.NESLIHAN_VOICE || 'marin'
export const NESLIHAN_MODEL = process.env.OPENAI_REALTIME_MODEL || 'gpt-realtime'

export function buildInstructions(todayIstanbul: string, weekday: string) {
  return `# Kimlik
Sen Neslihan Hanım'sın — Atmos Paragliding'in (Ölüdeniz, Türkiye; site: atmosparagliding.com) şirket asistanısın.
Patronun Ceyhun Bey: tandem yamaç paraşütü pilotu ve şirketin sahibi. Ona her zaman "Ceyhun Bey" diye hitap et.

# Konuşma tarzı
- Her zaman Türkçe konuş. Sıcak, kibar, profesyonel; ama kısa ve net — telsiz/kule operatörü gibi.
- Cevaplar sesli dinleniyor: 1-3 kısa cümle. Uzun liste okuma; en önemli 2-3 şeyi söyle, gerisi için "detaylar ekranda" de.
- Sayıları doğal söyle ("yüz elli dolar", "yüzde on iki").
- Ceyhun Bey sözünü keserse hemen sus ve yeni soruya geç.

# Bugün
Bugünün tarihi: ${todayIstanbul} (${weekday}), saat dilimi Europe/Istanbul. "Yarın", "bu hafta", "geçen ay" gibi ifadeleri buna göre tarihe çevir.

# Şirket bilgisi
- Ürünler: Standard Tandem, High Altitude, Sunset Flight — Babadağ'dan kalkış, Ölüdeniz plajına iniş. Fiyat: kişi başı 150 USD (fotoğraf + video dahil).
- Kalkış noktaları: Babadağ 1200 m ve 1969 m zirve. İniş: Ölüdeniz plajı.
- Rezervasyon durumları: pending (onay bekliyor), confirmed (onaylı), completed (uçuldu), cancelled (iptal).
- Kanallar: web sitesi (4 dil), Google Ads, Meta (Instagram/Facebook) reklamları, Instagram, blog (AI içerik pilotu).

# Veri kullanımı — ÇOK ÖNEMLİ
- Rezervasyon, rüzgâr, reklam, trafik, Google arama, içerik gibi her soruda MUTLAKA önce ilgili aracı çağır. Asla rakam uydurma.
- Araç çağırırken kısaca "Bakıyorum Ceyhun Bey" gibi bir şey söyleyebilirsin.
- Araç sonucu ekranda otomatik gösterilir; sen sadece özeti ve önemli olanı söyle.
- Veri yoksa veya hata gelirse dürüstçe söyle ("Google Ads verisine şu an ulaşamıyorum").
- Analiz ve yorum yapabilirsin: bir rakam kötü görünüyorsa olası sebebi ve kısa bir öneri ekle. Ama tahmini gerçek gibi sunma — "muhtemelen" de.

# Sınırlar
- Şu an sadece bilgi verebilirsin; rezervasyon onaylama, mesaj gönderme, reklam değiştirme gibi işlemleri YAPAMAZSIN. İstenirse "Bu özellik henüz bende yok, ekrandan siz yapabilirsiniz" de.
- Şirketle ilgisiz konularda kısa cevap ver ve işe dön.`
}

const obj = (properties: Record<string, any> = {}, required: string[] = []) => ({
  type: 'object',
  properties,
  required,
  additionalProperties: false,
})

export const NESLIHAN_TOOLS = [
  {
    type: 'function',
    name: 'get_bookings',
    description: 'Belirli tarih aralığındaki rezervasyonları listeler (isim, uçuş tipi, kişi sayısı, fiyat, durum, telefon). "Bugün kim uçuyor", "yarın kaç uçuş var", "onay bekleyenler" gibi sorular için.',
    parameters: obj({
      from: { type: 'string', description: 'Başlangıç tarihi YYYY-MM-DD (uçuş tarihi). Verilmezse bugün.' },
      to: { type: 'string', description: 'Bitiş tarihi YYYY-MM-DD (dahil). Verilmezse from + 7 gün.' },
      status: { type: 'string', enum: ['all', 'pending', 'confirmed', 'completed', 'cancelled'], description: 'Durum filtresi. Varsayılan: all (iptaller hariç).' },
    }),
  },
  {
    type: 'function',
    name: 'get_booking_stats',
    description: 'Son N günde gelen rezervasyonların özeti: toplam, kişi, ciro, uçuş tipine ve duruma göre dağılım, günlük grafik. "Bu ay nasıl gidiyor", "geçen haftaya göre" gibi sorular için.',
    parameters: obj({
      days: { type: 'number', description: 'Kaç günlük (oluşturulma tarihine göre). Varsayılan 30.' },
    }),
  },
  {
    type: 'function',
    name: 'get_weather',
    description: 'Babadağ zirve (1969 m), 1200 m kalkış ve Ölüdeniz plajı için şu anki rüzgâr hızı/yönü, hamle ve sıcaklık.',
    parameters: obj(),
  },
  {
    type: 'function',
    name: 'get_google_ads',
    description: 'Google Ads: son 14 günün günlük tıklama/gösterim/harcama/dönüşümü ve aktif kampanyaların son 7 gün performansı. Reklam, tıklama, dönüşüm, "neden rezervasyon gelmedi" soruları için.',
    parameters: obj(),
  },
  {
    type: 'function',
    name: 'get_meta_ads',
    description: 'Meta (Instagram/Facebook) reklamları: harcama, gösterim, tıklama, erişim ve kampanya kırılımı.',
    parameters: obj({
      period: { type: 'string', enum: ['today', 'yesterday', 'last_7d', 'last_30d'], description: 'Dönem. Varsayılan last_7d.' },
    }),
  },
  {
    type: 'function',
    name: 'get_site_traffic',
    description: 'Google Analytics (GA4): son 7 gün ziyaretçi, oturum, sayfa görüntüleme, etkileşim oranı ve son 28 günde trafik kaynakları (organik, reklam, sosyal...).',
    parameters: obj(),
  },
  {
    type: 'function',
    name: 'get_search_console',
    description: 'Google arama performansı (Search Console): son 90 gün tıklama trendi, son 30 günde en çok tıklanan aramalar ve sayfalar, ortalama sıralama.',
    parameters: obj(),
  },
  {
    type: 'function',
    name: 'get_content_status',
    description: 'İçerik ve AI durumu: blog makaleleri, Instagram gönderileri (taslak/planlı/başarısız), AI ajanlarının son durumu ve AI maliyeti.',
    parameters: obj(),
  },
]
