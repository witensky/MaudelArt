import { AnimatePresence, motion, Variants } from 'framer-motion';
import { ArrowUpRight, Facebook, Instagram, Mail, Twitter } from 'lucide-react';
import React, { Suspense, useCallback, useEffect, useState } from 'react';
import ArtPreviewCarousel from './components/ArtPreviewCarousel';
import HeroNew from './components/Hero';
import Navbar from './components/Navbar';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import './index.css';
import './responsive.css';
import { supabase } from './supabaseClient';
import { Artwork } from './types';

const DEFAULT_SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/mariemaude_eliacin/',
  facebook: 'https://www.facebook.com/mariemaudeeliacin',
  twitter: 'https://twitter.com/mariemaudelart',
  email: 'mailto:contact@mariemaudeart.com',
};

const AdminLogin = React.lazy(() => import('./components/Admin/Login'));
const Dashboard = React.lazy(() => import('./components/Admin/Dashboard'));
const Profile = React.lazy(() => import('./components/Profile'));
const Artists = React.lazy(() => import('./components/Artists'));
const Gallery = React.lazy(() => import('./components/Gallery'));
const Biography = React.lazy(() => import('./components/Biography'));
const Inspiration = React.lazy(() => import('./components/Inspiration'));
const Contact = React.lazy(() => import('./components/Contact'));
const Auth = React.lazy(() => import('./components/Auth'));
const Checkout = React.lazy(() => import('./components/Checkout'));
const Blog = React.lazy(() => import('./components/Blog'));

export type View =
  | 'home'
  | 'gallery'
  | 'bio'
  | 'inspiration'
  | 'contact'
  | 'blog'
  | 'auth'
  | 'checkout'
  | 'admin'
  | 'profile'
  | 'artists';

const VALID_VIEWS: View[] = ['home', 'gallery', 'bio', 'inspiration', 'contact', 'blog', 'auth', 'checkout', 'admin', 'profile', 'artists'];

const getViewFromHash = (): View => {
  const hash = window.location.hash.replace('#', '') as View;
  return VALID_VIEWS.includes(hash) ? hash : 'home';
};

const LoadingFallback = () => (
  <div className="flex min-h-[50vh] w-full items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
  </div>
);

const App: React.FC = () => {
  const { t } = useLanguage();
  const [currentView, setCurrentView] = useState<View>(() => getViewFromHash());
  const [selectedArtworkForPurchase, setSelectedArtworkForPurchase] = useState<Artwork | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [selectedArtistFilter, setSelectedArtistFilter] = useState<string | null>(null);
  const [socialLinks, setSocialLinks] = useState(DEFAULT_SOCIAL_LINKS);

  const navigateTo = useCallback((view: View) => {
    setCurrentView(view);

    if (window.location.hash !== `#${view}`) {
      window.location.hash = view;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const loadSocialLinks = async () => {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('instagram_url, facebook_url, twitter_url, email_address')
          .single();

        if (data) {
          setSocialLinks({
            instagram: data.instagram_url || DEFAULT_SOCIAL_LINKS.instagram,
            facebook: data.facebook_url || DEFAULT_SOCIAL_LINKS.facebook,
            twitter: data.twitter_url || DEFAULT_SOCIAL_LINKS.twitter,
            email: data.email_address ? `mailto:${data.email_address}` : DEFAULT_SOCIAL_LINKS.email,
          });
        }
      } catch (_) {
        // Silently keep the built-in fallback links.
      }
    };

    loadSocialLinks();
  }, []);

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
        return;
      }

      if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAdminAuthenticated(false);
        navigateTo('home');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigateTo]);

  useEffect(() => {
    const syncViewFromHash = () => {
      setCurrentView(getViewFromHash());
    };

    if (!window.location.hash) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#home`);
    }

    window.addEventListener('hashchange', syncViewFromHash);
    syncViewFromHash();

    return () => {
      window.removeEventListener('hashchange', syncViewFromHash);
    };
  }, []);

  const pageVariants: Variants = {
    initial: {
      opacity: 0,
      scale: 0.98,
      filter: 'blur(10px)',
    },
    enter: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      opacity: 0,
      scale: 1.02,
      filter: 'blur(10px)',
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const handlePurchase = (artwork: Artwork) => {
    setSelectedArtworkForPurchase(artwork);
    navigateTo('checkout');
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <motion.div key="home" variants={pageVariants} initial="initial" animate="enter" exit="exit">
            <HeroNew setView={navigateTo} />

            <section className="flex items-center justify-center bg-white px-6 py-32 text-center">
              <div className="max-w-4xl">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                >
                  <h2 className="mb-10 text-4xl leading-relaxed text-maudel-dark md:text-6xl serif">
                    {t('home.quote')}
                  </h2>
                  <div className="mx-auto mb-6 h-px w-16 bg-gold" />
                  <p className="text-xs font-bold uppercase tracking-[0.4em] text-gold">
                    - {t('home.quoteAuthor')}
                  </p>
                </motion.div>
              </div>
            </section>

            <ArtPreviewCarousel />

            <div className="bg-cream px-6 py-32 text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="mb-12 text-3xl text-maudel-dark md:text-5xl serif">
                  {t('home.immersiveTitle')}
                </h3>
                <button
                  onClick={() => navigateTo('gallery')}
                  className="group relative px-12 py-5 text-xs font-bold uppercase tracking-[0.3em] bg-maudel-dark text-gold shadow-2xl transition-all hover:bg-gold hover:text-maudel-dark"
                >
                  {t('home.visitGallery')}
                </button>
              </motion.div>
            </div>
          </motion.div>
        );
      case 'gallery':
        return (
          <motion.div key="gallery" variants={pageVariants} initial="initial" animate="enter" exit="exit">
            <Gallery onPurchase={handlePurchase} selectedArtistFilter={selectedArtistFilter} />
          </motion.div>
        );
      case 'artists':
        return (
          <motion.div key="artists" variants={pageVariants} initial="initial" animate="enter" exit="exit">
            <Artists
              onArtistSelect={(authorId) => {
                setSelectedArtistFilter(authorId);
                navigateTo('gallery');
              }}
            />
          </motion.div>
        );
      case 'bio':
        return <motion.div key="bio" variants={pageVariants} initial="initial" animate="enter" exit="exit"><Biography /></motion.div>;
      case 'inspiration':
        return <motion.div key="inspiration" variants={pageVariants} initial="initial" animate="enter" exit="exit"><Inspiration /></motion.div>;
      case 'contact':
        return <motion.div key="contact" variants={pageVariants} initial="initial" animate="enter" exit="exit"><Contact /></motion.div>;
      case 'auth':
        return <motion.div key="auth" variants={pageVariants} initial="initial" animate="enter" exit="exit"><Auth setView={navigateTo} /></motion.div>;
      case 'checkout':
        return (
          <motion.div key="checkout" variants={pageVariants} initial="initial" animate="enter" exit="exit">
            <Checkout artwork={selectedArtworkForPurchase} onBack={() => navigateTo('gallery')} />
          </motion.div>
        );
      case 'blog':
        return <motion.div key="blog" variants={pageVariants} initial="initial" animate="enter" exit="exit"><Blog /></motion.div>;
      case 'admin':
        return (
          <motion.div key="admin" variants={pageVariants} initial="initial" animate="enter" exit="exit">
            {isAdminAuthenticated ? (
              <Dashboard onLogout={() => { setIsAdminAuthenticated(false); navigateTo('home'); }} />
            ) : (
              <AdminLogin onLogin={() => setIsAdminAuthenticated(true)} />
            )}
          </motion.div>
        );
      case 'profile':
        return <motion.div key="profile" variants={pageVariants} initial="initial" animate="enter" exit="exit"><Profile /></motion.div>;
      default:
        return <HeroNew setView={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-maudel-dark selection:bg-gold selection:text-maudel-dark">
      {currentView !== 'admin' && (
        <Navbar setView={navigateTo} currentView={currentView} isAdmin={isAdminAuthenticated} user={user} />
      )}

      <main className="scroll-container">
        <AnimatePresence mode="wait">
          <Suspense fallback={<LoadingFallback />}>
            {renderView()}
          </Suspense>
        </AnimatePresence>
      </main>

      {!['contact', 'auth', 'checkout'].includes(currentView) && (
        <footer className="relative overflow-hidden border-t border-white/5 bg-maudel-darker px-6 py-24">
          <div className="absolute left-1/4 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-[120px]" />

          <div className="mx-auto max-w-7xl">
            <div className="mb-20 grid grid-cols-1 items-start gap-16 md:grid-cols-12">
              <div className="space-y-8 md:col-span-5">
                <button onClick={() => navigateTo('home')} className="inline-block cursor-pointer text-left">
                  <span className="text-3xl font-black tracking-tighter text-white">
                    MaudelArt<span className="text-emerald-400">.</span>
                  </span>
                </button>

                <p className="max-w-sm text-sm leading-relaxed text-white/40">
                  {t('home.footerDescription')}
                </p>

                <div className="flex space-x-6">
                  {([
                    { Icon: Instagram, href: socialLinks.instagram, label: 'Instagram' },
                    { Icon: Facebook, href: socialLinks.facebook, label: 'Facebook' },
                    { Icon: Twitter, href: socialLinks.twitter, label: 'Twitter / X' },
                    { Icon: Mail, href: socialLinks.email, label: t('hero.email') },
                  ] as const).map(({ Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      target={href.startsWith('mailto') ? undefined : '_blank'}
                      rel="noreferrer noopener"
                      className="rounded-sm text-white/30 transition-all hover:text-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                    >
                      <Icon size={20} strokeWidth={1.5} />
                    </a>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 md:col-span-4">
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white/80">{t('common.navigation')}</h4>
                  <ul className="space-y-4">
                    {[
                      { label: t('nav.gallery'), id: 'gallery' },
                      { label: t('nav.about'), id: 'bio' },
                      { label: 'Blog', id: 'blog' },
                      { label: t('nav.contact'), id: 'contact' },
                    ].map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => navigateTo(item.id as View)}
                          className="text-xs font-bold uppercase tracking-widest text-white/40 transition-colors hover:text-white"
                        >
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white/80">{t('common.discover')}</h4>
                  <ul className="space-y-4">
                    <li>
                      <button
                        onClick={() => navigateTo('inspiration')}
                        className="text-xs font-bold uppercase tracking-widest text-white/40 transition-colors hover:text-white"
                      >
                        {t('common.process')}
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => navigateTo('artists')}
                        className="text-xs font-bold uppercase tracking-widest text-white/40 transition-colors hover:text-white"
                      >
                        {t('nav.artists')}
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6 md:col-span-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/80">{t('common.newsletter')}</h4>
                <p className="text-xs text-white/30">{t('home.newsletterDescription')}</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder={t('common.emailPlaceholder')}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                  <button className="rounded-lg bg-emerald-500 p-2 font-bold text-emerald-950 transition-all hover:bg-emerald-400">
                    <ArrowUpRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-10 md:flex-row">
              <div className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/20">
                {t('home.copyright')}
              </div>
              <div className="flex gap-8">
                <a href="#" className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/20 transition-colors hover:text-white">
                  {t('common.legal')}
                </a>
                <a href="#" className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/20 transition-colors hover:text-white">
                  {t('common.privacy')}
                </a>
              </div>
              <div className="text-xs italic tracking-normal text-white/40 serif">
                {t('common.beauty')}
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

const AppWithProviders: React.FC = () => (
  <LanguageProvider>
    <CurrencyProvider>
      <App />
    </CurrencyProvider>
  </LanguageProvider>
);

export default AppWithProviders;
