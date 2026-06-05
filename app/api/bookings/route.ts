import { NextResponse } from 'next/server'
import { getBookedRanges } from '@/lib/bookingStore'
import { getBookableDays, getSlotStartsForDay, isSlotAvailable } from '@/lib/scheduling'
import { isAllowedLeadRequest } from '@/lib/requestSecurity'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store, no-cache, must-revalidate',
}

export async function GET(request: Request) {
  if (!isAllowedLeadRequest(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers: JSON_HEADERS })
  }

  const now = Date.now()
  const booked = getBookedRanges()
  const days = getBookableDays(now)

  const schedule = days.map((dateKey) => ({
    date: dateKey,
    slots: getSlotStartsForDay(dateKey, now)
      .filter((slotMs) => isSlotAvailable(slotMs, booked))
      .map((slotMs) => ({
        startMs: slotMs,
        start: new Date(slotMs).toISOString(),
      })),
  }))

  return NextResponse.json(
    {
      timezone: 'America/New_York',
      timezoneLabel: 'Eastern Time (ET)',
      slotMinutes: 15,
      blockMinutes: 90,
      days: schedule,
    },
    { headers: JSON_HEADERS },
  )
}
