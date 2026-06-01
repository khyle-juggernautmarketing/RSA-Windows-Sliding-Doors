import type { Metadata, Viewport } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import {
  BRAND_NAME,
  EMAIL,
  GEO_CITIES,
  OWNER,
  PHONE_PRIMARY_HREF,
  SITE_URL,
} from '@/lib/constants'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
})

const defaultDescription =
  'RSA Windows & Sliding Doors — hurricane-impact window installation, sliding glass door solutions, and coastal glazing restoration in Hollywood, Naples, and South & Southwest Florida. 160 MPH+ rated, code-compliant, $0 down financing.'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#2B2625',
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: BRAND_NAME,
  title: {
    default: 'RSA Windows & Sliding Doors | Hurricane Impact Windows Hollywood & Naples FL',
    template: `%s | ${BRAND_NAME}`,
  },
  appleWebApp: {
    title: BRAND_NAME,
    capable: true,
    statusBarStyle: 'default',
  },
  description: defaultDescription,
  keywords: [
    'hurricane impact windows Hollywood FL',
    'impact sliding doors Naples FL',
    'sliding glass door repair South Florida',
    'Florida building code windows',
    'coastal window installation',
    '160 MPH impact windows',
    'RSA Windows',
    'Rom Yehoshua windows',
  ],
  authors: [{ name: BRAND_NAME, url: SITE_URL }],
  creator: BRAND_NAME,
  publisher: BRAND_NAME,
  formatDetection: { telephone: true, email: true, address: true },
  alternates: { canonical: SITE_URL },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.svg', sizes: 'any' },
    ],
    apple: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'RSA Windows & Sliding Doors | Coastal Impact Protection',
    description: defaultDescription,
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: BRAND_NAME,
    images: [{ url: '/logo.svg', width: 1200, height: 630, alt: `${BRAND_NAME} logo` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RSA Windows & Sliding Doors | Hurricane Impact Windows',
    description: defaultDescription,
    images: ['/logo.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  category: 'construction',
}

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  name: BRAND_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
  image: `${SITE_URL}/logo.svg`,
  telephone: PHONE_PRIMARY_HREF.replace('tel:', ''),
  email: EMAIL,
  description: defaultDescription,
  founder: { '@type': 'Person', name: OWNER },
  address: [
    {
      '@type': 'PostalAddress',
      addressLocality: 'Hollywood',
      addressRegion: 'FL',
      addressCountry: 'US',
    },
    {
      '@type': 'PostalAddress',
      addressLocality: 'Naples',
      addressRegion: 'FL',
      addressCountry: 'US',
    },
  ],
  areaServed: GEO_CITIES.map((c) => ({
    '@type': 'City',
    name: c.label ?? c.name,
  })),
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '17:00',
    },
  ],
  priceRange: '$$',
  knowsAbout: [
    'Hurricane impact window installation',
    'Impact sliding door installation',
    'Sliding glass door repair',
    'Commercial storefront glazing',
    'Florida Building Code compliance',
  ],
}

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: `${BRAND_NAME} — Hurricane Impact Windows & Sliding Doors`,
  description: defaultDescription,
  url: SITE_URL,
  inLanguage: 'en-US',
  isPartOf: { '@type': 'WebSite', name: BRAND_NAME, url: SITE_URL },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What wind rating do RSA impact windows meet?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'RSA installs systems rated for 160 MPH+ wind loads and Florida Building Code compliance.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where does RSA Windows serve in Florida?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'RSA serves Hollywood, Naples, and coastal communities across South and Southwest Florida.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is financing available for window replacement?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — RSA offers flexible financing options including $0 down for qualifying projects.',
      },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body className="font-sans" data-site="rsa-windows">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-amber-600 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}
