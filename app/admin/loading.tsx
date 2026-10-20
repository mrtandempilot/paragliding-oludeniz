// Shown instantly while an admin page is being prepared on the server.
export default function AdminLoading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-500">
      <div className="h-10 w-10 rounded-full border-4 border-orange-200 border-t-orange-500 animate-spin" />
      <p className="text-sm">Panel yükleniyor…</p>
    </div>
  )
}
