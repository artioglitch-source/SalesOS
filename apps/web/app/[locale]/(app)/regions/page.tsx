import {CrudPage,CrudConfig} from '@/components/data/crud-page';
const config:CrudConfig={table:'regions',title:'Regions',arTitle:'المناطق',fields:[{key:'name',label:'Name',required:true}],columns:[{key:'name',label:'Name'}]};
export default async function Regions({params}:{params:Promise<{locale:string}>}){const {locale}=await params;return <CrudPage config={config} locale={locale==='en'?'en':'ar'}/>;}
