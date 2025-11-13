// src/hooks/useDarkMode.ts
/**
 * Custom hook for managing dark mode theme state.
 * Author: Tyler Mitton
 * Handles theme persistence in localStorage and applies to DOM.
 */

import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface UseDarkModeResult {
  theme: Theme;
  toggleTheme: () => void;
  isHydrated: boolean;
}

// Determine initial theme from localStorage or system preference
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
  // Initialize theme from localStorage or system preference
  const [theme, setTheme] = useState<Theme>(getInitialTheme); 
  // Track if component has hydrated to prevent hydration mismatch
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydration effect to prevent flash of wrong theme
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    // Update DOM to apply theme
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    // Persist theme choice to localStorage
    localStorage.setItem('theme', newTheme);
  };
  
  // Apply theme to DOM whenever theme state changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return { theme, toggleTheme, isHydrated };
}