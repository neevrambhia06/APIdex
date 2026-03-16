import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { apiQuerySchema } from '@/lib/validations';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const validation = apiQuerySchema.safeParse(Object.fromEntries(searchParams));
  if (!validation.success) {
    return NextResponse.json({ success: false, error: validation.error.message }, { status: 400 });
  }

  const { category, search, pricing, auth_type, sort, page, per_page } = validation.data;
  const from = (page - 1) * per_page;
  const to = from + per_page - 1;

  const supabase = createClient();
  let query = supabase
    .from('apis')
    .select('*, category:api_categories(*)', { count: 'exact' })
    .eq('is_active', true);

  if (category) query = query.eq('api_categories.slug', category);
  if (pricing) query = query.eq('pricing_tier', pricing);
  if (auth_type) query = query.eq('auth_type', auth_type);
  if (search) query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,tags.cs.{${search}}`);

  if (sort === 'popular') query = query.order('view_count', { ascending: false });
  else if (sort === 'newest') query = query.order('created_at', { ascending: false });
  else if (sort === 'rating') query = query.order('avg_rating', { ascending: false });

  const { data, count, error } = await query.range(from, to);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    data,
    meta: {
      total: count,
      page,
      per_page,
      has_more: count ? from + per_page < count : false
    }
  });
}
