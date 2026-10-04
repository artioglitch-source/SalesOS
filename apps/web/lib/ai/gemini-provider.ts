import type {AIAnswer,AIProvider,AIRequestContext} from '@/core/ai/provider';
import {createClient} from '@/lib/supabase/server';

function extractText(data:any){
  const parts=data?.candidates?.[0]?.content?.parts;
  if(Array.isArray(parts)){
    return parts.filter((p:any)=>typeof p?.text==='string').map((p:any)=>p.text).join('\n').trim();
  }
  return '';
}

export class GeminiSalesOSProvider implements AIProvider{
  readonly id='gemini';
  async answer(question:string,context:AIRequestContext):Promise<AIAnswer>{
    const key=process.env.GEMINI_API_KEY||process.env.AI_API_KEY;
    const model=process.env.GEMINI_MODEL||process.env.AI_MODEL||'gemini-3.8-flash';
    const base=(process.env.GEMINI_BASE_URL||'https://generativelanguage.googleapis.com/v1beta').replace(/\/$/,'');
    if(!key)throw new Error('GEMINI_API_KEY is missing');
    const s=await createClient();
    const [sales,deals,aging,customers,staff,payroll,tasks,alerts,settings,extensions]=await Promise.all([
      s.from('v_monthly_sales').select('period_month,sales,gp').eq('org_id',context.orgId).order('period_month',{ascending:false}).limit(12),
      s.from('deals').select('title,value,status,expected_close_date').eq('org_id',context.orgId).eq('status','open').order('value',{ascending:false}).limit(20),
      s.from('v_receivables_aging').select('aging_bucket,balance_due').eq('org_id',context.orgId).limit(40),
      s.from('accounts').select('id,name,status,last_contact_at').eq('org_id',context.orgId).eq('status','active').order('name').limit(50),
      s.from('reps').select('id,full_name,job_title,basic_salary,monthly_target,active').eq('org_id',context.orgId).limit(100),
      s.from('payroll_runs').select('period,status').eq('org_id',context.orgId).order('period',{ascending:false}).limit(12),
      s.from('tasks').select('title,due_at,priority,status,assignee_id').eq('org_id',context.orgId).neq('status','done').order('due_at').limit(30),
      s.from('alerts').select('title,severity,status,suggested_action').eq('org_id',context.orgId).neq('status','resolved').limit(30),
      s.from('org_settings').select('default_currency,timezone').eq('org_id',context.orgId).maybeSingle(),
      s.from('extensions').select('name,extension_id,version,enabled,manifest').eq('org_id',context.orgId).limit(30),
    ]);
    const ar=context.locale==='ar';
    const system=ar
      ? 'أنت Notch AI داخل SalesOS لمدير المبيعات. استخدم فقط سياق المؤسسة المرسل. لا تخترع أي رقم. أجب بلغة المستخدم. اشرح وظائف التطبيق بوضوح، وحلل المبيعات والـPipeline والتحصيل والموظفين والرواتب وKPI والتنبيهات والمهام والامتدادات. اختم من 1 إلى 3 إجراءات عملية قابلة للتنفيذ. لا تدّعِ أنك نفذت تغييراً.'
      : 'You are Notch AI inside SalesOS for a sales manager. Use only the supplied organization context. Never invent numbers. Reply in the user language. Explain product features clearly and analyze sales, pipeline, collections, staff, payroll, KPI, alerts, tasks, and extensions. End with 1-3 actionable next steps. Never claim you executed a change.';
    const input=JSON.stringify({
      question,
      workspace:{
        settings:settings.data||null,
        sales:sales.data||[],
        open_deals:deals.data||[],
        receivables:aging.data||[],
        customers:customers.data||[],
        staff:staff.data||[],
        payroll:payroll.data||[],
        tasks:tasks.data||[],
        alerts:alerts.data||[],
        extensions:extensions.data||[],
      },
    });
    const resp=await fetch(base+'/models/'+encodeURIComponent(model)+':generateContent',{
      method:'POST',
      headers:{'content-type':'application/json','x-goog-api-key':key},
      body:JSON.stringify({
        system_instruction:{parts:[{text:system}]},
        contents:[{role:'user',parts:[{text:input}]}],
        generationConfig:{temperature:0.2,maxOutputTokens:1400},
      }),
    });
    const raw=await resp.text();
    let data:any=null;
    try{data=raw?JSON.parse(raw):null}catch{throw new Error('Gemini returned a non-JSON response (HTTP '+resp.status+')')}
    if(!resp.ok){
      const detail=String(data?.error?.message||'Gemini request failed');
      throw new Error('Gemini HTTP '+resp.status+': '+detail);
    }
    const text=extractText(data);
    if(!text){
      const block=String(data?.promptFeedback?.blockReason||'');
      throw new Error(block?'Gemini blocked the request: '+block:'Gemini returned an empty response');
    }
    return {provider:'external',text,links:[{label:ar?'مركز المساعدة':'Help center',href:'/help'}],data:{model,provider:'gemini'}};
  }
}
