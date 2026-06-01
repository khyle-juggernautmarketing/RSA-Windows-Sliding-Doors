const PROJECT_SLUG = 'rsa-windows-sliding-doors'

function addHost(hosts: Set<string>, raw?: string | null) {
  if (!raw?.trim()) return
  try {
    const url = raw.startsWith('http') ? raw : `https://${raw}`
    hosts.add(new URL(url).host.toLowerCase())
  } catch {
    const h = raw.trim().toLowerCase()
    if (h && !h.includes('/')) hosts.add(h)
  }
}

export function getAllowedHosts(): string[] {
  const hosts = new Set<string>()

  addHost(hosts, process.env.NEXT_PUBLIC_SITE_URL)
  addHost(hosts, process.env.VERCEL_URL)
  addHost(hosts, process.env.VERCEL_BRANCH_URL)
  addHost(hosts, process.env.VERCEL_PROJECT_PRODUCTION_URL)

  const extra = process.env.ALLOWED_ORIGIN_HOSTS?.split(',').map((h) => h.trim()) ?? []
  for (const h of extra) {
    addHost(hosts, h)
  }

  hosts.add('localhost:3115')
  hosts.add('127.0.0.1:3115')
  hosts.add('localhost:3000')
  hosts.add('127.0.0.1:3000')

  return [...hosts]
}

function isProjectVercelHost(host: string): boolean {
  const h = host.toLowerCase()
  if (h === `${PROJECT_SLUG}.vercel.app`) return true
  if (h.startsWith(`${PROJECT_SLUG}`) && h.endsWith('.vercel.app')) return true
  return false
}

function isAllowedHost(host: string, allowed: string[]): boolean {
  const h = host.toLowerCase()
  if (allowed.includes(h) || isProjectVercelHost(h)) return true
  if (h.startsWith('www.')) {
    const bare = h.slice(4)
    return allowed.includes(bare) || isProjectVercelHost(bare)
  }
  return false
}

export function isAllowedLeadRequest(request: Request): boolean {
  const allowed = getAllowedHosts()

  const origin = request.headers.get('origin')
  if (origin) {
    try {
      return isAllowedHost(new URL(origin).host, allowed)
    } catch {
      return false
    }
  }

  const referer = request.headers.get('referer')
  if (referer) {
    try {
      if (isAllowedHost(new URL(referer).host, allowed)) return true
    } catch {
      /* ignore */
    }
  }

  const secFetchSite = request.headers.get('sec-fetch-site')
  if (secFetchSite === 'cross-site') return false

  const host = request.headers.get('host')
  if (host) return isAllowedHost(host, allowed)

  return process.env.NODE_ENV === 'development'
}

/** Strict same-origin check when Origin header is sent (browser form POST). */
export function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return true

  const host = request.headers.get('host')
  if (!host) return false

  try {
    return new URL(origin).host.toLowerCase() === host.toLowerCase()
  } catch {
    return false
  }
}
