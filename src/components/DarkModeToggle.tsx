// src/components/DarkModeToggle.tsx
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import useDarkMode from '../hooks/useDarkMode';

type DarkModeToggleProps = {
  className?: string;
};

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useDarkMode();
  const isDark = theme === 'dark';

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
      {/* Sun icon on the left */}
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

      {/* Moon icon on the right */}
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

      {/* Knob */}
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
