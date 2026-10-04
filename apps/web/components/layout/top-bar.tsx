'use client';
import Link from 'next/link';
import {usePathname,useRouter} from 'next/navigation';
import {useEffect,useState} from 'react';
import {Command,HelpCircle,LogOut,Moon,Sun,UserRound} from 'lucide-react';
import {toggleTheme} from '@/components/theme-provider';
import {createClient} from '@/lib/supabase/browser';
import {useOrg} from '@/lib/org/context';
import {NotificationBell} from '@/components/notifications/notification-bell';
import {SolidAiDock} from '@/components/solid-ai-dock';

function roleLabel(role:string|null,ar:boolean){
 const map:any={owner_admin:ar?'المالك / المدير':'Owner / Manager',sales_manager:ar?'مدير المبيعات':'Sales Manager',supervisor:ar?'مشرف':'Supervisor',sales_rep:ar?'مندوب مبيعات':'Sales Rep',accountant_hr:ar?'محاسبة / موارد بشرية':'Accountant / HR',viewer:ar?'مشاهد':'Viewer'};
 return map[role||'']||'';
}

export function TopBar(){
 const path=usePathname();const router=useRouter();const locale=path.split('/')[1]==='en'?'en':'ar';const ar=locale==='ar';
 const {organizations,activeOrgId,setActiveOrgId,role,userId}=useOrg();const [profile,setProfile]=useState<any>(null);
 const openSearch=()=>window.dispatchEvent(new CustomEvent('salesos:command'));
 const logout=async()=>{await createClient().auth.signOut();router.push('/'+locale+'/login');router.refresh()};
 useEffect(()=>{if(!userId)return;createClient().from('profiles').select('full_name,avatar_url').eq('id',userId).maybeSingle().then(({data})=>setProfile(data))},[userId]);
 return <header className="salesos-topbar sticky top-0 z-40 border-b backdrop-blur-xl"><div className="flex h-14 items-center gap-2 px-3 md:h-16 md:px-7">
  <button onClick={openSearch} className="hidden min-w-0 flex-1 items-center gap-3 rounded-xl border bg-black/[.02] px-3 py-2.5 text-start text-sm text-neutral-400 md:flex dark:bg-white/[.02]" aria-label={ar?'البحث والتنقل':'Search and navigation'}><span>{ar?'ابحث أو انتقل أو اكتب أمراً...':'Search, navigate, or command...'}</span><kbd className="ms-auto rounded-lg border px-2 py-1 text-[10px]"><Command className="inline size-3 me-1"/>K</kbd></button>
  <button onClick={openSearch} className="rounded-xl border p-2.5 md:hidden" aria-label={ar?'بحث':'Search'}>⌕</button>
  <div className="ms-auto flex items-center gap-2">
   <SolidAiDock locale={locale}/>
   {organizations.length>0&&<select aria-label={ar?'مساحة العمل':'Workspace'} value={activeOrgId||''} onChange={e=>setActiveOrgId(e.target.value)} className="hidden max-w-[170px] rounded-xl border bg-transparent px-3 py-2 text-xs md:block">{organizations.map(o=><option key={o.id} value={o.id}>{o.name}</option>)}</select>}
   <span className="hidden rounded-full border px-3 py-1.5 text-[11px] font-medium text-neutral-500 lg:inline-flex">{roleLabel(role,ar)}</span>
   <Link href={'/'+locale+'/help'} aria-label={ar?'المساعدة':'Help'} className="rounded-xl border p-2.5"><HelpCircle className="size-4"/></Link>
   <NotificationBell locale={locale}/>
   <a href={'/'+(ar?'en':'ar')} className="rounded-xl border px-2.5 py-2 text-[11px]">{ar?'EN':'عربي'}</a>
   <button onClick={toggleTheme} className="rounded-xl border p-2.5" aria-label={ar?'المظهر':'Theme'}><Sun className="hidden size-4 dark:block"/><Moon className="size-4 dark:hidden"/></button>
   <button onClick={logout} className="flex items-center gap-2 rounded-xl border px-2.5 py-2 text-xs" aria-label={ar?'تسجيل الخروج':'Logout'}>{profile?.avatar_url?<img src={profile.avatar_url} alt="" className="size-5 rounded-full"/>:<UserRound className="size-4"/>}<span className="hidden lg:inline max-w-28 truncate">{profile?.full_name||''}</span><LogOut className="size-4"/></button>
  </div>
 </div></header>
}