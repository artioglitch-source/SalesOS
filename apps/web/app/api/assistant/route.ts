import {NextResponse} from 'next/server';
import {createClient} from '@/lib/supabase/server';
import {LocalSalesOSProvider} from '@/core/ai/local-provider';
import {z} from 'zod';

const schema=z.object({question:z.string().min(1).max(2000),locale:z.enum(['ar','en']).default('ar')});

export async function POST(request:Request){
 const body=await request.json();const parsed=schema.safeParse(body);
 if(!parsed.success)return NextResponse.json({error:'Invalid request'},{status:400});
 const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();
 if(!user)return NextResponse.json({error:'Unauthorized'},{status:401});
 const {data:memberships}=await supabase.from('org_members').select('org_id,role').eq('user_id',user.id).eq('status','active');
 const orgId=memberships?.[0]?.org_id;if(!orgId)return NextResponse.json({error:'Organization required'},{status:400});
 const answer=await new LocalSalesOSProvider().answer(parsed.data.question,{locale:parsed.data.locale,orgId,userId:user.id});
 await supabase.from('ai_usage').insert({org_id:orgId,user_id:user.id,provider:'local',model:'deterministic',tool_calls:1});
 return NextResponse.json(answer);
}
