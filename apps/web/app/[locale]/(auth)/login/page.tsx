import {LoginForm} from '@/components/auth/login-form';

export default async function LoginPage({params}:{params:Promise<{locale:string}>}) {
  const {locale}=await params;
  const safe=locale==='en'?'en':'ar';
  return <main className="flex min-h-screen items-center justify-center bg-neutral-50 p-6 dark:bg-neutral-950"><LoginForm locale={safe}/></main>;
}
