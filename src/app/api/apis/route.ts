import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const pricing = searchParams.get('pricing');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let query = supabase
      .from('apis')
      .select(`
        *,
        api_categories (
          name,
          icon,
          color
        )
      `, { count: 'exact' });

    // Apply filters
    if (category) {
      query = query.eq('category_id', category);
    }

    if (pricing) {
      query = query.eq('pricing_tier', pricing);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,provider.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to).order('name');

    const { data: apis, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      apis,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching APIs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch APIs' },
      { status: 500 }
    );
  }
}
