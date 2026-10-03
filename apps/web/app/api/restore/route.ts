import {NextResponse} from 'next/server';
import {createClient} from '@/lib/supabase/server';
import {z} from 'zod';

const rowSchema=z.record(z.string(),z.unknown());
const bodySchema=z.object({tables:z.record(z.string(),z.array(rowSchema))});
const allow=new Set(['accounts','contacts','leads','deals','pipeline_stages','products','product_groups','regions','teams','reps','invoices','invoice_lines','payments','payment_allocations','quotes','quote_lines','activities','tasks','targets','targets_history','daily_reports','weekly_plans','category_plans','kpi_templates','kpi_metrics','kpi_evaluations','kpi_scores','commission_plans','commission_tiers','gp_factor_tiers','bonus_rules','payroll_entries','payroll_runs','payroll_lines','commissions','alerts','alert_rules','notifications','custom_fields','automations','webhooks','extensions','extension_installs']);

export async function POST(request:Request){
 const supabase=await createClient();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)return NextResponse.json({error:'Unauthorized'},{status:401});
 const {data:m}=await supabase.from('org_members').select('org_id,role').eq('user_id',user.id).eq('status','active').eq('role','owner_admin').limit(1).maybeSingle();
 if(!m)return NextResponse.json({error:'Owner permission required'},{status:403});
 const parsed=bodySchema.safeParse(await request.json());
 if(!parsed.success)return NextResponse.json({error:'Invalid backup file'},{status:400});
 let count=0;
 for(const [table,rows] of Object.entries(parsed.data.tables)){
  if(!allow.has(table)||!rows.length)continue;
  const payload=rows.slice(0,5000).map(row=>({...row,org_id:m.org_id}));
  const {error}=await (supabase as any).from(table).upsert(payload,{onConflict:'id'});
  if(error)return NextResponse.json({error:'Restore failed for '+table+': '+error.message},{status:400});
  count+=payload.length;
 }
 return NextResponse.json({ok:true,rows:count});
}
