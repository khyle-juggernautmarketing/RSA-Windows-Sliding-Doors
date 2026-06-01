import {
  AppWindow,
  Building2,
  CalendarClock,
  DoorOpen,
  Search,
  Wrench,
  Zap,
} from 'lucide-react'

export const SERVICE_OPTIONS = [
  {
    value: 'impact-window-installation',
    label: 'Impact Window Installation',
    icon: AppWindow,
  },
  {
    value: 'impact-sliding-door-installation',
    label: 'Impact Sliding Door Installation',
    icon: DoorOpen,
  },
  {
    value: 'sliding-glass-door-repair',
    label: 'Sliding Glass Door Repair',
    icon: Wrench,
  },
  {
    value: 'commercial-storefront',
    label: 'Commercial Storefront Solutions',
    icon: Building2,
  },
]

export const TIMELINE_OPTIONS = [
  {
    value: 'immediate-damaged-glass',
    label: 'Immediate / Damaged Glass Upgrade',
    icon: Zap,
  },
  {
    value: 'within-1-3-months',
    label: 'Within 1-3 Months',
    icon: CalendarClock,
  },
  {
    value: 'planning-financing',
    label: 'Just Planning / Discovering Financing Options',
    icon: Search,
  },
]

export const SERVICES = SERVICE_OPTIONS.map((o) => o.value)
export const TIMELINES = TIMELINE_OPTIONS.map((o) => o.value)
