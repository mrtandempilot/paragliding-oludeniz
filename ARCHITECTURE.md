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
- Auth: tüm `/admin` ve `/api/admin` rotaları middleware'de `admin_session` cookie ile korunur. `OPENAI_API_KEY` tarayıcıya hiç gitmez.
