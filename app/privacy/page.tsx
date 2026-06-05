import Link from 'next/link'
import { BRAND_NAME, EMAIL, MARKETING_SMS_CONSENT } from '@/lib/constants'

export const metadata = {
  title: 'Privacy Policy',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-16">
      <article className="prose prose-stone mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-semibold text-amber-700 hover:underline">
          ← Back to home
        </Link>
        <h1 className="font-display mt-6 text-3xl font-bold text-stone-900">Privacy Policy</h1>
        <p className="text-stone-600">Last updated: June 1, 2026</p>

        <section className="mt-8 space-y-4 text-stone-800">
          <p>
            {BRAND_NAME} (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy.
            This policy describes how we collect, use, and protect information submitted through our
            website and lead forms.
          </p>
          <h2 className="text-xl font-bold text-stone-900">Information we collect</h2>
          <p>
            When you request a quote, we may collect your name, email, phone number, property
            address, service preferences, timeline information, and SMS consent choices
            you provide voluntarily.
          </p>
          <h2 className="text-xl font-bold text-stone-900">SMS communications</h2>
          <p>
            If you opt in, we may send marketing or informational text messages as described at the
            time of consent. Message frequency may vary. Message and data rates may apply. Text STOP
            to opt out of marketing messages. Consent is not a condition of purchase.
          </p>
          <p className="text-sm text-stone-600">{MARKETING_SMS_CONSENT}</p>
          <h2 className="text-xl font-bold text-stone-900">How we use information</h2>
          <p>
            We use your information to respond to inquiries, schedule assessments, prepare
            proposals, and deliver window and door installation services you request.
          </p>
          <h2 className="text-xl font-bold text-stone-900">Contact</h2>
          <p>
            Questions about this policy may be directed to{' '}
            <a href={`mailto:${EMAIL}`} className="text-amber-700 hover:underline">
              {EMAIL}
            </a>
            .
          </p>
        </section>
      </article>
    </div>
  )
}
