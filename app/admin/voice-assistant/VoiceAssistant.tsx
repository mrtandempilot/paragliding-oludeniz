'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Mic, MicOff, PhoneOff, Send, Loader2, AudioLines, Check, X, Power } from 'lucide-react'
import LiveDisplay from './LiveDisplay'
import type { Display } from '@/lib/neslihan/tools'

// Voice = the browser's speech recognition (free) + Gemini TTS for a natural
// voice (free tier), falling back to the browser's own voice when unavailable.
// Brain = /api/admin/neslihan/chat (Gemini + Neslihan's tools).

type Line = { id: string; role: 'user' | 'assistant'; text: string }
type Shown = { id: string; display: Display }
type Pending = { token: string; summary: string }
type Content = { role: 'user' | 'model'; parts: any[] }

const GREETING = '[Sistem] Konuşma başladı. Ceyhun Bey\'i tek cümleyle selamla; bugünkü veya geciken hatırlatma varsa söyle; nasıl yardımcı olabileceğini sor.'
const BRIEFING = '[Sistem] Günün ilk konuşması. Ceyhun Bey\'i selamla ve sabah brifingini yap (talimattaki "Sabah brifingi" bölümüne göre araçları çağır).'

// First conversation of the day (Istanbul date, per browser) gets the morning briefing.
const BRIEF_KEY = 'neslihan_last_briefing'
// a tiny silent WAV, played on the first tap so mobile browsers allow audio later
const SILENT_WAV = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA='
function openingMessage() {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul' }).format(new Date())
  try {
    if (localStorage.getItem(BRIEF_KEY) === today) return GREETING
    localStorage.setItem(BRIEF_KEY, today)
  } catch { /* storage blocked: just brief */ }
  return BRIEFING
}

function getRecognition(): any {
  if (typeof window === 'undefined') return null
  const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  return SR ? new SR() : null
}

// Best Turkish voice the device has (Google / female voices sound most natural).
function pickVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis?.getVoices() || []
  const tr = voices.filter(v => v.lang.toLowerCase().startsWith('tr'))
  return tr.find(v => /google/i.test(v.name)) || tr.find(v => /(yelda|seda|emel|female|kadın)/i.test(v.name)) || tr[0] || null
}

// Built-in browser voice, sentence-by-sentence because Chrome cuts off long utterances.
function speakBrowser(text: string): Promise<void> {
  return new Promise(resolve => {
    const synth = window.speechSynthesis
    if (!synth || !text) return resolve()
    synth.cancel()
    const clean = text.replace(/[*_#`>|]/g, '').replace(new RegExp('\\p{Extended_Pictographic}', 'gu'), '').trim()
    const parts = clean.match(/[^.!?…]+[.!?…]*/g)?.map(s => s.trim()).filter(Boolean) || [clean]
    const voice = pickVoice()
    parts.forEach((p, i) => {
      const u = new SpeechSynthesisUtterance(p)
      u.lang = 'tr-TR'
      if (voice) u.voice = voice
      u.rate = 1.05
      if (i === parts.length - 1) { u.onend = () => resolve(); u.onerror = () => resolve() }
      synth.speak(u)
    })
  })
}

export default function VoiceAssistant() {
  const [live, setLive] = useState(false)
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [thinking, setThinking] = useState(false)
  const [interim, setInterim] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [lines, setLines] = useState<Line[]>([])
  const [shown, setShown] = useState<Shown[]>([])
  const [pending, setPending] = useState<Pending | null>(null)
  const [text, setText] = useState('')
  const [voiceSupported, setVoiceSupported] = useState(true)
  const [naturalVoice, setNaturalVoice] = useState(true)

  const contentsRef = useRef<Content[]>([])
  const pendingRef = useRef<Pending | null>(null)
  const liveRef = useRef(false)
  const recRef = useRef<any>(null)
  const transcriptEnd = useRef<HTMLDivElement | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const naturalRef = useRef(true)

  const setPendingBoth = (p: Pending | null) => { pendingRef.current = p; setPending(p) }

  useEffect(() => {
    setVoiceSupported(!!getRecognition() && 'speechSynthesis' in window)
    window.speechSynthesis?.getVoices() // warm up the voice list
  }, [])
  useEffect(() => { transcriptEnd.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }) }, [lines, interim])

  const stopAudio = useCallback(() => {
    window.speechSynthesis?.cancel()
    const a = audioRef.current
    if (a) { a.pause(); a.onended = null }
  }, [])

  // Natural Gemini voice first; the browser voice if that fails (e.g. free daily limit).
  const say = useCallback(async (reply: string) => {
    if (naturalRef.current && audioRef.current) {
      try {
        const res = await fetch('/api/admin/neslihan/tts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: reply }) })
        if (!res.ok) throw new Error('tts')
        const url = URL.createObjectURL(await res.blob())
        const a = audioRef.current
        if (!liveRef.current) return
        await new Promise<void>(resolve => {
          a.onended = () => resolve()
          a.onpause = () => resolve()
          a.onerror = () => resolve()
          a.src = url
          a.play().catch(() => resolve())
        })
        URL.revokeObjectURL(url)
        return
      } catch {
        naturalRef.current = false // stay on the browser voice for the rest of this conversation
        setNaturalVoice(false)
      }
    }
    await speakBrowser(reply)
  }, [])

  const addLine = (role: Line['role'], t: string) => setLines(ls => [...ls, { id: `${Date.now()}-${ls.length}`, role, text: t }])

  const stopListening = useCallback(() => {
    try { recRef.current?.abort() } catch { /* already stopped */ }
    recRef.current = null
    setListening(false)
    setInterim('')
  }, [])

  // One conversational turn with the brain; hidden = system note, not shown in the transcript.
  const ask = useCallback(async (message: string, hidden = false) => {
    if (!hidden) addLine('user', message)
    contentsRef.current = [...contentsRef.current, { role: 'user', parts: [{ text: message }] }]
    setThinking(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/neslihan/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: contentsRef.current, pending: pendingRef.current }),
      })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error || `HTTP ${res.status}`)
      contentsRef.current = data.contents || contentsRef.current
      if (data.displays?.length) setShown(s => [...[...data.displays].reverse(), ...s].slice(0, 12))
      if (data.proposal) setPendingBoth(data.proposal)
      else if (data.clearPending) setPendingBoth(null)
      addLine('assistant', data.reply)
      setThinking(false)
      if (!liveRef.current) return
      setSpeaking(true)
      await say(data.reply)
      setSpeaking(false)
      // keep the conversation going hands-free
      // (skip if the user already tapped the mic to interrupt)
      if (liveRef.current && voiceSupported && !recRef.current) listen()
    } catch (e: any) {
      setThinking(false)
      setSpeaking(false)
      setError(e?.message || 'Bir hata oluştu')
    }
    // listen is defined below and stable; voiceSupported read at call time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceSupported, say])

  const listen = useCallback(() => {
    const rec = getRecognition()
    if (!rec) return
    stopAudio()
    setSpeaking(false)
    stopListening()
    rec.lang = 'tr-TR'
    rec.interimResults = true
    rec.continuous = false
    rec.maxAlternatives = 1
    let finalText = ''
    rec.onresult = (e: any) => {
      let partial = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i]
        if (r.isFinal) finalText += r[0].transcript
        else partial += r[0].transcript
      }
      setInterim(partial || finalText)
    }
    rec.onerror = (e: any) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') setError('Mikrofon izni verilmedi. Tarayıcı ayarlarından izin verin.')
      else if (e.error !== 'no-speech' && e.error !== 'aborted') setError(`Ses tanıma hatası: ${e.error}`)
    }
    rec.onend = () => {
      recRef.current = null
      setListening(false)
      setInterim('')
      const said = finalText.trim()
      if (said && liveRef.current) ask(said)
    }
    recRef.current = rec
    setListening(true)
    try { rec.start() } catch { setListening(false) }
  }, [ask, stopListening, stopAudio])

  const start = useCallback(() => {
    liveRef.current = true
    setLive(true)
    setError(null)
    speakBrowser('') // unlock speech on iOS/Chrome within the tap
    if (!audioRef.current) audioRef.current = new Audio()
    audioRef.current.src = SILENT_WAV
    audioRef.current.play().catch(() => {})
    naturalRef.current = true
    setNaturalVoice(true)
    ask(openingMessage(), true)
  }, [ask])

  const stop = useCallback(() => {
    liveRef.current = false
    setLive(false)
    stopListening()
    stopAudio()
    setSpeaking(false)
  }, [stopListening, stopAudio])

  useEffect(() => stop, [stop])

  const micTap = () => {
    if (!live) return start()
    if (listening) return stopListening()
    listen() // also interrupts Neslihan if she is talking
  }

  const sendText = (e: React.FormEvent) => {
    e.preventDefault()
    const t = text.trim()
    if (!t || thinking) return
    if (!live) { liveRef.current = true; setLive(true) }
    stopListening()
    setText('')
    ask(t)
  }

  // On-screen Onayla / İptal; then let Neslihan say what happened.
  const approveOnScreen = async () => {
    const p = pendingRef.current
    if (!p) return
    setPendingBoth(null)
    let msg = ''
    try {
      const res = await fetch('/api/admin/neslihan/execute', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: p.token }) })
      const out = await res.json()
      msg = out.message || ''
      setShown(s => [{ id: `${Date.now()}-done`, display: { title: out.ok ? '✅ Tamamlandı' : '❌ Yapılamadı', note: msg } }, ...s].slice(0, 12))
      ask(`[Sistem] Ceyhun Bey ekrandan onayladı: ${p.summary} → ${out.ok ? 'başarılı' : 'hata'}: ${msg}. Sonucu tek cümleyle söyle.`, true)
    } catch (e: any) {
      setError(e?.message || 'İşlem çalıştırılamadı')
    }
  }
  const cancelOnScreen = () => {
    const p = pendingRef.current
    if (!p) return
    setPendingBoth(null)
    ask(`[Sistem] Ceyhun Bey ekrandan iptal etti: ${p.summary}. Kısaca "iptal ettim" de.`, true)
  }

  const stateLabel = !live ? 'Başlamak için dokunun'
    : thinking ? 'Düşünüyor…'
    : speaking ? 'Neslihan konuşuyor — sözünü kesmek için dokunun'
    : listening ? 'Dinliyor…'
    : voiceSupported ? 'Konuşmak için dokunun' : 'Yazarak sorun'

  const [latest, ...older] = shown

  return (
    <div className="-m-4 min-h-screen bg-[#0B1A2C] p-4 text-[#E7EEF6] md:-m-8 md:p-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[380px_1fr]">
        {/* Left: voice + transcript */}
        <div className="flex flex-col gap-4 lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)]">
          <div className="rounded-2xl border border-[#1E3654] bg-[#0F2238] p-6 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-[#5F7894]">Voice Asistan</p>
            <h1 className="mt-1 text-2xl font-semibold">Neslihan Hanım</h1>

            <button
              onClick={micTap}
              disabled={live && thinking}
              aria-label={!live ? 'Başlat' : listening ? 'Dinlemeyi durdur' : 'Konuş'}
              className={`relative mx-auto mt-6 flex h-28 w-28 items-center justify-center rounded-full transition-all duration-200 ${
                listening ? 'bg-[#F97316]' : speaking ? 'bg-[#0F766E]' : 'bg-[#F97316] hover:scale-105'
              } disabled:opacity-60`}
            >
              {(listening || speaking) && (
                <span className={`absolute inset-0 animate-ping rounded-full ${speaking ? 'bg-[#2DD4BF]/40' : 'bg-[#F97316]/40'}`} />
              )}
              {!live ? <Power className="relative h-10 w-10 text-white" />
                : thinking ? <Loader2 className="h-10 w-10 animate-spin text-white" />
                : speaking ? <AudioLines className="relative h-10 w-10 text-white" />
                : voiceSupported ? <Mic className="relative h-10 w-10 text-white" />
                : <MicOff className="relative h-10 w-10 text-white/70" />}
            </button>

            <p className="mt-4 text-sm text-[#C9D6E4]">{stateLabel}</p>
            {live && (
              <button onClick={stop} className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#1E3654] px-4 py-1.5 text-xs text-[#F87171] hover:bg-[#1E3654]">
                <PhoneOff className="h-3.5 w-3.5" /> Konuşmayı bitir
              </button>
            )}
            {live && !naturalVoice && <p className="mt-2 text-[11px] text-[#5F7894]">Doğal ses şu an kullanılamıyor (günlük ücretsiz sınır olabilir) — tarayıcı sesi kullanılıyor.</p>}
            {!voiceSupported && <p className="mt-3 text-xs text-[#8098B3]">Bu tarayıcı sesli konuşmayı desteklemiyor. Chrome veya Edge kullanın; yazarak da sorabilirsiniz.</p>}
            {error && <p className="mt-3 rounded-lg bg-[#F87171]/10 px-3 py-2 text-xs text-[#F87171]">{error}</p>}
          </div>

          <div className="flex min-h-[200px] flex-1 flex-col overflow-hidden rounded-2xl border border-[#1E3654] bg-[#0F2238]">
            <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
              {lines.length === 0 && !interim && (
                <p className="text-[#5F7894]">Örnek: “Yarın kaç uçuş var?”, “Yeni mail var mı?”, “Neden rezervasyon gelmedi?”, “Rakipler kim?”</p>
              )}
              {lines.map(l => (
                <div key={l.id} className={l.role === 'user' ? 'text-right' : ''}>
                  <span className={`inline-block max-w-[90%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-left ${l.role === 'user' ? 'bg-[#1E3654] text-[#E7EEF6]' : 'bg-[#0B1A2C] text-[#C9D6E4]'}`}>
                    {l.text}
                  </span>
                </div>
              ))}
              {interim && (
                <div className="text-right">
                  <span className="inline-block max-w-[90%] rounded-2xl bg-[#1E3654]/50 px-3 py-2 text-[#8098B3] italic">{interim}</span>
                </div>
              )}
              <div ref={transcriptEnd} />
            </div>
            <form onSubmit={sendText} className="flex gap-2 border-t border-[#1E3654] p-3">
              <input
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Yazarak da sorabilirsiniz…"
                className="min-w-0 flex-1 rounded-lg bg-[#0B1A2C] px-3 py-2 text-sm text-[#E7EEF6] placeholder:text-[#5F7894] focus:outline-none focus:ring-1 focus:ring-[#F97316]"
              />
              <button type="submit" disabled={!text.trim() || thinking} aria-label="Gönder" className="rounded-lg bg-[#F97316] px-3 text-white disabled:opacity-40">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right: live data screen */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-[#8098B3]">Canlı ekran</h2>
            {thinking && <span className="inline-flex items-center gap-2 text-xs text-[#FBBF24]"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Veriye bakıyor</span>}
          </div>
          {pending && (
            <div className="rounded-2xl border border-[#FBBF24]/50 bg-[#FBBF24]/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#FBBF24]">Onay bekliyor</p>
              <p className="mt-1 text-sm text-[#E7EEF6]">{pending.summary}</p>
              <p className="mt-1 text-xs text-[#8098B3]">“Evet” deyin ya da aşağıdan seçin.</p>
              <div className="mt-3 flex gap-2">
                <button onClick={approveOnScreen} className="inline-flex items-center gap-1.5 rounded-lg bg-[#2DD4BF] px-3 py-1.5 text-sm font-medium text-[#0B1A2C]"><Check className="h-4 w-4" /> Onayla</button>
                <button onClick={cancelOnScreen} className="inline-flex items-center gap-1.5 rounded-lg border border-[#1E3654] px-3 py-1.5 text-sm text-[#F87171] hover:bg-[#1E3654]"><X className="h-4 w-4" /> İptal</button>
              </div>
            </div>
          )}
          {latest ? (
            <>
              <LiveDisplay key={latest.id} display={latest.display} />
              {older.length > 0 && (
                <div className="grid gap-3 md:grid-cols-2">
                  {older.map(s => (
                    <button key={s.id} onClick={() => setShown(all => [s, ...all.filter(x => x.id !== s.id)])} className="text-left opacity-80 transition hover:opacity-100">
                      <LiveDisplay display={s.display} compact />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-[#1E3654] text-center text-sm text-[#5F7894]">
              Neslihan Hanım bir veriye baktığında burada gösterecek.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
