'use client';

import {FormEvent,useEffect,useState} from 'react';
import {createClient} from '@/lib/supabase/browser';
import {useOrg} from '@/lib/org/context';

export default function Settings(){
 const path=typeof window!=='undefined'?window.location.pathname:'/ar/settings';const ar=path.split('/')[1]!=='en';const {activeOrgId}=useOrg();const supabase=createClient();
 const [v,setV]=useState({locale:'ar',timezone:'Africa/Cairo',default_currency:'EGP',daily_target:'0',monthly_target:'0'});const [saved,setSaved]=useState(false);
 useEffect(()=>{(async()=>{if(!activeOrgId)return;const {data}=await supabase.from('org_settings').select('*').eq('org_id',activeOrgId).maybeSingle();if(data)setV({locale:data.locale,timezone:data.timezone,default_currency:data.default_currency,daily_target:String(data.daily_target),monthly_target:String(data.monthly_target)})})()},[activeOrgId]);
 const save=async(e:FormEvent)=>{e.preventDefault();if(!activeOrgId)return;await supabase.from('org_settings').upsert({org_id:activeOrgId,...v,daily_target:Number(v.daily_target),monthly_target:Number(v.monthly_target)});setSaved(true);setTimeout(()=>setSaved(false),2000)};
 return <section className="p-4 md:p-8"><div className="max-w-2xl"><h1 className="text-2xl font-semibold">{ar?'الإعدادات':'Settings'}</h1><p className="mt-1 text-sm text-neutral-500">{ar?'إعدادات المؤسسة الأساسية.':'Core organization settings.'}</p><form onSubmit={save} className="mt-6 space-y-4 rounded-2xl border bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
 <label className="block text-sm"><span className="mb-1 block">Locale / اللغة</span><select value={v.locale} onChange={e=>setV({...v,locale:e.target.value})} className="w-full rounded-xl border px-3 py-2.5 bg-transparent"><option value="ar">العربية</option><option value="en">English</option></select></label>
 <label className="block text-sm"><span className="mb-1 block">Timezone</span><input value={v.timezone} onChange={e=>setV({...v,timezone:e.target.value})} className="w-full rounded-xl border px-3 py-2.5 bg-transparent"/></label>
 <div className="grid gap-4 sm:grid-cols-3"><label className="text-sm"><span className="mb-1 block">Currency</span><input value={v.default_currency} onChange={e=>setV({...v,default_currency:e.target.value.toUpperCase()})} className="w-full rounded-xl border px-3 py-2.5 bg-transparent"/></label><label className="text-sm"><span className="mb-1 block">Daily target</span><input type="number" value={v.daily_target} onChange={e=>setV({...v,daily_target:e.target.value})} className="w-full rounded-xl border px-3 py-2.5 bg-transparent"/></label><label className="text-sm"><span className="mb-1 block">Monthly target</span><input type="number" value={v.monthly_target} onChange={e=>setV({...v,monthly_target:e.target.value})} className="w-full rounded-xl border px-3 py-2.5 bg-transparent"/></label></div>
 <button className="rounded-xl bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-neutral-950">{ar?'حفظ الإعدادات':'Save settings'}</button>{saved&&<span className="ms-3 text-sm text-emerald-600">{ar?'تم الحفظ':'Saved'}</span>}
 </form></div></section>;
}
