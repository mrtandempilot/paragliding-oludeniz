import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import FAQAccordion from '@/components/shared/FAQAccordion'
import BookingCTA from '@/components/shared/BookingCTA'

export const metadata: Metadata = {
  title: 'First Time Paragliding in Ölüdeniz — Complete Beginner Guide',
  description:
    'Everything first-time paragliders need to know before flying in Ölüdeniz. What to expect, what to wear, fear of heights tips, and what happens on the day.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/tandem-paragliding/first-time' },
}

const steps = [
  { step: '1', title: 'Arrive at Ölüdeniz Office', desc: 'Check in at our office on the main beach road. We\'ll take your weight and confirm your booking.' },
  { step: '2', title: 'Transfer to Babadağ', desc: 'We drive you up the mountain road or take the cable car. The journey takes about 20 minutes.' },
  { step: '3', title: 'Safety Briefing at Launch', desc: 'Your pilot gives you a clear, friendly briefing. You\'ll learn how to run at launch and what to expect.' },
  { step: '4', title: 'Gear Up', desc: 'We fit you with a comfortable harness and helmet. Your pilot connects to you — you\'re clipped together securely.' },
  { step: '5', title: 'Launch!', desc: 'You run 3–5 steps down the slope and you\'re airborne. Most people describe this moment as pure magic.' },
  { step: '6', title: 'The Flight', desc: 'Your pilot handles everything. You sit back, look at the view, and enjoy 25–45 minutes above the Blue Lagoon.' },
  { step: '7', title: 'Landing on the Beach', desc: 'You glide down to the main Ölüdeniz beach for a soft, gentle landing. Photos, smiles, unforgettable memory.' },
]

const whatToWear = [
  'Closed-toe shoes — trainers or hiking shoes (not sandals or flip flops)',
  'Comfortable trousers or leggings — avoid shorts',
  'A light jacket or hoodie — it can be 5–10°C cooler at launch',
  'Sunglasses with a strap so they don\'t fall during flight',
  'No loose scarves or dangling jewellery',
  'Hair tied back for longer hair',
]

const fearTips = [
  'Remind yourself the pilot is in full control at all times',
  'Focus on the view — looking at the horizon helps with any dizziness',
  'Take slow, deep breaths during the run-up if you feel nervous',
  'Tell your pilot you\'re nervous — they\'re trained to reassure you',
  'Remember: the moment you\'re in the air, most people say the fear disappears',
]

const faqItems = [
  {
    question: 'Will I feel sick or get dizzy during the flight?',
    answer: 'Most people feel no sickness at all — paragliding is smooth and gentle, very different from a rollercoaster. In calm morning conditions especially, it feels like floating. If you are prone to motion sickness, fly in the morning when the air is smoother and avoid eating a heavy meal beforehand.',
  },
  {
    question: 'I\'m terrified of heights. Can I still do it?',
    answer: 'Yes, and many people with a fear of heights do this every day. Interestingly, the fear of heights is triggered by being close to an edge — but once you\'re in the air and moving, there is no "edge" to look at. Most guests with height phobia describe the flight as peaceful and even therapeutic. Tell your pilot and they will help.',
  },
  {
    question: 'What if I panic during the flight?',
    answer: 'Your pilot is trained to manage anxious passengers. Simply tell them how you feel. They can guide the flight to be calmer, avoid thermals, and talk you through the experience. In 25+ years of flying, our pilots have helped thousands of nervous guests have incredible flights.',
  },
  {
    question: 'Can children do tandem paragliding?',
    answer: 'Children aged 5 and above can fly with parental consent. Children fly strapped to the pilot in a comfortable tandem harness and tend to absolutely love it. There is a minimum weight of around 15kg for the harness to fit correctly.',
  },
  {
    question: 'Do I need to be fit or sporty?',
    answer: 'Not at all. The only physical requirement is being able to run 3–5 steps on flat ground at launch. If you have a disability or mobility issue that affects this, please contact us in advance and we will advise.',
  },
]

export default function FirstTimePage() {
  return (
    <>
      <PageHero
        title="First Time Paragliding in Ölüdeniz"
        subtitle="Your complete guide to everything you need to know before your first flight."
        badge="Beginner Guide"
        size="sm"
      />

      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3">
          <BreadcrumbNav
            items={[
              { label: 'Tandem Paragliding', href: '/tandem-paragliding' },
              { label: 'First Time Guide' },
            ]}
          />
        </div>
      </div>

      {/* Intro */}
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            You Don&apos;t Need Any Experience — Here&apos;s What Actually Happens
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            If this is your first time paragliding, you probably have a hundred questions. What does it feel like? Will I be scared? What if something goes wrong? How do I actually launch? This guide answers all of them, based on 25+ years of helping first-timers fly from Babadağ Mountain.
          </p>
          <p className="text-slate-600 leading-relaxed">
            The short answer is: tandem paragliding is one of the most peaceful, exhilarating and accessible adventure activities in the world. You do very little — the pilot does everything. Most first-timers land wanting to go straight back up.
          </p>
        </div>
      </section>

      {/* Step by Step */}
      <section className="section-padding bg-slate-50">
        <div className="container-default max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">What Happens on the Day — Step by Step</h2>
          <div className="space-y-6">
            {steps.map((step) => (
              <div key={step.step} className="flex gap-5">
                <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {step.step}
                </div>
                <div className="pt-1">
                  <h3 className="font-bold text-slate-900 mb-1">{step.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What to Wear + Fear Tips */}
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-500" /> What to Wear
              </h2>
              <ul className="space-y-3">
                {whatToWear.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-slate-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-orange-500" /> If You&apos;re Nervous
              </h2>
              <ul className="space-y-3">
                {fearTips.map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-slate-700 text-sm">
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full flex-shrink-0 mt-2" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-slate-50">
        <div className="container-default max-w-3xl">
          <FAQAccordion items={faqItems} title="First Timer Questions" />
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-white">
        <div className="container-default max-w-2xl">
          <BookingCTA title="Ready to Take the Leap?" subtitle="Book your first flight online. Free cancellation. Safe, certified, unforgettable." />
        </div>
      </section>
    </>
  )
}
