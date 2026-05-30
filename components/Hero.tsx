import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, Facebook, Instagram, MessageCircle, Play, Sparkles, Twitter } from 'lucide-react';
import { NavigationOptions, View } from '../App';
import { useI18n } from '../i18n/I18nContext';
import { supabase } from '../supabaseClient';
import { ArtReveal } from './ArtReveal';

interface HeroProps {
  navigateTo: (view: View, options?: NavigationOptions) => void;
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
      {label.split(' ').map((word, i) => <React.Fragment key={`${word}-${i}`}>{word}<br /></React.Fragment>)}
    </span>
  </motion.div>
);

const Hero: React.FC<HeroProps> = ({ navigateTo }) => {
  const { messages } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const [heroMeta, setHeroMeta] = useState({
    title: messages.hero.featuredTitleFallback,
    description: messages.hero.featuredDescriptionFallback,
    label: messages.hero.featuredLabelFallback,
  });
  const paintingImageUrl = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=1200';

  useEffect(() => {
    const loadHeroMeta = async () => {
      const fallbackMeta = {
        title: messages.hero.featuredTitleFallback,
        description: messages.hero.featuredDescriptionFallback,
        label: messages.hero.featuredLabelFallback,
      };

      const { data } = await supabase.from('site_content').select('content').eq('key', 'hero_image').single();

      if (data?.content) {
        setHeroMeta({
          title: data.content.title || fallbackMeta.title,
          description: data.content.description || fallbackMeta.description,
          label: data.content.label || fallbackMeta.label,
        });
      } else {
        setHeroMeta(fallbackMeta);
      }
    };

    loadHeroMeta();
  }, [messages.hero]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 30 });
  const bgTranslateX = useTransform(springX, [-0.5, 0.5], [-30, 30]);
  const bgTranslateY = useTransform(springY, [-0.5, 0.5], [-30, 30]);

  useEffect(() => {
    const handleGlobalMouseMove = (event: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX.set(event.clientX / innerWidth - 0.5);
      mouseY.set(event.clientY / innerHeight - 0.5);
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col justify-center overflow-hidden bg-[#041a14] pt-16 sm:pt-20 px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-20"
    >
      <motion.div style={{ x: bgTranslateX, y: bgTranslateY }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] right-[-5%] w-[400px] sm:w-[600px] lg:w-[800px] h-[400px] sm:h-[600px] lg:h-[800px] bg-emerald-500/10 blur-[100px] sm:blur-[150px] lg:blur-[180px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] sm:w-[400px] lg:w-[600px] h-[300px] sm:h-[400px] lg:h-[600px] bg-emerald-400/5 blur-[80px] sm:blur-[120px] lg:blur-[150px] rounded-full" />
      </motion.div>

      <div className="relative z-10 w-full max-w-[1720px] mx-auto grid grid-cols-1 lg:grid-cols-[1.06fr_0.94fr] gap-10 sm:gap-14 lg:gap-20 xl:gap-28 2xl:gap-32 items-center min-h-[calc(100vh-7rem)]">
        <div className="space-y-8 sm:space-y-10 lg:space-y-12 w-full max-w-[860px] lg:justify-self-start">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="space-y-2 sm:space-y-4 lg:space-y-5 mb-8 sm:mb-10 lg:mb-12">
              {messages.hero.titleLines.map((line, index) => (
                <motion.div
                  key={line}
                  initial={{ opacity: 0, x: -80, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.8, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className={index === 2 ? 'relative inline-block' : undefined}
                >
                  <h1 className={`text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-[6.1rem] xl:text-[6.8rem] 2xl:text-[7.3rem] font-black leading-[0.94] tracking-[-0.045em] ${index === 2 ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-600 relative' : 'text-white'}`}>
                    {line}
                  </h1>

                  {index === 2 && (
                    <motion.div
                      animate={{ x: [0, 8, 0], y: [0, -8, 0], rotate: [0, 15, 0] }}
                      transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut', delay: 1 }}
                      className="absolute -right-14 lg:-right-20 xl:-right-24 top-2 lg:top-3 hidden sm:block"
                    >
                      <Sparkles className="text-emerald-400 w-8 sm:w-10 lg:w-12 xl:w-14 h-8 sm:h-10 lg:h-12 xl:h-14" strokeWidth={1.9} />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-base sm:text-lg md:text-[1.45rem] lg:text-[1.75rem] text-white/62 max-w-[780px] leading-[1.5] mb-8 sm:mb-12 lg:mb-14 font-medium"
            >
              {messages.hero.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col xs:flex-row flex-wrap gap-3 xs:gap-4 lg:gap-5 items-start xs:items-center w-full"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(16,185,129,0.6)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigateTo('gallery')}
                className="group relative px-6 xs:px-8 sm:px-12 lg:px-16 py-4 xs:py-5 lg:py-6 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white rounded-2xl font-black tracking-[0.16em] text-xs lg:text-[0.95rem] uppercase transition-all overflow-hidden w-full xs:w-auto text-center min-w-[320px] lg:min-w-[360px]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-emerald-400 opacity-0 group-hover:opacity-20 transition-opacity" />
                <span className="relative flex items-center justify-center gap-2">
                  {messages.hero.exploreGallery}
                  <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                    <ArrowUpRight size={16} />
                  </motion.span>
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, borderColor: '#34d399' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigateTo('inspiration')}
                className="group px-6 xs:px-10 lg:px-14 py-4 xs:py-5 lg:py-6 bg-white/5 backdrop-blur-sm border border-white/10 text-white/80 rounded-2xl font-black tracking-[0.16em] text-xs lg:text-[0.95rem] uppercase hover:bg-white/10 transition-all flex items-center justify-center gap-3 w-full xs:w-auto min-w-[250px] lg:min-w-[290px]"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-7 xs:w-8 lg:w-10 h-7 xs:h-8 lg:h-10 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 flex items-center justify-center group-hover:from-emerald-500/40 group-hover:to-cyan-500/40 transition-colors flex-shrink-0"
                >
                  <Play size={15} fill="white" className="ml-1" />
                </motion.div>
                <span>{messages.hero.watchVideo}</span>
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex space-x-4 lg:space-x-5 pt-8 sm:pt-10 lg:pt-12"
          >
            {[Instagram, Facebook, Twitter, MessageCircle].map((Icon, index) => (
              <motion.a
                key={index}
                href="#"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1, duration: 0.4 }}
                className="group w-10 xs:w-11 lg:w-14 h-10 xs:h-11 lg:h-14 flex items-center justify-center rounded-xl lg:rounded-2xl bg-gradient-to-br from-white/5 to-white/0 text-white/50 hover:text-emerald-400 border border-white/10 hover:border-emerald-500/50 transition-all backdrop-blur-sm flex-shrink-0"
              >
                <Icon size={18} strokeWidth={1.5} className="group-hover:scale-110 transition-transform lg:w-5 lg:h-5" />
              </motion.a>
            ))}
          </motion.div>
        </div>

        <div className="relative w-full aspect-[4/5] max-w-[350px] xs:max-w-[450px] sm:max-w-[550px] lg:max-w-[660px] xl:max-w-[720px] 2xl:max-w-[760px] mx-auto lg:ml-auto mt-8 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
            className="w-full h-full relative art-reveal-container"
          >
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
              }}
              className="absolute inset-0 bg-gradient-to-br from-emerald-600/25 via-cyan-500/10 to-emerald-700/20 blur-[80px] sm:blur-[120px] rounded-full scale-150 -z-10"
            />

            <ArtReveal fallbackImage={paintingImageUrl} />

            <div className="absolute inset-0 pointer-events-none z-20">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#041a14]/40" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#041a14]/20 via-transparent to-[#041a14]/20" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.8 }}
              className="absolute -bottom-20 sm:-bottom-8 lg:-bottom-10 -right-4 sm:-right-8 lg:-right-10 bg-white/5 backdrop-blur-md border border-white/10 p-4 sm:p-6 lg:p-7 rounded-2xl lg:rounded-[28px] hidden sm:block max-w-[280px] lg:max-w-[330px]"
            >
              <span className="text-[10px] uppercase tracking-widest text-[#34d399] font-black mb-2 block">{heroMeta.label}</span>
              <h4 className="text-lg sm:text-xl lg:text-[2rem] serif text-white leading-tight">{heroMeta.title}</h4>
              <p className="text-[10px] lg:text-[11px] text-white/40 uppercase tracking-widest font-bold mt-1">{heroMeta.description}</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/3 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl hidden lg:flex stats-container hover:bg-white/5 transition-all duration-500"
      >
        {messages.hero.stats.map((stat, index) => (
          <StatItem key={stat.label} value={stat.value} label={stat.label} index={index} />
        ))}
      </motion.div>

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
