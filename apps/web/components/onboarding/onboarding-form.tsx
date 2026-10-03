'use client';

import {FormEvent,useState} from 'react';
import {useRouter} from 'next/navigation';
import {createClient} from '@/lib/supabase/browser';

export function OnboardingForm({locale}:{locale:'ar'|'en'}) {
  const ar=locale==='ar';
  const router=useRouter();
  const [name,setName]=useState('');
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const submit=async(e:FormEvent)=>{
    e.preventDefault(); setBusy(true); setError('');
    const supabase=createClient();
    const {data,error}=await supabase.rpc('create_organization',{p_name:name});
    if(error) setError(error.message);
    else { localStorage.setItem('salesos-org',data); router.push('/'+locale); router.refresh(); }
    setBusy(false);
  };
  return <main className="flex min-h-screen items-center justify-center bg-neutral-50 p-6 dark:bg-neutral-950">
    <form onSubmit={submit} className="w-full max-w-md rounded-2xl border bg-white p-7 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <p className="text-sm text-neutral-500">SalesOS</p>
      <h1 className="mt-2 text-2xl font-semibold">{ar?'أنشئ مؤسستك':'Create your organization'}</h1>
      <p className="mt-2 text-sm text-neutral-500">{ar?'سيتم إنشاء مساحة عمل خاصة بك مع دور مالك المدير.':'We will create your private workspace as owner admin.'}</p>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder={ar?'اسم المؤسسة':'Organization name'} required className="mt-6 w-full rounded-xl border px-3 py-2.5"/>
      {error&&<p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <button disabled={busy} className="mt-4 w-full rounded-xl bg-neutral-950 px-4 py-2.5 text-white disabled:opacity-50 dark:bg-white dark:text-neutral-950">{busy?(ar?'جارٍ الإنشاء...':'Creating...'):(ar?'إنشاء المؤسسة':'Create organization')}</button>
    </form>
  </main>;
}
