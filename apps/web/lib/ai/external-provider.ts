import type {AIAnswer,AIProvider,AIRequestContext} from '@/core/ai/provider';
import {createClient} from '@/lib/supabase/server';
export class ExternalSalesOSProvider implements AIProvider{
 readonly id='external';
 async answer(question:string,context:AIRequestContext):Promise<AIAnswer>{
  const key=process.env.AI_API_KEY,model=process.env.AI_MODEL,base=(process.env.AI_BASE_URL||'https://api.openai.com/v1').replace(/\/$/,'');
  if(!key||!model)throw new Error('AI_API_KEY and AI_MODEL are required');
  const s=await createClient();
  const [sales,deals,aging,customers]=await Promise.all([
    s.from('v_monthly_sales').select('period_month,sales,gp').eq('org_id',context.orgId).order('period_month',{ascending:false}).limit(6),
    s.from('deals').select('title,value,status,expected_close_date').eq('org_id',context.orgId).eq('status','open').order('value',{ascending:false}).limit(10),
    s.from('v_receivables_aging').select('aging_bucket,balance_due').eq('org_id',context.orgId).limit(20),
    s.from('accounts').select('name,status').eq('org_id',context.orgId).eq('status','active').order('name').limit(20)
  ]);
  const system=context.locale==='ar'?'أنت مساعد SalesOS لمدير مبيعات. استخدم فقط سياق البيانات المرسل، لا تخترع أرقاماً، ثم اقترح 1-3 إجراءات.':'You are the SalesOS copilot for a sales manager. Use only the supplied context, never invent numbers, then suggest 1-3 actions.';
  const resp=await fetch(base+'/chat/completions',{method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+key},body:JSON.stringify({model,temperature:0.2,messages:[{role:'system',content:system},{role:'user',content:JSON.stringify({question,sales:sales.data||[],deals:deals.data||[],aging:aging.data||[],customers:customers.data||[]})}]})});
  if(!resp.ok)throw new Error('AI provider HTTP '+resp.status);
  const data=await resp.json() as {choices?:Array<{message?:{content?:string}}>};
  const output=String(data.choices?.[0]?.message?.content||'');if(!output)throw new Error('AI response empty');
  return {provider:'external',text:output,links:[{label:context.locale==='ar'?'مركز المساعدة':'Help center',href:'/help'}]};
 }
}