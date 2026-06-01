import { PROCESS_STEPS } from '@/lib/constants'

export function Process() {
  return (
    <section id="process" className="overflow-hidden px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl rounded-3xl bg-stone-900 p-8 text-white shadow-xl lg:p-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            The RSA Standard: Built for the Coast
          </h2>
          <p className="mt-4 text-stone-300">
            Every installation follows a disciplined engineering workflow — precise measurements,
            verified alignments, and zero shortcuts — so your impact systems perform when storms
            arrive.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          {PROCESS_STEPS.map((item) => (
            <div
              key={item.step}
              className="rounded-2xl border border-stone-700/60 bg-stone-800/40 p-6 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-amber-600/40"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-amber-600 to-yellow-500 text-sm font-bold text-white">
                {item.step}
              </span>
              <h3 className="mt-4 font-display text-xl font-bold">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-300">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
