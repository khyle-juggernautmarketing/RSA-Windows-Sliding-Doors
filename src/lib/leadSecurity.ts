import { SERVICES, TIMELINES } from '@/lib/formOptions'

const MAX = {
  name: 120,
  email: 254,
  phone: 32,
  address: 200,
  zip: 16,
  meta: 512,
} as const

const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g
const HTML_TAG = /<[^>]*>/g
const ZIP_PATTERN = /^\d{5}(-\d{4})?$/

export type LeadFormData = {
  service: string
  timeline: string
  name: string
  email: string
  phone: string
  address: string
  zip: string
  marketingSmsConsent: boolean
  informationalSmsConsent: boolean
}

export function sanitizeText(value: unknown, maxLen: number): string {
  return String(value ?? '')
    .replace(CONTROL_CHARS, '')
    .replace(HTML_TAG, '')
    .trim()
    .slice(0, maxLen)
}

export function isAllowedEnum<T extends string>(value: string, allowed: readonly T[]): value is T {
  return (allowed as readonly string[]).includes(value)
}

const MIN_SUBMIT_MS = 2_500
const MAX_SUBMIT_MS = 2 * 60 * 60 * 1000

export function validateSubmissionTiming(formLoadedAt: unknown): boolean {
  const t = Number(formLoadedAt)
  if (!Number.isFinite(t) || t <= 0) return false
  const elapsed = Date.now() - t
  return elapsed >= MIN_SUBMIT_MS && elapsed <= MAX_SUBMIT_MS
}

export function isValidLeadRequestHeader(request: Request): boolean {
  return request.headers.get('x-requested-with') === 'RSA-Lead-Form'
}

export function validateLeadBody(body: unknown):
  | { ok: true; data: LeadFormData }
  | { ok: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Invalid request body' }
  }

  const raw = body as Record<string, unknown>

  const honeypot = sanitizeText(raw._hp ?? raw.website, 200)
  if (honeypot) {
    return { ok: false, error: 'Invalid submission' }
  }

  const company = sanitizeText(raw.company, 200)
  if (company) {
    return { ok: false, error: 'Invalid submission' }
  }

  if (!validateSubmissionTiming(raw.formLoadedAt)) {
    return { ok: false, error: 'Invalid submission' }
  }

  const service = sanitizeText(raw.service, 64)
  const timeline = sanitizeText(raw.timeline, 64)
  const name = sanitizeText(raw.name ?? raw.fullName, MAX.name)
  const email = sanitizeText(raw.email, MAX.email).toLowerCase()
  const phone = sanitizeText(raw.phone, MAX.phone)
  const address = sanitizeText(raw.address, MAX.address)
  const zip = sanitizeText(raw.zip, MAX.zip)

  const marketingSmsConsent = raw.marketingSmsConsent === true
  const informationalSmsConsent = raw.informationalSmsConsent === true

  if (!service || !timeline || !name || !email || !phone || !address || !zip) {
    return { ok: false, error: 'Missing required fields' }
  }

  if (!isAllowedEnum(service, SERVICES)) {
    return { ok: false, error: 'Invalid service selection' }
  }

  if (!isAllowedEnum(timeline, TIMELINES)) {
    return { ok: false, error: 'Invalid timeline selection' }
  }

  if (!marketingSmsConsent) {
    return { ok: false, error: 'Marketing SMS consent is required' }
  }

  if (!informationalSmsConsent) {
    return { ok: false, error: 'Informational SMS consent is required' }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > MAX.email) {
    return { ok: false, error: 'Invalid email' }
  }

  const phoneDigits = phone.replace(/\D/g, '')
  if (phoneDigits.length < 10 || phoneDigits.length > 15) {
    return { ok: false, error: 'Invalid phone number' }
  }

  if (address.length < 8) {
    return { ok: false, error: 'Please enter a valid property address' }
  }

  if (!ZIP_PATTERN.test(zip)) {
    return { ok: false, error: 'Please enter a valid ZIP code' }
  }

  return {
    ok: true,
    data: {
      service,
      timeline,
      name,
      email,
      phone,
      address,
      zip,
      marketingSmsConsent,
      informationalSmsConsent,
    },
  }
}

const hits = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 6
const RATE_WINDOW_MS = 15 * 60 * 1000

function pruneRateLimitMap(now: number) {
  for (const [key, entry] of hits) {
    if (now > entry.resetAt) hits.delete(key)
  }
}

export function rateLimitKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown'
  return request.headers.get('x-real-ip') || 'unknown'
}

export function isRateLimited(key: string): boolean {
  const now = Date.now()
  if (hits.size > 500) pruneRateLimitMap(now)

  const entry = hits.get(key)
  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return false
  }
  entry.count += 1
  return entry.count > RATE_LIMIT
}

export function sanitizeRequestMeta(value: string | null, maxLen = MAX.meta): string {
  return sanitizeText(value ?? '', maxLen)
}
