'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useUserStore } from '@/store/userStore';
import { User } from '@supabase/supabase-js';

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const { user, setUser, setSubscriptionStatus } = useUserStore();
  const supabase = createClient();

  useEffect(() => {
    // Check active sessions and sets the user
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user || null;
        
        setUser(currentUser);

        if (currentUser) {
          // Fetch subscription status
          const { data: userData } = await supabase
            .from('users')
            .select('subscription_status')
            .eq('id', currentUser.id)
            .single();

          setSubscriptionStatus(userData?.subscription_status || 'free');
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);

        if (currentUser) {
          const { data: userData } = await supabase
            .from('users')
            .select('subscription_status')
            .eq('id', currentUser.id)
            .single();

          setSubscriptionStatus(userData?.subscription_status || 'free');
        }

        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [setUser, setSubscriptionStatus, supabase]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signInWithOAuth = async (provider: 'github' | 'google') => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signInWithOAuth,
    signOut,
  };
}
