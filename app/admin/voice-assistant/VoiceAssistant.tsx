'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Mic, MicOff, PhoneOff, Send, Loader2, AudioLines } from 'lucide-react'
import LiveDisplay from './LiveDisplay'
import type { Display } from '@/lib/neslihan/tools'

type Status = 'idle' | 'connecting' | 'live' | 'error'
type Line = { id: string; role: 'user' | 'assistant'; text: string; done: boolean }
type Shown = { id: string; display: Display }

const GREETING = 'Ceyhun Bey\'i tek cümleyle kısaca selamla ve nasıl yardımcı olabileceğini sor.'

export default function VoiceAssistant() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const [muted, setMuted] = useState(false)
  const [userSpeaking, setUserSpeaking] = useState(false)
  const [assistantSpeaking, setAssistantSpeaking] = useState(false)
  const [busyTools, setBusyTools] = useState(0)
  const [lines, setLines] = useState<Line[]>([])
  const [shown, setShown] = useState<Shown[]>([])
  const [text, setText] = useState('')

  const pcRef = useRef<RTCPeerConnection | null>(null)
  const dcRef = useRef<RTCDataChannel | null>(null)
  const micRef = useRef<MediaStream | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const transcriptEnd = useRef<HTMLDivElement | null>(null)

  useEffect(() => { transcriptEnd.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }) }, [lines])

  const upsertLine = useCallback((id: string, role: Line['role'], update: (prev: string) => string, done = false) => {
    setLines(ls => {
      const i = ls.findIndex(l => l.id === id)
      if (i === -1) return [...ls, { id, role, text: update(''), done }]
      const next = ls.slice()
      next[i] = { ...next[i], text: update(next[i].text), done: done || next[i].done }
      return next
    })
  }, [])

  const send = useCallback((event: object) => {
    const dc = dcRef.current
    if (dc && dc.readyState === 'open') dc.send(JSON.stringify(event))
  }, [])

  // Run every function call from a finished response, then let Neslihan answer.
  const handleFunctionCalls = useCallback(async (calls: { call_id: string; name: string; arguments: string }[]) => {
    setBusyTools(n => n + calls.length)
    await Promise.all(calls.map(async call => {
      let output: unknown
      try {
        const res = await fetch('/api/admin/neslihan/tool', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: call.name, args: JSON.parse(call.arguments || '{}') }),
        })
        const data = await res.json()
        output = data.result
        if (data.display) setShown(s => [{ id: call.call_id, display: data.display }, ...s].slice(0, 12))
      } catch (e: any) {
        output = { error: e?.message || 'Araç çalıştırılamadı' }
      } finally {
        setBusyTools(n => n - 1)
      }
      send({ type: 'conversation.item.create', item: { type: 'function_call_output', call_id: call.call_id, output: JSON.stringify(output) } })
    }))
    send({ type: 'response.create' })
  }, [send])

  const onEvent = useCallback((ev: any) => {
    switch (ev.type) {
      case 'input_audio_buffer.speech_started': setUserSpeaking(true); break
      case 'input_audio_buffer.speech_stopped': setUserSpeaking(false); break
      // reserve the user's line now so it stays above Neslihan's reply
      case 'input_audio_buffer.committed': upsertLine(ev.item_id, 'user', p => p || '…'); break
      case 'conversation.item.input_audio_transcription.completed':
        upsertLine(ev.item_id, 'user', () => (ev.transcript || '').trim() || '(anlaşılamadı)', true); break
      case 'response.output_audio_transcript.delta': upsertLine(ev.item_id, 'assistant', p => p + (ev.delta || '')); break
      case 'response.output_audio_transcript.done': upsertLine(ev.item_id, 'assistant', p => ev.transcript || p, true); break
      case 'output_audio_buffer.started': setAssistantSpeaking(true); break
      case 'output_audio_buffer.stopped':
      case 'output_audio_buffer.cleared': setAssistantSpeaking(false); break
      case 'response.done': {
        const calls = (ev.response?.output || []).filter((o: any) => o.type === 'function_call')
        if (calls.length) handleFunctionCalls(calls)
        break
      }
      case 'error': setError(ev.error?.message || 'Bilinmeyen hata'); break
    }
  }, [upsertLine, handleFunctionCalls])

  const stop = useCallback(() => {
    dcRef.current?.close()
    pcRef.current?.getSenders().forEach(s => s.track?.stop())
    pcRef.current?.close()
    micRef.current?.getTracks().forEach(t => t.stop())
    if (audioRef.current) audioRef.current.srcObject = null
    dcRef.current = null; pcRef.current = null; micRef.current = null
    setStatus('idle'); setUserSpeaking(false); setAssistantSpeaking(false); setMuted(false)
  }, [])

  useEffect(() => stop, [stop])

  const start = useCallback(async () => {
    setError(null)
    setStatus('connecting')
    try {
      const mic = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } })
      micRef.current = mic

      const tokenRes = await fetch('/api/admin/neslihan/session', { method: 'POST' })
      const token = await tokenRes.json()
      if (!tokenRes.ok || !token.value) throw new Error(token.error || 'Oturum açılamadı')

      const pc = new RTCPeerConnection()
      pcRef.current = pc
      pc.ontrack = e => { if (audioRef.current) audioRef.current.srcObject = e.streams[0] }
      pc.addTrack(mic.getTracks()[0], mic)
      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
          setError('Bağlantı koptu. Tekrar başlatın.')
          stop()
        }
      }

      const dc = pc.createDataChannel('oai-events')
      dcRef.current = dc
      dc.onmessage = e => { try { onEvent(JSON.parse(e.data)) } catch { /* ignore malformed */ } }
      dc.onopen = () => {
        setStatus('live')
        send({ type: 'response.create', response: { instructions: GREETING } })
      }

      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      const sdpRes = await fetch('https://api.openai.com/v1/realtime/calls', {
        method: 'POST',
        body: offer.sdp,
        headers: { Authorization: `Bearer ${token.value}`, 'Content-Type': 'application/sdp' },
      })
      if (!sdpRes.ok) throw new Error(`OpenAI bağlantı hatası (HTTP ${sdpRes.status})`)
      await pc.setRemoteDescription({ type: 'answer', sdp: await sdpRes.text() })
    } catch (e: any) {
      stop()
      setStatus('error')
      setError(e?.name === 'NotAllowedError' ? 'Mikrofon izni verilmedi. Tarayıcı ayarlarından izin verin.' : e?.message || 'Başlatılamadı')
    }
  }, [onEvent, send, stop])

  const toggleMute = () => {
    const track = micRef.current?.getAudioTracks()[0]
    if (!track) return
    track.enabled = !track.enabled
    setMuted(!track.enabled)
  }

  const sendText = (e: React.FormEvent) => {
    e.preventDefault()
    const t = text.trim()
    if (!t || status !== 'live') return
    const id = `typed-${Date.now()}`
    upsertLine(id, 'user', () => t, true)
    send({ type: 'conversation.item.create', item: { type: 'message', role: 'user', content: [{ type: 'input_text', text: t }] } })
    send({ type: 'response.create' })
    setText('')
  }

  const live = status === 'live'
  const stateLabel = !live
    ? status === 'connecting' ? 'Bağlanıyor…' : 'Konuşmak için dokunun'
    : busyTools ? 'Veriye bakıyor…'
    : assistantSpeaking ? 'Neslihan konuşuyor'
    : muted ? 'Mikrofon kapalı'
    : userSpeaking ? 'Dinliyor…' : 'Sizi dinliyor'

  const [latest, ...older] = shown

  return (
    <div className="-m-4 min-h-screen bg-[#0B1A2C] p-4 text-[#E7EEF6] md:-m-8 md:p-8">
      <audio ref={audioRef} autoPlay />
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[380px_1fr]">
        {/* Left: voice + transcript */}
        <div className="flex flex-col gap-4 lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)]">
          <div className="rounded-2xl border border-[#1E3654] bg-[#0F2238] p-6 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-[#5F7894]">Voice Asistan</p>
            <h1 className="mt-1 text-2xl font-semibold">Neslihan Hanım</h1>

            <button
              onClick={live ? toggleMute : start}
              disabled={status === 'connecting'}
              aria-label={live ? (muted ? 'Mikrofonu aç' : 'Mikrofonu kapat') : 'Konuşmayı başlat'}
              className={`relative mx-auto mt-6 flex h-28 w-28 items-center justify-center rounded-full transition-all duration-200 ${
                live ? (muted ? 'bg-[#1E3654]' : 'bg-[#F97316]') : 'bg-[#F97316] hover:scale-105'
              } disabled:opacity-60`}
            >
              {live && !muted && (userSpeaking || assistantSpeaking) && (
                <span className={`absolute inset-0 animate-ping rounded-full ${assistantSpeaking ? 'bg-[#2DD4BF]/40' : 'bg-[#F97316]/40'}`} />
              )}
              {status === 'connecting' ? <Loader2 className="h-10 w-10 animate-spin text-white" />
                : live && assistantSpeaking ? <AudioLines className="relative h-10 w-10 text-white" />
                : muted ? <MicOff className="relative h-10 w-10 text-[#8098B3]" />
                : <Mic className="relative h-10 w-10 text-white" />}
            </button>

            <p className="mt-4 text-sm text-[#C9D6E4]">{stateLabel}</p>
            {live && (
              <button onClick={stop} className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#1E3654] px-4 py-1.5 text-xs text-[#F87171] hover:bg-[#1E3654]">
                <PhoneOff className="h-3.5 w-3.5" /> Konuşmayı bitir
              </button>
            )}
            {error && <p className="mt-3 rounded-lg bg-[#F87171]/10 px-3 py-2 text-xs text-[#F87171]">{error}</p>}
          </div>

          <div className="flex min-h-[200px] flex-1 flex-col overflow-hidden rounded-2xl border border-[#1E3654] bg-[#0F2238]">
            <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
              {lines.length === 0 && (
                <p className="text-[#5F7894]">Örnek: “Yarın kaç uçuş var?”, “Rüzgâr nasıl?”, “Google reklamları bu hafta nasıl gitti?”</p>
              )}
              {lines.map(l => (
                <div key={l.id} className={l.role === 'user' ? 'text-right' : ''}>
                  <span className={`inline-block max-w-[90%] rounded-2xl px-3 py-2 ${l.role === 'user' ? 'bg-[#1E3654] text-[#E7EEF6]' : 'bg-[#0B1A2C] text-[#C9D6E4]'}`}>
                    {l.text}
                  </span>
                </div>
              ))}
              <div ref={transcriptEnd} />
            </div>
            <form onSubmit={sendText} className="flex gap-2 border-t border-[#1E3654] p-3">
              <input
                value={text}
                onChange={e => setText(e.target.value)}
                disabled={!live}
                placeholder={live ? 'Yazarak da sorabilirsiniz…' : 'Önce konuşmayı başlatın'}
                className="min-w-0 flex-1 rounded-lg bg-[#0B1A2C] px-3 py-2 text-sm text-[#E7EEF6] placeholder:text-[#5F7894] focus:outline-none focus:ring-1 focus:ring-[#F97316] disabled:opacity-50"
              />
              <button type="submit" disabled={!live || !text.trim()} aria-label="Gönder" className="rounded-lg bg-[#F97316] px-3 text-white disabled:opacity-40">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right: live data screen */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-[#8098B3]">Canlı ekran</h2>
            {busyTools > 0 && <span className="inline-flex items-center gap-2 text-xs text-[#FBBF24]"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Veri getiriliyor</span>}
          </div>
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
