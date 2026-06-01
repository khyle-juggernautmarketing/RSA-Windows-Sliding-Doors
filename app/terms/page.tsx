import Link from 'next/link'
import { BRAND_NAME, EMAIL, PHONE_PRIMARY, PHONE_PRIMARY_HREF } from '@/lib/constants'

export const metadata = {
  title: 'Terms & Conditions',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-16">
      <article className="prose prose-stone mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-semibold text-amber-700 hover:underline">
          ← Back to home
        </Link>
        <h1 className="font-display mt-6 text-3xl font-bold text-stone-900">
          Terms &amp; Conditions
        </h1>
        <p className="text-stone-600">Last updated: June 1, 2026</p>

        <section className="mt-8 space-y-4 text-stone-800">
          <p>
            By using the {BRAND_NAME} website and submitting a quote request, you agree to these
            Terms &amp; Conditions.
          </p>
          <h2 className="text-xl font-bold text-stone-900">Services</h2>
          <p>
            All window and door work is subject to on-site assessment, permitting requirements, and
            a written proposal. Pricing, timelines, and warranties are provided in your project
            agreement.
          </p>
          <h2 className="text-xl font-bold text-stone-900">SMS terms</h2>
          <p>
            By providing your mobile number and checking consent boxes on our form, you authorize
            RSA Windows to send SMS messages related to your inquiry, project updates, and — if
            separately consented — promotional offers. You may opt out of marketing texts at any time
            by replying STOP.
          </p>
          <h2 className="text-xl font-bold text-stone-900">Limitation of liability</h2>
          <p>
            Website content is provided for general information. {BRAND_NAME} is not liable for
            decisions made solely on the basis of website materials without a professional
            assessment.
          </p>
          <h2 className="text-xl font-bold text-stone-900">Contact</h2>
          <p>
            For questions about these terms, contact us at{' '}
            <a href={`mailto:${EMAIL}`} className="text-amber-700 hover:underline">
              {EMAIL}
            </a>{' '}
            or{' '}
            <a href={PHONE_PRIMARY_HREF} className="text-amber-700 hover:underline">
              {PHONE_PRIMARY}
            </a>
            .
          </p>
        </section>
      </article>
    </div>
  )
}
