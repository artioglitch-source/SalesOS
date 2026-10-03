'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {getModuleManifests} from '@/core/registry/registry';

export function AppShell({children}: {children: React.ReactNode}) {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'ar';
  const modules = getModuleManifests();

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-64 border-e bg-white p-5 md:block">
          <div className="mb-8 text-lg font-semibold">SalesOS</div>
          <nav className="space-y-1">
            <Link className="block rounded-lg px-3 py-2 text-sm hover:bg-neutral-100" href={'/' + locale}>
              {locale === 'ar' ? 'الرئيسية' : 'Home'}
            </Link>
            {modules.map((module) => (
              <Link key={module.id} className="block rounded-lg px-3 py-2 text-sm hover:bg-neutral-100" href={`/${locale}/${module.id}`}>
                {module.name}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="min-w-0 flex-1 p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
