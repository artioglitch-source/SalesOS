import {NextResponse} from 'next/server';
import {createClient} from '@/lib/supabase/server';
import {LocalSalesOSProvider} from '@/core/ai/local-provider';
import {GeminiSalesOSProvider} from '@/lib/ai/gemini-provider';
import {z} from 'zod';

const schema=z.object({question:z.string().min(1).max(2000),locale:z.enum(['ar','en']).default('ar')});

async function readRequest(req:Request){
  const contentType=req.headers.get('content-type')||'';
  if(contentType.includes('multipart/form-data')){
    const form=await req.formData();
    const question=String(form.get('question')||'').trim();
    const locale=String(form.get('locale')||'ar');
    const files=form.getAll('files').filter((x):x is File=>typeof File!=='undefined'&&x instanceof File);
    const attachments=[] as Array<{name:string;mimeType:string;data:string}>;
    let total=0;
    for(const file of files.slice(0,6)){
      if(file.size<=0)continue;
      total+=file.size;
      if(total>4*1024*1024)break;
      const bytes=Buffer.from(await file.arrayBuffer());
      attachments.push({name:file.name,mimeType:file.type||'application/octet-stream',data:bytes.toString('base64')});
    }
    return {question,locale,attachments};
  }
  return {...await req.json(),attachments:[]};
}

export async function POST(req:Request){
 try{
  const body=await readRequest(req);
  const parsed=schema.safeParse({question:body.question,locale:body.locale});
  if(!parsed.success)return NextResponse.json({error:'A question is required.'},{status:400});
  const s=await createClient();
  const {data:{user}}=await s.auth.getUser();
  if(!user)return NextResponse.json({error:'Unauthorized'},{status:401});
  const {data:m}=await s.from('org_members').select('org_id,role').eq('user_id',user.id).eq('status','active').limit(1).maybeSingle();
  if(!m)return NextResponse.json({error:'Organization required'},{status:400});
  let answer:any;let mode:'real'|'local'='local';
  if(process.env.GEMINI_API_KEY){
    try{
      answer=await new GeminiSalesOSProvider().answer(parsed.data.question,{locale:parsed.data.locale,orgId:m.org_id,userId:user.id,attachments:body.attachments});
      mode='real';
    }catch(error){
      answer=await new LocalSalesOSProvider().answer(parsed.data.question,{locale:parsed.data.locale,orgId:m.org_id,userId:user.id});
      answer.text=(parsed.data.locale==='ar'?'تعذر الوصول إلى Gemini وتم استخدام الوضع المحلي المجاني. السبب: ':'Gemini was unavailable, so the free local mode answered. Reason: ')+(error instanceof Error?error.message:'provider error')+'\n\n'+answer.text;
    }
  }else{
    answer=await new LocalSalesOSProvider().answer(parsed.data.question,{locale:parsed.data.locale,orgId:m.org_id,userId:user.id});
  }
  await s.from('ai_usage').insert({org_id:m.org_id,user_id:user.id,provider:answer.provider,model:mode==='real'?(process.env.GEMINI_MODEL||'gemini-3.8-flash'):'deterministic',tool_calls:1});
  return NextResponse.json({...answer,mode});
 }catch(error){
  return NextResponse.json({error:error instanceof Error?error.message:'Assistant request failed'},{status:500});
 }
}
