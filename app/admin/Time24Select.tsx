'use client'

// 24-hour time picker (HH:MM) with no AM/PM.
// The browser's <input type="time"> follows the computer's clock setting; on a
// 12-hour (AM/PM) system picking "12" + AM silently becomes 00:00. This avoids that.
const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const STEP_MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'))

export default function Time24Select({
  value,
  onChange,
  allowEmpty = false,
  selectClassName = '',
  ariaLabel = 'Saat',
}: {
  value: string
  onChange: (v: string) => void
  allowEmpty?: boolean
  selectClassName?: string
  ariaLabel?: string
}) {
  const m = /^(\d{1,2}):(\d{2})/.exec(value || '')
  const hh = m ? m[1].padStart(2, '0') : ''
  const mm = m ? m[2] : ''
  const minutes = mm && !STEP_MINUTES.includes(mm) ? [...STEP_MINUTES, mm].sort() : STEP_MINUTES

  return (
    <div className="flex items-center gap-1 w-full min-w-0">
      <select
        aria-label={`${ariaLabel} (saat)`}
        value={hh}
        onChange={e => {
          const h = e.target.value
          onChange(h ? `${h}:${mm || '00'}` : '')
        }}
        className={selectClassName}
      >
        {(allowEmpty || !hh) && <option value="">--</option>}
        {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
      </select>
      <span aria-hidden>:</span>
      <select
        aria-label={`${ariaLabel} (dakika)`}
        value={mm}
        disabled={!hh}
        onChange={e => onChange(`${hh || '00'}:${e.target.value}`)}
        className={selectClassName}
      >
        {!mm && <option value="">--</option>}
        {minutes.map(x => <option key={x} value={x}>{x}</option>)}
      </select>
    </div>
  )
}
