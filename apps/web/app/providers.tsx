'use client';

import {OrgProvider} from '@/lib/org/context';
import {ThemeProvider} from '@/components/theme-provider';
import {PwaRegister} from '@/components/pwa-register';

export function Providers({children}:{children:React.ReactNode}) {
  return <ThemeProvider><OrgProvider><PwaRegister/>{children}</OrgProvider></ThemeProvider>;
}
