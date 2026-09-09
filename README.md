# Work / Shift — Salary Explorer

A Supabase-backed explorer for **AI Impact on Jobs & Salaries (2020–2026)**.

## Explore

- Overview: median USD salaries by year, role family, experience, and work mode, with sample sizes.
- Shared filters: year, role family, experience, work mode, employee country, and flagged-outlier exclusion.
- Data: searchable, sortable records with pagination and CSV export of the current results.
- About the data: field definitions, calculation rules, and limitations.

The dataset does not contain direct measures of AI adoption, displacement, or total employment. The site does not attribute salary patterns to AI. Source provenance and the status of 2026 values remain unverified.

## Local setup

Requires Node.js 22+ and pnpm 9.12.3 (the version in packageManager).

1. Run `npx --yes pnpm@9.12.3 install`.
2. The public dataset connection works without environment variables. To override it, copy `.env.local.example` to `.env.local` and set the URL and anon/publishable key.
3. Run `npm run dev` and visit the local URL.

The Supabase URL is `https://agjtywogdnmpvajyyfkl.supabase.co`.
The exact table name is `public."AI Impact on Jobs & Salaries (2020-2026)"`.

Only a public read key is used. The dataset URL and anon key are intentionally included in `lib/public-supabase-config.ts`, so GitHub-connected builds work without host-specific setup. These public values are visible to website visitors; access is controlled by Supabase grants and row-level policies. Never use a secret or service-role key. Public read access must be enabled only for data intended to be public. Local environment files remain ignored. Existing Git history is not rewritten.

## Data behavior

The loader pages by ascending ID, follows the API's exact count, and reads up to 100,000 records. If the limit is reached, a prominent notice identifies the results as a limited, non-random extract. There is no fabricated fallback data. Loading, failed access, empty data, and empty filter results each have their own state.

Only years 2020–2026 are included; omitted-year counts are disclosed. Salary metrics use positive, finite USD values. Records without valid salaries remain inspectable. Outliers are included by default. Unknown flags remain included when flagged rows are excluded. Medians are unweighted, nominal USD; no inflation adjustment is applied.

A page load fetches fresh records. Multiple paginated requests are not a transactional snapshot, so results can change if the source is edited during loading. Search is specific to the Data view; shared filters affect both views. Data-view CSV export includes all search results, not just the visible page. Overview export includes all filtered records. Text cells are escaped to prevent spreadsheet formula execution.

## Validate and build

- `npm test`: arithmetic, filtering, CSV, and pagination/access regression checks.
- `npm run typecheck`: TypeScript.
- `npm run build`: production static export in `out/`.
- `npm start`: local production preview after building.

Next.js remains the framework. The obsolete generic API route and portfolio sections were removed; the explorer needs no server secrets or server runtime. The production output can be hosted on Sites, Vercel, or a static host. Public environment overrides are embedded at build time; rebuild after changing them. Without overrides, the app uses the committed public dataset configuration. The Sites manifest identifies the separate private review site; the original GitHub remote is retained.

## Main files

- `components/DataExplorer.tsx`: interface and interaction state.
- `lib/dataset.ts`: typed rows, filters, aggregation, and CSV.
- `lib/load-dataset.ts`: paginated Supabase reads.
- `app/globals.css`: responsive theme.
- `tests/dataset.test.cjs`: data regression checks.

