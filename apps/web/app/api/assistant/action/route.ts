import {NextResponse} from 'next/server';
import {createClient} from '@/lib/supabase/server';
import {z} from 'zod';

const schema=z.object({
 type:z.enum(['create_customer','create_lead','create_task','create_staff']),
 name:z.string().max(160).optional(),
 email:z.string().optional(),
 phone:z.string().max(80).optional(),
 company:z.string().max(160).optional(),
 title:z.string().max(200).optional(),
 description:z.string().max(2000).optional(),
 salary:z.number().nonnegative().optional(),
 target:z.number().nonnegative().optional(),
 due_at:z.string().optional()
});

export async function POST(req:Request){
 try{
  const body=await req.json();const action=schema.parse(body.action);const s=await createClient();
  const {data:{user}}=await s.auth.getUser();if(!user)return NextResponse.json({error:'Unauthorized'},{status:401});
  const {data:m}=await s.from('org_members').select('org_id,role').eq('user_id',user.id).eq('status','active').limit(1).maybeSingle();
  if(m?.role!=='owner_admin')return NextResponse.json({error:'Owner permission required'},{status:403});
  let result:any;
  if(action.type==='create_customer'){if(!action.name)throw new Error('Customer name is required');const r=await s.from('accounts').insert({org_id:m.org_id,owner_id:user.id,name:action.name,email:action.email||null,phone:action.phone||null,status:'active'}).select('id,name').single();if(r.error)throw new Error(r.error.message);result=r.data}
  if(action.type==='create_lead'){if(!action.name)throw new Error('Lead name is required');const r=await s.from('leads').insert({org_id:m.org_id,owner_id:user.id,name:action.name,company:action.company||null,email:action.email||null,phone:action.phone||null,status:'new'}).select('id,name').single();if(r.error)throw new Error(r.error.message);result=r.data}
  if(action.type==='create_task'){if(!action.title)throw new Error('Task title is required');const r=await s.from('tasks').insert({org_id:m.org_id,assignee_id:user.id,created_by:user.id,title:action.title,description:action.description||null,due_at:action.due_at||null,priority:'medium',status:'open'}).select('id,title').single();if(r.error)throw new Error(r.error.message);result=r.data}
  if(action.type==='create_staff'){if(!action.name)throw new Error('Staff name is required');const r=await s.from('reps').insert({org_id:m.org_id,full_name:action.name,email:action.email||null,phone:action.phone||null,basic_salary:action.salary||0,monthly_target:action.target||0,job_title:'Sales rep',sales_type:'indoor',active:true}).select('id,full_name').single();if(r.error)throw new Error(r.error.message);result=r.data}
  return NextResponse.json({ok:true,result});
 }catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Invalid AI action'},{status:400})}
}