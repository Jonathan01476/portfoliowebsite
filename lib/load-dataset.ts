import { MAX_RECORDS, SalaryRow, TABLE_NAME } from './dataset'

export async function loadDataset(signal: AbortSignal, onProgress: (loaded: number, total: number | null) => void) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!base || !key) throw new Error('The dataset connection has not been configured. Please contact the site owner.')
  if (key.startsWith('sb_secret_')) throw new Error('The dataset requires a public read key. An elevated key cannot be used in the browser.')
  const rows: SalaryRow[] = []
  let total: number | null = null
  let complete = false
  while (rows.length < MAX_RECORDS) {
    const url = new URL('/rest/v1/' + encodeURIComponent(TABLE_NAME), base)
    url.searchParams.set('select', '*')
    url.searchParams.set('order', 'id.asc')
    url.searchParams.set('limit', String(Math.min(1000, MAX_RECORDS - rows.length)))
    url.searchParams.set('offset', String(rows.length))
    const response = await fetch(url.toString(), { headers: { apikey: key, Prefer: 'count=exact' }, signal })
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) throw new Error('The dataset is not available for public reading yet. Please contact the site owner.')
      throw new Error('The dataset could not be loaded. Please try again in a moment.')
    }
    const contentRange = response.headers.get('content-range')?.split('/')[1]
    if (contentRange && contentRange !== '*') total = Number(contentRange)
    const page = await response.json() as SalaryRow[]
    if (!Array.isArray(page)) throw new Error('The data service returned an unexpected response.')
    rows.push(...page)
    onProgress(rows.length, total)
    if (!page.length || (total !== null && rows.length >= total)) { complete = true; break }
  }
  return { rows, total, truncated: !complete, loadedAt: new Date().toISOString() }
}
