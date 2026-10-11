# Architecture (notlar)

## Admin veri katmanı
- `lib/admin/dashboard-data.ts` — ortak yükleyiciler: `getSupabase`, `istanbulDate`, `getSearchConsole`, `getBabadagWindLadder`. `app/admin/page.tsx` ve Neslihan araçları kullanır.

## Voice Asistan — Neslihan Hanım
```
Tarayıcı (/admin/voice-assistant)
  VoiceAssistant.tsx ── POST /api/admin/neslihan/session ──> OpenAI client_secrets (kısa ömürlü anahtar)
        │  WebRTC ses + "oai-events" data channel ──> api.openai.com/v1/realtime/calls
        │  model function_call → POST /api/admin/neslihan/tool {name,args}
        │                         └─ lib/neslihan/tools.ts → Supabase / mevcut /api/admin/* rotaları (cookie iletilir)
        │  {result} → modele function_call_output   {display} → LiveDisplay.tsx (canlı ekran)
```
- `lib/neslihan/persona.ts` — sistem talimatı (persona, şirket bilgisi, kurallar) + araç şemaları.
- `lib/neslihan/tools.ts` — salt-okunur araçlar; her biri `{ result, display }` döner. Yeni araç = şemayı persona.ts'e, uygulamayı tools.ts'e ekle.
- `lib/neslihan/gmail.ts` — IMAP okuma (inbox / sent / all = tüm etiketler, Gmail arama dili `gmraw`), SMTP gönderme. GMAIL_USER + GMAIL_APP_PASSWORD.
- `lib/neslihan/actions.ts` — onaylı işlemler. `prepare_*` → `{summary, display, token}` (HMAC imzalı, 10 dk; secret: NESLIHAN_ACTION_SECRET || CRON_SECRET || ADMIN_PASSWORD). `POST /api/admin/neslihan/execute {token}` imzayı doğrular ve uygular, `agent_logs`'a yazar.
- Onay kapısı tarayıcıda (`VoiceAssistant.tsx` → `confirmByVoice`): model `confirm_action` çağırınca, öneriden sonraki son kullanıcı cümlesinde açık "evet" yoksa işlem çalışmaz. Model token'ı hiç görmez.
- `lib/neslihan/advisor.ts` — `diagnose_bookings` (google-ads `diagnostics` + seo-data `ga4-funnel` + bookings), `competitor_check` (SerpAPI), `deep_analysis` (Claude, JSON rapor).
- `lib/neslihan/memory.ts` — notlar/hatırlatmalar/tespitler, `settings` tablosunda `neslihan_memory` JSON; `memoryForPrompt()` oturum talimatına eklenir.
- Açılış: tarayıcı günün ilk oturumunda brifing sistem notu ekler (localStorage `neslihan_last_briefing`), değilse kısa selam.
- Auth: tüm `/admin` ve `/api/admin` rotaları middleware'de `admin_session` cookie ile korunur. `OPENAI_API_KEY` tarayıcıya hiç gitmez.
