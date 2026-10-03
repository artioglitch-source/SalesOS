import ReportBuilder from '@/components/reports/report-builder';
export default async function ReportBuilderPage({params}:{params:Promise<{locale:string}>}){const {locale}=await params;return <ReportBuilder locale={locale==='en'?'en':'ar'}/>;}
