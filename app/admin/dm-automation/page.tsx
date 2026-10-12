import { redirect } from 'next/navigation'

// Otomatik DM artık Instagram sayfasının içinde.
export default function DmAutomationPage() {
  redirect('/admin/instagram#dm')
}
