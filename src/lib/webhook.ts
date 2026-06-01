const ALLOWED_HOSTS = new Set(['n8n.srv1405965.hstgr.cloud'])

const WEAK_SECRETS = new Set([
  'password',
  'password123',
  'changeme',
  'your-secret-bearer-token-here',
  'test',
  'secret',
])

export function isValidWebhookUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'https:') return false
    if (!ALLOWED_HOSTS.has(parsed.hostname)) return false
    if (!parsed.pathname.includes('/webhook/')) return false

    const allowedId = process.env.N8N_WEBHOOK_ID?.trim()
    if (allowedId) {
      const segments = parsed.pathname.split('/').filter(Boolean)
      const webhookId = segments[segments.length - 1]
      if (webhookId !== allowedId) return false
    }

    return true
  } catch {
    return false
  }
}

export function isValidBearerSecret(secret: string): boolean {
  if (secret.length < 12 || secret.length > 256 || /\s/.test(secret)) return false
  if (WEAK_SECRETS.has(secret.toLowerCase())) return false
  return true
}
