import {CrudPage,CrudConfig} from '@/components/data/crud-page';
const config:CrudConfig={table:'deals',title:'Deals',arTitle:'الصفقات',fields:[
 {key:'title',label:'Title',required:true},{key:'value',label:'Value',type:'number'},{key:'expected_close_date',label:'Expected close',type:'date'},{key:'currency',label:'Currency'},{key:'status',label:'Status'},{key:'loss_reason',label:'Loss reason'}
],columns:[{key:'title',label:'Title'},{key:'value',label:'Value'},{key:'expected_close_date',label:'Close date'},{key:'status',label:'Status'}]};
export default async function Deals({params}:{params:Promise<{locale:string}>}){const {locale}=await params;return <CrudPage config={config} locale={locale==='en'?'en':'ar'}/>;}
