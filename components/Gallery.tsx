import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Grid, Info, Loader2, Maximize2, Search, ShoppingBag, Users, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { AUTHORS as STATIC_AUTHORS } from '../constants';
import { supabase } from '../supabaseClient';
import { Artwork } from '../types';
import { getTranslatedCategoryKey } from '../utils/localization';
import { getErrorMessage, isAbortLikeError } from '../utils/errors';

interface GalleryModalProps {
  artwork: Artwork;
  authors: any[];
  direction: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onPurchase?: (artwork: Artwork) => void;
}

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

type GalleryView = 'all' | 'authors';

const slideVariantsModal = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : direction < 0 ? -100 : 0,
    opacity: 0,
    scale: 0.95,
  }),
  center: { zIndex: 1, x: 0, opacity: 1, scale: 1 },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 100 : direction > 0 ? -100 : 0,
    opacity: 0,
    scale: 0.95,
  }),
};

const GalleryModal: React.FC<GalleryModalProps> = ({
  artwork,
  authors,
  direction,
  onClose,
  onNext,
  onPrev,
  onPurchase,
}) => {
  const { t } = useLanguage();
  const author = authors.find((entry) => entry.id === artwork.authorId);

  return ReactDOM.createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(2,13,10,0.96)', backdropFilter: 'blur(12px)', cursor: 'zoom-out' }}
      />

      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        onClick={onClose}
        aria-label={t('gallery.close')}
        style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10001 }}
        className="group flex h-12 w-12 items-center justify-center rounded-full text-white/50 transition-all hover:bg-white/10 hover:text-white"
      >
        <X size={22} className="transition-transform duration-500 group-hover:rotate-90" />
      </motion.button>

      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem', zIndex: 10001, pointerEvents: 'none' }}>
        <motion.button
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(event) => { event.stopPropagation(); onPrev(); }}
          style={{ pointerEvents: 'auto' }}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white shadow-2xl backdrop-blur-sm transition-all hover:border-[#d4af37] hover:bg-[#d4af37] hover:text-emerald-950 md:h-16 md:w-16"
        >
          <ChevronLeft size={22} />
        </motion.button>
        <motion.button
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 30 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(event) => { event.stopPropagation(); onNext(); }}
          style={{ pointerEvents: 'auto' }}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white shadow-2xl backdrop-blur-sm transition-all hover:border-[#d4af37] hover:bg-[#d4af37] hover:text-emerald-950 md:h-16 md:w-16"
        >
          <ChevronRight size={22} />
        </motion.button>
      </div>

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
          scale: { duration: 0.45 },
        }}
        style={{ position: 'relative', zIndex: 10000, width: '100%', maxWidth: '1280px' }}
        className="mx-0 flex h-[100dvh] w-full flex-col overflow-hidden rounded-none border border-white/5 bg-[#064e3b] shadow-[0_60px_150px_-20px_rgba(0,0,0,0.85)] md:mx-4 md:h-auto md:max-h-[88vh] md:rounded-xl lg:mx-8 lg:flex-row"
      >
        <div className="flex h-[42vh] w-full flex-shrink-0 items-center justify-center border-b border-white/5 bg-[#032318] p-4 lg:h-auto lg:w-[58%] lg:border-b-0 lg:border-r md:p-10">
          <img
            src={artwork.image}
            alt={artwork.title}
            className="h-full w-full object-contain shadow-2xl lg:max-h-none max-h-[38vh]"
          />
        </div>

        <div className="flex w-full flex-col overflow-y-auto bg-[#064e3b] lg:w-[42%]">
          <div className="flex-1 space-y-6 p-6 md:space-y-10 md:p-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }}>
              <span className="mb-3 block text-[10px] font-black uppercase tracking-[0.4em] text-[#d4af37]">
                {t(`categories.${getTranslatedCategoryKey(artwork.category)}`)} - {artwork.year}
              </span>
              <h2 className="mb-4 text-3xl leading-tight text-white md:text-4xl serif">{artwork.title}</h2>
              <div className="mb-4 h-0.5 w-10 bg-[#d4af37]/40" />
              <p className="text-sm italic leading-relaxed text-white/65 serif">"{artwork.description}"</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="space-y-3 border-t border-white/10 pt-6"
            >
              {[
                { label: t('common.technique'), value: artwork.technique },
                { label: t('common.dimensions'), value: artwork.dimensions },
                { label: t('common.artist'), value: author?.name },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between border-b border-white/5 py-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{label}</span>
                  <span className="text-sm font-medium text-white/90">{value || t('gallery.noValue')}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="space-y-3 px-6 pb-8 pt-0 md:px-10 md:pb-10"
          >
            <button
              onClick={() => onPurchase?.(artwork)}
              className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#d4af37] px-6 py-4 text-[10px] font-black uppercase tracking-[0.25em] text-emerald-950 shadow-xl transition-all hover:bg-white"
            >
              {t('gallery.acquire')}
              <ShoppingBag size={16} className="transition-transform group-hover:scale-110" />
            </button>
            <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-6 py-3.5 text-[9px] font-black uppercase tracking-[0.25em] text-white/60 transition-all hover:bg-white/5 hover:text-white">
              {t('gallery.inquire')}
              <Info size={14} />
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
};

const ArtworkCard = React.memo<ArtworkCardProps>(({ art, index, authors, onSelect }) => {
  const { t } = useLanguage();
  const author = authors.find((entry) => entry.id === art.authorId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="group relative cursor-pointer"
      onClick={() => onSelect(index)}
    >
      <div className="relative aspect-[3/4] rounded-sm border border-emerald-950/5 bg-white p-3 shadow-[0_4px_25px_rgba(0,0,0,0.02)] transition-all duration-700 group-hover:border-emerald-950/10 group-hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] sm:p-4">
        <div className="relative h-full w-full overflow-hidden rounded-sm bg-[#f5f5f0]">
          <motion.img
            src={art.image}
            alt={art.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-[2.5s] ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-emerald-950/20 opacity-0 backdrop-blur-[2px] transition-opacity duration-700 group-hover:opacity-100">
            <div className="scale-0 rounded-full bg-white/90 p-3 shadow-2xl transition-transform duration-500 delay-100 group-hover:scale-100 backdrop-blur-md">
              <Maximize2 size={20} className="text-[#d4af37]" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-2 px-1">
        <div className="flex items-start justify-between gap-4">
          <h3 className="flex-1 text-lg leading-tight text-emerald-950 transition-colors duration-300 group-hover:text-[#d4af37] sm:text-xl serif">
            {art.title}
          </h3>
          <span className="rounded border border-[#d4af37]/20 px-1.5 py-0.5 text-[9px] font-black tracking-widest text-[#d4af37]">
            {art.year}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-[1px] w-4 bg-[#d4af37]/30" />
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-950/40">
            {author?.name || t('gallery.independentArtist')}
          </p>
        </div>
      </div>
    </motion.div>
  );
});

const Gallery: React.FC<GalleryProps> = ({ onPurchase, selectedArtistFilter }) => {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<GalleryView>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<string>('All');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [authors, setAuthors] = useState<any[]>(STATIC_AUTHORS);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);
  const [reloadTick, setReloadTick] = useState(0);

  const retryLoad = useCallback(() => {
    setReloadTick((tick) => tick + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchContent = async () => {
      try {
        setLoading(true);
        setHasLoadError(false);

        const artworksQuery = supabase
          .from('artworks')
          .select(`
            id, title, technique, dimensions, year, image_url, description,
            author_id, collection_id, category_id, is_active, created_at,
            categories (name)
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        const categoriesQuery = supabase.from('categories').select('*');

        const authorsQuery = supabase.from('authors').select('*');

        const [
          { data: artworksData, error: artworksError },
          { data: categoriesData, error: categoriesError },
          { data: authorsData, error: authorsError },
        ] = await Promise.all([artworksQuery, categoriesQuery, authorsQuery]);

        if (artworksError || categoriesError || authorsError) {
          throw artworksError ?? categoriesError ?? authorsError;
        }

        if (!isMounted) {
          return;
        }

        if (categoriesData) {
          setCategories(['All', ...categoriesData.map((category) => category.name)]);
        }

        if (authorsData && authorsData.length > 0) {
          setAuthors(authorsData.map((author) => ({ ...author, avatar: author.avatar_url })));
        }

        if (artworksData) {
          setArtworks(artworksData.map((artwork: any) => ({
            id: artwork.id,
            title: artwork.title,
            category: artwork.categories?.name || 'Unknown',
            authorId: artwork.author_id,
            collectionId: artwork.collection_id,
            year: artwork.year,
            technique: artwork.technique ?? '',
            image: artwork.image_url,
            description: artwork.description ?? '',
            dimensions: artwork.dimensions ?? '',
          })));
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        // Abort/timeouts should never break UX and shouldn't spam logs.
        if (isAbortLikeError(error)) {
          return;
        }

        console.error('Error loading gallery:', getErrorMessage(error));
        setHasLoadError(true);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchContent();

    return () => {
      isMounted = false;
    };
  }, [reloadTick]);

  const filteredArtworks = useMemo(() => {
    return artworks.filter((artwork) => {
      const author = authors.find((entry) => entry.id === artwork.authorId);
      const searchValue = searchQuery.toLowerCase();
      const matchesSearch =
        artwork.title.toLowerCase().includes(searchValue) ||
        artwork.technique.toLowerCase().includes(searchValue) ||
        author?.name?.toLowerCase().includes(searchValue);

      const matchesCategory = filter === 'All' || artwork.category === filter;
      const matchesArtist = !selectedArtistFilter || artwork.authorId === selectedArtistFilter;

      return matchesSearch && matchesCategory && matchesArtist;
    });
  }, [artworks, authors, filter, searchQuery, selectedArtistFilter]);

  const selectedArtwork = selectedIndex !== null ? filteredArtworks[selectedIndex] : null;

  const openArtwork = useCallback((artworkId: string) => {
    const artworkIndex = filteredArtworks.findIndex((artwork) => artwork.id === artworkId);

    if (artworkIndex >= 0) {
      setDirection(0);
      setSelectedIndex(artworkIndex);
    }
  }, [filteredArtworks]);

  const nextArtwork = useCallback(() => {
    if (selectedIndex !== null) {
      setDirection(1);
      setSelectedIndex((selectedIndex + 1) % filteredArtworks.length);
    }
  }, [filteredArtworks.length, selectedIndex]);

  const prevArtwork = useCallback(() => {
    if (selectedIndex !== null) {
      setDirection(-1);
      setSelectedIndex((selectedIndex - 1 + filteredArtworks.length) % filteredArtworks.length);
    }
  }, [filteredArtworks.length, selectedIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedIndex === null) {
        return;
      }

      if (event.key === 'ArrowRight') {
        nextArtwork();
      }

      if (event.key === 'ArrowLeft') {
        prevArtwork();
      }

      if (event.key === 'Escape') {
        setSelectedIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextArtwork, prevArtwork, selectedIndex]);

  useEffect(() => {
    document.body.style.overflow = selectedIndex !== null ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedIndex]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center space-y-8 bg-[#fcfcf9]">
        <div className="relative">
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex h-24 w-24 items-center justify-center rounded-full border border-[#d4af37]/20"
          >
            <div className="h-16 w-16 rounded-full border border-[#d4af37]/40" />
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="animate-spin text-[#d4af37]" size={24} strokeWidth={1.5} />
          </div>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#d4af37] animate-pulse">
            MaudelArt
          </span>
          <span className="text-xs italic text-emerald-950/30 serif">{t('gallery.loading')}</span>
        </div>
      </div>
    );
  }

  if (hasLoadError && artworks.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#fcfcf9] px-6 pb-20 pt-40">
        <div className="w-full max-w-md rounded-3xl border border-emerald-950/10 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
            <Loader2 className="text-emerald-600" size={20} />
          </div>
          <h2 className="mb-2 text-2xl text-emerald-950 serif">{t('common.loadErrorTitle')}</h2>
          <p className="mb-6 text-sm leading-relaxed text-emerald-950/50">{t('common.loadErrorDescription')}</p>
          <button
            onClick={retryLoad}
            className="rounded-full bg-emerald-950 px-6 py-3 text-[11px] font-black uppercase tracking-wider text-[#d4af37] shadow-md transition-colors hover:bg-emerald-800"
          >
            {t('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <section id="gallery" className="min-h-screen bg-[#fcfcf9] px-4 pb-20 pt-8 sm:px-6 sm:pb-32 sm:pt-16 lg:px-8 lg:pt-24">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 flex flex-col items-center sm:mb-12">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex max-w-2xl flex-col items-center space-y-2 text-center sm:space-y-4">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#d4af37] sm:text-[10px]">
              {t('gallery.titleLabel')}
            </span>
            <h1 className="text-3xl leading-tight tracking-tight text-emerald-950 sm:text-4xl lg:text-5xl serif">
              {t('gallery.title')}
            </h1>
            <p className="max-w-xl text-sm italic leading-relaxed text-emerald-950/50 sm:text-base serif">
              {t('gallery.description')}
            </p>
          </motion.div>
        </div>

        <div className="mb-10 border-y border-emerald-950/5 py-4 sm:mb-12 sm:py-5">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[auto_1fr_auto] lg:gap-8">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-start">
              <div className="inline-flex rounded-xl border border-black/5 bg-gray-100/60 p-1 shadow-sm">
                {[
                  { id: 'all', label: t('gallery.all'), icon: Grid },
                  { id: 'authors', label: t('gallery.authors'), icon: Users },
                ].map((view) => {
                  const isActive = viewMode === view.id;
                  const Icon = view.icon;

                  return (
                    <button
                      key={view.id}
                      onClick={() => setViewMode(view.id as GalleryView)}
                      className={`relative flex items-center gap-2 rounded-lg px-4 py-2 text-[9px] font-black uppercase tracking-wider transition-all duration-300 sm:text-[10px] ${isActive ? 'text-emerald-950' : 'text-emerald-950/40'}`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 rounded-lg bg-white shadow-sm"
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <Icon size={12} className={`relative z-10 ${isActive ? 'text-[#d4af37]' : 'opacity-40'}`} />
                      <span className="relative z-10">{view.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="hidden h-6 w-px bg-emerald-950/10 sm:block" />

              <div className="w-full min-w-0 overflow-x-auto no-scrollbar sm:w-auto sm:max-w-[520px] lg:max-w-[720px]">
                <div className="flex items-center justify-start gap-2 pr-6 sm:gap-3">
                  {categories.map((category) => {
                    const isActive = filter === category;

                    return (
                      <button
                        key={category}
                        onClick={() => setFilter(category)}
                        className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-colors ${
                          isActive
                            ? 'border border-[#d4af37]/25 bg-[#d4af37]/10 text-[#d4af37]'
                            : 'border border-transparent text-emerald-950/45 hover:border-emerald-950/10 hover:bg-emerald-950/5 hover:text-emerald-950'
                        }`}
                      >
                        {t(`categories.${getTranslatedCategoryKey(category)}`)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="relative w-full sm:max-w-md lg:w-72 lg:justify-self-end">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-950/30" />
              <input
                type="text"
                placeholder={t('gallery.searchPlaceholder')}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="h-11 w-full rounded-xl border border-emerald-950/10 bg-white pl-11 pr-10 text-xs font-medium shadow-sm transition-all focus:border-[#d4af37]/40 focus:outline-none focus:ring-4 focus:ring-[#d4af37]/10"
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
          {viewMode === 'all' ? (
            <motion.div
              key="all-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-16 lg:grid-cols-4 lg:gap-x-10 lg:gap-y-20"
            >
              {filteredArtworks.map((artwork, index) => (
                <ArtworkCard
                  key={artwork.id}
                  art={artwork}
                  index={index}
                  authors={authors}
                  onSelect={() => openArtwork(artwork.id)}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="authors-grid"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="space-y-32 sm:space-y-48"
            >
              {authors.map((author) => {
                const authorArtworks = filteredArtworks.filter((artwork) => artwork.authorId === author.id);

                if (authorArtworks.length === 0) {
                  return null;
                }

                return (
                  <div key={author.id} className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-24 sm:gap-16">
                    <div className="lg:col-span-4">
                      <div className="sticky top-24 rounded-2xl border border-emerald-950/5 bg-white p-8 text-center shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] lg:top-32 lg:text-left sm:p-12">
                        <div className="relative mx-auto mb-8 h-24 w-24 overflow-hidden rounded-full border-2 border-[#d4af37]/20 p-2 sm:h-32 sm:w-32 lg:mx-0">
                          <div className="absolute inset-0 rounded-full border border-emerald-950/5" />
                          <img src={author.avatar} alt={author.name} className="h-full w-full rounded-full object-cover" />
                        </div>
                        <span className="mb-4 block text-[10px] font-black uppercase tracking-[0.3em] text-[#d4af37]">
                          {t('gallery.artistProfile')}
                        </span>
                        <h3 className="mb-6 text-3xl leading-tight text-emerald-950 sm:text-4xl serif">{author.name}</h3>
                        <div className="mb-6 h-0.5 w-12 bg-[#d4af37]/30 mx-auto lg:mx-0" />
                        <p className="text-sm italic leading-relaxed text-emerald-950/60 sm:text-base serif">
                          {author.bio || t('gallery.authorFallbackBio')}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:col-span-8 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-16">
                      {authorArtworks.map((artwork, index) => (
                        <ArtworkCard
                          key={artwork.id}
                          art={artwork}
                          index={index}
                          authors={authors}
                          onSelect={() => openArtwork(artwork.id)}
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
