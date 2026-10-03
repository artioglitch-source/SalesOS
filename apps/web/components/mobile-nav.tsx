'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {Home,BriefcaseBusiness,Users,WalletCards} from 'lucide-react';

export function MobileNav(){
  const p=usePathname();const locale=p.split('/')[1]||'ar';
  const items=[['/',Home],['/accounts',Users],['/deals',BriefcaseBusiness],['/finance',WalletCards]] as const;
  return <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t bg-white/95 p-2 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/95 md:hidden">{items.map(([href,Icon])=><Link key={href} href={'/'+locale+href} className="flex justify-center rounded-xl p-3"><Icon className="size-5"/></Link>)}</nav>;
}
