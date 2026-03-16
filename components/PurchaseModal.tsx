"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, CreditCard, Landmark, Shield, Check } from 'lucide-react';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: 'orbit' | 'launchpad' | 'galaxy' | 'universa';
  razorpayPlanId: string;
  planName: string;
  price: string;
  onSuccess: (planId: string) => void;
}

const planColors: Record<string, string> = {
  orbit:     '#71717a',
  launchpad: '#a78bfa',
  galaxy:    '#00c8c8',
  universa:  '#f59e0b',
};

const planTextColors: Record<string, string> = {
  orbit:     '#ffffff',
  launchpad: '#000000',
  galaxy:    '#000000',
  universa:  '#000000',
};

const planUnlocks: Record<string, string[]> = {
  launchpad: [
    'Postman Export', 'Insomnia Export',
    '3-Way Compare', 'Changelog Alerts', 'Early Access'
  ],
  galaxy: [
    'SDK Generator', 'Webhook Tester',
    'Uptime Monitor', 'PDF Reports',
    'Breaking Alerts', 'Priority Support'
  ],
  universa: [
    'White-Label', 'Team Workspace', 'SSO',
    'Enterprise SLA', 'Dedicated Slack'
  ],
  orbit: []
};

declare global {
  interface Window {
    Razorpay: any;
  }
}

import { useRouter } from 'next/navigation';

export function PurchaseModal({ 
  isOpen, 
  onClose, 
  planId, 
  razorpayPlanId,
  planName, 
  price, 
  onSuccess 
}: PurchaseModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const router = useRouter();

  const accentColor = planColors[planId] || '#00c8c8';
  const btnTextColor = planTextColors[planId] || '#000000';

  /* 
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  */

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setLoading(false);
      setSuccess(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handlePayment = async () => {
    alert("Payments are currently disabled for maintenance. Please check back later.");
    return;
    
    /* Razorpay Implementation Commented Out
    if (!scriptLoaded || !window.Razorpay) {
      alert("Razorpay is still loading. Please try again in a moment.");
      return;
    }

    try {
      setLoading(true);
      console.log('Initiating purchase for plan:', planId);

      // Create subscription
      const res = await fetch('/api/razorpay/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan_id: razorpayPlanId }) // Changed from planId to razorpayPlanId to match original logic
      });

      const data = await res.json();
      console.log('Subscription response:', data);

      if (!data.success) {
        console.error('Subscription creation failed:', data.error, data.details);
        alert(`Purchase failed: ${data.error}${data.details ? ` (${data.details})` : ''}`);
        setLoading(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        subscription_id: data.subscription_id,
        name: 'APIdex',
        description: `${planName} Plan Activation`, // Changed from generic to planName
        handler: async (response: any) => {
          console.log('Razorpay payment successful, verifying...', response);
          try {
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_signature: response.razorpay_signature,
                plan: planId // Changed from planName.toLowerCase() to planId to match original logic
              })
            });

            const verifyData = await verifyRes.json();
            console.log('Verification response:', verifyData);

            if (verifyData.success) {
              router.refresh(); // Added back router.refresh() from original
              setSuccess(true);
              // setLoading(false); // Removed as per original flow, success state handles UI
              // setTimeout(() => { // Removed as per original flow
              //   onClose();
              //   window.location.reload();
              // }, 2000);
            } else {
              console.error('Payment verification failed:', verifyData.error);
              alert(`Payment verified but profile update failed: ${verifyData.error}. Please contact support with subscription ID: ${response.razorpay_subscription_id}`); // Added subscription ID
              setLoading(false);
            }
          } catch (err) {
            console.error('Verification connection error:', err);
            alert('Connection error during payment verification. Please contact support.');
            setLoading(false);
          }
        },
        prefill: {
          name: 'User', // Changed from empty string to 'User'
          email: 'user@example.com', // Changed from empty string to 'user@example.com'
        },
        theme: {
          color: accentColor // Changed from '#00c896' to accentColor
        },
        modal: {
          ondismiss: () => {
            console.log('Razorpay modal dismissed by user');
            setLoading(false);
          }
        }
      };

      if (!(window as any).Razorpay) { // This check is redundant given the initial check, but kept as per instruction
        console.error('Razorpay SDK not loaded');
        alert('Payment system is still loading. Please try again in a few seconds.');
        setLoading(false);
        return;
      }

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Purchase initiation error:', error);
      alert('Failed to initiate purchase. Please check your internet connection and try again.');
      setLoading(false);
    }
    */
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-lg px-4 md:px-0"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-[480px] bg-[#0d1117] border border-white/10 rounded-2xl md:rounded-2xl p-7 relative shadow-[0_32px_80px_rgba(0,0,0,0.6)] 
                   fixed bottom-0 md:relative md:bottom-auto rounded-t-3xl md:rounded-b-2xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {!success ? (
          <>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display font-bold text-[20px] text-[#f0f6fc]">Purchase {planName}</h2>
              <button 
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center text-[#484f58] hover:text-[#f0f6fc] hover:bg-white/5 rounded-md transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Order Summary */}
            <div className="grid grid-cols-2 gap-0 mb-5 items-start">
              <div>
                <div className="font-mono text-[10px] text-[#484f58] tracking-widest uppercase mb-1.5">ORDER TOTAL</div>
                <div className="font-display font-extrabold text-[32px] text-[#f0f6fc] tracking-tight">{price}</div>
              </div>
              <div>
                <div className="font-mono text-[10px] text-[#484f58] tracking-widest uppercase mb-1.5 text-right">PLAN</div>
                <div className="flex justify-end">
                  <span 
                    className="font-mono font-semibold text-[11px] px-3 py-1 rounded-full border"
                    style={{ 
                      backgroundColor: accentColor + '18',
                      borderColor: accentColor + '40',
                      color: accentColor 
                    }}
                  >
                    {planName}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 my-4" />

            {/* Unlocks */}
            <div className="mb-5">
              <div className="font-mono text-[10px] text-[#484f58] tracking-widest uppercase mb-2.5">UNLOCKS IMMEDIATELY</div>
              <div className="flex flex-wrap gap-1.5">
                {planUnlocks[planId]?.map((item, idx) => (
                  <span 
                    key={idx}
                    className="font-mono text-[9px] px-2.5 py-1 rounded border whitespace-nowrap"
                    style={{ 
                      backgroundColor: accentColor + '0d',
                      borderColor: accentColor + '35',
                      color: accentColor 
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Simplified Payment Section */}
            <div className="bg-[#161b22] border border-white/5 rounded-xl p-8 mb-4 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-6 opacity-50">
                <Lock size={12} className="text-[#484f58]" />
                <span className="font-mono text-[10px] text-[#484f58] tracking-widest uppercase">SECURE PAYMENT VIA RAZORPAY</span>
              </div>

              <div className="mb-8">
                <div className="font-mono text-[10px] text-[#484f58] tracking-widest mb-1.5 opacity-40">TOTAL AMOUNT DUE</div>
                <div className="font-display font-extrabold text-[42px] text-[#f0f6fc] tracking-tight">{price}</div>
              </div>

              <button 
                onClick={handlePayment}
                disabled={loading}
                className="w-full h-[56px] rounded-xl flex items-center justify-center gap-2 font-display font-bold text-sm tracking-widest uppercase transition-all active:scale-[0.98] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                style={{ 
                  backgroundColor: loading ? '#21262d' : accentColor,
                  color: loading ? '#484f58' : btnTextColor,
                  boxShadow: !loading ? `0 8px 24px ${accentColor}30` : 'none'
                }}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-current/20 border-t-current rounded-full animate-spin" />
                    <span>PREPARING...</span>
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    <span>PAY {price}</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 mt-4 opacity-20 group cursor-default">
              <Shield size={10} className="text-[#484f58]" />
              <div className="font-mono text-[7px] text-[#484f58] tracking-[0.2em] uppercase">
                ENCRYPTED HANDSHAKE  INSTANT ACTIVATION  NO DATA STORED
              </div>
            </div>
          </>
        ) : (
          /* Success Screen */
          <div className="flex flex-col items-center py-6 text-center">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="30"
                  fill="none"
                  stroke={accentColor + '20'}
                  strokeWidth="3"
                />
                <motion.circle
                  cx="32"
                  cy="32"
                  r="30"
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "188.5", strokeDashoffset: "188.5" }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </svg>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Check size={32} stroke={accentColor} strokeWidth={3} />
              </motion.div>
            </div>

            <motion.h3 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="font-display font-bold text-[22px] text-[#f0f6fc] mt-6"
            >
              Payment Successful!
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="font-[var(--font-body)] text-sm text-[#8b949e] mt-1"
            >
              {planName} activated
            </motion.p>

            <div className="mt-8 mb-6 w-full">
              <div className="font-mono text-[10px] text-[#484f58] tracking-widest uppercase mb-3 text-left pl-2">Services unlocked:</div>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {planUnlocks[planId]?.map((item, idx) => (
                  <motion.span 
                    key={idx}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 + idx * 0.05 }}
                    className="font-mono text-[9px] px-2.5 py-1 rounded border whitespace-nowrap"
                    style={{ 
                      backgroundColor: accentColor + '0d',
                      borderColor: accentColor + '35',
                      color: accentColor 
                    }}
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </div>

            <button 
              onClick={() => {
                onSuccess(planId);
                onClose();
              }}
              className="w-full h-[46px] rounded-xl flex items-center justify-center gap-2 font-display font-bold text-xs tracking-widest uppercase transition-all hover:brightness-110 active:scale-[0.98]"
              style={{ 
                backgroundColor: accentColor,
                color: btnTextColor
              }}
            >
              GO TO MY SERVICES
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
