'use client';
import {FormEvent,useEffect,useState} from 'react';
import Link from 'next/link';
import {BookOpen,ChevronDown,LoaderCircle,Send,Sparkles} from 'lucide-react';

const suggestions={ar:['ماذا يحتاج انتباهي اليوم؟','كم مبيعات الشهر؟','من المتأخر في السداد؟','كيف أحسب الرواتب؟'],en:['What needs my attention today?','How much sold this month?','Who is overdue?','How is payroll calculated?']};

export function SolidAiDock({locale}:{locale:'ar'|'en'}){
 const ar=locale==='ar';const [open,setOpen]=useState(false);const [q,setQ]=useState('');const [answer,setAnswer]=useState<any>(null);const [busy,setBusy]=useState(false);const [configured,setConfigured]=useState(false);
 useEffect(()=>{fetch('/api/ai/status').then(r=>r.json()).then(d=>setConfigured(Boolean(d.configured))).catch(()=>{});const key=(e:KeyboardEvent)=>{if((e.ctrlKey||e.metaKey)&&e.shiftKey&&e.key.toLowerCase()==='s'){e.preventDefault();setOpen(v=>!v)}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[]);
 const ask=async(e?:FormEvent)=>{e?.preventDefault();if(!q.trim()||busy)return;setBusy(true);setAnswer(null);try{const r=await fetch('/api/assistant',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({question:q,locale})});setAnswer(await r.json())}finally{setBusy(false)}};
 return <div className="relative">
  <button onClick={()=>setOpen(v=>!v)} className="group flex items-center gap-2 rounded-2xl border bg-white/90 px-2.5 py-2 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/90" aria-label="SOLID">
   <span className="solid-pet" aria-hidden="true"><span className="solid-ear solid-ear-a"/><span className="solid-ear solid-ear-b"/><span className="solid-face"><span className="solid-eye solid-eye-a"/><span className="solid-eye solid-eye-b"/><span className="solid-mouth"/></span><span className="solid-tail"/></span>
   <span className="hidden text-start sm:block"><strong className="block text-xs tracking-tight">SOLID</strong><span className="block text-[10px] text-neutral-400">{configured?(ar?'Gemini متصل':'Gemini connected'):(ar?'اسأل أي شيء':'Ask anything')}</span></span>
   <ChevronDown className={'size-3.5 text-neutral-400 transition '+(open?'rotate-180':'')}/>
  </button>
  {open&&<div className="absolute end-0 top-[calc(100%+10px)] z-[90] w-[min(92vw,420px)] overflow-hidden rounded-3xl border bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-950">
   <div className="border-b p-4 dark:border-neutral-800"><div className="flex items-center gap-3"><div><div className="font-semibold">SOLID</div><div className="text-[11px] text-neutral-500">{configured?(ar?'مدعوم بـ Gemini':'Powered by Gemini'):(ar?'الوضع المحلي المجاني':'Free local mode')}</div></div><Link href={'/'+locale+'/help'} className="ms-auto rounded-xl border p-2"><BookOpen className="size-4"/></Link></div></div>
   <div className="space-y-2 p-3">{suggestions[locale].map(s=><button key={s} onClick={()=>setQ(s)} className="w-full rounded-xl border px-3 py-2.5 text-start text-xs hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900">{s}</button>)}</div>
   <form onSubmit={ask} className="border-t p-3 dark:border-neutral-800"><div className="flex gap-2"><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder={ar?'اسأل SOLID...':'Ask SOLID...'} className="min-w-0 flex-1 rounded-xl border bg-neutral-50 px-3 py-3 text-sm outline-none dark:border-neutral-800 dark:bg-neutral-900"/><button disabled={busy} className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-neutral-950 text-white disabled:opacity-50 dark:bg-white dark:text-neutral-950">{busy?<LoaderCircle className="size-4 animate-spin"/>:<Send className="size-4"/>}</button></div></form>
   {answer&&<div className="border-t p-4 dark:border-neutral-800"><div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-400"><Sparkles className="size-3"/>{answer.mode==='real'?(ar?'Gemini الحقيقي':'Real Gemini'):(ar?'محلي':'Local')}</div><p className="mt-2 whitespace-pre-wrap text-sm leading-6">{answer.text||answer.error}</p></div>}
  </div>}
 </div>;
}