import {NextResponse} from 'next/server';
import {createClient} from '@/lib/supabase/server';
import {LocalSalesOSProvider} from '@/core/ai/local-provider';
import {ExternalSalesOSProvider} from '@/lib/ai/external-provider';
import {z} from 'zod';

const schema=z.object({question:z.string().min(1).max(2000),locale:z.enum(['ar','en']).default('ar')});

export async function POST(req:Request){
 const parsed=schema.safeParse(await req.json());
 if(!parsed.success)return NextResponse.json({error:'Invalid request'},{status:400});
 const s=await createClient();
 const {data:{user}}=await s.auth.getUser();
 if(!user)return NextResponse.json({error:'Unauthorized'},{status:401});
 const {data:m}=await s.from('org_members').select('org_id,role').eq('user_id',user.id).eq('status','active').limit(1).maybeSingle();
 if(!m)return NextResponse.json({error:'Organization required'},{status:400});

 let answer:any;
 const realReady=Boolean((process.env.GEMINI_API_KEY&&process.env.GEMINI_MODEL) || (process.env.AI_API_KEY&&process.env.AI_MODEL));
 if(realReady){
   try{
     answer=await new ExternalSalesOSProvider().answer(parsed.data.question,{locale:parsed.data.locale,orgId:m.org_id,userId:user.id});
   }catch{
     answer=await new LocalSalesOSProvider().answer(parsed.data.question,{locale:parsed.data.locale,orgId:m.org_id,userId:user.id});
     answer.text=(parsed.data.locale==='ar'?'تعذر الوصول إلى النموذج الحقيقي، وتم استخدام الوضع المحلي المجاني. ':'The real model was unavailable, so the free local mode answered. ')+answer.text;
   }
 }else{
   answer=await new LocalSalesOSProvider().answer(parsed.data.question,{locale:parsed.data.locale,orgId:m.org_id,userId:user.id});
 }
 await s.from('ai_usage').insert({
   org_id:m.org_id,
   user_id:user.id,
   provider:answer.provider,
   model:answer.provider==='external'?(process.env.GEMINI_MODEL||process.env.AI_MODEL||'external'):'deterministic',
   tool_calls:1
 });
 return NextResponse.json({...answer,mode:answer.provider==='external'?'real':'local'});
}