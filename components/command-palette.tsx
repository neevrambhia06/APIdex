"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const toggle = useCallback(() => setIsOpen(open => !open), []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(open => !open);
      }
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!isOpen) return null;

  const actions = [
    { name: "Explore APIs", shortcut: "E", action: () => router.push('/explorer') },
    { name: "View Pricing", shortcut: "P", action: () => router.push('/pricing') },
    { name: "My Dashboard", shortcut: "D", action: () => router.push('/dashboard') },
    { name: "API Key Vault", shortcut: "V", action: () => router.push('/dashboard/vault') },
  ];

  return (
    <div 
      className="fixed inset-0 z-[var(--z-modal)] flex items-start justify-center pt-[15vh] bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => setIsOpen(false)}
    >
      <div 
        className="cmdk-card w-full max-w-[640px] liquid-glass border-white/10 rounded-[var(--radius-xl)] shadow-[0_32px_128px_rgba(0,0,0,0.8)] overflow-hidden animate-in slide-in-from-top-4 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-5 h-14 border-b border-white/5">
          <svg className="w-5 h-5 text-[var(--text-tertiary)] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input 
            autoFocus
            type="text" 
            placeholder="Search commands or APIs..."
            className="flex-1 bg-transparent border-none outline-none text-[var(--text-primary)] font-mono text-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={() => setIsOpen(false)} className="text-[var(--text-tertiary)] text-xs font-mono bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">ESC</button>
        </div>
        
        <div className="p-2">
            <div className="px-4 py-2 text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest mono">Navigation</div>
            {actions.map((action, i) => (
              <button 
                key={i}
                onClick={() => { action.action(); setIsOpen(false); }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-[var(--radius-md)] hover:bg-[var(--bg-elevated)] transition-colors group"
              >
                <div className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{action.name}</div>
                <div className="text-[10px] font-mono opacity-40">{action.shortcut}</div>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
