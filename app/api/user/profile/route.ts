import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { profileUpdateSchema } from '@/lib/validations';

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, data });
}

export async function PATCH(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const validation = profileUpdateSchema.safeParse(body);
  if (!validation.success) return NextResponse.json({ success: false, error: validation.error.message }, { status: 400 });

  const { data, error } = await supabase
    .from('profiles')
    .update(validation.data)
    .eq('id', user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, data });
}
