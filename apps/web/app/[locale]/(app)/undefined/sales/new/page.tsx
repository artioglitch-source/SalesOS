import {SaleForm} from '@/components/sales/sale-form';
export default async function LegacyNewSale({params}:{params:Promise<{locale:string}>}){
 const {locale}=await params;
 return <SaleForm locale={locale==='en'?'en':'ar'}/>;
}