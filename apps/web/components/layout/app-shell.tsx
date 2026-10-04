'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useState} from 'react';
import {Activity,Boxes,CalendarDays,BriefcaseBusiness,Building2,ChartNoAxesCombined,CheckSquare,Coins,FileBarChart,Gauge,Home,Kanban,Landmark,Layers3,Map,Package,Plug,Receipt,Settings,Target,Upload,UserCheck,Users,WalletCards,Sparkles,ChevronLeft,ChevronRight,BookOpen,FileDown,Palette,UserRoundCog} from 'lucide-react';
import {navGroups} from '@/lib/navigation';
import {QuickAdd} from '@/components/quick-add/quick-add';

const icons:Record<string,any>={home:Home,receipt:Receipt,building:Building2,users:Users,target:Target,briefcase:BriefcaseBusiness,kanban:Kanban,activity:Activity,check:CheckSquare,wallet:WalletCards,gauge:Gauge,package:Package,map:Map,layers:Layers3,'user-check':UserCheck,sparkles:Sparkles,chart:ChartNoAxesCombined,coins:Coins,landmark:Landmark,report:FileBarChart,bell:Activity,bot:Sparkles,calendar:CalendarDays,upload:Upload,plug:Plug,settings:Settings,staff:Users,exports:FileDown,help:BookOpen,themes:Palette,'user-round-cog':UserRoundCog};

function groupLabel(label:string,ar:boolean){
 const map:any={workspace:ar?'مساحة العمل':'Workspace',operations:ar?'التشغيل':'Operations','people & finance':ar?'الأشخاص والمالية':'People & finance','insights & platform':ar?'الرؤية والمنصة':'Insights & platform'};
 return map[label]||label;
}

export function AppShell({children}:{children:React.ReactNode}){
 const path=usePathname();const locale=path.split('/')[1]==='en'?'en':'ar';const ar=locale==='ar';const [collapsed,setCollapsed]=useState(false);
 return <div className="salesos-shell min-h-screen">
  <aside className={"salesos-sidebar fixed inset-y-0 start-0 z-50 flex flex-col border-e p-3 "+(collapsed?'is-collapsed':'')}>
   <div className="flex items-center justify-between gap-2 px-2 py-2"><Link href={'/'+locale} className="flex min-w-0 items-center gap-3"><span className="salesos-brand flex size-10 shrink-0 items-center justify-center rounded-2xl"><Boxes className="size-5"/></span>{!collapsed&&<div><span className="block text-sm font-bold tracking-tight">SalesOS</span><span className="block text-[10px] uppercase tracking-[.18em] salesos-muted">{ar?'مدير المبيعات':'Manager OS'}</span></div>}</Link><button onClick={()=>setCollapsed(v=>!v)} className="rounded-xl border p-2 salesos-muted" aria-label={ar?'طي/فتح القائمة':'Toggle sidebar'}>{collapsed?<ChevronRight className="size-4"/>:<ChevronLeft className="size-4"/></button></div>
   <div className="mt-5 flex-1 overflow-y-auto pe-1"><div className="space-y-6">{navGroups.map(group=><div key={group.label}><p className={(collapsed?'sr-only ':'')+'mb-2 px-3 text-[10px] font-semibold uppercase tracking-[.16em] salesos-muted'}>{groupLabel(group.label,ar)}</p><nav className="space-y-1">{group.items.map(item=>{const Icon=icons[item.icon]||Boxes;const href='/'+locale+item.href;const active=path===href||path.startsWith(href+'/');return <Link key={item.id} href={href} title={collapsed?(ar?item.ar:item.en):undefined} className={"salesos-nav-item flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm "+(active?'is-active ':'')+(collapsed?'justify-center':'')}><Icon className="size-4 shrink-0"/>{!collapsed&&<span className="truncate">{ar?item.ar:item.en}</span>}</Link>})}</nav></div>)}</div></div>
   {!collapsed&&<div className="salesos-divider border-t pt-3"><div className="salesos-soft rounded-2xl p-3 text-xs"><div className="font-semibold">{ar?'وضع المدير':'Manager mode'}</div><p className="mt-1 salesos-muted leading-5">{ar?'مركز واحد للمبيعات والعملاء والفريق والتحصيل والرواتب.':'One calm command center for sales, customers, staff, collections, and payroll.'}</p></div></div>}
  </aside>
  <div className="salesos-main min-h-screen"><main>{children}</main></div><QuickAdd locale={locale}/>
 </div>
}