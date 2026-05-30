import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { ArrowUpRight, Facebook, Instagram, Mail, Twitter } from 'lucide-react';
import AdminLogin from './components/Admin/Login';
import Dashboard from './components/Admin/Dashboard';
import Artists from './components/Artists';
import ArtPreviewCarousel from './components/ArtPreviewCarousel';
import Auth from './components/Auth';
import Biography from './components/Biography';
import Checkout from './components/Checkout';
import Contact from './components/Contact';
import Gallery from './components/Gallery';
import HeroNew from './components/Hero';
import Inspiration from './components/Inspiration';
import { Blog } from './components/Blog';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import { useI18n } from './i18n/I18nContext';
import { supabase } from './supabaseClient';
import { Artwork } from './types';
import './index.css';

export type View = 'home' | 'gallery' | 'bio' | 'inspiration' | 'contact' | 'blog' | 'auth' | 'checkout' | 'admin' | 'profile' | 'artists';

export interface NavigationOptions {
  replace?: boolean;
  scroll?: boolean;
}

const VALID_VIEWS: View[] = ['home', 'gallery', 'bio', 'inspiration', 'contact', 'blog', 'auth', 'checkout', 'admin', 'profile', 'artists'];

const pageVariants: Variants = {
  initial: { opacity: 0 },
  enter: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.43, 0.13, 0.23, 0.96] as const,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.4,
      ease: [0.43, 0.13, 0.23, 0.96] as const,
    },
  },
};

const App: React.FC = () => {
  const { messages } = useI18n();
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedArtworkForPurchase, setSelectedArtworkForPurchase] = useState<Artwork | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [selectedArtistFilter, setSelectedArtistFilter] = useState<string | null>(null);

  const buildUrlForView = useCallback((view: View) => {
    const { pathname, search } = window.location;
    return `${pathname}${search}#${view}`;
  }, []);

  const navigateToView = useCallback((view: View, options: NavigationOptions = {}) => {
    setCurrentView(view);

    if (window.location.hash !== `#${view}`) {
      if (options.replace) {
        window.history.replaceState(null, '', buildUrlForView(view));
      } else {
        window.location.hash = view;
      }
    }

    if (options.scroll !== false) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [buildUrlForView]);

  useEffect(() => {
    const checkAdminRole = async (userId: string) => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      setIsAdminAuthenticated(profile?.role === 'admin');
    };

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        await checkAdminRole(session.user.id);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setUser(session.user);
        await checkAdminRole(session.user.id);
      }

      if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAdminAuthenticated(false);
        navigateToView('home', { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigateToView]);

  useEffect(() => {
    const syncViewWithHash = () => {
      const hash = window.location.hash.replace('#', '');
      const nextView = VALID_VIEWS.includes(hash as View) ? (hash as View) : 'home';

      setCurrentView(nextView);

      if (window.location.hash !== `#${nextView}`) {
        window.history.replaceState(null, '', buildUrlForView(nextView));
      }
    };

    window.addEventListener('hashchange', syncViewWithHash);
    syncViewWithHash();

    return () => window.removeEventListener('hashchange', syncViewWithHash);
  }, [buildUrlForView]);

  const handlePurchase = (artwork: Artwork) => {
    setSelectedArtworkForPurchase(artwork);
    navigateToView('checkout');
  };
  const isAdminView = currentView === 'admin';

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <motion.div key="home" variants={pageVariants} initial="initial" animate="enter" exit="exit">
            <HeroNew navigateTo={navigateToView} />

            <section className="py-32 bg-white flex items-center justify-center text-center px-6">
              <div className="max-w-4xl">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                >
                  <h2 className="text-4xl md:text-6xl serif text-emerald-950 leading-relaxed mb-10">{messages.home.quote}</h2>
                  <div className="w-16 h-px bg-[#d4af37] mx-auto mb-6" />
                  <p className="text-[#d4af37] tracking-[0.4em] uppercase text-xs font-bold">- {messages.home.quoteAuthor}</p>
                </motion.div>
              </div>
            </section>

            <ArtPreviewCarousel />

            <div className="bg-[#fcfcf9] py-32 px-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-3xl md:text-5xl serif text-emerald-950 mb-12">{messages.home.immerse}</h3>
                <button
                  onClick={() => navigateToView('gallery')}
                  className="group relative px-12 py-5 bg-emerald-950 text-[#d4af37] uppercase tracking-[0.3em] text-xs transition-all font-bold hover:bg-[#d4af37] hover:text-emerald-950 shadow-2xl"
                >
                  {messages.home.visitGallery}
                </button>
              </motion.div>
            </div>
          </motion.div>
        );
      case 'gallery':
        return <motion.div key="gallery" variants={pageVariants} initial="initial" animate="enter" exit="exit"><Gallery onPurchase={handlePurchase} selectedArtistFilter={selectedArtistFilter} /></motion.div>;
      case 'artists':
        return (
          <motion.div key="artists" variants={pageVariants} initial="initial" animate="enter" exit="exit">
            <Artists onArtistSelect={(authorId) => {
              setSelectedArtistFilter(authorId);
              navigateToView('gallery');
            }} />
          </motion.div>
        );
      case 'bio':
        return <motion.div key="bio" variants={pageVariants} initial="initial" animate="enter" exit="exit"><Biography /></motion.div>;
      case 'inspiration':
        return <motion.div key="inspiration" variants={pageVariants} initial="initial" animate="enter" exit="exit"><Inspiration /></motion.div>;
      case 'contact':
        return <motion.div key="contact" variants={pageVariants} initial="initial" animate="enter" exit="exit"><Contact /></motion.div>;
      case 'auth':
        return <motion.div key="auth" variants={pageVariants} initial="initial" animate="enter" exit="exit"><Auth navigateTo={navigateToView} /></motion.div>;
      case 'checkout':
        return (
          <motion.div key="checkout" variants={pageVariants} initial="initial" animate="enter" exit="exit">
            <Checkout artwork={selectedArtworkForPurchase} onBack={() => navigateToView('gallery')} />
          </motion.div>
        );
      case 'blog':
        return <motion.div key="blog" variants={pageVariants} initial="initial" animate="enter" exit="exit"><Blog /></motion.div>;
      case 'admin':
        return (
          <motion.div key="admin" variants={pageVariants} initial="initial" animate="enter" exit="exit">
            {isAdminAuthenticated ? (
              <Dashboard onLogout={() => {
                setIsAdminAuthenticated(false);
                navigateToView('home');
              }} />
            ) : (
              <AdminLogin onLogin={() => setIsAdminAuthenticated(true)} />
            )}
          </motion.div>
        );
      case 'profile':
        return <motion.div key="profile" variants={pageVariants} initial="initial" animate="enter" exit="exit"><Profile /></motion.div>;
      default:
        return <HeroNew navigateTo={navigateToView} />;
    }
  };

  return (
    <div className="bg-[#041a14] min-h-screen selection:bg-[#d4af37] selection:text-[#041a14]">
      {!isAdminView && (
        <Navbar navigateTo={navigateToView} currentView={currentView} isAdmin={isAdminAuthenticated} user={user} />
      )}

      <main className="scroll-container overflow-x-hidden">
        <AnimatePresence mode="wait">{renderView()}</AnimatePresence>
      </main>

      {!isAdminView && !['contact', 'auth', 'checkout'].includes(currentView) && (
        <footer className="bg-[#020d0a] px-6 py-20 relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full -z-10" />
          <div className="absolute bottom-0 right-[8%] w-[360px] h-[360px] bg-[#d4af37]/[0.04] blur-[110px] rounded-full -z-10" />

          <div className="max-w-[1500px] mx-auto">
            <div className="grid grid-cols-1 gap-12 border-t border-white/5 pt-16 md:grid-cols-2 lg:grid-cols-[1.3fr_0.52fr_0.52fr_0.9fr] lg:gap-14 xl:gap-20">
              <div className="space-y-8 pr-0 xl:pr-8">
                <div onClick={() => navigateToView('home')} className="cursor-pointer inline-block">
                  <span className="text-3xl font-black text-white tracking-tighter">
                    MaudelArt<span className="text-[#34d399]">.</span>
                  </span>
                </div>

                <p className="max-w-[430px] text-white/45 text-lg leading-[1.65]">
                  {messages.footer.description}
                </p>

                <div className="flex flex-wrap gap-6 pt-2">
                  {[Instagram, Facebook, Twitter, Mail].map((Icon, index) => (
                    <a
                      key={index}
                      href="#"
                      className="group text-white/30 transition-all duration-300 hover:-translate-y-0.5 hover:text-emerald-300"
                    >
                      <Icon size={28} strokeWidth={1.4} />
                    </a>
                  ))}
                </div>
              </div>

              <div className="space-y-7">
                <h4 className="text-white/90 font-black text-[12px] uppercase tracking-[0.18em]">{messages.footer.navigation}</h4>
                <ul className="space-y-7">
                  {[
                    { label: messages.nav.gallery, id: 'gallery' },
                    { label: messages.nav.bio, id: 'bio' },
                    { label: 'Blog', id: 'blog' },
                    { label: 'Contact', id: 'contact' },
                  ].map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => navigateToView(item.id as View)}
                        className="text-left text-white/45 hover:text-white transition-colors text-[0.95rem] font-bold uppercase tracking-[0.16em]"
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-7">
                <h4 className="text-white/90 font-black text-[12px] uppercase tracking-[0.18em]">{messages.footer.discover}</h4>
                <ul className="space-y-7">
                  <li>
                    <button
                      onClick={() => navigateToView('inspiration')}
                      className="text-left text-white/45 hover:text-white transition-colors text-[0.95rem] font-bold uppercase tracking-[0.16em]"
                    >
                      {messages.footer.process}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigateToView('gallery')}
                      className="text-left text-white/45 hover:text-white transition-colors text-[0.95rem] font-bold uppercase tracking-[0.16em]"
                    >
                      {messages.footer.works}
                    </button>
                  </li>
                </ul>
              </div>

              <div className="space-y-7">
                <h4 className="text-white/90 font-black text-[12px] uppercase tracking-[0.18em]">{messages.footer.newsletter}</h4>
                <p className="max-w-[360px] text-white/42 text-lg leading-[1.55]">{messages.footer.newsletterText}</p>

                <div className="flex items-center gap-3 pt-1">
                  <input
                    type="email"
                    placeholder={messages.footer.emailPlaceholder}
                    className="h-14 w-full rounded-2xl border border-white/10 bg-[#0a1713] px-5 text-base text-white placeholder:text-white/18 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
                  />
                  <button
                    aria-label={messages.footer.newsletter}
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-400 text-emerald-950 transition-all hover:bg-[#4ef0bc] hover:-translate-y-0.5"
                  >
                    <ArrowUpRight size={22} />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-20 flex flex-col items-center justify-between gap-5 border-t border-white/5 pt-10 text-center lg:flex-row lg:text-left">
              <div className="text-white/20 text-[10px] tracking-[0.34em] uppercase font-bold">{messages.footer.copyright}</div>
              <div className="flex flex-wrap justify-center gap-8">
                <a href="#" className="text-white/20 hover:text-white transition-colors text-[10px] uppercase tracking-[0.2em] font-bold">{messages.footer.legal}</a>
                <a href="#" className="text-white/20 hover:text-white transition-colors text-[10px] uppercase tracking-[0.2em] font-bold">{messages.footer.privacy}</a>
              </div>
              <div className="italic serif text-white/40 text-2xl tracking-normal lg:text-right">{messages.footer.motto}</div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
