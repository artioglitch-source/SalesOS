import type {AIAnswer,AIProvider,AIRequestContext} from '@/core/ai/provider';
import {createClient} from '@/lib/supabase/server';

type GeminiPart={text?:string};
type GeminiCandidate={content?:{parts?:GeminiPart[]}};
type GeminiResponse={error?:{message?:string};candidates?:GeminiCandidate[];promptFeedback?:{blockReason?:string}};
type GeminiModel={name?:string;supportedGenerationMethods?:string[]};

function normalizeBaseUrl(input:string){
  let base=(input||'https://generativelanguage.googleapis.com/v1beta').trim().replace(/\/+$/,'');
  base=base.replace(/\/models\/[^/]+(?::generateContent)?$/,'');
  if(!/\/v1(?:beta\d*)?$/.test(base))base+='/v1beta';
  return base;
}

async function parseBody(response:Response){
  const raw=await response.text();
  if(!raw)return {data:null,raw:'' as string};
  try{return {data:JSON.parse(raw) as GeminiResponse,raw}}catch{return {data:null,raw}};
}

async function generate(base:string,apiKey:string,model:string,payload:unknown){
  return fetch(base+'/models/'+encodeURIComponent(model)+':generateContent',{
    method:'POST',
    headers:{'content-type':'application/json','x-goog-api-key':apiKey},
    body:JSON.stringify(payload),
  });
}

async function findFallbackModel(base:string,apiKey:string,requested:string){
  const response=await fetch(base+'/models',{headers:{'x-goog-api-key':apiKey}});
  if(!response.ok)return null;
  const body=await response.json() as {models?:GeminiModel[]};
  const candidates=(body.models||[])
    .filter(m=>m.supportedGenerationMethods?.includes('generateContent'))
    .map(m=>String(m.name||'').replace(/^models\//,''))
    .filter(Boolean);
  if(!candidates.length)return null;
  const clean=requested.replace(/^models\//,'');
  const preferred=[clean,'gemini-3.8-flash','gemini-3.6-flash','gemini-3.5-flash','gemini-3-flash'];
  for(const name of preferred)if(candidates.includes(name))return name;
  return candidates.find(name=>name.includes('flash'))||candidates[0];
}

export class GeminiSalesOSProvider implements AIProvider{
  readonly id='gemini';

  async answer(question:string,context:AIRequestContext&{attachments?:Array<{name:string;mimeType:string;data:string}>}):Promise<AIAnswer>{
    const apiKey=process.env.GEMINI_API_KEY||process.env.GOOGLE_API_KEY;
    const requestedModel=(process.env.GEMINI_MODEL||'gemini-3.8-flash').trim().replace(/^models\//,'');
    const base=normalizeBaseUrl(process.env.GEMINI_BASE_URL||'https://generativelanguage.googleapis.com/v1beta');
    if(!apiKey)throw new Error('GEMINI_API_KEY is not configured on the server');

    const s=await createClient();
    const [sales,deals,aging,customers,staff,tasks]=await Promise.all([
      s.from('v_monthly_sales').select('period_month,sales,gp').eq('org_id',context.orgId).order('period_month',{ascending:false}).limit(12),
      s.from('deals').select('title,value,status,expected_close_date').eq('org_id',context.orgId).eq('status','open').order('value',{ascending:false}).limit(15),
      s.from('v_receivables_aging').select('aging_bucket,balance_due').eq('org_id',context.orgId).limit(30),
      s.from('accounts').select('name,status').eq('org_id',context.orgId).eq('status','active').order('name').limit(30),
      s.from('reps').select('full_name,job_title,basic_salary,monthly_target,active').eq('org_id',context.orgId).eq('active',true).limit(60),
      s.from('tasks').select('title,status,due_at,priority').eq('org_id',context.orgId).neq('status','done').order('due_at').limit(30),
    ]);

    const ar=context.locale==='ar';
    const system=ar
      ?'أنت SOLID، مساعد المبيعات والعمليات داخل SalesOS. المستخدم هو مدير يدير الشركة والفريق. استخدم فقط سياق المؤسسة المرسل. لا تخترع أرقاماً. أجب بالعربية ما لم يطلب غير ذلك. كن عملياً ومباشراً، ثم اقترح من 1 إلى 3 إجراءات تالية. عند سؤال المستخدم عن طريقة استخدام SalesOS، اشرح المسار الفعلي داخل الواجهة ولا تدّع تنفيذ تغيير لم يحدث.'
      :'You are SOLID, the sales and operations copilot inside SalesOS. The user is a manager running the company and team. Use only the supplied organization context. Never invent numbers. Be practical and direct, then suggest 1-3 next actions. For how-to questions, explain the real SalesOS workflow and never claim an action happened unless it did.';
    const contextText=JSON.stringify({question,workspace:{sales:sales.data||[],open_deals:deals.data||[],receivables:aging.data||[],customers:customers.data||[],staff:staff.data||[],tasks:tasks.data||[]}});

    const parts:any[]=[{text:contextText}];
    for(const file of context.attachments||[])parts.push({inline_data:{mime_type:file.mimeType,data:file.data}});

    const payload={
      system_instruction:{parts:[{text:system}]},
      contents:[{role:'user',parts}],
      generationConfig:{temperature:0.2,maxOutputTokens:1400},
    };

    let model=requestedModel;
    let response=await generate(base,apiKey,model,payload);
    let {data,raw}=await parseBody(response);

    if(response.status===404){
      const fallback=await findFallbackModel(base,apiKey,requestedModel);
      if(fallback&&fallback!==model){
        model=fallback;
        response=await generate(base,apiKey,model,payload);
        ({data,raw}=await parseBody(response));
      }
    }

    if(!data){
      throw new Error(
        response.status===404
          ? 'Gemini model endpoint not found. Set GEMINI_MODEL to a current generateContent model such as gemini-3.8-flash.'
          : 'Gemini returned a non-JSON response (HTTP '+response.status+').'
      );
    }

    if(!response.ok){
      throw new Error(data.error?.message||data.promptFeedback?.blockReason||('Gemini HTTP '+response.status));
    }

    const text=String(data.candidates?.[0]?.content?.parts?.map(part=>part.text||'').join('')||'');
    if(!text)throw new Error('Gemini returned an empty response');

    return {
      provider:'external',
      text,
      links:[{label:ar?'مركز المساعدة':'Help center',href:'/help'}],
      data:{model,attachments:(context.attachments||[]).length},
    };
  }
}