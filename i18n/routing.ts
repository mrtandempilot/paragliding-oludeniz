import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'tr', 'de', 'ru', 'zh'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  localeDetection: false,
})
