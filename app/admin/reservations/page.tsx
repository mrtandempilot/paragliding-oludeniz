import { supabase } from '@/lib/supabase'
import ReservationsClient from './ReservationsClient'

export default async function ReservationsPage() {
  const { data } = await supabase
    .from('reservations')
    .select('*')
    .order('created_at', { ascending: false })

  return <ReservationsClient reservations={data || []} />
}
