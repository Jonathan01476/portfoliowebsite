import { BookOpen, Brain, LineChart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { about, focusAreas, toolkit } from '@/lib/site'

const icons = {
  stats: LineChart,
  ml: Brain,
  phil: BookOpen,
} as const

function SectionLabel({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-center gap-3 font-mono text-xs tracking-widest text-primary uppercase">
      <span>{index}</span>
      <span className="h-px w-8 bg-border" />
      <span className="text-muted-foreground">{title}</span>
    </div>
  )
}

export function AboutSection() {
  return (
    <section
      id="about"
      className="mx-auto w-full max-w-5xl scroll-mt-20 px-6 py-24"
    >
      <SectionLabel index="01" title="About" />

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1fr]">
        <div className="flex flex-col gap-5">
          {about.paragraphs.map((paragraph) => (
            <p
              key={paragraph.slice(0, 24)}
              className="text-pretty leading-relaxed text-muted-foreground"
            >
              {paragraph}
            </p>
          ))}

          <div className="pt-2">
            <p className="mb-3 font-mono text-xs tracking-widest text-muted-foreground uppercase">
              Toolkit
            </p>
            <div className="flex flex-wrap gap-2">
              {toolkit.map((tool) => (
                <Badge key={tool} variant="outline" className="font-mono">
                  {tool}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {focusAreas.map((area) => {
            const Icon = icons[area.key]
            return (
              <Card key={area.key} className="transition-colors hover:bg-card/60">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </span>
                    <CardTitle className="text-base">{area.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {area.body}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
