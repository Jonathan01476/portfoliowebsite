import { site } from '@/lib/site'

const nav = [
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-6">
        <a
          href="#top"
          className="group flex items-center gap-2 font-mono text-sm"
        >
          <span className="inline-block size-2 rounded-full bg-primary shadow-[0_0_12px_var(--primary)]" />
          <span className="text-foreground">{site.handle}</span>
          <span className="text-muted-foreground">/~</span>
        </a>

        <nav className="flex items-center gap-1 font-mono text-sm">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
