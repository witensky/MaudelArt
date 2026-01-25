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

  const ArtworkCard = ({ art, index }: { art: Artwork, index: number }) => {
    const author = authors.find(a => a.id === art.authorId);
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -10 }}
        className="group cursor-pointer"
        onClick={() => {
          setDirection(0);
          setSelectedIndex(index);
        }}
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
    <section id="galerie" className="pt-40 pb-32 bg-[#fcfcf9] px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-24">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#d4af37] uppercase tracking-[0.4em] text-xs font-bold mb-4 block text-center"
          >
            Catalogue d'Exception
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl serif text-emerald-950 mb-12 text-center"
          >
            La Galerie
          </motion.h2>

          <div className="w-full max-w-2xl relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-emerald-950/20 group-focus-within:text-[#d4af37] transition-colors">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Rechercher une œuvre, un auteur, une technique..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-emerald-950/10 py-5 pl-16 pr-6 rounded-2xl shadow-sm focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/10 transition-all text-sm placeholder:text-emerald-950/20 text-emerald-950"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-16 border-b border-emerald-950/5 pb-10">
          <div className="flex gap-2 p-1 bg-emerald-950/5 rounded-xl">
            {[
              { id: 'all', label: 'Toutes les Œuvres', icon: Grid },
              { id: 'collections', label: 'Collections', icon: Layers },
              { id: 'authors', label: 'Artistes', icon: Users },
            ].map((view) => (
              <button
                key={view.id}
                onClick={() => setViewMode(view.id as GalleryView)}
                className={`flex items-center gap-3 px-6 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === view.id ? 'bg-white text-emerald-950 shadow-sm' : 'text-emerald-950/40 hover:text-emerald-950'}`}
              >
                <view.icon size={14} />
                {view.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`relative text-[9px] uppercase tracking-[0.2em] transition-all font-black ${filter === cat ? 'text-[#d4af37]' : 'text-emerald-950/30 hover:text-emerald-950'
                  }`}
              >
                {cat}
                {filter === cat && <motion.div layoutId="catUnder" className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#d4af37]" />}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === 'all' && (
            <motion.div
              key="all-grid"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16"
            >
              {filteredArtworks.map((art, idx) => <ArtworkCard key={art.id} art={art} index={idx} />)}
            </motion.div>
          )}

          {viewMode === 'collections' && (
            <motion.div
              key="collections-grid"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="space-y-32"
            >
              {collections.map((col) => {
                const colArtworks = filteredArtworks.filter(a => a.collectionId === col.id);
                if (colArtworks.length === 0) return null;
                return (
                  <div key={col.id} className="space-y-12">
                    <div className="border-l-4 border-[#d4af37] pl-8">
                      <h3 className="text-4xl serif text-emerald-950 mb-4">{col.name}</h3>
                      <p className="text-emerald-950/50 text-sm leading-relaxed max-w-2xl">{col.description}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                      {colArtworks.map((art) => (
                        <ArtworkCard
                          key={art.id}
                          art={art}
                          index={filteredArtworks.findIndex(fa => fa.id === art.id)}
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
              className="space-y-40"
            >
              {authors.map((author) => {
                const authorArtworks = filteredArtworks.filter(a => a.authorId === author.id);
                if (authorArtworks.length === 0) return null;
                return (
                  <div key={author.id} className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                    <div className="lg:col-span-3">
                      <div className="sticky top-40 bg-white p-8 border border-emerald-950/10 shadow-sm rounded-lg">
                        <div className="w-24 h-24 overflow-hidden border border-emerald-950/10 mb-6 mx-auto lg:mx-0">
                          <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="text-2xl serif text-emerald-950 mb-4 text-center lg:text-left">{author.name}</h3>
                        <p className="text-xs text-emerald-950/60 leading-relaxed italic text-center lg:text-left">{author.bio}</p>
                      </div>
                    </div>
                    <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {authorArtworks.map((art) => (
                        <ArtworkCard
                          key={art.id}
                          art={art}
                          index={filteredArtworks.findIndex(fa => fa.id === art.id)}
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
              className="absolute top-8 right-8 w-14 h-14 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all z-[5200] group"
            >
              <X size={28} className="group-hover:rotate-90 transition-transform duration-500" />
            </motion.button>

            {/* Navigation 2D Intégrée */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 md:px-8 lg:px-12 z-[5100] pointer-events-none">
              <motion.button
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); prevArtwork(); }}
                className="w-20 h-20 lg:w-24 lg:h-24 flex items-center justify-center bg-white/5 hover:bg-[#d4af37] text-white hover:text-emerald-950 rounded-full border border-white/10 hover:border-[#d4af37] transition-all pointer-events-auto shadow-2xl group"
              >
                <ChevronLeft size={40} strokeWidth={1.5} className="group-hover:-translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); nextArtwork(); }}
                className="w-20 h-20 lg:w-24 lg:h-24 flex items-center justify-center bg-white/5 hover:bg-[#d4af37] text-white hover:text-emerald-950 rounded-full border border-white/10 hover:border-[#d4af37] transition-all pointer-events-auto shadow-2xl group"
              >
                <ChevronRight size={40} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform" />
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
              className="relative max-w-[1280px] w-full h-full md:h-auto md:max-h-[85vh] bg-[#064e3b] shadow-[0_60px_150px_-20px_rgba(0,0,0,0.8)] flex flex-col lg:flex-row z-[5050] overflow-hidden rounded-sm border border-white/5"
            >
              <div className="w-full lg:w-[60%] bg-[#042f24] flex items-center justify-center p-6 md:p-12 border-b lg:border-b-0 lg:border-r border-white/5 overflow-hidden">
                <motion.img
                  layoutId={`artwork-${selectedArtwork.id}`}
                  src={selectedArtwork.image}
                  alt={selectedArtwork.title}
                  className="max-w-full max-h-full object-contain shadow-2xl border-4 border-white/5"
                />
              </div>

              <div className="w-full lg:w-[40%] bg-[#064e3b] p-8 md:p-16 flex flex-col justify-between overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="space-y-12"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-[#d4af37] text-[11px] font-black uppercase tracking-[0.4em]">
                        {selectedArtwork.category} — {selectedArtwork.year}
                      </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl serif text-white mb-8 leading-tight">
                      {selectedArtwork.title}
                    </h2>
                    <div className="w-12 h-0.5 bg-[#d4af37]/30 mb-8" />
                    <p className="text-base text-white/70 serif italic leading-relaxed">
                      "{selectedArtwork.description}"
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-8 py-8 border-t border-white/10">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Technique</span>
                      <span className="text-sm font-medium text-white">{selectedArtwork.technique}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Dimensions</span>
                      <span className="text-sm font-medium text-white">{selectedArtwork.dimensions}</span>
                    </div>
                    <div className="flex justify-between items-center">
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
                  className="mt-12 space-y-4"
                >
                  <button
                    onClick={() => onPurchase?.(selectedArtwork)}
                    className="w-full bg-[#d4af37] text-emerald-950 px-8 py-5 font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl shadow-black/20 group"
                  >
                    Acquérir cette œuvre <ShoppingBag size={18} className="group-hover:scale-110 transition-transform" />
                  </button>
                  <button className="w-full border border-white/10 text-white/60 px-8 py-4 font-black uppercase tracking-[0.3em] text-[9px] flex items-center justify-center gap-3 hover:text-white hover:bg-white/5 transition-all">
                    S'informer <Info size={14} />
                  </button>
                  <div className="flex justify-between items-center pt-6 text-white/20 text-[10px] font-black uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                      <span className="text-[#d4af37] font-black">{selectedIndex + 1}</span>
                      <span className="w-4 h-px bg-white/10" />
                      <span>{filteredArtworks.length}</span>
                    </div>
                    <button className="hover:text-[#d4af37] transition-colors flex items-center gap-2">
                      <Share2 size={14} /> Partager
                    </button>
                  </div>
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
