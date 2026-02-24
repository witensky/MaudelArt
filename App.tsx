
import React, { useState, useEffect, Suspense } from 'react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { supabase } from './supabaseClient';
import Navbar from './components/Navbar';
import HeroNew from './components/Hero';
import ArtPreviewCarousel from './components/ArtPreviewCarousel';
import { Instagram, Facebook, Twitter, Mail, ArrowUpRight } from 'lucide-react';
import { Artwork } from './types';
import { CurrencyProvider } from './contexts/CurrencyContext';
import './index.css'

// Default social links (overridden by site_settings from Supabase at runtime)
const DEFAULT_SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/mariemaude_eliacin/',
  facebook: 'https://www.facebook.com/mariemaudeeliacin',
  twitter: 'https://twitter.com/mariemaudelart',
  email: 'mailto:contact@mariemaudeart.com',
};

// Lazy load components for performance
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

export type View = 'home' | 'gallery' | 'bio' | 'inspiration' | 'contact' | 'blog' | 'auth' | 'checkout' | 'admin' | 'profile' | 'artists';

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[50vh] w-full">
    <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
  </div>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedArtworkForPurchase, setSelectedArtworkForPurchase] = useState<Artwork | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [selectedArtistFilter, setSelectedArtistFilter] = useState<string | null>(null);
  const [socialLinks, setSocialLinks] = useState(DEFAULT_SOCIAL_LINKS);

  // Load social links from site_settings
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
        // silently use defaults
      }
    };
    loadSocialLinks();
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        checkAdminRole(session.user.id);
      }
    };

    const checkAdminRole = async (userId: string) => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      if (profile?.role === 'admin') {
        setIsAdminAuthenticated(true);
      } else {
        setIsAdminAuthenticated(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setUser(session.user);
        checkAdminRole(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAdminAuthenticated(false);
        setCurrentView('home');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') as View;
      const validViews: View[] = ['home', 'gallery', 'bio', 'inspiration', 'contact', 'blog', 'auth', 'checkout', 'admin', 'profile', 'artists'];
      if (validViews.includes(hash)) {
        setCurrentView(hash);
      }
    };
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const pageVariants: Variants = {
    initial: {
      opacity: 0,
      scale: 0.98,
      filter: 'blur(10px)'
    },
    enter: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: {
      opacity: 0,
      scale: 1.02,
      filter: 'blur(10px)',
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const handleLinkClick = (id: View) => {
    setCurrentView(id);
    window.location.hash = id;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePurchase = (artwork: Artwork) => {
    setSelectedArtworkForPurchase(artwork);
    handleLinkClick('checkout');
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <motion.div key="home" variants={pageVariants} initial="initial" animate="enter" exit="exit">
            <HeroNew setView={handleLinkClick} />
            <section className="py-32 bg-white flex items-center justify-center text-center px-6">
              <div className="max-w-4xl">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                >
                  <h2 className="text-4xl md:text-6xl serif text-maudel-dark leading-relaxed mb-10">
                    "L'art ne reproduit pas le visible ; il rend visible."
                  </h2>
                  <div className="w-16 h-px bg-gold mx-auto mb-6" />
                  <p className="text-gold tracking-[0.4em] uppercase text-xs font-bold">— Paul Klee</p>
                </motion.div>
              </div>
            </section>

            <ArtPreviewCarousel />

            <div className="bg-cream py-32 px-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-3xl md:text-5xl serif text-maudel-dark mb-12">Plongez dans l'intégralité de l'œuvre</h3>
                <button
                  onClick={() => handleLinkClick('gallery')}
                  className="group relative px-12 py-5 bg-maudel-dark text-gold uppercase tracking-[0.3em] text-xs transition-all font-bold hover:bg-gold hover:text-maudel-dark shadow-2xl"
                >
                  Visiter la Galerie
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
            <Artists onArtistSelect={(authorId) => { setSelectedArtistFilter(authorId); handleLinkClick('gallery'); }} />
          </motion.div>
        );
      case 'bio':
        return <motion.div key="bio" variants={pageVariants} initial="initial" animate="enter" exit="exit"><Biography /></motion.div>;
      case 'inspiration':
        return <motion.div key="inspiration" variants={pageVariants} initial="initial" animate="enter" exit="exit"><Inspiration /></motion.div>;
      case 'contact':
        return <motion.div key="contact" variants={pageVariants} initial="initial" animate="enter" exit="exit"><Contact /></motion.div>;
      case 'auth':
        return <motion.div key="auth" variants={pageVariants} initial="initial" animate="enter" exit="exit"><Auth setView={handleLinkClick} /></motion.div>;
      case 'checkout':
        return (
          <motion.div key="checkout" variants={pageVariants} initial="initial" animate="enter" exit="exit">
            <Checkout artwork={selectedArtworkForPurchase} onBack={() => handleLinkClick('gallery')} />
          </motion.div>
        );
      case 'blog':
        return <motion.div key="blog" variants={pageVariants} initial="initial" animate="enter" exit="exit"><Blog /></motion.div>;
      case 'admin':
        return (
          <motion.div key="admin" variants={pageVariants} initial="initial" animate="enter" exit="exit">
            {isAdminAuthenticated ? (
              <Dashboard onLogout={() => { setIsAdminAuthenticated(false); handleLinkClick('home'); }} />
            ) : (
              <AdminLogin onLogin={() => setIsAdminAuthenticated(true)} />
            )}
          </motion.div>
        );
      case 'profile':
        return <motion.div key="profile" variants={pageVariants} initial="initial" animate="enter" exit="exit"><Profile /></motion.div>;
      default:
        return <HeroNew setView={handleLinkClick} />;
    }
  };

  return (
    <div className="bg-maudel-dark min-h-screen selection:bg-gold selection:text-maudel-dark">
      {currentView !== 'admin' && <Navbar setView={setCurrentView} currentView={currentView} isAdmin={isAdminAuthenticated} user={user} />}
      <main className="scroll-container">
        <AnimatePresence mode="wait">
          <Suspense fallback={<LoadingFallback />}>
            {renderView()}
          </Suspense>
        </AnimatePresence>
      </main>

      {/* Global Footer */}
      {!['contact', 'auth', 'checkout'].includes(currentView) && (
        <footer className="bg-maudel-darker py-24 px-6 border-t border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full -z-10" />

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start mb-20">
              {/* Brand Section */}
              <div className="md:col-span-5 space-y-8">
                <div
                  onClick={() => handleLinkClick('home')}
                  className="cursor-pointer inline-block"
                >
                  <span className="text-3xl font-black text-white tracking-tighter">
                    MaudelArt<span className="text-emerald-400">.</span>
                  </span>
                </div>
                <p className="text-white/40 text-sm leading-relaxed max-w-sm">
                  Une immersion dans l'univers pictural de Marie Maude Eliacin, où chaque coup de pinceau est une émotion partagée.
                </p>
                <div className="flex space-x-6">
                  {([
                    { Icon: Instagram, href: socialLinks.instagram, label: 'Instagram' },
                    { Icon: Facebook, href: socialLinks.facebook, label: 'Facebook' },
                    { Icon: Twitter, href: socialLinks.twitter, label: 'Twitter / X' },
                    { Icon: Mail, href: socialLinks.email, label: 'Email de contact' },
                  ] as const).map(({ Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      target={href.startsWith('mailto') ? undefined : '_blank'}
                      rel="noreferrer noopener"
                      className="text-white/30 hover:text-emerald-400 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-sm"
                    >
                      <Icon size={20} strokeWidth={1.5} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Navigation Links */}
              <div className="md:col-span-4 grid grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h4 className="text-white/80 font-black text-[10px] uppercase tracking-widest">Navigation</h4>
                  <ul className="space-y-4">
                    {[
                      { label: 'Galerie', id: 'gallery' },
                      { label: 'Biographie', id: 'bio' },
                      { label: 'Blog', id: 'blog' },
                      { label: 'Contact', id: 'contact' }
                    ].map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => handleLinkClick(item.id as View)}
                          className="text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
                        >
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-6">
                  <h4 className="text-white/80 font-black text-[10px] uppercase tracking-widest">Découvrir</h4>
                  <ul className="space-y-4">
                    <li><button onClick={() => handleLinkClick('inspiration')} className="text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Processus</button></li>
                    <li><button onClick={() => handleLinkClick('gallery')} className="text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Collections</button></li>
                  </ul>
                </div>
              </div>

              {/* Newsletter Teaser */}
              <div className="md:col-span-3 space-y-6">
                <h4 className="text-white/80 font-black text-[10px] uppercase tracking-widest">Newsletter</h4>
                <p className="text-white/30 text-xs">Restez informé des prochaines expositions et nouvelles œuvres.</p>
                <div className="flex gap-2">
                  <input type="email" placeholder="Votre email" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 w-full" />
                  <button className="p-2 bg-emerald-500 text-emerald-950 rounded-lg font-bold transition-all hover:bg-emerald-400">
                    <ArrowUpRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-white/20 text-[9px] tracking-[0.4em] uppercase font-bold">
                © 2024 MaudelArt — Marie Maude Eliacin
              </div>
              <div className="flex gap-8">
                <a href="#" className="text-white/20 hover:text-white transition-colors text-[9px] uppercase tracking-[0.2em] font-bold">Mentions Légales</a>
                <a href="#" className="text-white/20 hover:text-white transition-colors text-[9px] uppercase tracking-[0.2em] font-bold">Confidentialité</a>
              </div>
              <div className="italic serif text-white/40 text-xs tracking-normal">
                La beauté sauvera le monde.
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

// Wrap with CurrencyProvider at module level
const AppWithProviders: React.FC = () => (
  <CurrencyProvider>
    <App />
  </CurrencyProvider>
);

export default AppWithProviders;
