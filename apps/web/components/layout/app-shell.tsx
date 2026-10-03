'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {LayoutDashboard,Boxes} from 'lucide-react';
import {getModuleManifests} from '@/core/registry/registry';
import {MobileNav} from '@/components/mobile-nav';

export function AppShell({children}:{children:React.ReactNode}){
 const path=usePathname();const locale=path.split('/')[1]||'ar';const en=locale==='en';
 const modules=getModuleManifests();
 return <div className="min-h-screen bg-neutral-50 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
  <div className="mx-auto flex min-h-screen max-w-[1600px]">
   <aside className="hidden w-64 shrink-0 border-e bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 md:block">
    <Link href={'/'+locale} className="mb-7 flex items-center gap-2 px-3 text-lg font-semibold"><Boxes className="size-5"/>SalesOS</Link>
    <nav className="space-y-1">
      <Link href={'/'+locale} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"><LayoutDashboard className="size-4"/>{en?'Dashboard':'الرئيسية'}</Link>
      {modules.map(m=>m.nav?.map(n=><Link key={m.id+n.href} href={'/'+locale+n.href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"><span className="size-4 rounded bg-neutral-200 dark:bg-neutral-700"/>{en?n.label:m.id==='accounts'?'الحسابات':m.id==='contacts'?'جهات الاتصال':m.id==='leads'?'العملاء المحتملون':m.id==='deals'?'الصفقات':m.id==='tasks'?'المهام':m.id==='finance'?'المالية':m.id==='hr'?'الموارد البشرية':m.id==='reports'?'التقارير':m.id==='assistant'?'المساعد':m.id==='settings'?'الإعدادات':m.name}</Link>))}
    </nav>
   </aside>
   <main className="min-w-0 flex-1 pb-20">{children}</main>
  </div>
  <MobileNav/>
 </div>;
}
