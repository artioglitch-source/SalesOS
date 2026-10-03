'use client';

import {useEffect,useMemo,useState} from 'react';
import {createClient} from '@/lib/supabase/browser';
import {useOrg} from '@/lib/org/context';

export default function AuditPage(){
 const p=typeof window!=='undefined'?window.location.pathname:'/ar/settings/audit';
 const ar=p.split('/')[1]!=='en';
 const s=useMemo(()=>createClient(),[]);
 const {activeOrgId}=useOrg();
 const [rows,setRows]=useState<any[]>([]);
 useEffect(()=>{(async()=>{if(!activeOrgId)return;const {data}=await s.from('audit_logs').select('*').eq('org_id',activeOrgId).order('created_at',{ascending:false}).limit(200);setRows(data??[])})()},[activeOrgId,s]);
 return <section className="p-4 md:p-8"><h1 className="text-2xl font-semibold">{ar?'سجل التدقيق':'Audit log'}</h1><p className="mt-1 text-sm text-neutral-500">{ar?'تغييرات السجلات الحساسة ومسارات الإدارة.':'Sensitive data changes and admin actions.'}</p><div className="mt-5 space-y-2">{rows.map(r=><div key={r.id} className="rounded-xl border bg-white p-3 text-sm dark:border-neutral-800 dark:bg-neutral-900"><div className="flex justify-between gap-3"><span className="font-medium">{r.action}</span><span className="text-xs text-neutral-500">{new Date(r.created_at).toLocaleString()}</span></div><div className="mt-1 text-xs text-neutral-500">{r.entity_type} · {r.entity_id||'—'}</div></div>)}</div></section>
}