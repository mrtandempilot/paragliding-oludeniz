import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'

export default function BookingCTABanner() {
  return (
    <section className="bg-gradient-to-r from-sky-700 via-sky-600 to-blue-700 py-16">
      <div className="container-default text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Fly Over the Blue Lagoon?
        </h2>
        <p className="text-sky-100 text-lg max-w-xl mx-auto mb-8">
          Tandem flights available daily from April to October. Book online in 2 minutes or
          call us directly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/book-now"
            className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-xl transition-all text-base shadow-lg hover:shadow-xl"
          >
            Book Your Flight Now
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="tel:+905364616674"
            className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold px-8 py-4 rounded-xl transition-all text-base"
          >
            <Phone className="w-5 h-5" />
            +90 536 461 6674
          </a>
        </div>
        <p className="text-sky-200 text-sm mt-6">
          Free cancellation up to 24 hours before your flight · Secure online payment
        </p>
      </div>
    </section>
  )
}
