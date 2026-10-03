'use client';

import {useEffect,useMemo,useState} from 'react';
import {Bar,BarChart,CartesianGrid,ResponsiveContainer,Tooltip,XAxis,YAxis} from 'recharts';
import {createClient} from '@/lib/supabase/browser';
import {useOrg} from '@/lib/org/context';

export function PipelineChart({locale}:{locale:'ar'|'en'}){
 const ar=locale==='ar';const s=useMemo(()=>createClient() as any,[]);const {activeOrgId}=useOrg();const [rows,setRows]=useState<any[]>([]);
 useEffect(()=>{(async()=>{if(!activeOrgId)return;const {data}=await s.from('v_pipeline').select('*').eq('org_id',activeOrgId);setRows(data??[])})()},[activeOrgId,s]);
 return <div className="rounded-2xl border bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"><div><h2 className="font-semibold">{ar?'قيمة خط المبيعات':'Pipeline by stage'}</h2><p className="mt-1 text-xs text-neutral-500">{ar?'توزيع الفرص المفتوحة حسب المرحلة.':'Opportunity value by stage.'}</p></div><div className="mt-4 h-64">{rows.length?<ResponsiveContainer width="100%" height="100%"><BarChart data={rows}><CartesianGrid vertical={false}/><XAxis dataKey="stage"/><YAxis/><Tooltip formatter={(v)=>Number(v).toLocaleString()+' EGP'}/><Bar dataKey="total_value" fill="currentColor" radius={[8,8,0,0]}/></BarChart></ResponsiveContainer>:<div className="flex h-full items-center justify-center text-sm text-neutral-500">{ar?'أضف فرصاً لتظهر هنا.':'Add opportunities to see the pipeline.'}</div>}</div></div>
}
