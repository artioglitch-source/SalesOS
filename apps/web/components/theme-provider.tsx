'use client';

import {useEffect,useState} from 'react';

export function ThemeProvider({children}:{children:React.ReactNode}) {
  const [theme,setTheme] = useState<'light'|'dark'>('light');
  useEffect(() => {
    const stored = localStorage.getItem('salesos-theme') as 'light'|'dark'|null;
    const next = stored ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(next);
    document.documentElement.classList.toggle('dark',next === 'dark');
  },[]);
  useEffect(() => {
    document.documentElement.classList.toggle('dark',theme === 'dark');
  },[theme]);
  return <>{children}</>;
}

export function toggleTheme() {
  const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
  localStorage.setItem('salesos-theme',next);
  document.documentElement.classList.toggle('dark',next === 'dark');
}
