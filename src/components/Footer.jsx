import Link from 'next/link'
import {
  BRAND_NAME,
  CERTIFICATION_FOOTNOTE,
  EMAIL,
  FOOTER_LINKS,
  FOOTER_TAGLINE,
  LOCATIONS_HQ,
  OPERATING_HOURS,
  PHONE_PRIMARY,
  PHONE_PRIMARY_HREF,
} from '@/lib/constants'

export function Footer() {
  return (
    <footer className="overflow-hidden border-t border-stone-800 bg-stone-950 px-4 py-16 text-stone-400">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-4">
        <div>
          <p className="font-display text-xl font-bold text-white">{BRAND_NAME}</p>
          <p className="mt-4 text-sm leading-relaxed">{FOOTER_TAGLINE}</p>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-white">Navigation</p>
          <ul className="mt-4 space-y-2">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="inline-flex min-h-12 items-center text-sm transition-colors duration-300 hover:text-amber-500"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-white">Contact</p>
          <address className="mt-4 space-y-3 text-sm not-italic leading-relaxed">
            {LOCATIONS_HQ.map((loc) => (
              <p key={loc}>{loc}</p>
            ))}
            <p>
              <a
                href={`mailto:${EMAIL}`}
                className="transition-colors duration-300 hover:text-amber-500"
              >
                {EMAIL}
              </a>
            </p>
            <p>
              <a
                href={PHONE_PRIMARY_HREF}
                className="font-semibold text-white transition-colors duration-300 hover:text-amber-500"
              >
                {PHONE_PRIMARY}
              </a>
            </p>
          </address>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-white">
            Operational Standards &amp; Credentials
          </p>
          <p className="mt-4 text-sm leading-relaxed">
            <span aria-hidden className="mr-1">
              🕒
            </span>
            {OPERATING_HOURS}
          </p>
          <p className="mt-4 text-sm leading-relaxed">{CERTIFICATION_FOOTNOTE}</p>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-stone-800 pt-8 text-xs sm:flex-row">
        <p>© 2026 RSA Windows &amp; Sliding Doors. All rights reserved.</p>
        <div className="flex gap-6">
          <Link
            href="/privacy"
            className="flex min-h-12 items-center transition-colors duration-300 hover:text-white"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="flex min-h-12 items-center transition-colors duration-300 hover:text-white"
          >
            Terms &amp; Conditions
          </Link>
        </div>
      </div>
    </footer>
  )
}
