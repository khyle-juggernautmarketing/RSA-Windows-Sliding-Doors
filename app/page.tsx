import { Footer } from '@/components/Footer'
import { GeoTargeting } from '@/components/GeoTargeting'
import { Hero } from '@/components/Hero'
import { MetricsRibbon } from '@/components/MetricsRibbon'
import { Navbar } from '@/components/Navbar'
import { Process } from '@/components/Process'
import { Services } from '@/components/Services'

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="overflow-hidden">
        <Hero />
        <MetricsRibbon />
        <Services />
        <Process />
        <GeoTargeting />
      </main>
      <Footer />
    </>
  )
}
