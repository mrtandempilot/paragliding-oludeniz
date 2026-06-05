import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'tr', 'de', 'ru'],
  defaultLocale: 'en',
  localePrefix: 'as-needed'
})
