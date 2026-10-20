// Uçuş Masası operasyon bilgisi: settings tablosunda JSON olarak tutulur.
export const OPS_KEY = 'flight_ops'
export const WA_HANDLED_KEY = 'wa_handled'
// Panelde "Gördüm" denmiş yeni rezervasyonların id listesi
export const BOOKING_SEEN_KEY = 'desk_bookings_seen'
export type FlightOps = { pickup?: string; hotel?: string; pilot?: string; paid?: boolean; note?: string; updatedAt?: string }
