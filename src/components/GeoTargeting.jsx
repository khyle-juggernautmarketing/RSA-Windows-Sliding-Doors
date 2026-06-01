import { GEO_CITIES } from '@/lib/constants'

export function GeoTargeting() {
  return (
    <section
      id="locations"
      className="overflow-hidden border-t border-stone-100 bg-white px-4 py-16 text-center"
    >
      <div className="mx-auto max-w-4xl">
        <h2 className="font-display text-3xl font-bold text-stone-900 sm:text-4xl">
          Professional Coastal Protection Across South &amp; Southwest Florida
        </h2>
        <p className="mt-4 text-stone-600">
          Rapid-response impact window and sliding door service across Florida&apos;s most vulnerable
          coastal corridors — from Hollywood and the Broward corridor to Naples, Cape Coral, and
          Southwest Florida beach communities.
        </p>

        <div className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-2">
          {GEO_CITIES.map((city) => {
            const label = city.label ?? city.name
            return (
              <span
                key={city.name}
                className={`cursor-default rounded-full border py-2 px-4 text-sm font-medium transition-all duration-200 ease-in-out hover:scale-105 ${
                  city.featured
                    ? 'border-amber-600 bg-amber-50/50 font-bold text-stone-800 hover:border-amber-400 hover:bg-amber-50'
                    : 'border-stone-200 bg-stone-100 text-stone-800 hover:border-amber-400 hover:bg-amber-50'
                }`}
              >
                {label}
              </span>
            )
          })}
        </div>
      </div>
    </section>
  )
}
