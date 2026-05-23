'use client'

// ─── Cron Job Takvim Paneli ─────────────────────────────────────────────────
// Her gün çalışan otomasyon görevlerini saat bazlı timeline olarak gösterir.
// Geçmiş görevler ✅, aktif saat penceresi 🔵, gelecek görevler ⬜ renklenir.

import { Bot, Instagram, RefreshCw, Rss, Clock, CheckCircle2, Circle, Loader2 } from 'lucide-react'

interface CronJob {
  time: string        // "06:00" İstanbul saati
  utcTime: string     // "06:00" UTC
  label: string
  description: string
  icon: React.ElementType
  color: string
  bgColor: string
  borderColor: string
  repeat?: string     // "Her 30 dk" gibi
  isRepeat?: boolean
}

const CRON_JOBS: CronJob[] = [
  {
    time: '09:00',
    utcTime: '06:00',
    label: 'ContentPilot — Sabah',
    description: 'SEO makalesi + görsel oluşturur, Supabase\'e kaydeder',
    icon: Bot,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  {
    time: '09:00',
    utcTime: '06:00',
    label: 'Instagram Auto Post',
    description: 'En son makaleden AI caption üretir, Instagram\'a direkt gönderir',
    icon: Instagram,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
  },
  {
    time: '13:00',
    utcTime: '10:00',
    label: 'Instagram Analytics Sync',
    description: 'Like, yorum, reach, impression verilerini çeker ve günceller',
    icon: RefreshCw,
    color: 'text-sky-600',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
  },
  {
    time: '15:00',
    utcTime: '12:00',
    label: 'ContentPilot — Öğlen',
    description: 'Bekleyen topic varsa yeni makale ve görsel üretir',
    icon: Bot,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  {
    time: '21:00',
    utcTime: '18:00',
    label: 'ContentPilot — Akşam',
    description: 'Günün son içerik üretim döngüsü, sitemap günceller',
    icon: Bot,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  {
    time: 'Her 30 dk',
    utcTime: '*/30',
    label: 'Zamanlanmış Post Yayınlayıcı',
    description: 'Sırası gelen Instagram postlarını otomatik yayınlar',
    icon: Rss,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    isRepeat: true,
    repeat: 'Her 30 dakikada bir',
  },
]

function getNowIstanbul(): number {
  // UTC offset +3 (Turkey, TRT)
  const now = new Date()
  const utcHours = now.getUTCHours()
  const utcMinutes = now.getUTCMinutes()
  return (utcHours + 3) * 60 + utcMinutes // dakika cinsinden İstanbul saati
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function getJobStatus(job: CronJob, nowMinutes: number): 'done' | 'active' | 'upcoming' {
  if (job.isRepeat) return 'active' // her zaman aktif
  const jobMinutes = timeToMinutes(job.time)
  if (nowMinutes > jobMinutes + 30) return 'done'
  if (nowMinutes >= jobMinutes - 5 && nowMinutes <= jobMinutes + 30) return 'active'
  return 'upcoming'
}

export default function DashboardCronPanel() {
  const nowMinutes = getNowIstanbul()
  const nowHour = Math.floor(nowMinutes / 60)
  const nowMin = nowMinutes % 60
  const nowStr = `${String(nowHour).padStart(2, '0')}:${String(nowMin).padStart(2, '0')}`

  // Group by time for display
  const grouped: Record<string, CronJob[]> = {}
  for (const job of CRON_JOBS) {
    const key = job.isRepeat ? 'repeat' : job.time
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(job)
  }

  // Sort: fixed times first (ascending), then repeat
  const sortedKeys = Object.keys(grouped).sort((a, b) => {
    if (a === 'repeat') return 1
    if (b === 'repeat') return -1
    return timeToMinutes(a) - timeToMinutes(b)
  })

  // Stats
  const doneCount = CRON_JOBS.filter(j => !j.isRepeat && getJobStatus(j, nowMinutes) === 'done').length
  const totalFixed = CRON_JOBS.filter(j => !j.isRepeat).length

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center">
            <Clock className="w-4 h-4 text-slate-600" />
          </div>
          <h2 className="font-bold text-slate-900">Günlük Otomasyon Takvimi</h2>
          <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full">
            İstanbul Saati
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Şu an {nowStr}</span>
          <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">
            {doneCount}/{totalFixed} tamamlandı
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-5 space-y-0">
        {sortedKeys.map((key, groupIdx) => {
          const jobs = grouped[key]
          const isRepeat = key === 'repeat'
          const displayTime = isRepeat ? 'Her 30 dk' : key

          // Determine group status
          const groupStatus = isRepeat ? 'active' : getJobStatus(jobs[0], nowMinutes)

          return (
            <div key={key} className="relative">
              {/* Vertical line connector */}
              {groupIdx < sortedKeys.length - 1 && (
                <div className="absolute left-[23px] top-[52px] bottom-0 w-0.5 bg-slate-100 z-0" />
              )}

              <div className="relative z-10 flex gap-4 pb-5">
                {/* Time column */}
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  {/* Status dot */}
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    groupStatus === 'done'
                      ? 'bg-slate-100'
                      : groupStatus === 'active'
                        ? 'bg-blue-500 shadow-md shadow-blue-200'
                        : 'bg-slate-50 border border-slate-200'
                  }`}>
                    {groupStatus === 'done' ? (
                      <CheckCircle2 className="w-5 h-5 text-slate-400" />
                    ) : groupStatus === 'active' ? (
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300" />
                    )}
                  </div>
                  <span className={`text-[11px] font-bold tabular-nums ${
                    groupStatus === 'done' ? 'text-slate-400' :
                    groupStatus === 'active' ? 'text-blue-600' : 'text-slate-500'
                  }`}>
                    {displayTime}
                  </span>
                </div>

                {/* Jobs column */}
                <div className="flex-1 flex flex-col gap-2 pt-1">
                  {jobs.map((job, jobIdx) => {
                    const Icon = job.icon
                    const status = isRepeat ? 'active' : getJobStatus(job, nowMinutes)
                    return (
                      <div
                        key={jobIdx}
                        className={`flex items-start gap-3 rounded-xl border p-3 transition-all ${
                          status === 'done'
                            ? 'bg-slate-50 border-slate-100 opacity-60'
                            : status === 'active'
                              ? `${job.bgColor} ${job.borderColor} shadow-sm`
                              : 'bg-white border-slate-100'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          status === 'done' ? 'bg-slate-100' : job.bgColor
                        }`}>
                          <Icon className={`w-4 h-4 ${status === 'done' ? 'text-slate-400' : job.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`text-sm font-semibold ${
                              status === 'done' ? 'text-slate-500' : 'text-slate-900'
                            }`}>
                              {job.label}
                            </p>
                            {status === 'active' && (
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${job.bgColor} ${job.color}`}>
                                {isRepeat ? 'Sürekli Aktif' : 'Çalışıyor'}
                              </span>
                            )}
                            {status === 'done' && (
                              <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
                                Tamamlandı ✓
                              </span>
                            )}
                          </div>
                          <p className={`text-xs mt-0.5 ${
                            status === 'done' ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                            {job.isRepeat ? job.repeat + ' · ' : ''}{job.description}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-[10px] text-slate-400">UTC</p>
                          <p className="text-xs font-semibold text-slate-500">{job.utcTime}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer note */}
      <div className="px-5 pb-4 pt-0">
        <p className="text-[11px] text-slate-400 bg-slate-50 rounded-lg px-3 py-2">
          💡 Tüm görevler Vercel cron tarafından çalıştırılır. Aktif görevler deploy edilince başlar.
        </p>
      </div>
    </div>
  )
}
