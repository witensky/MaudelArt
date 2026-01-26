import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { View } from '../App';
import { supabase } from '../supabaseClient';

interface NavbarProps {
  setView: (view: View) => void;
  currentView: View;
  isAdmin: boolean;
  user: any;
}

const Navbar: React.FC<NavbarProps> = ({ setView, currentView, isAdmin, user }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsProfileOpen(false);
    setView('home');
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { name: string; id: View }[] = [
    { name: 'Accueil', id: 'home' },
    { name: 'Galerie', id: 'gallery' },
    { name: 'Artistes', id: 'artists' },
    { name: 'À propos', id: 'bio' },
  ];

  const handleNavClick = (id: View) => {
    setView(id);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className={`fixed w-full z-[100] transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-white'
    }`} style={{ height: '60px', minHeight: '60px' }}>
      <div className="w-full h-full px-3 sm:px-6 lg:px-8 flex justify-between items-center max-w-full">
        {/* Logo - Optimized for mobile */}
        <button
          onClick={() => handleNavClick('home')}
          className="font-serif text-base sm:text-lg md:text-xl font-bold text-gray-900 hover:opacity-70 transition-opacity flex-shrink-0 whitespace-nowrap py-2"
        >
          MAUDELART
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="text-gray-700 text-xs lg:text-sm font-medium hover:text-gray-900 transition-colors whitespace-nowrap py-2"
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-2 lg:gap-4">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 h-10 w-10 flex items-center justify-center"
                aria-label="Menu Profil"
              >
                <User size={18} className="text-gray-700" />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                  <button
                    onClick={() => {
                      handleNavClick('profile');
                      setIsProfileOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 text-sm"
                  >
                    Mon Profil
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => {
                        handleNavClick('admin');
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 flex items-center gap-2 text-sm"
                    >
                      <LayoutDashboard size={14} /> Admin
                    </button>
                  )}
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 flex items-center gap-2 text-sm"
                  >
                    <LogOut size={14} /> Déconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => handleNavClick('auth')}
              className="px-4 lg:px-6 py-2 bg-green-700 text-white rounded-lg text-xs lg:text-sm font-medium hover:bg-green-800 transition-colors flex-shrink-0"
            >
              Connexion
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-gray-700 flex-shrink-0 hover:bg-gray-100 rounded-lg transition-colors h-10 w-10 flex items-center justify-center"
          aria-label="Menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu - Optimized spacing and layout */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-white border-t border-gray-200 py-4 px-4 space-y-1 max-w-full overflow-y-auto"
          style={{ maxHeight: 'calc(100vh - 60px)' }}
        >
          <div className="flex flex-col gap-0">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="text-gray-700 text-sm font-medium text-left hover:text-gray-900 hover:bg-gray-50 py-3 px-4 rounded-lg transition-colors w-full h-[44px] flex items-center"
              >
                {link.name}
              </button>
            ))}
            
            {user && (
              <>
                <hr className="my-2" />
                <button
                  onClick={() => {
                    handleNavClick('profile');
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-700 text-sm font-medium text-left hover:text-gray-900 hover:bg-gray-50 py-3 px-4 rounded-lg transition-colors w-full h-[44px] flex items-center"
                >
                  Mon Profil
                </button>
                {isAdmin && (
                  <button
                    onClick={() => {
                      handleNavClick('admin');
                      setIsMenuOpen(false);
                    }}
                    className="text-gray-700 text-sm font-medium text-left hover:text-gray-900 hover:bg-gray-50 py-3 px-4 rounded-lg transition-colors w-full h-[44px] flex items-center gap-2"
                  >
                    <LayoutDashboard size={16} /> Admin
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="text-red-600 text-sm font-medium text-left hover:bg-red-50 py-3 px-4 rounded-lg transition-colors w-full h-[44px] flex items-center gap-2"
                >
                  <LogOut size={16} /> Déconnexion
                </button>
              </>
            )}

            {!user && (
              <button
                onClick={() => handleNavClick('auth')}
                className="w-full px-4 py-3 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 transition-colors mt-3 h-[44px] flex items-center justify-center"
              >
                Connexion
              </button>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
