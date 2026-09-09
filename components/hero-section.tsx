import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { site } from '@/lib/site'

export function HeroSection() {
  return (
    <section
      id="top"
      className="relative mx-auto flex min-h-svh w-full max-w-5xl flex-col justify-center px-6 pt-28 pb-20"
    >
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left: intro */}
        <div className="flex flex-col items-start gap-6">
          <p className="font-mono text-xs tracking-widest text-primary uppercase">
            {'// data science · ai · class of '}
            {site.gradYear}
          </p>

          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 font-mono text-xs text-muted-foreground">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-70" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            {site.status}
          </span>

          <div className="flex flex-col gap-3">
            <h1 className="text-pretty text-5xl font-semibold tracking-tight sm:text-6xl md:text-7xl">
              {site.name}
            </h1>
            <p className="font-mono text-base text-muted-foreground">
              {site.role}
            </p>
          </div>

          <p className="max-w-md text-pretty text-lg leading-relaxed text-muted-foreground">
            {site.tagline}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button size="lg" nativeButton={false} render={<a href="#contact" />}>
              Get in touch
              <ArrowUpRight data-icon="inline-end" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={<a href="#about" />}
            >
              About me
              <ArrowDown data-icon="inline-end" />
            </Button>
          </div>
        </div>

        {/* Right: terminal profile card */}
        <div className="w-full">
          <div className="overflow-hidden rounded-xl border border-border bg-card/80 shadow-2xl shadow-black/40 backdrop-blur">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <span className="size-3 rounded-full bg-destructive/70" />
              <span className="size-3 rounded-full bg-primary/50" />
              <span className="size-3 rounded-full bg-primary" />
              <span className="ml-3 font-mono text-xs text-muted-foreground">
                {site.handle}@portfolio: ~
              </span>
            </div>
            <div className="space-y-1.5 p-5 font-mono text-sm leading-relaxed">
              <p className="text-muted-foreground">
                <span className="text-primary">$</span> whoami
              </p>
              <p className="text-foreground">{site.name}</p>
              <div className="pt-2">
                <p className="text-muted-foreground">
                  <span className="text-primary">$</span> cat profile.json
                </p>
                <pre className="mt-1 whitespace-pre-wrap text-foreground">
{`{
  "role": "Data Science",
  "minor": "Artificial Intelligence",
  "grad": ${site.gradYear},
  "loves": ["data science", "science", "philosophy", "logic", "language"]
}`}
                </pre>
              </div>
              <p className="pt-2 text-muted-foreground">
                <span className="text-primary">$</span>{' '}
                <span className="inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-primary" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
