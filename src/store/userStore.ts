import { create } from 'zustand';
import { User } from '@supabase/supabase-js';

interface UserState {
  user: User | null;
  subscriptionStatus: 'free' | 'pro' | 'cancelled';
  setUser: (user: User | null) => void;
  setSubscriptionStatus: (status: 'free' | 'pro' | 'cancelled') => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  subscriptionStatus: 'free',
  setUser: (user) => set({ user }),
  setSubscriptionStatus: (status) => set({ subscriptionStatus: status }),
  clearUser: () => set({ user: null, subscriptionStatus: 'free' }),
}));
