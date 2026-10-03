import {Dashboard} from '@/components/dashboard/dashboard';

export default async function Home({params}:{params:Promise<{locale:string}>}) {
  const {locale}=await params;
  return <Dashboard locale={locale==='en'?'en':'ar'}/>;
}
