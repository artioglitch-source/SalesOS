import ApiKeyManager from '@/components/platform/api-key-manager';
export default async function ApiKeys({params}:{params:Promise<{locale:string}>}){const {locale}=await params;return <section className="p-4 md:p-7"><ApiKeyManager locale={locale==='en'?'en':'ar'}/></section>;}
