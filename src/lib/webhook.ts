import { signJwtHS256 } from '@/lib/jwt'

const ALLOWED_HOSTS = new Set(['n8n.srv1405965.hstgr.cloud'])

const WEAK_SECRETS = new Set([
  'password',
  'password123',
  'changeme',
  'your-secret-bearer-token-here',
  'test',
  'secret',
])

const WEBHOOK_TIMEOUT_MS = 20_000
const WEBHOOK_MAX_ATTEMPTS = 3

export function isValidWebhookUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'https:') return false
    if (!ALLOWED_HOSTS.has(parsed.hostname)) return false
    if (!parsed.pathname.includes('/webhook/')) return false

    return true
  } catch {
    return false
  }
}

export function isValidBearerSecret(secret: string): boolean {
  if (secret.length < 8 || secret.length > 256 || /\s/.test(secret)) return false
  if (WEAK_SECRETS.has(secret.toLowerCase())) return false
  return true
}

export function getWebhookConfig() {
  const url = process.env.N8N_WEBHOOK_URL?.trim()
  const jwtSecret =
    process.env.N8N_JWT_SECRET?.trim() || process.env.N8N_AUTH_BEARER?.trim()
  if (!url || !jwtSecret) return null
  if (!isValidWebhookUrl(url)) return null
  if (!isValidBearerSecret(jwtSecret)) return null
  return { url, jwtSecret }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function postToWebhook(url: string, jwtSecret: string, payload: Record<string, unknown>) {
  const token = signJwtHS256(jwtSecret, { sub: 'lead-form' })
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS)

  try {
    return await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain, */*',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
      cache: 'no-store',
    })
  } finally {
    clearTimeout(timeout)
  }
}

export async function postToWebhookWithRetry(
  url: string,
  jwtSecret: string,
  payload: Record<string, unknown>,
) {
  let lastResponse: Response | null = null
  let lastError: unknown = null

  for (let attempt = 1; attempt <= WEBHOOK_MAX_ATTEMPTS; attempt++) {
    try {
      const res = await postToWebhook(url, jwtSecret, payload)
      if (res.status >= 200 && res.status < 300) return res

      lastResponse = res
      if (res.status >= 400 && res.status < 500 && res.status !== 408 && res.status !== 429) {
        return res
      }
    } catch (error) {
      lastError = error
    }

    if (attempt < WEBHOOK_MAX_ATTEMPTS) {
      await sleep(350 * attempt)
    }
  }

  if (lastResponse) return lastResponse
  throw lastError ?? new Error('Webhook unreachable')
}
