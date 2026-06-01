import { AppWindow, ArrowRight, DoorOpen, Wrench } from 'lucide-react'
import Image from 'next/image'

const SERVICE_ROWS = [
  {
    title: 'Impact Window Installation',
    description:
      'Architectural-grade hurricane-impact windows engineered for Florida\'s coastal wind loads. We measure every opening precisely, specify code-compliant systems rated 160 MPH+, and install with clean seals that integrate into your home\'s envelope.',
    cta: 'Get Impact Window Quote',
    icon: AppWindow,
    image: '/images/pic-1.webp',
    imageAlt: 'Impact window installation on a Florida coastal home',
    reverse: false,
  },
  {
    title: 'Impact Sliding Door & French Door Installation',
    description:
      'Premium sliding glass and French door solutions that maximize views while meeting Florida Building Code impact requirements. Low-profile tracks, multi-point locking, and thermal Low-E glass for up to 40% energy savings.',
    cta: 'Schedule Door Assessment',
    icon: DoorOpen,
    image: '/images/pic-2.webp',
    imageAlt: 'Impact sliding glass door installation',
    reverse: true,
  },
  {
    title: 'Technical Sliding Glass Door Repair',
    description:
      'Expert repair for grinding rollers, damaged tracks, failed locks, and misaligned panels — restoring smooth operation without unnecessary full replacements when restoration is the right engineering choice.',
    cta: 'Request Repair Service',
    icon: Wrench,
    image: '/images/pic-3.webp',
    imageAlt: 'Sliding glass door track and hardware repair',
    reverse: false,
  },
]

function ServiceMockup({ row }) {
  const Icon = row.icon
  return (
    <div className="transition-all duration-300 ease-in-out hover:-translate-y-1.5 hover:shadow-2xl">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-stone-900 shadow-card">
        <Image
          src={row.image}
          alt={row.imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
        <div
          className="absolute inset-0 bg-[linear-gradient(45deg,transparent_40%,rgba(255,255,255,0.04)_50%,transparent_60%)]"
          aria-hidden
        />
        <div className="absolute bottom-0 left-0 flex items-center gap-3 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm">
            <Icon className="h-6 w-6 text-amber-500" strokeWidth={1.5} aria-hidden />
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-200">
            RSA Windows — Coastal Florida
          </p>
        </div>
      </div>
    </div>
  )
}

function ServiceCopy({ row }) {
  return (
    <div className="flex flex-col justify-center">
      <h3 className="font-display text-2xl font-bold text-stone-900 sm:text-3xl">{row.title}</h3>
      <p className="mt-4 text-base leading-relaxed text-stone-600">{row.description}</p>
      <a
        href="#quote-form"
        className="group mt-6 inline-flex min-h-12 items-center gap-2 text-sm font-bold text-amber-700 transition-colors duration-300 hover:text-amber-600"
      >
        {row.cta}
        <ArrowRight
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2"
          aria-hidden
        />
      </a>
    </div>
  )
}

export function Services() {
  return (
    <section id="services" className="overflow-hidden bg-slate-50 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold text-stone-900 sm:text-4xl">
            Architectural Precision &amp; Coastal Protection
          </h2>
          <p className="mt-4 text-stone-600">
            Hurricane-impact window and sliding door systems engineered for Florida Building Code
            compliance across South Florida and Southwest Florida coastal corridors — Hollywood,
            Naples, and surrounding vulnerable zones.
          </p>
        </div>

        <div className="mt-16 space-y-16 lg:space-y-24">
          {SERVICE_ROWS.map((row) => (
            <div
              key={row.title}
              className={`grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
                row.reverse ? 'lg:[&>*:first-child]:order-2' : ''
              }`}
            >
              <ServiceCopy row={row} />
              <ServiceMockup row={row} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
