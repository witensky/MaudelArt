
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Artwork } from '../types';
import { AUTHORS } from '../constants';
import { ArrowLeft, CreditCard, ShieldCheck, Truck, Package, CheckCircle2 } from 'lucide-react';

interface CheckoutProps {
  artwork: Artwork | null;
  onBack: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ artwork, onBack }) => {
  const [purchaseType, setPurchaseType] = useState<'original' | 'print'>('original');
  const [step, setStep] = useState<'form' | 'success'>('form');

  if (!artwork) {
    return (
      <div className="min-h-screen bg-[#041a14] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-3xl serif text-white mb-6">Aucune œuvre sélectionnée</h2>
        <button onClick={onBack} className="text-[#d4af37] uppercase tracking-widest text-xs font-bold">Retourner à la Galerie</button>
      </div>
    );
  }

  const author = AUTHORS.find(a => a.id === artwork.authorId);
  const price = purchaseType === 'original' ? "Sur demande" : "450 €";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-[#041a14] pt-40 px-6 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full bg-emerald-900/20 backdrop-blur-xl border border-white/10 p-16 rounded-[40px] text-center"
        >
          <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(16,185,129,0.4)]">
            <CheckCircle2 size={48} className="text-emerald-950" />
          </div>
          <h2 className="text-5xl serif text-white mb-6">Demande reçue</h2>
          <p className="text-white/60 leading-relaxed mb-12">
            Votre intérêt pour <span className="text-white font-bold">"{artwork.title}"</span> a bien été enregistré. 
            Marie Maude Eliacin ou son équipe vous contactera sous 24h pour finaliser les détails de l'acquisition et de la livraison.
          </p>
          <button 
            onClick={onBack}
            className="px-12 py-5 bg-[#d4af37] text-emerald-950 font-black uppercase tracking-[0.3em] text-[10px] rounded-xl hover:bg-white transition-all shadow-2xl"
          >
            Retourner à la Galerie
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020d0a] pt-32 pb-20 px-6 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={onBack}
          className="mb-12 flex items-center gap-3 text-white/40 hover:text-[#d4af37] transition-all uppercase text-[10px] font-black tracking-[0.4em]"
        >
          <ArrowLeft size={16} /> Retour à l'œuvre
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          
          {/* Section Visuelle (Gauche) */}
          <div className="lg:col-span-5 space-y-12">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative p-6 bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
            >
              <img src={artwork.image} alt={artwork.title} className="w-full h-auto" />
            </motion.div>
            
            <div className="space-y-6">
              <h1 className="text-5xl serif text-white">{artwork.title}</h1>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                  <img src={author?.avatar} alt={author?.name} className="w-full h-full object-cover" />
                </div>
                <div>
                   <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Artiste</p>
                   <p className="text-sm text-white font-medium">{author?.name}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5">
                <div>
                   <p className="text-[10px] uppercase tracking-widest text-white/20 font-bold mb-2">Technique</p>
                   <p className="text-xs text-white/70">{artwork.technique}</p>
                </div>
                <div>
                   <p className="text-[10px] uppercase tracking-widest text-white/20 font-bold mb-2">Dimensions</p>
                   <p className="text-xs text-white/70">{artwork.dimensions}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire & Options (Droite) */}
          <div className="lg:col-span-7 bg-[#064e3b]/30 backdrop-blur-md border border-white/5 rounded-[40px] p-10 lg:p-16">
            <h2 className="text-3xl serif text-white mb-10">Détails de l'acquisition</h2>

            <form onSubmit={handleSubmit} className="space-y-12">
              
              {/* Choix du type */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Type d'acquisition</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    type="button"
                    onClick={() => setPurchaseType('original')}
                    className={`p-6 rounded-2xl border flex flex-col items-start gap-4 transition-all ${purchaseType === 'original' ? 'bg-[#d4af37] border-[#d4af37] text-emerald-950' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                  >
                    <Package size={24} />
                    <div className="text-left">
                      <p className="font-black text-xs uppercase tracking-widest">Œuvre Originale</p>
                      <p className={`text-[10px] mt-1 opacity-60 ${purchaseType === 'original' ? 'text-emerald-900' : 'text-white/40'}`}>Certificat d'authenticité inclus</p>
                    </div>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setPurchaseType('print')}
                    className={`p-6 rounded-2xl border flex flex-col items-start gap-4 transition-all ${purchaseType === 'print' ? 'bg-[#d4af37] border-[#d4af37] text-emerald-950' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                  >
                    <Package size={24} />
                    <div className="text-left">
                      <p className="font-black text-xs uppercase tracking-widest">Reproduction Fine Art</p>
                      <p className={`text-[10px] mt-1 opacity-60 ${purchaseType === 'print' ? 'text-emerald-900' : 'text-white/40'}`}>Numérotée et signée</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Formulaire de contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Votre Nom</label>
                  <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:outline-none focus:border-[#d4af37] transition-all" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Email de contact</label>
                  <input required type="email" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:outline-none focus:border-[#d4af37] transition-all" />
                </div>
                <div className="md:col-span-2 space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Adresse de livraison</label>
                  <textarea rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:outline-none focus:border-[#d4af37] transition-all resize-none" />
                </div>
              </div>

              {/* Résumé de l'offre */}
              <div className="p-8 bg-black/20 rounded-2xl border border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Investissement estimé</span>
                  <span className="text-2xl serif text-[#d4af37]">{price}</span>
                </div>
                <div className="flex items-center gap-4 text-white/20 pt-4 border-t border-white/5">
                   <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest"><Truck size={14} /> Monde Entier</div>
                   <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest"><ShieldCheck size={14} /> Assuré</div>
                   <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest"><CreditCard size={14} /> Sécurisé</div>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-6 bg-white text-emerald-950 font-black uppercase tracking-[0.4em] text-xs rounded-xl shadow-2xl hover:bg-[#d4af37] transition-all group"
              >
                Confirmer mon intérêt pour l'acquisition
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
