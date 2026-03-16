import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const supabase = createClient();
  
  // Increment view count
  await supabase.rpc('increment_api_views', { api_slug: params.slug });

  const { data, error } = await supabase
    .from('apis')
    .select('*, category:api_categories(*)')
    .eq('slug', params.slug)
    .single();

  if (error || !data) {
    return NextResponse.json({ success: false, error: 'API not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data });
}
