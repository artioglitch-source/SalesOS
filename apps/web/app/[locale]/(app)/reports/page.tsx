'use client';

import {useEffect,useMemo,useState} from 'react';
import {createClient} from '@/lib/supabase/browser';
import {useOrg} from '@/lib/org/context';
import {BarChart3,BriefcaseBusiness,Coins,Users} from 'lucide-react';

export default function Reports(){
 const path=typeof window!=='undefined'?window.location.pathname:'/ar/reports';const locale=path.split('/')[1]||'ar';const ar=locale==='ar';
 const supabase=useMemo(()=>createClient(),[]);const {activeOrgId}=useOrg();const [d,setD]=useState({revenue:0,pipeline:0,accounts:0,leads:0}); 
 useEffect(()=>{(async()=>{if(!activeOrgId)return;const [p,dl,a,l]=await Promise.all([supabase.from('payments').select('amount').eq('org_id',activeOrgId),supabase.from('deals').select('value').eq('org_id',activeOrgId).eq('status','open'),supabase.from('accounts').select('*',{count:'exact',head:true}).eq('org_id',activeOrgId),supabase.from('leads').select('*',{count:'exact',head:true}).eq('org_id',activeOrgId)]);setD({revenue:(p.data??[]).reduce((s,r)=>s+Number(r.amount||0),0),pipeline:(dl.data??[]).reduce((s,r)=>s+Number(r.value||0),0),accounts:a.count??0,leads:l.count??0})})()},[activeOrgId,supabase]);
 const cards=[[Coins,ar?'الإيرادات المستلمة':'Received revenue',d.revenue],[BriefcaseBusiness,ar?'قيمة الصفقات المفتوحة':'Open pipeline',d.pipeline],[Users,ar?'الحسابات':'Accounts',d.accounts],[BarChart3,ar?'العملاء المحتملون':'Leads',d.leads]] as const;
 return <section className="p-4 md:p-8"><h1 className="text-2xl font-semibold">{ar?'التقارير':'Reports'}</h1><p className="mt-1 text-sm text-neutral-500">{ar?'مؤشرات مباشرة من بيانات المؤسسة.':'Live indicators from your organization data.'}</p><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{cards.map(([I,l,v])=><div key={l} className="rounded-2xl border bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"><I className="size-5 text-neutral-500"/><p className="mt-5 text-sm text-neutral-500">{l}</p><p className="mt-1 text-2xl font-semibold">{Number(v).toLocaleString()}{(l.includes('revenue')||l.includes('pipeline')||l.includes('الإيرادات')||l.includes('قيمة'))?' EGP':''}</p></div>)}</div></section>;
}
