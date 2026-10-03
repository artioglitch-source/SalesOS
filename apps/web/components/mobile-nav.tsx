'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {Home,Users,Receipt,MoreHorizontal} from 'lucide-react';
export function MobileNav(){const p=usePathname();const locale=(p.split('/')[1]||'ar') as 'ar'|'en';const ar=locale==='ar';const items=[['/',Home,ar?'اليوم':'Today'],['/sales',Receipt,ar?'المبيعات':'Sales'],['/accounts',Users,ar?'العملاء':'Customers'],['/pipeline',MoreHorizontal,ar?'المزيد':'More']] as const;return <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t border-neutral-200 bg-white/95 p-2 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/95 lg:hidden">{items.map(([href,Icon,label])=><Link key={href} href={'/'+locale+href} className={"flex flex-col items-center gap-1 rounded-xl p-2 text-[10px] "+(p===('/'+locale+href)?'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950':'text-neutral-500')}><Icon className="size-5"/>{label}</Link>)}</nav>}
