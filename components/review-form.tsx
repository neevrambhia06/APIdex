"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ReviewForm({ api_id }: { api_id: string }) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_id, rating, title, body })
    }).then(r => r.json());

    if (res.success) {
      router.refresh();
      setTitle('');
      setBody('');
    } else {
      setError(res.error);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="review-form space-y-6 bg-[var(--bg-surface)] p-8 rounded-[var(--radius-xl)] border border-white/5 shadow-[0_16px_32px_rgba(0,0,0,0.2)]">
      <div className="flex flex-col gap-1 mb-2">
        <div className="mono text-[var(--accent)] text-[10px] font-bold tracking-widest uppercase">Feedback Loop</div>
        <h3 className="text-xl font-extrabold font-[var(--font-display)]">Rate this Interface</h3>
      </div>
      
      {error && <div className="text-[var(--danger)] text-xs mono uppercase bg-[var(--danger)]/5 border border-[var(--danger)]/20 p-3 rounded-[var(--radius-md)]">{error}</div>}

      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`w-10 h-10 flex items-center justify-center rounded-[var(--radius-md)] border transition-all ${rating >= star ? 'text-[var(--accent)] bg-[var(--accent-subtle)] border-[var(--accent)]' : 'text-[var(--text-tertiary)] border-white/5 bg-white/5 hover:border-white/10'}`}
          >
            <svg className="w-5 h-5" fill={rating >= star ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345l2.125-5.111z" />
            </svg>
          </button>
        ))}
        <span className="mono text-[10px] font-bold text-[var(--text-tertiary)] ml-2 uppercase tracking-tighter">{rating}/5 SCALE</span>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Review Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[var(--bg-canvas)] border border-white/5 p-4 rounded-[var(--radius-md)] focus:border-[var(--accent)] outline-none transition-all text-sm font-mono placeholder:opacity-30"
            required
          />
        </div>
        
        <div className="relative">
          <textarea
            placeholder="Share your experience with this API..."
            rows={5}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full bg-[var(--bg-canvas)] border border-white/5 p-4 rounded-[var(--radius-md)] focus:border-[var(--accent)] outline-none transition-all text-sm leading-relaxed placeholder:opacity-30"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-white text-black font-bold py-4 rounded-[var(--radius-md)] hover:bg-gray-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
      >
        <span>{loading ? 'SUBMITTING_PACKET...' : 'POST_VERIFIED_REVIEW'}</span>
        {!loading && <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>}
      </button>
    </form>
  );
}
