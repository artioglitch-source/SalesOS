import SalesPage from '@/components/sales/sales-page';
export default async function Sales({params}:{params:Promise<{locale:string}>}){const {locale}=await params;return <SalesPage locale={locale==='en'?'en':'ar'}/>;}
