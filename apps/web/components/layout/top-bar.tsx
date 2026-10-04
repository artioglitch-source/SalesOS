'use client';
import Link from 'next/link';
import {usePathname,useRouter} from 'next/navigation';
import {useEffect,useState} from 'react';
import {HelpCircle,LogOut,Moon,Sun,UserRound,WifiOff,Sparkles,Search} from 'lucide-react';
import {toggleTheme} from '@/components/theme-provider';
import {createClient} from '@/lib/supabase/browser';
import {useOrg} from '@/lib/org/context';
import {NotificationBell} from '@/components/notifications/notification-bell';

export function TopBar(){
 const path=usePathname();const router=useRouter();const locale=path.split('/')[1]==='en'?'en':'ar';const ar=locale==='ar';
 const {organizations,activeOrgId,setActiveOrgId,role,userId}=useOrg();const [profile,setProfile]=useState<any>(null);const [online,setOnline]=useState(true);
 useEffect(()=>{if(userId)createClient().from('profiles').select('full_name,avatar_url').eq('id',userId).maybeSingle().then(({data})=>setProfile(data));const on=()=>setOnline(true),off=()=>setOnline(false);setOnline(navigator.onLine);addEventListener('online',on);addEventListener('offline',off);return()=>{removeEventListener('online',on);removeEventListener('offline',off)}},[userId]);
 const openSearch=()=>window.dispatchEvent(new CustomEvent('salesos:command'));const openAI=()=>window.dispatchEvent(new CustomEvent('salesos:assistant'));
 const logout=async()=>{await createClient().auth.signOut();router.push('/'+locale+'/login');router.refresh()};
 return <header className="salesos-topbar sticky top-0 z-40 border-b backdrop-blur"><div className="flex h-[70px] items-center gap-2 px-3 md:px-6">
  <div className="salesos-search hidden min-w-0 flex-1 items-center gap-1 rounded-2xl border p-1 md:flex">
   <button onClick={openSearch} className="flex min-w-0 flex-1 items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm"><Search className="size-4"/><span className="truncate">{ar?'ابحث في SalesOS...':'Search SalesOS...'}</span><kbd className="ms-auto rounded-lg border px-2 py-1 text-[10px]">Ctrl/⌘ K</kbd></button>
   <button onClick={openAI} className="salesos-ai-search-button inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold"><Sparkles className="size-3.5"/>{ar?'اسأل AI':'Ask AI'}</button>
  </div>
  <div className="flex gap-2 md:hidden"><button onClick={openSearch} className="salesos-tool-btn rounded-xl border p-2.5" aria-label="search"><Search className="size-4"/></button><button onClick={openAI} className="salesos-tool-btn rounded-xl border p-2.5" aria-label="ai"><Sparkles className="size-4"/></button></div>
  <div className="ms-auto flex items-center gap-2">{!online&&<span className="hidden items-center gap-1 rounded-full border px-2.5 py-1.5 text-[10px] sm:flex"><WifiOff className="size-3"/>{ar?'غير متصل':'Offline'}</span>}{organizations.length>0&&<select value={activeOrgId||''} onChange={e=>setActiveOrgId(e.target.value)} className="salesos-workspace-select max-w-[180px] rounded-xl border bg-transparent px-3 py-2 text-xs">{organizations.map(o=><option key={o.id} value={o.id}>{o.name}</option>)}</select>}<span className="hidden rounded-full border px-3 py-1.5 text-[11px] font-medium md:inline-flex">{role==='owner_admin'?'Owner / Manager':role==='sales_manager'?'Sales Manager':role==='supervisor'?'Supervisor':role==='sales_rep'?'Sales Rep':role==='accountant_hr'?'Accountant / HR':role==='viewer'?'Viewer':''}</span><Link href={'/'+locale+'/help'} className="salesos-tool-btn rounded-xl border p-2.5" aria-label="help"><HelpCircle className="size-4"/></Link><NotificationBell locale={locale}/><a href={'/'+(ar?'en':'ar')} className="salesos-tool-btn rounded-xl border px-2.5 py-2 text-[11px]">{ar?'EN':'عربي'}</a><button onClick={toggleTheme} className="salesos-tool-btn rounded-xl border p-2.5" aria-label="theme"><Sun className="hidden size-4 dark:block"/><Moon className="size-4 dark:hidden"/></button><button onClick={logout} className="salesos-profile flex items-center gap-2 rounded-xl border px-2.5 py-2 text-xs" aria-label="logout">{profile?.avatar_url?<img src={profile.avatar_url} alt="" className="size-6 rounded-full"/>:<UserRound className="size-4"/>}<span className="hidden max-w-32 truncate lg:inline">{profile?.full_name||''}</span><LogOut className="size-4"/></button></div>
 </div></header>
}