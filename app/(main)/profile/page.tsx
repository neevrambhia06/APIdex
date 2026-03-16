"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import DecryptedText from '@/components/ui/DecryptedText';
import Magnet from '@/components/ui/Magnet';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: { data: { user: User | null } }) => {
      setUser(data.user);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#080b0f]">
       <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#080b0f] p-6 text-center">
       <h1 className="text-4xl font-black font-display mb-4">Identity <span className="text-amber-400">Unknown.</span></h1>
       <p className="text-[var(--text-secondary)] mb-8">Please authenticate to access your explorer profile.</p>
       <Magnet magnetStrength={0.3}>
          <button onClick={() => window.location.href = '/login'} className="bg-white text-black px-8 py-3 rounded-full font-bold">
             Authenticate
          </button>
       </Magnet>
    </div>
  );

  return (
    <div className="min-h-screen pt-32 pb-32 px-6">
      <div className="max-w-[1000px] mx-auto">
        <div className="relative mb-20">
          {/* Background Glow */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-400 opacity-[0.03] blur-[120px] pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center md:items-end gap-8 relative z-10">
            <div className="w-32 h-32 rounded-3xl liquid-glass flex items-center justify-center text-4xl font-black border-white/10 shadow-2xl overflow-hidden group">
               {user.email?.[0].toUpperCase() || 'U'}
               <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-center md:text-left">
              <div className="mono text-amber-400 text-[10px] font-bold tracking-[0.2em] uppercase mb-4">Verified Explorer</div>
              <h1 className="text-5xl font-black font-display tracking-tight mb-2">
                 <DecryptedText text={user.email?.split('@')[0] || 'Anonymous'} speed={50} animateOn="load" />
              </h1>
              <p className="text-[var(--text-tertiary)] font-mono text-sm">{user.email}</p>
            </div>
            
            <div className="md:ml-auto flex gap-3">
               <Magnet magnetStrength={0.2}>
                  <button className="liquid-glass px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-white/5 transition-all">Edit Profile</button>
               </Magnet>
               <Magnet magnetStrength={0.2}>
                  <button onClick={() => supabase.auth.signOut().then(() => window.location.href = '/')} className="bg-white text-black px-6 py-2.5 rounded-xl text-xs font-bold">Sign Out</button>
               </Magnet>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           <div className="liquid-glass p-8 rounded-3xl border-white/5">
              <div className="text-[10px] font-mono text-[var(--text-tertiary)] uppercase tracking-widest mb-4">Plan Status</div>
              <div className="text-2xl font-black font-display text-amber-400 mb-1">Orbit</div>
              <p className="text-[10px] text-[var(--text-secondary)]">Basic Access Enabled</p>
           </div>
           <div className="liquid-glass p-8 rounded-3xl border-white/5">
              <div className="text-[10px] font-mono text-[var(--text-tertiary)] uppercase tracking-widest mb-4">Saved Interfaces</div>
              <div className="text-2xl font-black font-display text-white mb-1">12</div>
              <p className="text-[10px] text-[var(--text-secondary)]">Across 4 categories</p>
           </div>
           <div className="liquid-glass p-8 rounded-3xl border-white/5">
              <div className="text-[10px] font-mono text-[var(--text-tertiary)] uppercase tracking-widest mb-4">Search Activity</div>
              <div className="text-2xl font-black font-display text-white mb-1">1.2k</div>
              <p className="text-[10px] text-[var(--text-secondary)]">Lifetime API discoveries</p>
           </div>
        </div>

        <div className="liquid-glass p-1 rounded-[32px] border-white/5">
           <div className="bg-[#080b0f]/40 backdrop-blur-xl rounded-[28px] p-8 border border-white/5">
              <h3 className="text-xl font-black font-display mb-8">Recent Activity</h3>
              <div className="space-y-6">
                 {[1,2,3].map(i => (
                    <div key={i} className="flex items-center gap-4 group cursor-pointer">
                       <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-xs group-hover:bg-amber-400 group-hover:text-black transition-all">
                          {''}
                       </div>
                       <div>
                          <p className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                             {i === 1 ? 'Explored OpenAI Streaming' : i === 2 ? 'Bookmarked Stripe Payments' : 'Accessed Vault Keys'}
                          </p>
                          <p className="text-[10px] font-mono text-[var(--text-tertiary)] uppercase tracking-tighter">
                             {i * 2} hours ago • verified_session
                          </p>
                       </div>
                       <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M9 18l6-6-6-6"/></svg>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
