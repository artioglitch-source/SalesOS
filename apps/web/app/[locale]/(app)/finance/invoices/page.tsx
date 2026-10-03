import {CrudPage,CrudConfig} from '@/components/data/crud-page';
const config:CrudConfig={table:'invoices',title:'Invoices',arTitle:'الفواتير',fields:[
 {key:'invoice_number',label:'Invoice #',required:true},{key:'issue_date',label:'Issue date',type:'date'},{key:'due_date',label:'Due date',type:'date'},{key:'status',label:'Status'},{key:'subtotal',label:'Subtotal',type:'number'},{key:'tax',label:'Tax',type:'number'},{key:'total',label:'Total',type:'number'},{key:'balance_due',label:'Balance due',type:'number'},{key:'currency',label:'Currency'}
],columns:[{key:'invoice_number',label:'Invoice #'},{key:'issue_date',label:'Issue'},{key:'due_date',label:'Due'},{key:'status',label:'Status'},{key:'total',label:'Total'},{key:'balance_due',label:'Balance'}]};
export default async function Invoices({params}:{params:Promise<{locale:string}>}){const {locale}=await params;return <CrudPage config={config} locale={locale==='en'?'en':'ar'}/>;}
