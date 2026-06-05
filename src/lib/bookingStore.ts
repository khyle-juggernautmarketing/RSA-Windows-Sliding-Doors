import {
  BLOCK_MINUTES,
  getBlockedRangesFromBooking,
  rangesOverlap,
  slotWithinRules,
  type BookedRange,
} from '@/lib/scheduling'

const bookings: BookedRange[] = []
const MAX_BOOKINGS = 500

function pruneOld(now: number) {
  const cutoff = now - 7 * 24 * 60 * 60 * 1000
  while (bookings.length && bookings[0].endMs < cutoff) {
    bookings.shift()
  }
  while (bookings.length > MAX_BOOKINGS) {
    bookings.shift()
  }
}

export function getBookedRanges(): BookedRange[] {
  pruneOld(Date.now())
  return bookings.map((b) => ({ ...b }))
}

export function isSlotBooked(slotMs: number): boolean {
  const range = getBlockedRangesFromBooking(slotMs)
  return bookings.some((b) => rangesOverlap(range.startMs, range.endMs, b.startMs, b.endMs))
}

export function reserveSlot(slotMs: number): { ok: true } | { ok: false; error: string } {
  const now = Date.now()
  pruneOld(now)

  if (!slotWithinRules(slotMs, now)) {
    return { ok: false, error: 'Selected time is not available' }
  }

  const range = getBlockedRangesFromBooking(slotMs)

  if (bookings.some((b) => rangesOverlap(range.startMs, range.endMs, b.startMs, b.endMs))) {
    return { ok: false, error: 'That time was just booked. Please choose another slot.' }
  }

  bookings.push(range)
  bookings.sort((a, b) => a.startMs - b.startMs)
  return { ok: true }
}

export function getBookingsPayload() {
  return getBookedRanges().map((b) => ({
    start: new Date(b.startMs).toISOString(),
    end: new Date(b.endMs).toISOString(),
    blockMinutes: BLOCK_MINUTES,
  }))
}
