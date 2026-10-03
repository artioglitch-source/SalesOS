import Link from 'next/link';
import {CrudPage,CrudConfig} from '@/components/data/crud-page';

const config:CrudConfig={table:'invoices',title:'Sales',arTitle:'المبيعات والفواتير',fields:[
 {key:'invoice_number',label:'Invoice number'},{key:'issue_date',label:'Date',type:'date'},{key:'status',label:'Status'},{key:'payment_method',label:'Payment method'},{key:'currency',label:'Currency'},{key:'total',label:'Total',type:'number'}
],columns:[{key:'invoice_number',label:'Invoice #'},{key:'issue_date',label:'Date'},{key:'payment_method',label:'Payment'},{key:'status',label:'Status'},{key:'total',label:'Total'}],detailBasePath:'/sales',detailKey:'invoice_number'};

export default async function Sales({params}:{params:Promise<{locale:string}>}){const {locale}=await params;const ar=locale!=='en';return <section><div className="flex items-center justify-between gap-3 border-b p-4 md:px-8"><div><h1 className="text-lg font-semibold">{ar?'المبيعات':'Sales'}</h1></div><Link href={'/'+locale+'/sales/new'} className="rounded-xl bg-neutral-950 px-3 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-950">{ar?'بيع سريع':'Quick sale'}</Link></div><CrudPage config={config} locale={locale==='en'?'en':'ar'}/></section>}
