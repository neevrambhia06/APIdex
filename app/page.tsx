import Link from 'next/link';
import APIGrid from '@/components/api-grid';
import { createClient } from '@/lib/supabase/server';
import HeroSection from '@/components/hero-section';
import DecryptedText from '@/components/ui/DecryptedText';

export default async function HomePage() {
  const supabase = createClient();
  
  // Fetch featured APIs
  const { data: featured } = await supabase
    .from('apis')
    .select('*, category:api_categories(*)')
    .eq('is_featured', true)
    .limit(3);

  // Fetch categories
  const { data: categories } = await supabase
    .from('api_categories')
    .select('*')
    .limit(6);

  return (
    <div className="flex flex-col relative overflow-hidden">
      {/* Visual Depth Elements */}
      <div className="hero-grid absolute inset-0 pointer-events-none z-0" />
      <div className="absolute top-[80vh] left-1/2 -translate-x-1/2 w-[80vw] h-[40vh] bg-[var(--accent)] opacity-[0.08] blur-[120px] pointer-events-none z-0" />

      {/* Hero Section */}
      <HeroSection />

      {/* Explorer Preview / Featured APIs */}
      <section className="relative z-10 max-w-[1200px] mx-auto px-6 w-full pt-16 pb-32">
        <DecryptedText 
          text="From AI to Payments. Weather to Commerce. One universe."
          animateOn="view"
          speed={40}
          className="text-center font-mono text-sm text-[#8b949e] tracking-wide max-w-xl mx-auto block mb-24"
        />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div>
             <h2 className="text-[var(--text-2xl)] font-extrabold font-[var(--font-display)] mb-4 tracking-[-0.04em]">Redefining Your Workflow.</h2>
             <p className="text-[var(--text-secondary)] max-w-sm">Curated selection of performance-verified endpoints for modern stacks.</p>
          </div>
          <Link href="/explorer" className="text-[var(--accent)] font-medium flex items-center gap-2 group text-sm uppercase tracking-widest">
             <span>Browse Explorer</span>
             <span className="group-hover:translate-x-1 transition-transform"></span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured && <APIGrid apis={featured} />}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="relative z-10 border-t border-white/5 bg-[var(--bg-subtle)] py-32 w-full">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="mb-20">
            <div className="mono text-[var(--accent)] text-xs font-bold tracking-widest uppercase mb-4">Discovery</div>
            <h2 className="text-[var(--text-xl)] font-bold font-[var(--font-display)] tracking-[-0.04em]">Browse by Category</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {categories?.map((cat: any) => (
              <Link key={cat.id} href={`/explorer?category=${cat.slug}`}>
                 <div className="group p-8 bg-[var(--bg-surface)] border border-white/5 rounded-[var(--radius-xl)] hover:border-[var(--accent-border)] hover:bg-[var(--bg-elevated)] transition-all flex flex-col items-start gap-4">
                    <span className="text-3xl bg-[var(--bg-canvas)] w-14 h-14 flex items-center justify-center rounded-[var(--radius-lg)] border border-white/5 group-hover:border-[var(--accent-border)] transition-colors">
                        {cat.icon || ''}
                    </span>
                    <div>
                        <h3 className="text-lg font-bold font-[var(--font-display)] mb-1 group-hover:text-[var(--accent)] transition">{cat.name}</h3>
                        <p className="text-xs text-[var(--text-tertiary)] mono uppercase tracking-wider">{cat.api_count} verified endpoints</p>
                    </div>
                 </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
