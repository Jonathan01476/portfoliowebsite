import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const table = searchParams.get('table')
    const limit = searchParams.get('limit') || '1000'
    const offset = searchParams.get('offset') || '0'

    if (!table) {
      return NextResponse.json(
        { error: 'Table parameter is required' },
        { status: 400 }
      )
    }

    const { data, error, count } = await supabase
      .from(table)
      .select('*', { count: 'exact' })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data, count })
  } catch (error) {
    console.error('Data fetching error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get aggregated statistics
export async function POST(request: Request) {
  try {
    const { table, operation } = await request.json()

    if (!table || !operation) {
      return NextResponse.json(
        { error: 'Table and operation parameters are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from(table)
      .select('*')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Stats calculation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
