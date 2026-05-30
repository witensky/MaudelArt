import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ARTWORKS as STATIC_ARTWORKS } from '../constants';
import { useI18n } from '../i18n/I18nContext';
import { supabase } from '../supabaseClient';
import { Artwork } from '../types';

const ArtPreviewCarousel: React.FC = () => {
  const { messages } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [artworks, setArtworks] = useState<Artwork[]>(STATIC_ARTWORKS);

  useEffect(() => {
    const fetchLatestArtworks = async () => {
      const { data: artsData } = await supabase
        .from('artworks')
        .select('*, categories(name)')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(5);

      if (artsData && artsData.length > 0) {
        setArtworks(artsData.map((artwork) => ({
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

  return (
    <section className="py-32 bg-emerald-950 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#d4af37] uppercase tracking-[0.4em] text-xs font-bold mb-4 block"
          >
            {messages.preview.badge}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl serif text-white"
          >
            {messages.preview.title}
          </motion.h2>
        </div>

        <div className="flex gap-4">
          <button
            onClick={prevSlide}
            className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-[#d4af37] hover:border-[#d4af37] hover:text-emerald-950 transition-all"
            aria-label={messages.preview.previous}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-[#d4af37] hover:border-[#d4af37] hover:text-emerald-950 transition-all"
            aria-label={messages.preview.next}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="relative px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8 md:gap-12">
            <AnimatePresence mode="wait">
              {artworks.length > 0 && (
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full"
                >
                  <div className="lg:col-span-7 relative group">
                    <div className="absolute -inset-4 border border-[#d4af37]/20 rounded-sm -z-10" />
                    <div className="aspect-[4/5] md:aspect-[16/10] overflow-hidden bg-black/20 shadow-2xl">
                      <img
                        src={artworks[currentIndex].image}
                        alt={artworks[currentIndex].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3s]"
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-5 text-white space-y-8">
                    <div>
                      <span className="text-white/40 uppercase tracking-[0.3em] text-[10px] font-bold block mb-4">
                        {artworks[currentIndex].category} - {artworks[currentIndex].year}
                      </span>
                      <h3 className="text-4xl md:text-6xl serif mb-6 leading-tight">{artworks[currentIndex].title}</h3>
                      <p className="text-white/60 text-lg italic serif leading-relaxed max-w-md">"{artworks[currentIndex].description}"</p>
                    </div>

                    <div className="pt-8 border-t border-white/10 flex items-center gap-12">
                      <div>
                        <span className="text-white/30 uppercase tracking-widest text-[9px] block mb-1 font-bold">{messages.preview.technique}</span>
                        <span className="text-sm tracking-wide">{artworks[currentIndex].technique}</span>
                      </div>
                      <div>
                        <span className="text-white/30 uppercase tracking-widest text-[9px] block mb-1 font-bold">{messages.preview.dimensions}</span>
                        <span className="text-sm tracking-wide">{artworks[currentIndex].dimensions}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 flex justify-center lg:justify-start gap-3">
        {artworks.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1 transition-all duration-500 rounded-full ${currentIndex === index ? 'w-12 bg-[#d4af37]' : 'w-4 bg-white/20 hover:bg-white/40'}`}
            aria-label={`${messages.preview.slideLabel} ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default ArtPreviewCarousel;
