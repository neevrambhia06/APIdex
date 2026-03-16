"use client";

import React from 'react';
import Link from 'next/link';
import PricingCard from '@/components/pricing-card';
import { PurchaseModal } from '@/components/PurchaseModal';

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = React.useState<{ id: 'orbit' | 'launchpad' | 'galaxy' | 'universa', name: string, price: string, razorpayId: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleSubscribeClick = (id: any, name: string, price: string, razorpayId: string) => {
    setSelectedPlan({ id, name, price, razorpayId });
    setIsModalOpen(true);
  };

  const handleSuccess = (planId: string) => {
    console.log(`Plan ${planId} activated`);
  };

  const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'annual'>('monthly');
  const isAnnual = billingCycle === 'annual';

  return (
    <div className="max-w-[1200px] mx-auto px-6 pt-32 pb-32">
      <div className="flex flex-col items-center text-center mb-16">
        <div className="mono text-[var(--accent)] text-xs font-bold tracking-widest uppercase mb-4 animate-in fade-in slide-in-from-bottom-2 duration-700">Plans & Scale</div>
        <h1 className="text-[clamp(3.0rem,6vw,5rem)] font-black font-display tracking-[-0.05em] leading-[1.1] mb-6">
          Scale your <span className="text-[var(--accent)] italic font-[var(--font-body)] font-normal">Intelligence.</span>
        </h1>
        <p className="text-[var(--text-secondary)] text-md max-w-lg leading-relaxed mb-12">Choose the plan that fits your high-performance development needs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start mb-32">
        <PricingCard
          name="Orbit"
          price="₹0"
          accentColor="#8b949e"
          description="Free forever. No card needed."
          features={[
            "Browse all 74+ verified APIs",
            "Search & filter by category",
            "5 Bookmarks (session)",
            "3 API Vault key slots",
            "Community Discord access"
          ]}
          buttonText="CURRENT PLAN"
          onSubscribe={() => {}}
          disabledMagnet={true}
        />

        <PricingCard
          name="Launchpad"
          price="₹49"
          accentColor="#a78bfa"
          description="For students & indie hackers."
          features={[
            "Everything in Orbit",
            "25 Bookmarks (persistent)",
            "10 API Vault key slots",
            "Export Postman/Insomnia",
            "API latency benchmarks",
            "3-Way API Comparison"
          ]}
          buttonText="GET LAUNCHPAD"
          onSubscribe={() => handleSubscribeClick(
            'launchpad', 
            'Launchpad', 
            "₹49",
            process.env.NEXT_PUBLIC_RAZORPAY_LAUNCHPAD_PLAN_ID || 'plan_launchpad'
          )}
          magnetStrength={30}
        />

        <PricingCard
          name="Galaxy"
          price="₹149"
          isPopular
          accentColor="#00c8c8"
          description="For startups shipping fast."
          features={[
            "Everything in Launchpad",
            "Unlimited Bookmarks/Keys",
            "Advanced SDK Generation",
            "Webhook Tester (Live)",
            "Uptime Monitor (10 IDs)",
            "5-Way API Comparison"
          ]}
          buttonText="UPGRADE NOW"
          onSubscribe={() => handleSubscribeClick(
            'galaxy', 
            'Galaxy', 
            "₹149",
            process.env.NEXT_PUBLIC_RAZORPAY_GALAXY_PLAN_ID || 'plan_galaxy'
          )}
          magnetStrength={30}
        />

        <PricingCard
          name="Universa"
          price="₹499"
          accentColor="#f59e0b"
          description="For teams & enterprises."
          features={[
            "Everything in Galaxy",
            "White-label embed",
            "Team Workspace (5 seats)",
            "Shared Bookmarks/Vault",
            "Custom API Integrations",
            "Enterprise SLA & SSO"
          ]}
          buttonText="CONTACT SALES"
          onSubscribe={() => handleSubscribeClick(
            'universa', 
            'Universa', 
            "₹499",
            process.env.NEXT_PUBLIC_RAZORPAY_UNIVERSA_PLAN_ID || 'plan_universa'
          )}
          magnetStrength={30}
        />
      </div>

      <div className="relative p-12 bg-[var(--bg-surface)] border border-white/5 rounded-[var(--radius-xl)] overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)] opacity-[0.03] blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="mono text-[var(--text-tertiary)] text-[10px] font-bold tracking-widest uppercase mb-4">Verification Services</div>
          <h3 className="text-2xl font-extrabold font-[var(--font-display)] mb-4">Submission Fee</h3>
          <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
            Want to list your API for 50,000+ developers? We charge a one-time <span className="text-[var(--text-primary)] font-bold">₹499 review fee</span> to ensure the highest quality of entries for the community.
          </p>
          <Link href="/submit" className="text-[var(--accent)] font-bold border-b border-[var(--accent)]/30 hover:border-[var(--accent)] transition-all pb-1 uppercase tracking-widest text-xs">
            Submit your interface for review
          </Link>
        </div>
      </div>

      {selectedPlan && (
        <PurchaseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          planId={selectedPlan.id}
          razorpayPlanId={selectedPlan.razorpayId}
          planName={selectedPlan.name}
          price={selectedPlan.price}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
