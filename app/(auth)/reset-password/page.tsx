"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#09090b] text-white p-4">
      <div className="w-full max-w-md border border-[#27272a] bg-[#09090b] p-8 rounded-lg text-center">
        <h1 className="text-3xl font-bold mb-6 font-syne text-[#22d3ee]">Reset Password</h1>
        
        {success ? (
          <p className="text-gray-400">If an account exists for that email, we've sent instructions to reset your password.</p>
        ) : (
          <form onSubmit={handleReset} className="space-y-4 text-left">
            {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}
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
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#22d3ee] text-black font-bold p-3 rounded hover:bg-[#22d3ee]/90 transition"
            >
              Send Reset Link
            </button>
          </form>
        )}
        
        <div className="mt-6">
          <Link href="/login" className="text-[#22d3ee] hover:underline text-sm">Back to login</Link>
        </div>
      </div>
    </div>
  );
}
