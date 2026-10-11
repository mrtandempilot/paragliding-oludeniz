import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 lg:flex-row">
      <AdminSidebar />
      <main className="min-w-0 flex-1 overflow-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  )
}
