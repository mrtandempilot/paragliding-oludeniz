# Architecture (notlar)

## Admin veri katmanı
- `lib/admin/dashboard-data.ts` — ortak yükleyiciler: `getSupabase`, `istanbulDate`, `getSearchConsole`, `getBabadagWindLadder`. `app/admin/page.tsx` ve Neslihan araçları kullanır.

## Voice Asistan — Neslihan Hanım
```
Tarayıcı (/admin/voice-assistant)
  VoiceAssistant.tsx: SpeechRecognition (tr-TR) → metin → POST /api/admin/neslihan/chat {contents, pending}
        │   chat route: Gemini generateContent + araç döngüsü (en fazla 6 adım)
        │     ├─ runNeslihanTool → lib/neslihan/tools.ts → Supabase / mevcut /api/admin/* (cookie iletilir)
        │     ├─ prepare_* → actions.prepareAction → imzalı token (tarayıcıya, modele değil)
        │     └─ confirm_action → confirm.isYes(son kullanıcı mesajı) && önceki turdaki pending → executeAction
        │   ← {reply, contents (geçmiş), displays, proposal, clearPending}
        │  reply → speechSynthesis (tr-TR)   displays → LiveDisplay.tsx (canlı ekran)
```
- `lib/neslihan/gemini.ts` — Gemini REST + şema dönüştürücü (additionalProperties / sayı enum'ları atılır).
- `lib/neslihan/confirm.ts` — "evet" algılama (olumsuzlar önce).
- `/api/admin/neslihan/tool` — tek araç çağrısı (eski yol, hâlâ duruyor); asıl akış `/chat`.
- `lib/neslihan/persona.ts` — sistem talimatı (persona, şirket bilgisi, kurallar) + araç şemaları.
- `lib/neslihan/tools.ts` — salt-okunur araçlar; her biri `{ result, display }` döner. Yeni araç = şemayı persona.ts'e, uygulamayı tools.ts'e ekle.
- `lib/neslihan/gmail.ts` — IMAP okuma (inbox / sent / all = tüm etiketler, Gmail arama dili `gmraw`), SMTP gönderme. GMAIL_USER + GMAIL_APP_PASSWORD.
- `lib/neslihan/actions.ts` — onaylı işlemler. `prepare_*` → `{summary, display, token}` (HMAC imzalı, 10 dk; secret: NESLIHAN_ACTION_SECRET || CRON_SECRET || ADMIN_PASSWORD). `POST /api/admin/neslihan/execute {token}` imzayı doğrular ve uygular, `agent_logs`'a yazar.
- Onay kapısı sunucuda (`/chat`): `confirm_action` sadece önceki turdan gelen `pending` için ve kullanıcının son mesajı açık "evet" ise çalışır. Model token'ı hiç görmez.
- `lib/neslihan/advisor.ts` — `diagnose_bookings` (google-ads `diagnostics` + seo-data `ga4-funnel` + bookings), `competitor_check` (SerpAPI), `deep_analysis` (Claude, JSON rapor).
- `lib/neslihan/memory.ts` — notlar/hatırlatmalar/tespitler, `settings` tablosunda `neslihan_memory` JSON; `memoryForPrompt()` oturum talimatına eklenir.
- Açılış: tarayıcı günün ilk oturumunda brifing sistem notu ekler (localStorage `neslihan_last_briefing`), değilse kısa selam.
- Auth: tüm `/admin` ve `/api/admin` rotaları middleware'de `admin_session` cookie ile korunur. `GEMINI_API_KEY` sadece sunucuda.
