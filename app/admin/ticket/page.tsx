'use client'

import TicketModal, { type Booking } from '../bookings/TicketModal'

const EMPTY_BOOKING: Booking = {
  id: '',
  created_at: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  flight_type: 'standard',
  flight_date: '',
  guests: 1,
  addon_photo: false,
  addon_video: false,
  addon_bundle: false,
  base_price: 0,
  addon_price: 0,
  total_price: 0,
  notes: '',
  status: 'manual',
}

export default function TicketPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Bilet Bas</h1>
        <p className="text-slate-500 text-sm mt-1">
          Rezervasyon kaydı olmadan müşteri/acente için bilet oluştur. Görsel olarak indir veya WhatsApp metni olarak kopyala.
        </p>
      </div>
      <TicketModal booking={EMPTY_BOOKING} inline />
    </div>
  )
}
