<<<<<<< HEAD
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, LayoutDashboard, LogOut, Menu, User, X } from 'lucide-react';
import { NavigationOptions, View } from '../App';
import { useI18n } from '../i18n/I18nContext';
=======
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, LogOut, Menu, User, X } from 'lucide-react';
import { View } from '../App';
import { useLanguage } from '../contexts/LanguageContext';
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
import { supabase } from '../supabaseClient';
import LanguageSwitcher from './LanguageSwitcher';

interface NavbarProps {
  navigateTo: (view: View, options?: NavigationOptions) => void;
  currentView: View;
  isAdmin: boolean;
  user: any;
}

<<<<<<< HEAD
const Navbar: React.FC<NavbarProps> = ({ navigateTo, currentView, isAdmin, user }) => {
  const { messages } = useI18n();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const profileLabel = user?.user_metadata?.full_name || user?.email || messages.nav.profile;
  const profileInitial = (profileLabel?.trim()?.charAt(0) || 'M').toUpperCase();
=======
const Navbar: React.FC<NavbarProps> = ({ setView, currentView, isAdmin, user }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

<<<<<<< HEAD
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
=======
  const handleNavClick = (view: View) => {
    setView(view);
    setIsMenuOpen(false);
    setIsProfileOpen(false);
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsProfileOpen(false);
    handleNavClick('home');
  };

  const navLinks: { name: string; id: View }[] = [
    { name: t('nav.home'), id: 'home' },
    { name: t('nav.gallery'), id: 'gallery' },
    { name: t('nav.artists'), id: 'artists' },
    { name: t('nav.about'), id: 'bio' },
    { name: t('nav.contact'), id: 'contact' },
  ];

  const languageSwitcher = (
    <div className="flex items-center rounded-full border border-black/10 bg-gray-100/80 p-1">
      <button
        onClick={() => setLanguage('fr')}
        className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest transition-colors ${language === 'fr' ? 'bg-white text-maudel-dark shadow-sm' : 'text-gray-500 hover:text-maudel-dark'}`}
        aria-label={t('language.french')}
      >
        {t('language.shortFrench')}
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest transition-colors ${language === 'en' ? 'bg-white text-maudel-dark shadow-sm' : 'text-gray-500 hover:text-maudel-dark'}`}
        aria-label={t('language.english')}
      >
        {t('language.shortEnglish')}
      </button>
    </div>
  );

  return (
<<<<<<< HEAD
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-white'} h-14 md:h-[60px]`}>
      <div className="w-full h-full px-4 sm:px-6 lg:px-8 flex justify-between items-center max-w-full">
=======
    <nav className={`fixed left-0 top-0 z-[100] h-14 w-full transition-all duration-300 md:h-[60px] ${isScrolled ? 'bg-white shadow-md' : 'bg-white'}`}>
      <div className="grid h-full w-full max-w-full grid-cols-[auto_1fr_auto] items-center gap-3 px-4 sm:gap-6 sm:px-6 lg:gap-8 lg:px-8">
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
        <button
          onClick={() => handleNavClick('home')}
          className="whitespace-nowrap py-2 text-base font-bold text-gray-900 transition-opacity hover:opacity-70 sm:text-lg md:text-xl font-serif"
        >
          MAUDELART
        </button>

<<<<<<< HEAD
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
=======
        <div className="hidden min-w-0 items-center justify-center gap-8 md:flex lg:gap-12 xl:gap-16">
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
          {navLinks.map((link) => (
            <motion.button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
<<<<<<< HEAD
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
=======
              className={`relative whitespace-nowrap py-2 text-xs font-medium transition-colors lg:text-sm ${currentView === link.id ? 'font-bold text-maudel-dark' : 'text-gray-600 hover:text-maudel-dark'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {link.name}
              {currentView === link.id && (
                <motion.div
                  layoutId="underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-gold"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex lg:gap-4">
          {languageSwitcher}
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f

          {user ? (
            <div className="relative" ref={profileMenuRef}>
              <button
<<<<<<< HEAD
                onClick={() => setIsProfileOpen((open) => !open)}
                className={`group flex h-12 items-center gap-3 rounded-2xl border px-3 py-2 shadow-sm transition-all ${
                  isProfileOpen
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-950'
                    : 'border-gray-200 bg-white text-gray-800 hover:border-emerald-200 hover:bg-emerald-50/60'
                }`}
                aria-label={messages.nav.profileMenu}
                aria-expanded={isProfileOpen}
                aria-haspopup="menu"
=======
                onClick={() => setIsProfileOpen((value) => !value)}
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg p-2 transition-colors hover:bg-gray-100"
                aria-label={t('nav.profileMenu')}
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
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
<<<<<<< HEAD
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
=======
                <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
                  <button
                    onClick={() => handleNavClick('profile')}
                    className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {t('nav.profile')}
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
                  </button>

                  {isAdmin && (
                    <button
<<<<<<< HEAD
                      onClick={() => {
                        handleNavClick('admin');
                        setIsProfileOpen(false);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <LayoutDashboard size={15} className="text-gray-400" /> {messages.nav.admin}
=======
                      onClick={() => handleNavClick('admin')}
                      className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <LayoutDashboard size={14} /> {t('nav.admin')}
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
                    </button>
                  )}

                  <hr className="my-2 border-gray-100" />

                  <button
                    onClick={handleLogout}
<<<<<<< HEAD
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                  >
                    <LogOut size={15} /> {messages.nav.logout}
=======
                    className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={14} /> {t('nav.logout')}
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => handleNavClick('auth')}
              className="flex-shrink-0 rounded-lg bg-green-700 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-green-800 lg:px-6 lg:text-sm"
            >
<<<<<<< HEAD
              {messages.nav.signIn}
=======
              {t('nav.login')}
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
            </button>
          )}
        </div>

        <button
<<<<<<< HEAD
          onClick={() => setIsMenuOpen((open) => !open)}
          className="md:hidden p-2 text-gray-700 flex-shrink-0 hover:bg-gray-100 rounded-lg transition-colors h-10 w-10 flex items-center justify-center"
          aria-label={messages.nav.menu}
=======
          onClick={() => setIsMenuOpen((value) => !value)}
          className="col-start-3 flex h-10 w-10 flex-shrink-0 justify-self-end items-center justify-center rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100 md:hidden"
          aria-label={t('nav.menu')}
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
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
          className="absolute w-full max-w-full overflow-y-auto border-t border-gray-200 bg-white px-4 py-4 shadow-xl md:hidden"
          style={{ maxHeight: 'calc(100vh - 56px)' }}
        >
          <div className="mb-4 flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
              {t('language.label')}
            </span>
            {languageSwitcher}
          </div>

          <div className="flex flex-col gap-0">
            <div className="px-4 pb-3">
              <LanguageSwitcher compact />
            </div>

            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
<<<<<<< HEAD
                className={`text-sm font-semibold text-left py-3 px-4 rounded-xl transition-all duration-300 w-full min-h-[48px] flex items-center justify-between ${
                  currentView === link.id ? 'bg-emerald-50 text-emerald-950 shadow-sm' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
=======
                className="flex h-[44px] w-full items-center rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
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

            {user ? (
              <>
                <hr className="my-2" />

                <button
<<<<<<< HEAD
                  onClick={() => {
                    handleNavClick('profile');
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-700 text-sm font-medium text-left hover:text-gray-900 hover:bg-gray-50 py-3 px-4 rounded-lg transition-colors w-full min-h-[48px] flex items-center gap-2"
                >
                  <User size={16} />
                  {messages.nav.profile}
=======
                  onClick={() => handleNavClick('profile')}
                  className="flex h-[44px] w-full items-center rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                >
                  {t('nav.profile')}
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
                </button>

                {isAdmin && (
                  <button
                    onClick={() => handleNavClick('admin')}
                    className="flex h-[44px] w-full items-center gap-2 rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                  >
<<<<<<< HEAD
                    <LayoutDashboard size={16} /> {messages.nav.admin}
=======
                    <LayoutDashboard size={16} /> {t('nav.admin')}
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="flex h-[44px] w-full items-center gap-2 rounded-lg px-4 py-3 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                >
<<<<<<< HEAD
                  <LogOut size={16} /> {messages.nav.logout}
=======
                  <LogOut size={16} /> {t('nav.logout')}
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
                </button>
              </>
            ) : (
              <button
                onClick={() => handleNavClick('auth')}
                className="mt-3 flex h-[44px] w-full items-center justify-center rounded-lg bg-green-700 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-green-800"
              >
<<<<<<< HEAD
                {messages.nav.signIn}
=======
                {t('nav.login')}
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
              </button>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
