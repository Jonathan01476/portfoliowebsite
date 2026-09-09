import { AboutSection } from '@/components/about-section'
import { ContactSection } from '@/components/contact-section'
import { GridBackdrop } from '@/components/grid-backdrop'
import { HeroSection } from '@/components/hero-section'
import { SiteHeader } from '@/components/site-header'

export default function Page() {
  return (
    <main className="relative min-h-svh">
      <GridBackdrop />
      <SiteHeader />
      <HeroSection />
      <AboutSection />
      <ContactSection />
    </main>
  )
}
