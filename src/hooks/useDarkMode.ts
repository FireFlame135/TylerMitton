// In src/hooks/useDarkMode.ts

import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface UseDarkModeResult {
  theme: Theme;
  toggleTheme: () => void;
  isHydrated: boolean;
}
const getInitialTheme = (): Theme => {
  if (typeof window !== 'undefined') {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme) {
      return storedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light'; 
};

export default function useDarkMode(): UseDarkModeResult {
  const [theme, setTheme] = useState<Theme>(getInitialTheme); 
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };
  
  // Apply the theme to the HTML tag whenever the theme state changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);


  return { theme, toggleTheme, isHydrated };
}