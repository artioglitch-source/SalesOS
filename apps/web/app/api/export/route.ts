import {NextResponse} from 'next/server';
import {createClient} from '@/lib/supabase/server';

const tables=['accounts','contacts','leads','deals','pipeline_stages','products','product_groups','regions','teams','reps','invoices','invoice_lines','payments','payment_allocations','quotes','quote_lines','activities','tasks','targets','targets_history','daily_reports','weekly_plans','category_plans','kpi_templates','kpi_metrics','kpi_evaluations','kpi_scores','commission_plans','commission_tiers','gp_factor_tiers','bonus_rules','payroll_entries','payroll_runs','payroll_lines','commissions','alerts','alert_rules','notifications','custom_fields','automations','webhooks','extensions','extension_installs'];

export async function GET(){
 const supabase=await createClient();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)return NextResponse.json({error:'Unauthorized'},{status:401});
 const {data:membership}=await supabase.from('org_members').select('org_id,role').eq('user_id',user.id).eq('status','active').eq('role','owner_admin').limit(1).maybeSingle();
 if(!membership)return NextResponse.json({error:'Owner permission required'},{status:403});
 const out:any={version:1,exported_at:new Date().toISOString(),org_id:membership.org_id,tables:{}};
 for(const table of tables){
  const {data,error}=await supabase.from(table).select('*').eq('org_id',membership.org_id).limit(5000);
  if(error)return NextResponse.json({error:'Export failed for '+table+': '+error.message},{status:500});
  out.tables[table]=data??[];
 }
 return new NextResponse(JSON.stringify(out),{headers:{'content-type':'application/json; charset=utf-8','content-disposition':'attachment; filename="salesos-backup.json"'}});
}
