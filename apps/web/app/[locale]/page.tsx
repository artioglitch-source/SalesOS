import {getTranslations} from 'next-intl/server';

export default async function HomePage() {
  const t = await getTranslations('app');
  return (
    <main className="min-h-screen p-8">
      <section className="mx-auto max-w-3xl rounded-2xl border p-8 shadow-sm">
        <p className="text-sm font-medium opacity-60">{t('name')}</p>
        <h1 className="mt-2 text-3xl font-semibold">{t('welcome')}</h1>
        <p className="mt-3 opacity-70">{t('foundation')}</p>
      </section>
    </main>
  );
}
