import { createClient } from '@/lib/supabase/server';
import APIGrid from '@/components/api-grid';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single();

  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('api:apis(*, category:api_categories(*))')
    .eq('user_id', user?.id);

  const bookmarkedApis = bookmarks?.map((b: any) => b.api) || [];

  return (
    <div className="max-w-[1400px] mx-auto px-6 pt-32 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div className="flex flex-col gap-2">
          <div className="mono text-[var(--accent)] text-[10px] font-bold tracking-[0.2em] uppercase">User_Session_Active</div>
          <h1 className="text-4xl font-extrabold font-[var(--font-display)] tracking-tighter">Welcome_Back, <span className="text-[var(--accent)]">{profile?.username}</span></h1>
          <p className="text-[var(--text-secondary)] text-sm">Orchestrate your saved endpoints and developer intelligence.</p>
        </div>
        
        <div className="flex liquid-glass p-1 rounded-2xl border-white/5">
           <Link href="/dashboard" className="px-6 py-2 bg-white/10 rounded-xl text-xs font-bold mono">COLLECTION</Link>
           <Link href="/dashboard/vault" className="px-6 py-2 hover:bg-white/5 rounded-xl text-xs transition mono">KEY_VAULT</Link>
           <Link href="/dashboard/reviews" className="px-6 py-2 hover:bg-white/5 rounded-xl text-xs transition mono">REVIEWS</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* User Stats Card */}
        <div className="lg:col-span-1 space-y-6">
           <div className="p-8 liquid-glass border-white/5 rounded-[2rem] shadow-[0_16px_64px_rgba(0,0,0,0.3)]">
              <div className="mb-10">
                 <div className="mono text-[9px] text-[var(--text-tertiary)] uppercase tracking-[0.2em] mb-2">ACCESS_TIER</div>
                 <div className="text-2xl font-extrabold text-[var(--accent)] capitalize font-[var(--font-display)] tracking-tighter">{profile?.plan}</div>
              </div>
              <div className="space-y-6">
                 <div className="flex justify-between items-center group/stat">
                    <span className="mono text-[10px] text-[var(--text-tertiary)] uppercase tracking-tighter">Bookmarks_Index</span>
                    <span className="mono text-xs font-bold text-[var(--text-primary)]">{profile?.bookmark_count}</span>
                 </div>
                 <div className="flex justify-between items-center group/stat">
                    <span className="mono text-[10px] text-[var(--text-tertiary)] uppercase tracking-tighter">Verified_Nodes</span>
                    <span className="mono text-xs font-bold text-[var(--text-primary)]">0</span>
                 </div>
              </div>
              {profile?.plan === 'free' && (
                <Link href="/pricing" className="block mt-10 text-center bg-white text-black font-bold py-3 rounded-[var(--radius-md)] text-[10px] mono uppercase tracking-widest hover:bg-[var(--accent)] hover:text-white transition-all active:scale-[0.98]">
                   UPGRADE_TO_PRO
                </Link>
              )}
           </div>

           {profile?.plan !== 'free' && (
             <div className="p-6 bg-[var(--accent-subtle)] border border-[var(--accent)]/20 rounded-[var(--radius-lg)] space-y-3">
                <div className="flex items-center gap-2">
                   <div className="w-1 h-1 rounded-full bg-[var(--accent)]" />
                   <div className="mono text-[9px] font-bold text-[var(--accent)] uppercase tracking-widest">Protocol_Exporter</div>
                </div>
                <h4 className="text-xs font-bold tracking-tight">Export Collection Data</h4>
                <div className="flex flex-col gap-2">
                   <a href="/api/export/postman" className="flex items-center justify-between p-2 rounded bg-black/20 border border-white/5 hover:border-[var(--accent)]/50 transition-all group">
                      <span className="mono text-[10px] text-[var(--text-secondary)] uppercase">POSTMAN_JSON</span>
                      <svg className="w-3 h-3 text-[var(--text-tertiary)] group-hover:text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                   </a>
                   <a href="/api/export/insomnia" className="flex items-center justify-between p-2 rounded bg-black/20 border border-white/5 hover:border-[var(--accent)]/50 transition-all group">
                      <span className="mono text-[10px] text-[var(--text-secondary)] uppercase">INSOMNIA_JSON</span>
                      <svg className="w-3 h-3 text-[var(--text-tertiary)] group-hover:text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                   </a>
                </div>
             </div>
           )}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
           <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
              <h2 className="text-xl font-bold font-[var(--font-display)] tracking-tight uppercase tracking-widest text-[var(--text-primary)]">Personal_Library</h2>
              <div className="flex items-center gap-2">
                 <span className="mono text-[10px] text-[var(--text-tertiary)] uppercase tracking-tighter">System_Registry</span>
                 <span className="mono text-[10px] bg-white/5 px-2 py-0.5 rounded text-[var(--text-secondary)]">{bookmarkedApis.length} ACTIVE_NODES</span>
              </div>
           </div>
           
           {bookmarkedApis.length > 0 ? (
             <APIGrid apis={bookmarkedApis as any} />
           ) : (
             <div className="py-24 text-center border border-dashed border-white/10 rounded-[var(--radius-xl)] bg-white/[0.01]">
                <p className="text-[var(--text-tertiary)] mono text-xs uppercase tracking-widest mb-8">Registry_Empty_No_Nodes_Found</p>
                <Link href="/explorer" className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-[var(--radius-md)] text-[10px] mono font-bold hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all">
                   INITIALIZE_EXPLORER_SEQUENCE
                </Link>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
