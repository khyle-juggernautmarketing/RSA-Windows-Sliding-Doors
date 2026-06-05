import Link from 'next/link'
import { CheckCircle2, Phone } from 'lucide-react'
import {
  BRAND_NAME,
  PHONE_PRIMARY,
  PHONE_PRIMARY_HREF,
} from '@/lib/constants'

export const metadata = {
  title: 'Thank You',
  robots: { index: false, follow: false },
}

type Props = {
  searchParams: Promise<{
    name?: string
    appointment?: string
    skipped?: string
  }>
}

function formatAppointment(iso: string) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(iso))
  } catch {
    return null
  }
}

export default async function ThankYouPage({ searchParams }: Props) {
  const params = await searchParams
  const name = params.name?.trim() || 'there'
  const appointment = params.appointment ? formatAppointment(params.appointment) : null
  const skipped = params.skipped === '1'

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-slate-900">
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(217,119,6,0.12)_0%,_transparent_55%)]"
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
        <div className="w-full rounded-3xl border border-stone-700/60 bg-white/95 p-8 shadow-2xl backdrop-blur-md sm:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
            <CheckCircle2 className="h-12 w-12 text-amber-600" strokeWidth={2} aria-hidden />
          </div>

          <h1 className="mt-8 font-display text-3xl font-extrabold text-stone-900 sm:text-4xl">
            Thank You, {name}!
          </h1>

          {appointment ? (
            <>
              <p className="mt-4 text-lg text-stone-700">
                Your free impact assessment is scheduled for:
              </p>
              <p className="mt-3 rounded-2xl border border-amber-200 bg-amber-50/60 px-6 py-4 text-base font-semibold text-stone-900">
                {appointment}
                <span className="mt-1 block text-sm font-normal text-stone-600">
                  Eastern Time (ET) · 90-minute visit window
                </span>
              </p>
            </>
          ) : skipped ? (
            <p className="mt-4 text-lg leading-relaxed text-stone-600">
              We received your request. Our team will contact you shortly to coordinate your
              assessment.
            </p>
          ) : (
            <p className="mt-4 text-lg leading-relaxed text-stone-600">
              Your request has been received. A member of the {BRAND_NAME} team will be in touch
              soon.
            </p>
          )}

          <p className="mt-6 text-sm text-stone-500">
            Questions before your visit? Call us anytime during business hours.
          </p>

          <a
            href={PHONE_PRIMARY_HREF}
            className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-600 to-yellow-500 px-8 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:shadow-amber-500/20"
          >
            <Phone className="h-4 w-4" aria-hidden />
            {PHONE_PRIMARY}
          </a>

          <Link
            href="/"
            className="mt-8 inline-flex min-h-12 items-center text-sm font-semibold text-amber-700 underline decoration-amber-600/40 underline-offset-4 hover:text-amber-600"
          >
            ← Back to home
          </Link>
        </div>

        <p className="mt-8 text-xs text-stone-500">
          © {new Date().getFullYear()} {BRAND_NAME}
        </p>
      </div>
    </div>
  )
}
