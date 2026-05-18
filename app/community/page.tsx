import type { Metadata } from 'next'
import Link from 'next/link'
import { Users, Wind, MessageCircle, Calendar, ArrowRight, MapPin } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Ölüdeniz Paragliding Community | Pilots, Events & Local Flying',
  description:
    'Connect with the Ölüdeniz paragliding community. WhatsApp groups, daily weather briefings, fly coordination, local events, and the Babadağ pilot scene.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/community' },
}

const groups = [
  {
    icon: MessageCircle,
    title: 'Daily Weather & Fly Group',
    platform: 'WhatsApp',
    members: '200+ active pilots',
    desc: 'The main daily group used by local and visiting pilots. Morning weather reports, launch conditions, and fly coordination. Ask to be added when you arrive.',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    icon: Users,
    title: 'Babadağ XC Pilots',
    platform: 'WhatsApp',
    members: '80+ XC pilots',
    desc: 'Cross-country specific group. Route sharing, retrieve coordination, XC task days, and competition discussion.',
    color: 'text-sky-600',
    bg: 'bg-sky-50',
  },
  {
    icon: Wind,
    title: 'Acro Pilots Ölüdeniz',
    platform: 'WhatsApp / Telegram',
    members: '40+ acro pilots',
    desc: 'For pilots into aerobatics. Coordination for winch tows, synchro practice, and the annual acro event.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
]

const events = [
  {
    month: 'May',
    name: 'Season Opener Flying Week',
    type: 'Recreational',
    desc: 'Guided flying week to kick off the season. Open to all levels. Social barbecue evening on the beach.',
  },
  {
    month: 'June',
    name: 'SIV Clinic (Water)',
    type: 'Training',
    desc: 'Annual open SIV clinic over the sea. Limited places — register early.',
  },
  {
    month: 'July',
    name: 'Babadağ XC Week',
    type: 'Competition',
    desc: 'Informal XC week with daily tasks from Babadağ. Not a formal competition — participation scoring only.',
  },
  {
    month: 'September',
    name: 'Ölüdeniz Acro Show',
    type: 'Show / Event',
    desc: 'Annual acro demonstration and open flying event. Spectators welcome on the beach.',
  },
  {
    month: 'October',
    name: 'Season Closer Fly-In',
    type: 'Recreational',
    desc: 'End-of-season gathering. Mass launch from 1700m, group photo, dinner in town.',
  },
]

const meetingPoints = [
  {
    location: 'Babadağ Launch (1200m)',
    time: '08:30 daily',
    desc: 'The main morning meeting point. Pilots gather before the first thermal flight. Weather debrief usually happens here.',
  },
  {
    location: 'Ölüdeniz Beach (Main Landing)',
    time: 'After flying',
    desc: 'The social hub after morning flights. Many pilots have coffee and debrief at the landing area café.',
  },
  {
    location: 'Ölüdeniz Village — Pilot Café',
    time: 'Evenings',
    desc: 'An informal pilot hangout in the village. Good place to meet locals, swap stories, and plan the next day.',
  },
]

export default function CommunityPage() {
  return (
    <>
      <PageHero
        title="The Ölüdeniz Pilot Community"
        subtitle="Connect with hundreds of local and visiting pilots at one of the world's most welcoming flying sites."
        badge="Community"
        bgImage="https://images.unsplash.com/photo-1491555103944-7c647fd857e6?w=1920&q=85"
      />

      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3">
          <BreadcrumbNav
            items={[
              { label: 'Pilot Services', href: '/pilot-services' },
              { label: 'Community' },
            ]}
          />
        </div>
      </div>

      {/* Intro */}
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            A Global Community, One Mountain
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Babadağ attracts paragliders from all over the world, and Ölüdeniz has developed one
            of the most welcoming and active flying communities anywhere. On a good summer morning
            the launch area is alive with pilots from Turkey, Germany, the UK, France, Russia,
            Australia, Japan — all drawn to the same mountain.
          </p>
          <p className="text-slate-600 leading-relaxed">
            The community organises itself primarily through WhatsApp groups — weather reports go
            out every morning at 07:30, and the groups buzz with conditions updates and fly
            coordination throughout the day. Visiting pilots are always welcomed — just ask to
            be added to the groups when you arrive.
          </p>
        </div>
      </section>

      {/* WhatsApp Groups */}
      <section className="section-padding bg-slate-50">
        <div className="container-default">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Pilot Communication Groups</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {groups.map((group) => {
              const Icon = group.icon
              return (
                <div key={group.title} className="card p-6">
                  <div className={`w-12 h-12 ${group.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${group.color}`} />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">{group.title}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                      {group.platform}
                    </span>
                    <span className="text-xs text-slate-500">{group.members}</span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{group.desc}</p>
                </div>
              )
            })}
          </div>
          <div className="mt-8 bg-orange-50 border border-orange-200 rounded-xl p-5">
            <p className="text-orange-800 text-sm">
              <strong>How to join:</strong> Visit us at the launch area or contact us by email and we will add you to the appropriate groups. All visitors with a valid licence are welcome.
            </p>
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="section-padding bg-white">
        <div className="container-default max-w-4xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">
            <Calendar className="w-6 h-6 text-orange-500 inline mr-2" />
            Annual Events
          </h2>
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.name} className="card p-6 flex gap-5 items-start">
                <div className="w-16 text-center flex-shrink-0">
                  <p className="font-bold text-orange-500 text-sm">{event.month}</p>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-slate-900">{event.name}</h3>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                      {event.type}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm">{event.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meeting Points */}
      <section className="section-padding bg-slate-50">
        <div className="container-default max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            <MapPin className="w-6 h-6 text-orange-500 inline mr-2" />
            Where Pilots Meet
          </h2>
          <div className="space-y-4">
            {meetingPoints.map((point) => (
              <div key={point.location} className="card p-5">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900 mb-0.5">{point.location}</p>
                    <p className="text-orange-600 text-xs font-semibold mb-2">{point.time}</p>
                    <p className="text-slate-600 text-sm">{point.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Links */}
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Useful Links for Visiting Pilots</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { href: '/pilot-services', label: 'Pilot Services Overview', icon: Users },
              { href: '/pilot-services/equipment-rental', label: 'Equipment Rental', icon: Wind },
              { href: '/training', label: 'Training Courses', icon: Wind },
              { href: '/babadag-guide', label: 'Babadağ Guide', icon: MapPin },
            ].map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="card p-4 flex items-center gap-3 hover:shadow-md transition-shadow group"
                >
                  <Icon className="w-5 h-5 text-orange-500" />
                  <span className="font-medium text-slate-900 group-hover:text-orange-600 transition-colors text-sm">
                    {link.label}
                  </span>
                  <ArrowRight className="w-4 h-4 text-orange-500 ml-auto" />
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
