'use client';
import {OrgProvider} from '@/lib/org/context';
import {ThemeProvider} from '@/components/theme-provider';
import {PwaRegister} from '@/components/pwa-register';
import {MobileNav} from '@/components/mobile-nav';
export function Providers({children}:{children:React.ReactNode}){return <ThemeProvider><OrgProvider><PwaRegister/>{children}<MobileNav/></OrgProvider></ThemeProvider>}
