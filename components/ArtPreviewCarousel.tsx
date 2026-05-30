import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
<<<<<<< HEAD
import { ARTWORKS as STATIC_ARTWORKS } from '../constants';
import { useI18n } from '../i18n/I18nContext';
import { supabase } from '../supabaseClient';
import { Artwork } from '../types';

const ArtPreviewCarousel: React.FC = () => {
  const { messages } = useI18n();
=======
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../supabaseClient';
import { Artwork } from '../types';
import { ARTWORKS as STATIC_ARTWORKS } from '../constants';
import { getTranslatedCategoryKey } from '../utils/localization';

const ArtPreviewCarousel: React.FC = () => {
  const { t } = useLanguage();
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
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

<<<<<<< HEAD
      if (artsData && artsData.length > 0) {
        setArtworks(artsData.map((artwork) => ({
=======
      if (data && data.length > 0) {
        setArtworks(data.map((artwork) => ({
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
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
<<<<<<< HEAD
    if (artworks.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % artworks.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [artworks.length]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % artworks.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + artworks.length) % artworks.length);
=======
    const timer = setInterval(() => {
      setCurrentIndex((previousIndex) => (previousIndex + 1) % artworks.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [artworks.length]);

  const currentArtwork = artworks[currentIndex];
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f

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
<<<<<<< HEAD
            {messages.preview.badge}
=======
            {t('carousel.label')}
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl text-white md:text-7xl serif"
          >
<<<<<<< HEAD
            {messages.preview.title}
=======
            {t('carousel.title')}
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
          </motion.h2>
        </div>

        <div className="flex gap-4">
          <button
<<<<<<< HEAD
            onClick={prevSlide}
            className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-[#d4af37] hover:border-[#d4af37] hover:text-emerald-950 transition-all"
            aria-label={messages.preview.previous}
=======
            onClick={() => setCurrentIndex((previousIndex) => (previousIndex - 1 + artworks.length) % artworks.length)}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 text-white transition-all hover:border-[#d4af37] hover:bg-[#d4af37] hover:text-emerald-950"
            aria-label={t('carousel.previous')}
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
          >
            <ChevronLeft size={24} />
          </button>
          <button
<<<<<<< HEAD
            onClick={nextSlide}
            className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-[#d4af37] hover:border-[#d4af37] hover:text-emerald-950 transition-all"
            aria-label={messages.preview.next}
=======
            onClick={() => setCurrentIndex((previousIndex) => (previousIndex + 1) % artworks.length)}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 text-white transition-all hover:border-[#d4af37] hover:bg-[#d4af37] hover:text-emerald-950"
            aria-label={t('carousel.next')}
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
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
<<<<<<< HEAD
                  <div className="lg:col-span-7 relative group">
                    <div className="absolute -inset-4 border border-[#d4af37]/20 rounded-sm -z-10" />
                    <div className="aspect-[4/5] md:aspect-[16/10] overflow-hidden bg-black/20 shadow-2xl">
=======
                  <div className="relative group lg:col-span-7">
                    <div className="absolute -inset-4 -z-10 rounded-sm border border-[#d4af37]/20" />
                    <div className="aspect-[4/5] overflow-hidden bg-black/20 shadow-2xl md:aspect-[16/10]">
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
                      <img
                        src={currentArtwork.image}
                        alt={currentArtwork.title}
                        className="h-full w-full object-cover transition-transform duration-[3s] group-hover:scale-105"
                      />
                    </div>
                  </div>

<<<<<<< HEAD
                  <div className="lg:col-span-5 text-white space-y-8">
                    <div>
                      <span className="text-white/40 uppercase tracking-[0.3em] text-[10px] font-bold block mb-4">
                        {artworks[currentIndex].category} - {artworks[currentIndex].year}
                      </span>
                      <h3 className="text-4xl md:text-6xl serif mb-6 leading-tight">{artworks[currentIndex].title}</h3>
                      <p className="text-white/60 text-lg italic serif leading-relaxed max-w-md">"{artworks[currentIndex].description}"</p>
=======
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
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
                    </div>

                    <div className="flex items-center gap-12 border-t border-white/10 pt-8">
                      <div>
<<<<<<< HEAD
                        <span className="text-white/30 uppercase tracking-widest text-[9px] block mb-1 font-bold">{messages.preview.technique}</span>
                        <span className="text-sm tracking-wide">{artworks[currentIndex].technique}</span>
                      </div>
                      <div>
                        <span className="text-white/30 uppercase tracking-widest text-[9px] block mb-1 font-bold">{messages.preview.dimensions}</span>
                        <span className="text-sm tracking-wide">{artworks[currentIndex].dimensions}</span>
=======
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
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

<<<<<<< HEAD
      <div className="max-w-7xl mx-auto px-6 mt-16 flex justify-center lg:justify-start gap-3">
=======
      <div className="mx-auto mt-16 flex max-w-7xl justify-center gap-3 px-6 lg:justify-start">
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
        {artworks.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
<<<<<<< HEAD
            className={`h-1 transition-all duration-500 rounded-full ${currentIndex === index ? 'w-12 bg-[#d4af37]' : 'w-4 bg-white/20 hover:bg-white/40'}`}
            aria-label={`${messages.preview.slideLabel} ${index + 1}`}
=======
            className={`h-1 rounded-full transition-all duration-500 ${currentIndex === index ? 'w-12 bg-[#d4af37]' : 'w-4 bg-white/20 hover:bg-white/40'}`}
            aria-label={t('carousel.slide', { index: index + 1 })}
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
          />
        ))}
      </div>
    </section>
  );
};

export default ArtPreviewCarousel;
