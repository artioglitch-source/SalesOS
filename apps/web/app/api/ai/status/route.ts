import {NextResponse} from 'next/server';
import {createClient} from '@/lib/supabase/server';

export async function GET(){
 const s=await createClient();
 const {data:{user}}=await s.auth.getUser();
 if(!user)return NextResponse.json({configured:false,authenticated:false},{status:401});
 const {data:membership}=await s.from('org_members').select('org_id').eq('user_id',user.id).eq('status','active').limit(1).maybeSingle();
 if(!membership)return NextResponse.json({configured:false,authenticated:true});
 const key=Boolean(process.env.GEMINI_API_KEY||process.env.AI_API_KEY);
 return NextResponse.json({
   configured:key,
   provider:key?'gemini':'local',
   model:process.env.GEMINI_MODEL||process.env.AI_MODEL||'gemini-3.8-flash',
   authenticated:true,
 });
}
