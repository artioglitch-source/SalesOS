'use client';

import Link from 'next/link';
import {useEffect,useMemo,useState} from 'react';
import {Activity,AlertTriangle,ArrowUpRight,BriefcaseBusiness,Building2,CalendarDays,CheckCircle2,Coins,Receipt,Target,TrendingUp,Users} from 'lucide-react';
import {createClient} from '@/lib/supabase/browser';
import {useOrg} from '@/lib/org/context';
import {MetricCard,Card,PageHeader,StatusPill,EmptyState} from '@/components/ui/primitives';
import {SalesChart} from '@/components/dashboard/sales-chart';
import {PipelineChart} from '@/components/dashboard/pipeline-chart';

function roleName(role:string|null,ar:boolean){
 const map:any={owner_admin:ar?'مالك / مدير':'Owner / Admin',sales_manager:ar?'مدير مبيعات':'Sales Manager',supervisor:ar?'مشرف':'Supervisor',sales_rep:ar?'مندوب مبيعات':'Sales Rep',accountant_hr:ar?'محاسب / موارد بشرية':'Accountant / HR',viewer:ar?'مشاهد':'Viewer'};
 return map[role||'']||'';
}

export function Dashboard({locale}:{locale:'ar'|'en'}){
 const ar=locale==='ar';const s=useMemo(()=>createClient() as any,[]);const {activeOrgId,userId,role,organizations}=useOrg();
 const privileged=['owner_admin','sales_manager','supervisor','accountant_hr','viewer'].includes(role??'');
 const [loading,setLoading]=useState(true);
 const [stats,setStats]=useState({sales:0,target:0,achievement:0,gp:0,gpPct:0,collection:0,accounts:0,activeCustomers:0,pipeline:0,openDeals:0,tasks:0,alerts:0,quotes:0});
 const [attention,setAttention]=useState<any[]>([]);const [ranking,setRanking]=useState<any[]>([]);const [upcoming,setUpcoming]=useState<any[]>([]);
 const load=async()=>{
  if(!activeOrgId){setLoading(false);return}
  setLoading(true);
  const start=new Date();start.setDate(1);start.setHours(0,0,0,0);const startDate=start.toISOString().slice(0,10);
  const [inv,pay,a,health,deals,tasks,alerts,quotes,acts,repData]=await Promise.all([
   s.from('invoices').select('id,total,status').eq('org_id',activeOrgId).gte('issue_date',startDate).neq('status','void'),
   s.from('payments').select('amount').eq('org_id',activeOrgId).eq('status','received').gte('payment_date',startDate),
   s.from('accounts').select('*',{count:'exact',head:true}).eq('org_id',activeOrgId).eq('status','active'),
   s.from('v_customer_health').select('id,name,last_purchase,health_status').eq('org_id',activeOrgId).in('health_status',['INACTIVE','NO_SALES']).limit(5),
   s.from('deals').select('id,title,value,status,expected_close_date').eq('org_id',activeOrgId).eq('status','open').order('value',{ascending:false}).limit(7),
   s.from('tasks').select('id,title,due_at,priority,status').eq('org_id',activeOrgId).neq('status','done').order('due_at').limit(6),
   s.from('alerts').select('id,title,severity,status,suggested_action').eq('org_id',activeOrgId).neq('status','resolved').order('created_at',{ascending:false}).limit(6),
   s.from('quotes').select('id,quote_number,value,stage,follow_up_date').eq('org_id',activeOrgId).in('stage',['sent','negotiation']).order('follow_up_date').limit(6),
   s.from('activities').select('id,subject,type,scheduled_at').eq('org_id',activeOrgId).gte('scheduled_at',new Date().toISOString()).order('scheduled_at').limit(6),
   privileged?s.from('v_rep_month').select('rep_id,profile_id,sales,target,achievement,status').eq('org_id',activeOrgId).order('achievement',{ascending:false}).limit(8):s.from('reps').select('id,profile_id').eq('org_id',activeOrgId).eq('profile_id',userId||'').limit(1)
  ]);
  const totalSales=(inv.data||[]).reduce((n:number,r:any)=>n+Number(r.total||0),0);
  const collection=(pay.data||[]).reduce((n:number,r:any)=>n+Number(r.amount||0),0);
  let gp=0,gpPct=0,target=0,achievement=0;
  if(privileged){
   const {data:trend}=await s.from('v_monthly_trend').select('sales,gp').eq('org_id',activeOrgId).order('period_month',{ascending:false}).limit(1);
   gp=Number(trend?.[0]?.gp||0);const recentSales=Number(trend?.[0]?.sales||totalSales);gpPct=recentSales?gp/recentSales*100:0;
   const first=(repData.data||[])[0];if(first){target=Number(first.target||0);achievement=Number(first.achievement||0)}
  }else{
   const rep=repData.data?.[0];
   if(rep){
    const {data:rInv}=await s.from('invoices').select('total').eq('org_id',activeOrgId).eq('rep_id',rep.id).gte('issue_date',startDate).neq('status','void');
    const ownSales=(rInv||[]).reduce((n:number,r:any)=>n+Number(r.total||0),0);
    const {data:rTarget}=await s.from('targets').select('value').eq('org_id',activeOrgId).eq('scope','rep').eq('scope_id',rep.id).eq('metric','sales').order('period',{ascending:false}).limit(1);
    target=Number(rTarget?.[0]?.value||0);achievement=target?ownSales/target:0;
   }
  }
  const pipeline=(deals.data||[]).reduce((n:number,r:any)=>n+Number(r.value||0),0);
  setStats({sales:totalSales,target,achievement,gp,gpPct,collection,accounts:a.count||0,activeCustomers:a.count||0,pipeline,openDeals:deals.data?.length||0,tasks:tasks.data?.length||0,alerts:alerts.data?.length||0,quotes:quotes.data?.length||0});
  const customerAttention=(health.data||[]).map((x:any)=>({id:x.id,title:(ar?'عميل يحتاج متابعة: ':'Customer follow-up: ')+x.name,severity:x.health_status==='INACTIVE'?'high':'medium',kind:'customer',suggested_action:x.health_status}));
  setAttention([...(alerts.data||[]).map((x:any)=>({...x,kind:'alert'})),...customerAttention].slice(0,7));
  setRanking(privileged?(repData.data||[]):[]);
  setUpcoming([...(acts.data||[]).map((x:any)=>({...x,kind:'activity',when:x.scheduled_at,label:x.subject})),...(tasks.data||[]).map((x:any)=>({...x,kind:'task',when:x.due_at,label:x.title}))].sort((x:any,y:any)=>new Date(x.when||0).getTime()-new Date(y.when||0).getTime()).slice(0,7));
  setLoading(false);
 };
 useEffect(()=>{load()},[activeOrgId,role,userId]);

 const quick=[['/sales/new',Receipt,ar?'بيع سريع':'Quick sale'],['/accounts',Building2,ar?'عميل جديد':'New customer'],['/activities/new',Activity,ar?'زيارة / متابعة':'Visit / follow-up'],['/pipeline/new',BriefcaseBusiness,ar?'عرض سعر':'New quote'],['/collections',Coins,ar?'تحصيل':'Collection']] as const;
 const targetText=stats.target?(ar?'هدف '+stats.target.toLocaleString()+' EGP':'Target '+stats.target.toLocaleString()+' EGP'):'';
 return <section className="space-y-6 p-4 md:p-7">
  <PageHeader eyebrow={organizations[0]?.name||'SalesOS'} title={ar?'مركز قيادة المبيعات':'Sales command center'} description={ar?'النتائج، المخاطر، الفرص، والعمل القادم في شاشة واحدة.':'Results, risks, opportunities, and next actions in one calm workspace.'} actions={<div className="flex items-center gap-2 text-xs text-neutral-500"><span>{roleName(role,ar)}</span><Link href={'/'+locale+'/settings'} className="rounded-xl border px-3 py-2">{ar?'الإعدادات':'Settings'}</Link></div>}/>
  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
   <MetricCard label={ar?'مبيعات الشهر':'Month sales'} value={loading?'—':stats.sales.toLocaleString()+' EGP'} sub={targetText} href={'/'+locale+'/sales'} icon={<Receipt className="size-4"/>}/>
   <MetricCard label={ar?'تحقيق الهدف':'Achievement'} value={loading?'—':(stats.achievement*100).toFixed(1)+'%'} sub={stats.achievement>=1?(ar?'تجاوز الهدف':'Above target'):stats.achievement>=0.8?(ar?'على المسار':'On track'):(ar?'يحتاج إجراء':'Action')} href={'/'+locale+'/performance'} icon={<Target className="size-4"/>}/>
   <MetricCard label="GP%" value={privileged?(loading?'—':stats.gpPct.toFixed(1)+'%'):(ar?'مخفي':'Hidden')} sub={privileged?(stats.gpPct<10?(ar?'هامش منخفض':'Low margin'):ar?'هامش صحي':'Healthy'):''} href={privileged?'/'+locale+'/reports':undefined} icon={<TrendingUp className="size-4"/>}/>
   <MetricCard label={ar?'التحصيل':'Collections'} value={loading?'—':stats.collection.toLocaleString()+' EGP'} href={'/'+locale+'/collections'} icon={<Coins className="size-4"/>}/>
   <MetricCard label={ar?'العملاء النشطون':'Active customers'} value={loading?'—':stats.activeCustomers} href={'/'+locale+'/accounts'} icon={<Users className="size-4"/>}/>
  </div>
  <div className="flex flex-wrap gap-2">{quick.map(([href,Icon,label])=><Link key={href} href={'/'+locale+href} className="inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2.5 text-sm hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900"><Icon className="size-4"/>{label}</Link>)}</div>
  <div className="grid gap-4 xl:grid-cols-2"><SalesChart locale={locale}/><PipelineChart locale={locale}/></div>
  <div className="grid gap-4 xl:grid-cols-[1.15fr_.85fr]">
   <Card><div className="flex items-center justify-between border-b p-5 dark:border-neutral-800"><div><h2 className="font-semibold">{ar?'يحتاج انتباه':'Needs attention'}</h2><p className="mt-1 text-xs text-neutral-500">{ar?'أهم المخاطر والإجراءات الآن.':'Most important risks and actions now.'}</p></div><Link href={'/'+locale+'/alerts'} className="text-xs font-medium hover:underline">{ar?'كل التنبيهات':'View all'}</Link></div><div className="divide-y dark:divide-neutral-800">{attention.map(x=><Link href={x.kind==='customer'?'/'+locale+'/accounts/'+x.id:'/'+locale+'/alerts'} key={x.kind+x.id} className="flex items-start gap-3 p-4 hover:bg-neutral-50 dark:hover:bg-neutral-950"><span className="mt-0.5 rounded-lg border p-2">{x.kind==='customer'?<Building2 className="size-4"/>:<AlertTriangle className="size-4" />}</span><div className="min-w-0 flex-1"><div className="text-sm font-medium">{x.title}</div><div className="mt-1 text-xs text-neutral-500">{x.suggested_action||''}</div></div><StatusPill status={x.severity||'medium'}/></Link>)}{attention.length===0&&<EmptyState title={ar?'لا توجد مخاطر':'All clear'} description={ar?'لا توجد إجراءات عالية الأولوية الآن.':'No high-priority issues right now.'}/>}</div></Card>
   <Card><div className="flex items-center justify-between border-b p-5 dark:border-neutral-800"><div><h2 className="font-semibold">{ar?'القادم':'Up next'}</h2><p className="mt-1 text-xs text-neutral-500">{ar?'الزيارات والمهام القادمة.':'Upcoming activities and tasks.'}</p></div><CalendarDays className="size-4 text-neutral-400"/></div><div className="divide-y dark:divide-neutral-800">{upcoming.map(x=><div key={x.kind+x.id} className="flex items-center gap-3 p-4"><span className="rounded-lg border p-2">{x.kind==='task'?<CheckCircle2 className="size-4"/>:<Activity className="size-4" />}</span><div className="min-w-0 flex-1"><div className="truncate text-sm font-medium">{x.label}</div><div className="mt-1 text-xs text-neutral-500">{x.when?new Date(x.when).toLocaleString(locale):'—'}</div></div></div>)}{upcoming.length===0&&<EmptyState title={ar?'جدول فارغ':'No upcoming work'} description={ar?'أضف نشاطاً أو مهمة.':'Add an activity or task.'}/>}</div></Card>
  </div>
  {privileged&&<div className="grid gap-4 xl:grid-cols-2">
   <Card><div className="flex items-center justify-between border-b p-5"><div><h2 className="font-semibold">{ar?'ترتيب المندوبين':'Rep ranking'}</h2><p className="mt-1 text-xs text-neutral-500">{ar?'الترتيب حسب الإنجاز فقط، بدون بيانات الرواتب.':'Ranked by achievement, no pay data.'}</p></div><ArrowUpRight className="size-4 text-neutral-400"/></div><div className="divide-y dark:divide-neutral-800">{ranking.map((r:any,i:number)=><div key={r.rep_id||r.id} className="flex items-center gap-3 p-4"><span className="flex size-7 items-center justify-center rounded-full bg-neutral-100 text-xs font-semibold dark:bg-neutral-800">{i+1}</span><div className="min-w-0 flex-1"><div className="font-mono text-xs">{r.rep_id||r.id}</div><div className="mt-1 text-xs text-neutral-500">{Number(r.sales||0).toLocaleString()} / {Number(r.target||0).toLocaleString()}</div></div><StatusPill status={r.status||((Number(r.achievement||0)>=1)?'EXCEED':Number(r.achievement||0)>=.8?'ON TRACK':'ACTION')}/><div className="w-16 text-end text-sm font-semibold">{(Number(r.achievement||0)*100).toFixed(1)}%</div></div>)}{ranking.length===0&&<EmptyState title={ar?'لا يوجد ترتيب بعد':'No ranking yet'} description={ar?'أضف مندوبي مبيعات وأهداف شهرية.':'Add reps and monthly targets.'}/>}</div></Card>
   <Card><div className="border-b p-5"><h2 className="font-semibold">{ar?'إشارات التشغيل':'Operating signals'}</h2><p className="mt-1 text-xs text-neutral-500">{ar?'اختصارات سريعة لحالة الفريق.':'Fast signals from the current workspace.'}</p></div><div className="grid grid-cols-2 gap-3 p-5">{[[ar?'الفرص المفتوحة':'Open deals',stats.openDeals,'/'+locale+'/pipeline'],[ar?'قيمة الـPipeline':'Pipeline value',stats.pipeline.toLocaleString()+' EGP','/'+locale+'/pipeline'],[ar?'المهام المفتوحة':'Open tasks',stats.tasks,'/'+locale+'/tasks'],[ar?'التنبيهات':'Alerts',stats.alerts,'/'+locale+'/alerts'],[ar?'العروض النشطة':'Open quotes',stats.quotes,'/'+locale+'/pipeline']].map(([label,value,href])=><Link href={String(href)} key={String(href)} className="rounded-2xl border p-4 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-950"><div className="text-xs text-neutral-500">{label}</div><div className="mt-2 text-2xl font-semibold tabular-nums">{value}</div></Link>)}</div></Card>
  </div>}
 </section>
}
