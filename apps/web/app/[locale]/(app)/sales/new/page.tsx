import {SaleForm} from '@/components/sales/sale-form';
export default async function NewSale({params}:{params:Promise<{locale:string}>}){const {locale}=await params;return <SaleForm locale={locale==='en'?'en':'ar'}/>;}
