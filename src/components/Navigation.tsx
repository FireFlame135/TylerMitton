import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ExternalLink } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Projects', href: '#projects' },
    { name: 'About', href: '#about' },
    { name: 'Writings', href: '#articles' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    href: string
  ) => {
    e.preventDefault();
    const id = href.substring(1);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#D4D5D8]/50 backdrop-blur-md border-b border-gray-300 dark:bg-gray-900/60 dark:border-gray-700 transition-all duration-300 shadow-sm">
      <div className="mx-auto px-6 sm:px-8">
        <div className="flex justify-between items-center h-16">
          <a href="/" onClick={handleLogoClick}>
            <div className="text-3xl font-medium text-gray-900 dark:text-gray-100">
              Tyler Mitton
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleAnchorClick(e, item.href)}
                className="relative text-gray-600 hover:text-gray-900 transition-all duration-300 text-sm font-medium group dark:text-gray-300 dark:hover:text-gray-100"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 transition-all duration-300 group-hover:w-full dark:bg-gray-100"></span>
              </a>
            ))}

            <a
              href="https://docs.google.com/document/d/1HOl5ZWTwaIqmNCdVBol7PW7Ufm9WEhI4/edit?usp=sharing&ouid=105707905178570836504&rtpof=true&sd=true"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 text-sm font-medium dark:bg-gray-700 dark:hover:bg-gray-500"
            >
              <span>Résumé</span>
              <ExternalLink size={16} />
            </a>

            <DarkModeToggle />
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 dark:border-gray-700">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  handleAnchorClick(e, item.href);
                  setIsMenuOpen(false);
                }}
                className="block py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition-colors duration-200"
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
