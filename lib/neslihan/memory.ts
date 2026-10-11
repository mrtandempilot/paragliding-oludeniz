// Neslihan's memory: notes, reminders and insights she should remember across
// conversations. Stored as one JSON value in the existing `settings` table
// (key: neslihan_memory) so no migration is needed; small and single-user.

import crypto from 'crypto'
import { getSupabase, istanbulDate } from '@/lib/admin/dashboard-data'

export type MemoryKind = 'note' | 'reminder' | 'insight'
export type MemoryItem = { id: string; kind: MemoryKind; content: string; due?: string; done?: boolean; created: string }

const KEY = 'neslihan_memory'
const MAX_ITEMS = 300

export async function loadMemory(): Promise<MemoryItem[]> {
  const { data } = await getSupabase().from('settings').select('value').eq('key', KEY).maybeSingle()
  try {
    const items = JSON.parse(data?.value || '[]')
    return Array.isArray(items) ? items : []
  } catch {
    return []
  }
}

async function saveMemory(items: MemoryItem[]) {
  // keep open reminders, drop the oldest finished/plain items first
  const sorted = [...items].sort((a, b) => b.created.localeCompare(a.created))
  const keep = sorted.filter(i => i.kind === 'reminder' && !i.done)
  for (const i of sorted) if (keep.length < MAX_ITEMS && !keep.includes(i)) keep.push(i)
  const { error } = await getSupabase().from('settings').upsert({ key: KEY, value: JSON.stringify(keep) }, { onConflict: 'key' })
  if (error) throw new Error(error.message)
}

export async function addMemory(kind: MemoryKind, content: string, due?: string) {
  const text = content.trim()
  if (!text) throw new Error('Not boş')
  const items = await loadMemory()
  const item: MemoryItem = {
    id: crypto.randomBytes(3).toString('hex'),
    kind,
    content: text.slice(0, 1000),
    ...(due && /^\d{4}-\d{2}-\d{2}$/.test(due) ? { due } : {}),
    created: new Date().toISOString(),
  }
  await saveMemory([item, ...items])
  return item
}

export async function completeMemory(id: string) {
  const items = await loadMemory()
  const item = items.find(i => i.id === id)
  if (!item) throw new Error('Bu kayıt bulunamadı')
  item.done = true
  await saveMemory(items)
  return item
}

// Short text block injected into the session instructions.
export async function memoryForPrompt(): Promise<string> {
  const items = await loadMemory().catch(() => [] as MemoryItem[])
  if (!items.length) return 'Henüz kayıtlı not yok.'
  const today = istanbulDate(0)
  const open = items.filter(i => i.kind === 'reminder' && !i.done).sort((a, b) => (a.due || '9').localeCompare(b.due || '9'))
  const notes = items.filter(i => i.kind !== 'reminder' && !i.done).slice(0, 25)
  const lines: string[] = []
  if (open.length) {
    lines.push('Açık hatırlatmalar:')
    for (const r of open.slice(0, 20)) {
      const tag = r.due ? (r.due < today ? ' (GECİKTİ)' : r.due === today ? ' (BUGÜN)' : '') : ''
      lines.push(`- [${r.id}] ${r.due ? r.due + tag + ': ' : ''}${r.content}`)
    }
  }
  if (notes.length) {
    lines.push('Notlar ve önceki tespitler (yeniden eskiye):')
    for (const n of notes) lines.push(`- [${n.id}] ${n.created.slice(0, 10)} ${n.kind === 'insight' ? '(tespit) ' : ''}${n.content}`)
  }
  return lines.join('\n')
}
