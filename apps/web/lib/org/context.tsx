'use client';

import {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {createClient} from '@/lib/supabase/browser';

type Org = {id:string; name:string; slug:string};
type OrgContextValue = {
  userId:string|null;
  organizations:Org[];
  activeOrgId:string|null;
  setActiveOrgId:(id:string)=>void;
  refresh:()=>Promise<void>;
};

const OrgContext = createContext<OrgContextValue | null>(null);

export function OrgProvider({children}:{children:React.ReactNode}) {
  const supabase = useMemo(() => createClient(), []);
  const [userId,setUserId] = useState<string|null>(null);
  const [organizations,setOrganizations] = useState<Org[]>([]);
  const [activeOrgId,setActiveOrgIdState] = useState<string|null>(null);

  const refresh = async () => {
    const {data:{user}} = await supabase.auth.getUser();
    setUserId(user?.id ?? null);
    if (!user) { setOrganizations([]); setActiveOrgIdState(null); return; }
    const {data} = await supabase
      .from('org_members')
      .select('org_id, organizations(id,name,slug)')
      .eq('user_id',user.id)
      .eq('status','active');
    const orgs = (data ?? []).flatMap((row:any) => row.organizations ? [row.organizations] : []);
    setOrganizations(orgs);
    const stored = typeof window !== 'undefined' ? localStorage.getItem('salesos-org') : null;
    setActiveOrgIdState(stored && orgs.some((o) => o.id === stored) ? stored : orgs[0]?.id ?? null);
  };

  useEffect(() => { refresh(); }, [supabase]);

  const setActiveOrgId = (id:string) => {
    setActiveOrgIdState(id);
    localStorage.setItem('salesos-org',id);
  };

  return <OrgContext.Provider value={{userId,organizations,activeOrgId,setActiveOrgId,refresh}}>{children}</OrgContext.Provider>;
}

export function useOrg() {
  const value = useContext(OrgContext);
  if (!value) throw new Error('useOrg must be used within OrgProvider');
  return value;
}
