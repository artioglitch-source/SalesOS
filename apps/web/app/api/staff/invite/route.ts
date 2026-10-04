import {NextResponse} from 'next/server';
import {createClient as createAdminClient} from '@supabase/supabase-js';
import {createClient} from '@/lib/supabase/server';
import {supabaseUrl} from '@/lib/supabase/config';
import {z} from 'zod';
const schema=z.object({org_id:z.string().uuid(),email:z.string().email(),full_name:z.string().min(1).max(120),locale:z.enum(['ar','en']).default('ar')});
export async function POST(request:Request){
 const parsed=schema.safeParse(await request.json());if(!parsed.success)return NextResponse.json({error:'Name, email, and organization are required.'},{status:400});
 const server=await createClient();const {data:{user}}=await server.auth.getUser();if(!user)return NextResponse.json({error:'Unauthorized'},{status:401});
 const {data:member}=await server.from('org_members').select('role').eq('org_id',parsed.data.org_id).eq('user_id',user.id).eq('status','active').maybeSingle();if(member?.role!=='owner_admin')return NextResponse.json({error:'Owner permission required'},{status:403});
 const secret=process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY;if(!secret)return NextResponse.json({error:'Configure SUPABASE_SECRET_KEY on the server before sending invitations.'},{status:503});
 const admin=createAdminClient(supabaseUrl,secret,{auth:{autoRefreshToken:false,persistSession:false}});
 const {data,error}=await admin.auth.admin.inviteUserByEmail(parsed.data.email,{data:{full_name:parsed.data.full_name}});
 if(error||!data.user)return NextResponse.json({error:error?.message||'Invite failed'},{status:400});
 await admin.from('org_members').upsert({org_id:parsed.data.org_id,user_id:data.user.id,role:'sales_rep',status:'active'},{onConflict:'org_id,user_id'});
 await admin.from('profiles').upsert({id:data.user.id,full_name:parsed.data.full_name,locale:parsed.data.locale,theme:'light'});
 const {data:existing}=await admin.from('reps').select('id').eq('org_id',parsed.data.org_id).eq('profile_id',data.user.id).maybeSingle();
 if(!existing)await admin.from('reps').insert({org_id:parsed.data.org_id,profile_id:data.user.id,full_name:parsed.data.full_name,email:parsed.data.email,active:true,sales_type:'indoor',basic_salary:0,monthly_target:0});
 return NextResponse.json({ok:true});
}