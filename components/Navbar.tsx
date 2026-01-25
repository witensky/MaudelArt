
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, Grid, User, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';
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

  // Liste des vues qui nécessitent un fond de navbar opaque par défaut (fonds clairs)
  const viewsNeedingBg = ['gallery', 'inspiration', 'contact', 'blog', 'auth', 'artists', 'profile'];
  const shouldForceBg = viewsNeedingBg.includes(currentView);
  const showBackground = isScrolled || shouldForceBg;

  const navLinks: { name: string; id: View }[] = [
    { name: 'Accueil', id: 'home' },
    { name: 'Galerie', id: 'gallery' },
    { name: 'Artistes', id: 'artists' },
    { name: 'Blog', id: 'blog' },
    { name: 'À Propos', id: 'bio' },
  ];

  const handleNavClick = (id: View) => {
    setView(id);
    setIsMenuOpen(false);
    window.location.hash = id;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className={`fixed w-full z-[100] transition-all duration-500 ${showBackground ? 'py-4 bg-[#064e3b]/95 backdrop-blur-xl border-b border-white/5 shadow-2xl' : 'py-8 bg-transparent'}`}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex justify-between items-center">

        {/* Logo MaudelArt. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => handleNavClick('home')}
          className="cursor-pointer"
        >
          <span className="text-2xl md:text-4xl font-black text-white tracking-tighter uppercase flex items-center">
            MaudelArt<span className="text-[#34d399] ml-0.5">.</span>
          </span>
        </motion.div>

        {/* Navigation Links */}
        <div className="hidden lg:flex space-x-10 items-center">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`text-[13px] font-black uppercase tracking-wider transition-all duration-300 ${currentView === link.id ? 'text-white' : 'text-white/60 hover:text-white'
                }`}
            >
              {link.name}
            </button>
          ))}
          <button className="text-white/60 hover:text-white transition-colors ml-4">
            <Search size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center space-x-5">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 pl-2 pr-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <span className="text-white text-xs font-bold max-w-[100px] truncate hidden md:block">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
                <ChevronDown size={14} className={`text-white/50 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-4 w-64 bg-[#041a14]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2"
                  >
                    <div className="px-5 py-4 border-b border-white/5">
                      <p className="text-white text-sm font-bold truncate">{user.user_metadata?.full_name || 'Utilisateur'}</p>
                      <p className="text-white/40 text-xs truncate">{user.email}</p>
                    </div>

                    <div className="p-2 space-y-1">
                      {isAdmin && (
                        <button
                          onClick={() => { setView('admin'); setIsProfileOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-emerald-400 hover:bg-white/5 transition-colors text-xs font-bold uppercase tracking-wide"
                        >
                          <LayoutDashboard size={16} /> Dashboard Admin
                        </button>
                      )}
                      <button
                        onClick={() => { setView('profile'); setIsProfileOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors text-xs font-bold uppercase tracking-wide"
                      >
                        <User size={16} /> Mon Profil
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors text-xs font-bold uppercase tracking-wide"
                      >
                        <LogOut size={16} /> Déconnexion
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => handleNavClick('auth')}
              className={`px-8 py-3 rounded-full text-[13px] font-black uppercase tracking-widest transition-all shadow-lg ${currentView === 'auth'
                ? 'bg-white text-emerald-950 border border-white'
                : 'bg-[#0a2b23] border border-white/10 text-white hover:bg-emerald-800'
                }`}
            >
              Connexion
            </button>
          )}

          <button className="p-3 bg-white/5 rounded-xl border border-white/10 text-white hover:bg-white/10 transition-all">
            <Grid size={22} strokeWidth={2} />
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden text-white p-2">
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-[#064e3b] z-[110] flex flex-col items-center justify-center space-y-8"
          >
            <button onClick={() => setIsMenuOpen(false)} className="absolute top-8 right-8 text-white"><X size={36} /></button>
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-3xl font-black uppercase tracking-tighter transition-colors ${currentView === link.id ? 'text-emerald-400' : 'text-white'}`}
              >
                {link.name}
              </button>
            ))}
            {user ? (
              <div className="flex flex-col gap-4 w-full px-8">
                <div className="flex items-center gap-4 p-4 bg-black/20 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-bold">{user.user_metadata?.full_name || 'Utilisateur'}</p>
                    <p className="text-white/40 text-xs">{user.email}</p>
                  </div>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => { handleNavClick('admin'); setIsMenuOpen(false); }}
                    className="w-full py-4 bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 rounded-xl text-center font-bold uppercase tracking-widest"
                  >
                    Dashboard Admin
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full py-4 bg-white/5 text-white/60 hover:text-white rounded-xl text-center font-bold uppercase tracking-widest"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('auth')}
                className="px-12 py-5 bg-emerald-500 text-emerald-950 font-black rounded-full text-lg shadow-2xl uppercase tracking-widest"
              >
                Connexion
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
