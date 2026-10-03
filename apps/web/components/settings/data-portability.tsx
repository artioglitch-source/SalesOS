'use client';

import {ChangeEvent,useState} from 'react';
import {Database,Download,RotateCcw,UploadCloud} from 'lucide-react';

export function DataPortability({locale}:{locale:'ar'|'en'}){
 const ar=locale==='ar';const [busy,setBusy]=useState(false);const [message,setMessage]=useState('');
 const download=()=>{window.location.href='/api/export'};
 const restore=async(e:ChangeEvent<HTMLInputElement>)=>{
  const file=e.target.files?.[0];if(!file)return;setBusy(true);setMessage('');
  try{
   const json=JSON.parse(await file.text());
   if(!confirm(ar?'سيتم دمج البيانات المستعادة مع المؤسسة الحالية. هل تريد المتابعة؟':'Restore will merge data into the current organization. Continue?'))return;
   const r=await fetch('/api/restore',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(json)});
   const d=await r.json();setMessage(r.ok?(ar?'تمت استعادة '+d.rows+' صف.':'Restored '+d.rows+' rows.'):d.error);
  }catch(err){setMessage(err instanceof Error?err.message:'Invalid backup file')}finally{setBusy(false);e.target.value=''}
 };
 return <div className="rounded-2xl border bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"><div className="flex items-center gap-2"><Database className="size-5"/><div><h2 className="font-semibold">{ar?'النسخ الاحتياطي ونقل البيانات':'Backup & data portability'}</h2><p className="mt-1 text-xs text-neutral-500">{ar?'نسخة JSON من بيانات المؤسسة مع استعادة آمنة بالدمج.':'JSON export with safe merge restore.'}</p></div></div><div className="mt-4 flex flex-wrap gap-2"><button onClick={download} className="inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-3 py-2.5 text-sm text-white dark:bg-white dark:text-neutral-950"><Download className="size-4"/>{ar?'تنزيل نسخة':'Download backup'}</button><label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm"><UploadCloud className="size-4"/>{busy?(ar?'استعادة...':'Restoring...'):(ar?'استعادة نسخة':'Restore backup')}<input type="file" accept=".json,application/json" onChange={restore} disabled={busy} className="hidden"/></label><button type="button" onClick={()=>window.location.reload()} className="inline-flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm"><RotateCcw className="size-4"/>{ar?'تحديث':'Refresh'}</button></div>{message&&<p className="mt-3 text-sm text-neutral-500">{message}</p>}</div>
}
