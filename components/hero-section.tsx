"use client";

import { useState } from 'react';
import Link from 'next/link';
import GradientText from '@/components/ui/GradientText';
import DecryptedText from '@/components/ui/DecryptedText';
import LogoLoop from '@/components/ui/LogoLoop';

const apiLogos = [
  { id:"openai",   name:"OpenAI",       bg:"#10a37f", text:"OA" },
  { id:"claude",   name:"Claude",        bg:"#7c3aed", text:"CL" },
  { id:"gemini",   name:"Gemini",        bg:"#4285f4", text:"GE" },
  { id:"stripe",   name:"Stripe",        bg:"#635bff", text:"ST" },
  { id:"razorpay", name:"Razorpay",      bg:"#2d81f7", text:"RZ" },
  { id:"twilio",   name:"Twilio",        bg:"#f22f46", text:"TW" },
  { id:"github",   name:"GitHub",        bg:"#24292e", text:"GH" },
  { id:"supabase", name:"Supabase",      bg:"#3ecf8e", text:"SB" },
  { id:"weather",  name:"OpenWeather",   bg:"#eb6e4b", text:"OW" },
  { id:"maps",     name:"Google Maps",   bg:"#34a853", text:"GM" },
  { id:"spotify",  name:"Spotify",       bg:"#1db954", text:"SP" },
  { id:"tmdb",     name:"TMDB",          bg:"#01b4e4", text:"TM" },
  { id:"pexels",   name:"Pexels",        bg:"#05a081", text:"PX" },
  { id:"nasa",     name:"NASA",          bg:"#0b3d91", text:"NA" },
  { id:"coingecko",name:"CoinGecko",     bg:"#8cc63f", text:"CG" },
  { id:"hugging",  name:"HuggingFace",   bg:"#ff9d00", text:"HF" },
  { id:"eleven",   name:"ElevenLabs",    bg:"#a855f7", text:"EL" },
  { id:"sendgrid", name:"SendGrid",      bg:"#1a82e2", text:"SG" },
  { id:"mapbox",   name:"Mapbox",        bg:"#4264fb", text:"MB" },
  { id:"cloudinary",name:"Cloudinary",  bg:"#3448c5", text:"CL" },
  { id: "anthropic", name: "Anthropic", bg: "#7c3aed", text: "AN" },
  { id: "assembly", name: "AssemblyAI", bg: "#ff6b6b", text: "AA" },
  { id: "cohere", name: "Cohere", bg: "#3d5afe", text: "CO" },
  { id: "mistral", name: "Mistral", bg: "#f43f5e", text: "MI" },
  { id: "replicate", name: "Replicate", bg: "#000000", text: "RE" },
  { id: "stability", name: "Stability AI", bg: "#6366f1", text: "SA" },
  { id: "auth0", name: "Auth0", bg: "#eb5424", text: "A0" },
  { id: "clerk", name: "Clerk", bg: "#6c47ff", text: "CL" },
  { id: "firebase", name: "Firebase", bg: "#ffca28", text: "FB" },
  { id: "kinde", name: "Kinde", bg: "#000000", text: "KI" },
  { id: "novu", name: "Novu", bg: "#22d3ee", text: "NO" },
  { id: "resend", name: "Resend", bg: "#000000", text: "RE" },
  { id: "vonage", name: "Vonage", bg: "#000000", text: "VO" },
  { id: "cloudflare", name: "Cloudflare", bg: "#f38020", text: "CF" },
  { id: "launchdarkly", name: "LaunchDarkly", bg: "#3d5afe", text: "LD" },
  { id: "sentry", name: "Sentry", bg: "#362d59", text: "SE" },
  { id: "upstash", name: "Upstash", bg: "#00e5ff", text: "UP" },
  { id: "vercel", name: "Vercel", bg: "#000000", text: "VE" },
  { id: "shopify", name: "Shopify", bg: "#96bf48", text: "SH" },
  { id: "taxjar", name: "TaxJar", bg: "#f38020", text: "TJ" },
];

export default function HeroSection() {
  const [isHeaderDecrypted, setIsHeaderDecrypted] = useState(false);

  return (
    <section className="relative z-10 min-h-[90vh] flex flex-col items-center justify-center pt-20 px-6 text-center max-w-[1200px] mx-auto">
      <h1 className="hero-title leading-[1.0] tracking-[-0.05em] font-[var(--font-display)] font-extrabold mb-8">
        <GradientText
          colors={isHeaderDecrypted ? ["#00ff87","#00c896","#0ff0fc"] : ["#ffffff", "#ffffff"]}
          animationSpeed={isHeaderDecrypted ? 8 : 0}
          showBorder={false}
        >
          <DecryptedText 
            text="Exploration Without Limits."
            animateOn="load"
            sequential={true}
            speed={100}
            onAnimationDone={() => setIsHeaderDecrypted(true)}
          />
        </GradientText>
      </h1>
      
      <DecryptedText 
        text="74+ verified public APIs. Zero noise. Maximum signal."
        animateOn="load"
        speed={35}
        className="text-center font-mono text-sm text-[#8b949e] tracking-wide max-w-xl mx-auto mb-12"
      />

      <div className="mb-12 w-full max-w-4xl">
        <DecryptedText 
          text="No more tab-switching. No more broken docs. Just build."
          animateOn="view"
          speed={30}
          className="text-center font-mono text-sm text-[#8b949e] tracking-wide max-w-xl mx-auto block mb-6"
        />
        
        <p className="text-center font-mono text-[10px] text-[#484f58] tracking-widest uppercase mb-4">
          Powering developers across the universe
        </p>
        <div className="py-4">
          <LogoLoop 
            logos={apiLogos} 
            speed={40} 
            gap={32}
            logoHeight={48}
            pauseOnHover={true}
            fadeOut={true}
            scaleOnHover={true}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
         <Link href="/explorer" className="w-full md:w-auto bg-[var(--accent)] text-[var(--bg-canvas)] font-bold px-8 py-4 rounded-[var(--radius-md)] text-md hover:brightness-110 active:scale-95 transition-all">
            Get Started Free
         </Link>
         <div className="font-mono text-[var(--text-tertiary)] flex items-center gap-2 text-sm bg-white/5 px-4 py-4 rounded-[var(--radius-md)] border border-white/5">
            <span className="opacity-50">$</span> apidex init <span className="w-2 h-4 bg-[var(--accent)] animate-pulse" />
         </div>
      </div>
    </section>
  );
}
