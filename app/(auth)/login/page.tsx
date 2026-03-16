"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  const signInWithOAuth = async (provider: 'github' | 'google') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/api/auth/callback` }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#09090b] text-white p-4">
      <div className="w-full max-w-md border border-[#27272a] bg-[#09090b] p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-6 font-syne text-[#22d3ee]">Login to APIdex</h1>
        
        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#18181b] border border-[#27272a] p-3 rounded focus:border-[#22d3ee] outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-[#18181b] border border-[#27272a] p-3 rounded focus:border-[#22d3ee] outline-none transition"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#22d3ee] text-black font-bold p-3 rounded hover:bg-[#22d3ee]/90 transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 flex flex-col space-y-3">
           <button onClick={() => signInWithOAuth('github')} className="w-full border border-[#27272a] p-3 rounded flex items-center justify-center hover:bg-white/5 transition">
              Sign in with GitHub
           </button>
           <button onClick={() => signInWithOAuth('google')} className="w-full border border-[#27272a] p-3 rounded flex items-center justify-center hover:bg-white/5 transition">
              Sign in with Google
           </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account? <Link href="/signup" className="text-[#22d3ee] hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
