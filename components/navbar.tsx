"use client";

import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import Magnet from '@/components/ui/Magnet';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: { data: { user: User | null } }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_: string, session: Session | null) => {
      setUser(session?.user ?? null);
    });

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => {
      subscription.unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[var(--z-sticky)] h-16 w-full transition-all duration-400 liquid-glass-scroll ${scrolled ? 'scrolled px-4' : 'px-6'}`}>
      <div className={`max-w-[1200px] mx-auto h-full flex items-center justify-between transition-all duration-400 ${scrolled ? 'bg-white/5 px-6 rounded-full mt-2 h-[52px] border border-white/5' : ''}`}>
        <Link href="/" className="logo-wordmark font-display font-black text-xl tracking-[-0.05em] flex items-center gap-1 text-white">
          APIdex<span className="text-amber-400">_</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link href="/explorer" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition">Explorer</Link>
          <Link href="/pricing" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition">Pricing</Link>
          {user ? (
            <>
              <Link href="/dashboard" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition">Dashboard</Link>
              <button 
                onClick={() => supabase.auth.signOut()}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="flex items-center gap-6">
              <Link href="/login" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition font-medium">Log In</Link>
              <Magnet magnetStrength={0.3} padding={40}>
                <button className="bg-white text-black px-5 py-2 rounded-full font-bold text-xs flex items-center gap-2 hover:scale-105 transition-all">
                  Start Explored
                </button>
              </Magnet>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
