'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  Calendar,
  CheckCircle2,
  ClipboardList,
  Loader2,
  Mail,
  Hash,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  User,
} from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  INFORMATIONAL_SMS_CONSENT,
  MARKETING_SMS_CONSENT,
  PHONE_PRIMARY,
  PHONE_PRIMARY_HREF,
} from '@/lib/constants'
import { SERVICE_OPTIONS, TIMELINE_OPTIONS } from '@/lib/formOptions'
import { getFormLoadedAt, getLeadFetchHeaders } from '@/lib/leadClient'

const STEPS = [
  { id: 1, title: 'What service do you need?' },
  { id: 2, title: 'Select Your Project Timeline' },
  { id: 3, title: 'Your contact details' },
]

const HTML_TAG = /<[^>]*>/g

const STEP_ICONS = [ClipboardList, Calendar, User]

const initialForm = {
  service: '',
  timeline: '',
  name: '',
  email: '',
  phone: '',
  address: '',
  zip: '',
  marketingSmsConsent: false,
  informationalSmsConsent: false,
}

function sanitizeInput(value) {
  return value.replace(HTML_TAG, '').replace(/[\u0000-\u001F\u007F]/g, '')
}

function parseApiError(body, status) {
  if (body) {
    if (typeof body.error === 'string' && body.error.trim()) return body.error
    if (typeof body.message === 'string' && body.message.trim()) return body.message
  }
  if (status === 429) {
    return `Too many requests. Please wait a few minutes or call ${PHONE_PRIMARY}.`
  }
  if (status >= 500) {
    return `Our booking system is temporarily unavailable. Please call ${PHONE_PRIMARY}.`
  }
  return `Unable to submit right now. Please call ${PHONE_PRIMARY}.`
}

function useStepAdvanceDelay() {
  const [ms, setMs] = useState(180)
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setMs(0)
    })
    return () => cancelAnimationFrame(id)
  }, [])
  return ms
}

function ProgressBar({ step }) {
  const pct = (step / STEPS.length) * 100
  return (
    <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-stone-200" aria-hidden>
      <div
        className="h-full rounded-full bg-gradient-to-r from-amber-600 to-yellow-500 transition-all duration-300 ease-in-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

function OptionCard({ label, icon: Icon, selected, onSelect, index }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      style={{ animationDelay: `${index * 40}ms` }}
      className={`flex min-h-[3.25rem] w-full cursor-pointer items-start gap-3 rounded-xl border-2 p-4 text-left transition-all duration-200 ${
        selected
          ? 'border-amber-600 bg-amber-50/40 ring-2 ring-amber-600/25'
          : 'border-stone-200 bg-stone-50/50 hover:border-amber-600 hover:bg-amber-50/20'
      }`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${
          selected ? 'bg-amber-600 text-white' : 'bg-stone-100 text-amber-700'
        }`}
        aria-hidden
      >
        {Icon && <Icon className="h-5 w-5" strokeWidth={2} />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold leading-snug text-stone-800">{label}</span>
        {selected && (
          <span className="mt-1.5 flex items-center gap-1 text-xs font-medium text-amber-700">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
            Selected
          </span>
        )}
      </span>
    </button>
  )
}

function IconField({ icon: Icon, label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-stone-600">{label}</span>
      <div className="relative">
        <span
          className="pointer-events-none absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg bg-stone-100 text-amber-700"
          aria-hidden
        >
          <Icon className="h-4 w-4" strokeWidth={2} />
        </span>
        {children}
      </div>
    </label>
  )
}

const fieldClass =
  'min-h-12 w-full rounded-xl border border-stone-200 bg-white py-3 pl-[3.25rem] pr-4 text-base text-stone-900 placeholder:text-stone-400 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/20 sm:text-sm'

function SuccessMarks() {
  return (
    <svg className="h-28 w-28 text-amber-600" viewBox="0 0 64 64" aria-hidden>
      <circle cx="32" cy="32" r="28" fill="rgba(217,119,6,0.15)" />
      <path
        className="animate-check-stroke"
        stroke="currentColor"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 34l8 8 20-22"
      />
    </svg>
  )
}

export function LeadForm() {
  const prefersReducedMotion = useReducedMotion()
  const [step, setStep] = useState(1)
  const [data, setData] = useState(initialForm)
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [companyHoneypot, setCompanyHoneypot] = useState('')
  const formLoadedAtRef = useRef(getFormLoadedAt())
  const stepAdvanceDelayMs = useStepAdvanceDelay()

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.debug('[LeadForm] step:', step, 'status:', status)
    }
  }, [step, status])

  const selectService = useCallback(
    (service) => {
      setData((d) => ({ ...d, service }))
      setErrorMsg('')
      setTimeout(() => setStep(2), stepAdvanceDelayMs)
    },
    [stepAdvanceDelayMs],
  )

  const selectTimeline = useCallback(
    (timeline) => {
      setData((d) => ({ ...d, timeline }))
      setErrorMsg('')
      setTimeout(() => setStep(3), stepAdvanceDelayMs)
    },
    [stepAdvanceDelayMs],
  )

  const submit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (honeypot || companyHoneypot) return

    if (!data.service) {
      setErrorMsg('Please select a service.')
      setStep(1)
      return
    }
    if (!data.timeline) {
      setErrorMsg('Please select a timeline.')
      setStep(2)
      return
    }

    const name = sanitizeInput(data.name.trim())
    const email = sanitizeInput(data.email.trim())
    const phone = sanitizeInput(data.phone.trim())
    const address = sanitizeInput(data.address.trim())
    const zip = sanitizeInput(data.zip.trim())

    if (!name || !email || !phone || !address || !zip) {
      setErrorMsg('Please fill in all fields.')
      return
    }
    if (name.length < 2) {
      setErrorMsg('Please enter your full name.')
      return
    }
    const phoneDigits = phone.replace(/\D/g, '')
    if (phoneDigits.length < 10) {
      setErrorMsg('Please enter a valid phone number.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Please enter a valid email.')
      return
    }
    if (address.length < 8) {
      setErrorMsg('Please enter your full property address.')
      return
    }
    if (!/^\d{5}(-\d{4})?$/.test(zip)) {
      setErrorMsg('Please enter a valid ZIP code.')
      return
    }
    if (!data.marketingSmsConsent) {
      setErrorMsg('Please consent to marketing SMS messages to continue.')
      return
    }
    if (!data.informationalSmsConsent) {
      setErrorMsg('Please consent to informational SMS messages to continue.')
      return
    }

    const payload = {
      service: data.service,
      timeline: data.timeline,
      name,
      email,
      phone,
      address,
      zip,
      marketingSmsConsent: data.marketingSmsConsent,
      informationalSmsConsent: data.informationalSmsConsent,
      source: 'rsa-windows-landing',
      submittedAt: new Date().toISOString(),
      formLoadedAt: formLoadedAtRef.current ?? getFormLoadedAt(),
    }

    if (process.env.NODE_ENV === 'development') {
      console.debug('[LeadForm submit]', {
        ...payload,
        email: '[redacted]',
        phone: '[redacted]',
      })
    }

    setStatus('loading')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: getLeadFetchHeaders(),
        body: JSON.stringify(payload),
        cache: 'no-store',
        credentials: 'same-origin',
      })

      let body = null
      const raw = await res.text()
      if (raw) {
        try {
          body = JSON.parse(raw)
        } catch {
          body = null
        }
      }

      if (!res.ok) {
        setStatus('idle')
        setErrorMsg(parseApiError(body, res.status))
        if (process.env.NODE_ENV === 'development') {
          console.debug('[LeadForm] API error', res.status, body)
        }
        return
      }

      setData(initialForm)
      setStep(1)
      setStatus('success')
    } catch (err) {
      setStatus('idle')
      setErrorMsg(`Network error. Please try again or call ${PHONE_PRIMARY}.`)
      if (process.env.NODE_ENV === 'development') {
        console.debug('[LeadForm] network error', err)
      }
    }
  }

  const motionDur = prefersReducedMotion ? 0 : 0.35

  if (status === 'success') {
    return (
      <div className="relative rounded-2xl border border-stone-200 bg-white/95 p-6 shadow-2xl backdrop-blur-md sm:p-8">
        <div className="animate-form-success flex min-h-[280px] flex-col items-center justify-center text-center">
          <SuccessMarks />
          <h3 className="mt-6 text-xl font-bold text-stone-900">Request Received!</h3>
          <p className="mt-2 max-w-sm text-stone-600">
            Our team will reach out shortly. For urgent needs, call{' '}
            <a
              href={PHONE_PRIMARY_HREF}
              className="font-semibold text-stone-900 underline decoration-amber-600 underline-offset-2"
            >
              {PHONE_PRIMARY}
            </a>
            .
          </p>
          <button
            type="button"
            onClick={() => setStatus('idle')}
            className="mt-8 min-h-12 rounded-xl border-2 border-stone-200 px-6 text-sm font-bold text-stone-900 transition-all duration-300 ease-in-out hover:border-amber-600 hover:bg-amber-50"
          >
            Submit another request
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      id="quote-form"
      className="relative rounded-2xl border border-stone-200 bg-white/95 p-4 shadow-2xl backdrop-blur-md sm:p-6 md:p-8"
    >
      <div className="mb-4 text-center">
        <h3 className="text-lg font-bold text-stone-900 sm:text-xl">Free Impact Assessment</h3>
        <p className="mt-1 text-xs text-stone-500 sm:text-sm">Three quick steps — zero obligation.</p>
      </div>

      <ProgressBar step={step} />

      <div
        className="mb-4 flex items-center justify-center gap-2"
        aria-label={`Step ${step} of ${STEPS.length}`}
      >
        {STEPS.map((s) => (
          <span
            key={s.id}
            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
              step >= s.id
                ? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-white'
                : 'border-2 border-stone-200 bg-white text-stone-400'
            }`}
          >
            {s.id}
          </span>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -8 }}
          transition={{ duration: motionDur, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-stone-800">
            {(() => {
              const StepIcon = STEP_ICONS[step - 1]
              return StepIcon ? (
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                  <StepIcon className="h-4 w-4" aria-hidden />
                </span>
              ) : null
            })()}
            {STEPS[step - 1].title}
          </p>

          {step === 1 && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {SERVICE_OPTIONS.map((opt, i) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  icon={opt.icon}
                  selected={data.service === opt.value}
                  onSelect={() => selectService(opt.value)}
                  index={i}
                />
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 gap-3">
              {TIMELINE_OPTIONS.map((opt, i) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  icon={opt.icon}
                  selected={data.timeline === opt.value}
                  onSelect={() => selectTimeline(opt.value)}
                  index={i}
                />
              ))}
            </div>
          )}

          {step === 3 && (
            <form onSubmit={submit} className="space-y-3">
              <label className="sr-only" aria-hidden>
                Website
                <input
                  type="text"
                  name="_hp"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                />
              </label>
              <label className="sr-only" aria-hidden>
                Company
                <input
                  type="text"
                  name="company"
                  value={companyHoneypot}
                  onChange={(e) => setCompanyHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                />
              </label>

              <IconField icon={User} label="Full Name">
                <input
                  required
                  autoComplete="name"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: sanitizeInput(e.target.value) })}
                  className={fieldClass}
                />
              </IconField>

              <IconField icon={Mail} label="Email">
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: sanitizeInput(e.target.value) })}
                  className={fieldClass}
                />
              </IconField>

              <IconField icon={Phone} label="Phone Number">
                <input
                  type="tel"
                  required
                  autoComplete="tel"
                  value={data.phone}
                  onChange={(e) => setData({ ...data, phone: sanitizeInput(e.target.value) })}
                  className={fieldClass}
                />
              </IconField>

              <IconField icon={MapPin} label="Property Address">
                <input
                  required
                  autoComplete="street-address"
                  placeholder="Street address"
                  value={data.address}
                  onChange={(e) => setData({ ...data, address: sanitizeInput(e.target.value) })}
                  className={fieldClass}
                />
              </IconField>

              <IconField icon={Hash} label="Zip Code">
                <input
                  required
                  autoComplete="postal-code"
                  inputMode="numeric"
                  placeholder="e.g. 33020"
                  value={data.zip}
                  onChange={(e) => setData({ ...data, zip: sanitizeInput(e.target.value) })}
                  className={fieldClass}
                />
              </IconField>

              <label className="flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border border-stone-200 bg-stone-50/50 p-3 has-[:checked]:border-amber-600/50 has-[:checked]:bg-amber-50/30">
                <MessageSquare className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden />
                <input
                  type="checkbox"
                  checked={data.marketingSmsConsent}
                  onChange={(e) =>
                    setData({ ...data, marketingSmsConsent: e.target.checked })
                  }
                  className="mt-1 h-5 w-5 shrink-0 rounded border-stone-300 text-amber-600 focus:ring-amber-600"
                />
                <span className="text-[11px] leading-relaxed text-stone-600 sm:text-xs">
                  {MARKETING_SMS_CONSENT}
                </span>
              </label>

              <label className="flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border border-stone-200 bg-stone-50/50 p-3 has-[:checked]:border-amber-600/50 has-[:checked]:bg-amber-50/30">
                <MessageSquare className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden />
                <input
                  type="checkbox"
                  checked={data.informationalSmsConsent}
                  onChange={(e) =>
                    setData({ ...data, informationalSmsConsent: e.target.checked })
                  }
                  className="mt-1 h-5 w-5 shrink-0 rounded border-stone-300 text-amber-600 focus:ring-amber-600"
                />
                <span className="text-[11px] leading-relaxed text-stone-600 sm:text-xs">
                  I consent to receive informational messages, such as updates and alerts, via SMS
                  from RSA Windows. View our{' '}
                  <Link href="/privacy" className="font-semibold text-amber-700 underline">
                    Privacy Policy
                  </Link>{' '}
                  &amp; SMS Terms.
                </span>
              </label>

              {errorMsg && (
                <p className="text-sm text-red-600" role="alert">
                  {errorMsg}
                </p>
              )}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 text-sm font-bold text-white shadow-lg transition-all duration-300 ease-in-out hover:shadow-amber-500/20 disabled:opacity-70"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" aria-hidden />
                    Submit Free Quote Request
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </AnimatePresence>

      {errorMsg && step !== 3 && (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {errorMsg}
        </p>
      )}

      {step > 1 && (
        <div className="mt-4 border-t border-stone-200 pt-4">
          <button
            type="button"
            onClick={() => {
              setErrorMsg('')
              setStep((s) => Math.max(1, s - 1))
            }}
            className="flex min-h-12 items-center text-sm font-semibold text-stone-500 transition-colors duration-300 hover:text-stone-900"
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  )
}
