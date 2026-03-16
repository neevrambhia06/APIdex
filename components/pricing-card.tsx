import Magnet from '@/components/ui/Magnet';

interface PricingCardProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
  onSubscribe: () => void;
  magnetStrength?: number;
  disabledMagnet?: boolean;
  accentColor?: string;
}

export default function PricingCard({ 
  name, 
  price, 
  description, 
  features, 
  buttonText, 
  isPopular,
  onSubscribe,
  magnetStrength,
  disabledMagnet,
  accentColor = 'var(--text-primary)'
}: PricingCardProps) {
  return (
    <div 
      className={`pricing-card relative flex flex-col p-10 rounded-[var(--radius-xl)] border transition-all duration-200 ${isPopular ? 'scale-[1.02] shadow-[0_0_32px_rgba(0,200,150,0.05)]' : 'bg-[var(--bg-surface)] hover:border-white/10'}`}
      style={{ 
        borderColor: isPopular ? accentColor : 'rgba(255,255,255,0.05)',
        backgroundColor: isPopular ? `${accentColor}08` : 'var(--bg-surface)' 
      }}
    >
      {isPopular && (
        <span 
          className="popular-badge absolute top-[-14px] left-1/2 translate-x-[-50%] text-black text-xs font-extrabold px-3 py-1 rounded-full whitespace-nowrap"
          style={{ backgroundColor: accentColor }}
        >
          Most Popular
        </span>
      )}
      
      <div 
        className="mono text-[10px] font-bold tracking-widest uppercase mb-4"
        style={{ color: accentColor }}
      >
        {name}
      </div>
      
      <div className="mb-6">
        <div className="text-[40px] font-black font-display tracking-[-0.04em] flex items-end gap-1">
          {price}
          {price !== 'Free' && <span className="text-sm font-normal text-[var(--text-tertiary)] mb-2">/mo</span>}
        </div>
        <p className="text-[var(--text-secondary)] text-sm mt-2">{description}</p>
      </div>
      
      <div className="flex-1 space-y-4 mb-10">
        {features.map((feature, i) => (
          <div key={i} className="flex items-start gap-3 text-sm">
            <svg 
              className="w-4 h-4 mt-0.5 shrink-0" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={3}
              style={{ color: accentColor }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-[var(--text-secondary)]">{feature}</span>
          </div>
        ))}
      </div>
      
      <Magnet 
        magnetStrength={magnetStrength || 30} 
        disabled={disabledMagnet} 
        padding={50} 
        wrapperClassName="w-full"
        style={{ display: 'block', width: '100%' }}
      >
        <button 
          onClick={onSubscribe}
          className={`w-full py-3 rounded-[var(--radius-md)] font-bold transition-all active:scale-95`}
          style={{ 
            backgroundColor: accentColor,
            border: `1px solid ${accentColor}`,
            color: 'black',
            boxShadow: `0 0 20px ${accentColor}33`
          }}
        >
          {buttonText}
        </button>
      </Magnet>
    </div>
  );
}
