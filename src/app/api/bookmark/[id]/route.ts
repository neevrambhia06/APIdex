import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const bookmarkId = searchParams.get('id');

    if (!bookmarkId) {
      return NextResponse.json(
        { error: 'Bookmark ID required' },
        { status: 400 }
      );
    }

    // Verify ownership
    const { data: bookmark } = await supabase
      .from('bookmarks')
      .select('user_id')
      .eq('id', bookmarkId)
      .single();

    if (!bookmark || bookmark.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Bookmark not found or unauthorized' },
        { status: 404 }
      );
    }

    // Delete bookmark
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', bookmarkId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    return NextResponse.json(
      { error: 'Failed to delete bookmark' },
      { status: 500 }
    );
  }
}
