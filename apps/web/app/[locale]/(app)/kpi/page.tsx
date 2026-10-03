import KpiDashboard from '@/components/admin/kpi-dashboard';
export default async function KpiPage({params}:{params:Promise<{locale:string}>}){const {locale}=await params;return <KpiDashboard locale={locale==='en'?'en':'ar'}/>;}
