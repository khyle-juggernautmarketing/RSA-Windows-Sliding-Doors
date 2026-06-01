import type { MetadataRoute } from 'next'
import { BRAND_NAME } from '@/lib/constants'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BRAND_NAME,
    short_name: 'RSA Windows',
    description:
      'Hurricane-impact windows and sliding doors in Hollywood, Naples, and coastal Florida.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fafaf9',
    theme_color: '#2B2625',
    icons: [
      { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
    ],
  }
}
