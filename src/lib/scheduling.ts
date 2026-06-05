/** RSA appointment scheduling — America/New_York (Florida), Mon–Fri 8:00–20:00 ET. */

export const TIMEZONE = 'America/New_York'
export const SLOT_MINUTES = 15
export const BLOCK_MINUTES = 90
export const MAX_DAYS_OUT = 3
export const OPEN_HOUR = 8
export const CLOSE_HOUR = 20
export const FORM_TIMEOUT_MS = 10 * 60 * 1000

const DAY_MS = 24 * 60 * 60 * 1000

export type BookedRange = {
  startMs: number
  endMs: number
}

export function getEstParts(date: Date) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  })
  const parts = fmt.formatToParts(date)
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? ''

  return {
    year: Number(get('year')),
    month: Number(get('month')),
    day: Number(get('day')),
    weekday: get('weekday'),
    hour: Number(get('hour')),
    minute: Number(get('minute')),
  }
}

export function estDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

/** Convert EST calendar date + minutes-from-midnight to UTC ms. */
export function estSlotToUtcMs(year: number, month: number, day: number, minutesFromMidnight: number) {
  const noonUtc = Date.UTC(year, month - 1, day, 12, 0, 0, 0)
  const { hour, minute } = getEstParts(new Date(noonUtc))
  const noonEstMinutes = hour * 60 + minute
  const targetEstMinutes = minutesFromMidnight
  const deltaMinutes = targetEstMinutes - noonEstMinutes
  return noonUtc + deltaMinutes * 60 * 1000
}

export function formatSlotLabel(slotMs: number) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(slotMs))
}

export function formatTimeOnly(slotMs: number) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(slotMs))
}

export function isWeekdayEst(year: number, month: number, day: number) {
  const ms = estSlotToUtcMs(year, month, day, 12 * 60)
  const { weekday } = getEstParts(new Date(ms))
  return weekday !== 'Sat' && weekday !== 'Sun'
}

export function getBookableDays(now = Date.now()): string[] {
  const days: string[] = []
  const start = getEstParts(new Date(now))

  for (let offset = 0; offset < 14 && days.length < MAX_DAYS_OUT; offset++) {
    const probe = new Date(now + offset * DAY_MS)
    const p = getEstParts(probe)
    if (!isWeekdayEst(p.year, p.month, p.day)) continue

    const key = estDateKey(p.year, p.month, p.day)
    if (!days.includes(key)) days.push(key)
  }

  return days
}

/** Last slot start so 90-minute block ends by CLOSE_HOUR (20:00). */
export function getSlotStartsForDay(dateKey: string, now = Date.now()): number[] {
  const [y, m, d] = dateKey.split('-').map(Number)
  if (!isWeekdayEst(y, m, d)) return []

  const lastStartMinutes = CLOSE_HOUR * 60 - BLOCK_MINUTES
  const firstStartMinutes = OPEN_HOUR * 60
  const slots: number[] = []

  for (let mins = firstStartMinutes; mins <= lastStartMinutes; mins += SLOT_MINUTES) {
    const slotMs = estSlotToUtcMs(y, m, d, mins)
    if (slotMs > now + 60_000) slots.push(slotMs)
  }

  return slots
}

export function rangesOverlap(aStart: number, aEnd: number, bStart: number, bEnd: number) {
  return aStart < bEnd && bStart < aEnd
}

export function isSlotAvailable(slotMs: number, booked: BookedRange[]) {
  const blockEnd = slotMs + BLOCK_MINUTES * 60 * 1000
  return !booked.some((b) => rangesOverlap(slotMs, blockEnd, b.startMs, b.endMs))
}

export function slotWithinRules(slotMs: number, now = Date.now()) {
  const p = getEstParts(new Date(slotMs))
  if (!isWeekdayEst(p.year, p.month, p.day)) return false

  const mins = p.hour * 60 + p.minute
  if (mins < OPEN_HOUR * 60 || mins > CLOSE_HOUR * 60 - BLOCK_MINUTES) return false
  if (p.minute % SLOT_MINUTES !== 0) return false
  if (slotMs <= now) return false

  const bookable = getBookableDays(now)
  const key = estDateKey(p.year, p.month, p.day)
  if (!bookable.includes(key)) return false

  return true
}

export function getBlockedRangesFromBooking(startMs: number): BookedRange {
  return {
    startMs,
    endMs: startMs + BLOCK_MINUTES * 60 * 1000,
  }
}
