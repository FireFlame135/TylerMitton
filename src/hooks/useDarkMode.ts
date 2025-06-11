import { useState, useEffect } from 'react';

// Define the possible theme values as a TypeScript union type
type Theme = 'light' | 'dark';

// Define the return type of the hook
interface UseDarkModeResult {
  theme: Theme;
  toggleTheme: () => void;
}

export default function useDarkMode(): UseDarkModeResult {
  // theme state: 'light' or 'dark'
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // On initial load, read user's stored preference
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    // If none, fall back to OS preference
    const initialTheme: Theme = storedTheme
      ? storedTheme
      : window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';

    setTheme(initialTheme);
    // Apply or remove the `dark` class on <html>
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Toggles theme and writes to localStorage
  const toggleTheme = () => {
    const newTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark'); // switch to dark
    } else {
      document.documentElement.classList.remove('dark'); // back to light
    }
    localStorage.setItem('theme', newTheme);
  };

  return { theme, toggleTheme };
}
