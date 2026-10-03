import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import '../globals.css';
import {routing} from '@/lib/i18n/routing';

export const metadata={title:'SalesOS',description:'Sales and operations workspace'};

export function generateStaticParams(){return routing.locales.map(locale=>({locale}))}

export default async function LocaleLayout({children,params}:{children:React.ReactNode;params:Promise<{locale:string}>}){
  const {locale}=await params;
  if(!routing.locales.includes(locale as 'ar'|'en'))notFound();
  const messages=await getMessages();
  return <html lang={locale} dir={locale==='ar'?'rtl':'ltr'} suppressHydrationWarning><body><NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider></body></html>;
}
