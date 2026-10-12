import { redirect } from 'next/navigation'

// Ajan Ofisi artık Mission Control içinde.
export default function AgentOfficePage() {
  redirect('/admin/mission-control')
}
