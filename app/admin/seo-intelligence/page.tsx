'use client'

import React, { useState } from 'react'
import {
  ShieldCheck,
  AlertTriangle,
  Cpu,
  CheckCircle2,
  XCircle,
  Search,
  RefreshCw,
  FileText,
  Scale,
  BrainCircuit,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
  Info
} from 'lucide-react'

export default function SEOIntelligenceDashboard() {
  const [url, setUrl] = useState('/paragliding-oludeniz-price')
  const [keyword, setKeyword] = useState('paragliding oludeniz price')
  const [position, setPosition] = useState('17')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleRunAnalysis = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/seo-intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          keyword,
          position: parseInt(position, 10) || 17
        })
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Analysis request failed.')
      }

      setResult(data.result)
    } catch (err: any) {
      setError(err.message || 'An error occurred while running the Multi-Agent SEO analysis.')
    } finally {
      setLoading(false)
    }
  }

  const copyReport = () => {
    if (!result) return
    const text = JSON.stringify(result.finalDecision, null, 2)
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Multi-Agent SEO Intelligence & Judge
              </h1>
            </div>
            <p className="text-sm text-slate-400">
              4 AI Model (Claude, ChatGPT, Gemini, Perplexity) • Evidence &gt; Consensus • Multi-Cycle Recheck Engine
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-lg text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Status: Engine Active (Isolated & Safe)
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form & Control Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-indigo-400" />
              SEO Analiz Parametreleri
            </h2>

            <form onSubmit={handleRunAnalysis} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Hedef URL
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="/paragliding-oludeniz-price"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Hedef Anahtar Kelime (Keyword)
                </label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="paragliding oludeniz price"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Mevcut Sıralama (Current Rank / Position)
                </label>
                <input
                  type="number"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="17"
                  min="1"
                  max="100"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/20 mt-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    AI Ekibi Analiz Ediyor...
                  </>
                ) : (
                  <>
                    <BrainCircuit className="w-5 h-5" />
                    Multi-Agent Analiz Başlat
                  </>
                )}
              </button>
            </form>

            {/* Quick Test Presets */}
            <div className="mt-6 pt-6 border-t border-slate-800">
              <p className="text-xs font-medium text-slate-400 mb-2">Hızlı Test Senaryoları:</p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setUrl('/paragliding-oludeniz-price')
                    setKeyword('paragliding oludeniz price')
                    setPosition('17')
                  }}
                  className="text-left text-xs bg-slate-950 hover:bg-slate-800 border border-slate-800 px-3 py-2 rounded-lg text-slate-300 transition flex items-center justify-between"
                >
                  <span>1. Price Test (Pos 17 - Priority Zone)</span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
                <button
                  onClick={() => {
                    setUrl('/oludeniz-paragliding')
                    setKeyword('oludeniz paragliding')
                    setPosition('4')
                  }}
                  className="text-left text-xs bg-slate-950 hover:bg-slate-800 border border-slate-800 px-3 py-2 rounded-lg text-slate-300 transition flex items-center justify-between"
                >
                  <span>2. Main Landing (Pos 4 - Top 10 Guard)</span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>
          </div>

          {/* System Rules Info Card */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-1">
              <Info className="w-4 h-4" />
              Sistem Temel Kuralları
            </div>
            <p>• <strong className="text-slate-200">Evidence &gt; Consensus:</strong> Çoğunluk oyu geçersizdir, sadece doğrulanmış ham kanıt kabul edilir.</p>
            <p>• <strong className="text-slate-200">Recheck Loop:</strong> Çelişkili iddialara otomatik itiraz gönderilir (Maks 3 döngü).</p>
            <p>• <strong className="text-slate-200">Position Matrix:</strong> Sıralama 1-50 arasında ise yeni URL açılması engellenir.</p>
          </div>
        </div>

        {/* Right Column: AI Analysis & Judge Results */}
        <div className="lg:col-span-8 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl flex items-center gap-3 text-sm">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!result && !loading && !error && (
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center text-slate-500 space-y-3">
              <Cpu className="w-12 h-12 mx-auto text-slate-700" />
              <h3 className="text-base font-medium text-slate-300">Analiz Başlatılmayı Bekliyor</h3>
              <p className="text-xs max-w-md mx-auto text-slate-500">
                Sol taraftaki form üzerinden parametreleri girin veya hızlı test butonlarından birine tıklayarak 4 AI modelli SEO analizini başlatın.
              </p>
            </div>
          )}

          {loading && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-4 backdrop-blur-sm">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
                <BrainCircuit className="w-8 h-8 text-indigo-400 absolute inset-0 m-auto" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Multi-Agent Ekibi Çalışıyor</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Claude, ChatGPT, Gemini ve Perplexity çapraz sorgulama yürütüyor...
                </p>
              </div>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-6">
              {/* 4 AI Agents Overview Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.agentResults?.map((agent: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-sm text-white flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-indigo-400" />
                        {agent.agentName}
                      </span>
                      <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                        {agent.executionTimeMs}ms
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mb-3 line-clamp-2">
                      {agent.summary}
                    </p>

                    <div className="space-y-2">
                      {agent.findings?.map((f: any, fIdx: number) => (
                        <div key={fIdx} className="bg-slate-950/60 border border-slate-800/60 p-2.5 rounded-lg text-xs">
                          <div className="font-semibold text-slate-200 flex items-center justify-between">
                            <span>{f.finding}</span>
                            <span className="text-[10px] text-indigo-400 font-mono">{(f.confidence * 100).toFixed(0)}%</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1">{f.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Disagreement & Recheck Log */}
              {result.finalDecision?.disagreements?.length > 0 && (
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6">
                  <h3 className="text-sm font-semibold text-amber-400 mb-4 flex items-center gap-2">
                    <Scale className="w-4 h-4" />
                    AI Disagreements & Challenge Rechecks (Evidence &gt; Consensus)
                  </h3>

                  <div className="space-y-3">
                    {result.finalDecision.disagreements.map((dis: any, dIdx: number) => (
                      <div key={dIdx} className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs space-y-2">
                        <div className="flex items-center justify-between font-semibold text-slate-200">
                          <span>{dis.topic}</span>
                          <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded font-mono text-[10px]">
                            JUDGE: {dis.judgeDecision}
                          </span>
                        </div>
                        <p className="text-slate-400">{dis.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FINAL CLAUDE JUDGE DECISION CARD */}
              <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-2xl p-6 backdrop-blur-md shadow-2xl space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-500/20 pb-4">
                  <div>
                    <span className="text-xs uppercase tracking-wider font-semibold text-indigo-400">
                      Nihai Hakem Kararı (Final Decision)
                    </span>
                    <h2 className="text-xl font-extrabold text-white mt-1 flex items-center gap-2">
                      <ShieldCheck className="w-6 h-6 text-emerald-400" />
                      {result.finalDecision.decision}
                    </h2>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-wider text-slate-400">Güven Skoru</div>
                      <div className="text-sm font-bold font-mono text-emerald-400">
                        %{(result.finalDecision.confidenceScore * 100).toFixed(0)}
                      </div>
                    </div>
                    <div className="text-right border-l border-slate-800 pl-3">
                      <div className="text-[10px] uppercase tracking-wider text-slate-400">Risk Seviyesi</div>
                      <div className="text-sm font-bold text-indigo-300">
                        {result.finalDecision.riskLevel}
                      </div>
                    </div>
                    <button
                      onClick={copyReport}
                      className="ml-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 p-2 rounded-lg transition"
                      title="JSON Raporunu Kopyala"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Reasoning */}
                <div className="text-xs text-slate-300 bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl leading-relaxed">
                  <strong className="text-indigo-400 block mb-1">Gerekçe & Strateji:</strong>
                  {result.finalDecision.reasoning}
                </div>

                {/* DO & DO NOT DO Lists */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* DO List */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Yapılacaklar (DO)
                    </h4>
                    <div className="space-y-2">
                      {result.finalDecision.doList?.map((item: string, iIdx: number) => (
                        <div key={iIdx} className="bg-emerald-950/20 border border-emerald-500/20 p-3 rounded-xl text-xs text-slate-200 flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* DO NOT DO List */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
                      <XCircle className="w-4 h-4" />
                      Yapılmayacaklar (DO NOT DO)
                    </h4>
                    <div className="space-y-2">
                      {result.finalDecision.doNotList?.map((item: string, iIdx: number) => (
                        <div key={iIdx} className="bg-rose-950/20 border border-rose-500/20 p-3 rounded-xl text-xs text-slate-200 flex items-start gap-2.5">
                          <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
