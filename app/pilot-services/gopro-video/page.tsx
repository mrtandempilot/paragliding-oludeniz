import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'

export const metadata: Metadata = {
  title: 'GoPro Video Paragliding Ölüdeniz | Flight Video Package Babadağ',
  description: 'GoPro video and photo package for tandem paragliding at Ölüdeniz. What is included, video quality, delivery format and how to add the video option to your booking.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/pilot-services/gopro-video' },
}

export default function GoProVideoPage() {
  return (
    <>
      <PageHero title="GoPro Video Package" subtitle="Relive every second of your Babadağ flight in stunning 4K footage." badge="Flight Video" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Pilot Services', href: '/pilot-services' }, { label: 'GoPro Video' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Video quality', value: '4K / 1080p' },
              { label: 'Price', value: '€20–30' },
              { label: 'Delivery', value: 'USB / Download' },
              { label: 'Duration', value: 'Full flight' },
            ].map(item => (
              <div key={item.label} className="card p-4 text-center">
                <div className="text-xl font-bold text-orange-600 mb-1">{item.value}</div>
                <div className="text-slate-500 text-xs">{item.label}</div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-5">What's Included</h2>
          <div className="space-y-4 mb-10">
            {[
              { title: 'Full Flight Video', desc: 'Your entire flight from launch to landing — typically 25–45 minutes — recorded from the GoPro mounted on your pilot\'s helmet or on an extended arm for the classic selfie angle with the landscape behind.' },
              { title: 'Photo Package', desc: 'High-resolution still images captured throughout the flight. Includes launch, in-flight, acrobatic moments (if wing-overs were performed) and the approach to landing. Typically 30–80 photos depending on the pilot.' },
              { title: 'Video Editing', desc: 'Basic editing by the pilot — trimming, music addition, title card with your name and the date. Not a professional production but a great keepsake that clearly documents your experience.' },
              { title: 'Digital Delivery', desc: 'You receive your footage on a USB stick or via a download link within 30–60 minutes of landing. Most pilots at Ölüdeniz now offer cloud download options for convenience.' },
            ].map(item => (
              <div key={item.title} className="card p-5">
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-slate-900 mb-3">How to Book the Video Option</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Add the GoPro video option when booking your tandem flight — either through the booking form on this website or directly with your pilot at the launch. Confirm the video package before takeoff. Most pilots can also add the video on the day if requested at the top, subject to equipment availability.</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
            <strong>Tip:</strong> The video package is almost universally recommended — the flight goes by incredibly quickly and having the footage to watch back is one of the most valued souvenirs of an Ölüdeniz visit.
          </div>
        </div>
      </section>
      <BookingCTA title="Book Your Flight with Video Package" subtitle="Add GoPro footage to your tandem paragliding flight from Babadağ." variant="orange" />
    </>
  )
}
