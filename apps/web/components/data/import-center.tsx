'use client';

import {useMemo,useState} from 'react';
import {CheckCircle2,FileUp,UploadCloud} from 'lucide-react';
import {createClient} from '@/lib/supabase/browser';
import {useOrg} from '@/lib/org/context';
import {Card,EmptyState,PageHeader,StatusPill} from '@/components/ui/primitives';

type Entity='accounts'|'contacts'|'products'|'leads';

const mapHeaders=(headers:string[])=>Object.fromEntries(headers.map((h,i)=>[h.trim().toLowerCase().replace(/\s+/g,'_'),i]));

export default function ImportCenter({locale}:{locale:'ar'|'en'}){
 const ar=locale==='ar';const s=useMemo(()=>createClient() as any,[]);const {activeOrgId}=useOrg();const [entity,setEntity]=useState<Entity>('accounts');const [rows,setRows]=useState<string[][]>([]);const [status,setStatus]=useState('');const [busy,setBusy]=useState(false);
 const parse=async(file:File)=>{setStatus('');const text=await file.text();setRows(text.split(/\r?\n/).filter(Boolean).map(line=>line.split(',').map(x=>x.trim())).slice(0,501))};
 const commit=async()=>{if(!activeOrgId||rows.length<2)return;setBusy(true);setStatus('');const h=mapHeaders(rows[0]);const data=rows.slice(1);
 let payload:any[]=[];
 if(entity==='accounts')payload=data.map(r=>({org_id:activeOrgId,name:r[h.name]||r[h.customer]||'',phone:r[h.phone]||null,email:r[h.email]||null,industry:r[h.industry]||null,classification:r[h.classification]||null,status:'active'})).filter(x=>x.name);
 if(entity==='contacts')payload=data.map(r=>({org_id:activeOrgId,first_name:r[h.first_name]||r[h.name]||'',last_name:r[h.last_name]||null,email:r[h.email]||null,phone:r[h.phone]||null,title:r[h.title]||null})).filter(x=>x.first_name);
 if(entity==='products')payload=data.map(r=>({org_id:activeOrgId,name:r[h.name]||r[h.product]||'',sku:r[h.sku]||null,code:r[h.code]||null,unit_price:Number(r[h.unit_price]||r[h.price]||0),tax_rate:Number(r[h.tax_rate]||0),active:true})).filter(x=>x.name);
 if(entity==='leads')payload=data.map(r=>({org_id:activeOrgId,name:r[h.name]||'',company:r[h.company]||null,email:r[h.email]||null,phone:r[h.phone]||null,source:r[h.source]||'import',status:'new',expected_value:Number(r[h.expected_value]||0)})).filter(x=>x.name);
 const result=payload.length?await s.from(entity).insert(payload):{error:{message:'No valid rows'}};
 setStatus(result.error?result.error.message:(ar?'تم استيراد '+payload.length+' سجل بنجاح.':'Imported '+payload.length+' records successfully.'));setBusy(false);
 };
 return <section className="space-y-6 p-4 md:p-7"><PageHeader eyebrow={ar?'البيانات':'Data'} title={ar?'مركز الاستيراد':'Import center'} description={ar?'معاينة ملفات CSV ثم اعتماد الحسابات، جهات الاتصال، المنتجات أو العملاء المحتملين.':'Preview CSV files and commit accounts, contacts, products, or leads.'}/><Card className="p-5"><div className="grid gap-3 md:grid-cols-3"><select value={entity} onChange={e=>{setEntity(e.target.value as Entity);setRows([]);setStatus('')}} className="rounded-xl border bg-transparent px-3 py-2.5"><option value="accounts">Accounts</option><option value="contacts">Contacts</option><option value="products">Products</option><option value="leads">Leads</option></select><label className="flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm"><FileUp className="size-4"/><span>{ar?'اختر CSV':'Choose CSV'}</span><input type="file" accept=".csv,text/csv" className="hidden" onChange={e=>{const f=e.target.files?.[0];if(f)void parse(f)}}/></label><button disabled={busy||rows.length<2} onClick={commit} className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-950 px-4 py-2.5 text-sm text-white disabled:opacity-50 dark:bg-white dark:text-neutral-950"><UploadCloud className="size-4"/>{ar?'اعتماد':'Commit'}</button></div>{rows.length>0&&<div className="mt-5 overflow-x-auto"><table className="min-w-full text-xs"><tbody>{rows.slice(0,8).map((row,i)=><tr key={i} className="border-b last:border-0 dark:border-neutral-800">{row.slice(0,8).map((cell,j)=><td key={j} className={"whitespace-nowrap px-3 py-2 "+(i===0?'font-semibold bg-neutral-50 dark:bg-neutral-950':'')}>{cell||'—'}</td>)}</tr>)}</tbody></table></div>}{status&&<div className="mt-4 flex items-center gap-2 rounded-xl border p-3 text-sm"><CheckCircle2 className="size-4"/><StatusPill status={status.includes('successfully')||status.includes('بنجاح')?'ok':'review'}/>{status}</div>}{rows.length===0&&<EmptyState title={ar?'لم تختر ملفاً':'No file selected'} description={ar?'CSV فقط في هذا التدفق الأولي؛ استيراد Excel يمكن تحويله إلى CSV بسهولة.':'CSV is supported in this streamlined flow; Excel can be exported as CSV first.'}/>}</Card></section>
}
