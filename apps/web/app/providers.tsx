'use client';
import {OrgProvider} from '@/lib/org/context';
import {ThemeProvider} from '@/components/theme-provider';
import {PwaRegister} from '@/components/pwa-register';
import {MobileNav} from '@/components/mobile-nav';
import {RecoveryProvider} from '@/components/recovery/recovery-provider';

export function Providers({children}:{children:React.ReactNode}){
  return <ThemeProvider><OrgProvider><RecoveryProvider><PwaRegister/>{children}<MobileNav/></RecoveryProvider></OrgProvider></ThemeProvider>
}