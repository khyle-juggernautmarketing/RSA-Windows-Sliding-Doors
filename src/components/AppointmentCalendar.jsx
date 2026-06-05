'use client'

import { CalendarDays, Clock, Loader2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { getLeadFetchHeaders } from '@/lib/leadClient'
import { formatSlotLabel, formatTimeOnly } from '@/lib/scheduling'

export function AppointmentCalendar({ selectedMs, onSelect, onSlotsLoaded }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [days, setDays] = useState([])
  const [activeDate, setActiveDate] = useState('')

  const loadSlots = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/bookings', {
        cache: 'no-store',
        credentials: 'same-origin',
        headers: getLeadFetchHeaders(),
      })
      if (!res.ok) throw new Error('Could not load availability')
      const data = await res.json()
      const schedule = data.days ?? []
      setDays(schedule)
      if (schedule.length && !activeDate) {
        setActiveDate(schedule[0].date)
      }
      onSlotsLoaded?.(schedule)
    } catch {
      setError('Unable to load appointment times. Please refresh or call us directly.')
    } finally {
      setLoading(false)
    }
  }, [activeDate, onSlotsLoaded])

  useEffect(() => {
    loadSlots()
  }, [loadSlots])

  const activeDay = days.find((d) => d.date === activeDate)
  const slots = activeDay?.slots ?? []

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center gap-2 text-sm text-stone-500">
        <Loader2 className="h-5 w-5 animate-spin text-amber-600" aria-hidden />
        Loading available times (Eastern Time)…
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-700">
        {error}
        <button
          type="button"
          onClick={loadSlots}
          className="mt-3 block w-full min-h-12 rounded-lg border border-red-300 text-sm font-semibold hover:bg-red-100"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!days.length) {
    return (
      <p className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-center text-sm text-stone-600">
        No appointment slots available in the next 3 business days. Please call us to schedule.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <p className="flex items-center gap-2 text-xs text-stone-500">
        <Clock className="h-4 w-4 text-amber-600" aria-hidden />
        All times shown in <strong className="text-stone-700">Eastern Time (ET)</strong>. Mon–Fri,
        8:00 AM – 8:00 PM. Each visit reserves a 90-minute window.
      </p>

      <div className="flex flex-wrap gap-2">
        {days.map((day) => {
          const label = day.slots[0]
            ? formatSlotLabel(day.slots[0].startMs).split(',').slice(0, 2).join(',')
            : day.date
          const isActive = day.date === activeDate
          return (
            <button
              key={day.date}
              type="button"
              onClick={() => setActiveDate(day.date)}
              disabled={!day.slots.length}
              className={`min-h-12 rounded-xl border-2 px-4 py-2 text-left text-xs font-semibold transition-all duration-200 sm:text-sm ${
                isActive
                  ? 'border-amber-600 bg-amber-50 text-stone-900'
                  : 'border-stone-200 bg-white text-stone-700 hover:border-amber-400 disabled:opacity-40'
              }`}
            >
              <CalendarDays className="mb-1 h-4 w-4 text-amber-600" aria-hidden />
              <span className="block">{label}</span>
              <span className="text-[10px] font-normal text-stone-500">
                {day.slots.length} slots
              </span>
            </button>
          )
        })}
      </div>

      {activeDay && (
        <div className="grid max-h-56 grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3">
          {slots.map((slot) => {
            const selected = selectedMs === slot.startMs
            return (
              <button
                key={slot.start}
                type="button"
                onClick={() => onSelect(slot.startMs)}
                className={`min-h-12 rounded-xl border-2 px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                  selected
                    ? 'border-amber-600 bg-amber-50 text-amber-900 ring-2 ring-amber-600/25'
                    : 'border-stone-200 bg-stone-50/50 text-stone-800 hover:border-amber-600'
                }`}
              >
                {formatTimeOnly(slot.startMs)}
              </button>
            )
          })}
        </div>
      )}

      {selectedMs && (
        <p className="rounded-xl border border-amber-200 bg-amber-50/50 px-4 py-3 text-sm text-stone-800">
          <strong>Selected:</strong> {formatSlotLabel(selectedMs)} ET
        </p>
      )}
    </div>
  )
}
