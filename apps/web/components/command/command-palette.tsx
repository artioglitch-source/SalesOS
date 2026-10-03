'use client';

import {useEffect,useState} from 'react';
import {useRouter,usePathname} from 'next/navigation';

const items=[['dashboard','Dashboard','/'],['sales','Sales','/sales'],['accounts','Accounts','/accounts'],['contacts','Contacts','/contacts'],['leads','Leads','/leads'],['deals','Deals','/deals'],['pipeline','Pipeline','/pipeline'],['activities','Activities','/activities'],['collections','Collections','/collections'],['targets','Targets','/targets'],['tasks','Tasks','/tasks'],['products','Products','/products'],['performance','Performance','/performance'],['kpi','KPI','/kpi'],['payroll','Payroll','/payroll'],['finance','Finance','/finance'],['hr','HR','/hr'],['reports','Reports','/reports'],['alerts','Alerts','/alerts'],['assistant','Assistant','/assistant'],['extensions','Extensions','/extensions'],['settings','Settings','/settings']] as const;

export function CommandPalette(){
 const router=useRouter();const path=usePathname();const locale=path.split('/')[1]||'ar';const [open,setOpen]=useState(false);const [q,setQ]=useState('');
 useEffect(()=>{const f=(e:KeyboardEvent)=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setOpen(v=>!v)}};window.addEventListener('keydown',f);return()=>window.removeEventListener('keydown',f)},[]);
 useEffect(()=>{if(!open)setQ('')},[open]);if(!open)return null;const filtered=items.filter(i=>i[1].toLowerCase().includes(q.toLowerCase()));
 return <div className="fixed inset-0 z-50 bg-black/40 p-4 md:p-20" onMouseDown={()=>setOpen(false)}><div className="mx-auto max-w-xl overflow-hidden rounded-2xl border bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-900" onMouseDown={e=>e.stopPropagation()}><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Search..." className="w-full border-b bg-transparent px-4 py-4 outline-none"/><div className="max-h-80 overflow-y-auto p-2">{filtered.map(i=><button key={i[0]} onClick={()=>{router.push('/'+locale+i[2]);setOpen(false)}} className="block w-full rounded-xl px-3 py-3 text-start text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800">{i[1]}</button>)}</div></div></div>
}
