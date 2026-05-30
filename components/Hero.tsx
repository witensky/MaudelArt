import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
<<<<<<< HEAD
import { ArrowUpRight, Facebook, Instagram, MessageCircle, Play, Sparkles, Twitter } from 'lucide-react';
import { NavigationOptions, View } from '../App';
import { useI18n } from '../i18n/I18nContext';
import { supabase } from '../supabaseClient';
import { ArtReveal } from './ArtReveal';
=======
import { Facebook, Instagram, MessageCircle, Play, Sparkles, Twitter } from 'lucide-react';
import { View } from '../App';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../supabaseClient';
import { ArtReveal } from './ArtReveal';
import { getErrorMessage, isAbortLikeError } from '../utils/errors';
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f

interface HeroProps {
  navigateTo: (view: View, options?: NavigationOptions) => void;
}

interface HeroMeta {
  title: string | { fr?: string; en?: string };
  description: string | { fr?: string; en?: string };
  label: string | { fr?: string; en?: string };
}

const DEFAULT_SOCIAL = {
  instagram: 'https://www.instagram.com/mariemaude_eliacin/',
  facebook: 'https://www.facebook.com/mariemaudeeliacin',
  twitter: 'https://twitter.com/mariemaudelart',
  email: 'mailto:contact@mariemaudeart.com',
};

const DEFAULT_HERO_META: HeroMeta = {
  title: { fr: 'Serenite Tropicale', en: 'Tropical Serenity' },
  description: { fr: 'Huile sur toile - 2023', en: 'Oil on canvas - 2023' },
  label: { fr: 'Oeuvre du moment', en: 'Artwork of the moment' },
};

const StatItem = ({ value, label, index }: { value: string; label: string; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 + index * 0.15, duration: 0.6 }}
    className="flex items-center gap-4 border-r border-white/10 px-6 py-3 transition-colors last:border-0 hover:border-emerald-500/30"
  >
    <motion.span
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6 + index * 0.15, duration: 0.5 }}
      className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-3xl font-black text-transparent md:text-4xl"
    >
      {value}
    </motion.span>
<<<<<<< HEAD
    <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold leading-tight">
      {label.split(' ').map((word, i) => <React.Fragment key={`${word}-${i}`}>{word}<br /></React.Fragment>)}
=======
    <span className="text-[10px] font-bold uppercase leading-tight tracking-widest text-white/40">
      {label.split(' ').map((word, indexValue) => (
        <React.Fragment key={`${word}-${indexValue}`}>
          {word}
          <br />
        </React.Fragment>
      ))}
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
    </span>
  </motion.div>
);

<<<<<<< HEAD
const Hero: React.FC<HeroProps> = ({ navigateTo }) => {
  const { messages } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const [heroMeta, setHeroMeta] = useState({
    title: messages.hero.featuredTitleFallback,
    description: messages.hero.featuredDescriptionFallback,
    label: messages.hero.featuredLabelFallback,
  });
=======
const Hero: React.FC<HeroProps> = ({ setView }) => {
  const { t, getLocalizedValue } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [heroMeta, setHeroMeta] = useState<HeroMeta>(DEFAULT_HERO_META);
  const [socialLinks, setSocialLinks] = useState(DEFAULT_SOCIAL);
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
  const paintingImageUrl = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=1200';

  useEffect(() => {
    let isMounted = true;

    const loadHeroMeta = async () => {
<<<<<<< HEAD
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

=======
      try {
        const { data, error } = await supabase
          .from('site_content')
          .select('content')
          .eq('key', 'hero_image')
          .single();

        if (error) {
          throw error;
        }

        if (!isMounted) {
          return;
        }

        if (data?.content) {
          setHeroMeta({
            title: data.content.title || DEFAULT_HERO_META.title,
            description: data.content.description || DEFAULT_HERO_META.description,
            label: data.content.label || DEFAULT_HERO_META.label,
          });
        }
      } catch (error) {
        if (!isAbortLikeError(error)) {
          // Keep defaults.
          console.error('Error loading hero meta:', getErrorMessage(error));
        }
      }
    };

    const loadSocialLinks = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('instagram_url, facebook_url, twitter_url, email_address')
          .single();

        if (error) {
          throw error;
        }

        if (!isMounted) {
          return;
        }

        if (data) {
          setSocialLinks({
            instagram: data.instagram_url || DEFAULT_SOCIAL.instagram,
            facebook: data.facebook_url || DEFAULT_SOCIAL.facebook,
            twitter: data.twitter_url || DEFAULT_SOCIAL.twitter,
            email: data.email_address ? `mailto:${data.email_address}` : DEFAULT_SOCIAL.email,
          });
        }
      } catch (error) {
        if (!isAbortLikeError(error)) {
          // Keep defaults.
          console.error('Error loading hero social links:', getErrorMessage(error));
        }
      }
    };

    loadHeroMeta();
    loadSocialLinks();

    return () => {
      isMounted = false;
    };
  }, []);

>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 30 });
  const bgTranslateX = useTransform(springX, [-0.5, 0.5], [-30, 30]);
  const bgTranslateY = useTransform(springY, [-0.5, 0.5], [-30, 30]);

  useEffect(() => {
    const handleGlobalMouseMove = (event: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
<<<<<<< HEAD
      mouseX.set(event.clientX / innerWidth - 0.5);
      mouseY.set(event.clientY / innerHeight - 0.5);
=======
      mouseX.set((event.clientX / innerWidth) - 0.5);
      mouseY.set((event.clientY / innerHeight) - 0.5);
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={containerRef}
<<<<<<< HEAD
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
=======
      className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden bg-[#041a14] px-4 pt-16 sm:px-6 sm:pt-20 lg:px-20"
    >
      <motion.div style={{ x: bgTranslateX, y: bgTranslateY }} className="pointer-events-none absolute inset-0">
        <div className="absolute right-[-5%] top-[10%] h-[400px] w-[400px] rounded-full bg-emerald-500/10 blur-[100px] sm:h-[600px] sm:w-[600px] sm:blur-[150px] lg:h-[800px] lg:w-[800px] lg:blur-[180px]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[300px] w-[300px] rounded-full bg-emerald-400/5 blur-[80px] sm:h-[400px] sm:w-[400px] sm:blur-[120px] lg:h-[600px] lg:w-[600px] lg:blur-[150px]" />
      </motion.div>

      <div className="relative z-10 grid w-full max-w-full grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-24 sm:gap-12">
        <div className="w-full space-y-6 sm:space-y-8 lg:space-y-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="mb-6 space-y-1 sm:mb-8 sm:space-y-4">
              {[t('hero.discover'), t('hero.collect')].map((line, index) => (
                <motion.div
                  key={line}
                  initial={{ opacity: 0, x: -80, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.8, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <h1 className="text-4xl font-black leading-[0.9] tracking-tight text-white xs:text-5xl sm:text-6xl sm:leading-[1.1] md:text-6xl lg:text-7xl">
                    {line}
                  </h1>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, x: -80, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative inline-block"
              >
                <h1 className="relative bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-600 bg-clip-text pb-2 text-4xl font-black leading-[0.9] tracking-tight text-transparent xs:text-5xl sm:pb-0 sm:text-6xl sm:leading-[1.1] md:text-6xl lg:text-7xl">
                  {t('hero.rareArt')}
                </h1>

                <motion.div
                  animate={{ x: [0, 8, 0], y: [0, -8, 0], rotate: [0, 15, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut', delay: 1 }}
                  className="absolute top-0 hidden sm:block sm:-right-20"
                >
                  <Sparkles className="h-8 w-8 text-emerald-400 sm:h-10 sm:w-10" strokeWidth={2} />
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
<<<<<<< HEAD
              className="text-base sm:text-lg md:text-[1.45rem] lg:text-[1.75rem] text-white/62 max-w-[780px] leading-[1.5] mb-8 sm:mb-12 lg:mb-14 font-medium"
            >
              {messages.hero.description}
=======
              className="mb-8 max-w-lg text-base font-medium leading-relaxed text-white/60 sm:mb-12 sm:text-lg md:text-xl"
            >
              {t('hero.description')}
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
<<<<<<< HEAD
              className="flex flex-col xs:flex-row flex-wrap gap-3 xs:gap-4 lg:gap-5 items-start xs:items-center w-full"
=======
              className="flex w-full flex-col items-start gap-3 xs:flex-row xs:flex-wrap xs:items-center xs:gap-4"
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(16,185,129,0.6)' }}
                whileTap={{ scale: 0.95 }}
<<<<<<< HEAD
                onClick={() => navigateTo('gallery')}
                className="group relative px-6 xs:px-8 sm:px-12 lg:px-16 py-4 xs:py-5 lg:py-6 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white rounded-2xl font-black tracking-[0.16em] text-xs lg:text-[0.95rem] uppercase transition-all overflow-hidden w-full xs:w-auto text-center min-w-[320px] lg:min-w-[360px]"
=======
                onClick={() => setView('gallery')}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-700 px-6 py-4 text-center text-xs font-black uppercase tracking-widest text-white transition-all xs:w-auto xs:px-8 sm:px-12 xs:py-5"
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-emerald-400 opacity-0 transition-opacity group-hover:opacity-20" />
                <span className="relative flex items-center justify-center gap-2">
<<<<<<< HEAD
                  {messages.hero.exploreGallery}
                  <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                    <ArrowUpRight size={16} />
=======
                  {t('hero.exploreGallery')}
                  <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                    -
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
                  </motion.span>
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, borderColor: '#34d399' }}
                whileTap={{ scale: 0.95 }}
<<<<<<< HEAD
                onClick={() => navigateTo('inspiration')}
                className="group px-6 xs:px-10 lg:px-14 py-4 xs:py-5 lg:py-6 bg-white/5 backdrop-blur-sm border border-white/10 text-white/80 rounded-2xl font-black tracking-[0.16em] text-xs lg:text-[0.95rem] uppercase hover:bg-white/10 transition-all flex items-center justify-center gap-3 w-full xs:w-auto min-w-[250px] lg:min-w-[290px]"
=======
                onClick={() => setView('inspiration')}
                className="group flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-xs font-black uppercase tracking-widest text-white/80 transition-all hover:bg-white/10 xs:w-auto xs:px-10 xs:py-5 backdrop-blur-sm"
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
<<<<<<< HEAD
                  className="w-7 xs:w-8 lg:w-10 h-7 xs:h-8 lg:h-10 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 flex items-center justify-center group-hover:from-emerald-500/40 group-hover:to-cyan-500/40 transition-colors flex-shrink-0"
=======
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 transition-colors group-hover:from-emerald-500/40 group-hover:to-cyan-500/40 xs:h-8 xs:w-8"
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
                >
                  <Play size={15} fill="white" className="ml-1" />
                </motion.div>
<<<<<<< HEAD
                <span>{messages.hero.watchVideo}</span>
=======
                <span>{t('hero.watchVideo')}</span>
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex space-x-4 lg:space-x-5 pt-8 sm:pt-10 lg:pt-12"
          >
<<<<<<< HEAD
            {[Instagram, Facebook, Twitter, MessageCircle].map((Icon, index) => (
              <motion.a
                key={index}
                href="#"
=======
            {[
              { Icon: Instagram, href: socialLinks.instagram, label: 'Instagram' },
              { Icon: Facebook, href: socialLinks.facebook, label: 'Facebook' },
              { Icon: Twitter, href: socialLinks.twitter, label: 'Twitter / X' },
              { Icon: MessageCircle, href: socialLinks.email, label: t('hero.email') },
            ].map(({ Icon, href, label }, index) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel="noreferrer noopener"
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1, duration: 0.4 }}
<<<<<<< HEAD
                className="group w-10 xs:w-11 lg:w-14 h-10 xs:h-11 lg:h-14 flex items-center justify-center rounded-xl lg:rounded-2xl bg-gradient-to-br from-white/5 to-white/0 text-white/50 hover:text-emerald-400 border border-white/10 hover:border-emerald-500/50 transition-all backdrop-blur-sm flex-shrink-0"
              >
                <Icon size={18} strokeWidth={1.5} className="group-hover:scale-110 transition-transform lg:w-5 lg:h-5" />
=======
                className="group flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-gradient-to-br from-white/5 to-white/0 text-white/50 backdrop-blur-sm transition-all hover:border-emerald-500/50 hover:text-emerald-400 xs:h-11 xs:w-11"
              >
                <Icon size={18} strokeWidth={1.5} className="transition-transform group-hover:scale-110" />
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
              </motion.a>
            ))}
          </motion.div>
        </div>

<<<<<<< HEAD
        <div className="relative w-full aspect-[4/5] max-w-[350px] xs:max-w-[450px] sm:max-w-[550px] lg:max-w-[660px] xl:max-w-[720px] 2xl:max-w-[760px] mx-auto lg:ml-auto mt-8 lg:mt-0">
=======
        <div className="relative mx-auto mt-8 aspect-[4/5] w-full max-w-[350px] xs:max-w-[450px] sm:max-w-[550px] lg:mx-0 lg:mt-0">
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
<<<<<<< HEAD
            className="w-full h-full relative art-reveal-container"
=======
            className="relative h-full w-full art-reveal-container"
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
          >
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
              }}
              className="absolute inset-0 -z-10 scale-150 rounded-full bg-gradient-to-br from-emerald-600/25 via-cyan-500/10 to-emerald-700/20 blur-[80px] sm:blur-[120px]"
            />

            <ArtReveal fallbackImage={paintingImageUrl} />

<<<<<<< HEAD
            <div className="absolute inset-0 pointer-events-none z-20">
=======
            <div className="pointer-events-none absolute inset-0 z-20">
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#041a14]/40" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#041a14]/20 via-transparent to-[#041a14]/20" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.8 }}
<<<<<<< HEAD
              className="absolute -bottom-20 sm:-bottom-8 lg:-bottom-10 -right-4 sm:-right-8 lg:-right-10 bg-white/5 backdrop-blur-md border border-white/10 p-4 sm:p-6 lg:p-7 rounded-2xl lg:rounded-[28px] hidden sm:block max-w-[280px] lg:max-w-[330px]"
            >
              <span className="text-[10px] uppercase tracking-widest text-[#34d399] font-black mb-2 block">{heroMeta.label}</span>
              <h4 className="text-lg sm:text-xl lg:text-[2rem] serif text-white leading-tight">{heroMeta.title}</h4>
              <p className="text-[10px] lg:text-[11px] text-white/40 uppercase tracking-widest font-bold mt-1">{heroMeta.description}</p>
=======
              className="absolute -bottom-20 -right-4 hidden max-w-[280px] rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md sm:-bottom-8 sm:-right-8 sm:block sm:p-6"
            >
              <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-[#34d399]">
                {getLocalizedValue(heroMeta.label, t('hero.artworkOfTheMoment'))}
              </span>
              <h4 className="text-lg text-white sm:text-xl serif">
                {getLocalizedValue(heroMeta.title, 'Serenite Tropicale')}
              </h4>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                {getLocalizedValue(heroMeta.description, t('hero.paintingDescription'))}
              </p>
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
<<<<<<< HEAD
        className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/3 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl hidden lg:flex stats-container hover:bg-white/5 transition-all duration-500"
      >
        {messages.hero.stats.map((stat, index) => (
          <StatItem key={stat.label} value={stat.value} label={stat.label} index={index} />
        ))}
=======
        className="stats-container absolute bottom-16 left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-white/10 bg-white/3 shadow-2xl backdrop-blur-2xl transition-all duration-500 hover:bg-white/5 lg:flex"
      >
        <StatItem value="25+" label={t('hero.experienceYears')} index={0} />
        <StatItem value="150" label={t('hero.worksCreated')} index={1} />
        <StatItem value="12" label={t('hero.internationalExhibitions')} index={2} />
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="pointer-events-none absolute bottom-0 left-0 right-0"
      >
        <div className="h-40 bg-gradient-to-b from-transparent via-[#041a14]/20 to-[#041a14] backdrop-blur-md sm:h-80" />
        <div className="h-20 bg-[#041a14] sm:h-40" />
      </motion.div>
    </section>
  );
};

export default Hero;
