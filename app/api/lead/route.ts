import { NextResponse } from 'next/server'
import { PHONE_PRIMARY } from '@/lib/constants'
import { reserveSlot } from '@/lib/bookingStore'
import {
  isValidLeadRequestHeader,
  rateLimitKey,
  isRateLimited,
  sanitizeRequestMeta,
  validateLeadBody,
} from '@/lib/leadSecurity'
import { isAllowedLeadRequest, isSameOriginRequest } from '@/lib/requestSecurity'
import { getWebhookConfig, postToWebhookWithRetry } from '@/lib/webhook'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_BODY_BYTES = 12_288

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'interest-cohort=()',
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405, headers: JSON_HEADERS })
}

export async function POST(request: Request) {
  if (!isAllowedLeadRequest(request) || !isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers: JSON_HEADERS })
  }

  if (!isValidLeadRequestHeader(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers: JSON_HEADERS })
  }

  const config = getWebhookConfig()
  if (!config) {
    console.error('Lead API: invalid or missing webhook configuration')
    return NextResponse.json(
      { error: `Form is not configured on the server. Please call ${PHONE_PRIMARY}.` },
      { status: 500, headers: JSON_HEADERS },
    )
  }

  const contentType = request.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    return NextResponse.json({ error: 'Unsupported content type' }, { status: 415, headers: JSON_HEADERS })
  }

  const limiterKey = rateLimitKey(request)
  if (isRateLimited(limiterKey)) {
    return NextResponse.json(
      { error: `Too many requests. Please wait a few minutes or call ${PHONE_PRIMARY}.` },
      { status: 429, headers: JSON_HEADERS },
    )
  }

  try {
    const raw = await request.text()
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: 'Request too large' }, { status: 413, headers: JSON_HEADERS })
    }

    let body: unknown
    try {
      body = JSON.parse(raw)
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400, headers: JSON_HEADERS })
    }

    const validated = validateLeadBody(body)
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400, headers: JSON_HEADERS })
    }

    const {
      service,
      timeline,
      name,
      email,
      phone,
      address,
      marketingSmsConsent,
      informationalSmsConsent,
      appointmentAt,
      appointmentSkipped,
    } = validated.data

    if (appointmentAt && !appointmentSkipped) {
      const slotMs = Date.parse(appointmentAt)
      const reserved = reserveSlot(slotMs)
      if (!reserved.ok) {
        return NextResponse.json({ error: reserved.error }, { status: 409, headers: JSON_HEADERS })
      }
    }

    const payload = {
      service,
      timeline,
      name,
      fullName: name,
      email,
      phone,
      address,
      marketingSmsConsent,
      informationalSmsConsent,
      appointmentAt,
      appointmentSkipped,
      hasAppointment: !appointmentSkipped && !!appointmentAt,
      timezone: 'America/New_York',
      source: 'rsa-windows-landing',
      submittedAt: new Date().toISOString(),
      referer: sanitizeRequestMeta(request.headers.get('referer')),
      userAgent: sanitizeRequestMeta(request.headers.get('user-agent')),
    }

    let res: Response
    try {
      res = await postToWebhookWithRetry(config.url, config.jwtSecret, payload)
    } catch (e) {
      const aborted = e instanceof Error && e.name === 'AbortError'
      console.error('Lead API: webhook unreachable', aborted ? 'timeout' : 'network')
      return NextResponse.json(
        {
          error: aborted
            ? `Request timed out. Please try again or call ${PHONE_PRIMARY}.`
            : `Could not reach our booking system. Please try again or call ${PHONE_PRIMARY}.`,
        },
        { status: 503, headers: JSON_HEADERS },
      )
    }

    if (res.status >= 200 && res.status < 300) {
      return NextResponse.json(
        { ok: true, appointmentAt, appointmentSkipped },
        { headers: JSON_HEADERS },
      )
    }

    const errBody = await res.text().catch(() => '')
    console.error('Lead API: webhook rejected request', res.status, errBody.slice(0, 200))

    return NextResponse.json(
      {
        error:
          res.status === 401 || res.status === 403
            ? `Our booking system could not accept your request. Please call ${PHONE_PRIMARY}.`
            : `Our booking system could not process your request. Please call ${PHONE_PRIMARY}.`,
      },
      { status: 502, headers: JSON_HEADERS },
    )
  } catch {
    console.error('Lead API: unexpected error')
    return NextResponse.json(
      { error: `Server error. Please call ${PHONE_PRIMARY}.` },
      { status: 500, headers: JSON_HEADERS },
    )
  }
}
