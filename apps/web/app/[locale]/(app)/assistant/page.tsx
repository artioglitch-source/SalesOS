import {AssistantChat} from '@/components/assistant/assistant-chat';
export default async function Assistant({params}:{params:Promise<{locale:string}>}){const {locale}=await params;return <section className="p-4 md:p-8"><AssistantChat locale={locale==='en'?'en':'ar'}/></section>}
