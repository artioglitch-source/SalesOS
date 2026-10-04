import type {AIAnswer,AIProvider,AIRequestContext} from '@/core/ai/provider';
import {createClient} from '@/lib/supabase/server';

function outputText(data:any){
  if(typeof data.output_text==='string')return data.output_text;
  for(const item of data.output||[]){
    for(const part of item.content||[]){
      if(part.type==='output_text'&&part.text)return String(part.text);
    }
  }
  if(typeof data.choices?.[0]?.message?.content==='string')return String(data.choices[0].message.content);
  return '';
}

export class ExternalSalesOSProvider implements AIProvider{
  readonly id='external';

  async answer(question:string,context:AIRequestContext):Promise<AIAnswer>{
    const geminiKey=process.env.GEMINI_API_KEY;
    const genericKey=process.env.AI_API_KEY;
    const isGemini=Boolean(geminiKey);
    const key=geminiKey||genericKey;
    const model=isGemini
      ? (process.env.GEMINI_MODEL||process.env.AI_MODEL||'gemini-3.6-flash')
      : process.env.AI_MODEL;
    const base=(isGemini
      ? (process.env.GEMINI_BASE_URL||'https://generativelanguage.googleapis.com/v1beta/openai')
      : (process.env.AI_BASE_URL||'https://api.openai.com/v1')
    ).replace(/\/$/,'');
    if(!key||!model)throw new Error(isGemini?'GEMINI_API_KEY and GEMINI_MODEL are required':'AI_API_KEY and AI_MODEL are required');

    const s=await createClient();
    const [sales,deals,aging,customers,reps,payroll,tasks,alerts,settings,extensions]=await Promise.all([
      s.from('v_monthly_sales').select('period_month,sales,gp').eq('org_id',context.orgId).order('period_month',{ascending:false}).limit(12),
      s.from('deals').select('title,value,status,expected_close_date').eq('org_id',context.orgId).eq('status','open').order('value',{ascending:false}).limit(20),
      s.from('v_receivables_aging').select('aging_bucket,balance_due').eq('org_id',context.orgId).limit(40),
      s.from('accounts').select('id,name,status,last_contact_at').eq('org_id',context.orgId).eq('status','active').order('name').limit(40),
      s.from('reps').select('id,full_name,job_title,basic_salary,monthly_target,active').eq('org_id',context.orgId).limit(100),
      s.from('payroll_runs').select('period,status').eq('org_id',context.orgId).order('period',{ascending:false}).limit(12),
      s.from('tasks').select('title,due_at,priority,status,assignee_id').eq('org_id',context.orgId).neq('status','done').order('due_at').limit(30),
      s.from('alerts').select('title,severity,status,suggested_action').eq('org_id',context.orgId).neq('status','resolved').limit(30),
      s.from('org_settings').select('default_currency,timezone').eq('org_id',context.orgId).maybeSingle(),
      s.from('extensions').select('name,extension_id,version,enabled,manifest').eq('org_id',context.orgId).limit(30)
    ]);

    const ar=context.locale==='ar';
    const instructions=ar
      ? 'أنت Notch AI داخل SalesOS لمدير المبيعات. استخدم فقط سياق المؤسسة المرسل. لا تخترع رقماً. اشرح أي وظيفة في التطبيق، حلل المبيعات والفريق والتحصيل والرواتب والـKPI والمهام والامتدادات، واقترح من 1 إلى 3 خطوات عملية. لا تدّعِ تنفيذ تغيير لم يحدث.'
      : 'You are Notch AI inside SalesOS for a sales manager. Use only the supplied organization context. Never invent numbers. Explain any product feature and analyze sales, staff, collections, payroll, KPI, tasks, and extensions; then suggest 1-3 practical next steps. Never claim a change happened when it did not.';
    const workspace={settings:settings.data||null,sales:sales.data||[],deals:deals.data||[],receivables:aging.data||[],customers:customers.data||[],staff:reps.data||[],payroll:payroll.data||[],tasks:tasks.data||[],alerts:alerts.data||[],extensions:extensions.data||[]};

    let resp:Response;
    if(isGemini){
      resp=await fetch(base+'/chat/completions',{
        method:'POST',
        headers:{'content-type':'application/json',authorization:'Bearer '+key},
        body:JSON.stringify({
          model,
          temperature:0.2,
          messages:[
            {role:'system',content:instructions},
            {role:'user',content:JSON.stringify({question,workspace})}
          ]
        })
      });
    }else{
      resp=await fetch(base+'/responses',{
        method:'POST',
        headers:{'content-type':'application/json',authorization:'Bearer '+key},
        body:JSON.stringify({model,instructions,input:JSON.stringify({question,workspace}),max_output_tokens:1400})
      });
    }

    if(!resp.ok){
      const detail=await resp.text().catch(()=> '');
      throw new Error('AI provider HTTP '+resp.status+(detail?' · '+detail.slice(0,300):''));
    }
    const data=await resp.json();
    const text=outputText(data);
    if(!text)throw new Error('AI response empty');
    return {provider:'external',text,links:[{label:ar?'مركز المساعدة':'Help center',href:'/help'}],data:{provider:isGemini?'gemini':'generic',model}};
  }
}