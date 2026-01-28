
import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Instagram, Facebook, Twitter, MessageCircle, ArrowUpRight, Play, Sparkles } from 'lucide-react';
import { View } from '../App';
import { ArtReveal } from './ArtReveal';
import { supabase } from '../supabaseClient';

interface HeroProps {
  setView: (view: View) => void;
}

const StatItem = ({ value, label, index }: { value: string; label: string; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 + index * 0.15, duration: 0.6 }}
    className="flex items-center gap-4 px-6 py-3 border-r last:border-0 border-white/10 hover:border-emerald-500/30 transition-colors"
  >
    <motion.span
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6 + index * 0.15, duration: 0.5 }}
      className="text-3xl md:text-4xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
    >
      {value}
    </motion.span>
    <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold leading-tight">
      {label.split(' ').map((word, i) => <React.Fragment key={i}>{word}<br /></React.Fragment>)}
    </span>
  </motion.div>
);

const Hero: React.FC<HeroProps> = ({ setView }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [heroMeta, setHeroMeta] = useState({ title: 'Sérénité Tropicale', description: 'Huile sur Toile — 2023', label: 'Oeuvre du moment' });
  const paintingImageUrl = "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=1200";

  // Load hero metadata
  useEffect(() => {
    const loadHeroMeta = async () => {
      const { data } = await supabase.from('site_content').select('content').eq('key', 'hero_image').single();
      if (data?.content) {
        setHeroMeta({
          title: data.content.title || 'Sérénité Tropicale',
          description: data.content.description || 'Huile sur Toile — 2023',
          label: data.content.label || 'Oeuvre du moment'
        });
      }
    };
    loadHeroMeta();
  }, []);

  // Motion values for parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 30 });

  const bgTranslateX = useTransform(springX, [-0.5, 0.5], [-30, 30]);
  const bgTranslateY = useTransform(springY, [-0.5, 0.5], [-30, 30]);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX.set((e.clientX / innerWidth) - 0.5);
      mouseY.set((e.clientY / innerHeight) - 0.5);
    };
    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col justify-center overflow-hidden bg-[#041a14] pt-16 sm:pt-20 px-4 sm:px-6 lg:px-20"
    >
      {/* Background Ambience - Simplified for mobile */}
      <motion.div
        style={{ x: bgTranslateX, y: bgTranslateY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-[10%] right-[-5%] w-[400px] sm:w-[600px] lg:w-[800px] h-[400px] sm:h-[600px] lg:h-[800px] bg-emerald-500/10 blur-[100px] sm:blur-[150px] lg:blur-[180px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] sm:w-[400px] lg:w-[600px] h-[300px] sm:h-[400px] lg:h-[600px] bg-emerald-400/5 blur-[80px] sm:blur-[120px] lg:blur-[150px] rounded-full" />
      </motion.div>

      <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-24 items-center max-w-full">

        <div className="space-y-6 sm:space-y-8 lg:space-y-10 w-full">
          {/* Animated Title with Word Reveal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-2 sm:space-y-4 mb-6 sm:mb-8">
              {/* Line 1 */}
              <motion.div
                initial={{ opacity: 0, x: -80, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight">
                  Découvrir,
                </h1>
              </motion.div>

              {/* Line 2 */}
              <motion.div
                initial={{ opacity: 0, x: -80, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight">
                  Collectionneur
                </h1>
              </motion.div>

              {/* Line 3 - Highlighted */}
              <motion.div
                initial={{ opacity: 0, x: -80, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative inline-block"
              >
                <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-600 leading-[1.1] tracking-tight relative">
                  L'Art Rare
                </h1>

                {/* Animated Arrow - Hidden on small screens */}
                <motion.div
                  animate={{
                    x: [0, 8, 0],
                    y: [0, -8, 0],
                    rotate: [0, 15, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 1 }}
                  className="absolute -right-16 sm:-right-20 top-0 hidden sm:block"
                >
                  <Sparkles className="text-emerald-400 w-8 sm:w-10 h-8 sm:h-10" strokeWidth={2} />
                </motion.div>
              </motion.div>
            </div>

            {/* Description - Fade in */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-base sm:text-lg md:text-xl text-white/60 max-w-lg leading-relaxed mb-8 sm:mb-12 font-medium"
            >
              L'excellence de la peinture haïtienne sublimée par la vision contemporaine de Marie Maude Eliacin.
            </motion.p>

            {/* Buttons with Stagger */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col xs:flex-row flex-wrap gap-3 xs:gap-4 items-start xs:items-center w-full"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(16,185,129,0.6)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setView('gallery')}
                className="group relative px-6 xs:px-8 sm:px-12 py-4 xs:py-5 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white rounded-xl font-black tracking-widest text-xs uppercase transition-all overflow-hidden w-full xs:w-auto text-center"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-emerald-400 opacity-0 group-hover:opacity-20 transition-opacity" />
                <span className="relative flex items-center justify-center gap-2">
                  Explorer la Galerie
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    →
                  </motion.span>
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, borderColor: '#34d399' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setView('inspiration')}
                className="group px-6 xs:px-10 py-4 xs:py-5 bg-white/5 backdrop-blur-sm border border-white/10 text-white/80 rounded-xl font-black tracking-widest text-xs uppercase hover:bg-white/10 transition-all flex items-center justify-center gap-3 w-full xs:w-auto"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-7 xs:w-8 h-7 xs:h-8 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 flex items-center justify-center group-hover:from-emerald-500/40 group-hover:to-cyan-500/40 transition-colors flex-shrink-0"
                >
                  <Play size={14} fill="white" className="ml-1" />
                </motion.div>
                <span>Voir Vidéo</span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Social Icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex space-x-4 pt-6 sm:pt-8"
          >
            {[
              { Icon: Instagram, label: 'Instagram' },
              { Icon: Facebook, label: 'Facebook' },
              { Icon: Twitter, label: 'Twitter' },
              { Icon: MessageCircle, label: 'Message' }
            ].map((social, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.1, duration: 0.4 }}
                className="group w-10 xs:w-11 h-10 xs:h-11 flex items-center justify-center rounded-lg bg-gradient-to-br from-white/5 to-white/0 text-white/50 hover:text-emerald-400 border border-white/10 hover:border-emerald-500/50 transition-all backdrop-blur-sm flex-shrink-0"
              >
                <social.Icon size={18} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Enhanced Image Container with Modern Reveal */}
        <div className="relative w-full aspect-[4/5] max-w-[350px] xs:max-w-[450px] sm:max-w-[550px] mx-auto lg:mx-0 mt-8 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
            className="w-full h-full relative art-reveal-container"
          >
            {/* Ambient Glow Background - Enhanced */}
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute inset-0 bg-gradient-to-br from-emerald-600/25 via-cyan-500/10 to-emerald-700/20 blur-[80px] sm:blur-[120px] rounded-full scale-150 -z-10"
            />

            {/* Main Art Reveal */}
            <ArtReveal fallbackImage={paintingImageUrl} />

            {/* Fade to Background Overlay - Video-like Effect */}
            <div className="absolute inset-0 pointer-events-none z-20">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#041a14]/40" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#041a14]/20 via-transparent to-[#041a14]/20" />
            </div>

            {/* Caption Overlay - Repositioned for mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.8 }}
              className="absolute -bottom-20 sm:-bottom-8 -right-4 sm:-right-8 bg-white/5 backdrop-blur-md border border-white/10 p-4 sm:p-6 rounded-2xl hidden sm:block max-w-[280px]"
            >
              <span className="text-[10px] uppercase tracking-widest text-[#34d399] font-black mb-1 block">Oeuvre du moment</span>
              <h4 className="text-lg sm:text-xl serif text-white">Sérénité Tropicale</h4>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Huile sur Toile — 2023</p>
            </motion.div>
          </motion.div>
        </div>

      </div>

      {/* Enhanced Stats Bar - Hidden on small screens, visible on lg+ */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/3 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl hidden lg:flex stats-container hover:bg-white/5 transition-all duration-500"
      >
        <StatItem value="25+" label="Années d'expérience" index={0} />
        <StatItem value="150" label="Oeuvres créées" index={1} />
        <StatItem value="12" label="Expositions internationales" index={2} />
      </motion.div>

      {/* Fade to Background Gradient - Cinematic Fade */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
      >
        <div className="h-40 sm:h-80 bg-gradient-to-b from-transparent via-[#041a14]/20 to-[#041a14] backdrop-blur-md" />
        <div className="h-20 sm:h-40 bg-[#041a14]" />
      </motion.div>
    </section>
  );
};

export default Hero;
