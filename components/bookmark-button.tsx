"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function BookmarkButton({ api_id, initialCount }: { api_id: string, initialCount: number }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        supabase.from('bookmarks')
          .select('id')
          .eq('api_id', api_id)
          .eq('user_id', data.user.id)
          .single()
          .then(({ data }) => setIsBookmarked(!!data))
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });
  }, [api_id]);

  const toggleBookmark = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return window.location.href = '/login';

    if (isBookmarked) {
      const { error } = await fetch(`/api/bookmarks/${api_id}`, { method: 'DELETE' }).then(r => r.json());
      if (!error) {
        setIsBookmarked(false);
        setCount(prev => prev - 1);
      }
    } else {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_id })
      }).then(r => r.json());
      
      if (res.success) {
        setIsBookmarked(true);
        setCount(prev => prev + 1);
      } else if (res.upgrade_url) {
        alert(res.error);
      }
    }
  };

  return (
    <button 
      onClick={toggleBookmark}
      disabled={loading}
      className={`bookmark-btn flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] border transition-all active:scale-95 ${isBookmarked ? 'bg-[var(--accent-subtle)] border-[var(--accent)] text-[var(--accent)]' : 'border-white/5 bg-white/5 hover:border-white/10 text-[var(--text-tertiary)]'}`}
    >
      <svg className={`w-4 h-4 ${isBookmarked ? 'fill-current' : 'none'}`} stroke="currentColor" fill="none" viewBox="0 0 24 24" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
      </svg>
      <span className="mono text-[10px] font-bold tracking-widest">{count}</span>
    </button>
  );
}
