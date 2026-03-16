import React from 'react';
import { motion } from 'framer-motion';
import { Brush, Droplets, Layers } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Inspiration: React.FC = () => {
  const { t } = useLanguage();

  const techniques = [
    {
      icon: <Brush size={40} />,
      title: t('inspiration.techniques.oilTitle'),
      desc: t('inspiration.techniques.oilDescription'),
    },
    {
      icon: <Layers size={40} />,
      title: t('inspiration.techniques.charcoalTitle'),
      desc: t('inspiration.techniques.charcoalDescription'),
    },
    {
      icon: <Droplets size={40} />,
      title: t('inspiration.techniques.realismTitle'),
      desc: t('inspiration.techniques.realismDescription'),
    },
  ];

  return (
    <section id="inspiration" className="relative overflow-hidden bg-[#f5f5f0] py-32">
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/canvas-orange.png')]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-24 max-w-3xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 text-5xl text-emerald-950 serif"
          >
            {t('inspiration.title')}
          </motion.h2>
          <p className="text-lg italic leading-relaxed text-gray-600">
            {t('inspiration.quote')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {techniques.map((technique, index) => (
            <motion.div
              key={technique.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="rounded-sm border-b-4 border-transparent bg-white p-12 text-center shadow-sm transition-shadow duration-500 hover:border-[#d4af37] hover:shadow-xl"
            >
              <div className="mb-8 inline-block rounded-full bg-emerald-50 p-4 text-emerald-900">
                {technique.icon}
              </div>
              <h3 className="mb-4 text-2xl text-emerald-950 serif">{technique.title}</h3>
              <p className="leading-relaxed text-gray-500">{technique.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="group relative mt-32 aspect-video cursor-pointer overflow-hidden rounded-sm bg-emerald-900"
        >
          <img
            src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=2000"
            alt={t('inspiration.discoverStudio')}
            className="h-full w-full object-cover opacity-60 transition-transform duration-[2s] group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-white/30 bg-white/20 backdrop-blur-md transition-transform group-hover:scale-110">
                <div className="ml-2 h-0 w-0 border-b-[10px] border-l-[18px] border-t-[10px] border-b-transparent border-l-white border-t-transparent" />
              </div>
              <p className="font-medium uppercase tracking-[0.3em] text-white">
                {t('inspiration.discoverStudio')}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Inspiration;
