import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../supabaseClient';
import { Artwork } from '../types';
import { ARTWORKS as STATIC_ARTWORKS } from '../constants';
import { getTranslatedCategoryKey } from '../utils/localization';

const ArtPreviewCarousel: React.FC = () => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [artworks, setArtworks] = useState<Artwork[]>(STATIC_ARTWORKS);

  useEffect(() => {
    const fetchLatestArtworks = async () => {
      const { data } = await supabase
        .from('artworks')
        .select('*, categories(name)')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(5);

      if (data && data.length > 0) {
        setArtworks(data.map((artwork) => ({
          id: artwork.id,
          title: artwork.title,
          category: artwork.categories?.name,
          authorId: artwork.author_id,
          collectionId: artwork.collection_id,
          year: artwork.year,
          technique: artwork.technique,
          image: artwork.image_url,
          description: artwork.description,
          dimensions: artwork.dimensions,
        })));
      }
    };

    fetchLatestArtworks();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((previousIndex) => (previousIndex + 1) % artworks.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [artworks.length]);

  const currentArtwork = artworks[currentIndex];

  return (
    <section className="relative overflow-hidden bg-emerald-950 py-32">
      <div className="mx-auto mb-16 flex max-w-7xl flex-col justify-between gap-8 px-6 md:flex-row md:items-end">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 block text-xs font-bold uppercase tracking-[0.4em] text-[#d4af37]"
          >
            {t('carousel.label')}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl text-white md:text-7xl serif"
          >
            {t('carousel.title')}
          </motion.h2>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setCurrentIndex((previousIndex) => (previousIndex - 1 + artworks.length) % artworks.length)}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 text-white transition-all hover:border-[#d4af37] hover:bg-[#d4af37] hover:text-emerald-950"
            aria-label={t('carousel.previous')}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => setCurrentIndex((previousIndex) => (previousIndex + 1) % artworks.length)}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 text-white transition-all hover:border-[#d4af37] hover:bg-[#d4af37] hover:text-emerald-950"
            aria-label={t('carousel.next')}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="relative px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex gap-8 md:gap-12">
            <AnimatePresence mode="wait">
              {currentArtwork && (
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
                  className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-12"
                >
                  <div className="relative group lg:col-span-7">
                    <div className="absolute -inset-4 -z-10 rounded-sm border border-[#d4af37]/20" />
                    <div className="aspect-[4/5] overflow-hidden bg-black/20 shadow-2xl md:aspect-[16/10]">
                      <img
                        src={currentArtwork.image}
                        alt={currentArtwork.title}
                        className="h-full w-full object-cover transition-transform duration-[3s] group-hover:scale-105"
                      />
                    </div>
                  </div>

                  <div className="space-y-8 text-white lg:col-span-5">
                    <div>
                      <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
                        {t(`categories.${getTranslatedCategoryKey(currentArtwork.category)}`)} - {currentArtwork.year}
                      </span>
                      <h3 className="mb-6 text-4xl leading-tight md:text-6xl serif">
                        {currentArtwork.title}
                      </h3>
                      <p className="max-w-md text-lg italic leading-relaxed text-white/60 serif">
                        "{currentArtwork.description}"
                      </p>
                    </div>

                    <div className="flex items-center gap-12 border-t border-white/10 pt-8">
                      <div>
                        <span className="mb-1 block text-[9px] font-bold uppercase tracking-widest text-white/30">
                          {t('common.technique')}
                        </span>
                        <span className="text-sm tracking-wide">{currentArtwork.technique}</span>
                      </div>
                      <div>
                        <span className="mb-1 block text-[9px] font-bold uppercase tracking-widest text-white/30">
                          {t('common.dimensions')}
                        </span>
                        <span className="text-sm tracking-wide">{currentArtwork.dimensions}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-7xl justify-center gap-3 px-6 lg:justify-start">
        {artworks.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1 rounded-full transition-all duration-500 ${currentIndex === index ? 'w-12 bg-[#d4af37]' : 'w-4 bg-white/20 hover:bg-white/40'}`}
            aria-label={t('carousel.slide', { index: index + 1 })}
          />
        ))}
      </div>
    </section>
  );
};

export default ArtPreviewCarousel;
