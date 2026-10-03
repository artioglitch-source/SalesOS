'use client';

import {FormEvent,useEffect,useState} from 'react';
import Link from 'next/link';
import {createClient} from '@/lib/supabase/browser';
import {useOrg} from '@/lib/org/context';

export default function Settings(){
 const path=typeof window!=='undefined'?window.location.pathname:'/ar/settings';const locale=path.split('/')[1]||'ar';const ar=locale!=='en';const {activeOrgId}=useOrg();const supabase=createClient();
 const [v,setV]=useState({locale:'ar',timezone:'Africa/Cairo',default_currency:'EGP',daily_target:'0',monthly_target:'0'});const [flags,setFlags]=useState<any[]>([]);const [saved,setSaved]=useState(false);
 useEffect(()=>{(async()=>{if(!activeOrgId)return;const {data}=await supabase.from('org_settings').select('*').eq('org_id',activeOrgId).maybeSingle();if(data)setV({locale:data.locale,timezone:data.timezone,default_currency:data.default_currency,daily_target:String(data.daily_target),monthly_target:String(data.monthly_target)});const {data:f}=await supabase.from('feature_flags').select('*').eq('org_id',activeOrgId).order('key');setFlags(f??[])})()},[activeOrgId]);
 const save=async(e:FormEvent)=>{e.preventDefault();if(!activeOrgId)return;await supabase.from('org_settings').upsert({org_id:activeOrgId,...v,daily_target:Number(v.daily_target),monthly_target:Number(v.monthly_target)});setSaved(true);setTimeout(()=>setSaved(false),2000)};
 const toggle=async(key:string,enabled:boolean)=>{if(!activeOrgId)return;await supabase.from('feature_flags').upsert({org_id:activeOrgId,key,enabled});setFlags(fs=>fs.map(f=>f.key===key?{...f,enabled}:f))};
 return <section className="p-4 md:p-8"><div className="flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-2xl font-semibold">{ar?'الإعدادات':'Settings'}</h1><p className="mt-1 text-sm text-neutral-500">{ar?'إعدادات المؤسسة والأساس التشغيلي.':'Organization and operating settings.'}</p></div><Link href={'/'+locale+'/settings/audit'} className="rounded-xl border px-3 py-2 text-sm">{ar?'سجل التدقيق':'Audit log'}</Link></div>
 <div className="mt-6 max-w-3xl space-y-4"><form onSubmit={save} className="space-y-4 rounded-2xl border bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
 <label className="block text-sm"><span className="mb-1 block">Locale / اللغة</span><select value={v.locale} onChange={e=>setV({...v,locale:e.target.value})} className="w-full rounded-xl border px-3 py-2.5 bg-transparent"><option value="ar">العربية</option><option value="en">English</option></select></label>
 <label className="block text-sm"><span className="mb-1 block">Timezone</span><input value={v.timezone} onChange={e=>setV({...v,timezone:e.target.value})} className="w-full rounded-xl border px-3 py-2.5 bg-transparent"/></label>
 <div className="grid gap-4 sm:grid-cols-3"><label className="text-sm"><span className="mb-1 block">Currency</span><input value={v.default_currency} onChange={e=>setV({...v,default_currency:e.target.value.toUpperCase()})} className="w-full rounded-xl border px-3 py-2.5 bg-transparent"/></label><label className="text-sm"><span className="mb-1 block">Daily target</span><input type="number" value={v.daily_target} onChange={e=>setV({...v,daily_target:e.target.value})} className="w-full rounded-xl border px-3 py-2.5 bg-transparent"/></label><label className="text-sm"><span className="mb-1 block">Monthly target</span><input type="number" value={v.monthly_target} onChange={e=>setV({...v,monthly_target:e.target.value})} className="w-full rounded-xl border px-3 py-2.5 bg-transparent"/></label></div>
 <button className="rounded-xl bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-neutral-950">{ar?'حفظ الإعدادات':'Save settings'}</button>{saved&&<span className="ms-3 text-sm text-emerald-600">{ar?'تم الحفظ':'Saved'}</span>}
 </form>
 <div className="rounded-2xl border bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"><h2 className="font-semibold">{ar?'مفاتيح الميزات':'Feature flags'}</h2><div className="mt-4 space-y-3">{flags.map(f=><label key={f.key} className="flex items-center justify-between rounded-xl border p-3 dark:border-neutral-800"><span className="text-sm">{f.key}</span><input type="checkbox" checked={!!f.enabled} onChange={e=>toggle(f.key,e.target.checked)} className="size-4"/></label>)}</div></div></div></section>;
}
