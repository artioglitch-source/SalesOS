import {NextResponse} from 'next/server';
import {createClient} from '@/lib/supabase/server';
import {LocalSalesOSProvider} from '@/core/ai/local-provider';
import {z} from 'zod';
import * as XLSX from 'xlsx';

export const runtime='nodejs';

const schema=z.object({
 question:z.string().max(4000).default(''),
 locale:z.enum(['ar','en']).default('ar'),
 previous_interaction_id:z.string().optional()
});

const responseSchema={type:'object',properties:{
 summary:{type:'string'},
 mood:{type:'string',enum:['happy','thinking','eating','surprised','confused','celebrate']},
 confidence:{type:'number'},
 action:{type:'object',properties:{
  type:{type:'string',enum:['none','create_customer','create_lead','create_task','create_staff']},
  name:{type:'string'},email:{type:'string'},phone:{type:'string'},company:{type:'string'},
  title:{type:'string'},description:{type:'string'},salary:{type:'number'},target:{type:'number'},due_at:{type:'string'}
 },required:['type']}
},required:['summary','mood','confidence','action']};

function workbookText(bytes:ArrayBuffer){
 try{
  const wb=XLSX.read(Buffer.from(bytes),{type:'buffer'});
  return wb.SheetNames.slice(0,8).map(name=>{
   const rows=XLSX.utils.sheet_to_json(wb.Sheets[name],{header:1,raw:false}).slice(0,120) as any[][];
   return 'SHEET '+name+'\n'+rows.map(row=>row.map(cell=>String(cell??'')).join(' | ')).join('\n');
  }).join('\n\n');
 }catch{return ''}
}

async function toGeminiPart(file:File){
 const bytes=await file.arrayBuffer();
 const name=file.name.toLowerCase();
 const mime=(file.type||'application/octet-stream').toLowerCase();
 if(/\.(xlsx|xls)$/.test(name))return {type:'text',text:'WORKBOOK '+file.name+'\n'+workbookText(bytes)};
 if(/\.(csv|txt|md|json)$/.test(name))return {type:'text',text:'FILE '+file.name+'\n'+Buffer.from(bytes).toString('utf8').slice(0,500000)};
 const data=Buffer.from(bytes).toString('base64');
 if(mime.startsWith('image/'))return {type:'image',data,mime_type:mime};
 if(mime.startsWith('audio/'))return {type:'audio',data,mime_type:mime};
 if(mime.startsWith('video/'))return {type:'video',data,mime_type:mime};
 return {type:'document',data,mime_type:mime};
}

function jsonError(message:string,status:number,details?:unknown){
 return NextResponse.json({error:message,details:typeof details==='string'?details:undefined,mode:'error'},{status});
}

export async function POST(req:Request){
 try{
  const form=await req.formData();
  const parsed=schema.safeParse({
   question:String(form.get('question')||''),
   locale:String(form.get('locale')||'ar'),
   previous_interaction_id:form.get('previous_interaction_id')?String(form.get('previous_interaction_id')):undefined
  });
  if(!parsed.success)return jsonError('Invalid assistant request',400);

  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user)return jsonError('Unauthorized',401);

  const {data:m}=await supabase.from('org_members').select('org_id,role').eq('user_id',user.id).eq('status','active').limit(1).maybeSingle();
  if(!m)return jsonError('Organization required',400);

  const files=form.getAll('files').filter((x):x is File=>x instanceof File).slice(0,6);
  const input:any[]=[];
  if(parsed.data.question)input.push({type:'text',text:parsed.data.question});

  const textParts:string[]=[];
  for(const file of files){
   if(file.size>15*1024*1024)continue;
   const part=await toGeminiPart(file);
   if(part.type==='text')textParts.push(part.text);
   else input.push(part);
  }
  if(textParts.length)input.unshift({type:'text',text:'Attached tabular/text data:\n'+textParts.join('\n\n')});

  const key=process.env.GEMINI_API_KEY;
  if(!key){
   const local=await new LocalSalesOSProvider().answer(parsed.data.question,{locale:parsed.data.locale,orgId:m.org_id,userId:user.id});
   return NextResponse.json({text:local.text,links:local.links,mode:'local',provider:'local',mood:'happy',confidence:.55,action:{type:'none'}});
  }

  const [sales,deals,aging,staff,customers,tasks,alerts]=await Promise.all([
   supabase.from('v_monthly_sales').select('period_month,sales,gp').eq('org_id',m.org_id).order('period_month',{ascending:false}).limit(12),
   supabase.from('deals').select('title,value,status,expected_close_date').eq('org_id',m.org_id).eq('status','open').order('value',{ascending:false}).limit(20),
   supabase.from('v_receivables_aging').select('aging_bucket,balance_due').eq('org_id',m.org_id).limit(30),
   supabase.from('reps').select('id,full_name,job_title,basic_salary,monthly_target,active').eq('org_id',m.org_id).limit(100),
   supabase.from('accounts').select('id,name,status,phone,email').eq('org_id',m.org_id).eq('status','active').order('name').limit(50),
   supabase.from('tasks').select('title,due_at,priority,status').eq('org_id',m.org_id).neq('status','done').order('due_at').limit(30),
   supabase.from('alerts').select('title,severity,status,suggested_action').eq('org_id',m.org_id).neq('status','resolved').limit(30)
  ]);

  const ar=parsed.data.locale==='ar';
  const system=ar
   ?'أنت Notch AI داخل SalesOS. أنت ذكي ومرح لكن دقيق. هذا النظام يستخدمه مدير واحد لإدارة المبيعات والعملاء والفريق والتحصيل والرواتب. استخدم سياق المؤسسة للأرقام ولا تخترع أي رقم. اقرأ الملفات المرفوعة وحللها. أجب بلغة المستخدم. اشرح كيف تعمل الأدوات عند السؤال عنها. لا تقل إنك نفذت شيئاً؛ يمكنك اقتراح إجراء آمن ليؤكده المدير. إذا كانت البيانات غير كافية فلا تخترع.'
   :'You are Notch AI inside SalesOS. You are witty but precise. One manager uses this system to run sales, customers, staff, collections and payroll. Use workspace context for numbers and never invent. Read and analyze attachments. Reply in the user language. Explain product workflows when asked. Never claim you executed anything; you may propose a safe action for the manager to confirm. Never fabricate when data is insufficient.';

  const context={workspace:{
   sales:sales.data||[],open_deals:deals.data||[],receivables:aging.data||[],staff:staff.data||[],
   customers:customers.data||[],tasks:tasks.data||[],alerts:alerts.data||[]
  },attachments:files.map(f=>({name:f.name,size:f.size,mime:f.type}))};

  const body:any={
   model:process.env.GEMINI_MODEL||'gemini-3.8-flash',
   input:input.length?input:parsed.data.question,
   store:false,
   system_instruction:system+'\nWORKSPACE CONTEXT:\n'+JSON.stringify(context),
   response_format:{type:'text',mime_type:'application/json',schema:responseSchema}
  };
  if(parsed.data.previous_interaction_id)body.previous_interaction_id=parsed.data.previous_interaction_id;

  const response=await fetch('https://generativelanguage.googleapis.com/v1beta/interactions',{
   method:'POST',
   headers:{'content-type':'application/json','x-goog-api-key':key},
   body:JSON.stringify(body)
  });
  const raw=await response.text();
  let data:any=null;
  try{data=raw?JSON.parse(raw):null}catch{}
  if(!response.ok)return jsonError(data?.error?.message||'Gemini request failed',502,'Gemini HTTP '+response.status);

  let out:any;
  try{out=JSON.parse(String(data?.output_text||'{}'))}
  catch{out={summary:String(data?.output_text||'Gemini returned an unstructured response'),mood:'happy',confidence:.5,action:{type:'none'}}}

  const text=String(out.summary||data?.output_text||'');
  await supabase.from('ai_usage').insert({org_id:m.org_id,user_id:user.id,provider:'gemini',model:body.model,tool_calls:0});
  return NextResponse.json({
   text,mode:'gemini',provider:'gemini',mood:out.mood||'happy',confidence:Number(out.confidence||.7),
   action:out.action||{type:'none'},interaction_id:data?.id||null,
   links:[{label:ar?'مركز المساعدة':'Help center',href:'/help'}]
  });
 }catch(error){
  return jsonError(error instanceof Error?error.message:'AI endpoint failed',500);
 }
}
