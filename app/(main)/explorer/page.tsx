import { createClient } from '@/lib/supabase/server';
import APIGrid from '@/components/api-grid';
import AnimatedList from '@/components/ui/AnimatedList';

export default async function ExplorerPage({
  searchParams,
}: {
  searchParams: { category?: string; pricing?: string; q?: string };
}) {
  const supabase = createClient();
  
  let query = supabase
    .from('apis')
    .select('*, category:api_categories(*)')
    .eq('is_active', true);

  if (searchParams.category) query = query.eq('api_categories.slug', searchParams.category);
  if (searchParams.pricing) query = query.eq('pricing_tier', searchParams.pricing);
  if (searchParams.q) query = query.or(`name.ilike.%${searchParams.q}%,description.ilike.%${searchParams.q}%`);

  const { data: apis } = await query.order('created_at', { ascending: false });

  return (
    <div className="relative min-h-screen">
      <div className="grid-bg" />
      <div className="hero-glow" />
      
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 pt-24 pb-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-xl">
            <h1 className="hero-title entrance">
              <span className="block font-semibold text-[var(--text-secondary)] text-[clamp(1.5rem,4vw,2.5rem)] leading-tight">The API</span>
              <span className="block text-[var(--text-primary)] text-[clamp(2.5rem,6vw,4rem)] font-black tracking-[-0.05em] leading-tight">Universe,</span>
              <span className="block text-[var(--accent)] italic font-medium text-[clamp(2rem,5vw,3.5rem)] leading-tight">Explored.</span>
            </h1>
            <p className="text-[var(--text-secondary)] text-md max-w-sm mt-6">Navigate 50,000+ public interfaces. Performance metrics and sandbox testing at your fingertips.</p>
          </div>
          
          <div className="flex flex-col gap-3">
             <p className="text-[10px] font-mono text-[var(--text-tertiary)] uppercase tracking-[0.2em] ml-1">Directory / Filters</p>
             <AnimatedList className="flex flex-wrap items-center gap-2">
                <button className="px-4 h-10 border border-[var(--accent)]/30 rounded-[var(--radius-md)] text-[10px] font-mono bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center font-bold tracking-wider">ALL_ENTRIES</button>
                <button className="px-4 h-10 border border-white/5 rounded-[var(--radius-md)] text-[10px] font-mono bg-white/5 text-[var(--text-tertiary)] flex items-center justify-center hover:border-white/20 transition-colors tracking-wider">AI_MODELS</button>
                <button className="px-4 h-10 border border-white/5 rounded-[var(--radius-md)] text-[10px] font-mono bg-white/5 text-[var(--text-tertiary)] flex items-center justify-center hover:border-white/20 transition-colors tracking-wider">PAYMENT_RAILS</button>
                <button className="px-4 h-10 border border-white/5 rounded-[var(--radius-md)] text-[10px] font-mono bg-white/5 text-[var(--text-tertiary)] flex items-center justify-center hover:border-white/20 transition-colors tracking-wider">COMMERCE</button>
             </AnimatedList>
          </div>
        </div>

        {apis && apis.length > 0 ? (
          <APIGrid apis={apis} />
        ) : (
          <div className="py-32 text-center border border-dashed border-white/5 rounded-[var(--radius-xl)] bg-[var(--bg-subtle)]">
             <svg className="mx-auto w-12 h-12 text-[var(--text-tertiary)] opacity-20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
             <p className="text-[var(--text-secondary)] text-sm mono">NO_APIS_FOUND_MATCHING_CRITERIA</p>
          </div>
        )}
      </div>
    </div>
  );
}
