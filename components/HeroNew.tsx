import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { View } from '../App';
import { supabase } from '../supabaseClient';

interface HeroNewProps {
  setView: (view: View) => void;
}

const HeroNew: React.FC<HeroNewProps> = ({ setView }) => {
  const [heroData, setHeroData] = useState({
    title: 'Découvrir.\nCollectionner.\nL\'Art Rare.',
    subtitle: 'La galerie digitale dédiée à l\'excellence\nde la peinture haïtienne contemporaine.',
    imageUrl: 'https://images.unsplash.com/photo-1566281797198-d34df0d11bf3?auto=format&fit=crop&q=80&w=600',
  });

  useEffect(() => {
    const loadHeroData = async () => {
      const { data } = await supabase
        .from('site_content')
        .select('content')
        .eq('key', 'hero_image')
        .single();
      
      if (data?.content) {
        setHeroData({
          title: data.content.title || heroData.title,
          subtitle: data.content.description || heroData.subtitle,
          imageUrl: data.content.image_url || data.content.image || heroData.imageUrl,
        });
      }
    };
    
    loadHeroData();
  }, []);

  return (
    <section className="pt-20 pb-10 sm:pt-28 md:pt-40 md:pb-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        
        {/* Grid Layout: Left Text | Right Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
          
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            {/* Main Title */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
              Découvrir.
              <br />
              Collectionner.
              <br />
              <span className="text-green-700">L'Art Rare.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-8 sm:mb-12 leading-relaxed max-w-xl font-light">
              La galerie digitale dédiée à l'excellence<br />
              de la peinture haïtienne contemporaine.
            </p>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setView('gallery')}
              className="w-fit px-5 sm:px-8 py-2.5 sm:py-4 text-sm sm:text-base bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition-colors shadow-sm"
            >
              Découvrir la galerie
            </motion.button>
          </motion.div>

          {/* Right Column - Artwork Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center mt-8 md:mt-0"
          >
            <div className="w-full max-w-sm md:max-w-md relative">
              {/* Image Container */}
              <div className="aspect-[3/4] overflow-hidden rounded-lg shadow-lg bg-gray-100">
                <img
                  src={heroData.imageUrl}
                  alt="Œuvre maîtresse"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroNew;
