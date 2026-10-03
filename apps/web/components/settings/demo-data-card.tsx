'use client';

import {useState} from 'react';
import {DatabaseZap,Play} from 'lucide-react';
import {createClient} from '@/lib/supabase/browser';

export function DemoDataCard({locale}:{locale:'ar'|'en'}){
 const ar=locale==='ar';const [busy,setBusy]=useState(false);const [message,setMessage]=useState('');
 const seed=async()=>{
  if(!confirm(ar?'سيتم إضافة بيانات تجريبية إلى المؤسسة الحالية. هل تريد المتابعة؟':'Demo records will be added to the current organization. Continue?'))return;
  setBusy(true);setMessage('');const {data,error}=await createClient().functions.invoke('seed-demo-data');
  setMessage(error?.message??(ar?'تمت إضافة '+String(data?.accounts??0)+' عملاء و'+String(data?.products??0)+' منتجات.':'Added '+String(data?.accounts??0)+' customers and '+String(data?.products??0)+' products.'));
  setBusy(false);
 };
 return <div className="rounded-2xl border bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"><div className="flex items-center gap-2"><DatabaseZap className="size-5"/><div><h2 className="font-semibold">{ar?'بيانات تجريبية':'Demo workspace'}</h2><p className="mt-1 text-xs text-neutral-500">{ar?'املأ المساحة ببيانات واقعية لاختبار اللوحات والتقارير.':'Populate realistic sample records to exercise dashboards and workflows.'}</p></div></div><button disabled={busy} onClick={seed} className="mt-4 inline-flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm disabled:opacity-50"><Play className="size-4"/>{busy?(ar?'جارٍ التحميل...':'Loading demo...'):(ar?'تحميل البيانات التجريبية':'Load demo data')}</button>{message&&<p className="mt-3 text-sm text-neutral-500">{message}</p>}</div>
}
