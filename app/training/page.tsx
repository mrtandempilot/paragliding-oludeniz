import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Clock, Users, Star, Shield, CheckCircle, GraduationCap } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import FAQAccordion from '@/components/shared/FAQAccordion'
import BookingCTA from '@/components/shared/BookingCTA'

export const metadata: Metadata = {
  title: 'Paragliding Training Ölüdeniz | CP, SIV, XC Courses on Babadağ',
  description:
    'Paragliding training courses in Ölüdeniz at Babadağ Mountain. CP beginner courses, SIV clinics, XC coaching, and guided flying weeks. All levels welcome.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/training' },
}

const courses = [
  {
    level: 'Beginner',
    badge: 'CP Course',
    badgeColor: 'bg-green-100 text-green-700',
    title: 'Complete Beginner (CP)',
    duration: '8–10 days',
    groupSize: 'Max 4 students',
    price: 'From €850',
    description:
      'Start from zero and finish with your IPPI 4 / national CP licence. Learn ground handling, launches, landings, and basic flight theory. Babadağ is one of the best learning sites in the world.',
    includes: [
      'All ground school theory',
      'Ground handling training',
      'Supervised hill flights',
      'Mountain flights from 1200m',
      'Equipment loan during course',
      'Licence registration',
    ],
  },
  {
    level: 'Intermediate',
    badge: 'SIV Clinic',
    badgeColor: 'bg-sky-100 text-sky-700',
    title: 'SIV Clinic (over Water)',
    duration: '3 days',
    groupSize: 'Max 6 pilots',
    price: 'From €490',
    description:
      'Learn to handle collapses, spirals, B-stalls and full stalls safely over the sea — with boat support and instructors on the water. Transform your confidence in the air.',
    includes: [
      'Full theory day (day 1)',
      'Water SIV exercises (days 2–3)',
      'Boat and safety support',
      'Video debrief after each flight',
      'Harness/glider check included',
      'Certificate of completion',
    ],
  },
  {
    level: 'Intermediate+',
    badge: 'XC Clinic',
    badgeColor: 'bg-amber-100 text-amber-700',
    title: 'Cross Country Clinic',
    duration: '5 days',
    groupSize: 'Max 5 pilots',
    price: 'From €650',
    description:
      'Unlock the XC potential of Babadağ. Learn thermal reading, cloud streets, course lines, retrieve logistics and weather interpretation for cross-country flights from the mountain.',
    includes: [
      'Daily weather briefings',
      '5 guided XC flights',
      'Radio coaching in the air',
      'GPS track analysis & debrief',
      'Retrieve by van included',
      'Airspace briefing for the region',
    ],
  },
  {
    level: 'All Levels',
    badge: 'Flying Week',
    badgeColor: 'bg-purple-100 text-purple-700',
    title: 'Guided Flying Week',
    duration: '7 days',
    groupSize: 'Max 8 pilots',
    price: 'From €490',
    description:
      'A week of guided flying on Babadağ with a local expert. Daily launches, site exploration, weather briefings, and social flights. Perfect for visiting pilots who want to maximise their week.',
    includes: [
      'Daily guided flights',
      'Morning weather briefings',
      'Multiple launch heights',
      'Introduction to local XC routes',
      'Optional equipment rental',
      'Social evenings with pilot group',
    ],
  },
]

const faqItems = [
  {
    question: 'Do I need to bring my own equipment for courses?',
    answer:
      'For beginner CP courses, all equipment is provided. For SIV and XC clinics, you should ideally bring your own glider as you will be flying it at SIV limits. Equipment rental is available for those who need it — contact us when booking.',
  },
  {
    question: 'When are courses available?',
    answer:
      'We run courses from May through October. Beginner courses run throughout the season. SIV clinics are held in May, June and September — the best months for calm conditions. XC clinics are July and August when thermals are strongest.',
  },
  {
    question: 'Is accommodation included in course prices?',
    answer:
      'Accommodation is not included but we can recommend excellent options in Ölüdeniz at various price points. Most of our students stay within a 5-minute walk of the cable car station. Contact us when booking and we will share our recommended accommodation list.',
  },
  {
    question: 'What qualifications do your instructors hold?',
    answer:
      'All our instructors hold Turkish SHGM paragliding instructor ratings and most also hold British BHPA or other European instructor qualifications. Our SIV instructors have completed specialised water-rescue and SIV coaching training.',
  },
  {
    question: 'Can I do a taster lesson before committing to a full course?',
    answer:
      'Yes. We offer a half-day introduction session that covers basic ground handling on the beach. This gives you a feel for the glider and the sport before committing to a full course. Contact us to arrange a taster.',
  },
]

export default function TrainingPage() {
  return (
    <>
      <PageHero
        title="Paragliding Training in Ölüdeniz"
        subtitle="Learn to paraglide or advance your skills on one of the world's greatest flying sites — Babadağ Mountain."
        badge="Training Courses"
        bgImage="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=85"
      />

      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3">
          <BreadcrumbNav
            items={[
              { label: 'Pilot Services', href: '/pilot-services' },
              { label: 'Training' },
            ]}
          />
        </div>
      </div>

      {/* Why Train Here */}
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl text-center">
          <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">
            World-Class Training Site
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mt-2 mb-4">
            Why Learn at Babadağ?
          </h2>
          <p className="text-slate-600 leading-relaxed mb-8">
            Babadağ Mountain offers beginners one of the most progressive learning environments
            in the world — from gentle training slopes at the base, to the main 1,200m launch,
            all the way to expert XC terrain above. The reliable thermals, consistent sea breeze,
            and predictable conditions make it an excellent site to build skills quickly.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: GraduationCap, label: 'Certified Instructors', color: 'text-sky-600', bg: 'bg-sky-50' },
              { icon: Shield, label: 'Safety-First Culture', color: 'text-green-600', bg: 'bg-green-50' },
              { icon: Star, label: '25+ Years Teaching', color: 'text-amber-600', bg: 'bg-amber-50' },
              { icon: Users, label: 'Small Group Sizes', color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="card p-5 text-center">
                  <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <Icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <p className="text-slate-700 text-sm font-semibold">{item.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Course Cards */}
      <section className="section-padding bg-slate-50">
        <div className="container-default">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">Available Courses</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {courses.map((course) => (
              <div key={course.title} className="card p-8">
                <div className="flex items-start justify-between mb-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${course.badgeColor}`}>
                    {course.badge}
                  </span>
                  <span className="font-bold text-orange-600 text-lg">{course.price}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{course.title}</h3>
                <div className="flex gap-4 text-sm text-slate-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {course.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {course.groupSize}
                  </span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-5">{course.description}</p>
                <ul className="space-y-1.5">
                  {course.includes.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-slate-700">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <FAQAccordion items={faqItems} title="Training FAQ" />
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="container-default max-w-2xl">
          <BookingCTA
            title="Ready to Start Your Training?"
            subtitle="Contact us to check course dates and availability. Small groups — book early."
          />
        </div>
      </section>
    </>
  )
}
