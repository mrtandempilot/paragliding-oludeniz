import Link from 'next/link'
import { Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

          {/* Brand */}
          <div className="flex-shrink-0">
            <Link href="/" className="inline-block mb-3">
              <span className="text-xl font-bold text-white">
                🪂 <span className="text-orange-500">Paragliding</span> Ölüdeniz
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
              World-class tandem paragliding from Babadağ Mountain over the Blue Lagoon of Ölüdeniz, Turkey.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-2.5 text-sm">
            <a href="tel:+905364616674" className="flex items-center gap-2 text-slate-400 hover:text-orange-400 transition-colors">
              <Phone className="w-4 h-4 flex-shrink-0" />
              +90 536 461 6674
            </a>
            <a href="mailto:info@paragliding-oludeniz.com" className="flex items-center gap-2 text-slate-400 hover:text-orange-400 transition-colors">
              <Mail className="w-4 h-4 flex-shrink-0" />
              info@paragliding-oludeniz.com
            </a>
            <div className="flex items-start gap-2 text-slate-400">
              <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Ölüdeniz, Fethiye, Muğla, Turkey</span>
            </div>
          </div>

          {/* Social */}
          <div className="flex gap-3">
            <a
              href="https://instagram.com/paragliding.oludeniz"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-slate-800 hover:bg-orange-500 rounded-xl flex items-center justify-center transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5 text-white" />
            </a>
            <a
              href="https://facebook.com/paraglidingoludeniz"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-xl flex items-center justify-center transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5 text-white" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Paragliding Ölüdeniz. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
