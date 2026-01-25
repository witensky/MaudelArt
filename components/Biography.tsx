
import React from 'react';
import { motion } from 'framer-motion';
import { EXHIBITIONS } from '../constants';
import { Quote, Piano, Scissors, Palette } from 'lucide-react';

const Biography: React.FC = () => {
  return (
    <section id="bio" className="pt-40 pb-32 bg-emerald-950 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-40">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#d4af37]/10 blur-3xl rounded-full" />
            <span className="text-[#d4af37] uppercase tracking-[0.4em] text-xs font-bold mb-6 block">Artist Narrative</span>
            <h2 className="text-6xl md:text-8xl serif leading-tight mb-8">Marie Maude <br/> Eliacin</h2>
            <div className="h-1 w-24 bg-[#d4af37] mb-10" />
            <p className="text-xl text-white/60 leading-relaxed italic serif max-w-lg">
              "My painting is a journey of self-discovery, with emotions stored in me for many years which were just waiting to come out to bring a little light where it is lacking."
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="relative group"
          >
            <div className="absolute -inset-4 border border-[#d4af37]/30 rounded-sm -z-10 translate-x-4 translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700" />
            <div className="aspect-[4/5] overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800" 
                alt="Marie Maude Eliacin" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[2s]"
              />
            </div>
          </motion.div>
        </div>

        {/* Story Chapters */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-40">
          <div className="lg:col-span-8 space-y-24 text-lg text-white/70 font-light leading-relaxed">
            
            {/* Chapter 1: The Transition */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4 text-[#d4af37]">
                <Scissors size={20} />
                <span className="h-px w-12 bg-[#d4af37]/30" />
                <span className="uppercase tracking-widest text-xs font-bold">2003 Transition</span>
              </div>
              <h3 className="text-4xl serif text-white">Precision in Every Thread</h3>
              <p>
                A career seamstress known for her meticulous attention to detail and perfectionism, Marie Maude Eliacin transitioned into the visual arts after her early retirement in 2003. A lifelong pianist, she found it difficult to continue with the instrument due to frequent travel and sought a new creative outlet. At the suggestion of a friend, she visited a visual arts workshop without much initial enthusiasm.
              </p>
            </motion.div>

            {/* Chapter 2: The Discovery */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4 text-[#d4af37]">
                <Palette size={20} />
                <span className="h-px w-12 bg-[#d4af37]/30" />
                <span className="uppercase tracking-widest text-xs font-bold">The Encounter</span>
              </div>
              <h3 className="text-4xl serif text-white">From Piano Keys to Pencils</h3>
              <p>
                That changed after a very fortunate encounter with Professor <span className="text-white font-medium">René Cangé</span>, who introduced her to easel art, acrylics, and ultimately oil painting—a medium she quickly embraced. It was through this process that Maud also discovered her natural talent for drawing, especially with ink, producing works that stand out for their precision and expressiveness.
              </p>
              <p>
                Maude began formal painting classes at the end of 2003 and quickly immersed herself in exploring a range of subjects, including nature, seascapes, portraits, and still lifes.
              </p>
            </motion.div>

            {/* Quote Chapter */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 p-12 border-l-4 border-[#d4af37] relative"
            >
              <Quote className="absolute top-8 right-8 text-[#d4af37]/20" size={64} />
              <p className="text-2xl serif italic text-white/90 mb-6 leading-relaxed">
                "Maude Eliacin's pictorial universe has no room for gloom. They are brightly hued colors that express vitality, bliss, delights. Maud draws a more cheerful world, a nature where life is good."
              </p>
              <cite className="text-[#d4af37] uppercase tracking-widest text-xs font-bold not-italic">
                — Soucaneau Gabriel, Raj Magazine (2007)
              </cite>
            </motion.div>

            {/* Chapter 3: Mastery */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h3 className="text-4xl serif text-white">Order and Fantasy</h3>
              <p>
                She later deepened her technique under the guidance of the late Professor <span className="text-white font-medium">Franck Louissaint</span>, whose mentorship helped refine her oil painting practice even more. In December 2015, Maud held her second exhibition, <span className="italic text-white">Order and Fantasy</span>, at her daughter’s private residence in Pétion-Ville, Haiti.
              </p>
              <p>
                The opening was marked by the presence of Franck Louissaint, who observed a profound maturity in this collection. He noted her mastery of colors and stated to the press: <span className="text-[#d4af37] font-medium">"She has talent and a future in the Haitian pictorial field."</span>
              </p>
            </motion.div>

            {/* Chapter 4: Present */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h3 className="text-4xl serif text-white">A Continuous Journey</h3>
              <p>
                Though her travel schedule and personal constraints have limited her participation in further exhibitions, Maud continues to paint privately. She particularly enjoys working with charcoal and oil, mediums that allow her to pursue her passion for detail and expressive realism.
              </p>
            </motion.div>
          </div>

          {/* Timeline Sidebar */}
          <div className="lg:col-span-4 lg:pl-10">
            <div className="sticky top-40 space-y-12">
              <h4 className="text-xs uppercase tracking-[0.4em] text-[#d4af37] font-bold border-b border-white/10 pb-6">Exhibition Highlights</h4>
              <div className="space-y-12 relative">
                <div className="absolute left-0 top-2 bottom-2 w-px bg-white/10" />
                
                {EXHIBITIONS.map((ex, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="relative pl-10 group"
                  >
                    <div className="absolute left-[-4.5px] top-2 w-2 h-2 rounded-full bg-[#d4af37] group-hover:scale-150 transition-transform shadow-[0_0_10px_#d4af37]" />
                    <span className="serif text-2xl text-[#d4af37]/60 block mb-1 group-hover:text-[#d4af37] transition-colors">{ex.year}</span>
                    <p className="text-lg font-semibold text-white group-hover:translate-x-1 transition-transform">{ex.title}</p>
                    <p className="text-xs text-white/40 uppercase tracking-widest mt-1 leading-relaxed">{ex.location}</p>
                  </motion.div>
                ))}
              </div>

              {/* Icon badges */}
              <div className="grid grid-cols-3 gap-4 pt-10">
                <div className="p-4 bg-white/5 rounded-sm flex flex-col items-center gap-2">
                  <Scissors size={20} className="text-[#d4af37]/60" />
                  <span className="text-[8px] uppercase tracking-widest opacity-40">Precision</span>
                </div>
                <div className="p-4 bg-white/5 rounded-sm flex flex-col items-center gap-2">
                  <Piano size={20} className="text-[#d4af37]/60" />
                  <span className="text-[8px] uppercase tracking-widest opacity-40">Harmony</span>
                </div>
                <div className="p-4 bg-white/5 rounded-sm flex flex-col items-center gap-2">
                  <Palette size={20} className="text-[#d4af37]/60" />
                  <span className="text-[8px] uppercase tracking-widest opacity-40">Colors</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final Statement / CTA */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto py-24 border-t border-white/5"
        >
          <h3 className="text-4xl serif mb-12">Bringing Light to the Lack</h3>
          <p className="text-xl text-white/60 mb-12 leading-relaxed">
            Today, she invites you to admire some of her old and recent works through her painting, which is a journey of self-discovery, with emotions stored in her for many years and which were just waiting to come out to bring a little light where it is lacking.
          </p>
          <div className="flex justify-center gap-8">
            <a href="#gallery" className="inline-block px-12 py-5 bg-[#d4af37] text-emerald-950 font-bold uppercase tracking-[0.3em] text-xs hover:bg-white transition-all shadow-2xl">
              Explore the Works
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Biography;
