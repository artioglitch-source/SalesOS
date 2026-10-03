import {OfflineActivityForm} from '@/components/offline/activity-form';
export default async function NewActivity({params}:{params:Promise<{locale:string}>}){const {locale}=await params;return <section className="p-4 md:p-8"><OfflineActivityForm locale={locale==='en'?'en':'ar'}/></section>}
