import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user?.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  // Parallel stats fetching
  const [
    { count: totalUsers },
    { count: proUsers },
    { count: totalApis },
    { data: topApis }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).neq('plan', 'free'),
    supabase.from('apis').select('*', { count: 'exact', head: true }),
    supabase.from('apis').select('name, bookmark_count').order('bookmark_count', { ascending: false }).limit(5)
  ]);

  return NextResponse.json({
    success: true,
    data: {
      totalUsers,
      proUsers,
      totalApis,
      topApis,
      mrr: (proUsers || 0) * 499 // Simplified estimation
    }
  });
}
