import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json({ success: false, error: 'Query required' }, { status: 400 });
  }

  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('apis')
    .select('*, category:api_categories(*)')
    .or(`name.ilike.%${q}%,description.ilike.%${q}%,tags.cs.{${q}}`)
    .eq('is_active', true)
    .limit(10);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
