import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Work / Shift — AI Impact on Jobs & Salaries',
  description: 'Explore salary records from 2020–2026 by role, experience, country, and work mode. Interactive comparisons with transparent methods and limitations.',
}
export const viewport: Viewport = { colorScheme: 'light', themeColor: '#2254e8' }
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>
}

