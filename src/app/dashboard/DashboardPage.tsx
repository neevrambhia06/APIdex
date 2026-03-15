'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Bookmark {
  id: string;
  api_id: string;
  created_at: string;
  apis: {
    name: string;
    provider: string;
    description: string;
    pricing_tier: string;
  };
}

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchBookmarks = async () => {
      try {
        // In a real app, you'd create an API endpoint for this
        // For now, we'll just show the UI structure
        setBookmarks([]);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [user, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold font-display">Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 border border-white/20 rounded-lg hover:border-white/40"
          >
            Sign Out
          </button>
        </div>

        {searchParams.get('success') && (
          <div className="mb-8 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
            <p className="text-green-400">✓ Subscription activated successfully!</p>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Stats Cards */}
          <div className="p-6 bg-[#0c0c0f] border border-white/10 rounded-lg">
            <h3 className="text-sm text-gray-400 mb-2">Subscription</h3>
            <p className="text-2xl font-bold">Free Plan</p>
          </div>
          <div className="p-6 bg-[#0c0c0f] border border-white/10 rounded-lg">
            <h3 className="text-sm text-gray-400 mb-2">Bookmarks</h3>
            <p className="text-2xl font-bold">0 / 10</p>
          </div>
          <div className="p-6 bg-[#0c0c0f] border border-white/10 rounded-lg">
            <h3 className="text-sm text-gray-400 mb-2">APIs Submitted</h3>
            <p className="text-2xl font-bold">0</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Bookmarks Section */}
          <div>
            <h2 className="text-2xl font-bold font-display mb-4">Your Bookmarks</h2>
            {loading ? (
              <div className="text-center py-8 text-gray-400">Loading...</div>
            ) : bookmarks.length === 0 ? (
              <div className="p-6 bg-[#0c0c0f] border border-white/10 rounded-lg text-center">
                <p className="text-gray-400 mb-4">No bookmarks yet</p>
                <Link
                  href="/explorer"
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  Browse APIs →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookmarks.map((bookmark) => (
                  <Link
                    key={bookmark.id}
                    href={`/api/${bookmark.api_id}`}
                    className="block p-4 bg-[#0c0c0f] border border-white/10 rounded-lg hover:border-cyan-400/50 transition-all"
                  >
                    <h3 className="font-bold">{bookmark.apis.name}</h3>
                    <p className="text-sm text-gray-400">{bookmark.apis.provider}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Submissions Section */}
          <div>
            <h2 className="text-2xl font-bold font-display mb-4">API Submissions</h2>
            <div className="p-6 bg-[#0c0c0f] border border-white/10 rounded-lg text-center">
              <p className="text-gray-400 mb-4">You haven&apos;t submitted any APIs yet</p>
              <Link
                href="/submit"
                className="text-cyan-400 hover:text-cyan-300"
              >
                Submit an API →
              </Link>
            </div>
          </div>
        </div>

        {/* Upgrade CTA */}
        <div className="mt-8 p-8 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-400/30 rounded-lg">
          <h2 className="text-2xl font-bold font-display mb-2">Upgrade to Pro</h2>
          <p className="text-gray-400 mb-4">
            Get unlimited bookmarks, API comparison tools, and export Postman collections
          </p>
          <Link
            href="/pricing"
            className="inline-block px-6 py-3 bg-cyan-400 text-black font-semibold rounded-lg hover:bg-cyan-300"
          >
            View Plans
          </Link>
        </div>
      </div>
    </div>
  );
}
