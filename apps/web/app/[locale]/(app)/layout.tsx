import {redirect} from 'next/navigation';
import {getAuthContext} from '@/lib/auth/data';
import {Providers} from '@/app/providers';
import {TopBar} from '@/components/layout/top-bar';
import {CommandPalette} from '@/components/command/command-palette';
import {AppShell} from '@/components/layout/app-shell';

export default async function AppLayout({children,params}:{children:React.ReactNode;params:Promise<{locale:string}>}) {
  const {locale}=await params;
  const {user,organizations}=await getAuthContext();
  if(!user) redirect('/'+locale+'/login');
  if(organizations.length===0) redirect('/'+locale+'/onboarding');
  return <Providers><AppShell><TopBar/>{children}<CommandPalette/></AppShell></Providers>;
}
