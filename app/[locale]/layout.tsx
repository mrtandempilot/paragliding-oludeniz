import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'

// Build-time'da her locale icin statik sayfa uretir (generateStaticParams olmadan
// next-intl'in headers() kullanimi yuzunden TUM site her istekte dinamik render
// ediliyordu - Vercel Fluid Active CPU kotasi bu yuzden hizla tukeniyordu).
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const { locale } = params

  if (!routing.locales.includes(locale as 'en' | 'tr' | 'de' | 'ru')) {
    notFound()
  }

  // Statik render'a izin vermek icin locale'i erken sabitler (next-intl gereksinimi)
  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}
