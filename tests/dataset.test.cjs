const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const ts = require('typescript')

function loadTs(file, dependencies = {}) {
  const output = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
  const module = { exports: {} }
  new Function('require', 'module', 'exports', output)(name => dependencies[name] || require(name), module, module.exports)
  return module.exports
}
const data = loadTs('lib/dataset.ts')
const publicConfig = loadTs('lib/public-supabase-config.ts')
const { loadDataset } = loadTs('lib/load-dataset.ts', { './dataset': data, './public-supabase-config': publicConfig })
const rows = [
  { id: 1, work_year: 2020, salary_in_usd: 100, role_family: 'Data', experience_level: 'EN', work_mode: null, remote_ratio: 100, employee_residence: 'US', salary_outlier_flag: false },
  { id: 2, work_year: 2020, salary_in_usd: 300, role_family: 'Data', experience_level: 'SE', work_mode: 'Hybrid', employee_residence: 'US', salary_outlier_flag: true },
  { id: 3, work_year: 2022, salary_in_usd: null, role_family: null, experience_level: null, work_mode: null, employee_residence: null, salary_outlier_flag: null },
  { id: 4, work_year: 2022, salary_in_usd: 0, role_family: null },
]
test('medians handle even, odd, missing, and nonfinite values without mutating inputs', () => {
  const values = [300, 100]
  assert.equal(data.median(values), 200)
  assert.deepEqual(values, [300, 100])
  assert.equal(data.median([1, 9, 3, NaN]), 3)
  assert.equal(data.median([]), null)
})
test('filters intersect; outlier exclusion retains unknown flags', () => {
  assert.equal(data.filterRows(rows, { ...data.DEFAULT_FILTERS, year: '2020', mode: 'Remote', country: 'US' })[0].id, 1)
  assert.deepEqual(data.filterRows(rows, { ...data.DEFAULT_FILTERS, excludeOutliers: true }).map(row => row.id), [1, 3, 4])
  assert.equal(data.filterRows(rows, { ...data.DEFAULT_FILTERS, country: 'CA' }).length, 0)
})
test('salary metrics omit null and zero; missing years remain gaps', () => {
  assert.deepEqual(data.groupSalaries(rows, row => data.textValue(row.role_family)), [{ name: 'Data', median: 200, count: 2 }])
  const years = data.yearlySalaries(rows)
  assert.deepEqual(years[0], { year: 2020, median: 200, count: 2 })
  assert.deepEqual(years[2], { year: 2022, median: null, count: 0 })
  assert.equal(years.length, 7)
})
test('CSV preserves quotes, blanks, and numeric negatives while neutralizing formulas', () => {
  assert.equal(data.csvCell('=HYPERLINK("x")'), '"\'=HYPERLINK(""x"")"')
  assert.equal(data.csvCell('a,b'), '"a,b"')
  assert.equal(data.csvCell(null), '""')
  assert.equal(data.csvCell(-2), '"-2"')
  assert.equal(data.toCsv(rows).split('\r\n').length, 5)
})
test('loader follows server pagination and counts without treating a short page as complete', async () => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'public-test-key'
  const originalFetch = global.fetch
  const offsets = []
  global.fetch = async url => {
    const offset = Number(new URL(url).searchParams.get('offset'))
    offsets.push(offset)
    return new Response(JSON.stringify([rows[offset]]), { headers: { 'content-range': offset + '-' + offset + '/3' } })
  }
  try {
    const result = await loadDataset(new AbortController().signal, () => {})
    assert.deepEqual(offsets, [0, 1, 2])
    assert.equal(result.rows.length, 3)
    assert.equal(result.truncated, false)
  } finally { global.fetch = originalFetch }
})
test('loader distinguishes denied access from an empty table', async () => {
  const originalFetch = global.fetch
  try {
    global.fetch = async () => new Response('[]', { headers: { 'content-range': '*/0' } })
    assert.equal((await loadDataset(new AbortController().signal, () => {})).rows.length, 0)
    global.fetch = async () => new Response('{}', { status: 403 })
    await assert.rejects(loadDataset(new AbortController().signal, () => {}), /public reading/)
  } finally { global.fetch = originalFetch }
})
test('a deployment without environment variables uses the public dataset configuration', async () => {
  const originalFetch = global.fetch
  const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const originalKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  delete process.env.NEXT_PUBLIC_SUPABASE_URL
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  let requested = false
  global.fetch = async (url, options) => {
    requested = true
    assert.equal(new URL(url).origin, publicConfig.PUBLIC_SUPABASE_URL)
    assert.equal(options.headers.apikey, publicConfig.PUBLIC_SUPABASE_ANON_KEY)
    return new Response('[]', { headers: { 'content-range': '*/0' } })
  }
  try {
    await loadDataset(new AbortController().signal, () => {})
    assert.equal(requested, true)
  } finally {
    global.fetch = originalFetch
    if (originalUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL
    else process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl
    if (originalKey === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    else process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalKey
  }
})
