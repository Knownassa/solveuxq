
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { MoonIcon, SunIcon, Menu, X } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { useTheme } from '@/hooks/use-theme';
import { Badge } from '@/components/ui/badge';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader,
  SheetTitle,
  SheetTrigger 
} from '@/components/ui/sheet';
import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from "@clerk/clerk-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NavLinks = () => (
    <>
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
        to="/study"
        className={cn(
          "text-sm font-medium transition-colors relative flex items-center",
          location.pathname === "/study"
            ? "text-primary"
            : "text-gray-800 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
        )}
      >
        Study
        <Badge className="ml-2 text-[0.6rem] absolute -top-2 right-[-30px] md:relative md:top-0 md:right-0">Coming Soon</Badge>
      </Link>
      <Link
        to="/quizzes"
        className={cn(
          "text-sm font-medium transition-colors",
          location.pathname === "/quizzes"
            ? "text-primary"
            : "text-gray-800 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
        )}
      >
        Quizzes
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
    </>
  );

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
            <NavLinks />
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
              <SignedIn>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-9 h-9"
                    }
                  }}
                />
              </SignedIn>
              
              <SignedOut>
                <div className="flex items-center gap-2">
                  <SignInButton mode="modal">
                    <button className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-primary dark:hover:text-primary">
                      Sign In
                    </button>
                  </SignInButton>
                  
                  <SignUpButton mode="modal">
                    <button className="neo-button">
                      Get Started
                    </button>
                  </SignUpButton>
                </div>
              </SignedOut>
            </div>

            <Sheet>
              <SheetTrigger className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-800 dark:text-gray-200">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85%] sm:w-[385px]">
                <SheetHeader>
                  <SheetTitle>
                    <span className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                      Solveuxq
                    </span>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 mt-8">
                  <div className="flex flex-col gap-4">
                    <Link
                      to="/"
                      className={cn(
                        "text-base font-medium transition-colors px-2 py-2 rounded-md",
                        location.pathname === "/"
                          ? "text-primary bg-primary/5"
                          : "text-gray-800 dark:text-gray-200 hover:text-primary hover:bg-primary/5 dark:hover:text-primary"
                      )}
                    >
                      Home
                    </Link>
                    <Link
                      to="/study"
                      className={cn(
                        "text-base font-medium transition-colors px-2 py-2 rounded-md flex items-center",
                        location.pathname === "/study"
                          ? "text-primary bg-primary/5"
                          : "text-gray-800 dark:text-gray-200 hover:text-primary hover:bg-primary/5 dark:hover:text-primary"
                      )}
                    >
                      Study
                      <Badge className="ml-2 text-[0.6rem]">Coming Soon</Badge>
                    </Link>
                    <Link
                      to="/quizzes"
                      className={cn(
                        "text-base font-medium transition-colors px-2 py-2 rounded-md",
                        location.pathname === "/quizzes"
                          ? "text-primary bg-primary/5"
                          : "text-gray-800 dark:text-gray-200 hover:text-primary hover:bg-primary/5 dark:hover:text-primary"
                      )}
                    >
                      Quizzes
                    </Link>
                    <Link
                      to="/about"
                      className={cn(
                        "text-base font-medium transition-colors px-2 py-2 rounded-md",
                        location.pathname === "/about"
                          ? "text-primary bg-primary/5"
                          : "text-gray-800 dark:text-gray-200 hover:text-primary hover:bg-primary/5 dark:hover:text-primary"
                      )}
                    >
                      About
                    </Link>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <SignedIn>
                      <div className="flex items-center gap-4 px-2 py-3">
                        <UserButton afterSignOutUrl="/" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">Manage your account</span>
                      </div>
                    </SignedIn>
                    
                    <SignedOut>
                      <div className="flex flex-col gap-3 mt-2">
                        <SignInButton mode="modal">
                          <button className="w-full text-left px-2 py-2 text-base font-medium text-gray-800 dark:text-gray-200 hover:text-primary hover:bg-primary/5 rounded-md">
                            Sign In
                          </button>
                        </SignInButton>
                        
                        <SignUpButton mode="modal">
                          <button className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                            Get Started
                          </button>
                        </SignUpButton>
                      </div>
                    </SignedOut>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
