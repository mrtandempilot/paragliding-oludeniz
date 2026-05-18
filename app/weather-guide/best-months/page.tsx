import type { Metadata } from 'next'
import Link from 'next/link'
import { Sun, CloudRain, Wind, Thermometer, ArrowRight, CheckCircle } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'

export const metadata: Metadata = {
  title: 'Best Months for Paragliding in Ölüdeniz | Season Guide',
  description:
    'When is the best time to paraglide in Ölüdeniz? Month-by-month guide to flying conditions, weather, thermals and crowds at Babadağ Mountain.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/weather-guide/best-months' },
}

const months = [
  {
    month: 'April',
    rating: 4,
    verdict: 'Good',
    verdictColor: 'text-green-600 bg-green-50',
    temp: '18–24°C',
    flyability: '75%',
    thermals: 'Building',
    crowds: 'Low',
    summary:
      'Early season. Weather is warming up and conditions are generally good. Some rain days still possible. Thermals building but not yet full strength. Great for beginners as it is calmer.',
  },
  {
    month: 'May',
    rating: 5,
    verdict: 'Excellent',
    verdictColor: 'text-emerald-600 bg-emerald-50',
    temp: '22–28°C',
    flyability: '85%',
    thermals: 'Good',
    crowds: 'Low–Medium',
    summary:
      'One of the best months. Good thermals, warm temperatures, low crowds, and the landscape is still green and lush. Ideal for XC pilots and tandem guests alike.',
  },
  {
    month: 'June',
    rating: 5,
    verdict: 'Excellent',
    verdictColor: 'text-emerald-600 bg-emerald-50',
    temp: '26–32°C',
    flyability: '90%',
    thermals: 'Strong',
    crowds: 'Medium',
    summary:
      'Peak flying season begins. Very reliable thermals, low chance of rain, long flying days. The sea breeze starts to kick in predictably in the afternoon. Ideal for all levels.',
  },
  {
    month: 'July',
    rating: 4,
    verdict: 'Good',
    verdictColor: 'text-green-600 bg-green-50',
    temp: '30–36°C',
    flyability: '92%',
    thermals: 'Very Strong',
    crowds: 'High',
    summary:
      'Best flying conditions of the year technically, but very hot and crowded. Thermals can be turbulent midday — beginners should aim for morning flights. Sunset flights are magical.',
  },
  {
    month: 'August',
    rating: 4,
    verdict: 'Good',
    verdictColor: 'text-green-600 bg-green-50',
    temp: '30–36°C',
    flyability: '92%',
    thermals: 'Very Strong',
    crowds: 'Very High',
    summary:
      'Same as July — peak summer. Busiest month for tourists. Morning flights recommended. The Blue Lagoon is at its most vivid blue. Book well in advance.',
  },
  {
    month: 'September',
    rating: 5,
    verdict: 'Excellent',
    verdictColor: 'text-emerald-600 bg-emerald-50',
    temp: '27–33°C',
    flyability: '88%',
    thermals: 'Excellent',
    crowds: 'Medium',
    summary:
      'Arguably the best month overall. Crowds drop significantly after peak summer, thermals remain strong, and the light is golden. Highly recommended for XC and solo pilots.',
  },
  {
    month: 'October',
    rating: 4,
    verdict: 'Good',
    verdictColor: 'text-green-600 bg-green-50',
    temp: '22–28°C',
    flyability: '75%',
    thermals: 'Moderate',
    crowds: 'Low',
    summary:
      'End of season. Still good flying, pleasant temperatures, very quiet. Some rain days start to appear. Thermals less reliable in the second half of October. Season officially closes end of month.',
  },
]

export default function BestMonthsPage() {
  return (
    <>
      <PageHero
        title="Best Months for Paragliding in Ölüdeniz"
        subtitle="Month-by-month breakdown of flying conditions, thermals, weather, and crowds at Babadağ."
        badge="Season Guide"
        bgImage="https://images.unsplash.com/photo-1601134467661-3d775b999c18?w=1920&q=85"
      />

      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3">
          <BreadcrumbNav
            items={[
              { label: 'Weather Guide', href: '/weather-guide' },
              { label: 'Best Months' },
            ]}
          />
        </div>
      </div>

      {/* Season Overview */}
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">The Flying Season: April to October</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Ölüdeniz and Babadağ Mountain offer one of the longest paragliding seasons anywhere
            in Europe — approximately 7 months of reliable flying from April through to the end of
            October, with around 300 flyable days per year. The mountain faces south-west, which
            means it catches the afternoon sea breeze perfectly and maintains consistent conditions
            throughout the season.
          </p>
          <p className="text-slate-600 leading-relaxed mb-8">
            The absolute best months for combining good thermals, good weather, and manageable
            crowds are <strong>May, June, and September</strong>. If you can only choose one month,
            September is the sweet spot — excellent conditions with far fewer tourists than July
            and August.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Best for Beginners', months: 'May, early June', icon: '🎉' },
              { label: 'Best for XC / Solo', months: 'June, July, September', icon: '🏆' },
              { label: 'Best Value', months: 'April, May, October', icon: '💰' },
            ].map((item) => (
              <div key={item.label} className="bg-slate-50 rounded-xl p-5 text-center">
                <span className="text-3xl block mb-2">{item.icon}</span>
                <p className="font-bold text-slate-900 text-sm mb-1">{item.label}</p>
                <p className="text-orange-600 font-semibold text-sm">{item.months}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Month by Month */}
      <section className="section-padding bg-slate-50">
        <div className="container-default max-w-4xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Month-by-Month Guide</h2>
          <div className="space-y-4">
            {months.map((m) => (
              <div key={m.month} className="card p-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="sm:w-40 flex-shrink-0">
                    <h3 className="font-bold text-slate-900 text-xl">{m.month}</h3>
                    <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full mt-1 ${m.verdictColor}`}>
                      {m.verdict}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">{m.summary}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { icon: Thermometer, label: 'Temperature', value: m.temp },
                        { icon: Sun, label: 'Flyability', value: m.flyability },
                        { icon: Wind, label: 'Thermals', value: m.thermals },
                        { icon: CloudRain, label: 'Crowds', value: m.crowds },
                      ].map((stat) => {
                        const Icon = stat.icon
                        return (
                          <div key={stat.label} className="bg-slate-50 rounded-lg p-3 text-center">
                            <Icon className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                            <p className="font-semibold text-slate-900 text-sm">{stat.value}</p>
                            <p className="text-slate-400 text-xs">{stat.label}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Extra Tips */}
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">General Flying Tips</h2>
          <div className="space-y-3">
            {[
              'Morning flights (before 10:00) are smoother and better for beginners.',
              'Afternoon thermals can be strong — experienced pilots only from noon onwards in peak summer.',
              'The sea breeze (Meltemi) arrives predictably in the afternoon, July–August.',
              'Sunset flights are calmer and offer spectacular light — highly recommended.',
              'Check the mountain-top forecast, not just the beach forecast — conditions differ significantly.',
            ].map((tip) => (
              <div key={tip} className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-slate-700">{tip}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link
              href="/weather-guide"
              className="inline-flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700"
            >
              Full weather guide <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="container-default max-w-2xl">
          <BookingCTA
            title="Ready to Book Your Flight?"
            subtitle="Tandem flights available daily April–October. Best availability: May, June, September."
          />
        </div>
      </section>
    </>
  )
}
