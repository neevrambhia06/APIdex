import { Metadata } from 'next';
import PricingPage from './PricingPage';

export const metadata: Metadata = {
  title: 'Pricing | APIdex',
  description: 'Choose the perfect plan for your API exploration needs',
};

export default function Pricing() {
  return <PricingPage />;
}
