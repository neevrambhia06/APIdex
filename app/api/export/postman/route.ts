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

  const collection = {
    info: {
      name: "My APIdex Collection",
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    item: bookmarks.map((b: any) => ({
      name: b.api.name,
      request: {
        method: "GET",
        url: { raw: b.api.base_url + "/endpoint" },
        header: [
          { key: "Authorization", value: "Bearer {{YOUR_KEY}}", type: "text" }
        ],
        description: b.api.description
      }
    }))
  };

  return new NextResponse(JSON.stringify(collection), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="apidex_postman_collection.json"',
    },
  });
}
