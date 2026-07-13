export interface NavItem {
  label: Record<string, string>
  href: string
  children?: NavItem[]
}

export const navigation: NavItem[] = [
  {
    label: { en: 'Tandem Flights', tr: 'Tandem U\u00e7u\u015flar', de: 'Tandemfl\u00fcge', ru: '\u0422\u0430\u043d\u0434\u0435\u043c\u043d\u044b\u0435 \u043f\u043e\u043b\u0451\u0442\u044b' },
    href: '/tandem-paragliding',
    children: [
      { label: { en: 'First Time Flying', tr: '\u0130lk Kez U\u00e7u\u015f', de: 'Erster Flug', ru: '\u041f\u0435\u0440\u0432\u044b\u0439 \u043f\u043e\u043b\u0451\u0442' }, href: '/tandem-paragliding/first-time' },
      { label: { en: 'Sunset Flight', tr: 'G\u00fcn Bat\u0131m\u0131 U\u00e7u\u015fu', de: 'Sonnenuntergangsflug', ru: '\u0417\u0430\u043a\u0430\u0442\u043d\u044b\u0439 \u043f\u043e\u043b\u0451\u0442' }, href: '/tandem-paragliding/sunset-flight' },
      { label: { en: 'Group Flights', tr: 'Grup U\u00e7u\u015flar\u0131', de: 'Gruppenfl\u00fcge', ru: '\u0413\u0440\u0443\u043f\u043f\u043e\u0432\u044b\u0435 \u043f\u043e\u043b\u0451\u0442\u044b' }, href: '/tandem-paragliding/group-flights' },
      { label: { en: 'Safety Guide', tr: 'G\u00fcvenlik Rehberi', de: 'Sicherheitsleitfaden', ru: '\u0420\u0443\u043a\u043e\u0432\u043e\u0434\u0441\u0442\u0432\u043e \u043f\u043e \u0431\u0435\u0437\u043e\u043f\u0430\u0441\u043d\u043e\u0441\u0442\u0438' }, href: '/tandem-paragliding/safety-guide' },
      { label: { en: 'FAQ', tr: 'SSS', de: 'FAQ', ru: 'FAQ' }, href: '/tandem-paragliding/faq' },
    ],
  },
  {
    label: { en: 'Babada\u011f', tr: 'Babada\u011f', de: 'Babada\u011f', ru: '\u0411\u0430\u0431\u0430\u0434\u0430\u0433' },
    href: '/babadag-guide',
    children: [
      { label: { en: 'Babada\u011f Guide', tr: 'Babada\u011f Rehberi', de: 'Babada\u011f-Leitfaden', ru: '\u0413\u0438\u0434 \u043f\u043e \u0411\u0430\u0431\u0430\u0434\u0430\u0433\u0443' }, href: '/babadag-guide' },
      { label: { en: 'Takeoff Points', tr: 'Kalk\u0131\u015f Noktalar\u0131', de: 'Startpl\u00e4tze', ru: '\u0422\u043e\u0447\u043a\u0438 \u0441\u0442\u0430\u0440\u0442\u0430' }, href: '/babadag-guide/takeoff-1200m' },
      { label: { en: 'Landing Zones', tr: '\u0130ni\u015f Alanlar\u0131', de: 'Landezonen', ru: '\u0417\u043e\u043d\u044b \u043f\u043e\u0441\u0430\u0434\u043a\u0438' }, href: '/babadag-guide/landing-main-beach' },
      { label: { en: 'Cable Car (Teleferik)', tr: 'Teleferik', de: 'Seilbahn', ru: '\u041a\u0430\u043d\u0430\u0442\u043d\u0430\u044f \u0434\u043e\u0440\u043e\u0433\u0430' }, href: '/babadag-teleferik' },
      { label: { en: 'Road Guide', tr: 'Yol Rehberi', de: 'Stra\u00dfenleitfaden', ru: '\u0413\u0438\u0434 \u043f\u043e \u0434\u043e\u0440\u043e\u0433\u0435' }, href: '/babadag-road-guide' },
    ],
  },
  {
    label: { en: 'Flying', tr: 'U\u00e7u\u015f', de: 'Fliegen', ru: '\u041f\u043e\u043b\u0451\u0442\u044b' },
    href: '/solo-paragliding',
    children: [
      { label: { en: 'Solo Paragliding', tr: 'Solo Yama\u00e7 Para\u015f\u00fct\u00fc', de: 'Solo-Paragliding', ru: '\u0421\u043e\u043b\u043e-\u043f\u043e\u043b\u0451\u0442\u044b' }, href: '/solo-paragliding' },
      { label: { en: 'Cross Country (XC)', tr: 'XC (Yol) U\u00e7u\u015fu', de: 'Streckenflug (XC)', ru: '\u041c\u0430\u0440\u0448\u0440\u0443\u0442\u043d\u044b\u0439 \u043f\u043e\u043b\u0451\u0442 (XC)' }, href: '/cross-country-flights' },
      { label: { en: 'Acro Flights', tr: 'Akrobatik U\u00e7u\u015flar', de: 'Akrobatikfl\u00fcge', ru: '\u0410\u043a\u0440\u043e\u0431\u0430\u0442\u0438\u043a\u0430' }, href: '/acro-flights' },
      { label: { en: 'Paramotor', tr: 'Paramotor', de: 'Paramotor', ru: '\u041f\u0430\u0440\u0430\u043c\u043e\u0442\u043e\u0440' }, href: '/paramotor' },
      { label: { en: 'BASE Jump', tr: 'BASE Jump', de: 'BASE-Jump', ru: 'BASE-\u0434\u0436\u0430\u043c\u043f\u0438\u043d\u0433' }, href: '/base-jump' },
    ],
  },
  {
    label: { en: 'Weather', tr: 'Hava Durumu', de: 'Wetter', ru: '\u041f\u043e\u0433\u043e\u0434\u0430' },
    href: '/weather-guide',
    children: [
      { label: { en: 'Weather Guide', tr: 'Hava Rehberi', de: 'Wetterleitfaden', ru: '\u0413\u0438\u0434 \u043f\u043e \u043f\u043e\u0433\u043e\u0434\u0435' }, href: '/weather-guide' },
      { label: { en: 'Best Months', tr: 'En \u0130yi Aylar', de: 'Beste Monate', ru: '\u041b\u0443\u0447\u0448\u0438\u0435 \u043c\u0435\u0441\u044f\u0446\u044b' }, href: '/weather-guide/best-months' },
      { label: { en: 'Thermals Guide', tr: 'Termik Rehberi', de: 'Thermik-Leitfaden', ru: '\u0413\u0438\u0434 \u043f\u043e \u0442\u0435\u0440\u043c\u0438\u043a\u0430\u043c' }, href: '/thermals-guide' },
      { label: { en: 'Live Weather', tr: 'Canl\u0131 Hava Durumu', de: 'Live-Wetter', ru: '\u041f\u043e\u0433\u043e\u0434\u0430 \u0432 \u0440\u0435\u0430\u043b\u044c\u043d\u043e\u043c \u0432\u0440\u0435\u043c\u0435\u043d\u0438' }, href: '/live-weather' },
    ],
  },
  {
    label: { en: 'Pilots', tr: 'Pilotlar', de: 'Piloten', ru: '\u041f\u0438\u043b\u043e\u0442\u044b' },
    href: '/pilot-services',
    children: [
      { label: { en: 'Pilot Services', tr: 'Pilot Hizmetleri', de: 'Pilotendienste', ru: '\u0423\u0441\u043b\u0443\u0433\u0438 \u0434\u043b\u044f \u043f\u0438\u043b\u043e\u0442\u043e\u0432' }, href: '/pilot-services' },
      { label: { en: 'Training', tr: 'E\u011fitim', de: 'Ausbildung', ru: '\u041e\u0431\u0443\u0447\u0435\u043d\u0438\u0435' }, href: '/training' },
      { label: { en: 'Equipment Rental', tr: 'Ekipman Kiralama', de: 'Ausr\u00fcstungsverleih', ru: '\u0410\u0440\u0435\u043d\u0434\u0430 \u0441\u043d\u0430\u0440\u044f\u0436\u0435\u043d\u0438\u044f' }, href: '/pilot-services/equipment-rental' },
      { label: { en: 'Community', tr: 'Topluluk', de: 'Community', ru: '\u0421\u043e\u043e\u0431\u0449\u0435\u0441\u0442\u0432\u043e' }, href: '/community' },
    ],
  },
  {
    label: { en: 'Blog', tr: 'Blog', de: 'Blog', ru: '\u0411\u043b\u043e\u0433' },
    href: '/blog',
  },
  {
    label: { en: 'Contact', tr: '\u0130leti\u015fim', de: 'Kontakt', ru: '\u041a\u043e\u043d\u0442\u0430\u043a\u0442\u044b' },
    href: '/contact',
  },
]
