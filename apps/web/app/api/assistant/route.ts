import {NextResponse} from 'next/server';
import {createClient} from '@/lib/supabase/server';
import {LocalSalesOSProvider} from '@/core/ai/local-provider';
import {GeminiSalesOSProvider} from '@/lib/ai/gemini-provider';
import {z} from 'zod';
const schema=z.object({question:z.string().min(1).max(2000),locale:z.enum(['ar','en']).default('ar')});
export async function POST(req:Request){
 try{
  const parsed=schema.safeParse(await req.json());if(!parsed.success)return NextResponse.json({error:'Invalid request'},{status:400});
  const s=await createClient();const {data:{user}}=await s.auth.getUser();if(!user)return NextResponse.json({error:'Unauthorized'},{status:401});
  const {data:m}=await s.from('org_members').select('org_id,role').eq('user_id',user.id).eq('status','active').limit(1).maybeSingle();if(!m)return NextResponse.json({error:'Organization required'},{status:400});
  let answer:any;let mode:'real'|'local'='local';
  if(process.env.GEMINI_API_KEY){try{answer=await new GeminiSalesOSProvider().answer(parsed.data.question,{locale:parsed.data.locale,orgId:m.org_id,userId:user.id});mode='real'}catch(error){answer=await new LocalSalesOSProvider().answer(parsed.data.question,{locale:parsed.data.locale,orgId:m.org_id,userId:user.id});answer.text=(parsed.data.locale==='ar'?'تعذر الوصول إلى Gemini وتم استخدام الوضع المحلي المجاني. السبب: ':'Gemini was unavailable, so the free local mode answered. Reason: ')+(error instanceof Error?error.message:'provider error')+'\n\n'+answer.text}}
  else answer=await new LocalSalesOSProvider().answer(parsed.data.question,{locale:parsed.data.locale,orgId:m.org_id,userId:user.id});
  await s.from('ai_usage').insert({org_id:m.org_id,user_id:user.id,provider:answer.provider,model:mode==='real'?(process.env.GEMINI_MODEL||'gemini-3.8-flash'):'deterministic',tool_calls:1});
  return NextResponse.json({...answer,mode});
 }catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Assistant request failed'},{status:500})}
}