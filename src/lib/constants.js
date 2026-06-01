export const BRAND_NAME = 'RSA Windows & Sliding Doors'
export const BRAND_TITLE = 'RSA WINDOWS & SLIDING DOORS'

export const OWNER = 'Rom Yehoshua'

export const PHONE_PRIMARY = '+1 239-372-4621'
export const PHONE_PRIMARY_HREF = 'tel:+12393724621'

export const EMAIL = 'Office@rsawindows.com'

export const OPERATING_HOURS =
  'Hours: Mon-Fri: 8:00 AM – 5:00 PM / Sat-Sun: Closed'

export const LOCATIONS_HQ = ['Hollywood, FL', 'Naples, FL']
export const ADDRESS_REGION =
  'South Florida & Southwest Florida Coastal Corridors'

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://127.0.0.1:3115')

export const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Metrics', href: '#metrics' },
  { label: 'Process', href: '#process' },
  { label: 'Locations', href: '#locations' },
]

export const FOOTER_LINKS = NAV_LINKS

export const ANNOUNCEMENT_TEXT =
  '🛡️ Hurricane-Rated Protection & Up to 40% Energy Savings. Serving Hollywood & Naples. Call:'

export const HERO_BADGE =
  '🟢 Code-Compliant & Expertly Engineered — Directed by Rom Yehoshua'

export const VALUE_PROPS = [
  {
    title: '160 MPH+ Wind Load Rated',
    description: 'Built to withstand heavy coastal storm-forces.',
  },
  {
    title: 'Up to 40% Energy Savings',
    description: 'Advanced Low-E glass technology that rejects solar heat gain.',
  },
  {
    title: '100% Code-Compliant Systems',
    description: "Perfectly leveled, sealed, and integrated into your home's envelope.",
  },
]

export const METRICS = [
  { value: '160 MPH+', label: 'Wind Load Safety Rated' },
  { value: '100%', label: 'Building Code Compliant' },
  { value: '40%', label: 'Average Utility Energy Savings' },
  { value: '$0 Down', label: 'Flexible Financing Available' },
]

export const PROCESS_STEPS = [
  {
    step: 1,
    title: 'Technical Assessment',
    description:
      'Map out structural dimensions and specific frame wind-loads via our zero-obligation portal.',
  },
  {
    step: 2,
    title: 'Precision Fit Craftsmanship',
    description:
      'Our master technicians verify alignments so frames are perfectly leveled and integrated.',
  },
  {
    step: 3,
    title: 'Thermal Shield Deployment',
    description:
      'Final installation completes a tight seal, utilizing advanced Low-E glass technology.',
  },
]

export const GEO_CITIES = [
  { name: 'Hollywood', featured: true, label: 'Hollywood, FL' },
  { name: 'Naples', featured: true, label: 'Naples, FL' },
  { name: 'Cape Coral', featured: false },
  { name: 'Bonita Springs', featured: false },
  { name: 'Fort Myers Beach', featured: false },
  { name: 'Estero', featured: false },
  { name: 'Ave Maria', featured: false },
  { name: 'Fort Lauderdale', featured: false },
  { name: 'Pembroke Pines', featured: false },
  { name: 'Miramar', featured: false },
  { name: 'Davie', featured: false },
  { name: 'Dania Beach', featured: false },
  { name: 'Hallandale Beach', featured: false },
]

export const FOOTER_TAGLINE =
  'Dedicated to the engineering of high-performance architectural systems. Protecting what matters most under the leadership of Rom Yehoshua.'

export const CERTIFICATION_FOOTNOTE =
  '100% Florida Building Code compliant installations with permitting and inspection support across coastal zones.'

export const MARKETING_SMS_CONSENT =
  'I consent to receive marketing and promotional messages via SMS from RSA Windows. Message frequency may vary. Message/data rates may apply. Text STOP to opt out.'

export const INFORMATIONAL_SMS_CONSENT =
  'I consent to receive informational messages, such as updates and alerts, via SMS from RSA Windows. View our Privacy Policy & SMS Terms.'
