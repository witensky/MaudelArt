import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, ChevronLeft, ChevronRight, Info, Grid, Layers, Users, Search, ShoppingBag, Loader2, SlidersHorizontal } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { Artwork } from '../types';

// Fallback constants if DB fails or for initial render
import { AUTHORS as STATIC_AUTHORS, COLLECTIONS as STATIC_COLLECTIONS } from '../constants';

// ─── Gallery Modal via Portal (bypasses parent overflow:hidden) ───────────────
interface GalleryModalProps {
  artwork: Artwork;
  authors: any[];
  direction: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onPurchase?: (artwork: Artwork) => void;
}

const slideVariantsModal = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : direction < 0 ? -100 : 0,
    opacity: 0,
    scale: 0.95
  }),
  center: { zIndex: 1, x: 0, opacity: 1, scale: 1 },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 100 : direction > 0 ? -100 : 0,
    opacity: 0,
    scale: 0.95
  })
};

const GalleryModal: React.FC<GalleryModalProps> = ({
  artwork, authors, direction, onClose, onNext, onPrev, onPurchase
}) => {
  const author = authors.find(a => a.id === artwork.authorId);

  const modal = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(2,13,10,0.96)', backdropFilter: 'blur(12px)', cursor: 'zoom-out' }}
      />

      {/* Close button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        onClick={onClose}
        aria-label="Fermer"
        style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10001 }}
        className="w-12 h-12 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all group"
      >
        <X size={22} className="group-hover:rotate-90 transition-transform duration-500" />
      </motion.button>

      {/* Prev / Next arrows */}
      <div style={{ position: 'absolute', inset: '0 0 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem', zIndex: 10001, pointerEvents: 'none' }}>
        <motion.button
          initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          style={{ pointerEvents: 'auto' }}
          className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-black/50 hover:bg-[#d4af37] text-white hover:text-emerald-950 rounded-full border border-white/10 hover:border-[#d4af37] transition-all shadow-2xl backdrop-blur-sm"
        >
          <ChevronLeft size={22} />
        </motion.button>
        <motion.button
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          style={{ pointerEvents: 'auto' }}
          className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-black/50 hover:bg-[#d4af37] text-white hover:text-emerald-950 rounded-full border border-white/10 hover:border-[#d4af37] transition-all shadow-2xl backdrop-blur-sm"
        >
          <ChevronRight size={22} />
        </motion.button>
      </div>

      {/* Modal panel */}
      <motion.div
        key={artwork.id}
        custom={direction}
        variants={slideVariantsModal}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          x: { type: 'tween', ease: [0.22, 1, 0.36, 1], duration: 0.45 },
          opacity: { duration: 0.35 },
          scale: { duration: 0.45 }
        }}
        style={{ position: 'relative', zIndex: 10000, width: '100%', maxWidth: '1280px' }}
        className="h-[100dvh] md:h-auto md:max-h-[88vh] bg-[#064e3b] shadow-[0_60px_150px_-20px_rgba(0,0,0,0.85)] flex flex-col lg:flex-row overflow-hidden rounded-none md:rounded-xl border border-white/5 mx-0 md:mx-4 lg:mx-8"
      >
        {/* Image panel */}
        <div className="w-full flex-shrink-0 h-[42vh] lg:h-auto lg:w-[58%] bg-[#032318] flex items-center justify-center p-4 md:p-10 border-b lg:border-b-0 lg:border-r border-white/5">
          <img
            src={artwork.image}
            alt={artwork.title}
            className="w-full h-full object-contain shadow-2xl max-h-[38vh] lg:max-h-none"
          />
        </div>

        {/* Info panel */}
        <div className="w-full lg:w-[42%] bg-[#064e3b] flex flex-col overflow-y-auto">
          <div className="flex-1 p-6 md:p-10 space-y-6 md:space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              <span className="text-[#d4af37] text-[10px] font-black uppercase tracking-[0.4em] block mb-3">
                {artwork.category} — {artwork.year}
              </span>
              <h2 className="text-3xl md:text-4xl serif text-white mb-4 leading-tight">{artwork.title}</h2>
              <div className="w-10 h-0.5 bg-[#d4af37]/40 mb-4" />
              <p className="text-sm text-white/65 serif italic leading-relaxed">"{artwork.description}"</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="space-y-3 pt-6 border-t border-white/10"
            >
              {[
                { label: 'Technique', value: artwork.technique },
                { label: 'Dimensions', value: artwork.dimensions },
                { label: 'Artiste', value: author?.name },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{label}</span>
                  <span className="text-sm font-medium text-white/90">{value || '—'}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Action buttons — sticky at bottom */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="p-6 md:p-10 pt-0 space-y-3 pb-8 md:pb-10"
          >
            <button
              onClick={() => onPurchase?.(artwork)}
              className="w-full bg-[#d4af37] text-emerald-950 px-6 py-4 font-black uppercase tracking-[0.25em] text-[10px] flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl group rounded-xl active:scale-95"
            >
              Acquérir cette œuvre <ShoppingBag size={16} className="group-hover:scale-110 transition-transform" />
            </button>
            <button className="w-full border border-white/15 text-white/60 px-6 py-3.5 font-black uppercase tracking-[0.25em] text-[9px] flex items-center justify-center gap-2 hover:text-white hover:bg-white/5 transition-all rounded-xl active:scale-95">
              S'informer <Info size={14} />
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );

  return ReactDOM.createPortal(modal, document.body);
};


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

const ArtworkCard = React.memo<ArtworkCardProps>(({ art, index, authors, onSelect }) => {
  const author = authors.find(a => a.id === art.authorId);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="group cursor-pointer relative"
      onClick={() => onSelect(index)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-white p-3 sm:p-4 border border-emerald-950/5 transition-all duration-700 shadow-[0_4px_25px_rgba(0,0,0,0.02)] group-hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] group-hover:border-emerald-950/10 rounded-sm">
        <div className="w-full h-full overflow-hidden relative bg-[#f5f5f0] rounded-sm">
          <motion.img
            src={art.image}
            alt={art.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-[2.5s] ease-out group-hover:scale-110"
            decoding="async"
          />
          <div className="absolute inset-0 bg-emerald-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center backdrop-blur-[2px]">
            <div className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-2xl scale-0 group-hover:scale-100 transition-transform duration-500 delay-100">
              <Maximize2 size={20} className="text-[#d4af37]" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 space-y-2 px-1">
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-lg sm:text-xl serif text-emerald-950 transition-colors duration-300 group-hover:text-[#d4af37] leading-tight flex-1">
            {art.title}
          </h3>
          <span className="text-[9px] font-black tracking-widest text-[#d4af37] border border-[#d4af37]/20 px-1.5 py-0.5 rounded">
            {art.year}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-[1px] bg-[#d4af37]/30" />
          <p className="text-[9px] uppercase tracking-[0.2em] text-emerald-950/40 font-black">
            {author?.name || 'Artiste Indépendant'}
          </p>
        </div>
      </div>
    </motion.div>
  );
});

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
        // Fetch Artworks containing strict fields to avoid heavy JSONB columns (like gallery_images)
        // includes joined category name to avoid manual lookup
        const { data: artsData } = await supabase
          .from('artworks')
          .select(`
            id, title, technique, dimensions, year, image_url, description, 
            author_id, collection_id, category_id, is_active, created_at,
            categories (name)
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        // Fetch Categories for filter tabs
        const { data: catsData } = await supabase.from('categories').select('*');

        // Fetch Authors & Collections for sections/views
        const { data: authData } = await supabase.from('authors').select('*');
        const { data: collData } = await supabase.from('collections').select('*');

        if (catsData) {
          setCategories(['All', ...catsData.map(c => c.name)]);
        }

        if (authData && authData.length > 0) setAuthors(authData.map(a => ({ ...a, avatar: a.avatar_url })));
        if (collData && collData.length > 0) setCollections(collData.map(c => ({ ...c, coverImage: c.cover_image_url })));

        if (artsData) {
          // Map DB snake_case & joined data to Frontend types
          const mappedArtworks: Artwork[] = artsData.map((a: any) => ({
            id: a.id,
            title: a.title,
            category: a.categories?.name || 'Unknown', // Use joined data
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



  const handleSelect = useCallback((index: number) => {
    setDirection(0);
    setSelectedIndex(index);
  }, []);



  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfcf9] space-y-8">
        <div className="relative">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-24 h-24 rounded-full border border-[#d4af37]/20 flex items-center justify-center"
          >
            <div className="w-16 h-16 rounded-full border border-[#d4af37]/40" />
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="animate-spin text-[#d4af37]" size={24} strokeWidth={1.5} />
          </div>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#d4af37] animate-pulse">
            MaudelArt
          </span>
          <span className="text-xs text-emerald-950/30 serif italic">Chargement de la galerie...</span>
        </div>
      </div>
    );
  }

  return (
    <section id="galerie" className="pt-8 sm:pt-16 lg:pt-24 pb-20 sm:pb-32 bg-[#fcfcf9] px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header Section - Content-First Redesign */}
        <div className="flex flex-col items-center mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center space-y-2 sm:space-y-4 max-w-2xl"
          >
            <span className="text-[#d4af37] uppercase tracking-[0.4em] text-[9px] sm:text-[10px] font-black">
              Collection Exclusive
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl serif text-emerald-950 leading-tight tracking-tight">
              Galerie
            </h1>
            <p className="text-emerald-950/50 text-sm sm:text-base serif italic max-w-xl leading-relaxed">
              Sélection méticuleuse d'œuvres originales, sérénité et élégance tropicale.
            </p>
          </motion.div>
        </div>

        {/* Compact Navigation & Search Toolbar */}
        <div className="mb-12 border-y border-emerald-950/5 py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* View & Categories Group */}
            <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
              {/* Primary View Selector — Very Compact */}
              <div className="inline-flex p-1 bg-gray-100/50 rounded-xl border border-black/5">
                {[
                  { id: 'all', label: 'Œuvres', icon: Grid },
                  { id: 'collections', label: 'Collections', icon: Layers },
                  { id: 'authors', label: 'Artistes', icon: Users },
                ].map((view) => {
                  const isActive = viewMode === view.id;
                  const Icon = view.icon;
                  return (
                    <button
                      key={view.id}
                      onClick={() => setViewMode(view.id as GalleryView)}
                      className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${isActive ? 'text-emerald-950' : 'text-emerald-950/40'
                        }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-white rounded-lg shadow-sm"
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <Icon size={12} className={`relative z-10 ${isActive ? 'text-[#d4af37]' : 'opacity-40'}`} />
                      <span className="relative z-10">{view.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="hidden sm:block w-px h-6 bg-emerald-950/10" />

              {/* Secondary Categories — Scrollable row */}
              <div className="overflow-x-auto no-scrollbar max-w-full sm:max-w-[400px]">
                <div className="flex items-center gap-4">
                  {categories.map((cat) => {
                    const isActive = filter === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`whitespace-nowrap text-[10px] uppercase tracking-widest transition-colors ${isActive ? 'text-[#d4af37] font-black' : 'text-emerald-950/40 font-bold hover:text-emerald-950'
                          }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Search Bar — Integrated into the row */}
            <div className="relative w-full lg:w-72">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-950/30"
              />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 bg-white border border-emerald-950/10 pl-11 pr-10 rounded-xl text-xs focus:outline-none focus:border-[#d4af37]/40 transition-all font-medium"
              />
              {searchQuery.length > 0 && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-950/20 hover:text-emerald-950"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === 'all' && (
            <motion.div
              key="all-grid"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 sm:gap-x-8 sm:gap-y-16 lg:gap-x-10 lg:gap-y-20"
            >
              {filteredArtworks.map((art, idx) => (
                <ArtworkCard
                  key={art.id}
                  art={art}
                  index={idx}
                  authors={authors}
                  onSelect={handleSelect}
                />
              ))}
            </motion.div>
          )}

          {viewMode === 'collections' && (
            <motion.div
              key="collections-grid"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="space-y-32 sm:space-y-48"
            >
              {collections.map((col, colIdx) => {
                const colArtworks = filteredArtworks.filter(a => a.collectionId === col.id);
                if (colArtworks.length === 0) return null;
                return (
                  <div key={col.id} className="space-y-12 sm:space-y-16">
                    <div className="relative max-w-3xl">
                      <div className="flex items-center gap-6 mb-4">
                        <div className="w-12 h-px bg-[#d4af37]/40" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#d4af37]">
                          Collection {String(colIdx + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <h3 className="text-3xl sm:text-4xl md:text-5xl serif text-emerald-950 mb-6 leading-tight tracking-tight">
                        {col.name}
                      </h3>
                      <p className="text-emerald-950/60 text-sm sm:text-base leading-relaxed serif italic border-l-2 border-[#d4af37]/20 pl-6">
                        {col.description}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 sm:gap-x-8 sm:gap-y-16 lg:gap-x-10 lg:gap-y-20">
                      {colArtworks.map((art, artIdx) => (
                        <ArtworkCard
                          key={art.id}
                          art={art}
                          index={artIdx}
                          authors={authors}
                          onSelect={handleSelect}
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
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="space-y-32 sm:space-y-48"
            >
              {authors.map((author) => {
                const authorArtworks = filteredArtworks.filter(a => a.authorId === author.id);
                if (authorArtworks.length === 0) return null;
                return (
                  <div key={author.id} className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 lg:gap-24 items-start">
                    <div className="lg:col-span-4">
                      <div className="sticky top-24 sm:top-32 bg-white p-8 sm:p-12 border border-emerald-950/5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] rounded-2xl text-center lg:text-left">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 overflow-hidden border-2 border-[#d4af37]/20 mb-8 mx-auto lg:mx-0 rounded-full p-2 relative">
                          <div className="absolute inset-0 border border-emerald-950/5 rounded-full" />
                          <img src={author.avatar} alt={author.name} className="w-full h-full object-cover rounded-full" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d4af37] block mb-4">
                          Profil Artiste
                        </span>
                        <h3 className="text-3xl sm:text-4xl serif text-emerald-950 mb-6 leading-tight">{author.name}</h3>
                        <div className="w-12 h-0.5 bg-[#d4af37]/30 mb-6 mx-auto lg:mx-0" />
                        <p className="text-sm sm:text-base text-emerald-950/60 leading-relaxed serif italic">
                          {author.bio || "Artiste plasticien explorant l'harmonie des couleurs et des formes à travers des œuvres contemporaines d'une grande profondeur émotionnelle."}
                        </p>
                      </div>
                    </div>
                    <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-12 sm:gap-x-8 sm:gap-y-16">
                      {authorArtworks.map((art, artIdx) => (
                        <ArtworkCard
                          key={art.id}
                          art={art}
                          index={artIdx}
                          authors={authors}
                          onSelect={handleSelect}
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
          <GalleryModal
            artwork={selectedArtwork}
            authors={authors}
            direction={direction}
            onClose={() => setSelectedIndex(null)}
            onNext={nextArtwork}
            onPrev={prevArtwork}
            onPurchase={onPurchase}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
