import type {AIAnswer,AIProvider,AIRequestContext} from '@/core/ai/provider';
import {createClient} from '@/lib/supabase/server';

type GeminiResponse={error?:{message?:string};candidates?:Array<{content?:{parts?:Array<{text?:string}>};finishReason?:string}>;promptFeedback?:{blockReason?:string}};

export class GeminiSalesOSProvider implements AIProvider{
 readonly id='gemini';
 async answer(question:string,context:AIRequestContext):Promise<AIAnswer>{
  const apiKey=process.env.GEMINI_API_KEY;
  const model=(process.env.GEMINI_MODEL||'gemini-3.8-flash').replace(/^models\//,'');
  const base=(process.env.GEMINI_BASE_URL||'https://generativelanguage.googleapis.com/v1beta').replace(/\/$/,'');
  if(!apiKey)throw new Error('GEMINI_API_KEY is not configured');
  const s=await createClient();
  const [sales,deals,aging,customers,staff,tasks]=await Promise.all([
   s.from('v_monthly_sales').select('period_month,sales,gp').eq('org_id',context.orgId).order('period_month',{ascending:false}).limit(6),
   s.from('deals').select('title,value,status,expected_close_date').eq('org_id',context.orgId).eq('status','open').order('value',{ascending:false}).limit(10),
   s.from('v_receivables_aging').select('aging_bucket,balance_due').eq('org_id',context.orgId).limit(20),
   s.from('accounts').select('name,status').eq('org_id',context.orgId).eq('status','active').order('name').limit(20),
   s.from('reps').select('full_name,job_title,basic_salary,monthly_target,active').eq('org_id',context.orgId).eq('active',true).limit(40),
   s.from('tasks').select('title,status,due_at,priority').eq('org_id',context.orgId).neq('status','done').order('due_at').limit(20)
  ]);
  const ar=context.locale==='ar';
  const system=ar
    ?'أنت Solid، مساعد المبيعات والعمليات داخل SalesOS لمدير واحد يدير الشركة والفريق. استخدم فقط سياق البيانات المرسل. لا تخترع أرقاماً. أجب بالعربية إلا إذا طلب المستخدم غير ذلك. اجعل الإجابة عملية ومباشرة، ثم أعط 1-3 خطوات تالية. عند سؤال المستخدم عن طريقة استخدام النظام، اشرح مسار الشاشة والخطوات بدقة ولا تدّع تنفيذ أي إجراء لم يحدث.'
    :'You are Solid, the sales and operations copilot inside SalesOS for one manager running the company and team. Use only the supplied context. Never invent numbers. Answer clearly and practically, then give 1-3 next steps. For how-to questions, explain the exact product workflow and never claim an action happened unless it did.';
  const contextText=JSON.stringify({question,sales:sales.data||[],open_deals:deals.data||[],receivables:aging.data||[],customers:customers.data||[],staff:staff.data||[],tasks:tasks.data||[]});
  const parts:any[]=[{text:contextText}];
  for(const file of context.attachments||[])parts.push({inline_data:{mime_type:file.mimeType,data:file.data}});
  const resp=await fetch(base+'/models/'+encodeURIComponent(model)+':generateContent',{
   method:'POST',
   headers:{'content-type':'application/json','x-goog-api-key':apiKey},
   body:JSON.stringify({system_instruction:{parts:[{text:system}]},contents:[{role:'user',parts}],generationConfig:{temperature:0.2,maxOutputTokens:1200}})
  });
  const raw=await resp.text();let data:GeminiResponse={};
  try{if(raw)data=JSON.parse(raw)}catch{throw new Error('Gemini returned non-JSON data (HTTP '+resp.status+')')}
  if(!resp.ok)throw new Error(data.error?.message||data.promptFeedback?.blockReason||('Gemini HTTP '+resp.status));
  const text=String(data.candidates?.[0]?.content?.parts?.map(p=>p.text||'').join('')||'');
  if(!text)throw new Error('Gemini returned an empty response');
  return {provider:'external',text,links:[{label:ar?'مركز المساعدة':'Help center',href:'/help'}],data:{model,attachments:(context.attachments||[]).length}};
 }
}