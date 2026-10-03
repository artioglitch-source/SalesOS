'use client';

import {useEffect,useMemo,useState} from 'react';
import {createClient} from '@/lib/supabase/browser';
import {useOrg} from '@/lib/org/context';

export default function TeamPage(){
 const p=typeof window!=='undefined'?window.location.pathname:'/ar/team';const ar=p.split('/')[1]!=='en';const {activeOrgId}=useOrg();const s=useMemo(()=>createClient(),[]);const [rows,setRows]=useState<any[]>([]);
 useEffect(()=>{(async()=>{if(!activeOrgId)return;const {data}=await s.from('org_members').select('id,user_id,role,status,created_at').eq('org_id',activeOrgId).order('created_at');setRows(data??[])})()},[activeOrgId,s]);
 return <section className="p-4 md:p-8"><h1 className="text-2xl font-semibold">{ar?'الفريق والصلاحيات':'Team & permissions'}</h1><p className="mt-1 text-sm text-neutral-500">{ar?'أعضاء المؤسسة وأدوارهم.':'Organization members and roles.'}</p><div className="mt-5 overflow-x-auto rounded-2xl border bg-white dark:border-neutral-800 dark:bg-neutral-900"><table className="min-w-full text-sm"><thead><tr className="border-b dark:border-neutral-800"><th className="px-4 py-3 text-start">User</th><th className="px-4 py-3 text-start">Role</th><th className="px-4 py-3 text-start">Status</th></tr></thead><tbody>{rows.map(r=><tr className="border-b last:border-0 dark:border-neutral-800" key={r.id}><td className="px-4 py-3 font-mono text-xs">{r.user_id}</td><td className="px-4 py-3">{r.role}</td><td className="px-4 py-3">{r.status}</td></tr>)}</tbody></table>{rows.length===0&&<div className="p-10 text-center text-neutral-500">{ar?'لا يوجد أعضاء بعد.':'No members yet.'}</div>}</div></section>;
}
