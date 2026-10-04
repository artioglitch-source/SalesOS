'use client';
import Link from 'next/link';
import {usePathname,useRouter} from 'next/navigation';
import {useEffect,useState} from 'react';
import {Command,HelpCircle,LogOut,Moon,Search,Sun,UserRound} from 'lucide-react';
import {toggleTheme} from '@/components/theme-provider';
import {createClient} from '@/lib/supabase/browser';
import {useOrg} from '@/lib/org/context';
import {NotificationBell} from '@/components/notifications/notification-bell';
export function TopBar(){
 const path=usePathname();const router=useRouter();const locale=(path.split('/')[1]||'ar') as 'ar'|'en';const ar=locale==='ar';const {organizations,activeOrgId,setActiveOrgId,role,userId}=useOrg();const [profile,setProfile]=useState<any>(null);
 const openSearch=()=>window.dispatchEvent(new CustomEvent('salesos:command'));const logout=async()=>{await createClient().auth.signOut();router.push('/'+locale+'/login');router.refresh()};
 useEffect(()=>{if(!userId)return;createClient().from('profiles').select('full_name,avatar_url').eq('id',userId).maybeSingle().then(({data})=>setProfile(data))},[userId]);
 return <header className="sticky top-0 z-40 border-b border-neutral-200/80 bg-white/85 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/85"><div className="flex h-16 items-center gap-3 px-4 md:px-7">
  <button onClick={openSearch} className="hidden min-w-0 flex-1 items-center gap-3 rounded-xl border bg-neutral-50 px-3 py-2.5 text-start text-sm text-neutral-400 md:flex dark:border-neutral-800 dark:bg-neutral-900"><Search className="size-4"/><span>{ar?'ابحث، انتقل، أو اكتب أمراً...':'Search, navigate, or type a command...'}</span><kbd className="ms-auto flex items-center gap-1 rounded-lg border px-2 py-1 text-[10px]"><Command className="size-3"/>K</kbd></button>
  <button onClick={openSearch} className="rounded-xl border p-2.5 md:hidden"><Search className="size-4"/></button>
  <div className="ms-auto flex items-center gap-2">{organizations.length>0&&<select aria-label="workspace" value={activeOrgId||''} onChange={e=>setActiveOrgId(e.target.value)} className="max-w-[150px] rounded-xl border bg-transparent px-3 py-2 text-xs md:max-w-[220px]">{organizations.map(o=><option key={o.id} value={o.id}>{o.name}</option>)}</select>}
   <span className="hidden rounded-full border px-3 py-1.5 text-[11px] font-medium text-neutral-500 sm:inline-flex">{role==='owner_admin'?'Owner / Admin':role==='sales_manager'?'Sales Manager':role==='supervisor'?'Supervisor':role==='sales_rep'?'Sales Rep':role==='accountant_hr'?'Accountant / HR':role==='viewer'?'Viewer':''}</span>
   <Link href={'/'+locale+'/help'} aria-label={ar?'المساعدة':'Help'} className="rounded-xl border p-2.5"><HelpCircle className="size-4"/></Link><NotificationBell locale={locale}/><a href={'/'+(ar?'en':'ar')} className="rounded-xl border px-2.5 py-2 text-[11px]">{ar?'EN':'عربي'}</a><button onClick={toggleTheme} className="rounded-xl border p-2.5" aria-label="theme"><Sun className="hidden size-4 dark:block"/><Moon className="size-4 dark:hidden"/></button><button onClick={logout} className="flex items-center gap-2 rounded-xl border px-2.5 py-2 text-xs" aria-label="logout">{profile?.avatar_url?<img src={profile.avatar_url} alt="" className="size-5 rounded-full"/>:<UserRound className="size-4"/>}<span className="hidden lg:inline max-w-28 truncate">{profile?.full_name||''}</span><LogOut className="size-4"/></button>
  </div>
 </div></header>;
}
