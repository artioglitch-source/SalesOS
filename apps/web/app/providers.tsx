'use client';

import {OrgProvider} from '@/lib/org/context';
import {ThemeProvider} from '@/components/theme-provider';

export function Providers({children}:{children:React.ReactNode}) {
  return <ThemeProvider><OrgProvider>{children}</OrgProvider></ThemeProvider>;
}
