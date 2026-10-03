'use client';

import {useEffect,useMemo,useState} from 'react';
import {createClient} from '@/lib/supabase/browser';
import {useOrg} from '@/lib/org/context';

const score=(r:any)=>Math.min(100,Number(r.score||0)+(['website','referral','campaign'].includes(String(r.source||'').toLowerCase())?10:0)+(r.email?10:0)+(r.phone?10:0)+(Number(r.expected_value||0)>=10000?20:0));

export default function Leads(){
 const p=typeof window!=='undefined'?window.location.pathname:'/ar/leads';const locale=p.split('/')[1]||'ar';const ar=locale!=='en';const s=useMemo(()=>createClient(),[]);const {activeOrgId}=useOrg();const [rows,setRows]=useState<any[]>([]);useEffect(()=>{(async()=>{if(!activeOrgId)return;const {data}=await s.from('leads').select('*').eq('org_id',activeOrgId).order('created_at',{ascending:false});setRows((data??[]).map(r=>({...r,computed_score:score(r)})))})()},[activeOrgId,s]);return <section className="p-4 md:p-8"><div><h1 className="text-2xl font-semibold">{ar?'العملاء المحتملون':'Leads'}</h1><p className="mt-1 text-sm text-neutral-500">{ar?'تسجيل ومتابعة وتقييم أولوية العملاء المحتملين.':'Capture, follow up, and prioritize leads.'}</p></div><div className="mt-5 overflow-x-auto rounded-2xl border bg-white dark:border-neutral-800 dark:bg-neutral-900"><table className="min-w-full text-sm"><thead><tr className="border-b dark:border-neutral-800"><th className="px-4 py-3 text-start">Name</th><th className="px-4 py-3 text-start">Company</th><th className="px-4 py-3 text-start">Source</th><th className="px-4 py-3 text-start">Priority score</th><th className="px-4 py-3 text-start">Status</th></tr></thead><tbody>{rows.map(r=><tr key={r.id} className="border-b last:border-0 dark:border-neutral-800"><td className="px-4 py-3 font-medium">{r.name}</td><td className="px-4 py-3">{r.company||'—'}</td><td className="px-4 py-3">{r.source||'—'}</td><td className="px-4 py-3"><span className="rounded-full border px-2 py-1 text-xs">{r.computed_score}</span></td><td className="px-4 py-3">{r.status||'new'}</td></tr>)}</tbody></table>{rows.length===0&&<div className="p-10 text-center text-neutral-500">{ar?'لا يوجد عملاء محتملون بعد.':'No leads yet.'}</div>}</div></section>
}
