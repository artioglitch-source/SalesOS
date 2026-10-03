import Link from 'next/link';
import {CrudPage,CrudConfig} from '@/components/data/crud-page';

const expenseConfig:CrudConfig={table:'expenses',title:'Expenses',arTitle:'المصروفات',fields:[
 {key:'category',label:'Category',required:true},{key:'amount',label:'Amount',type:'number',required:true},{key:'currency',label:'Currency'},{key:'expense_date',label:'Date',type:'date'},{key:'status',label:'Status'},{key:'description',label:'Description'}
],columns:[{key:'category',label:'Category'},{key:'amount',label:'Amount'},{key:'expense_date',label:'Date'},{key:'status',label:'Status'}]};

export default async function Finance({params}:{params:Promise<{locale:string}>}){
 const {locale}=await params;const ar=locale!=='en';
 return <section><div className="flex gap-2 border-b p-4 md:px-8"><Link className="rounded-lg bg-neutral-950 px-3 py-2 text-xs text-white dark:bg-white dark:text-neutral-950" href={'/'+locale+'/finance'}>{ar?'المصروفات':'Expenses'}</Link><Link className="rounded-lg border px-3 py-2 text-xs" href={'/'+locale+'/finance/invoices'}>{ar?'الفواتير':'Invoices'}</Link><Link className="rounded-lg border px-3 py-2 text-xs" href={'/'+locale+'/finance/payments'}>{ar?'المدفوعات':'Payments'}</Link></div><CrudPage config={expenseConfig} locale={locale==='en'?'en':'ar'}/></section>;
}
