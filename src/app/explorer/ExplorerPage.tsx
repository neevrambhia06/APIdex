'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface API {
  id: string;
  name: string;
  provider: string;
  description: string;
  pricing_tier: string;
  auth_type: string;
  api_categories: {
    name: string;
    icon: string;
    color: string;
  };
}

function ExplorerContent() {
  const searchParams = useSearchParams();
  const [apis, setApis] = useState<API[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchAPIs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '20',
          ...(category && { category }),
          ...(search && { search }),
        });

        const response = await fetch(`/api/apis?${params}`);
        const data = await response.json();
        
        setApis(data.apis);
        setTotalPages(data.pagination.totalPages);
      } catch (error) {
        console.error('Error fetching APIs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAPIs();
  }, [category, search, page]);

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 font-display">API Explorer</h1>
        
        {/* Filters */}
        <div className="mb-8 space-y-4">
          <input
            type="text"
            placeholder="Search APIs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 bg-[#0c0c0f] border border-white/10 rounded-lg focus:outline-none focus:border-cyan-400"
          />
          
          <div className="flex gap-2 flex-wrap">
            {['AI', 'Weather', 'Maps', 'Finance', 'Auth', 'Media', 'Comms', 'Dev Tools'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat === category ? '' : cat)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  category === cat
                    ? 'bg-cyan-400 text-black font-semibold'
                    : 'bg-[#0c0c0f] border border-white/10 hover:border-white/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* API Grid */}
        {loading ? (
          <div className="text-center py-20">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apis.map((api) => (
                <Link 
                  key={api.id} 
                  href={`/api/${api.id}`}
                  className="block p-6 bg-[#0c0c0f] border border-white/10 rounded-lg hover:border-cyan-400/50 transition-all hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold font-display">{api.name}</h3>
                      <p className="text-sm text-gray-400">{api.provider}</p>
                    </div>
                    <span className="text-2xl">{api.api_categories.icon}</span>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {api.description}
                  </p>
                  
                  <div className="flex gap-2">
                    <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded border border-green-500/30">
                      {api.pricing_tier}
                    </span>
                    <span className="px-2 py-1 text-xs bg-cyan-500/20 text-cyan-400 rounded border border-cyan-500/30">
                      {api.auth_type}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-[#0c0c0f] border border-white/10 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:border-white/30"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-[#0c0c0f] border border-white/10 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:border-white/30"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ExplorerPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExplorerContent />
    </Suspense>
  );
}
