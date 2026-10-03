'use client';

import {useEffect,useMemo,useState} from 'react';
import {Download,RefreshCw} from 'lucide-react';
import {createClient} from '@/lib/supabase/browser';
import {useOrg} from '@/lib/org/context';
import {Card,EmptyState,PageHeader} from '@/components/ui/primitives';

type Kind='daily'|'weekly'|'category';

export function OperationalReports({locale,kind}:{locale:'ar'|'en';kind:Kind}){
 const ar=locale==='ar';const s=useMemo(()=>createClient() as any,[]);const {activeOrgId}=useOrg();const [rows,setRows]=useState<any[]>([]);const [loading,setLoading]=useState(true);
 const load=async()=>{if(!activeOrgId)return;setLoading(true);if(kind==='daily'){const {data}=await s.from('daily_reports').select('*').eq('org_id',activeOrgId).order('report_date',{ascending:false}).limit(60);setRows(data||[])}else if(kind==='weekly'){const {data}=await s.from('weekly_plans').select('*').eq('org_id',activeOrgId).order('week_start',{ascending:false}).limit(30);setRows(data||[])}else{const {data}=await s.from('category_plans').select('*').eq('org_id',activeOrgId).order('period',{ascending:false}).limit(30);setRows(data||[])}setLoading(false)};
 useEffect(()=>{load()},[activeOrgId,s,kind]);
 const title=kind==='daily'?(ar?'التقارير اليومية':'Daily reports'):kind==='weekly'?(ar?'الخطة الأسبوعية':'Weekly plans'):(ar?'خطة الأصناف':'Category plans');
 const description=kind==='daily'?(ar?'نتيجة اليوم: المبيعات، الزيارات، التحصيل، أهم فرصة ومشكلة والخطوة التالية.':'Daily result: sales, visits, collections, top opportunity, top problem, and next action.'):kind==='weekly'?(ar?'خطة أسبوعية مرتبطة بالهدف والمبيعات والعملاء الجدد.':'Weekly plan tied to sales and new-customer targets.'):ar?'ربط أهداف الأصناف بعدد العملاء وخطة التنشيط.':'Tie category targets to customer counts and activation plans.';
 const exportCsv=()=>{const headers=rows.length?Object.keys(rows[0]).slice(0,12):[];const body=[headers.join(','),...rows.map(r=>headers.map(h=>JSON.stringify(r[h]??'')).join(','))].join('\n');const blob=new Blob([body],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='salesos-'+kind+'-report.csv';a.click();URL.revokeObjectURL(a.href)};
 return <section className="space-y-6 p-4 md:p-7"><PageHeader eyebrow={ar?'التقارير':'Reports'} title={title} description={description} actions={<><button onClick={load} className="rounded-xl border px-3 py-2.5 text-sm"><RefreshCw className="me-2 inline size-4"/>{ar?'تحديث':'Refresh'}</button><button onClick={exportCsv} className="rounded-xl bg-neutral-950 px-3 py-2.5 text-sm text-white dark:bg-white dark:text-neutral-950"><Download className="me-2 inline size-4"/>{ar?'تصدير CSV':'Export CSV'}</button></>}/><Card className="overflow-hidden"><div className="overflow-x-auto">{loading?<div className="p-10 text-center text-sm text-neutral-500">{ar?'جاري التحميل...':'Loading...'}</div>:rows.length?<table className="min-w-full text-sm"><thead className="border-b bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950"><tr>{Object.keys(rows[0]).slice(0,8).map(k=><th key={k} className="px-4 py-3 text-start">{k.replaceAll('_',' ')}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={r.id||i} className="border-b last:border-0 dark:border-neutral-800">{Object.keys(rows[0]).slice(0,8).map(k=><td key={k} className="max-w-64 px-4 py-3">{String(r[k]??'—')}</td>)}</tr>)}</tbody></table>:<EmptyState title={ar?'لا توجد سجلات':'No records'} description={ar?'أنشئ أول سجل تشغيلي وسيظهر هنا.':'Create the first operational record and it will appear here.'}/>}</div></Card></section>
}
