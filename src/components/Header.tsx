import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Menu, X, Home, BookOpen, Users, Info, Mail, ChevronRight } from 'lucide-react';


interface HeaderProps {
  isLoggedIn?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn = false }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'About', href: '/about', icon: Info },
    { label: 'Guides', href: '/guides', icon: BookOpen },
    { label: 'Community', href: '/courses', icon: Users },
    { label: 'Contact', href: '/contact', icon: Mail },
  ];

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-lg font-bold text-orange-500">Fundi </span>
            <span className="text-lg font-bold text-gray-800 dark:text-white">Fasta</span>
            <span className="text-xs bg-orange-500 text-white px-1.5 py-0.5 rounded-full">TZ</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link 
                key={link.label}
                to={link.href} 
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          {/* Right Section */}
          <div className="flex items-center space-x-3">
            
            
            <Link 
              to="/signup" 
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            
            {!isLoggedIn ? (
              <Link 
                to="/login" 
                className="hidden sm:inline text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
              >
                Log in
              </Link>
            ) : (
              <Link 
                to="/profile" 
                className="hidden sm:inline text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
              >
                Profile
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Sidebar Slide-in */}
        <div 
          className={`
            md:hidden fixed inset-y-0 left-0 w-80 bg-white dark:bg-gray-900 shadow-2xl transition-all duration-300 ease-in-out z-50
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="flex flex-col h-full">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-orange-500">Lean</span>
                <span className="text-lg font-bold text-gray-800 dark:text-white">Digitally</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto py-4">
              <div className="space-y-1 px-3">
                {navLinks.map((link) => (
                  <Link 
                    key={link.label}
                    to={link.href} 
                    className="flex items-center justify-between text-base font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center gap-3">
                      <link.icon className="w-5 h-5 text-orange-500" />
                      {link.label}
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                ))}
              </div>

              <hr className="my-4 mx-4 border-gray-200 dark:border-gray-700" />

              {/* Action Buttons */}
              <div className="space-y-3 px-4">
                <Link 
                  to="/signup" 
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-medium rounded-lg transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                
                {!isLoggedIn ? (
                  <Link 
                    to="/login" 
                    className="flex items-center justify-center w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Log in
                  </Link>
                ) : (
                  <Link 
                    to="/profile" 
                    className="flex items-center justify-center w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                )}
              </div>
            </div>

            {/* Menu Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} Fundi Fasta Tanzania
              </p>
              <div className="flex justify-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                <Link to="/privacy" onClick={() => setIsMobileMenuOpen(false)}>Privacy</Link>
                <Link to="/terms" onClick={() => setIsMobileMenuOpen(false)}>Terms</Link>
                <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Backdrop Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </div>
    </header>
  );
};

export default Header;