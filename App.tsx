
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { supabase } from './supabaseClient';
import AdminLogin from './components/Admin/Login';
import Dashboard from './components/Admin/Dashboard';
import Profile from './components/Profile';
import Artists from './components/Artists';
import Navbar from './components/Navbar';
import HeroNew from './components/HeroNew';
import Gallery from './components/Gallery';
import Biography from './components/Biography';
import Inspiration from './components/Inspiration';
import Contact from './components/Contact';
import Auth from './components/Auth';
import Checkout from './components/Checkout';
import ArtPreviewCarousel from './components/ArtPreviewCarousel';
import { Instagram, Facebook, Twitter, Mail, ArrowUpRight } from 'lucide-react';
import { Artwork } from './types';

export type View = 'home' | 'gallery' | 'bio' | 'inspiration' | 'contact' | 'blog' | 'auth' | 'checkout' | 'admin' | 'profile' | 'artists';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedArtworkForPurchase, setSelectedArtworkForPurchase] = useState<Artwork | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [selectedArtistFilter, setSelectedArtistFilter] = useState<string | null>(null);

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
    initial: { opacity: 0 },
    enter: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.43, 0.13, 0.23, 0.96] as any
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: [0.43, 0.13, 0.23, 0.96] as any
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
                  <h2 className="text-4xl md:text-6xl serif text-emerald-950 leading-relaxed mb-10">
                    "L'art ne reproduit pas le visible ; il rend visible."
                  </h2>
                  <div className="w-16 h-px bg-[#d4af37] mx-auto mb-6" />
                  <p className="text-[#d4af37] tracking-[0.4em] uppercase text-xs font-bold">— Paul Klee</p>
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
                <h3 className="text-3xl md:text-5xl serif text-emerald-950 mb-12">Plongez dans l'intégralité de l'œuvre</h3>
                <button
                  onClick={() => handleLinkClick('gallery')}
                  className="group relative px-12 py-5 bg-emerald-950 text-[#d4af37] uppercase tracking-[0.3em] text-xs transition-all font-bold hover:bg-[#d4af37] hover:text-emerald-950 shadow-2xl"
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
        return (
          <motion.div key="blog" variants={pageVariants} initial="initial" animate="enter" exit="exit" className="pt-40 pb-32 px-6 min-h-screen bg-[#041a14] flex items-center justify-center text-center">
            <div className="max-w-3xl">
              <h2 className="text-5xl md:text-7xl serif text-white mb-8">Journal Artistique</h2>
              <p className="text-white/60 text-xl leading-relaxed italic">
                Réflexions sur la peinture, le processus créatif et les inspirations à venir. <br />
                <span className="text-emerald-400 not-italic font-bold text-sm uppercase tracking-widest mt-6 block">Bientôt disponible</span>
              </p>
              <button onClick={() => handleLinkClick('home')} className="mt-12 text-[#d4af37] uppercase tracking-widest text-xs font-bold hover:text-white transition-colors">
                Retour à l'accueil
              </button>
            </div>
          </motion.div>
        );
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
    <div className="bg-[#041a14] min-h-screen selection:bg-[#d4af37] selection:text-[#041a14]">
      <Navbar setView={setCurrentView} currentView={currentView} isAdmin={isAdminAuthenticated} user={user} />
      <main className="scroll-container overflow-x-hidden">
        <AnimatePresence mode="wait">
          {renderView()}
        </AnimatePresence>
      </main>

      {/* Global Footer */}
      {!['contact', 'auth', 'checkout'].includes(currentView) && (
        <footer className="bg-[#020d0a] py-24 px-6 border-t border-white/5 relative overflow-hidden">
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
                    MaudelArt<span className="text-[#34d399]">.</span>
                  </span>
                </div>
                <p className="text-white/40 text-sm leading-relaxed max-w-sm">
                  Une immersion dans l'univers pictural de Marie Maude Eliacin, où chaque coup de pinceau est une émotion partagée.
                </p>
                <div className="flex space-x-6">
                  {[Instagram, Facebook, Twitter, Mail].map((Icon, i) => (
                    <a key={i} href="#" className="text-white/30 hover:text-emerald-400 transition-all">
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

export default App;
