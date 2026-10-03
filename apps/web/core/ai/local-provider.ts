import type {AIProvider,AIRequestContext,AIAnswer} from './provider';
import {createClient} from '@/lib/supabase/server';

export class LocalSalesOSProvider implements AIProvider{
 readonly id='local';
 async answer(question:string,context:AIRequestContext):Promise<AIAnswer>{
  const supabase=await createClient();const q=question.toLowerCase();const ar=context.locale==='ar';
  if(q.includes('revenue')||q.includes('sales')||q.includes('مبيعات')||q.includes('إيراد')){
   const {data}=await supabase.from('payments').select('amount').eq('org_id',context.orgId).eq('status','received');
   const total=(data??[]).reduce((n,r)=>n+Number(r.amount||0),0);
   return {provider:'local',text:(ar?'الإيرادات المستلمة: ':'Received revenue: ')+total.toLocaleString()+' EGP',links:[{label:ar?'التحصيل':'Collections',href:'/collections'}],data:{total}};
  }
  if(q.includes('pipeline')||q.includes('deal')||q.includes('صفق')||q.includes('فرص')){
   const {data}=await supabase.from('deals').select('title,value,status').eq('org_id',context.orgId).eq('status','open').order('value',{ascending:false}).limit(10);
   const total=(data??[]).reduce((n,r)=>n+Number(r.value||0),0);
   return {provider:'local',text:(ar?'قيمة خط الصفقات المفتوحة: ':'Open pipeline: ')+total.toLocaleString()+' EGP',links:[{label:ar?'الصفقات':'Deals',href:'/deals'}],data:{total,deals:data??[]}};
  }
  if(q.includes('lead')||q.includes('عميل محتمل')){
   const {count}=await supabase.from('leads').select('*',{count:'exact',head:true}).eq('org_id',context.orgId);
   return {provider:'local',text:(ar?'العملاء المحتملون: ':'Leads: ')+(count??0),links:[{label:ar?'العملاء المحتملون':'Leads',href:'/leads'}],data:{count:count??0}};
  }
  if(q.includes('task')||q.includes('مهام')){
   const {count}=await supabase.from('tasks').select('*',{count:'exact',head:true}).eq('org_id',context.orgId).neq('status','done');
   return {provider:'local',text:(ar?'المهام المفتوحة: ':'Open tasks: ')+(count??0),links:[{label:ar?'المهام':'Tasks',href:'/tasks'}],data:{count:count??0}};
  }
  if(q.includes('inactive')||q.includes('خامل')||q.includes('توقف')){
   const {data}=await supabase.from('v_customer_health').select('id,name,last_purchase,health_status').eq('org_id',context.orgId).in('health_status',['INACTIVE','NO_SALES']).limit(10);
   return {provider:'local',text:(ar?'لديك ':'You have ')+(data?.length??0)+(ar?' عميل يحتاج متابعة.':' customers needing follow-up.'),links:[{label:ar?'العملاء':'Customers',href:'/accounts'}],data:data??[]};
  }
  return {provider:'local',text:ar?'المساعد المجاني يعمل على بيانات مؤسستك. جرّب السؤال عن المبيعات أو الصفقات أو العملاء المحتملين أو المهام.':'The free assistant works from your organization data. Try asking about sales, pipeline, leads, inactive customers, or tasks.',links:[{label:ar?'لوحة التحكم':'Dashboard',href:'/'}]};
 }
}
