import {QuoteBuilder} from '@/components/pipeline/quote-builder';
export default async function NewQuote({params}:{params:Promise<{locale:string}>}){const {locale}=await params;return <QuoteBuilder locale={locale==='en'?'en':'ar'}/>;}
