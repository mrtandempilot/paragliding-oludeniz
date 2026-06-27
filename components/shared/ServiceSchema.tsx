const BASE_URL = 'https://atmosparagliding.com'

type ServiceSchemaProps = {
  name: string
  description: string
  path: string
  serviceType?: string
}

/**
 * Service JSON-LD for commercial pages.
 * Linked to the homepage LocalBusiness via provider @id.
 */
export default function ServiceSchema({ name, description, path, serviceType }: ServiceSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    serviceType: serviceType || 'Tandem Paragliding Flight',
    url: `${BASE_URL}${path}`,
    provider: {
      '@type': 'LocalBusiness',
      '@id': `${BASE_URL}/#business`,
      name: 'Atmos Paragliding',
      telephone: '+905364616674',
    },
    areaServed: {
      '@type': 'Place',
      name: 'Ölüdeniz, Fethiye, Muğla, Turkey',
    },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
