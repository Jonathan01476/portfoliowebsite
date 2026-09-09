'use client'

import { useEffect, useMemo, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ArrowDownToLine, ArrowUpDown, BarChart3, BriefcaseBusiness, ChevronLeft, ChevronRight, Database, Globe2, Info, RefreshCw, Search, SlidersHorizontal, TrendingUp } from 'lucide-react'
import { countryName, DEFAULT_FILTERS, experience, filterRows, Filters, groupSalaries, MAX_RECORDS, median, money, number, SalaryRow, textValue, toCsv, validSalary, workMode, yearlySalaries } from '@/lib/dataset'
import { loadDataset } from '@/lib/load-dataset'

type View = 'overview' | 'data' | 'methods'
type LoadResult = Awaited<ReturnType<typeof loadDataset>>
const PAGE_SIZE = 15

function Ranking({ groups }: { groups: ReturnType<typeof groupSalaries> }) {
  const max = Math.max(...groups.map(group => group.median), 1)
  return <div className="rank-list">{groups.length ? groups.map((group, index) => <div className="rank-row" key={group.name}>
    <span className="rank-label" title={group.name}>{group.name}</span><strong>{money(group.median)}</strong>
    <div className="rank-track"><div className="rank-fill" style={{ width: (group.median / max * 100) + '%', background: index === 0 ? '#2254e8' : '#7997ed' }} /></div>
    <span className="rank-count">n = {number(group.count)}</span>
  </div>) : <p className="muted">No valid salaries in this selection.</p>}</div>
}

function Methods() {
  return <div className="method-grid">
    <article className="panel prose">
      <p className="eyebrow">READ THE DATA WITH CONTEXT</p>
      <h2>Salary patterns, not proof of AI impact</h2>
      <p>The dataset is titled “AI Impact on Jobs &amp; Salaries (2020–2026).” Its fields describe compensation, roles, experience, locations, and working arrangements. They do not measure AI adoption, displacement, vacancies, or total employment.</p>
      <p>Use this explorer to compare the records represented here. A change in salary or record count cannot, by itself, be attributed to AI or treated as a change in the job market.</p>
      <h2>How the numbers are calculated</h2>
      <ul>
        <li>Salary metrics use the median of positive, non-missing <code>salary_in_usd</code> values. Every record has equal weight.</li>
        <li>All charts respond to the same filters. Yearly points use each year’s records; gaps indicate no valid salaries.</li>
        <li>Values are nominal US dollars. No inflation, purchasing-power, or cost-of-living adjustment is applied.</li>
        <li>Flagged outliers are included by default. The checkbox excludes only records explicitly flagged as outliers; an unknown flag is retained.</li>
        <li>Record counts describe this dataset, not unique workers, job openings, or jobs created. Duplicate observations may exist.</li>
      </ul>
      <h2>What remains unverified</h2>
      <p>The original source, collection method, sampling coverage, currency-conversion method, outlier rule, and whether 2026 values are observed, projected, or synthetic have not been supplied. Treat findings as descriptive and provisional.</p>
    </article>
    <article className="panel">
      <div className="panel-heading"><div><h2>Field guide</h2><p>A quick reference for the explorer.</p></div><Info size={19} /></div>
      <dl className="definitions">
        <dt>Median salary · USD</dt><dd>The middle salary after sorting. With an even number of records, the average of the two middle values.</dd>
        <dt>Role family</dt><dd>The dataset’s grouping of job titles. These categories are used as supplied and do not imply AI exposure.</dd>
        <dt>Experience</dt><dd>The supplied label, or the code: EN (entry), MI (mid), SE (senior), EX (executive).</dd>
        <dt>Work mode</dt><dd>The supplied label, falling back to remote ratio: 0 is on-site, 50 is hybrid, and 100 is remote.</dd>
        <dt>Employee country</dt><dd>The employee’s country of residence. It may differ from the company’s location.</dd>
        <dt>Sample size · n</dt><dd>Records with valid salaries in a comparison. Small groups may produce unstable medians.</dd>
        <dt>Missing values</dt><dd>Missing categories appear as “Unknown.” Missing or non-positive USD salaries stay in the records table but are excluded from salary metrics.</dd>
        <dt>Data coverage</dt><dd>The explorer includes years 2020 through 2026. It reads up to {number(MAX_RECORDS)} records, ordered by ID; a notice appears if that limit is reached. A limited extract is not a random sample.</dd>
      </dl>
    </article>
  </div>
}

export default function DataExplorer() {
  const [view, setView] = useState<View>('overview')
  const [result, setResult] = useState<LoadResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState({ loaded: 0, total: null as number | null })
  const [revision, setRevision] = useState(0)
  const [filters, setFilters] = useState<Filters>({ ...DEFAULT_FILTERS })
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [sort, setSort] = useState<{ key: keyof SalaryRow; ascending: boolean }>({ key: 'salary_in_usd', ascending: false })

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true); setError(''); setResult(null); setProgress({ loaded: 0, total: null })
    loadDataset(controller.signal, (loaded, total) => setProgress({ loaded, total }))
      .then(data => { if (!controller.signal.aborted) setResult(data) })
      .catch(reason => { if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : 'Unable to load the dataset.') })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [revision])

  const rows = useMemo(() => (result?.rows || []).filter(row => row.work_year !== null && row.work_year >= 2020 && row.work_year <= 2026), [result])
  const options = useMemo(() => {
    const unique = (key: (row: SalaryRow) => string) => Array.from(new Set(rows.map(key))).sort((a, b) => a.localeCompare(b))
    return {
      year: unique(row => String(row.work_year)), role: unique(row => textValue(row.role_family)),
      experience: unique(experience), mode: unique(workMode), country: unique(row => textValue(row.employee_residence)),
    }
  }, [rows])
  const filtered = useMemo(() => filterRows(rows, filters), [rows, filters])
  const salaryRows = useMemo(() => filtered.filter(validSalary), [filtered])
  const summary = useMemo(() => ({
    median: median(salaryRows.map(row => row.salary_in_usd!)),
    roles: new Set(filtered.map(row => row.job_title?.trim()).filter(Boolean)).size,
    countries: new Set(filtered.map(row => row.employee_residence?.trim()).filter(Boolean)).size,
    yearly: yearlySalaries(filtered),
    families: groupSalaries(filtered, row => textValue(row.role_family)).slice(0, 6),
    experience: groupSalaries(filtered, experience),
    modes: groupSalaries(filtered, workMode),
  }), [filtered, salaryRows])
  const tableRows = useMemo(() => {
    const query = search.trim().toLocaleLowerCase()
    const matches = query ? filtered.filter(row => [row.job_title, row.role_family, experience(row), workMode(row), row.employee_residence, row.company_location, row.employment_type_label].some(value => value?.toLocaleLowerCase().includes(query))) : filtered
    return [...matches].sort((a, b) => {
      const left = a[sort.key], right = b[sort.key]
      if (left === null && right === null) return a.id - b.id
      if (left === null) return 1
      if (right === null) return -1
      const comparison = typeof left === 'number' && typeof right === 'number' ? left - right : String(left).localeCompare(String(right))
      return (sort.ascending ? comparison : -comparison) || a.id - b.id
    })
  }, [filtered, search, sort])
  const pageCount = Math.max(1, Math.ceil(tableRows.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount - 1)
  const visibleRows = tableRows.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE)
  const plotted = summary.yearly.filter(point => point.median !== null)
  const first = plotted[0], last = plotted[plotted.length - 1]
  const change = first && last && first.year !== last.year ? ((last.median! - first.median!) / first.median! * 100) : null

  function updateFilter(key: keyof Filters, value: string | boolean) {
    setFilters(previous => ({ ...previous, [key]: value })); setPage(0)
  }
  function resetFilters() { setFilters({ ...DEFAULT_FILTERS }); setSearch(''); setPage(0) }
  function sortBy(key: keyof SalaryRow) { setSort(previous => ({ key, ascending: previous.key === key ? !previous.ascending : true })); setPage(0) }
  function download() {
    const exportRows = view === 'data' ? tableRows : filtered
    const url = URL.createObjectURL(new Blob([toCsv(exportRows)], { type: 'text/csv;charset=utf-8;' }))
    const link = document.createElement('a'); link.href = url; link.download = 'work-shift-salaries-filtered.csv'; link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  const exportCount = view === 'data' ? tableRows.length : filtered.length
  const hasData = !loading && !error && rows.length > 0
  const headers: { label: string; key: keyof SalaryRow }[] = [
    { label: 'Job title', key: 'job_title' }, { label: 'Year', key: 'work_year' }, { label: 'Salary · USD', key: 'salary_in_usd' },
    { label: 'Role family', key: 'role_family' }, { label: 'Experience', key: 'experience_level_label' },
    { label: 'Work mode', key: 'work_mode' }, { label: 'Employee country', key: 'employee_residence' },
  ]

  return <>
    <a className="skip-link" href="#main">Skip to explorer</a>
    <header className="topbar"><a className="brand" href="/" aria-label="Work Shift home"><span className="brand-mark"><BarChart3 size={23} /></span>WORK <span>/ SHIFT</span></a><span className="topbar-note">THE CHANGING WORLD OF WORK</span></header>
    <main className="app-shell" id="main">
      <section className="intro"><div><p className="eyebrow">THE SALARY EXPLORER / 2020–2026</p><h1>AI, jobs &amp; the salary picture<span className="period">.</span></h1><p>Explore how pay varies across roles, experience, and the way we work.</p></div><button className="button" onClick={download} disabled={!hasData || !exportCount}><ArrowDownToLine size={16} /> Export {view === 'data' ? 'results' : 'selection'}</button></section>
      <div className="nav-row"><nav className="tabs" aria-label="Explorer views">
        <button className="tab" aria-pressed={view === 'overview'} onClick={() => setView('overview')}><BarChart3 size={16} />Overview</button>
        <button className="tab" aria-pressed={view === 'data'} onClick={() => setView('data')}><Database size={16} />Data</button>
        <button className="tab" aria-pressed={view === 'methods'} onClick={() => setView('methods')}><Info size={16} />About the data</button>
      </nav><span className="live-label">{result && !loading ? <><span className="live-dot" />Fetched from Supabase</> : 'AI Impact on Jobs & Salaries'}</span></div>

      {view === 'methods' ? <Methods /> : <>
        <section className="filter-panel" aria-label="Dataset filters">
          <div className="filter-top"><span className="filter-title"><SlidersHorizontal size={16} />Make your comparison</span><button className="text-button" onClick={resetFilters}>Reset filters</button></div>
          <div className="filters">{([
            ['year', 'Year', 'All years'], ['role', 'Role family', 'All role families'], ['experience', 'Experience', 'All experience levels'], ['mode', 'Work mode', 'All work modes'], ['country', 'Employee country', 'All countries'],
          ] as const).map(([key, label, all]) => <label className="field" key={key}>{label}<select value={filters[key]} onChange={event => updateFilter(key, event.target.value)} disabled={!hasData}><option value="">{all}</option>{options[key].map(option => <option key={option} value={option}>{key === 'country' ? countryName(option) : option}</option>)}</select></label>)}</div>
          <div className="filter-bottom"><label className="check"><input type="checkbox" checked={filters.excludeOutliers} onChange={event => updateFilter('excludeOutliers', event.target.checked)} />Exclude flagged salary outliers</label><span aria-live="polite">{hasData ? number(filtered.length) + ' of ' + number(rows.length) + ' loaded records' : 'Years 2020–2026 · Salaries in USD'}</span></div>
        </section>
        {result?.truncated && <div className="notice">Limited extract: showing the first {number(result.rows.length)} records by ID{result.total !== null ? ' of ' + number(result.total) : ''}. Every result below describes this extract, not the complete dataset.</div>}
        {!!result && result.rows.length > rows.length && <div className="notice">{number(result.rows.length - rows.length)} records outside 2020–2026 or missing a year are omitted from this explorer.</div>}
        {loading ? <section className="state" role="status"><Database size={30} /><h2>Bringing the salary picture into focus</h2><p>Reading the dataset{progress.loaded ? ' · ' + number(progress.loaded) + (progress.total !== null ? ' of ' + number(progress.total) : '') + ' records' : '…'}</p><progress aria-label="Loading dataset" value={progress.total ? progress.loaded : undefined} max={progress.total || 1} /></section>
          : error ? <section className="state" role="alert"><Info size={30} /><h2>We couldn’t load the dataset</h2><p>{error}</p><button className="button primary" onClick={() => setRevision(value => value + 1)}><RefreshCw size={16} />Try again</button></section>
          : !rows.length ? <section className="state"><Database size={30} /><h2>No dataset records are available yet</h2><p>The connection returned no records for 2020–2026. The site owner may need to import the data or enable public read access.</p><button className="button" onClick={() => setRevision(value => value + 1)}><RefreshCw size={16} />Check again</button></section>
          : !filtered.length ? <section className="state"><Search size={30} /><h2>No records match this combination</h2><p>Try another year, role, or work mode—or clear the filters to see the full dataset.</p><button className="button primary" onClick={resetFilters}>Reset filters</button></section>
          : view === 'overview' ? <>
            <section className="metrics" aria-label="Selection summary">
              <div className="metric featured"><div className="metric-label">Median salary <TrendingUp size={18} /></div><div className="metric-value">{money(summary.median)}</div><div className="metric-note">USD · {number(salaryRows.length)} valid salary records</div></div>
              <div className="metric"><div className="metric-label">Salary records <Database size={18} /></div><div className="metric-value">{number(filtered.length)}</div><div className="metric-note">Observations in your selection</div></div>
              <div className="metric"><div className="metric-label">Job titles <BriefcaseBusiness size={18} /></div><div className="metric-value">{number(summary.roles)}</div><div className="metric-note">Distinct non-missing titles</div></div>
              <div className="metric"><div className="metric-label">Countries represented <Globe2 size={18} /></div><div className="metric-value">{number(summary.countries)}</div><div className="metric-note">By employee residence</div></div>
            </section>
            <div className="chart-grid">
              <section className="panel"><div className="panel-heading"><div><h2>The salary trajectory</h2><p>Median salary by year</p></div><span className="tag">NOMINAL USD</span></div>
                <div className="chart" role="img" aria-label={'Median USD salary by year. ' + summary.yearly.map(point => point.year + ': ' + money(point.median) + ', ' + point.count + ' records').join('. ')}>
                  <ResponsiveContainer width="100%" height="100%"><AreaChart data={summary.yearly} margin={{ top: 12, right: 12, left: 0, bottom: 4 }}><defs><linearGradient id="salary-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2254e8" stopOpacity={0.2} /><stop offset="100%" stopColor="#2254e8" stopOpacity={0.01} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#e8edf5" strokeDasharray="3 4" /><XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#637087', fontSize: 12 }} dy={8} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#637087', fontSize: 12 }} tickFormatter={value => '$' + number(value / 1000) + 'k'} width={65} /><Tooltip content={({ active, payload, label }) => active && payload?.length ? <div style={{ background: 'white', border: '1px solid #dce2ec', borderRadius: 6, padding: 12, fontSize: 14 }}><strong>{label}</strong><div>{money(payload[0].payload.median)} median</div><div>{number(payload[0].payload.count)} salary records</div></div> : null} /><Area type="linear" dataKey="median" stroke="#2254e8" strokeWidth={3} fill="url(#salary-fill)" dot={{ r: 4, fill: '#fff', strokeWidth: 2 }} connectNulls={false} isAnimationActive={false} /></AreaChart></ResponsiveContainer>
                </div><p className="chart-note">Each year may contain a different mix of roles and locations. Missing years are not interpolated.</p>
              </section>
              <section className="panel"><div className="panel-heading"><div><h2>Where salaries stand</h2><p>Top six role families by median salary</p></div><span className="tag">USD</span></div><Ranking groups={summary.families} /><p className="chart-note">Sample sizes count valid salaries. Small groups deserve extra caution.</p></section>
            </div>
            <aside className="insight"><Info size={20} /><div><h2>{change !== null ? 'A pattern worth exploring' : 'Read the comparison in context'}</h2><p>{change !== null ? 'The median in this selection is ' + Math.abs(change).toFixed(1) + '% ' + (change >= 0 ? 'higher' : 'lower') + ' in ' + last.year + ' than in ' + first.year + '. ' : 'Select multiple years to compare salary medians over time. '}These are differences between observed groups, not a measure of AI’s causal impact.</p></div></aside>
            <div className="secondary-grid">
              <section className="panel"><div className="panel-heading"><div><h2>Experience &amp; compensation</h2><p>Median salary for each experience group</p></div></div><Ranking groups={summary.experience} /></section>
              <section className="panel"><div className="panel-heading"><div><h2>Does where we work differ?</h2><p>Median salary by working arrangement</p></div></div><div className="mode-grid">{summary.modes.map(mode => <div className="mode" key={mode.name}><h3>{mode.name}</h3><strong>{money(mode.median)}</strong><span>n = {number(mode.count)}</span></div>)}</div><p className="chart-note">These comparisons do not control for role, location, or experience. Use the filters to narrow the mix.</p></section>
            </div>
            <div className="notice">This dataset does not establish AI adoption or job losses. Source methodology and the status of 2026 records are unverified. <button className="text-button" onClick={() => setView('methods')}>Read the methodology</button></div>
          </> : <section className="panel">
            <div className="panel-heading"><div><h2>Behind every number</h2><p>Inspect the records in your selection. Click a column to sort.</p></div><label className="search"><Search size={16} /><input aria-label="Search records" placeholder="Search titles, roles, countries…" value={search} onChange={event => { setSearch(event.target.value); setPage(0) }} /></label></div>
            <div className="table-wrap"><table><caption className="sr-only">Filtered salary records, sorted by {sort.key} {sort.ascending ? 'ascending' : 'descending'}</caption><thead><tr>{headers.map(header => <th key={header.key} scope="col" aria-sort={sort.key === header.key ? (sort.ascending ? 'ascending' : 'descending') : 'none'}><button onClick={() => sortBy(header.key)}>{header.label}<ArrowUpDown size={12} /></button></th>)}<th scope="col">Outlier flag</th></tr></thead><tbody>{visibleRows.map(row => <tr key={row.id}><td>{textValue(row.job_title)}</td><td>{row.work_year}</td><td className="salary-cell">{money(row.salary_in_usd)}</td><td>{textValue(row.role_family)}</td><td>{experience(row)}</td><td><span className="tag">{workMode(row)}</span></td><td>{countryName(textValue(row.employee_residence))}</td><td>{row.salary_outlier_flag === null ? 'Unknown' : row.salary_outlier_flag ? 'Flagged' : 'Not flagged'}</td></tr>)}</tbody></table></div>
            {!tableRows.length && <p className="muted" style={{ padding: 24 }}>No records match your search.</p>}
            <div className="table-footer"><span aria-live="polite">{tableRows.length ? number(currentPage * PAGE_SIZE + 1) + '–' + number(Math.min((currentPage + 1) * PAGE_SIZE, tableRows.length)) : '0'} of {number(tableRows.length)} records</span><div className="pagination"><button className="button" aria-label="Previous page" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}><ChevronLeft size={16} /></button><span>Page {currentPage + 1} of {pageCount}</span><button className="button" aria-label="Next page" disabled={currentPage + 1 >= pageCount} onClick={() => setPage(currentPage + 1)}><ChevronRight size={16} /></button></div></div>
          </section>}
      </>}
      <footer className="footer"><span>WORK / SHIFT · AI Impact on Jobs &amp; Salaries (2020–2026)</span><span>{result ? 'Fetched ' + new Date(result.loadedAt).toLocaleString() + ' · ' : ''}Descriptive data, considered carefully.</span></footer>
    </main>
  </>
}

