'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Check } from 'lucide-react';
import Script from 'next/script';
import Image from 'next/image';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PricingPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!user) {
      alert('Please sign in to subscribe');
      return;
    }

    setLoading(true);
    try {
      // Create Razorpay order
      const response = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: parseInt(process.env.NEXT_PUBLIC_RAZORPAY_PRO_PLAN_AMOUNT || '900') 
        }),
      });

      const data = await response.json();
      
      if (data.orderId) {
        // Initialize Razorpay checkout
        const options = {
          key: data.keyId,
          amount: data.amount,
          currency: data.currency,
          name: 'APIdex Pro',
          description: 'Monthly Subscription',
          order_id: data.orderId,
          handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
            try {
              // Verify payment on your backend
              const verifyResponse = await fetch('/api/payment/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });

              if (verifyResponse.ok) {
                window.location.href = '/dashboard?success=true';
              } else {
                alert('Payment verification failed');
              }
            } catch (error) {
              console.error('Payment verification error:', error);
              alert('Payment verification failed');
            }
          },
          prefill: {
            name: user.user_metadata?.full_name || '',
            email: user.email || '',
          },
          theme: {
            color: '#22d3ee',
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      }
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      alert('Failed to create payment order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-8">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 font-display">
          Simple, Transparent Pricing
        </h1>
        <p className="text-gray-400 text-center mb-12">
          Start free, upgrade when you need more power
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <div className="p-8 bg-[#0c0c0f] border border-white/10 rounded-lg">
            <h3 className="text-2xl font-bold font-display mb-2">Free</h3>
            <p className="text-4xl font-bold mb-6">₹0<span className="text-lg text-gray-400 font-normal">/month</span></p>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-400" />
                <span>Browse all APIs</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-400" />
                <span>Up to 10 bookmarks</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-400" />
                <span>Submit APIs for review</span>
              </li>
              <li className="flex items-center gap-3 text-gray-500">
                <span className="line-through">Unlimited bookmarks</span>
              </li>
              <li className="flex items-center gap-3 text-gray-500">
                <span className="line-through">API comparison tool</span>
              </li>
              <li className="flex items-center gap-3 text-gray-500">
                <span className="line-through">Export Postman collections</span>
              </li>
            </ul>

            <button className="w-full py-3 border border-white/20 rounded-lg hover:border-white/40 transition-all">
              Get Started
            </button>
          </div>

          {/* Pro Plan */}
          <div className="p-8 bg-[#0c0c0f] border border-cyan-400/50 rounded-lg relative overflow-hidden">
            <div className="absolute top-4 right-4 px-3 py-1 bg-cyan-400 text-black text-sm font-semibold rounded-full">
              Popular
            </div>
            <h3 className="text-2xl font-bold font-display mb-2">Pro</h3>
            <p className="text-4xl font-bold mb-6">₹9<span className="text-lg text-gray-400 font-normal">/month</span></p>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-cyan-400" />
                <span>Everything in Free</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-cyan-400" />
                <span>Unlimited bookmarks</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-cyan-400" />
                <span>API comparison tool</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-cyan-400" />
                <span>Export Postman collections</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-cyan-400" />
                <span>Priority support</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-cyan-400" />
                <span>Early access to new features</span>
              </li>
            </ul>

            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full py-3 bg-cyan-400 text-black font-semibold rounded-lg hover:bg-cyan-300 transition-all disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Subscribe with Razorpay'}
            </button>
            
            <div className="mt-4 flex justify-center gap-2">
              <Image src="https://cdn.razorpay.com/static/assets/logo/payment.svg" alt="Razorpay" width={100} height={30} className="opacity-70" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
