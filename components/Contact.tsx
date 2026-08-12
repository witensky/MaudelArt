import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Instagram, Loader2, Mail, MapPin, Send } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../supabaseClient';

type SubjectKey = 'acquisition' | 'catalog' | 'press' | 'other';

const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'acquisition' as SubjectKey,
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const subjectOptions = useMemo<{ key: SubjectKey; label: string }[]>(() => ([
    { key: 'acquisition', label: t('contact.subjects.acquisition') },
    { key: 'catalog', label: t('contact.subjects.catalog') },
    { key: 'press', label: t('contact.subjects.press') },
    { key: 'other', label: t('contact.subjects.other') },
  ]), [t]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const selectedSubject = subjectOptions.find((option) => option.key === formData.subject)?.label || t('contact.subjects.acquisition');
    const { error } = await supabase.from('messages').insert([
      {
        name: formData.name,
        email: formData.email,
        subject: selectedSubject,
        message: formData.message,
      },
    ]);

    if (!error) {
      setSuccess(true);
      setFormData({ name: '', email: '', subject: 'acquisition', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } else {
      alert(t('contact.error'));
    }

    setLoading(false);
  };

  return (
    <section id="contact" className="bg-[#fcfcf9] py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-24 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="mb-4 block text-xs font-bold uppercase tracking-widest text-[#d4af37] md:text-sm">
              {t('contact.titleLabel')}
            </span>
            <h2 className="mb-8 text-4xl leading-tight text-emerald-950 md:mb-12 md:text-6xl serif">
              {t('contact.title')}
            </h2>

            <div className="space-y-10">
              {[
                { Icon: Mail, title: t('contact.email'), value: 'contact@mariemaudeart.com' },
                { Icon: Instagram, title: 'Instagram', value: '@mariemaude_eliacin' },
                { Icon: MapPin, title: t('contact.workshop'), value: 'Montreal, QC | Port-au-Prince, Haiti' },
              ].map(({ Icon, title, value }) => (
                <div key={title} className="flex items-start gap-6">
                  <div className="rounded-sm bg-emerald-950 p-3 text-white">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h4 className="mb-1 text-xs font-bold uppercase tracking-widest text-emerald-950">{title}</h4>
                    <p className="font-medium text-emerald-800/70">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 border-l-4 border-[#d4af37] bg-[#f5f5f0] p-8">
              <p className="text-lg italic leading-relaxed text-emerald-900 serif">
                {t('contact.quote')}
              </p>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="contact-form relative space-y-8 overflow-hidden rounded-2xl border border-emerald-900/5 bg-white p-6 shadow-[0_40px_100px_-20px_rgba(6,78,59,0.15)] md:p-12"
          >
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-950/40">
                  {t('contact.fullName')}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                  placeholder={t('contact.fullNamePlaceholder')}
                  required
                  className="w-full rounded-xl border border-emerald-950/10 bg-emerald-50/30 px-5 py-4 font-medium text-emerald-950 outline-none transition-all placeholder:text-emerald-900/30 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-950/40">
                  {t('contact.email')}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                  placeholder={t('contact.emailPlaceholder')}
                  required
                  className="w-full rounded-xl border border-emerald-950/10 bg-emerald-50/30 px-5 py-4 font-medium text-emerald-950 outline-none transition-all placeholder:text-emerald-900/30 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-950/40">
                {t('contact.subject')}
              </label>
              <select
                value={formData.subject}
                onChange={(event) => setFormData({ ...formData, subject: event.target.value as SubjectKey })}
                className="w-full appearance-none rounded-xl border border-emerald-950/10 bg-emerald-50/30 px-5 py-4 font-medium text-emerald-950 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5"
              >
                {subjectOptions.map((option) => (
                  <option key={option.key} value={option.key}>{option.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-950/40">
                {t('contact.message')}
              </label>
              <textarea
                rows={5}
                value={formData.message}
                onChange={(event) => setFormData({ ...formData, message: event.target.value })}
                placeholder={t('contact.messagePlaceholder')}
                required
                className="w-full resize-none rounded-xl border border-emerald-950/10 bg-emerald-50/30 px-5 py-4 font-medium text-emerald-950 outline-none transition-all placeholder:text-emerald-900/30 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-3 rounded-xl bg-emerald-950 py-5 text-xs font-black uppercase tracking-[0.3em] text-[#d4af37] shadow-xl shadow-emerald-950/20 transition-all hover:scale-[1.01] hover:bg-emerald-900 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Send size={16} className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              )}
              {loading ? t('contact.sending') : t('contact.send')}
            </button>

            {success && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/95 p-8 text-center backdrop-blur-sm">
                <CheckCircle size={64} className="mb-4 text-emerald-500" />
                <h3 className="mb-2 text-2xl text-emerald-950 serif">{t('contact.sentTitle')}</h3>
                <p className="text-emerald-800/60">{t('contact.sentDescription')}</p>
              </div>
            )}
          </motion.form>
        </div>
      </div>

      <footer className="mt-32 border-t border-emerald-900/5 px-6 pt-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-950/40 md:flex-row">
          <div>{t('home.copyright')}</div>
          <div className="flex space-x-8">
            <a href="/mentions-legales" className="transition-colors hover:text-emerald-600">{t('common.legal')}</a>
            <a href="/confidentialite" className="transition-colors hover:text-emerald-600">{t('common.privacy')}</a>
          </div>
          <div className="text-sm lowercase tracking-normal text-emerald-950 italic normal-case serif">
            {t('common.beauty')}
          </div>
        </div>
      </footer>
    </section>
  );
};

export default Contact;
