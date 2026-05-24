import DmAutomation from '@/components/admin/DmAutomation'

export const metadata = {
  title: 'DM Automation',
}

export default function DmAutomationPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Otomatik DM Ayarları</h1>
        <p className="text-slate-500 mt-1">
          Biri yoruma yazdığında otomatik DM gönder — fiyat soranlar anında bilgi alsın.
        </p>
      </div>
      <div className="max-w-2xl">
        <DmAutomation />
      </div>
    </div>
  )
}
