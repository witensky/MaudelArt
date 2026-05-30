<<<<<<< HEAD
import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Piano, Quote, Scissors } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';

const Biography: React.FC = () => {
  const { messages } = useI18n();

  const narrativeSections = [
    {
      badge: messages.biography.chapterOneBadge,
      title: messages.biography.chapterOneTitle,
      text: messages.biography.chapterOneText,
      icon: Scissors,
    },
    {
      badge: messages.biography.chapterTwoBadge,
      title: messages.biography.chapterTwoTitle,
      text: `${messages.biography.chapterTwoTextOne} ${messages.biography.chapterTwoTextTwo}`,
      icon: Piano,
    },
    {
      badge: 'Mastery',
      title: messages.biography.chapterThreeTitle,
      text: `${messages.biography.chapterThreeTextOne} ${messages.biography.chapterThreeTextTwo}`,
      icon: Palette,
    },
    {
      badge: 'Present',
      title: messages.biography.chapterFourTitle,
      text: messages.biography.chapterFourText,
      icon: Quote,
    },
  ];

  const signatureBadges = [
    { label: messages.biography.badges.precision, icon: Scissors },
    { label: messages.biography.badges.harmony, icon: Piano },
    { label: messages.biography.badges.colors, icon: Palette },
  ];

  return (
    <section id="bio" className="min-h-screen bg-emerald-950 pb-28 pt-32 text-white">
      <div className="mx-auto max-w-[1380px] px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.95fr)_420px] lg:gap-20 xl:grid-cols-[minmax(0,1fr)_460px]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-[620px] pt-6"
          >
            <span className="mb-8 block text-[10px] font-bold uppercase tracking-[0.38em] text-[#d4af37]">
              {messages.biography.badge}
            </span>

            <h1 className="serif max-w-[520px] text-5xl leading-[0.95] text-white md:text-7xl">
              Marie Maude
              <br />
              Eliacin
            </h1>

            <div className="mt-8 h-px w-24 bg-[#d4af37]" />

            <div className="mt-8 max-w-[560px] space-y-5">
              <p className="serif text-2xl italic leading-[1.55] text-white/78">{messages.biography.introQuote}</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#d4af37]">{messages.biography.title}</p>
=======
import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Palette, Piano, Quote, Scissors } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../supabaseClient';
import { getErrorMessage, isAbortLikeError } from '../utils/errors';

type LocalizedText = string | { fr?: string; en?: string };

interface Chapter {
  id: number;
  title: LocalizedText;
  icon: 'Scissors' | 'Palette' | 'Piano';
  period?: LocalizedText;
  text: LocalizedText;
}

interface Exhibition {
  year: string;
  title: LocalizedText;
  location: LocalizedText;
}

interface BioContent {
  mainTitle: LocalizedText;
  subtitle: LocalizedText;
  quote: LocalizedText;
  quoteAuthor?: LocalizedText;
  secondaryQuote?: LocalizedText;
  secondaryQuoteAuthor?: LocalizedText;
  chapters: Chapter[];
  exhibitions: Exhibition[];
  photoUrl?: string;
  finalStatement?: LocalizedText;
}

const FALLBACK: BioContent = {
  mainTitle: 'Marie Maude Eliacin',
  subtitle: { fr: 'Recit artistique', en: 'Artist narrative' },
  quote: {
    fr: "Ma peinture est un voyage interieur, fait d'emotions longtemps conservees qui attendaient simplement de sortir pour apporter un peu de lumiere la ou elle manque.",
    en: 'My painting is a journey of self-discovery, with emotions stored in me for many years that were simply waiting to emerge and bring a little light where it is lacking.',
  },
  quoteAuthor: 'Marie Maude Eliacin',
  secondaryQuote: {
    fr: "L'univers pictural de Maude Eliacin n'a pas de place pour la morosite. Les couleurs lumineuses y expriment vitalite, joie et delice. Maude dessine un monde plus joyeux, une nature ou il fait bon vivre.",
    en: "Maude Eliacin's pictorial universe has no room for gloom. Brightly hued colors express vitality, bliss, and delight. Maude sketches a more cheerful world, a nature where life feels good.",
  },
  secondaryQuoteAuthor: {
    fr: '- Soucaneau Gabriel, Raj Magazine (2007)',
    en: '- Soucaneau Gabriel, Raj Magazine (2007)',
  },
  chapters: [
    {
      id: 1,
      title: { fr: 'La precision dans chaque geste', en: 'Precision in Every Gesture' },
      icon: 'Scissors',
      period: { fr: 'Transition 2003', en: '2003 Transition' },
      text: {
        fr: "Couturiere reconnue pour sa minutie et son perfectionnisme, Marie Maude Eliacin se tourne vers les arts visuels apres une retraite anticipee en 2003. Pianiste passionnee, elle cherchait alors un nouvel espace de creation adapte a son rythme de vie.",
        en: 'Known as a seamstress for her meticulous attention to detail and perfectionism, Marie Maude Eliacin turned to the visual arts after an early retirement in 2003. A lifelong pianist, she was looking for a new creative outlet that fit her rhythm of life.',
      },
    },
    {
      id: 2,
      title: { fr: 'Du piano au chevalet', en: 'From Piano to Easel' },
      icon: 'Palette',
      period: { fr: 'La rencontre', en: 'The encounter' },
      text: {
        fr: "Sa rencontre avec le professeur Rene Cange marque un tournant decisif. Il l'introduit au dessin, a l'acrylique puis a l'huile, un medium qu'elle adopte rapidement avec enthousiasme.",
        en: 'Her encounter with Professor Rene Cange became a decisive turning point. He introduced her to drawing, acrylics, and ultimately oil painting, a medium she quickly embraced with enthusiasm.',
      },
    },
    {
      id: 3,
      title: { fr: 'Ordre et fantaisie', en: 'Order and Fantasy' },
      icon: 'Palette',
      period: { fr: 'Maitrise', en: 'Mastery' },
      text: {
        fr: "Par la suite, l'enseignement du professeur Franck Louissaint approfondit encore sa technique. En decembre 2015, elle presente sa deuxieme exposition, Ordre et Fantaisie, dans la residence privee de sa fille a Petion-Ville.",
        en: 'Later, the guidance of Professor Franck Louissaint further deepened her technique. In December 2015, she presented her second exhibition, Order and Fantasy, at her daughter\'s private residence in Petion-Ville.',
      },
    },
    {
      id: 4,
      title: { fr: 'Un chemin toujours vivant', en: 'A Journey Still in Motion' },
      icon: 'Palette',
      period: { fr: 'Aujourd\'hui', en: 'Today' },
      text: {
        fr: "Malgre les contraintes personnelles et les voyages, Maude poursuit sa pratique dans l'intimite de l'atelier. Elle y cultive un realisme expressif nourri par le fusain, l'huile et le gout du detail.",
        en: 'Despite personal constraints and travel, Maude continues her practice in the intimacy of the studio. There she cultivates an expressive realism shaped by charcoal, oil, and a love of detail.',
      },
    },
  ],
  exhibitions: [
    {
      year: '2015',
      title: { fr: 'Ordre et Fantaisie', en: 'Order and Fantasy' },
      location: { fr: 'Residence privee, Petion-Ville, Haiti', en: 'Private residence, Petion-Ville, Haiti' },
    },
    {
      year: '2007',
      title: { fr: 'Foire internationale d\'art caribeen (ICA)', en: 'International Caribbean Art Fair (ICA)' },
      location: { fr: 'New York, Etats-Unis', en: 'New York, USA' },
    },
    {
      year: '2007',
      title: { fr: 'Art et Spectacle', en: 'Art and Spectacle' },
      location: { fr: 'Festival Arts, Petion-Ville, Haiti', en: 'Festival Arts, Petion-Ville, Haiti' },
    },
    {
      year: '2007',
      title: { fr: 'Creations en plein air', en: 'Open-Air Creations' },
      location: { fr: 'Kenscoff, Haiti', en: 'Kenscoff, Haiti' },
    },
  ],
  photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800',
  finalStatement: {
    fr: "Aujourd'hui, elle vous invite a decouvrir ses oeuvres anciennes et recentes, fruits d'un voyage interieur qui continue d'apporter de la lumiere la ou elle fait defaut.",
    en: 'Today, she invites you to discover her older and recent works, the result of an inner journey that continues to bring light where it is needed.',
  },
};

const ICONS: Record<string, React.FC<{ size?: number; className?: string }>> = {
  Scissors: ({ size, className }) => <Scissors size={size} className={className} />,
  Palette: ({ size, className }) => <Palette size={size} className={className} />,
  Piano: ({ size, className }) => <Piano size={size} className={className} />,
};

const Biography: React.FC = () => {
  const { t, getLocalizedValue } = useLanguage();
  const [remoteBio, setRemoteBio] = useState<Partial<BioContent> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadBiography = async () => {
      try {
        const { data, error } = await supabase
          .from('site_content')
          .select('content')
          .eq('key', 'biography')
          .single();

        if (error) {
          throw error;
        }

        if (!isMounted) {
          return;
        }

        if (data?.content) {
          setRemoteBio(data.content as Partial<BioContent>);
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (isAbortLikeError(error)) {
          return;
        }

        console.error('Error loading biography:', getErrorMessage(error));
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadBiography();

    return () => {
      isMounted = false;
    };
  }, []);

  const bio = useMemo<BioContent>(() => ({
    ...FALLBACK,
    ...remoteBio,
    chapters: (remoteBio?.chapters as Chapter[]) || FALLBACK.chapters,
    exhibitions: (remoteBio?.exhibitions as Exhibition[]) || FALLBACK.exhibitions,
  }), [remoteBio]);

  if (loading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-emerald-950">
        <Loader2 className="animate-spin text-[#d4af37]" size={32} />
      </section>
    );
  }

  const mainTitle = getLocalizedValue(bio.mainTitle, 'Marie Maude Eliacin');
  const titleParts = mainTitle.split(' ');

  return (
    <section id="bio" className="min-h-screen bg-emerald-950 pb-32 pt-40 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-40 grid grid-cols-1 items-center gap-20 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[#d4af37]/10 blur-3xl" />
            <span className="mb-6 block text-xs font-bold uppercase tracking-[0.4em] text-[#d4af37]">
              {getLocalizedValue(bio.subtitle)}
            </span>
            <h2 className="mb-8 text-6xl leading-tight md:text-8xl serif">
              {titleParts.slice(0, -1).join(' ')} <br />
              {titleParts.slice(-1)}
            </h2>
            <div className="mb-10 h-1 w-24 bg-[#d4af37]" />
            <p className="max-w-lg text-xl italic leading-relaxed text-white/60 serif">
              "{getLocalizedValue(bio.quote)}"
            </p>
            {bio.quoteAuthor && (
              <p className="mt-4 text-xs font-bold uppercase tracking-widest text-[#d4af37]">
                - {getLocalizedValue(bio.quoteAuthor)}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="group relative"
          >
            <div className="absolute -inset-4 -z-10 translate-x-4 translate-y-4 rounded-sm border border-[#d4af37]/30 transition-transform duration-700 group-hover:translate-x-0 group-hover:translate-y-0" />
            <div className="aspect-[4/5] overflow-hidden shadow-2xl">
              <img
                src={bio.photoUrl || FALLBACK.photoUrl}
                alt={mainTitle}
                className="h-full w-full object-cover grayscale transition-all duration-[2s] group-hover:grayscale-0"
              />
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
            </div>
          </motion.div>

<<<<<<< HEAD
          <motion.aside
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="lg:pt-2"
          >
            <div className="mx-auto w-full max-w-[460px]">
              <div className="aspect-[4/5] overflow-hidden bg-white/5 shadow-[0_30px_80px_rgba(0,0,0,0.26)]">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=900"
                  alt={messages.biography.title}
                  className="h-full w-full object-cover object-center grayscale"
                />
              </div>

              <div className="mt-14">
                <div className="mb-8 flex items-center gap-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.34em] text-[#d4af37]">
                    {messages.biography.timelineTitle}
                  </span>
                  <span className="h-px flex-1 bg-[#d4af37]/20" />
                </div>

                <div className="relative space-y-8 pl-8">
                  <div className="absolute bottom-2 left-[6px] top-2 w-px bg-[#d4af37]/25" />

                  {messages.biography.exhibitions.map((exhibition, index) => (
                    <motion.div
                      key={`${exhibition.year}-${exhibition.title}`}
                      initial={{ opacity: 0, x: 16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: index * 0.08 }}
                      className="relative"
                    >
                      <span className="absolute -left-[27px] top-2 h-3 w-3 rounded-full border border-[#d4af37]/30 bg-[#d4af37]" />
                      <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-[#d4af37]/80">{exhibition.year}</p>
                      <h3 className="mt-2 max-w-[280px] text-lg font-semibold leading-snug text-white">{exhibition.title}</h3>
                      <p className="mt-1 max-w-[280px] text-[10px] uppercase tracking-[0.2em] text-white/42">{exhibition.location}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-10 grid grid-cols-3 gap-3">
                  {signatureBadges.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div key={item.label} className="flex flex-col items-center justify-center gap-2 bg-white/[0.045] px-3 py-4 text-center">
                        <Icon size={16} className="text-[#d4af37]" />
                        <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/45">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
=======
        <div className="mb-40 grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="space-y-24 text-lg font-light leading-relaxed text-white/70 lg:col-span-8">
            {bio.chapters.map((chapter, index) => {
              const Icon = ICONS[chapter.icon] || ICONS.Palette;

              return (
                <motion.div
                  key={chapter.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="space-y-8"
                >
                  {chapter.period && (
                    <div className="flex items-center gap-4 text-[#d4af37]">
                      <Icon size={20} />
                      <span className="h-px w-12 bg-[#d4af37]/30" />
                      <span className="text-xs font-bold uppercase tracking-widest">
                        {getLocalizedValue(chapter.period)}
                      </span>
                    </div>
                  )}
                  <h3 className="text-4xl text-white serif">{getLocalizedValue(chapter.title)}</h3>
                  <p>{getLocalizedValue(chapter.text)}</p>
                </motion.div>
              );
            })}

            {bio.secondaryQuote && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative border-l-4 border-[#d4af37] bg-white/5 p-12"
              >
                <Quote className="absolute right-8 top-8 text-[#d4af37]/20" size={64} />
                <p className="mb-6 text-2xl italic leading-relaxed text-white/90 serif">
                  "{getLocalizedValue(bio.secondaryQuote)}"
                </p>
                {bio.secondaryQuoteAuthor && (
                  <cite className="text-xs font-bold uppercase tracking-widest text-[#d4af37] not-italic">
                    {getLocalizedValue(bio.secondaryQuoteAuthor)}
                  </cite>
                )}
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-4 lg:pl-10">
            <div className="sticky top-40 space-y-12">
              <h4 className="border-b border-white/10 pb-6 text-xs font-bold uppercase tracking-[0.4em] text-[#d4af37]">
                {t('biography.timelineTitle')}
              </h4>
              <div className="relative space-y-12">
                <div className="absolute left-0 top-2 bottom-2 w-px bg-white/10" />
                {bio.exhibitions.map((exhibition, index) => (
                  <motion.div
                    key={`${exhibition.year}-${index}`}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative pl-10"
                  >
                    <div className="absolute left-[-4.5px] top-2 h-2 w-2 rounded-full bg-[#d4af37] shadow-[0_0_10px_#d4af37] transition-transform group-hover:scale-150" />
                    <span className="mb-1 block text-2xl text-[#d4af37]/60 transition-colors group-hover:text-[#d4af37] serif">
                      {exhibition.year}
                    </span>
                    <p className="text-lg font-semibold text-white transition-transform group-hover:translate-x-1">
                      {getLocalizedValue(exhibition.title)}
                    </p>
                    <p className="mt-1 text-xs uppercase leading-relaxed tracking-widest text-white/40">
                      {getLocalizedValue(exhibition.location)}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 pt-10">
                {[
                  { Icon: Scissors, label: t('biography.precision') },
                  { Icon: Piano, label: t('biography.harmony') },
                  { Icon: Palette, label: t('biography.colors') },
                ].map(({ Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-2 rounded-sm bg-white/5 p-4">
                    <Icon size={20} className="text-[#d4af37]/60" />
                    <span className="text-[8px] uppercase tracking-widest opacity-40">{label}</span>
                  </div>
                ))}
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
              </div>
            </div>
          </motion.aside>
        </div>

<<<<<<< HEAD
        <div className="mt-24 grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-20 xl:grid-cols-[minmax(0,1fr)_460px]">
          <div className="max-w-[760px] space-y-16">
            {narrativeSections.map((section, index) => {
              const Icon = section.icon;

              return (
                <motion.article
                  key={section.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-4 text-[#d4af37]">
                    <Icon size={15} strokeWidth={1.8} />
                    <span className="h-px w-12 bg-[#d4af37]/30" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.24em]">{section.badge}</span>
                  </div>

                  <div className="space-y-4">
                    <h2 className="serif text-3xl leading-tight text-white md:text-[2.35rem]">{section.title}</h2>
                    <p className="max-w-[720px] text-[1.03rem] leading-8 text-white/66">{section.text}</p>
                  </div>
                </motion.article>
              );
            })}

            <motion.blockquote
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative mt-6 overflow-hidden bg-white/[0.045] px-8 py-8"
            >
              <div className="absolute inset-y-0 left-0 w-[2px] bg-[#d4af37]" />
              <Quote className="absolute right-6 top-6 text-[#d4af37]/20" size={34} />
              <p className="max-w-[620px] serif text-2xl italic leading-[1.7] text-white/88">{messages.biography.featureQuote}</p>
              <footer className="mt-6 text-[10px] font-bold uppercase tracking-[0.24em] text-[#d4af37]">
                {messages.biography.featureQuoteAuthor}
              </footer>
            </motion.blockquote>
          </div>

          <div className="hidden lg:block" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-24 max-w-[780px] border-t border-white/8 pt-16 text-center"
        >
          <h2 className="serif text-4xl text-white md:text-5xl">{messages.biography.finalTitle}</h2>
          <p className="mx-auto mt-6 max-w-[620px] text-base leading-8 text-white/60">{messages.biography.finalText}</p>
          <a
            href="#gallery"
            className="mt-10 inline-flex items-center justify-center bg-[#d4af37] px-10 py-4 text-[11px] font-black uppercase tracking-[0.28em] text-emerald-950 transition-all hover:bg-white"
          >
            {messages.biography.finalCta}
          </a>
=======
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl border-t border-white/5 py-24 text-center"
        >
          <h3 className="mb-12 text-4xl serif">{t('biography.closingTitle')}</h3>
          <p className="mb-12 text-xl leading-relaxed text-white/60">
            {getLocalizedValue(bio.finalStatement)}
          </p>
          <div className="flex justify-center gap-8">
            <a
              href="#gallery"
              className="inline-block bg-[#d4af37] px-12 py-5 text-xs font-bold uppercase tracking-[0.3em] text-emerald-950 shadow-2xl transition-all hover:bg-white"
            >
              {t('biography.exploreWorks')}
            </a>
          </div>
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
        </motion.div>
      </div>
    </section>
  );
};

export default Biography;
