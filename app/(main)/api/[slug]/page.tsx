import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import BookmarkButton from '@/components/bookmark-button';
import ReviewForm from '@/components/review-form';

export default async function APIDetailPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  
  const { data: api } = await supabase
    .from('apis')
    .select('*, category:api_categories(*)')
    .eq('slug', params.slug)
    .single();

  if (!api) notFound();

  const { data: reviews } = await supabase
    .from('api_reviews')
    .select('*, profile:profiles(username, avatar_url)')
    .eq('api_id', api.id)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-[1400px] mx-auto px-6 pt-32 pb-24">
      {/* API Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 mb-20 border-b border-white/5 pb-12">
        <div className="flex items-start gap-8">
          <div className="w-32 h-32 bg-[var(--bg-surface)] border border-white/5 rounded-[var(--radius-xl)] flex items-center justify-center p-6 shadow-[0_16px_32px_rgba(0,0,0,0.2)]">
            {api.logo_url ? (
              <img src={api.logo_url} alt={api.name} className="w-full h-full object-contain filter " />
            ) : (
              <div className="mono text-[var(--text-tertiary)] text-[10px]">NO_LOG_DATA</div>
            )}
          </div>
          <div className="flex flex-col gap-3 pt-2">
            <div className="flex items-center gap-4">
              <h1 className="text-5xl font-extrabold font-[var(--font-display)] tracking-tighter">{api.name}</h1>
              {api.is_verified && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-[var(--accent-subtle)] border border-[var(--accent)]/30 rounded-full">
                  <span className="text-[var(--accent)] text-[10px] mono font-bold uppercase tracking-widest">VERIFIED</span>
                  <svg className="w-3 h-3 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M5 13l4 4L19 7" /></svg>
                </div>
              )}
            </div>
            <p className="text-[var(--text-secondary)] font-medium">{api.provider}</p>
            <div className="flex items-center gap-3">
               <span className="mono text-[9px] uppercase tracking-[0.2em] bg-white/5 border border-white/10 px-3 py-1.5 rounded-[var(--radius-sm)] text-[var(--text-tertiary)]">
                 {api.category.name}
               </span>
               <span className="mono text-[9px] uppercase tracking-[0.2em] bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent)]/20 px-3 py-1.5 rounded-[var(--radius-sm)] font-bold">
                 {api.pricing_tier}
               </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
            <BookmarkButton api_id={api.id} initialCount={api.bookmark_count} />
            <a 
              href={api.docs_url} 
              target="_blank" 
              className="px-10 py-4 bg-white text-black font-extrabold rounded-[var(--radius-md)] hover:bg-[var(--accent)] hover:text-white transition-all active:scale-[0.98] mono text-xs uppercase tracking-widest shadow-[0_12px_24px_-8px_rgba(255,255,255,0.2)]"
            >
              INITIALIZE_DOCS_STAIRS
            </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-16">
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
              <h2 className="mono text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-tertiary)]">System_Overview</h2>
            </div>
            <p className="text-[var(--text-secondary)] text-lg leading-relaxed font-light">
              {api.long_description || api.description}
            </p>
          </section>

          <section className="space-y-8">
             <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
               <h2 className="mono text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-tertiary)]">Pattern_Registry</h2>
             </div>
             <div className="flex flex-wrap gap-3">
                {api.tags?.map((tag: string) => (
                  <span key={tag} className="bg-[var(--bg-surface)] border border-white/5 px-4 py-2 rounded-[var(--radius-md)] text-xs mono tracking-tighter text-[var(--text-secondary)] hover:border-[var(--accent)]/30 transition-colors">
                    #{tag}
                  </span>
                ))}
             </div>
          </section>

          <section className="space-y-8">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
              <h2 className="mono text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-tertiary)]">Endpoint_Reference</h2>
            </div>
            <div className="group/code relative">
               <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent)] to-transparent opacity-5 blur-xl pointer-events-none" />
               <code className="block bg-[var(--bg-surface)] p-8 rounded-[var(--radius-xl)] border border-white/5 text-[var(--text-primary)] text-sm overflow-x-auto mono shadow-inner">
                 <span className="text-[var(--accent)] font-bold">GET</span> {api.base_url}
               </code>
            </div>
          </section>

          <section className="space-y-12">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                <h2 className="mono text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-tertiary)]">Feedback_Protocol</h2>
              </div>
              <span className="mono text-[10px] text-[var(--text-tertiary)] uppercase">{reviews?.length || 0} LOGS_DETECTED</span>
            </div>

            <div className="space-y-12">
               {reviews?.map((review: any) => (
                 <div key={review.id} className="group/review">
                    <div className="flex justify-between mb-4 items-center">
                       <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < review.rating ? 'bg-[var(--accent)] shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'bg-white/10'}`} />
                          ))}
                       </div>
                       <span className="mono text-[10px] text-[var(--text-tertiary)] uppercase tracking-tighter">{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                    <h4 className="text-lg font-bold mb-3 tracking-tight group-hover/review:text-[var(--accent)] transition-colors">{review.title}</h4>
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6 font-light">{review.body}</p>
                    <div className="flex items-center gap-3">
                       <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10" />
                       <span className="mono text-[10px] text-[var(--text-tertiary)] uppercase tracking-tighter">NODE_ORIGIN: {review.profile.username}</span>
                    </div>
                 </div>
               ))}
               {(!reviews || reviews.length === 0) && (
                 <div className="py-12 text-center border border-dashed border-white/5 rounded-[var(--radius-xl)]">
                    <p className="mono text-[10px] text-[var(--text-tertiary)] uppercase italic tracking-[0.2em]">Silence_Detected_In_Protocol_Buffer</p>
                 </div>
               )}
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-12">
           <ReviewForm api_id={api.id} />
           
           <div className="p-8 bg-[var(--bg-surface)] border border-white/5 rounded-[var(--radius-xl)] shadow-[0_16px_32px_rgba(0,0,0,0.2)]">
              <h4 className="mono text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.3em] mb-8">Technical_Metrics</h4>
              <div className="space-y-6 text-sm">
                 <div className="flex justify-between items-center group/spec">
                    <span className="mono text-[10px] text-[var(--text-tertiary)] uppercase tracking-tighter">Auth_Scheme</span>
                    <span className="mono text-xs font-bold text-[var(--text-secondary)] group-hover/spec:text-[var(--accent)] transition-colors">{api.auth_type}</span>
                 </div>
                 <div className="flex justify-between items-center group/spec">
                    <span className="mono text-[10px] text-[var(--text-tertiary)] uppercase tracking-tighter">Sandbox_Mode</span>
                    <span className={`mono text-xs font-bold ${api.has_sandbox ? 'text-[var(--accent)]' : 'text-[var(--text-tertiary)]'}`}>{api.has_sandbox ? 'ENABLED' : 'DISABLED'}</span>
                 </div>
                 <div className="flex justify-between items-center group/spec">
                    <span className="mono text-[10px] text-[var(--text-tertiary)] uppercase tracking-tighter">Verification_Clock</span>
                    <span className="mono text-xs text-[var(--text-secondary)]">{new Date(api.updated_at).toLocaleDateString()}</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
