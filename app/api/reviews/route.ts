import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { reviewSchema } from '@/lib/validations';

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const validation = reviewSchema.safeParse(body);
  if (!validation.success) return NextResponse.json({ success: false, error: validation.error.message }, { status: 400 });

  const { data, error } = await supabase
    .from('api_reviews')
    .insert({ 
      user_id: user.id, 
      api_id: validation.data.api_id,
      rating: validation.data.rating,
      title: validation.data.title,
      body: validation.data.body
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') return NextResponse.json({ success: false, error: 'You have already reviewed this API' }, { status: 400 });
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
