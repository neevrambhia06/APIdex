import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { bookmarkSchema } from '@/lib/validations';

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('bookmarks')
    .select('*, api:apis(*, category:api_categories(*))')
    .eq('user_id', user.id);

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, data: data.map(b => b.api) });
}

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const validation = bookmarkSchema.safeParse(body);
  if (!validation.success) return NextResponse.json({ success: false, error: validation.error.message }, { status: 400 });

  // Plan enforcement: Free users max 10 bookmarks
  const { data: profile } = await supabase.from('profiles').select('plan, bookmark_count').eq('id', user.id).single();
  if (profile?.plan === 'free' && profile.bookmark_count >= 10) {
    return NextResponse.json({ success: false, error: 'Bookmark limit reached. Upgrade to Pro for unlimited.', upgrade_url: '/pricing' }, { status: 403 });
  }

  const { data, error } = await supabase
    .from('bookmarks')
    .insert({ user_id: user.id, api_id: validation.data.api_id })
    .select()
    .single();

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, data });
}
