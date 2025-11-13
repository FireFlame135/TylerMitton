// src/components/DarkModeToggle.tsx
/**
 * Dark mode toggle switch component.
 * Author: Tyler Mitton
 * Allows users to switch between light and dark theme with smooth animations.
 */

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import useDarkMode from '../hooks/useDarkMode';

type DarkModeToggleProps = {
  className?: string;
};

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ className = '' }) => {
  // Get current theme state from custom hook
  const { theme, toggleTheme, isHydrated } = useDarkMode();
  const isDark = theme === 'dark';

  // Show placeholder while hydrating to avoid flash of unstyled content
  if (!isHydrated) {
    return <div className="h-9 w-[72px]" />; 
  }

  const baseClasses = `
    relative inline-flex items-center
    h-9 w-[72px] rounded-full
    transition-colors duration-500 ease-in-out
    ${isDark ? 'bg-gray-600' : 'bg-gray-400'}
  `;

  return (
    <button
      type="button"
      aria-label="Toggle Dark Mode"
      onClick={toggleTheme}
      className={`${baseClasses} ${className}`}
    >
      {/* Sun icon visible in light mode */}
      <span
        className={`
          absolute left-1.5 top-1/2
          transform -translate-y-1/2
          transition-opacity duration-300 ease-in-out
          ${isDark ? 'opacity-0' : 'opacity-100'}
        `}
      >
        <Sun size={24} />
      </span>

      {/* Moon icon visible in dark mode */}
      <span
        className={`
          absolute right-1.5 top-1/2
          transform -translate-y-1/2
          transition-opacity duration-300 ease-in-out
          ${isDark ? 'opacity-100' : 'opacity-0'}
        `}
      >
        <Moon size={24} />
      </span>

      {/* Animated toggle knob */}
      <span
        className={`
          absolute left-1.5 top-1/2
          transform
          transition-transform duration-300 ease-in-out
          ${isDark
            ? '-translate-y-1/2 translate-x-0'
            : '-translate-y-1/2 translate-x-10'
          }
          h-5 w-5 rounded-full bg-white shadow
        `}
      />
    </button>
  );
};

export default DarkModeToggle;
