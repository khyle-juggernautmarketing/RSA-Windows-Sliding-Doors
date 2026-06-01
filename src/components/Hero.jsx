import { Check } from 'lucide-react'
import Image from 'next/image'
import { HERO_BADGE, VALUE_PROPS } from '@/lib/constants'
import { LeadForm } from '@/components/LeadForm'
import { NAV_OFFSET } from '@/components/Navbar'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-stone-950">
      <Image
        src="/images/hero-bg.jpg"
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-br from-stone-950/90 via-stone-900/85 to-slate-900/90" aria-hidden />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(217,119,6,0.15)_0%,_transparent_55%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(212,175,55,0.08)_0%,_transparent_50%)]"
        aria-hidden
      />

      <div
        className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-12 sm:gap-12 sm:py-16 lg:grid-cols-12 lg:py-20"
        style={{ paddingTop: `calc(${NAV_OFFSET} + 2rem)` }}
      >
        <div className="lg:col-span-7">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-600/40 bg-stone-900/80 px-4 py-2 text-xs font-medium text-stone-200 shadow-sm backdrop-blur-sm sm:text-sm">
            {HERO_BADGE}
          </span>

          <h1 className="mt-6 font-display text-3xl font-extrabold leading-tight text-white text-balance sm:text-4xl lg:text-6xl">
            New Windows.{' '}
            <span className="bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
              Stronger Protection.
            </span>{' '}
            Cleaner Finish.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-stone-300 sm:text-lg">
            At RSA Windows, we specialize in architectural-grade impact window installations and
            premium sliding glass door solutions engineered for Florida&apos;s extreme climate.
            Precise measurements, clean workmanship, and zero shortcuts.
          </p>

          <ul className="mt-8 space-y-4">
            {VALUE_PROPS.map((prop) => (
              <li key={prop.title} className="flex gap-3 text-sm text-stone-200 sm:text-base">
                <Check
                  className="mt-0.5 h-5 w-5 shrink-0 text-amber-500"
                  strokeWidth={2.5}
                  aria-hidden
                />
                <span>
                  <strong className="font-semibold text-white">{prop.title}</strong>
                  {' — '}
                  {prop.description}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5">
          <LeadForm />
        </div>
      </div>
    </section>
  )
}
