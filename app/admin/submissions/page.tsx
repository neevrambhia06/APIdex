import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminSubmissions() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user?.email !== process.env.ADMIN_EMAIL) redirect('/');

  const { data: submissions } = await supabase
    .from('api_submissions')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-[1400px] mx-auto px-6 pt-32 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 border-b border-white/5 pb-12">
        <div className="flex flex-col gap-2">
          <div className="mono text-[var(--accent)] text-[10px] font-bold tracking-[0.2em] uppercase">Vetting_Protocol_Active</div>
          <h1 className="text-4xl font-extrabold font-[var(--font-display)] tracking-tighter">Queue_ <span className="text-[var(--accent)]">Submissions.</span></h1>
          <p className="text-[var(--text-secondary)] text-sm">Validate and integrate incoming intelligence nodes into the global registry.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="mono text-[10px] text-[var(--text-tertiary)] uppercase tracking-tighter">Current_Backlog</div>
           <div className="px-3 py-1 bg-white/5 rounded-[var(--radius-sm)] text-xs mono font-bold text-[var(--text-primary)]">{submissions?.length || 0}_PENDING</div>
        </div>
      </div>

      <div className="space-y-12">
        {submissions?.map((s) => (
          <div key={s.id} className="p-10 border border-white/5 rounded-[var(--radius-xl)] bg-[var(--bg-surface)] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 font-bold mono text-6xl pointer-events-none uppercase tracking-tighter">NODE_VET</div>
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10 relative z-10">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                   <h3 className="text-3xl font-extrabold font-[var(--font-display)] tracking-tighter text-[var(--accent)] group-hover:translate-x-1 transition-transform">{s.api_name}</h3>
                   <div className={`px-2 py-0.5 rounded-[var(--radius-sm)] mono text-[9px] font-bold tracking-widest uppercase ${s.payment_verified ? 'bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent)]/30' : 'bg-red-500/10 text-red-500 border border-red-500/30'}`}>
                      {s.payment_verified ? 'PAYMENT_VERIFIED' : 'PAYMENT_INCOMPLETE'}
                   </div>
                </div>
                <p className="text-[var(--text-secondary)] font-medium text-sm">Provider_ID: {s.provider}</p>
              </div>
              <div className="flex gap-4">
                 <button className="px-8 py-3 bg-white text-black font-extrabold rounded-[var(--radius-md)] hover:bg-[var(--accent)] hover:text-white transition-all active:scale-[0.98] mono text-[10px] uppercase tracking-widest">
                    EXECUTE_APPROVAL
                 </button>
                 <button className="px-6 py-3 bg-[var(--bg-surface)] border border-red-500/30 text-red-500 font-bold rounded-[var(--radius-md)] hover:bg-red-500/5 transition-all text-[10px] mono uppercase tracking-widest">
                    PURGE_SUBMISSION
                 </button>
              </div>
            </div>

            <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-10 max-w-3xl font-light border-l-2 border-[var(--accent)]/30 pl-6 italic">{s.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm p-6 bg-black/20 rounded-[var(--radius-lg)] border border-white/5">
               <div className="space-y-2">
                  <div className="mono text-[9px] text-[var(--text-tertiary)] uppercase tracking-[0.2em]">BASE_URL_ENDPOINT</div>
                  <div className="truncate mono text-[11px] text-[var(--text-secondary)] tracking-tighter">{s.base_url}</div>
               </div>
               <div className="space-y-2">
                  <div className="mono text-[9px] text-[var(--text-tertiary)] uppercase tracking-[0.2em]">DOCUMENTATION_STAIRS</div>
                  <a href={s.docs_url} target="_blank" className="truncate mono text-[11px] text-[var(--accent)] underline underline-offset-4 decoration-[var(--accent)]/30 hover:decoration-[var(--accent)] transition-all">
                    {s.docs_url}
                  </a>
               </div>
            </div>
          </div>
        ))}

        {(!submissions || submissions.length === 0) && (
           <div className="py-32 text-center border border-dashed border-white/5 rounded-[var(--radius-xl)] bg-white/[0.01]">
              <div className="mono text-xs text-[var(--text-tertiary)] uppercase tracking-[0.4em] italic mb-4">Zero_Intelligence_Signals_Detected</div>
              <p className="text-[var(--text-tertiary)] text-[10px] mono uppercase">Registry Queue Stable</p>
           </div>
        )}
      </div>
    </div>
  );
}
