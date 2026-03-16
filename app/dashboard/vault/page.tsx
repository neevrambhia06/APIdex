import { createClient } from '@/lib/supabase/server';
import { checkPlan } from '@/lib/plan-check';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function VaultPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const isPro = await checkPlan(user.id, 'pro');
  if (!isPro) redirect('/pricing');

  const { data: keys } = await supabase
    .from('api_key_vault')
    .select('*, api:apis(name)')
    .eq('user_id', user.id);

  return (
    <div className="max-w-[1400px] mx-auto px-6 pt-32 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div className="flex flex-col gap-2">
          <div className="mono text-[var(--accent)] text-[10px] font-bold tracking-[0.2em] uppercase">Security_Enclave_Encrypted</div>
          <h1 className="text-4xl font-extrabold font-[var(--font-display)] tracking-tighter">API Key <span className="text-[var(--accent)]">Vault.</span></h1>
          <p className="text-[var(--text-secondary)] text-sm">Hardware-level secure storage for production credentials and verified tokens.</p>
        </div>
        
        <div className="flex bg-white/5 border border-white/10 p-1 rounded-[var(--radius-lg)]">
           <Link href="/dashboard" className="px-6 py-2 hover:bg-white/5 rounded-[var(--radius-md)] text-xs transition mono">COLLECTION</Link>
           <Link href="/dashboard/vault" className="px-6 py-2 bg-white/10 rounded-[var(--radius-md)] text-xs font-bold mono">KEY_VAULT</Link>
           <Link href="/dashboard/reviews" className="px-6 py-2 hover:bg-white/5 rounded-[var(--radius-md)] text-xs transition mono">REVIEWS</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Add New Key Card */}
        <div className="border border-dashed border-[var(--accent)]/30 p-10 rounded-[var(--radius-xl)] bg-[var(--accent-subtle)] flex flex-col items-center justify-center text-center group hover:bg-[var(--accent)]/10 transition-all cursor-pointer border-opacity-50 hover:border-opacity-100">
           <div className="w-14 h-14 rounded-full border border-[var(--accent)] flex items-center justify-center mb-6 text-[var(--accent)] text-2xl group-hover:scale-110 group-hover:bg-[var(--accent)] group-hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M12 4v16m8-8H4" /></svg>
           </div>
           <h3 className="mono text-[10px] font-bold text-[var(--accent)] uppercase tracking-[0.2em] mb-1">PROVISION_SECRET</h3>
           <p className="text-[11px] text-[var(--text-tertiary)] mono uppercase tracking-tighter">SECURE_AES_256_STORAGE</p>
        </div>

        {keys?.map((k) => (
          <div key={k.id} className="p-8 border border-white/5 rounded-[var(--radius-xl)] bg-[var(--bg-surface)] hover:border-[var(--accent)]/30 transition-all group shadow-[0_8px_16px_rgba(0,0,0,0.1)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.2)]">
             <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                   <span className="mono text-[9px] uppercase tracking-[0.2em] text-[var(--text-tertiary)]">VERIFIED_SECRET</span>
                </div>
                <button className="text-[var(--accent)] text-[10px] mono font-bold hover:scale-105 transition-transform uppercase tracking-tighter bg-[var(--accent-subtle)] px-2 py-0.5 rounded">REVEAL_NODE</button>
             </div>
             <h3 className="text-xl font-bold font-[var(--font-display)] text-white mb-1 tracking-tight">{k.label}</h3>
             <p className="mono text-[10px] text-[var(--text-tertiary)] mb-8 uppercase tracking-tighter">{k.api?.name || 'GENERIC_CREDENTIAL_ENDPOINT'}</p>
             
             <div className="font-mono text-[11px] text-[var(--text-tertiary)] bg-black/40 p-4 rounded-[var(--radius-md)] border border-white/5 truncate tracking-[0.4em] flex items-center justify-center">
               ••••••••••••••••••••
             </div>
          </div>
        ))}

        {(!keys || keys.length === 0) && (
            <div className="md:col-span-2 lg:col-span-3 text-center py-24 border border-white/5 rounded-[var(--radius-xl)] bg-white/[0.01]">
               <div className="mono text-xs text-[var(--text-tertiary)] uppercase tracking-[0.3em] italic">No_Secrets_Found_In_Registry</div>
            </div>
        )}
      </div>
    </div>
  );
}
