'use client';

import {useState} from 'react';
import Link from 'next/link';
import {Plus,X,Receipt,Wallet,MapPin,FileText,Building2} from 'lucide-react';

export function QuickAdd({locale}:{locale:'ar'|'en'}){
 const ar=locale==='ar';const [open,setOpen]=useState(false);
 const items=[
  {href:'/sales/new',label:ar?'بيع سريع':'Quick sale',icon:Receipt},
  {href:'/collections',label:ar?'تحصيل':'Collection',icon:Wallet},
  {href:'/activities/new',label:ar?'زيارة / متابعة':'Visit / follow-up',icon:MapPin},
  {href:'/pipeline/new',label:ar?'عرض سعر':'Quote',icon:FileText},
  {href:'/accounts',label:ar?'عميل جديد':'New customer',icon:Building2},
 ];
 return <div className="fixed bottom-20 end-5 z-40 md:bottom-6">{open&&<div className="mb-3 w-60 rounded-2xl border bg-white p-2 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">{items.map(({href,label,icon:Icon})=><Link key={href} onClick={()=>setOpen(false)} href={'/'+locale+href} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"><span className="rounded-lg border p-2"><Icon className="size-4"/></span>{label}</Link>)}</div>}<button onClick={()=>setOpen(v=>!v)} aria-label={ar?'إضافة سريعة':'Quick add'} className="flex size-14 items-center justify-center rounded-full bg-neutral-950 text-white shadow-lg transition hover:scale-105 dark:bg-white dark:text-neutral-950">{open?<X className="size-6"/>:<Plus className="size-6"/>}</button></div>;
}
