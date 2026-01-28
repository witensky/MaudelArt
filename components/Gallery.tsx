import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, ChevronLeft, ChevronRight, Share2, Info, Grid, Layers, Users, Search, ShoppingBag, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { Artwork } from '../types';

// Fallback constants if DB fails or for initial render
import { AUTHORS as STATIC_AUTHORS, COLLECTIONS as STATIC_COLLECTIONS } from '../constants';

type GalleryView = 'all' | 'collections' | 'authors';

interface GalleryProps {
  onPurchase?: (artwork: Artwork) => void;
  selectedArtistFilter?: string | null;
}

interface ArtworkCardProps {
  art: Artwork;
  index: number;
  authors: any[];
  onSelect: (index: number) => void;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ art, index, authors, onSelect }) => {
  const author = authors.find(a => a.id === art.authorId);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -10 }}
      className="group cursor-pointer"
      onClick={() => onSelect(index)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-white p-3 border border-emerald-950/10 transition-all duration-500 shadow-sm group-hover:shadow-xl">
        <div className="w-full h-full overflow-hidden relative bg-[#f5f5f0]">
          <motion.img
            src={art.image}
            alt={art.title}
            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-emerald-950/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
            <Maximize2 size={24} className="text-white" />
          </div>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-xl serif text-emerald-950 group-hover:text-[#d4af37] transition-colors line-clamp-1">{art.title}</h3>
        <p className="text-[9px] uppercase tracking-widest text-emerald-950/40 font-black mt-2">
          {author?.name} — {art.year}
        </p>
      </div>
    </motion.div>
  );
};

const Gallery: React.FC<GalleryProps> = ({ onPurchase, selectedArtistFilter }) => {
  const [viewMode, setViewMode] = useState<GalleryView>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<string>('All');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);

  // Data State
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [authors, setAuthors] = useState<any[]>(STATIC_AUTHORS);
  const [collections, setCollections] = useState<any[]>(STATIC_COLLECTIONS);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Fetch Artworks
        const { data: artsData } = await supabase
          .from('artworks')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        // Fetch Categories for filter
        const { data: catsData } = await supabase.from('categories').select('*');

        // Fetch Authors & Collections 
        const { data: authData } = await supabase.from('authors').select('*');
        const { data: collData } = await supabase.from('collections').select('*');

        if (catsData) {
          setCategories(['All', ...catsData.map(c => c.name)]);
        }

        if (authData && authData.length > 0) setAuthors(authData.map(a => ({ ...a, avatar: a.avatar_url })));
        if (collData && collData.length > 0) setCollections(collData.map(c => ({ ...c, coverImage: c.cover_image_url })));

        if (artsData) {
          // Map DB snake_case to Frontend types (camelCase/legacy)
          const mappedArtworks: Artwork[] = artsData.map(a => ({
            id: a.id,
            title: a.title,
            category: catsData?.find(c => c.id === a.category_id)?.name || 'Unknown',
            authorId: a.author_id,
            collectionId: a.collection_id,
            year: a.year,
            technique: a.technique,
            image: a.image_url,
            description: a.description,
            dimensions: a.dimensions
          }));
          setArtworks(mappedArtworks);
        }
      } catch (error) {
        console.error("Error loading gallery:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const filteredArtworks = useMemo(() => {
    return artworks.filter(art => {
      const author = authors.find(a => a.id === art.authorId);
      const matchesSearch =
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.technique.toLowerCase().includes(searchQuery.toLowerCase()) ||
        author?.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = filter === 'All' || art.category === filter;
      const matchesArtist = !selectedArtistFilter || art.authorId === selectedArtistFilter;

      return matchesSearch && matchesCategory && matchesArtist;
    });
  }, [searchQuery, filter, artworks, authors, selectedArtistFilter]);

  const selectedArtwork = selectedIndex !== null ? filteredArtworks[selectedIndex] : null;

  const nextArtwork = useCallback(() => {
    if (selectedIndex !== null) {
      setDirection(1);
      setSelectedIndex((selectedIndex + 1) % filteredArtworks.length);
    }
  }, [selectedIndex, filteredArtworks]);

  const prevArtwork = useCallback(() => {
    if (selectedIndex !== null) {
      setDirection(-1);
      setSelectedIndex((selectedIndex - 1 + filteredArtworks.length) % filteredArtworks.length);
    }
  }, [selectedIndex, filteredArtworks]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowRight') nextArtwork();
      if (e.key === 'ArrowLeft') prevArtwork();
      if (e.key === 'Escape') setSelectedIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, nextArtwork, prevArtwork]);

  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedIndex]);



  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : direction < 0 ? -100 : 0,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : direction > 0 ? -100 : 0,
      opacity: 0,
      scale: 0.95
    })
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfcf9]">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    );
  }

  return (
    <section id="galerie" className="pt-20 sm:pt-32 lg:pt-40 pb-20 sm:pb-32 bg-[#fcfcf9] px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header Section - Optimized for mobile */}
        <div className="flex flex-col items-center mb-8 sm:mb-12 lg:mb-24">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#d4af37] uppercase tracking-[0.2em] text-[10px] sm:text-xs font-bold mb-2 sm:mb-4 block text-center"
          >
            Catalogue d'Exception
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl serif text-emerald-950 mb-6 sm:mb-10 text-center leading-tight"
          >
            La Galerie
          </motion.h2>

          {/* Search Bar - Full width on mobile */}
          <div className="w-full max-w-2xl relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-emerald-950/30 group-focus-within:text-[#d4af37] transition-colors">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Rechercher une œuvre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-emerald-950/10 py-2 sm:py-4 pl-14 pr-4 rounded-xl shadow-sm focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/10 transition-all text-sm sm:text-base placeholder:text-emerald-950/40 text-emerald-950 h-12 sm:h-[52px]"
            />
          </div>
        </div>

        {/* View Mode & Category Tabs - Redesigned for mobile */}
        <div className="mb-8 sm:mb-12 lg:mb-16">
          {/* View Mode Tabs - Classic Design */}
          <div className="mb-8 w-full max-w-lg mx-auto bg-gray-100 p-1.5 rounded-xl flex gap-1 shadow-inner">
            {[
              { id: 'all', label: 'Œuvres', icon: Grid },
              { id: 'collections', label: 'Collections', icon: Layers },
              { id: 'authors', label: 'Artistes', icon: Users },
            ].map((view) => (
              <button
                key={view.id}
                onClick={() => setViewMode(view.id as GalleryView)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all duration-200 ${viewMode === view.id
                  ? 'bg-white text-emerald-950 shadow-sm ring-1 ring-black/5 scale-100'
                  : 'text-gray-400 hover:text-emerald-950 hover:bg-black/5'
                  }`}
              >
                <view.icon size={14} className={viewMode === view.id ? "text-[#d4af37]" : "opacity-50"} />
                <span className={viewMode === view.id ? "" : "hidden sm:inline"}>{view.label}</span>
              </button>
            ))}
          </div>

          {/* Category Filter Tabs - Scrollable container */}
          <div className="category-tabs-wrapper overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 pb-2">
            <div className="flex gap-2 sm:gap-4 pb-3 w-max min-w-full sm:justify-center relative px-2">
              {categories.map((cat, idx) => (
                <button
                  key={`${cat}-${idx}`}
                  onClick={() => setFilter(cat)}
                  className={`relative text-xs sm:text-sm uppercase tracking-[0.1em] transition-colors font-bold whitespace-nowrap py-2 px-3 sm:px-4 flex-shrink-0 h-10 flex items-center justify-center ${filter === cat
                    ? 'text-[#d4af37]'
                    : 'text-emerald-950/40 hover:text-emerald-950/70'
                    }`}
                >
                  {cat}
                  {filter === cat && (
                    <motion.div
                      layoutId="catUnder"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d4af37] rounded-t"
                      transition={{ type: 'spring', stiffness: 380, damping: 40 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === 'all' && (
            <motion.div
              key="all-grid"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 md:gap-12 lg:gap-16"
            >
              {filteredArtworks.map((art, idx) => (
                <ArtworkCard
                  key={art.id}
                  art={art}
                  index={idx}
                  authors={authors}
                  onSelect={(i) => { setDirection(0); setSelectedIndex(i); }}
                />
              ))}
            </motion.div>
          )}

          {viewMode === 'collections' && (
            <motion.div
              key="collections-grid"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="space-y-16 sm:space-y-24 md:space-y-32"
            >
              {collections.map((col) => {
                const colArtworks = filteredArtworks.filter(a => a.collectionId === col.id);
                if (colArtworks.length === 0) return null;
                return (
                  <div key={col.id} className="space-y-8 sm:space-y-10 md:space-y-12">
                    <div className="border-l-4 border-[#d4af37] pl-4 sm:pl-6 md:pl-8">
                      <h3 className="text-2xl sm:text-3xl md:text-4xl serif text-emerald-950 mb-2 sm:mb-3 md:mb-4">{col.name}</h3>
                      <p className="text-emerald-950/50 text-xs sm:text-sm leading-relaxed max-w-2xl">{col.description}</p>
                    </div>
                    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                      {colArtworks.map((art) => (
                        <ArtworkCard
                          key={art.id}
                          art={art}
                          index={filteredArtworks.findIndex(fa => fa.id === art.id)}
                          authors={authors}
                          onSelect={(i) => { setDirection(0); setSelectedIndex(i); }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {viewMode === 'authors' && (
            <motion.div
              key="authors-grid"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="space-y-20 sm:space-y-32 md:space-y-40"
            >
              {authors.map((author) => {
                const authorArtworks = filteredArtworks.filter(a => a.authorId === author.id);
                if (authorArtworks.length === 0) return null;
                return (
                  <div key={author.id} className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-start">
                    <div className="lg:col-span-3">
                      <div className="sticky top-20 sm:top-24 bg-white p-6 sm:p-8 border border-emerald-950/10 shadow-sm rounded-xl">
                        <div className="w-20 sm:w-24 h-20 sm:h-24 overflow-hidden border border-emerald-950/10 mb-4 sm:mb-6 mx-auto lg:mx-0">
                          <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="text-lg sm:text-xl md:text-2xl serif text-emerald-950 mb-2 sm:mb-3 md:mb-4 text-center lg:text-left">{author.name}</h3>
                        <p className="text-[11px] sm:text-xs text-emerald-950/60 leading-relaxed italic text-center lg:text-left">{author.bio}</p>
                      </div>
                    </div>
                    <div className="lg:col-span-9 grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                      {authorArtworks.map((art) => (
                        <ArtworkCard
                          key={art.id}
                          art={art}
                          index={filteredArtworks.findIndex(fa => fa.id === art.id)}
                          authors={authors}
                          onSelect={(i) => { setDirection(0); setSelectedIndex(i); }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedArtwork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[5000] flex items-center justify-center p-0 md:p-4 lg:p-12"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedIndex(null)}
              className="absolute inset-0 bg-[#020d0a]/95 backdrop-blur-md cursor-zoom-out"
            />

            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setSelectedIndex(null)}
              className="absolute top-4 right-4 md:top-8 md:right-8 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all z-[5200] group"
            >
              <X size={20} className="md:w-7 md:h-7 group-hover:rotate-90 transition-transform duration-500" />
            </motion.button>

            {/* Navigation 2D Intégrée */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 md:px-8 lg:px-12 z-[5100] pointer-events-none">
              <motion.button
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); prevArtwork(); }}
                className="w-12 h-12 md:w-20 md:h-20 flex items-center justify-center bg-black/20 md:bg-white/5 hover:bg-[#d4af37] text-white hover:text-emerald-950 rounded-full border border-white/10 hover:border-[#d4af37] transition-all pointer-events-auto shadow-2xl group backdrop-blur-sm"
              >
                <ChevronLeft size={24} className="md:w-10 md:h-10 group-hover:-translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); nextArtwork(); }}
                className="w-12 h-12 md:w-20 md:h-20 flex items-center justify-center bg-black/20 md:bg-white/5 hover:bg-[#d4af37] text-white hover:text-emerald-950 rounded-full border border-white/10 hover:border-[#d4af37] transition-all pointer-events-auto shadow-2xl group backdrop-blur-sm"
              >
                <ChevronRight size={24} className="md:w-10 md:h-10 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>

            <motion.div
              key={selectedArtwork.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.4 },
                scale: { duration: 0.5 }
              }}
              className="relative max-w-[1280px] w-full h-[100dvh] md:h-auto md:max-h-[85vh] bg-[#064e3b] shadow-[0_60px_150px_-20px_rgba(0,0,0,0.8)] flex flex-col lg:flex-row z-[5050] overflow-hidden rounded-none md:rounded-sm border border-white/5"
            >
              <div className="w-full h-[40vh] lg:h-auto lg:w-[60%] bg-[#042f24] flex items-center justify-center p-4 md:p-12 border-b lg:border-b-0 lg:border-r border-white/5 overflow-hidden relative">
                <motion.img
                  layoutId={`artwork-${selectedArtwork.id}`}
                  src={selectedArtwork.image}
                  alt={selectedArtwork.title}
                  className="w-full h-full object-contain shadow-2xl"
                />
              </div>

              <div className="w-full lg:w-[40%] bg-[#064e3b] p-6 md:p-16 flex flex-col justify-between overflow-y-auto flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="space-y-6 md:space-y-12"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-4 md:mb-6">
                      <span className="text-[#d4af37] text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em]">
                        {selectedArtwork.category} — {selectedArtwork.year}
                      </span>
                    </div>
                    <h2 className="text-3xl md:text-5xl serif text-white mb-6 md:mb-8 leading-tight">
                      {selectedArtwork.title}
                    </h2>
                    <div className="w-12 h-0.5 bg-[#d4af37]/30 mb-6 md:mb-8" />
                    <p className="text-sm md:text-base text-white/70 serif italic leading-relaxed">
                      "{selectedArtwork.description}"
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 py-8 border-t border-white/10">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Technique</span>
                      <span className="text-sm font-medium text-white">{selectedArtwork.technique}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Dimensions</span>
                      <span className="text-sm font-medium text-white">{selectedArtwork.dimensions}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Artiste</span>
                      <span className="text-sm font-medium text-white">
                        {authors.find(a => a.id === selectedArtwork.authorId)?.name}
                      </span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="mt-8 md:mt-12 space-y-3 md:space-y-4 pb-8 md:pb-0"
                >
                  <button
                    onClick={() => onPurchase?.(selectedArtwork)}
                    className="w-full bg-[#d4af37] text-emerald-950 px-8 py-4 md:py-5 font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl shadow-black/20 group rounded-sm"
                  >
                    Acquérir cette œuvre <ShoppingBag size={18} className="group-hover:scale-110 transition-transform" />
                  </button>
                  <button className="w-full border border-white/10 text-white/60 px-8 py-4 font-black uppercase tracking-[0.3em] text-[9px] flex items-center justify-center gap-3 hover:text-white hover:bg-white/5 transition-all rounded-sm">
                    S'informer <Info size={14} />
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
