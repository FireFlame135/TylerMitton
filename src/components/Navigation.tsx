import { useState } from 'react';
import { Menu, X, ExternalLink } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Work', href: '#work' },
    { name: 'About', href: '#about' },
    { name: 'Articles', href: '#articles' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-md border-b border-gray-200 dark:bg-gray-900/60 dark:border-gray-700 transition-all duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="text-3xl font-medium text-gray-900 dark:text-gray-100">
            Tyler Mitton
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="relative text-gray-600 hover:text-gray-900 transition-all duration-300 text-sm font-medium group dark:text-gray-300 dark:hover:text-gray-100"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 transition-all duration-300 group-hover:w-full dark:bg-gray-100"></span>
              </a>
            ))}
            
            {/* Resume Button */}
            <a
              href="https://docs.google.com/document/d/1HOl5ZWTwaIqmNCdVBol7PW7Ufm9WEhI4/edit?usp=sharing&ouid=105707905178570836504&rtpof=true&sd=true"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-400 transition-all duration-300 transform hover:scale-105 text-sm font-medium dark:bg-gray-700 dark:hover:bg-gray-500"
            >
              <span>Résumé</span>
              <ExternalLink size={16} />
            </a>
            <DarkModeToggle />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <a
              href="https://docs.google.com/document/d/1HOl5ZWTwaIqmNCdVBol7PW7Ufm9WEhI4/edit?usp=sharing&ouid=105707905178570836504&rtpof=true&sd=true"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <span>Résumé</span>
              <ExternalLink size={16} />
            </a>
            <DarkModeToggle className="mt-4 sm:mt-0" />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
