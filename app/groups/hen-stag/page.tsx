import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import FAQAccordion from '@/components/shared/FAQAccordion'

export const metadata: Metadata = {
  title: 'Hen & Stag Paragliding Ölüdeniz | Group Flights Babadağ',
  description: 'Paragliding for hen and stag parties at Ölüdeniz. Tandem flights from Babadağ for groups, group discounts, photo packages and beach landing celebrations.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/groups/hen-stag' },
}

const faqItems = [
  { question: 'Do we all fly at the same time?', answer: 'Not simultaneously — tandem flights launch every 2–5 minutes from the top. A group of 10 will all be in the air within about 30–40 minutes of the first launch, with some overlap. The beach landing creates a natural gathering point where the whole group reunites.' },
  { question: 'Can we wear fancy dress?', answer: 'Light accessories like sashes, tiaras, or matching t-shirts are fine — your pilot will advise on anything that might catch wind. Full costumes or capes are not suitable for safety reasons. Most groups wear matching coloured t-shirts for the group photos.' },
  { question: 'Is there a minimum age or fitness requirement?', answer: 'Minimum age is 5, and there is no upper age limit. Passengers must be able to stand and run a few steps for take-off. Maximum weight is approximately 100–110kg depending on the pilot and conditions. No fitness training is required — it is a seated flight the whole way.' },
  { question: 'Can we get group photos and video?', answer: 'Yes — every tandem pilot carries a GoPro and can capture in-flight footage. For hen and stag groups, we recommend the full video package for each member so everyone has their own footage. Group photos on the beach can be coordinated by your pilot.' },
  { question: 'How far in advance should we book for a group?', answer: 'For groups of 6 or more, book at least 2–4 weeks in advance, especially in July and August. Hen and stag weekends tend to fall on Fridays and Saturdays — these slots fill the fastest. Contact us with your dates as soon as they are confirmed.' },
]

export default function HenStagPage() {
  return (
    <>
      <PageHero title="Hen & Stag Party Paragliding" subtitle="The ultimate Ölüdeniz experience for your group — tandem flights from 1700m above the Blue Lagoon." badge="Hen & Stag" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Groups', href: '/groups' }, { label: 'Hen & Stag Parties' }]} /></div></div>

      <section className="section-padding bg-white">
        <div className="container-default max-w-4xl">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Min. group size', value: '4 people' },
              { label: 'Group discount', value: 'From 10%' },
              { label: 'Flight duration', value: '25–45 min' },
              { label: 'Beach landing', value: 'Ölüdeniz' },
            ].map(item => (
              <div key={item.label} className="card p-4 text-center">
                <div className="text-xl font-bold text-orange-600 mb-1">{item.value}</div>
                <div className="text-slate-500 text-xs">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-pink-50 border border-pink-200 rounded-2xl p-5 mb-10">
            <h2 className="font-bold text-pink-900 mb-2">Why Paragliding Works for Hen & Stag Parties</h2>
            <p className="text-pink-800 text-sm leading-relaxed">Paragliding at Ölüdeniz ticks every box: it is thrilling without being extreme, the views from Babadağ are jaw-dropping, and the beach landing on the Blue Lagoon shore is one of the most photographed moments in Turkish tourism. Everyone participates, there is a natural group moment when the last person lands, and the GoPro footage becomes instant social media gold.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
            {[
              { title: 'Group Pricing', emoji: '💸', desc: 'Groups of 4–7 receive approximately 10% off the standard tandem rate. Groups of 8–15 receive around 15% off. For groups of 16+, contact us for a custom package that can include transfers, GoPro packages and beachside drinks coordination.' },
              { title: 'Coordination & Scheduling', emoji: '📋', desc: 'We coordinate the full group schedule — pilot assignments, launch order, transfer logistics and timing so the whole group arrives together and lands close to each other. No one needs to stress about logistics on the day.' },
              { title: 'GoPro Video Packages', emoji: '🎥', desc: 'Every pilot carries a GoPro. For hen and stag groups, the in-flight video is a highlight — the screams, the views, the smiles at landing. We can bundle video packages for the whole group at a reduced per-person rate.' },
              { title: 'Hotel Pickup Included', emoji: '🚐', desc: 'Your group is collected from your hotel in Ölüdeniz, Hisarönü, Ovacık or Fethiye by minibus. No need to arrange your own transport up the mountain — it is all included in the tandem package.' },
              { title: 'Beach Landing Celebration', emoji: '🥂', desc: 'The Ölüdeniz beach landing area is right next to the famous Blue Lagoon. After landing, the whole group is typically together on the beach within an hour of the first flight. It is a natural location for photos, cheers and post-flight celebrations.' },
              { title: 'Flexible Dates', emoji: '📅', desc: 'We operate every day that weather permits, from April to November. For weekend hen and stag parties, Friday and Saturday early morning slots (departures from 8am) are the calmest and most recommended. Late morning bookings can coincide with stronger thermals.' },
            ].map(item => (
              <div key={item.title} className="card p-5">
                <span className="text-2xl mb-3 block">{item.emoji}</span>
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-4">What to Expect on the Day</h2>
            <div className="space-y-3">
              {[
                { step: '1', text: 'Hotel pickup — your minibus collects the group from your accommodation, typically 45–60 minutes before your first scheduled flight.' },
                { step: '2', text: 'Babadağ summit — the drive or cable car takes you to 1700m. Your pilot briefs you individually and fits the harness.' },
                { step: '3', text: 'Launch sequence — flights depart every few minutes. Watching your friends launch is part of the fun.' },
                { step: '4', text: '25–45 minute flight — your pilot flies you over the Blue Lagoon, Ölüdeniz beach and the coastline.' },
                { step: '5', text: 'Beach landing — you land on Ölüdeniz beach and wait for the rest of the group. Group photos happen naturally here.' },
              ].map(item => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-orange-600 text-white text-sm font-bold flex items-center justify-center shrink-0">{item.step}</div>
                  <p className="text-slate-600 text-sm leading-relaxed pt-1">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <FAQAccordion items={faqItems} title="Hen & Stag FAQ" />
        </div>
      </section>

      <BookingCTA title="Book Your Hen or Stag Party Flight" subtitle="Tell us your group size and dates — we'll handle the rest." variant="orange" />
    </>
  )
}
