import Link from 'next/link'
import { ArrowRight, Star, Shield, Clock } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&q=85')",
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-hero" />
      {/* Gradient bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-2 mb-8">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-white text-sm font-medium">
            World&apos;s Top Paragliding Destination · Babadağ 1960m
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight text-balance">
          Fly Over the{' '}
          <span className="text-orange-400">Blue Lagoon</span>
          <br />
          of Ölüdeniz
        </h1>

        <p className="text-lg sm:text-xl text-white/85 max-w-2xl mx-auto mb-10 leading-relaxed">
          Experience the most breathtaking tandem paragliding flight in Turkey. Launch from
          Babadağ Mountain and soar above turquoise waters, ancient ruins and the world-famous
          Blue Lagoon.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
          <Link href="/book-now" className="btn-primary text-base px-8 py-4">
            Book Your Flight
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/tandem-paragliding" className="btn-outline-white text-base px-8 py-4">
            Learn More
          </Link>
        </div>

        {/* Trust Signals */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
          <div className="flex items-center gap-2 text-white/80">
            <Shield className="w-5 h-5 text-green-400" />
            <span className="text-sm font-medium">Fully Certified & Insured</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium">4.9 / 5 — 2,400+ Reviews</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <Clock className="w-5 h-5 text-sky-400" />
            <span className="text-sm font-medium">25+ Years of Experience</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center pt-2">
          <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  )
}
