'use client'

import { Menu, Phone, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  ANNOUNCEMENT_TEXT,
  BRAND_TITLE,
  NAV_LINKS,
  PHONE_PRIMARY,
  PHONE_PRIMARY_HREF,
} from '@/lib/constants'

const RIBBON_H = '2.5rem'

export function Navbar() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50 overflow-hidden">
      <div
        className="bg-stone-950 py-2 text-center text-xs font-medium tracking-wide text-stone-300 md:text-sm"
        style={{ minHeight: RIBBON_H }}
      >
        <p className="px-3 leading-snug">
          <span className="inline sm:inline">{ANNOUNCEMENT_TEXT} </span>
          <a
            href={PHONE_PRIMARY_HREF}
            className="inline-block min-h-11 whitespace-nowrap py-1 text-amber-500 underline decoration-amber-500/40 underline-offset-2 transition-colors hover:text-amber-400 sm:min-h-0 sm:py-0"
          >
            {PHONE_PRIMARY}
          </a>
        </p>
      </div>

      <div className="border-b border-stone-200/80 bg-white/95 backdrop-blur-md transition-all duration-300 ease-in-out">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 lg:py-4">
          <Link
            href="#"
            className="flex min-h-12 shrink-0 items-center gap-3"
            aria-label="RSA Windows home"
          >
            <Image
              src="/images/logo.jpeg"
              alt="RSA Windows & Sliding Doors"
              width={48}
              height={48}
              className="h-10 w-auto max-w-[3.5rem] shrink-0 object-contain sm:h-11 sm:max-w-[4rem]"
              priority
            />
            <div className="min-w-0 border-l border-stone-200 pl-3">
              <p className="font-display text-[11px] font-extrabold leading-tight tracking-wide text-stone-900 sm:text-xs md:text-sm">
                {BRAND_TITLE}
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative flex min-h-12 items-center text-xs font-bold uppercase tracking-widest text-stone-600 transition-colors duration-300 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-amber-600 after:transition-all hover:text-stone-900 hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center lg:flex">
            <a
              href={PHONE_PRIMARY_HREF}
              className="inline-flex min-h-12 min-w-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-600 to-yellow-500 px-5 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-300 ease-in-out hover:shadow-amber-500/20"
              aria-label={`Call now ${PHONE_PRIMARY}`}
            >
              <Phone className="h-4 w-4 shrink-0" aria-hidden />
              <span className="hidden xl:inline">{PHONE_PRIMARY}</span>
              <span className="xl:hidden">Call Now</span>
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex min-h-12 min-w-12 items-center justify-center rounded-lg text-stone-900 lg:hidden"
            aria-label="Open menu"
            aria-expanded={open}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[60] bg-stone-950/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />

      <div
        className={`fixed right-0 top-0 z-[70] flex h-full w-[min(100%,20rem)] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-4 py-4">
          <span className="font-display text-sm font-bold text-stone-900">RSA Windows</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex min-h-12 min-w-12 items-center justify-center rounded-lg text-stone-800"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-4" aria-label="Mobile navigation">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="nav-mobile-link flex min-h-12 items-center rounded-lg px-4 text-base font-semibold text-stone-800 transition-colors hover:bg-stone-100"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="border-t border-stone-200 p-4">
          <a
            href={PHONE_PRIMARY_HREF}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-600 to-yellow-500 text-sm font-semibold text-white shadow-lg"
          >
            <Phone className="h-4 w-4" aria-hidden />
            {PHONE_PRIMARY}
          </a>
        </div>
      </div>
    </header>
  )
}

export const NAV_OFFSET = 'calc(2.5rem + 4.25rem)'
