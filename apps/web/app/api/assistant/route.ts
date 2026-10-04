import {NextResponse} from 'next/server';
import {createClient} from '@/lib/supabase/server';
import {LocalSalesOSProvider} from '@/core/ai/local-provider';
import {GeminiSalesOSProvider} from '@/lib/ai/gemini-provider';
import {z} from 'zod';

const schema=z.object({question:z.string().min(1).max(2000),locale:z.enum(['ar','en']).default('ar')});

async function readJson(request:Request){
  const raw=await request.text();
  try{return JSON.parse(raw)}catch{return null}
}

export async function POST(req:Request){
  const incoming=await readJson(req);
  const parsed=schema.safeParse(incoming);
  if(!parsed.success)return NextResponse.json({error:'Invalid request body. Send JSON with question and locale.',mode:'error'},{status:400});
  const s=await createClient();
  const {data:{user}}=await s.auth.getUser();
  if(!user)return NextResponse.json({error:'Unauthorized',mode:'error'},{status:401});
  const {data:m}=await s.from('org_members').select('org_id,role').eq('user_id',user.id).eq('status','active').limit(1).maybeSingle();
  if(!m)return NextResponse.json({error:'Organization required',mode:'error'},{status:400});

  const hasGemini=Boolean(process.env.GEMINI_API_KEY||process.env.AI_API_KEY);
  let answer:any;
  if(hasGemini){
    try{
      answer=await new GeminiSalesOSProvider().answer(parsed.data.question,{locale:parsed.data.locale,orgId:m.org_id,userId:user.id});
    }catch(error){
      const message=error instanceof Error?error.message:'Gemini request failed';
      return NextResponse.json({error:message,mode:'gemini-error',provider:'gemini'},{status:502});
    }
  }else{
    answer=await new LocalSalesOSProvider().answer(parsed.data.question,{locale:parsed.data.locale,orgId:m.org_id,userId:user.id});
  }
  await s.from('ai_usage').insert({org_id:m.org_id,user_id:user.id,provider:hasGemini?'gemini':answer.provider,model:hasGemini?(process.env.GEMINI_MODEL||process.env.AI_MODEL||'gemini-3.8-flash'):'deterministic',tool_calls:1});
  return NextResponse.json({...answer,mode:hasGemini?'gemini':'local'});
}
