import {OnboardingForm} from '@/components/onboarding/onboarding-form';

export default async function OnboardingPage({params}:{params:Promise<{locale:string}>}) {
  const {locale}=await params;
  return <OnboardingForm locale={locale==='en'?'en':'ar'}/>;
}
