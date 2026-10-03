import { withSupabase } from 'npm:@supabase/server@1';

const cors={
  'Access-Control-Allow-Origin':'*',
  'Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type',
};

function response(body:unknown,status=200){
  return Response.json(body,{status,headers:corSHeaders});
}
const corSHeaders={...cors,'Content-Type':'application/json'};

function slugify(value:string){
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')||'salesos-org';
}

export default {
 fetch: withSupabase({auth:'user'}, async (req,ctx) => {
  if(req.method==='OPTIONS') return new Response('ok',{headers:cors});
  if(req.method!=='POST') return response({error:'Method not allowed'},405);
  const body=await req.json().catch(()=>({}));const name=String(body.name??'').trim();const uid=ctx.userClaims?.sub;
  if(!uid)return response({error:'Unauthorized'},401);
  if(name.length<2)return response({error:'Organization name required'},400);
  const slug=slugify(name)+'-'+crypto.randomUUID().replaceAll('-','').slice(0,8);
  const {data:org,error:orgError}=await ctx.supabaseAdmin.from('organizations').insert({name,slug,created_by:uid}).select('id,name,slug').single();
  if(orgError)return response({error:orgError.message},400);
  const orgId=org.id;
  const rollback=async(error:unknown)=>{await ctx.supabaseAdmin.from('organizations').delete().eq('id',orgId);return response({error:error instanceof Error?error.message:String(error)},400)};
  const writes=await Promise.all([
   ctx.supabaseAdmin.from('org_members').insert({org_id:orgId,user_id:uid,role:'owner_admin',status:'active'}),
   ctx.supabaseAdmin.from('org_settings').insert({org_id:orgId,default_currency:'EGP',locale:'ar',timezone:'Africa/Cairo',working_days:[0,1,2,3,4]}),
   ctx.supabaseAdmin.from('feature_flags').insert([{org_id:orgId,key:'crm',enabled:true},{org_id:orgId,key:'finance',enabled:true},{org_id:orgId,key:'hr',enabled:true},{org_id:orgId,key:'ai',enabled:false}]),
   ctx.supabaseAdmin.from('pipeline_stages').insert([{org_id:orgId,name:'Prospecting',stage_order:1,probability:10,is_closed:false},{org_id:orgId,name:'Qualification',stage_order:2,probability:30,is_closed:false},{org_id:orgId,name:'Proposal',stage_order:3,probability:60,is_closed:false},{org_id:orgId,name:'Negotiation',stage_order:4,probability:80,is_closed:false},{org_id:orgId,name:'Won',stage_order:5,probability:100,is_closed:true},{org_id:orgId,name:'Lost',stage_order:6,probability:0,is_closed:true}]),
   ctx.supabaseAdmin.from('product_groups').insert([{org_id:orgId,name:'Kitchen Tools'},{org_id:orgId,name:'Flavors'},{org_id:orgId,name:'Food'},{org_id:orgId,name:'Other'}]),
   ctx.supabaseAdmin.from('kpi_templates').insert([{org_id:orgId,name:'Indoor',applies_to:'indoor',bands:{excellent:90,very_good:80,needs_development:70}},{org_id:orgId,name:'Outdoor',applies_to:'outdoor',bands:{excellent:90,very_good:80,needs_development:70}},{org_id:orgId,name:'Arabic',applies_to:'arabic',bands:{excellent:90,very_good:75,needs_development:60}}]),
   ctx.supabaseAdmin.from('commission_plans').insert([{org_id:orgId,name:'tiered_gp',formula_type:'tiered_gp',params:{collection_gate:'review',kpi_bonus:true}},{org_id:orgId,name:'flat_plus_bonus',formula_type:'flat_plus_bonus',params:{flat_rate:0.01,over_target_bonus:5000,over_target_achievement:1.1}}]),
   ctx.supabaseAdmin.from('alert_rules').insert([{org_id:orgId,key:'rep_below_target',label:'Rep below 80% target',severity:'high',params:{threshold:0.8}},{org_id:orgId,key:'customer_inactive',label:'Customer inactive > 90 days',severity:'high',params:{days:90}},{org_id:orgId,key:'low_gp',label:'Gross profit below 10%',severity:'high',params:{gp_pct:0.1}},{org_id:orgId,key:'quote_overdue',label:'Quote follow-up overdue',severity:'medium',params:{}},{org_id:orgId,key:'forecast_risk',label:'Forecast below 90% target',severity:'high',params:{threshold:0.9}}]),
  ]);
  const writeError=writes.find((w:any)=>w.error)?.error;if(writeError)return rollback(writeError);
  const {data:templates,error:templateError}=await ctx.supabaseAdmin.from('kpi_templates').select('id,name').eq('org_id',orgId);
  if(templateError)return rollback(templateError);
  const indoor=templates?.find((x:any)=>x.name==='Indoor')?.id;const outdoor=templates?.find((x:any)=>x.name==='Outdoor')?.id;const arabic=templates?.find((x:any)=>x.name==='Arabic')?.id;
  const metrics=[
   [indoor,'sales_achievement','تحقيق المبيعات','Sales Achievement','business_result',40,'percent'],
   [indoor,'active_customers','العملاء النشطون','Active Customers','customer_development',15,'count'],
   [indoor,'new_customers','العملاء الجدد','New Customers','customer_development',10,'count'],
   [indoor,'quote_conversion','تحويل العروض','Quote Conversion','business_result',10,'percent'],
   [indoor,'repeat_followup','إعادة الشراء والمتابعة','Repeat Purchase / Follow-up','sales_activity',10,'percent'],
   [indoor,'aov','متوسط قيمة الطلب','Average Order Value','business_result',5,'currency'],
   [indoor,'collections','متابعة التحصيل','Collections Follow-up','sales_activity',5,'percent'],
   [indoor,'crm_discipline','انضباط CRM والتقارير','CRM & Reports Discipline','quality_discipline',5,'percent'],
   [outdoor,'sales_achievement','تحقيق المبيعات','Sales Achievement','business_result',40,'percent'],
   [outdoor,'visits','الزيارات الفعلية','Actual Visits','sales_activity',15,'count'],
   [outdoor,'new_customers','العملاء الجدد','New Customers','customer_development',15,'count'],
   [outdoor,'visit_conversion','تحويل الزيارة إلى فرصة/طلب','Visit-to-Opportunity/Order Conversion','business_result',10,'percent'],
   [outdoor,'reactivated','العملاء المعاد تنشيطهم','Reactivated Customers','customer_development',5,'count'],
   [outdoor,'aov','متوسط قيمة الطلب','Average Order Value','business_result',5,'currency'],
   [outdoor,'collections','التحصيل','Collections','sales_activity',5,'percent'],
   [outdoor,'route_discipline','انضباط التقارير والمسار','Reports & Route Discipline','quality_discipline',5,'percent'],
   [arabic,'sales','المبيعات','Sales','business_result',30,'percent'],
   [arabic,'new_customers','العملاء الجدد','New Customers','customer_development',15,'count'],
   [arabic,'activity','النشاط','Activity','sales_activity',10,'count'],
   [arabic,'quote_conversion','تحويل العروض','Quote Conversion','business_result',15,'percent'],
   [arabic,'customer_growth','نمو العملاء','Customer Growth','customer_development',10,'percent'],
   [arabic,'collection','التحصيل','Collection','sales_activity',10,'percent'],
   [arabic,'reports','التقارير','Reports','quality_discipline',5,'percent'],
   [arabic,'product_knowledge','معرفة المنتجات','Product Knowledge','quality_discipline',5,'percent'],
  ].filter((x:any)=>x[0]).map((x:any)=>({org_id:orgId,template_id:x[0],key:x[1],label_ar:x[2],label_en:x[3],category:x[4],weight:x[5],measurement:x[6],source:'manual',target_value:100,cap_pct:100}));
  const {error:metricsError}=await ctx.supabaseAdmin.from('kpi_metrics').insert(metrics);if(metricsError)return rollback(metricsError);
  const {data:plans,error:plansError}=await ctx.supabaseAdmin.from('commission_plans').select('id,name').eq('org_id',orgId);if(plansError)return rollback(plansError);
  const tiered=plans?.find((x:any)=>x.name==='tiered_gp')?.id;const flat=plans?.find((x:any)=>x.name==='flat_plus_bonus')?.id;
  if(tiered){
   const {error:e1}=await ctx.supabaseAdmin.from('commission_tiers').insert([{org_id:orgId,plan_id:tiered,achievement_from:0,achievement_to:0.70,rate:0},{org_id:orgId,plan_id:tiered,achievement_from:0.70,achievement_to:0.80,rate:0.0025},{org_id:orgId,plan_id:tiered,achievement_from:0.80,achievement_to:0.90,rate:0.004},{org_id:orgId,plan_id:tiered,achievement_from:0.90,achievement_to:1.00,rate:0.006},{org_id:orgId,plan_id:tiered,achievement_from:1.00,achievement_to:1.10,rate:0.008},{org_id:orgId,plan_id:tiered,achievement_from:1.10,achievement_to:1.20,rate:0.010},{org_id:orgId,plan_id:tiered,achievement_from:1.20,achievement_to:null,rate:0.012}]);
   if(e1)return rollback(e1);
   const {error:e2}=await ctx.supabaseAdmin.from('gp_factor_tiers').insert([{org_id:orgId,plan_id:tiered,gp_from:0,gp_to:0.10,factor:0},{org_id:orgId,plan_id:tiered,gp_from:0.10,gp_to:0.15,factor:0.85},{org_id:orgId,plan_id:tiered,gp_from:0.15,gp_to:0.20,factor:1},{org_id:orgId,plan_id:tiered,gp_from:0.20,gp_to:null,factor:1.10}]);
   if(e2)return rollback(e2);
   const {error:e3}=await ctx.supabaseAdmin.from('bonus_rules').insert([{org_id:orgId,plan_id:tiered,type:'kpi',thresholds:{lt70:0,'70':500,'80':1000,'90':1500,'95':2000}},{org_id:orgId,plan_id:tiered,type:'collection_gate',thresholds:{threshold:1,behavior:'review'}}]);
   if(e3)return rollback(e3);
  }
  if(flat){const {error:e4}=await ctx.supabaseAdmin.from('bonus_rules').insert({org_id:orgId,plan_id:flat,type:'over_target',thresholds:{achievement:1.1,amount:5000}});if(e4)return rollback(e4);}
  const {error:auditError}=await ctx.supabaseAdmin.from('audit_logs').insert({org_id:orgId,actor_id:uid,action:'organization.created',entity_type:'organization',entity_id:orgId,metadata:{name}});
  if(auditError)return rollback(auditError);
  return response({org_id:orgId,organization:org});
 })
};
