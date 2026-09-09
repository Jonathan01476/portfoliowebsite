import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type your database schema here
export type Database = {
  public: {
    Tables: {
      // Define your tables here
      // Example:
      // your_table: {
      //   Row: {
      //     id: number
      //     name: string
      //     value: number
      //     created_at: string
      //   }
      //   Insert: Omit<Database['public']['Tables']['your_table']['Row'], 'id' | 'created_at'>
      //   Update: Partial<Database['public']['Tables']['your_table']['Insert']>
      // }
    }
  }
}
