import {CrudPage,CrudConfig} from '@/components/data/crud-page';
const config:CrudConfig={table:'tasks',title:'Tasks',arTitle:'المهام',fields:[
 {key:'title',label:'Title',required:true},{key:'description',label:'Description'},{key:'due_at',label:'Due',type:'datetime'},{key:'priority',label:'Priority'},{key:'status',label:'Status'}
],columns:[{key:'title',label:'Title'},{key:'due_at',label:'Due'},{key:'priority',label:'Priority'},{key:'status',label:'Status'}]};
export default async function Tasks({params}:{params:Promise<{locale:string}>}){const {locale}=await params;return <CrudPage config={config} locale={locale==='en'?'en':'ar'}/>;}
