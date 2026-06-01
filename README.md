# RSA Windows & Sliding Doors

Premium landing page for hurricane-impact windows and sliding glass doors — Hollywood & Naples, FL.

## Stack

- Next.js 15 (App Router)
- React 19, Tailwind CSS 3, Lucide React, Framer Motion
- Secure lead capture via `/api/lead` → n8n webhook

## Development

```bash
npm install
cp .env.local.example .env.local   # set N8N_WEBHOOK_URL and N8N_AUTH_BEARER
npm run dev                        # http://127.0.0.1:3115
```

## Environment variables (Vercel)

| Variable | Description |
|----------|-------------|
| `N8N_WEBHOOK_URL` | n8n webhook URL (server only) |
| `N8N_WEBHOOK_ID` | Webhook UUID segment (optional hardening) |
| `N8N_AUTH_BEARER` | Bearer token for n8n (server only) |
| `NEXT_PUBLIC_SITE_URL` | Production URL (for SEO metadata & canonical URLs) |

## Deploy

Connected to [Vercel](https://vercel.com) from the `RSA-Windows-Sliding-Doors` GitHub repository.
