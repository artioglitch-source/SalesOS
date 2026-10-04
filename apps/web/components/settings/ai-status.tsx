'use client';

import {useEffect,useState} from 'react';
import {Bot,ExternalLink,KeyRound,ShieldCheck} from 'lucide-react';

export function AIStatus({locale}:{locale:'ar'|'en'}){
  const ar=locale==='ar';
  const [configured,setConfigured]=useState(false);
  const [model,setModel]=useState<string|null>(null);

  useEffect(()=>{
    fetch('/api/ai/status',{cache:'no-store'})
      .then(r=>r.json())
      .then(d=>{setConfigured(Boolean(d.configured));setModel(d.model||null)})
      .catch(()=>undefined);
  },[]);

  return <div className="salesos-card rounded-2xl border p-5">
    <div className="flex items-start gap-3">
      <div className="rounded-xl p-2.5" style={{background:'var(--accent-soft)',color:'var(--accent)'}}><Bot className="size-5"/></div>
      <div className="min-w-0 flex-1">
        <h2 className="font-semibold">{ar?'الذكاء الاصطناعي الحقيقي':'Real AI'}</h2>
        <p className="mt-1 text-xs leading-5 text-neutral-500">{ar?'عند ضبط المفتاح على الخادم يتحول Notch AI إلى نموذج لغوي حقيقي.':'When the server key is configured, Notch AI uses a real language model.'}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
          <span className="rounded-full border px-2.5 py-1">{configured?(ar?'مفعل':'Configured'):(ar?'وضع محلي':'Local mode')}</span>
          {model&&<span className="rounded-full border px-2.5 py-1">{model}</span>}
        </div>
      </div>
    </div>
    <div className="mt-4 grid gap-3 md:grid-cols-3">
      <div className="rounded-xl border p-3 text-xs"><KeyRound className="size-4"/><div className="mt-2 font-medium">AI_API_KEY</div><p className="mt-1 text-neutral-500">Server-only secret.</p></div>
      <div className="rounded-xl border p-3 text-xs"><Bot className="size-4"/><div className="mt-2 font-medium">AI_MODEL</div><p className="mt-1 text-neutral-500">Example: gpt-5.6-luna.</p></div>
      <div className="rounded-xl border p-3 text-xs"><ShieldCheck className="size-4"/><div className="mt-2 font-medium">Keep it private</div><p className="mt-1 text-neutral-500">Never use a NEXT_PUBLIC secret.</p></div>
    </div>
    <a href="https://platform.openai.com/docs/quickstart" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-xs" style={{color:'var(--accent)'}}><ExternalLink className="size-3"/>Open AI quickstart</a>
  </div>
}