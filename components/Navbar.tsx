import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, LogOut, Menu, User, X } from 'lucide-react';
import { View, VIEW_PATHS } from '../App';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../supabaseClient';

interface NavbarProps {
  setView: (view: View) => void;
  currentView: View;
  isAdmin: boolean;
  user: any;
}

const Navbar: React.FC<NavbarProps> = ({ setView, currentView, isAdmin, user }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (view: View) => {
    setView(view);
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  const handleNavLinkClick = (event: React.MouseEvent<HTMLAnchorElement>, view: View) => {
    event.preventDefault();
    handleNavClick(view);
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
    { name: t('common.process'), id: 'inspiration' },
    { name: 'Blog', id: 'blog' },
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
    <nav className={`fixed left-0 top-0 z-[100] h-14 w-full transition-all duration-300 md:h-[60px] ${isScrolled ? 'bg-white shadow-md' : 'bg-white'}`}>
      <div className="grid h-full w-full max-w-full grid-cols-[auto_1fr_auto] items-center gap-3 px-4 sm:gap-6 sm:px-6 lg:gap-8 lg:px-8">
        <a
          href={VIEW_PATHS.home}
          onClick={(event) => handleNavLinkClick(event, 'home')}
          className="whitespace-nowrap py-2 text-base font-bold text-gray-900 transition-opacity hover:opacity-70 sm:text-lg md:text-xl font-serif"
        >
          MAUDELART
        </a>

        <div className="hidden min-w-0 items-center justify-center gap-8 md:flex lg:gap-12 xl:gap-16">
          {navLinks.map((link) => (
            <motion.a
              key={link.id}
              href={VIEW_PATHS[link.id]}
              onClick={(event) => handleNavLinkClick(event, link.id)}
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
            </motion.a>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex lg:gap-4">
          {languageSwitcher}

          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen((value) => !value)}
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg p-2 transition-colors hover:bg-gray-100"
                aria-label={t('nav.profileMenu')}
              >
                <User size={18} className="text-gray-700" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
                  <a
                    href={VIEW_PATHS.profile}
                    onClick={(event) => handleNavLinkClick(event, 'profile')}
                    className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {t('nav.profile')}
                  </a>
                  {isAdmin && (
                    <a
                      href={VIEW_PATHS.admin}
                      onClick={(event) => handleNavLinkClick(event, 'admin')}
                      className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <LayoutDashboard size={14} /> {t('nav.admin')}
                    </a>
                  )}
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={14} /> {t('nav.logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <a
              href={VIEW_PATHS.auth}
              onClick={(event) => handleNavLinkClick(event, 'auth')}
              className="flex-shrink-0 rounded-lg bg-green-700 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-green-800 lg:px-6 lg:text-sm"
            >
              {t('nav.login')}
            </a>
          )}
        </div>

        <button
          onClick={() => setIsMenuOpen((value) => !value)}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100 md:hidden"
          aria-label={t('nav.menu')}
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
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={VIEW_PATHS[link.id]}
                onClick={(event) => handleNavLinkClick(event, link.id)}
                className="flex h-[44px] w-full items-center rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
              >
                {link.name}
              </a>
            ))}

            {user ? (
              <>
                <hr className="my-2" />
                <a
                  href={VIEW_PATHS.profile}
                  onClick={(event) => handleNavLinkClick(event, 'profile')}
                  className="flex h-[44px] w-full items-center rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                >
                  {t('nav.profile')}
                </a>
                {isAdmin && (
                  <a
                    href={VIEW_PATHS.admin}
                    onClick={(event) => handleNavLinkClick(event, 'admin')}
                    className="flex h-[44px] w-full items-center gap-2 rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                  >
                    <LayoutDashboard size={16} /> {t('nav.admin')}
                  </a>
                )}
                <button
                  onClick={handleLogout}
                  className="flex h-[44px] w-full items-center gap-2 rounded-lg px-4 py-3 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                >
                  <LogOut size={16} /> {t('nav.logout')}
                </button>
              </>
            ) : (
              <a
                href={VIEW_PATHS.auth}
                onClick={(event) => handleNavLinkClick(event, 'auth')}
                className="mt-3 flex h-[44px] w-full items-center justify-center rounded-lg bg-green-700 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-green-800"
              >
                {t('nav.login')}
              </a>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
