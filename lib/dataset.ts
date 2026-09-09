export const TABLE_NAME = 'AI Impact on Jobs & Salaries (2020-2026)'
export const MAX_RECORDS = 100_000
export type SalaryRow = {
  id: number; work_year: number | null; experience_level: string | null;
  employment_type: string | null; job_title: string | null; salary: number | null;
  salary_currency: string | null; salary_in_usd: number | null;
  employee_residence: string | null; remote_ratio: number | null;
  company_location: string | null; company_size: string | null;
  experience_level_label: string | null; employment_type_label: string | null;
  work_mode: string | null; salary_outlier_flag: boolean | null;
  role_family: string | null; isco_group_hint: string | null;
}
export type Filters = { year: string; role: string; experience: string; mode: string; country: string; excludeOutliers: boolean }
export const DEFAULT_FILTERS: Filters = { year: '', role: '', experience: '', mode: '', country: '', excludeOutliers: false }
export const textValue = (value: string | null | undefined) => value?.trim() || 'Unknown'
export function experience(row: SalaryRow) {
  return row.experience_level_label?.trim() || ({ EN: 'Entry-level', MI: 'Mid-level', SE: 'Senior', EX: 'Executive' }[row.experience_level || ''] ?? textValue(row.experience_level))
}
export function workMode(row: SalaryRow) {
  return row.work_mode?.trim() || ({ 0: 'On-site', 50: 'Hybrid', 100: 'Remote' }[row.remote_ratio ?? -1] ?? 'Unknown')
}
export function validSalary(row: SalaryRow) { return typeof row.salary_in_usd === 'number' && Number.isFinite(row.salary_in_usd) && row.salary_in_usd > 0 }
export function median(values: number[]): number | null {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b)
  if (!sorted.length) return null
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}
export function filterRows(rows: SalaryRow[], filters: Filters) {
  return rows.filter(row => (!filters.year || String(row.work_year) === filters.year)
    && (!filters.role || textValue(row.role_family) === filters.role)
    && (!filters.experience || experience(row) === filters.experience)
    && (!filters.mode || workMode(row) === filters.mode)
    && (!filters.country || textValue(row.employee_residence) === filters.country)
    && (!filters.excludeOutliers || row.salary_outlier_flag !== true))
}
export function groupSalaries(rows: SalaryRow[], key: (row: SalaryRow) => string) {
  const groups = new Map<string, number[]>()
  for (const row of rows) {
    if (!validSalary(row)) continue
    const name = key(row)
    const list = groups.get(name) || []
    list.push(row.salary_in_usd!)
    groups.set(name, list)
  }
  return Array.from(groups, ([name, values]) => ({ name, median: median(values)!, count: values.length }))
    .sort((a, b) => b.median - a.median || a.name.localeCompare(b.name))
}
export function yearlySalaries(rows: SalaryRow[]) {
  const groups = groupSalaries(rows, row => String(row.work_year))
  return Array.from({ length: 7 }, (_, i) => {
    const year = 2020 + i
    const group = groups.find(group => group.name === String(year))
    return { year, median: group?.median ?? null, count: group?.count ?? 0 }
  })
}
export const money = (value: number | null) => value === null ? '—' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
export const number = (value: number) => new Intl.NumberFormat('en-US').format(value)
export function countryName(code: string) {
  try { return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || code } catch { return code }
}
export function csvCell(value: unknown): string {
  let cell = value === null || value === undefined ? '' : String(value)
  if (typeof value === 'string' && /^[\s]*[=+@-]/.test(cell)) cell = "'" + cell
  return '"' + cell.replace(/"/g, '""') + '"'
}
export function toCsv(rows: SalaryRow[]) {
  const columns: (keyof SalaryRow)[] = ['id', 'work_year', 'job_title', 'role_family', 'salary_in_usd', 'salary', 'salary_currency', 'experience_level', 'experience_level_label', 'employment_type', 'employment_type_label', 'employee_residence', 'company_location', 'company_size', 'work_mode', 'remote_ratio', 'salary_outlier_flag', 'isco_group_hint']
  return '\uFEFF' + [columns.map(csvCell).join(','), ...rows.map(row => columns.map(key => csvCell(row[key])).join(','))].join('\r\n')
}
