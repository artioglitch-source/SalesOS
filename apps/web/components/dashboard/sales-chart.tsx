'use client';

import {useEffect,useMemo,useState} from 'react';
import {Area,AreaChart,CartesianGrid,ResponsiveContainer,Tooltip,XAxis,YAxis} from 'recharts';
import {createClient} from '@/lib/supabase/browser';
import {useOrg} from '@/lib/org/context';

export function SalesChart({locale}:{locale:'ar'|'en'}){
 const ar=locale==='ar';const supabase=useMemo(()=>createClient(),[]);const {activeOrgId}=useOrg();const [data,setData]=useState<any[]>([]);
 useEffect(()=>{(async()=>{if(!activeOrgId)return;const {data:rows}=await supabase.from('v_monthly_trend').select('period_month,sales,gp').eq('org_id',activeOrgId).order('period_month');setData((rows??[]).map(r=>({month:new Intl.DateTimeFormat(locale,{month:'short',year:'2-digit'}).format(new Date(r.period_month)),sales:Number(r.sales||0),gp:Number(r.gp||0)})))})()},[activeOrgId,supabase,locale]);
 return <div className="rounded-2xl border bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"><h2 className="font-semibold">{ar?'اتجاه المبيعات والربح الإجمالي':'Sales and gross profit trend'}</h2><p className="mt-1 text-xs text-neutral-500">{ar?'بيانات الفواتير المسجلة.':'From recorded invoices.'}</p><div className="mt-4 h-72">{data.length?<ResponsiveContainer width="100%" height="100%"><AreaChart data={data}><CartesianGrid vertical={false}/><XAxis dataKey="month"/><YAxis/><Tooltip formatter={(v)=>Number(v).toLocaleString()+' EGP'}/><Area type="monotone" dataKey="sales" fill="currentColor" fillOpacity={0.12} stroke="currentColor" strokeWidth={2}/><Area type="monotone" dataKey="gp" fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeDasharray="5 5"/></AreaChart></ResponsiveContainer>:<div className="flex h-full items-center justify-center text-sm text-neutral-500">{ar?'لا توجد بيانات كافية للرسم بعد.':'Not enough data for a chart yet.'}</div>}</div></div>
}
