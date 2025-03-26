import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { MoonIcon, SunIcon } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { useTheme } from '@/hooks/use-theme';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
        scrolled 
          ? 'py-3 backdrop-blur-lg bg-white/70 dark:bg-gray-900/80 shadow-sm' 
          : 'py-5 bg-transparent'
      )}
    >
      <div className="container max-w-7xl mx-auto px-6">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              Solveuxq
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={cn(
                "text-sm font-medium transition-colors", 
                location.pathname === "/" 
                  ? "text-primary" 
                  : "text-gray-800 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
              )}
            >
              Home
            </Link>
            <Link 
              to="/categories" 
              className={cn(
                "text-sm font-medium transition-colors", 
                location.pathname === "/categories" 
                  ? "text-primary" 
                  : "text-gray-800 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
              )}
            >
              Categories
            </Link>
            <Link 
              to="/about" 
              className={cn(
                "text-sm font-medium transition-colors", 
                location.pathname === "/about" 
                  ? "text-primary" 
                  : "text-gray-800 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
              )}
            >
              About
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Toggle 
              aria-label="Toggle theme" 
              className="p-2"
              pressed={theme === 'dark'}
              onPressedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </Toggle>

            <div className="hidden md:block">
              <button className="neo-button">
                Get Started
              </button>
            </div>
          </div>

          <button className="md:hidden text-gray-800 dark:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
