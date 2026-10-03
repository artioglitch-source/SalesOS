import {CrudPage,CrudConfig} from '@/components/data/crud-page';
const config:CrudConfig={table:'contacts',title:'Contacts',arTitle:'جهات الاتصال',fields:[
 {key:'first_name',label:'First name',required:true},{key:'last_name',label:'Last name'},{key:'title',label:'Title'},{key:'phone',label:'Phone'},{key:'email',label:'Email'},{key:'whatsapp',label:'WhatsApp'}
],columns:[{key:'first_name',label:'First name'},{key:'last_name',label:'Last name'},{key:'title',label:'Title'},{key:'phone',label:'Phone'},{key:'email',label:'Email'}]};
export default async function Contacts({params}:{params:Promise<{locale:string}>}){const {locale}=await params;return <CrudPage config={config} locale={locale==='en'?'en':'ar'}/>;}
