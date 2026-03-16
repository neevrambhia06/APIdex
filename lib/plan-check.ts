import { createClient } from './supabase/server';

export type PlanType = 'free' | 'pro' | 'team';

export async function checkPlan(
  userId: string,
  requiredPlan: PlanType
): Promise<boolean> {
  const supabase = createClient();

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', userId)
    .single();

  if (error || !profile) return false;

  const planHierarchy: Record<PlanType, number> = {
    free: 0,
    pro: 1,
    team: 2,
  };

  return planHierarchy[profile.plan as PlanType] >= planHierarchy[requiredPlan];
}
