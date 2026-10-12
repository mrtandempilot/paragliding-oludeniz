// Uçuş Masası operasyon bilgisi: settings tablosunda JSON olarak tutulur.
export const OPS_KEY = 'flight_ops'
export const WA_HANDLED_KEY = 'wa_handled'
export type FlightOps = { pickup?: string; hotel?: string; pilot?: string; paid?: boolean; note?: string; updatedAt?: string }
