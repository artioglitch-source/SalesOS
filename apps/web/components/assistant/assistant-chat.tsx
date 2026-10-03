'use client';

import {FormEvent,useState} from 'react';
import {Send,Sparkles} from 'lucide-react';

export function AssistantChat({locale}:{locale:'ar'|'en'}){
 const ar=locale==='ar';const [q,setQ]=useState('');const [answer,setAnswer]=useState<any>(null);const [busy,setBusy]=useState(false);
 const ask=async(e?:FormEvent)=>{e?.preventDefault();if(!q.trim())return;setBusy(true);const r=await fetch('/api/assistant',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({question:q,locale})});const d=await r.json();setAnswer(d);setBusy(false)};
 return <div className="max-w-3xl"><div className="flex items-center gap-2"><Sparkles className="size-5"/><h1 className="text-2xl font-semibold">{ar?'المساعد الذكي':'AI Copilot'}</h1></div><p className="mt-1 text-sm text-neutral-500">{ar?'الوضع المجاني يعمل بدون مفتاح API، ويستخدم بياناتك الآمنة.':'Free mode works without an API key and uses your protected org data.'}</p><form onSubmit={ask} className="mt-6 flex gap-2"><input value={q} onChange={e=>setQ(e.target.value)} placeholder={ar?'اسأل أي شيء عن بيانات المبيعات...':'Ask anything about your sales data...'} className="min-w-0 flex-1 rounded-xl border bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900"/><button disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-4 py-3 text-sm text-white disabled:opacity-50 dark:bg-white dark:text-neutral-950"><Send className="size-4"/>{ar?'اسأل':'Ask'}</button></form>{answer&&<div className="mt-5 rounded-2xl border bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"><div className="text-xs uppercase tracking-wide text-neutral-500">{answer.provider||'assistant'}</div><p className="mt-2 text-lg font-medium">{answer.text}</p>{answer.links?.length>0&&<div className="mt-4 flex flex-wrap gap-2">{answer.links.map((l:any)=><a key={l.href} href={'/'+locale+l.href} className="rounded-lg border px-3 py-1.5 text-xs">{l.label}</a>)}</div>}</div>}</div>;
}
