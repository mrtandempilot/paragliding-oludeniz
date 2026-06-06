export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}

export const navigation: NavItem[] = [
  {
    label: 'Tandem Flights',
    href: '/tandem-paragliding',
    children: [
      { label: 'First Time Flying', href: '/tandem-paragliding/first-time' },
      { label: 'Sunset Flight', href: '/tandem-paragliding/sunset-flight' },
      { label: 'Group Flights', href: '/tandem-paragliding/group-flights' },
      { label: 'Safety Guide', href: '/tandem-paragliding/safety-guide' },
      { label: 'FAQ', href: '/tandem-paragliding/faq' },
    ],
  },
  {
    label: 'Babadağ',
    href: '/babadag-guide',
    children: [
      { label: 'Babadağ Guide', href: '/babadag-guide' },
      { label: 'Takeoff Points', href: '/babadag-guide/takeoff-1200m' },
      { label: 'Landing Zones', href: '/babadag-guide/landing-main-beach' },
      { label: 'Cable Car (Teleferik)', href: '/babadag-teleferik' },
      { label: 'Road Guide', href: '/babadag-road-guide' },
    ],
  },
  {
    label: 'Flying',
    href: '/solo-paragliding',
    children: [
      { label: 'Solo Paragliding', href: '/solo-paragliding' },
      { label: 'Cross Country (XC)', href: '/cross-country-flights' },
      { label: 'Acro Flights', href: '/acro-flights' },
      { label: 'Paramotor', href: '/paramotor' },
      { label: 'BASE Jump', href: '/base-jump' },
    ],
  },
  {
    label: 'Weather',
    href: '/weather-guide',
    children: [
      { label: 'Weather Guide', href: '/weather-guide' },
      { label: 'Best Months', href: '/weather-guide/best-months' },
      { label: 'Thermals Guide', href: '/thermals-guide' },
      { label: 'Live Weather', href: '/live-weather' },
    ],
  },
  {
    label: 'Pilots',
    href: '/pilot-services',
    children: [
      { label: 'Pilot Services', href: '/pilot-services' },
      { label: 'Training', href: '/training' },
      { label: 'Equipment Rental', href: '/pilot-services/equipment-rental' },
      { label: 'Community', href: '/community' },
    ],
  },
  {
    label: 'Blog',
    href: '/blog',
  },
  {
        label: 'Contact',
        href: '/contact',
  },
]
