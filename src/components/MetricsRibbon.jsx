import { METRICS } from '@/lib/constants'

export function MetricsRibbon() {
  return (
    <section
      id="metrics"
      className="overflow-hidden px-4 py-6"
      aria-labelledby="metrics-heading"
    >
      <div className="mx-auto my-6 grid max-w-7xl grid-cols-2 gap-6 rounded-2xl border-y border-stone-200 bg-white px-4 py-10 shadow-sm md:grid-cols-4">
        <h2 id="metrics-heading" className="sr-only">
          Performance metrics
        </h2>
        {METRICS.map((metric) => (
          <div key={metric.value} className="text-center">
            <p className="font-display text-2xl font-extrabold text-stone-900 sm:text-3xl md:text-4xl">
              {metric.value}
            </p>
            <p className="mt-2 text-xs font-medium text-stone-600 sm:text-sm">{metric.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
