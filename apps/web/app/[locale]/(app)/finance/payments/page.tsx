import {CrudPage,CrudConfig} from '@/components/data/crud-page';
const config:CrudConfig={table:'payments',title:'Payments',arTitle:'المدفوعات',fields:[
 {key:'amount',label:'Amount',type:'number',required:true},{key:'currency',label:'Currency'},{key:'payment_date',label:'Payment date',type:'date'},{key:'method',label:'Method'},{key:'reference',label:'Reference'},{key:'status',label:'Status'}
],columns:[{key:'amount',label:'Amount'},{key:'payment_date',label:'Date'},{key:'method',label:'Method'},{key:'reference',label:'Reference'},{key:'status',label:'Status'}]};
export default async function Payments({params}:{params:Promise<{locale:string}>}){const {locale}=await params;return <CrudPage config={config} locale={locale==='en'?'en':'ar'}/>;}
