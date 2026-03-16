"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SubmitAPIPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePayment = async () => {
    setLoading(true);
    // 1. Create Order
    const orderRes = await fetch('/api/razorpay/create-submission-order', {
      method: 'POST',
      body: JSON.stringify({ submitter_email: 'user@example.com' })
    }).then(r => r.json());

    if (!orderRes.success) return alert('Failed to create order');

    // 2. Mock Razorpay logic (normally follows with Razorpay script)
    // 3. Verify and Save
    const submitRes = await fetch('/api/submit-api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        razorpay_payment_id: 'pay_mock_' + Date.now()
      })
    }).then(r => r.json());

    if (submitRes.success) {
      setStep(3);
    } else {
      alert(submitRes.error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pt-32 pb-24">
      <div className="mb-12">
        <h1 className="text-4xl font-bold font-syne mb-2">Submit your <span className="text-[#22d3ee]">API</span>.</h1>
        <p className="text-gray-500">List your ecosystem on the world's premier API explorer.</p>
      </div>

      <div className="flex items-center justify-between mb-12">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex flex-col items-center space-y-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border ${step >= s ? 'border-[#22d3ee] bg-[#22d3ee] text-black' : 'border-white/10 text-gray-500'}`}>
              {s}
            </div>
            <span className="text-[10px] uppercase tracking-widest text-gray-500">Step {s}</span>
          </div>
        ))}
      </div>

      {step === 1 && (
        <form onSubmit={handleDetailsSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">API Name</label>
              <input type="text" className="w-full bg-[#18181b] border border-[#27272a] p-3 rounded text-sm outline-none focus:border-[#22d3ee]" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Provider</label>
              <input type="text" className="w-full bg-[#18181b] border border-[#27272a] p-3 rounded text-sm outline-none focus:border-[#22d3ee]" required />
            </div>
          </div>
          <div className="space-y-2">
             <label className="text-sm font-medium">Base URL</label>
             <input type="url" className="w-full bg-[#18181b] border border-[#27272a] p-3 rounded text-sm outline-none focus:border-[#22d3ee]" required />
          </div>
          <div className="space-y-2">
             <label className="text-sm font-medium">Documentation URL</label>
             <input type="url" className="w-full bg-[#18181b] border border-[#27272a] p-3 rounded text-sm outline-none focus:border-[#22d3ee]" required />
          </div>
          <div className="space-y-2">
             <label className="text-sm font-medium">Description</label>
             <textarea rows={4} className="w-full bg-[#18181b] border border-[#27272a] p-3 rounded text-sm outline-none focus:border-[#22d3ee]" required />
          </div>
          <button type="submit" className="w-full bg-[#22d3ee] text-black font-bold py-4 rounded-lg">
             Next: Payment Verification
          </button>
        </form>
      )}

      {step === 2 && (
        <div className="text-center p-12 bg-white/[0.02] border border-white/5 rounded-2xl">
           <h3 className="text-2xl font-bold font-syne mb-4">Review Fee</h3>
           <p className="text-gray-400 mb-8 leading-relaxed">
              We require a one-time fee of <span className="text-white font-bold">₹499</span> to review and list new APIs. This ensures high-quality entries for our ecosystem.
           </p>
           <button 
              onClick={handlePayment} 
              disabled={loading}
              className="w-full bg-[#22d3ee] text-black font-bold py-4 rounded-lg hover:bg-[#22d3ee]/90 transition"
           >
              {loading ? 'Processing...' : 'Pay ₹499 & Submit'}
           </button>
        </div>
      )}

      {step === 3 && (
        <div className="text-center p-12 py-24">
           <div className="w-20 h-20 bg-[#22d3ee] text-black rounded-full flex items-center justify-center text-4xl mx-auto mb-8">
              
           </div>
           <h3 className="text-3xl font-bold font-syne mb-4">Submission Received!</h3>
           <p className="text-gray-400 mb-12">Our editors will review your API within 48 hours. You'll receive an email once it's live.</p>
           <Link href="/dashboard" className="text-[#22d3ee] font-bold hover:underline">Return to Dashboard</Link>
        </div>
      )}
    </div>
  );
}
