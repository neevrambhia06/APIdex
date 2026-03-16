"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

export interface APICardProps {
  api: {
    id: string;
    name: string;
    slug: string;
    provider: string;
    description: string;
    pricing_tier: 'free' | 'freemium' | 'paid';
    auth_type: string;
    logo_url: string;
    category: { name: string, color: string };
  }
}

export default function APICard({ api }: APICardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <Link href={`/api/${api.slug}`} className={`entrance ${isVisible ? 'visible' : ''}`}>
      <div className="api-card-redesign group">
        <div className="flex justify-between items-start">
          <div className="flex gap-4 items-center">
            <div 
              className="w-9 h-9 flex items-center justify-center rounded-[var(--radius-md)] text-white font-extrabold text-sm overflow-hidden transition-transform duration-200 group-hover:scale-110" 
              style={{ 
                backgroundColor: api.category.color || 'var(--accent)',
                boxShadow: `0 0 12px ${api.category.color}40`
              }}
            >
              {api.logo_url ? <img src={api.logo_url} alt={api.name} className="w-full h-full object-cover" /> : api.name[0].toUpperCase()}
            </div>
            <div>
              <h3 className="text-md font-semibold text-[var(--text-primary)]">{api.name}</h3>
              <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider">{api.provider}</p>
            </div>
          </div>
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            className="text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-all duration-500 hover:scale-125"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"/></svg>
          </button>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-[var(--accent-subtle)] text-[var(--accent)] px-2 py-0.5 rounded-full">
            {api.category.name}
          </span>
          <span className={`badge text-[10px] font-mono font-bold ${api.pricing_tier === 'free' ? 'text-[var(--success)]' : api.pricing_tier === 'freemium' ? 'text-violet-400' : 'text-[var(--warning)]'}`}>
            {api.pricing_tier.toUpperCase()}
          </span>
        </div>
      </div>
    </Link>
  );
}
