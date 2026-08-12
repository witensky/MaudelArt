import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Palette, Piano, Quote, Scissors } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../supabaseClient';

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
    const loadBiography = async () => {
      const { data } = await supabase.from('site_content').select('content').eq('key', 'biography').single();

      if (data?.content) {
        setRemoteBio(data.content as Partial<BioContent>);
      }

      setLoading(false);
    };

    loadBiography();
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
            </div>
          </motion.div>
        </div>

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
              </div>
            </div>
          </div>
        </div>

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
              href="/galerie"
              className="inline-block bg-[#d4af37] px-12 py-5 text-xs font-bold uppercase tracking-[0.3em] text-emerald-950 shadow-2xl transition-all hover:bg-white"
            >
              {t('biography.exploreWorks')}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Biography;
