import { ArrowUpRight, Briefcase, Code, Mail, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { site } from '@/lib/site'

const links = [
  {
    label: 'Email',
    value: site.email,
    href: `mailto:${site.email}`,
    icon: Mail,
    external: false,
  },
  {
    label: 'GitHub',
    value: `@${site.handle}`,
    href: site.socials.github,
    icon: Code,
    external: true,
  },
  {
    label: 'LinkedIn',
    value: site.name,
    href: site.socials.linkedin,
    icon: Briefcase,
    external: true,
  },
]

export function ContactSection() {
  return (
    <section
      id="contact"
      className="mx-auto w-full max-w-5xl scroll-mt-20 px-6 py-24"
    >
      <div className="flex items-center gap-3 font-mono text-xs tracking-widest text-primary uppercase">
        <span>02</span>
        <span className="h-px w-8 bg-border" />
        <span className="text-muted-foreground">Contact</span>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1fr]">
        <div className="flex flex-col gap-5">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Career
          </h2>
          <p className="max-w-md text-pretty leading-relaxed text-muted-foreground">
            I&apos;m seeking a Summer 2027 internship with aspirations to
            transition into a permanent position in data science and AI broadly.
          </p>
          <div className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
            <MapPin className="size-4 text-primary" />
            {site.location}
          </div>
          <div>
            <Button
              size="lg"
              nativeButton={false}
              render={<a href={`mailto:${site.email}`} />}
            >
              <Mail data-icon="inline-start" />
              Say hello
            </Button>
          </div>
        </div>

        <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card/60">
          {links.map((link) => {
            const Icon = link.icon
            return (
              <Tooltip key={link.label}>
                <TooltipTrigger
                  render={
                    <a
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                    />
                  }
                  className="group flex items-center justify-between px-5 py-4 transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-muted"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </span>
                    <span className="flex flex-col text-left">
                      <span className="font-mono text-xs text-muted-foreground uppercase">
                        {link.label}
                      </span>
                      <span className="text-sm text-foreground">
                        {link.value}
                      </span>
                    </span>
                  </span>
                  <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                </TooltipTrigger>
                <TooltipContent>
                  {link.external ? `Open ${link.label}` : 'Send an email'}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>
      </div>

      <footer className="mt-24 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 font-mono text-xs text-muted-foreground sm:flex-row">
        <span>
          © {new Date().getFullYear()} {site.name}
        </span>
        <span>Built with Next.js · Class of {site.gradYear}</span>
      </footer>
    </section>
  )
}
