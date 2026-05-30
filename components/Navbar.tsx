import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, LayoutDashboard, LogOut, Menu, User, X } from 'lucide-react';
import { NavigationOptions, View } from '../App';
import { useI18n } from '../i18n/I18nContext';
import { supabase } from '../supabaseClient';
import LanguageSwitcher from './LanguageSwitcher';

interface NavbarProps {
  navigateTo: (view: View, options?: NavigationOptions) => void;
  currentView: View;
  isAdmin: boolean;
  user: any;
}

const Navbar: React.FC<NavbarProps> = ({ navigateTo, currentView, isAdmin, user }) => {
  const { messages } = useI18n();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const profileLabel = user?.user_metadata?.full_name || user?.email || messages.nav.profile;
  const profileInitial = (profileLabel?.trim()?.charAt(0) || 'M').toUpperCase();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!profileMenuRef.current?.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  useEffect(() => {
    setIsProfileOpen(false);
  }, [currentView]);

  const navLinks: { name: string; id: View }[] = [
    { name: messages.nav.home, id: 'home' },
    { name: messages.nav.gallery, id: 'gallery' },
    { name: messages.nav.artists, id: 'artists' },
    { name: messages.nav.bio, id: 'bio' },
  ];

  const handleNavClick = (id: View) => {
    navigateTo(id);
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsProfileOpen(false);
    navigateTo('home', { replace: true });
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-white'} h-14 md:h-[60px]`}>
      <div className="w-full h-full px-4 sm:px-6 lg:px-8 flex justify-between items-center max-w-full">
        <button
          onClick={() => handleNavClick('home')}
          className="font-serif text-base sm:text-lg md:text-xl font-bold text-gray-900 hover:opacity-70 transition-opacity flex-shrink-0 whitespace-nowrap py-2"
        >
          MAUDELART
        </button>

        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`group relative text-xs lg:text-sm font-semibold transition-all duration-300 whitespace-nowrap px-3 lg:px-4 py-3 ${
                currentView === link.id ? 'text-emerald-950' : 'text-gray-700 hover:text-emerald-950'
              }`}
            >
              <span className="relative block">
                {link.name}
                <span className={`absolute left-0 right-0 top-full mt-2 h-px origin-center bg-emerald-950/20 transition-transform duration-300 ${
                  currentView === link.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} />
                {currentView === link.id && (
                  <motion.span
                    layoutId="desktop-nav-active-bar"
                    className="absolute left-0 right-0 top-full mt-2 h-0.5 rounded-full bg-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.45)]"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2 lg:gap-4">
          <LanguageSwitcher />

          {user ? (
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileOpen((open) => !open)}
                className={`group flex h-12 items-center gap-3 rounded-2xl border px-3 py-2 shadow-sm transition-all ${
                  isProfileOpen
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-950'
                    : 'border-gray-200 bg-white text-gray-800 hover:border-emerald-200 hover:bg-emerald-50/60'
                }`}
                aria-label={messages.nav.profileMenu}
                aria-expanded={isProfileOpen}
                aria-haspopup="menu"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-950 text-xs font-black uppercase text-[#d4af37]">
                  {profileInitial}
                </span>
                <span className="max-w-[120px] truncate text-sm font-semibold">{messages.nav.profile}</span>
                <ChevronDown
                  size={16}
                  className={`text-gray-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180 text-emerald-900' : 'group-hover:text-emerald-900'}`}
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white py-2 shadow-[0_20px_60px_rgba(15,23,42,0.16)] z-50">
                  <div className="border-b border-gray-100 px-4 py-3">
                    <p className="truncate text-sm font-semibold text-gray-900">{profileLabel}</p>
                    <p className="mt-0.5 text-xs text-gray-500">{messages.nav.profile}</p>
                  </div>

                  <button
                    onClick={() => {
                      handleNavClick('profile');
                      setIsProfileOpen(false);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <User size={16} className="text-gray-400" />
                    {messages.nav.profile}
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        handleNavClick('admin');
                        setIsProfileOpen(false);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <LayoutDashboard size={15} className="text-gray-400" /> {messages.nav.admin}
                    </button>
                  )}

                  <hr className="my-2 border-gray-100" />

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                  >
                    <LogOut size={15} /> {messages.nav.logout}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => handleNavClick('auth')}
              className="px-4 lg:px-6 py-2 bg-green-700 text-white rounded-lg text-xs lg:text-sm font-medium hover:bg-green-800 transition-colors flex-shrink-0"
            >
              {messages.nav.signIn}
            </button>
          )}
        </div>

        <button
          onClick={() => setIsMenuOpen((open) => !open)}
          className="md:hidden p-2 text-gray-700 flex-shrink-0 hover:bg-gray-100 rounded-lg transition-colors h-10 w-10 flex items-center justify-center"
          aria-label={messages.nav.menu}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-white border-t border-gray-200 py-4 px-4 space-y-1 max-w-full overflow-y-auto absolute w-full shadow-xl"
          style={{ maxHeight: 'calc(100vh - 56px)' }}
        >
          <div className="flex flex-col gap-0">
            <div className="px-4 pb-3">
              <LanguageSwitcher compact />
            </div>

            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-sm font-semibold text-left py-3 px-4 rounded-xl transition-all duration-300 w-full min-h-[48px] flex items-center justify-between ${
                  currentView === link.id ? 'bg-emerald-50 text-emerald-950 shadow-sm' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span>{link.name}</span>
                {currentView === link.id && (
                  <motion.span
                    layoutId="mobile-nav-active-bar"
                    className="h-5 w-1.5 rounded-full bg-[#d4af37]"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  />
                )}
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
                  className="text-gray-700 text-sm font-medium text-left hover:text-gray-900 hover:bg-gray-50 py-3 px-4 rounded-lg transition-colors w-full min-h-[48px] flex items-center gap-2"
                >
                  <User size={16} />
                  {messages.nav.profile}
                </button>

                {isAdmin && (
                  <button
                    onClick={() => {
                      handleNavClick('admin');
                      setIsMenuOpen(false);
                    }}
                    className="text-gray-700 text-sm font-medium text-left hover:text-gray-900 hover:bg-gray-50 py-3 px-4 rounded-lg transition-colors w-full h-[44px] flex items-center gap-2"
                  >
                    <LayoutDashboard size={16} /> {messages.nav.admin}
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="text-red-600 text-sm font-medium text-left hover:bg-red-50 py-3 px-4 rounded-lg transition-colors w-full h-[44px] flex items-center gap-2"
                >
                  <LogOut size={16} /> {messages.nav.logout}
                </button>
              </>
            )}

            {!user && (
              <button
                onClick={() => handleNavClick('auth')}
                className="w-full px-4 py-3 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 transition-colors mt-3 h-[44px] flex items-center justify-center"
              >
                {messages.nav.signIn}
              </button>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
