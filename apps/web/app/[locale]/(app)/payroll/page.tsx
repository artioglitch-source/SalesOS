import PayrollDashboard from '@/components/admin/payroll-dashboard';
export default async function PayrollPage({params}:{params:Promise<{locale:string}>}){const {locale}=await params;return <PayrollDashboard locale={locale==='en'?'en':'ar'}/>;}
