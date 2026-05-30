import React from 'react';
import { motion } from 'framer-motion';
import { Brush, Droplets, Layers } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';

const Inspiration: React.FC = () => {
  const { messages } = useI18n();
  const techniques = [
    { icon: <Brush size={40} />, ...messages.inspiration.techniques[0] },
    { icon: <Layers size={40} />, ...messages.inspiration.techniques[1] },
    { icon: <Droplets size={40} />, ...messages.inspiration.techniques[2] },
  ];

  return (
    <section id="inspiration" className="py-32 bg-[#f5f5f0] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/canvas-orange.png')]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl serif text-emerald-950 mb-8"
          >
            {messages.inspiration.title}
          </motion.h2>
          <p className="text-gray-600 leading-relaxed text-lg italic">{messages.inspiration.quote}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {techniques.map((technique, index) => (
            <motion.div
              key={technique.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-white p-12 rounded-sm shadow-sm hover:shadow-xl transition-shadow duration-500 text-center border-b-4 border-transparent hover:border-[#d4af37]"
            >
              <div className="inline-block p-4 bg-emerald-50 text-emerald-900 rounded-full mb-8">{technique.icon}</div>
              <h3 className="text-2xl serif mb-4 text-emerald-950">{technique.title}</h3>
              <p className="text-gray-500 leading-relaxed">{technique.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-32 aspect-video bg-emerald-900 rounded-sm overflow-hidden relative group cursor-pointer"
        >
          <img
            src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=2000"
            alt={messages.inspiration.studioAlt}
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[2s]"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 mb-6 group-hover:scale-110 transition-transform">
                <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-2" />
              </div>
              <p className="text-white uppercase tracking-[0.3em] font-medium">{messages.inspiration.discoverStudio}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Inspiration;
