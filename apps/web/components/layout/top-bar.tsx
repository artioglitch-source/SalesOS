'use client';

import Link from 'next/link';
import {usePathname,useRouter} from 'next/navigation';
import {Moon,Sun,LogOut} from 'lucide-react';
import {toggleTheme} from '@/components/theme-provider';
import {createClient} from '@/lib/supabase/browser';
import {useOrg} from '@/lib/org/context';

export function TopBar() {
  const path=usePathname();
  const router=useRouter();
  const locale=path.split('/')[1]||'ar';
  const {organizations,activeOrgId,setActiveOrgId}=useOrg();
  const logout=async()=>{await createClient().auth.signOut(); router.push('/'+locale+'/login'); router.refresh();};
  const switchLocale=locale==='ar'?'en':'ar';
  return <header className="sticky top-0 z-20 mb-6 flex items-center justify-between gap-3 border-b bg-white/90 px-4 py-3 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/90">
    <div className="flex items-center gap-3">
      <span className="font-semibold md:hidden">SalesOS</span>
      {organizations.length>0&&<select value={activeOrgId??''} onChange={e=>setActiveOrgId(e.target.value)} className="max-w-48 rounded-lg border bg-transparent px-2 py-1.5 text-sm">
        {organizations.map(o=><option key={o.id} value={o.id}>{o.name}</option>)}
      </select>}
    </div>
    <div className="flex items-center gap-1">
      <Link href={'/'+switchLocale} className="rounded-lg border px-2.5 py-1.5 text-xs">{locale==='ar'?'EN':'عربي'}</Link>
      <button onClick={toggleTheme} aria-label="theme" className="rounded-lg border p-2"><Sun className="hidden size-4 dark:block"/><Moon className="size-4 dark:hidden"/></button>
      <button onClick={logout} aria-label="logout" className="rounded-lg border p-2"><LogOut className="size-4"/></button>
    </div>
  </header>;
}
