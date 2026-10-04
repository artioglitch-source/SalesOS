'use client';
import {usePathname} from 'next/navigation';
import {OrgProvider} from '@/lib/org/context';
import {ThemeProvider} from '@/components/theme-provider';
import {PwaRegister} from '@/components/pwa-register';
import {MobileNav} from '@/components/mobile-nav';
import {RecoveryProvider} from '@/components/recovery/recovery-provider';
import {NotchAI} from '@/components/ai/notch-ai';
function NotchBoundary(){const p=usePathname();const locale=p.split('/')[1]==='en'?'en':'ar';return <NotchAI locale={locale}/>}
export function Providers({children}:{children:React.ReactNode}){return <ThemeProvider><OrgProvider><RecoveryProvider><PwaRegister/>{children}<MobileNav/><NotchBoundary/></RecoveryProvider></OrgProvider></ThemeProvider>}