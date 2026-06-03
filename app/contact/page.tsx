import type { Metadata } from 'next'
import { Phone, Mail, MapPin, MessageCircle, Clock } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Contact Us | Paragliding Ölüdeniz',
  description:
    'Get in touch with Paragliding Ölüdeniz. Call, WhatsApp or email us to book a tandem flight or ask any questions. We respond within 2 hours.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/contact' },
}

export default function ContactPage() {
  return (
    <>
      <PageHero title="Contact Us" subtitle="We respond within 2 hours. Reach us by phone, WhatsApp, or email." size="sm" />

      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3">
          <BreadcrumbNav items={[{ label: 'Contact' }]} />
        </div>
      </div>

      <section className="section-padding bg-white">
        <div className="container-default">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Left — Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Get in Touch</h2>
              <div className="space-y-5">
                <a href="https://wa.me/905364616674" target="_blank" rel="noopener noreferrer"
                  className="flex items-start gap-4 p-5 bg-green-50 border border-green-200 rounded-2xl hover:bg-green-100 transition-colors group">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-green-800 mb-1">WhatsApp (Fastest)</p>
                    <p className="text-green-700 text-lg font-semibold">+90 536 461 6674</p>
                    <p className="text-green-600 text-sm mt-1">Message us anytime — we reply fast</p>
                  </div>
                </a>

                <a href="tel:+905364616674"
                  className="flex items-start gap-4 p-5 bg-sky-50 border border-sky-200 rounded-2xl hover:bg-sky-100 transition-colors">
                  <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sky-800 mb-1">Phone</p>
                    <p className="text-sky-700 text-lg font-semibold">+90 536 461 6674</p>
                    <p className="text-sky-600 text-sm mt-1">Available 08:00 – 19:00 daily</p>
                  </div>
                </a>

                <a href="mailto:info@paragliding-oludeniz.com"
                  className="flex items-start gap-4 p-5 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-slate-100 transition-colors">
                  <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 mb-1">Email</p>
                    <p className="text-slate-700 font-semibold">info@paragliding-oludeniz.com</p>
                    <p className="text-slate-500 text-sm mt-1">We reply within 2 hours</p>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-5 bg-orange-50 border border-orange-200 rounded-2xl">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-orange-800 mb-1">Office Location</p>
                    <p className="text-orange-700">Ölüdeniz Mahallesi, Fethiye</p>
                    <p className="text-orange-700">Muğla, Turkey</p>
                    <p className="text-orange-600 text-sm mt-1">On the main beach road, next to the lagoon entrance</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="w-12 h-12 bg-slate-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 mb-1">Opening Hours</p>
                    <p className="text-slate-700">Daily: 08:00 – 19:00</p>
                    <p className="text-slate-700">Season: April – October</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Form */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Send a Message</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">First Name</label>
                    <input type="text" className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name</label>
                    <input type="text" className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                  <input type="email" className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                  <select className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400">
                    <option>Booking enquiry</option>
                    <option>Group booking</option>
                    <option>Solo / licensed pilot</option>
                    <option>General question</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                  <textarea rows={5} className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" placeholder="Tell us what you need..." />
                </div>
                <button type="submit" className="btn-primary w-full justify-center py-4">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps Section */}
      <section className="bg-slate-50 py-12">
        <div className="container-default">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Find Us on the Map</h2>
          <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3185.8!2d29.1164!3d36.5497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c040a3b8468e7f%3A0xf8b926c9bf70503f!2sParagliding%20Oludeniz%20-%20Babada%C4%9F!5e0!3m2!1sen!2str!4v1717000000000!5m2!1sen!2str"
              width="100%"
              height="420"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Paragliding Oludeniz - Find us on Google Maps"
            />
          </div>
          <p className="text-center text-slate-500 text-sm mt-4">
            📍 Ölüdeniz Mahallesi, Fethiye, Muğla — on the main beach road
          </p>
        </div>
      </section>
    </>
  )
}
