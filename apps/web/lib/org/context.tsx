'use client';

import {createContext,useContext,useEffect,useMemo,useState} from 'react';
import {createClient} from '@/lib/supabase/browser';

type Org={id:string;name:string;slug:string};
export type OrgRole='owner_admin'|'sales_manager'|'supervisor'|'sales_rep'|'accountant_hr'|'viewer';
type OrgContextValue={userId:string|null;role:OrgRole|null;organizations:Org[];activeOrgId:string|null;setActiveOrgId:(id:string)=>void;refresh:()=>Promise<void>};
const OrgContext=createContext<OrgContextValue|null>(null);

export function OrgProvider({children}:{children:React.ReactNode}){
 const supabase=useMemo(()=>createClient(),[]);const [userId,setUserId]=useState<string|null>(null);const [role,setRole]=useState<OrgRole|null>(null);const [organizations,setOrganizations]=useState<Org[]>([]);const [activeOrgId,setActiveOrgIdState]=useState<string|null>(null);
 const refresh=async()=>{const {data:{user}}=await supabase.auth.getUser();setUserId(user?.id??null);if(!user){setOrganizations([]);setActiveOrgIdState(null);setRole(null);return}const {data}=await supabase.from('org_members').select('org_id,role,organizations(id,name,slug)').eq('user_id',user.id).eq('status','active');const memberships:any[]=data??[];const orgs=memberships.flatMap(r=>r.organizations?[r.organizations]:[]);setOrganizations(orgs);const stored=typeof window!=='undefined'?localStorage.getItem('salesos-org'):null;const id=stored&&orgs.some(o=>o.id===stored)?stored:orgs[0]?.id??null;setActiveOrgIdState(id);setRole((memberships.find(m=>m.org_id===id)?.role??memberships[0]?.role) as OrgRole|null)};
 useEffect(()=>{refresh()},[supabase]);
 const setActiveOrgId=(id:string)=>{setActiveOrgIdState(id);setRole(null);localStorage.setItem('salesos-org',id);void supabase.from('org_members').select('role').eq('org_id',id).eq('user_id',userId??'').eq('status','active').maybeSingle().then(({data})=>setRole((data?.role??null) as OrgRole|null))};
 return <OrgContext.Provider value={{userId,role,organizations,activeOrgId,setActiveOrgId,refresh}}>{children}</OrgContext.Provider>;
}
export function useOrg(){const v=useContext(OrgContext);if(!v)throw new Error('useOrg must be used within OrgProvider');return v}
