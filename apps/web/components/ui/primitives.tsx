'use client';

import {ReactNode} from 'react';

export function PageHeader({eyebrow,title,description,actions}:{eyebrow?:string;title:string;description?:string;actions?:ReactNode}){
 return <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-400">{eyebrow}</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">{title}</h1>{description&&<p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">{description}</p>}</div>{actions&&<div className="flex flex-wrap gap-2">{actions}</div>}</div>;
}

export function Card({children,className=''}:{children:ReactNode;className?:string}){return <div className={"rounded-2xl border border-neutral-200/80 bg-white dark:border-neutral-800 dark:bg-neutral-900 "+className}>{children}</div>;}

export function MetricCard({label,value,sub,icon,href,trend}:{label:string;value:string|number;sub?:string;icon?:ReactNode;href?:string;trend?:string}){
 const body=<div className="p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-medium uppercase tracking-wide text-neutral-400">{label}</p><div className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">{value}</div>{sub&&<p className="mt-1 text-xs text-neutral-500">{sub}</p>}</div>{icon&&<div className="rounded-xl border border-neutral-200 p-2.5 text-neutral-500 dark:border-neutral-800">{icon}</div>}</div>{trend&&<div className="mt-4 text-xs text-neutral-500">{trend}</div>}</div>;
 return href?<a href={href} className="block transition hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-sm">{body}</a>:<div>{body}</div>;
}

export function StatusPill({status}:{status:string}){
 const s=status.toLowerCase();const cls=s.includes('exceed')||s.includes('good')||s==='won'||s==='paid'||s==='ok'||s==='active'?'border-emerald-200 bg-emerald-50 text-emerald-700':s.includes('action')||s.includes('risk')||s==='lost'||s==='overdue'?'border-red-200 bg-red-50 text-red-700':'border-amber-200 bg-amber-50 text-amber-700';
 return <span className={"inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium "+cls}>{status}</span>;
}

export function EmptyState({title,description,action}:{title:string;description:string;action?:ReactNode}){return <div className="flex flex-col items-center justify-center px-6 py-14 text-center"><div className="rounded-2xl border border-dashed p-4 text-neutral-400">∅</div><h3 className="mt-4 font-medium">{title}</h3><p className="mt-1 max-w-md text-sm text-neutral-500">{description}</p>{action&&<div className="mt-4">{action}</div>}</div>;}
