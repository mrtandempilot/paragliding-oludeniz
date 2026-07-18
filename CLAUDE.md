# Paragliding Ölüdeniz — Claude Proje Rehberi

> Bu dosya her yeni Claude oturumunda otomatik yüklenir. Buradaki bilgiler her zaman güncel tutulmalıdır.

## Proje Sahibi
- **Ad:** Ceyhun (tandem paragliding pilotu, Ölüdeniz/Türkiye)
- **Email:** mrtandempilot@gmail.com
- **Not:** Ceyhun geliştirici değil. Teknik açıklamaları sade tut, sonuca odaklan.

## Site
- **Domain:** https://paragliding-oludeniz.com
- **Amaç:** Ölüdeniz'de tandem paragliding rezervasyonu + Google'da #1 sıralama (SEO her şeyin önünde)
- **Repo:** https://github.com/mrtandempilot/paragliding-oludeniz

## Tech Stack
- **Framework:** Next.js 14 (App Router), TypeScript
- **Stil:** Tailwind CSS + tailwind-merge + clsx
- **Veritabanı:** Supabase (proje: `phmarcrjoymefocdieix`)
- **AI:** Anthropic SDK (Claude agents)
- **Deploy:** Vercel (proje: `prj_4ovKvvn2QFdQ6deLVQ6bFsfBkgBo`, team: `team_c0QmEtE8TyXeWf3gzoHlmiEr`)
- **Görseller:** Cloudinary + fal.ai (FLUX)
- **Email:** Resend + Nodemailer
- **i18n:** next-intl — diller: en (default), tr, de, ru
- **Font:** Inter + Cal Sans
- **İkonlar:** Lucide React
- **Renkler:** Orange #f97316, Blue #0369a1, Dark #0f172a

## ⚠️ KRİTİK: Dosya Düzenleme Kuralı
`Write` ve `Edit` araçları bu Windows mount'unda dosyaları bozuyor (truncate/NUL byte sorunu).
**Her zaman shell üzerinden yaz:**
```python
python3 -c "open('dosya.tsx','w').write(content)"
# veya
with open("/sessions/.../mnt/oludeniz project/dosya.tsx", "w") as f:
    f.write(content)
```
Sonra doğrula: `python3 -c "d=open('f','rb').read(); print(d.count(b'\\x00'), 'NUL')"`

## Git Kuralları
- ⚠️ `.env.local` içindeki `GITHUB_TOKEN` YANLIŞ hesaba ait (`mrtandempilotu`) → sandbox'tan push 403 verir
- **Doğru yöntem:** Desktop Commander ile Windows'tan git çalıştır (çıktı yakalanmazsa .bat dosyası yazıp log'a yönlendir)
- Ceyhun'a ASLA "şu git komutunu çalıştır" deme — push'u onun yerine Desktop Commander ile yap
- Merge conflict varsa: `git stash → git pull → git stash pop → commit → push`

## Admin Dashboard (app/admin/)
**URL:** https://paragliding-oludeniz.com/admin
**Auth:** Cookie'de `admin_session=${ADMIN_PASSWORD}` olmalı

### Mevcut Sayfalar:
- `/admin` — Ana dashboard (3 kart: Pilot Control, Social Panel, Activity Panel)
- `/admin/mission-control` — Tüm AI agentların canlı durumu
- `/admin/content-pilot` — Blog makalesi yazma (topics, articles, logs, settings)
- `/admin/instagram` — Instagram yönetimi + DM otomasyonu
- `/admin/google-ads` — Google Ads dashboard
- `/admin/meta-ads` — Meta Ads dashboard
- `/admin/bookings` — Rezervasyonlar
- `/admin/reservations` — Rezervasyon detayları

### Admin Dashboard Komponentleri:
- `DashboardPilotControl.tsx` — Content pilot aç/kapa, slot yönetimi
- `DashboardSocialPanel.tsx` — Instagram istatistikleri
- `DashboardActivityPanel.tsx` — Son blog makaleleri + Instagram postları (resimli)
- `DashboardCronPanel.tsx` — Cron job durumları
- `AdminSidebar.tsx` — Sol menü (Mission Control = violet + pulse dot)

## AI Agentlar (Claude)
5 ajan zincirleme çalışır:
1. **Orchestrator** (`agents/orchestrator.ts`) — Koordinatör, topic seçer
2. **SEO** (`agents/seo.ts`) — SEO optimizasyonu
3. **Writer** (`agents/writer.ts`) — Makale yazar
4. **Image** (`agents/image.ts`) — fal.ai ile görsel üretir
5. **Social** (`agents/social.ts`) — Instagram postu hazırlar
6. **WhatsApp** (`agents/whatsapp.ts`) — Müşteri WhatsApp mesajlarına otomatik cevap (bkz. aşağıdaki ayrı bölüm)

**API Routes:** `app/api/agents/{orchestrator,writer,seo,image,social}/`
**Cron:** `/api/cron/orchestrator` — Vercel'de 06:00 UTC'de çalışır (06:00 + 12:00 + 18:00 slotları)
**Auth:** `Authorization: Bearer ${CRON_SECRET}` veya admin cookie

## Hermes AI (VPS)
- **Sunucu:** 5.175.136.227
- **Model:** OpenRouter / OWL-alpha
- **Gateway:** systemd servisi
- **Telegram:** chat "paragliding world", id: 1291038782
- **MCP:** Supabase bağlı
- **Cron jobs:** 06:00, 12:00, 18:00 UTC (orchestrator'ı tetikler)
- **NOT:** Hermes'e Anthropic key VERME (maliyet riski)
- **Hermes → Claude bağlantısı:** Hermes curl ile Next.js API'yi çağırır

## WhatsApp Otomatik Cevap Botu (2026-07-18'den itibaren)
Müşteriler işletme WhatsApp numarasına (+90 536 461 6674) yazdığında Claude otomatik cevap veriyor.

- **Bilgi tabanı:** `lib/knowledge/whatsapp-kb.ts` — fiyatlar, güvenlik, SSS, iletişim bilgisi (TR/EN). Fiyat/politika değişirse bu dosya güncellenmeli.
- **Agent:** `agents/whatsapp.ts` — `generateWhatsAppReply()`, KB'yi system prompt yapar, müşterinin diline (TR/EN) göre cevap üretir, JSON `{reply, needs_human}` döner.
- **Webhook:** `app/api/webhooks/whatsapp/route.ts` — GET Meta doğrulama handshake'i, POST gelen mesajı alır → agent'i çağırır → WhatsApp Cloud API ile cevabı gönderir.
- **needs_human = true** olursa (rezervasyon onayı, ödeme, iade anlaşmazlığı, KB'de olmayan konular) bot yine kısa bir cevap verir ama ayrıca `WHATSAPP_NOTIFY_PHONE`'a (senin numaran) "bot escalation" mesajı gönderir, sen manuel takip edersin.
- **Loglama:** her cevap `agent_logs` tablosuna `agent: 'whatsapp'` olarak yazılır.
- **Aç/kapa:** `WHATSAPP_BOT_ENABLED=false` env değişkeni ile botu tamamen kapatabilirsin (varsayılan: açık).
- **Gerekli env (Vercel):** `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_NOTIFY_PHONE` zaten mevcut (bildirim için kullanılıyordu). Yeni eklenmesi gereken: `WHATSAPP_VERIFY_TOKEN` (Meta App > WhatsApp > Configuration > Webhook'ta aynı değerle eşleşmeli).
- **Meta App dashboard kurulumu (yapılması gereken, henüz yapılmadı):** Callback URL = `https://paragliding-oludeniz.com/api/webhooks/whatsapp`, Verify token = `WHATSAPP_VERIFY_TOKEN` ile aynı, "messages" field'ına subscribe et. App ID: 1543333883484600, Business ID: 728026526701126.
- **Bilinen sınırlama:** KB tamamı her mesajda system prompt olarak gönderiliyor (~9K token) — basit ama maliyetli; ileride RAG'a geçilebilir.

## Supabase Tabloları (Önemli Sütunlar)
- **articles:** id, title, slug, content, hero_image_url, hero_image_alt, status, created_at, published_at
- **topics:** id, title, status (pending/used), created_at
- **instagram_posts:** id, caption, image_url, post_type, status (draft/scheduled/posted/failed), posted_at, instagram_id
- **agent_logs:** id, agent, action, status, error, created_at
- **usage_logs:** id, cost_usd, tokens, created_at
- **settings:** key, value (pilot_enabled, pilot_slots: "06:00,12:00,18:00")
- **bookings:** id, name, email, phone, date, status

## Blog Formatı (2026-07-12'den itibaren)
- Tüm blog yazıları **FAQ tarzında**: her H2 başlık gerçek bir müşteri sorusu, ilk 1-2 cümlede direkt cevap (AI Overview hedefli), 1500-2000 kelime, FAQPage schema varsayılan
- Tanımlı yer: `agents/writer.ts` (prompt + max_tokens 6000) ve `agents/seo.ts` (article_structure = 6-9 soru başlığı)

## Content Pilot Nasıl Çalışır
1. `/admin/content-pilot/topics` → Konu ekle (Add Topic)
2. Cron veya "Run Now" → Orchestrator tetiklenir
3. SEO → Writer → Image → Social agent zinciri çalışır
4. Makale Supabase'e kaydedilir (status: published)
5. Instagram post taslağı oluşturulur

## Önemli Dosyalar
- `app/admin/page.tsx` — Ana dashboard (force-dynamic)
- `app/admin/mission-control/page.tsx` — Mission Control (force-dynamic)
- `app/api/cron/orchestrator/route.ts` — Pilot cron endpoint
- `agents/image.ts` — fal.ai görsel üretimi
- `lib/supabase.ts` — Supabase client
- `vercel.json` — Cron job tanımları
- `graphify-out/GRAPH_REPORT.md` — Codebase knowledge graph (1779 node)

## Bilinen Sorunlar / Geçmiş Düzeltmeler
- Mission Control: stale data → `force-dynamic` + `revalidate = 0` eklendi
- Blog query: `excerpt`, `read_time` sütunları yok → `meta_description`, `word_count` kullan
- Articles image: sütun adı `image_url` değil `hero_image_url`
- Cron: vercel.json'a `/api/cron/orchestrator` eklenmesi gerekiyordu (2026-05-31'de 8 gün çalışmadı)
- Pilot slots: Supabase settings'te `pilot_active_slots` değil `pilot_slots` key'i

## Son Durum (2026-06-10 itibarıyla)
- **WhatsApp rezervasyon bildirimi (AÇIK SORUN):** Serbest metin mesajı sadece 24 saatlik konuşma penceresinde iletiliyor. Kalıcı çözüm: Meta WhatsApp Manager'da onaylı template oluştur + kodu `type: template`'e çevir (henüz yapılmadı)
- **Google Ads API:** Basic Access başvurusu yapıldı (MCC 410-918-1737, Aksoy Ltd). Onay bekleniyor
- **Meta Ads:** Facebook sayfası reklam hesabına bağlı DEĞİL — gönderi öne çıkarma bu yüzden çalışmıyor. Önce sayfa bağlantısı yapılmalı
- **Image agent kuralları:** Görsellerde insan YOK (FLUX anatomi bozuyor), Ölüdeniz lagün + Babadağ her zaman görünür, görsel konuya özel
- **Site kesintisi düzeltildi (Haziran başı):** page.tsx silinmişti + i18n/messages/agents/components klasörleri git'te yoktu → hepsi eklendi. Ders: push öncesi untracked kritik klasör kontrolü yap
- **SEO commit yayında:** title uzunlukları, OG image, LocalBusiness schema, 301 redirectler, tek sitemap
- **Admin login:** /admin/login canlı
- **Geçmiş sohbetler okunabilir:** `mcp__session_info__list_sessions` + `read_transcript` ile eski sohbetlere bakılabilir. "Bilmiyorum" demeden önce eski sohbetlere bak

## SEO Durumu
- Hedef: "paragliding oludeniz" için Google #1
- 100+ sayfa mevcut (4 dilde)
- Sitemap: otomatik üretiliyor
- next-sitemap yapılandırmalı
