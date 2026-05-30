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
            </div>
          </motion.div>

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
              </div>
            </div>
          </motion.aside>
        </div>

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
        </motion.div>
      </div>
    </section>
  );
};

export default Biography;
