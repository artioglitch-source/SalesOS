'use client';

import {useEffect,useMemo,useState} from 'react';
import Link from 'next/link';
import {Plus,ChevronRight} from 'lucide-react';
import {createClient} from '@/lib/supabase/browser';
import {useOrg} from '@/lib/org/context';

const stageFallback=[['Prospecting',10],['Qualification',30],['Proposal',60],['Negotiation',80],['Won',100],['Lost',0]] as const;

export default function Pipeline(){
 const p=typeof window!=='undefined'?window.location.pathname:'/ar/pipeline';const locale=p.split('/')[1]||'ar';const ar=locale!=='en';const s=useMemo(()=>createClient(),[]);const {activeOrgId}=useOrg();const [stages,setStages]=useState<any[]>([]);const [deals,setDeals]=useState<any[]>([]);
 const load=async()=>{if(!activeOrgId)return;const [{data:st},{data:d}]=await Promise.all([s.from('pipeline_stages').select('*').eq('org_id',activeOrgId).order('stage_order'),s.from('deals').select('*').eq('org_id',activeOrgId).order('value',{ascending:false})]);setStages(st?.length?st:stageFallback.map(([name,probability],i)=>({id:name,name,probability,stage_order:i+1,is_closed:name==='Won'||name==='Lost'})));setDeals(d??[])};
 useEffect(()=>{load()},[activeOrgId,s]);
 const move=async(id:string,stageId:string)=>{if(!activeOrgId)return;await s.from('deals').update({stage_id:stageId,status:['Won','Lost'].includes(String(stages.find(x=>x.id===stageId)?.name))?'closed':'open'}).eq('id',id).eq('org_id',activeOrgId);await load()};
 return <section className="p-4 md:p-8"><div className="mb-5 flex items-end justify-between gap-3"><div><h1 className="text-2xl font-semibold">{ar?'لوحة خط الأنابيب':'Pipeline board'}</h1><p className="mt-1 text-sm text-neutral-500">{ar?'حرك الفرص بين المراحل وتابع القيمة.':'Move opportunities between stages and track value.'}</p></div><Link href={'/'+locale+'/pipeline/new'} className="inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-3 py-2 text-sm text-white dark:bg-white dark:text-neutral-950"><Plus className="size-4"/>{ar?'عرض سعر':'New quote'}</Link></div><div className="grid gap-4 overflow-x-auto xl:grid-cols-6">{stages.map(st=>{const cards=deals.filter(d=>d.stage_id===st.id);const value=cards.reduce((n,d)=>n+Number(d.value||0),0);return <div key={st.id} className="min-w-64 rounded-2xl border bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900"><div className="flex items-center justify-between"><div><div className="font-semibold">{st.name}</div><div className="text-xs text-neutral-500">{cards.length} · {value.toLocaleString()} EGP</div></div><span className="text-xs text-neutral-500">{st.probability}%</span></div><div className="mt-3 space-y-2">{cards.map(d=><div key={d.id} className="rounded-xl border p-3 dark:border-neutral-800"><div className="font-medium">{d.title}</div><div className="mt-1 text-sm">{Number(d.value||0).toLocaleString()} EGP</div><div className="mt-2 flex gap-1 overflow-x-auto">{stages.filter(x=>x.name!==st.name).slice(0,3).map(x=><button key={x.id} onClick={()=>move(d.id,x.id)} className="shrink-0 rounded-lg border px-2 py-1 text-[11px]"><ChevronRight className="inline size-3"/>{x.name}</button>)}</div></div>)}</div></div>})}</div></section>
}
