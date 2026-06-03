import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingForm from './BookingForm'

export const metadata: Metadata = {
  title: 'Book Paragliding Ölüdeniz | Reserve Your Tandem Flight',
  description:
    'Book your tandem paragliding flight in Ölüdeniz online. Instant confirmation. Free cancellation. Flights daily April to October from Babadağ Mountain.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/book-now' },
}

export default function BookNowPage() {
  return (
    <>
      <PageHero
        title="Book Your Paragliding Flight"
        subtitle="Reserve your spot in minutes. Free cancellation up to 24 hours before your flight."
        badge="Book Online"
        size="sm"
      />
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3">
          <BreadcrumbNav items={[{ label: 'Book Now' }]} />
        </div>
      </div>
      <BookingForm />
    </>
  )
}
