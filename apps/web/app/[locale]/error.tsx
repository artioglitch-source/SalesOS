'use client';

import { useEffect } from 'react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 p-6 dark:bg-neutral-950">
      <div className="w-full max-w-lg rounded-3xl border bg-white p-8 text-center dark:border-neutral-800 dark:bg-neutral-900">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">SalesOS</div>
        <h1 className="mt-3 text-2xl font-semibold">تعذر تحميل هذه الشاشة</h1>
        <p className="mt-2 text-sm leading-6 text-neutral-500">حدث خطأ مؤقت أثناء تحميل البيانات أو الشاشة. حاول مرة أخرى.</p>
        <button
          onClick={() => reset()}
          className="mt-6 rounded-xl bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-neutral-950"
        >
          إعادة المحاولة
        </button>
      </div>
    </main>
  );
}
