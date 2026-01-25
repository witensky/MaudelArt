
import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Instagram, Facebook, Twitter, MessageCircle, ArrowUpRight, Play } from 'lucide-react';
import { View } from '../App';
import { ArtReveal } from './ArtReveal';
import { supabase } from '../supabaseClient';

interface HeroProps {
  setView: (view: View) => void;
}

const StatItem = ({ value, label }: { value: string; label: string }) => (
  <div className="flex items-center gap-4 px-8 py-2 border-r last:border-0 border-white/10">
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-3xl md:text-4xl font-black text-white"
    >
      {value}
    </motion.span>
    <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold leading-tight">
      {label.split(' ').map((word, i) => <React.Fragment key={i}>{word}<br /></React.Fragment>)}
    </span>
  </div>
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
      className="relative min-h-screen w-full flex flex-col justify-center overflow-hidden bg-[#041a14] pt-20 px-6 lg:px-20"
    >
      {/* Background Ambience */}
      <motion.div
        style={{ x: bgTranslateX, y: bgTranslateY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-[10%] right-[-5%] w-[800px] h-[800px] bg-emerald-500/10 blur-[180px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-400/5 blur-[150px] rounded-full" />
      </motion.div>

      <div className="relative z-10 max-w-[1440px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

        <div className="space-y-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black text-white leading-[1.05] tracking-tight mb-8 hero-title">
              Découvrir, <br /> Collectionneur <br className="md:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600 relative">
                L'Art Rare
                <motion.div
                  animate={{ x: [0, 5, 0], y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute -right-16 top-0"
                >
                  <ArrowUpRight className="text-emerald-400 w-12 h-12" strokeWidth={3} />
                </motion.div>
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/50 max-w-lg leading-relaxed mb-12 font-medium">
              L'excellence de la peinture haïtienne sublimée par la vision contemporaine de Marie Maude Eliacin.
            </p>

            <div className="flex flex-wrap gap-6 items-center">
              <button
                onClick={() => setView('gallery')}
                className="px-12 py-5 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white rounded-xl font-black tracking-widest text-xs uppercase hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-all transform hover:-translate-y-1 active:scale-95"
              >
                Explorer la Galerie
              </button>
              <button
                onClick={() => setView('inspiration')}
                className="px-10 py-5 bg-[#162e28] border border-white/5 text-white/80 rounded-xl font-black tracking-widest text-xs uppercase hover:bg-white/10 transition-all flex items-center gap-3 active:scale-95"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Play size={14} fill="white" className="ml-1" />
                </div>
                Voir Vidéo
              </button>
            </div>
          </motion.div>

          <div className="flex space-x-8 pt-6">
            {[Instagram, Facebook, Twitter, MessageCircle].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 text-white/40 hover:text-emerald-400 hover:bg-white/10 border border-white/5 transition-all">
                <Icon size={18} strokeWidth={2} />
              </a>
            ))}
          </div>
        </div>

        {/* Optimized Image Container - Fast Load */}
        <div className="relative aspect-[4/5] w-full max-w-[550px] mx-auto lg:mx-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full h-full relative"
          >
            <div className="absolute inset-0 bg-emerald-500/10 blur-[100px] rounded-full scale-125 -z-10" />
            <ArtReveal fallbackImage={paintingImageUrl} />

            {/* Caption Overlay */}
            <div className="absolute -bottom-8 -right-8 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hidden md:block">
              <span className="text-[10px] uppercase tracking-widest text-[#34d399] font-black mb-1 block">Oeuvre du moment</span>
              <h4 className="text-xl serif text-white">Sérénité Tropicale</h4>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Huile sur Toile — 2023</p>
            </div>
          </motion.div>
        </div>

      </div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl hidden lg:flex stats-container"
      >
        <StatItem value="25+" label="Années d'expérience" />
        <StatItem value="150" label="Oeuvres créées" />
        <StatItem value="12" label="Expositions internationales" />
      </motion.div>
    </section>
  );
};

export default Hero;
