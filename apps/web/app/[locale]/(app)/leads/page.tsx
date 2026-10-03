import {CrudPage,CrudConfig} from '@/components/data/crud-page';
const config:CrudConfig={table:'leads',title:'Leads',arTitle:'العملاء المحتملون',fields:[
 {key:'name',label:'Name',required:true},{key:'company',label:'Company'},{key:'email',label:'Email'},{key:'phone',label:'Phone'},{key:'source',label:'Source'},{key:'status',label:'Status'},{key:'score',label:'Score',type:'number'},{key:'expected_value',label:'Expected value',type:'number'}
],columns:[{key:'name',label:'Name'},{key:'company',label:'Company'},{key:'source',label:'Source'},{key:'status',label:'Status'},{key:'score',label:'Score'},{key:'expected_value',label:'Value'}]};
export default async function Leads({params}:{params:Promise<{locale:string}>}){const {locale}=await params;return <CrudPage config={config} locale={locale==='en'?'en':'ar'}/>;}
