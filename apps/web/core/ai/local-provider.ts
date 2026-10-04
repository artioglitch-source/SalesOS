import type {AIProvider,AIRequestContext,AIAnswer} from './provider';
import {createClient} from '@/lib/supabase/server';
import {HELP_ARTICLES} from '@/lib/help/articles';

export class LocalSalesOSProvider implements AIProvider {
  readonly id='local';

  async answer(question:string,context:AIRequestContext):Promise<AIAnswer>{
    const supabase:any=await createClient();
    const q=question.toLowerCase();
    const ar=context.locale==='ar';
    const link=(label:string,href:string)=>[{label,href}];
    const howTo=q.includes('how')||q.includes('guide')||q.includes('explain')||q.includes('كيف')||q.includes('طريقة')||q.includes('اشرح')||q.includes('شرح');
    if(howTo){
      const match=HELP_ARTICLES.find(a=>a.keywords.some(k=>q.includes(k.toLowerCase())));
      if(match){
        const steps=ar?match.stepsAr:match.stepsEn;
        return {provider:'local',text:(ar?match.bodyAr:match.bodyEn)+'\n\n'+steps.map((x,i)=>(i+1)+'. '+x).join('\n'),links:link(ar?'مركز المساعدة':'Help center','/help'),data:{article:match.id}};
      }
    }
    if(q.includes('sales')||q.includes('revenue')||q.includes('مبيعات')||q.includes('إيراد')){
      const {data}=await supabase.from('payments').select('amount').eq('org_id',context.orgId).eq('status','received');
      const total=(data??[]).reduce((n:number,r:any)=>n+Number(r.amount||0),0);
      return {provider:'local',text:(ar?'إجمالي المدفوعات المستلمة: ':'Total payments received: ')+total.toLocaleString()+' EGP',links:link(ar?'التحصيل':'Collections','/collections'),data:{total}};
    }
    if(q.includes('pipeline')||q.includes('deal')||q.includes('صفق')||q.includes('فرص')){
      const {data}=await supabase.from('deals').select('title,value,status,stage_id').eq('org_id',context.orgId).eq('status','open').order('value',{ascending:false}).limit(10);
      const total=(data??[]).reduce((n:number,r:any)=>n+Number(r.value||0),0);
      return {provider:'local',text:(ar?'قيمة الـPipeline المفتوح: ':'Open pipeline value: ')+total.toLocaleString()+' EGP',links:link(ar?'خط المبيعات':'Pipeline','/pipeline'),data:{total,deals:data??[]}};
    }
    if(q.includes('collection')||q.includes('aging')||q.includes('تحصيل')||q.includes('مديون')||q.includes('ذمم')){
      const {data}=await supabase.from('v_receivables_aging').select('aging_bucket,balance_due').eq('org_id',context.orgId);
      const total=(data??[]).reduce((n:number,r:any)=>n+Number(r.balance_due||0),0);
      const overdue=(data??[]).filter((r:any)=>['1_30','31_60','61_90','90_plus'].includes(r.aging_bucket)).reduce((n:number,r:any)=>n+Number(r.balance_due||0),0);
      return {provider:'local',text:(ar?'إجمالي الذمم: ':'Total receivables: ')+total.toLocaleString()+' EGP. '+(ar?'المتأخر: ':'Overdue: ')+overdue.toLocaleString()+' EGP',links:link(ar?'التحصيل':'Collections','/collections'),data:{total,overdue}};
    }
    if(q.includes('staff')||q.includes('employee')||q.includes('موظف')||q.includes('مندوب')||q.includes('فريق')){
      const {data}=await supabase.from('reps').select('id,full_name,job_title,basic_salary,monthly_target,active').eq('org_id',context.orgId).order('active',{ascending:false}).limit(100);
      const active=(data??[]).filter((x:any)=>x.active).length;
      return {provider:'local',text:(ar?'عدد الموظفين النشطين: ':'Active staff: ')+active+' / '+(data?.length??0),links:link(ar?'الموظفون والفريق':'Staff & team','/staff'),data:data??[]};
    }
    if(q.includes('payroll')||q.includes('salary')||q.includes('راتب')||q.includes('رواتب')||q.includes('عمولة')){
      const {data}=await supabase.from('payroll_runs').select('period,status').eq('org_id',context.orgId).order('period',{ascending:false}).limit(6);
      return {provider:'local',text:(ar?'آخر تشغيلات الرواتب: ':'Recent payroll runs: ')+(data??[]).map((x:any)=>x.period+' '+x.status).join(', '),links:link(ar?'الرواتب والعمولات':'Payroll & commissions','/payroll'),data:data??[]};
    }
    if(q.includes('forecast')||q.includes('run rate')||q.includes('توقع')||q.includes('تنبؤ')){
      const {data}=await supabase.from('v_my_rep_snapshot').select('*').eq('org_id',context.orgId).maybeSingle();
      if(data)return {provider:'local',text:(ar?'التوقع التشغيلي لمبيعاتك هذا الشهر: ':'Your current run-rate forecast: ')+Number(data.run_rate_forecast||0).toLocaleString()+' EGP',links:link(ar?'الأداء':'Performance','/performance'),data};
    }
    if(q.includes('inactive')||q.includes('خامل')||q.includes('توقف')){
      const {data}=await supabase.from('v_customer_health').select('id,name,last_purchase,days_since_purchase,health_status').eq('org_id',context.orgId).in('health_status',['INACTIVE','NO_SALES']).order('days_since_purchase',{ascending:false}).limit(10);
      return {provider:'local',text:(ar?'هناك ':'There are ')+(data?.length??0)+(ar?' عملاء يحتاجون متابعة.':' customers needing follow-up.'),links:link(ar?'الحسابات':'Customers','/accounts'),data:data??[]};
    }
    if(q.includes('cross')||q.includes('sell')||q.includes('فجوات')||q.includes('متقاطع')){
      const {data}=await supabase.from('v_cross_sell_gaps').select('account_id,customer_name,missing_group').eq('org_id',context.orgId).limit(20);
      return {provider:'local',text:(ar?'تم اكتشاف ':'Detected ')+(data?.length??0)+(ar?' فرصة بيع متقاطع.':' cross-sell opportunities.'),links:link(ar?'الحسابات':'Customers','/accounts'),data:data??[]};
    }
    if(q.includes('lead')||q.includes('عميل محتمل')){
      const {count}=await supabase.from('leads').select('*',{count:'exact',head:true}).eq('org_id',context.orgId);
      return {provider:'local',text:(ar?'العملاء المحتملون: ':'Leads: ')+(count??0),links:link(ar?'العملاء المحتملون':'Leads','/leads'),data:{count:count??0}};
    }
    if(q.includes('task')||q.includes('مهام')){
      const {count}=await supabase.from('tasks').select('*',{count:'exact',head:true}).eq('org_id',context.orgId).neq('status','done');
      return {provider:'local',text:(ar?'المهام المفتوحة: ':'Open tasks: ')+(count??0),links:link(ar?'المهام':'Tasks','/tasks'),data:{count:count??0}};
    }
    if(q.includes('target')||q.includes('goal')||q.includes('هدف')){
      const {data}=await supabase.from('targets').select('scope,metric,value,period').eq('org_id',context.orgId).order('period',{ascending:false}).limit(20);
      const total=(data??[]).filter((r:any)=>r.metric==='sales').reduce((n:number,r:any)=>n+Number(r.value||0),0);
      return {provider:'local',text:(ar?'قيمة أهداف المبيعات الحالية: ':'Current sales target total: ')+total.toLocaleString()+' EGP',links:link(ar?'الأهداف':'Targets','/targets'),data:data??[]};
    }
    return {provider:'local',text:ar?'المساعد المحلي يعمل من بيانات مؤسستك. اسأل عن المبيعات، العملاء، الموظفين، الرواتب، KPI، التحصيل أو طريقة استخدام أي أداة.':'The local assistant works from your organization data. Ask about sales, customers, staff, payroll, KPI, collections, or how to use any tool.',links:link(ar?'مركز المساعدة':'Help center','/help')};
  }
}