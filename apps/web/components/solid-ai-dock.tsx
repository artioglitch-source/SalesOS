'use client';
import {FormEvent,useState} from 'react';
import Link from 'next/link';
import {ArrowUpRight,CheckCircle2,LoaderCircle,Sparkles} from 'lucide-react';

const suggestions={ar:['ما الذي يحتاج انتباهي اليوم؟','كم مبيعات هذا الشهر؟','من المتأخر في السداد؟','كيف أحسب الرواتب؟'],en:['What needs my attention today?','How much did we sell this month?','Who is overdue?','How do I calculate payroll?']};

export function SolidAiDock({locale}:{locale:'ar'|'en'}){
 const ar=locale==='ar';const [q,setQ]=useState('');const [answer,setAnswer]=useState<any>(null);const [busy,setBusy]=useState(false);
 const ask=async(e?:FormEvent)=>{e?.preventDefault();if(!q.trim()||busy)return;setBusy(true);setAnswer(null);try{
  const r=await fetch('/api/assistant',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({question:q,locale})});
  const raw=await r.text();let d:any;try{d=JSON.parse(raw)}catch{d={error:ar?'الخادم أعاد استجابة غير قابلة للقراءة. تحقق من إعداد Gemini API.':'The server returned a non-JSON response. Check the Gemini API setup.'}};
  setAnswer(r.ok?d:{error:d.error||('HTTP '+r.status)});
 }catch(e){setAnswer({error:e instanceof Error?e.message:'Request failed'})}finally{setBusy(false)}};
 return <div className="border-b border-neutral-200 bg-white/95 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/95">
  <div className="mx-auto flex max-w-[1800px] flex-col gap-2 px-3 py-2 md:px-7 lg:flex-row lg:items-center">
   <div className="flex shrink-0 items-center gap-2"><span className="flex size-8 items-center justify-center rounded-lg border"><Sparkles className="size-4"/></span><div><div className="text-xs font-semibold">Solid</div><div className="text-[10px] text-neutral-500">{ar?'مساعد العمل داخل SalesOS':'Your SalesOS work copilot'}</div></div></div>
   <form onSubmit={ask} className="flex min-w-0 flex-1 items-center gap-2"><input value={q} onChange={e=>setQ(e.target.value)} placeholder={ar?'اسأل Solid عن المبيعات أو الموظفين أو الرواتب أو أي شاشة...':'Ask Solid about sales, staff, payroll, or any screen...'} className="min-w-0 flex-1 rounded-xl border bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-neutral-300 dark:border-neutral-800 dark:bg-neutral-900"/><button disabled={busy||!q.trim()} className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-neutral-950 px-3.5 py-2.5 text-xs font-medium text-white disabled:opacity-40 dark:bg-white dark:text-neutral-950">{busy?<LoaderCircle className="size-4 animate-spin"/>:<Sparkles className="size-4"/>}{busy?(ar?'يفكر':'Thinking'):(ar?'اسأل':'Ask')}</button></form>
   <Link href={'/'+locale+'/assistant'} className="hidden shrink-0 items-center gap-1 rounded-xl border px-3 py-2.5 text-xs lg:inline-flex">{ar?'فتح Solid الكامل':'Open full Solid'}<ArrowUpRight className="size-3"/></Link>
  </div>
  <div className="mx-auto flex max-w-[1800px] gap-2 overflow-x-auto px-3 pb-2 md:px-7">{suggestions[locale].map(s=><button key={s} type="button" onClick={()=>setQ(s)} className="whitespace-nowrap rounded-full border px-3 py-1.5 text-[11px] text-neutral-500 hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-900">{s}</button>)}</div>
  {answer&&<div className="mx-auto max-w-[1800px] px-3 pb-3 md:px-7"><div className="rounded-xl border bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">{answer.error?<span className="text-sm text-red-600">{answer.error}</span>:<div className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600"/><div className="min-w-0 flex-1"><div className="whitespace-pre-wrap text-sm leading-6">{answer.text}</div>{answer.links?.length>0&&<div className="mt-2 flex flex-wrap gap-2">{answer.links.map((l:any)=><Link key={l.href} href={'/'+locale+l.href} className="rounded-lg border px-2.5 py-1 text-[11px]">{l.label}</Link>)}</div>}</div></div>}</div></div>}
 </div>;
}