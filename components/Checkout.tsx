import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, CreditCard, Package, ShieldCheck, Truck } from 'lucide-react';
import { AUTHORS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { Artwork } from '../types';

interface CheckoutProps {
  artwork: Artwork | null;
  onBack: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ artwork, onBack }) => {
  const { t } = useLanguage();
  const [purchaseType, setPurchaseType] = useState<'original' | 'print'>('original');
  const [step, setStep] = useState<'form' | 'success'>('form');

  const author = useMemo(() => AUTHORS.find((entry) => entry.id === artwork?.authorId), [artwork?.authorId]);
  const price = purchaseType === 'original' ? t('checkout.priceOnRequest') : '450 EUR';

  if (!artwork) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#041a14] p-6 text-center">
        <h2 className="mb-6 text-3xl text-white serif">{t('checkout.noArtwork')}</h2>
        <button onClick={onBack} className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
          {t('checkout.backToGallery')}
        </button>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#041a14] px-6 pt-40">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-xl rounded-[40px] border border-white/10 bg-emerald-900/20 p-16 text-center backdrop-blur-xl"
        >
          <div className="mx-auto mb-10 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.4)]">
            <CheckCircle2 size={48} className="text-emerald-950" />
          </div>
          <h2 className="mb-6 text-5xl text-white serif">{t('checkout.successTitle')}</h2>
          <p className="mb-12 leading-relaxed text-white/60">
            {t('checkout.successDescription', { title: artwork.title })}
          </p>
          <button
            onClick={onBack}
            className="rounded-xl bg-[#d4af37] px-12 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-950 shadow-2xl transition-all hover:bg-white"
          >
            {t('checkout.backToGallery')}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020d0a] px-6 pb-20 pt-32 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <button
          onClick={onBack}
          className="mb-12 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-white/40 transition-all hover:text-[#d4af37]"
        >
          <ArrowLeft size={16} />
          {t('checkout.backToArtwork')}
        </button>

        <div className="grid grid-cols-1 items-start gap-20 lg:grid-cols-12">
          <div className="space-y-12 lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative bg-white p-6 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
            >
              <img src={artwork.image} alt={artwork.title} className="h-auto w-full" />
            </motion.div>

            <div className="space-y-6">
              <h1 className="text-5xl text-white serif">{artwork.title}</h1>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 overflow-hidden rounded-full border border-white/10">
                  <img src={author?.avatar} alt={author?.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">{t('common.artist')}</p>
                  <p className="text-sm font-medium text-white">{author?.name}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-8">
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white/20">{t('common.technique')}</p>
                  <p className="text-xs text-white/70">{artwork.technique}</p>
                </div>
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white/20">{t('common.dimensions')}</p>
                  <p className="text-xs text-white/70">{artwork.dimensions}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[40px] border border-white/5 bg-[#064e3b]/30 p-10 backdrop-blur-md lg:col-span-7 lg:p-16">
            <h2 className="mb-10 text-3xl text-white serif">{t('checkout.acquisitionDetails')}</h2>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                setStep('success');
              }}
              className="space-y-12"
            >
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30">
                  {t('checkout.acquisitionType')}
                </label>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {[
                    {
                      key: 'original' as const,
                      title: t('checkout.originalTitle'),
                      description: t('checkout.originalDescription'),
                    },
                    {
                      key: 'print' as const,
                      title: t('checkout.printTitle'),
                      description: t('checkout.printDescription'),
                    },
                  ].map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => setPurchaseType(option.key)}
                      className={`flex flex-col items-start gap-4 rounded-2xl border p-6 transition-all ${purchaseType === option.key ? 'border-[#d4af37] bg-[#d4af37] text-emerald-950' : 'border-white/10 bg-white/5 text-white hover:bg-white/10'}`}
                    >
                      <Package size={24} />
                      <div className="text-left">
                        <p className="text-xs font-black uppercase tracking-widest">{option.title}</p>
                        <p className={`mt-1 text-[10px] opacity-60 ${purchaseType === option.key ? 'text-emerald-900' : 'text-white/40'}`}>
                          {option.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30">{t('checkout.yourName')}</label>
                  <input required type="text" className="w-full rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-white transition-all focus:border-[#d4af37] focus:outline-none" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30">{t('checkout.contactEmail')}</label>
                  <input required type="email" className="w-full rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-white transition-all focus:border-[#d4af37] focus:outline-none" />
                </div>
                <div className="space-y-3 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30">{t('checkout.deliveryAddress')}</label>
                  <textarea rows={3} className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-white transition-all focus:border-[#d4af37] focus:outline-none" />
                </div>
              </div>

              <div className="space-y-4 rounded-2xl border border-white/5 bg-black/20 p-8">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-white/40">{t('checkout.estimatedInvestment')}</span>
                  <span className="text-2xl text-[#d4af37] serif">{price}</span>
                </div>
                <div className="flex items-center gap-4 border-t border-white/5 pt-4 text-white/20">
                  <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
                    <Truck size={14} /> {t('common.worldwide')}
                  </div>
                  <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
                    <ShieldCheck size={14} /> {t('common.insured')}
                  </div>
                  <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
                    <CreditCard size={14} /> {t('common.secure')}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="group w-full rounded-xl bg-white py-6 text-xs font-black uppercase tracking-[0.4em] text-emerald-950 shadow-2xl transition-all hover:bg-[#d4af37]"
              >
                {t('checkout.confirm')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
