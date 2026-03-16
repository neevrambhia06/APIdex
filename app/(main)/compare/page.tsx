"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

export default function ComparePage() {
  const [selectedApis, setSelectedApis] = useState<any[]>([null, null, null]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (searchQuery.length > 1) {
      const fetchApis = async () => {
        const { data } = await supabase
          .from('apis')
          .select('*')
          .ilike('name', `%${searchQuery}%`)
          .limit(5);
        setSearchResults(data || []);
      };
      fetchApis();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const selectApi = (api: any, index: number) => {
    const newSelected = [...selectedApis];
    newSelected[index] = api;
    setSelectedApis(newSelected);
    setActiveSlot(null);
    setSearchQuery('');
  };

  const removeApi = (index: number) => {
    const newSelected = [...selectedApis];
    newSelected[index] = null;
    setSelectedApis(newSelected);
  };

  const parameters = [
    { label: 'PROVIDER_ID', key: 'provider' },
    { label: 'PRICING_MODEL', key: 'pricing_tier' },
    { label: 'AUTH_PROTOCOL', key: 'auth_type' },
    { label: 'BASE_PATH', key: 'base_url' },
    { label: 'VERSION_NODE', key: 'version' },
    { label: 'SANDBOX_MODE', key: 'has_sandbox', transform: (v: any) => v ? 'ENABLED' : 'DISABLED' },
    { label: 'RATING_METRIC', key: 'rating', transform: (v: any) => v ? `${v.toFixed(2)} / 5.00` : 'N/A' },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-6 pt-32 pb-24">
      <div className="flex flex-col gap-4 mb-16 max-w-2xl">
        <div className="mono text-[var(--accent)] text-[10px] font-bold tracking-[0.2em] uppercase">Matrix_Comparison_v1.2</div>
        <h1 className="text-5xl font-extrabold font-[var(--font-display)] leading-[1.1] tracking-tighter">
          Benchmark API <span className="text-[var(--accent)]">Intelligence.</span>
        </h1>
        <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed">
          Side-by-side technical breakdown of interface capabilities and pricing tiers. Compare up to 3 endpoints simultaneously.
        </p>
      </div>

      <div className="relative group/matrix">
        <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent)] to-transparent opacity-10 blur-2xl group-hover/matrix:opacity-20 transition-opacity duration-500" />
        <div className="relative border border-white/5 rounded-[var(--radius-xl)] bg-[var(--bg-surface)] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="p-8 font-[var(--font-mono)] text-[9px] uppercase tracking-[0.3em] text-[var(--text-tertiary)] w-1/4 border-r border-white/5">Parameter_Node</th>
                {[0, 1, 2].map((i) => (
                  <th key={i} className="p-8 w-1/4 border-r border-white/5 relative">
                    {selectedApis[i] ? (
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                              {selectedApis[i].logo_url && (
                                <Image src={selectedApis[i].logo_url} alt="" width={24} height={24} className="opacity-80" />
                              )}
                            </div>
                            <span className="text-sm font-bold tracking-tight">{selectedApis[i].name}</span>
                          </div>
                          <button onClick={() => removeApi(i)} className="p-1 hover:text-red-500 transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <button 
                          onClick={() => setActiveSlot(i)}
                          className="w-full py-4 border border-dashed border-white/10 rounded-[var(--radius-md)] text-[var(--text-tertiary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all flex items-center justify-center gap-2 group"
                        >
                          <span className="mono text-[10px] font-bold">+ SELECT_NODE_{String.fromCharCode(65 + i)}</span>
                        </button>
                        
                        {activeSlot === i && (
                          <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[var(--bg-surface)] border border-white/10 rounded-[var(--radius-md)] shadow-2xl p-2 animate-in fade-in slide-in-from-top-2">
                            <input 
                              autoFocus
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="Search API..."
                              className="w-full bg-white/5 border border-white/10 rounded-[var(--radius-sm)] px-3 py-2 text-xs mono focus:outline-none focus:border-[var(--accent)]/50 mb-2"
                            />
                            <div className="max-h-48 overflow-y-auto">
                              {searchResults.map((api) => (
                                <button
                                  key={api.id}
                                  onClick={() => selectApi(api, i)}
                                  className="w-full text-left p-2 hover:bg-white/5 rounded-[var(--radius-sm)] flex items-center gap-2 transition-colors"
                                >
                                  <div className="w-5 h-5 bg-white/5 rounded-sm overflow-hidden flex-shrink-0">
                                    {api.logo_url && <Image src={api.logo_url} alt="" width={20} height={20} />}
                                  </div>
                                  <span className="text-[11px] mono truncate">{api.name}</span>
                                </button>
                              ))}
                              {searchQuery.length > 1 && searchResults.length === 0 && (
                                <div className="p-4 text-center text-[10px] mono text-[var(--text-tertiary)]">NO_RESULTS</div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-[12px] mono">
              {parameters.map((param, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                  <td className="p-8 font-bold text-[var(--text-tertiary)] border-r border-white/5 bg-white/[0.01] uppercase tracking-tighter text-[10px]">{param.label}</td>
                  {[0, 1, 2].map((slotIdx) => {
                    const api = selectedApis[slotIdx];
                    const val = api ? (param.transform ? param.transform(api[param.key]) : api[param.key]) : null;
                    return (
                      <td key={slotIdx} className="p-8 border-r border-white/5 text-[var(--text-secondary)] italic">
                        {api ? (
                          <span className="text-[var(--text-primary)] font-medium not-italic">{val || 'N/A'}</span>
                        ) : (
                          <span className="opacity-20">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-12 flex justify-between items-center">
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
          <span className="mono text-[10px] text-[var(--text-tertiary)] tracking-widest uppercase">Benchmarking protocol live</span>
        </div>
        <button className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-[var(--radius-md)] font-bold text-xs hover:bg-[var(--accent)] hover:text-white transition-all active:scale-95">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          EXPORT_ANALYSIS_LOG
        </button>
      </div>
    </div>
  );
}
