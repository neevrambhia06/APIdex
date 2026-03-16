import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { checkPlan } from '@/lib/plan-check';

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const isPro = await checkPlan(user.id, 'pro');
  if (!isPro) return NextResponse.json({ success: false, error: 'Pro plan required' }, { status: 403 });

  const { data: bookmarks, error } = await supabase
    .from('bookmarks')
    .select('api:apis(*)')
    .eq('user_id', user.id);

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

  const exportData = {
    _type: "export",
    __export_format: 4,
    __export_date: new Date().toISOString(),
    __export_source: "insomnia.desktop.app:v2023.5.8",
    resources: bookmarks.map((b: any, index: number) => ({
      _id: `req_${index}`,
      _type: "request",
      method: "GET",
      url: b.api.base_url + "/endpoint",
      name: b.api.name,
      headers: [
        { name: "Authorization", value: "Bearer {{YOUR_KEY}}" }
      ],
      description: b.api.description
    }))
  };

  return new NextResponse(JSON.stringify(exportData), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="apidex_insomnia_export.json"',
    },
  });
}
