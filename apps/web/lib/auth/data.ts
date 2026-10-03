import {createClient} from '@/lib/supabase/server';

export async function getAuthContext() {
  const supabase = await createClient();
  const {data: {user}} = await supabase.auth.getUser();

  if (!user) return {supabase, user: null, organizations: []};

  const {data: memberships} = await supabase
    .from('org_members')
    .select('org_id, role, organizations(id, name, slug)')
    .eq('user_id', user.id)
    .eq('status', 'active');

  return {
    supabase,
    user,
    organizations: memberships ?? [],
  };
}
