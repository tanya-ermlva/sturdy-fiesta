'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  // Track current theme: 'light' or 'dark'
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // On first load, figure out the current theme
  useEffect(() => {
    // Check if dark class is on <html>
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');

    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only follow system if user hasn't manually chosen
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

    // Cleanup when component unmounts
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Toggle function: switch theme and save choice
  const toggleTheme = () => {
    if (theme === 'light') {
      // Switch to dark
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    } else {
      // Switch to light
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
      {/* Sliding knob */}
      <span 
        className={`
          size-6 rounded-full bg-background shadow-sm border-hairline
          transition-transform duration-300 ease-out text-foreground-subtle
          ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}
        `}
      > {theme === 'dark' ? '☽' : '☼'} </span>
    </button>
  );
}