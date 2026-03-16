import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function AdminDashboard() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user?.email !== process.env.ADMIN_EMAIL) redirect('/');

  const { data: stats } = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin/stats`).then(r => r.json());

  return (
    <div className="max-w-[1400px] mx-auto px-6 pt-32 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div className="flex flex-col gap-2">
          <div className="mono text-[var(--accent)] text-[10px] font-bold tracking-[0.2em] uppercase">Control_Center_v4.0</div>
          <h1 className="text-4xl font-extrabold font-[var(--font-display)] tracking-tighter">System <span className="text-[var(--accent)]">Intelligence.</span></h1>
          <p className="text-[var(--text-secondary)] text-sm">Platform_Monetization and core trajectory metrics.</p>
        </div>
        <Link href="/admin/submissions" className="px-8 py-3 bg-[var(--bg-surface)] border border-white/5 rounded-[var(--radius-md)] text-[10px] mono font-bold hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all uppercase tracking-widest shadow-[0_8px_16px_rgba(0,0,0,0.1)]">
           REVIEW_PENDING_SUBMISSIONS
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
         {[
           { label: 'TOTAL_UNITS', value: stats?.data?.totalUsers || 0, color: 'var(--text-primary)' },
           { label: 'PRO_CONVERSION', value: stats?.data?.proUsers || 0, color: 'var(--accent)' },
           { label: 'VERIFIED_NODES', value: stats?.data?.totalApis || 0, color: 'var(--text-primary)' },
           { label: 'SYSTEM_MRR (INR)', value: `₹${stats?.data?.mrr?.toLocaleString() || 0}`, color: '#a78bfa' },
         ].map((stat, i) => (
           <div key={i} className="p-8 border border-white/5 rounded-[var(--radius-xl)] bg-[var(--bg-surface)] hover:bg-white/[0.02] transition-all group">
              <div className="mono text-[9px] text-[var(--text-tertiary)] uppercase tracking-[0.2em] mb-4 group-hover:text-[var(--accent)] transition-colors">{stat.label}</div>
              <div className="text-3xl font-extrabold font-[var(--font-display)] tracking-tighter" style={{ color: stat.color }}>{stat.value}</div>
              <div className="mt-4 w-full h-[1px] bg-white/5 overflow-hidden">
                <div className="w-1/3 h-full bg-[var(--accent)] animate-pulse" />
              </div>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
         {/* Top Bookmarked APIs */}
         <div className="p-10 border border-white/5 rounded-[var(--radius-xl)] bg-[var(--bg-surface)] relative overflow-hidden group shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)]">
            <div className="absolute top-0 right-0 p-8 opacity-10 font-bold mono text-4xl pointer-events-none uppercase tracking-tighter">TRENDS</div>
            <div className="flex items-center gap-2 mb-10">
              <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
              <h3 className="mono text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-tertiary)]">High_Trajectory_Endpoints</h3>
            </div>
            <div className="space-y-4">
               {stats?.data?.topApis.map((api: any, i: number) => (
                 <div key={i} className="flex justify-between items-center p-4 rounded-[var(--radius-md)] bg-black/20 border border-white/5 hover:border-[var(--accent)]/30 transition-all group/item">
                    <span className="text-[var(--text-secondary)] font-medium text-sm group-hover/item:text-[var(--text-primary)] transition-colors">{api.name}</span>
                    <div className="flex items-center gap-3">
                       <span className="mono text-[10px] font-bold text-[var(--accent)]">{api.bookmark_count} SAVES</span>
                       <svg className="w-3 h-3 text-[var(--text-tertiary)] group-hover/item:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
