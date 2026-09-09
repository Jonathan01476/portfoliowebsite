export function GridBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* fine technical grid */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(to right, color-mix(in oklch, var(--foreground) 6%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklch, var(--foreground) 6%, transparent) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage:
            'radial-gradient(120% 80% at 50% 0%, black 40%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(120% 80% at 50% 0%, black 40%, transparent 100%)',
        }}
      />
      {/* accent glow */}
      <div
        className="absolute -top-40 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{ background: 'var(--primary)' }}
      />
    </div>
  )
}
