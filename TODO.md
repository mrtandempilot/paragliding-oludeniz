# TODO

## Voice Asistan — Neslihan Hanım
- [ ] Ceyhun: OpenAI API anahtarı oluştur → Vercel'e `OPENAI_API_KEY` olarak ekle
- [ ] Canlıda ilk sesli test (telefon + bilgisayar), Türkçe ses kalitesini kontrol et; gerekirse `NESLIHAN_VOICE` değiştir
- [ ] Faz 2 — Danışman:
  - [ ] "Neden rezervasyon gelmedi?" analizi (GA4 sayfa yolu/hunisi + Google Ads arama terimleri)
  - [ ] Rakip analizi (SERP_API_KEY ile sıralamalar; fiyat/yorum karşılaştırması)
  - [ ] Derin analizi Claude'a devret (arka plan), sonucu sesli özetle + ekranda göster
  - [ ] Hafıza: notlar, hatırlatmalar, önceki öneriler (Supabase tablo)
  - [ ] Sabah brifingi
- [ ] Faz 3 — İşlemler (her biri "Onaylıyor musunuz?" ile): rezervasyon onayla, uçuldu işaretle, WhatsApp gönder
- [ ] Maliyet takibi: Realtime kullanımını `usage_logs`'a yaz
