'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {LayoutDashboard,Building2,Users,UserRoundCheck,BriefcaseBusiness,CheckSquare,WalletCards,UserCog,BarChart3,Settings} from 'lucide-react';

const nav=[
  ['dashboard','الرئيسية','Dashboard',LayoutDashboard,'/'],
  ['accounts','الحسابات','Accounts',Building2,'/accounts'],
  ['contacts','جهات الاتصال','Contacts',Users,'/contacts'],
  ['leads','العملاء المحتملون','Leads',UserRoundCheck,'/leads'],
  ['deals','الصفقات','Deals',BriefcaseBusiness,'/deals'],
  ['tasks','المهام','Tasks',CheckSquare,'/tasks'],
  ['finance','المالية','Finance',WalletCards,'/finance'],
  ['hr','الموارد البشرية','HR',UserCog,'/hr'],
  ['reports','التقارير','Reports',BarChart3,'/reports'],
  ['settings','الإعدادات','Settings',Settings,'/settings'],
] as const;

export function AppShell({children}:{children:React.ReactNode}){
  const path=usePathname(); const locale=path.split('/')[1]||'ar'; const en=locale==='en';
  return <div className="min-h-screen bg-neutral-50 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
    <div className="mx-auto flex min-h-screen max-w-[1600px]">
      <aside className="hidden w-64 shrink-0 border-e bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 md:block">
        <div className="mb-7 px-3 text-lg font-semibold">SalesOS</div>
        <nav className="space-y-1">{nav.map(([key,ar,enLabel,Icon,href])=><Link key={key} href={'/'+locale+href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"><Icon className="size-4 shrink-0"/><span>{en?enLabel:ar}</span></Link>)}</nav>
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  </div>;
}
