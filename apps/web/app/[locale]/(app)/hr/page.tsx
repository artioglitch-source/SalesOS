import {CrudPage,CrudConfig} from '@/components/data/crud-page';
const config:CrudConfig={table:'attendance',title:'Attendance',arTitle:'الحضور والانصراف',fields:[
 {key:'work_date',label:'Work date',type:'date',required:true},{key:'clock_in',label:'Clock in',type:'datetime'},{key:'clock_out',label:'Clock out',type:'datetime'},{key:'status',label:'Status'},{key:'notes',label:'Notes'}
],columns:[{key:'work_date',label:'Date'},{key:'clock_in',label:'In'},{key:'clock_out',label:'Out'},{key:'status',label:'Status'}]};
export default async function Hr({params}:{params:Promise<{locale:string}>}){const {locale}=await params;return <CrudPage config={config} locale={locale==='en'?'en':'ar'}/>;}
