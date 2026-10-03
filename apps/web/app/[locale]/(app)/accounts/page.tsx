import {CrudPage,CrudConfig} from '@/components/data/crud-page';

const config:CrudConfig={table:'accounts',title:'Accounts',arTitle:'الحسابات',fields:[
 {key:'name',label:'Name',required:true},{key:'industry',label:'Industry'},{key:'phone',label:'Phone'},{key:'email',label:'Email'},{key:'status',label:'Status'}
],columns:[{key:'name',label:'Name'},{key:'industry',label:'Industry'},{key:'phone',label:'Phone'},{key:'email',label:'Email'},{key:'status',label:'Status'}]};

export default async function Accounts({params}:{params:Promise<{locale:string}>}){const {locale}=await params;return <CrudPage config={config} locale={locale==='en'?'en':'ar'}/>;}
