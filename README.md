# Data Explorer

A Next.js application for exploring, visualizing, and analyzing datasets connected to Supabase.

## Features

- 📊 Interactive data visualization with charts and graphs
- 🔍 Data table exploration with sorting and filtering
- 📈 Real-time statistics and summary metrics
- 🗄️ Direct integration with Supabase database
- 🎨 Beautiful UI built with Tailwind CSS and shadcn components

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Database**: Supabase (PostgreSQL)
- **Visualization**: Recharts
- **Styling**: Tailwind CSS, shadcn components
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Supabase:**
   - Create a new project at [supabase.com](https://supabase.com)
   - Set up your database schema and import your dataset
   - Copy your project URL and anon key

3. **Add environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

4. **Update your table name:**
   - Open `app/page.tsx`
   - Replace `'your_table_name'` with your actual Supabase table name

5. **Run the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── page.tsx                 # Main data explorer page
│   └── api/
│       └── data/
│           └── route.ts         # Data fetching API endpoint
├── components/
│   └── DataExplorer.tsx         # Data exploration component
├── lib/
│   └── supabase.ts             # Supabase client configuration
├── .env.local.example           # Environment variables template
└── package.json
```

## Customization

### Add More Visualizations

Edit `components/DataExplorer.tsx` to add additional chart types:

```typescript
import {
  LineChart,
  PieChart,
  ScatterChart,
} from 'recharts'
```

### Query Specific Data

Modify the API route in `app/api/data/route.ts` to add filtering:

```typescript
const { data, error } = await supabase
  .from(table)
  .select('*')
  .eq('column_name', 'value')
  .limit(parseInt(limit))
```

### Connect Multiple Tables

Duplicate the `DataExplorer` component and pass different table names to visualize multiple datasets.

## Deployment

Deploy to Vercel with a single click:

```bash
npm run build
```

Make sure to add your environment variables in your hosting platform's settings.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Recharts Documentation](https://recharts.org)
- [Tailwind CSS](https://tailwindcss.com)

## License

MIT
