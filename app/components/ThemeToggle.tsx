'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem('theme');
      if (!saved) {
        if (e.matches) {
          document.documentElement.classList.add('dark');
          setTheme('dark');
        } else {
          document.documentElement.classList.remove('dark');
          setTheme('light');
        }
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center w-14 p-1 bg-surface rounded-full border-hairline cursor-pointer"
      aria-label="Toggle theme"
    >
      <span
        className={`
          size-6 rounded-full bg-background shadow-sm border-hairline
          transition-transform duration-300 ease-out text-foreground-subtle
          ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}
        `}
      >
        {theme === 'dark' ? '☽' : '☼'}
      </span>
    </button>
  );
}
