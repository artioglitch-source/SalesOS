import {CrudPage,CrudConfig} from '@/components/data/crud-page';
const config:CrudConfig={table:'webhooks',title:'Webhooks',arTitle:'Webhooks',fields:[{key:'name',label:'Name',required:true},{key:'url',label:'URL',required:true},{key:'secret',label:'Signing secret'},{key:'enabled',label:'Enabled'}],columns:[{key:'name',label:'Name'},{key:'url',label:'URL'},{key:'enabled',label:'Enabled'}]};
export default async function Webhooks({params}:{params:Promise<{locale:string}>}){const {locale}=await params;return <CrudPage config={config} locale={locale==='en'?'en':'ar'}/>;}
