<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Instagram, Loader2, Mail, MapPin, Send } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { supabase } from '../supabaseClient';

const subjectKeys = ['acquisition', 'catalogue', 'press', 'other'] as const;
type SubjectKey = typeof subjectKeys[number];

const Contact: React.FC = () => {
  const { messages } = useI18n();
=======
import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Instagram, Loader2, Mail, MapPin, Send } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../supabaseClient';

type SubjectKey = 'acquisition' | 'catalog' | 'press' | 'other';

const Contact: React.FC = () => {
  const { t } = useLanguage();
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'acquisition' as SubjectKey,
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

<<<<<<< HEAD
  useEffect(() => {
    if (!subjectKeys.includes(formData.subject)) {
      setFormData((current) => ({ ...current, subject: 'acquisition' }));
    }
  }, [formData.subject]);
=======
  const subjectOptions = useMemo<{ key: SubjectKey; label: string }[]>(() => ([
    { key: 'acquisition', label: t('contact.subjects.acquisition') },
    { key: 'catalog', label: t('contact.subjects.catalog') },
    { key: 'press', label: t('contact.subjects.press') },
    { key: 'other', label: t('contact.subjects.other') },
  ]), [t]);
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

<<<<<<< HEAD
    const subjectIndex = subjectKeys.indexOf(formData.subject);
    const subjectLabel = messages.contact.subjects[subjectIndex] || messages.contact.subjects[0];

=======
    const selectedSubject = subjectOptions.find((option) => option.key === formData.subject)?.label || t('contact.subjects.acquisition');
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
    const { error } = await supabase.from('messages').insert([
      {
        name: formData.name,
        email: formData.email,
<<<<<<< HEAD
        subject: subjectLabel,
=======
        subject: selectedSubject,
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
        message: formData.message,
      },
    ]);

    if (!error) {
      setSuccess(true);
      setFormData({ name: '', email: '', subject: 'acquisition', message: '' });
<<<<<<< HEAD
      window.setTimeout(() => setSuccess(false), 5000);
    } else {
      alert(messages.contact.error);
=======
      setTimeout(() => setSuccess(false), 5000);
    } else {
      alert(t('contact.error'));
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
    }

    setLoading(false);
  };

  return (
<<<<<<< HEAD
    <section id="contact" className="py-32 bg-[#fcfcf9]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
=======
    <section id="contact" className="bg-[#fcfcf9] py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-24 lg:grid-cols-2">
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
<<<<<<< HEAD
            <span className="text-[#d4af37] uppercase tracking-widest text-xs md:text-sm mb-4 block font-bold">{messages.contact.badge}</span>
            <h2 className="text-4xl md:text-6xl serif text-emerald-950 mb-8 md:mb-12 leading-tight">
              {messages.contact.title}
=======
            <span className="mb-4 block text-xs font-bold uppercase tracking-widest text-[#d4af37] md:text-sm">
              {t('contact.titleLabel')}
            </span>
            <h2 className="mb-8 text-4xl leading-tight text-emerald-950 md:mb-12 md:text-6xl serif">
              {t('contact.title')}
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
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
<<<<<<< HEAD
                <div>
                  <h4 className="font-bold text-emerald-950 uppercase tracking-widest text-xs mb-1">{messages.contact.email}</h4>
                  <p className="text-emerald-800/70 font-medium">contact@mariemaudeart.com</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="p-3 bg-emerald-950 text-white rounded-sm">
                  <Instagram size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-950 uppercase tracking-widest text-xs mb-1">{messages.contact.instagram}</h4>
                  <p className="text-emerald-800/70 font-medium">@mariemaude_eliacin</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="p-3 bg-emerald-950 text-white rounded-sm">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-950 uppercase tracking-widest text-xs mb-1">{messages.contact.studio}</h4>
                  <p className="text-emerald-800/70 font-medium">Montreal, QC | Port-au-Prince, Haiti</p>
                </div>
              </div>
            </div>

            <div className="mt-16 p-8 bg-[#f5f5f0] border-l-4 border-[#d4af37]">
              <p className="italic text-emerald-900 serif text-lg leading-relaxed">{messages.contact.quote}</p>
=======
              ))}
            </div>

            <div className="mt-16 border-l-4 border-[#d4af37] bg-[#f5f5f0] p-8">
              <p className="text-lg italic leading-relaxed text-emerald-900 serif">
                {t('contact.quote')}
              </p>
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
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
<<<<<<< HEAD
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-950/40">{messages.contact.fullName}</label>
=======
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-950/40">
                  {t('contact.fullName')}
                </label>
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
                <input
                  type="text"
                  value={formData.name}
                  onChange={(event) => setFormData({ ...formData, name: event.target.value })}
<<<<<<< HEAD
                  placeholder={messages.contact.namePlaceholder}
=======
                  placeholder={t('contact.fullNamePlaceholder')}
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
                  required
                  className="w-full rounded-xl border border-emerald-950/10 bg-emerald-50/30 px-5 py-4 font-medium text-emerald-950 outline-none transition-all placeholder:text-emerald-900/30 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5"
                />
              </div>
              <div className="space-y-3">
<<<<<<< HEAD
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-950/40">{messages.contact.emailLabel}</label>
=======
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-950/40">
                  {t('contact.email')}
                </label>
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) => setFormData({ ...formData, email: event.target.value })}
<<<<<<< HEAD
                  placeholder={messages.contact.emailPlaceholder}
=======
                  placeholder={t('contact.emailPlaceholder')}
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
                  required
                  className="w-full rounded-xl border border-emerald-950/10 bg-emerald-50/30 px-5 py-4 font-medium text-emerald-950 outline-none transition-all placeholder:text-emerald-900/30 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5"
                />
              </div>
            </div>

            <div className="space-y-3">
<<<<<<< HEAD
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-950/40">{messages.contact.subject}</label>
              <select
                value={formData.subject}
                onChange={(event) => setFormData({ ...formData, subject: event.target.value as SubjectKey })}
                className="w-full bg-emerald-50/30 border border-emerald-950/10 rounded-xl py-4 px-5 text-emerald-950 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-medium appearance-none"
              >
                {messages.contact.subjects.map((label, index) => (
                  <option key={subjectKeys[index]} value={subjectKeys[index]}>
                    {label}
                  </option>
=======
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
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
                ))}
              </select>
            </div>

            <div className="space-y-3">
<<<<<<< HEAD
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-950/40">{messages.contact.message}</label>
=======
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-950/40">
                {t('contact.message')}
              </label>
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
              <textarea
                rows={5}
                value={formData.message}
                onChange={(event) => setFormData({ ...formData, message: event.target.value })}
<<<<<<< HEAD
                placeholder={messages.contact.messagePlaceholder}
                required
                className="w-full bg-emerald-50/30 border border-emerald-950/10 rounded-xl py-4 px-5 text-emerald-950 placeholder-emerald-900/30 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all resize-none font-medium"
=======
                placeholder={t('contact.messagePlaceholder')}
                required
                className="w-full resize-none rounded-xl border border-emerald-950/10 bg-emerald-50/30 px-5 py-4 font-medium text-emerald-950 outline-none transition-all placeholder:text-emerald-900/30 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5"
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-3 rounded-xl bg-emerald-950 py-5 text-xs font-black uppercase tracking-[0.3em] text-[#d4af37] shadow-xl shadow-emerald-950/20 transition-all hover:scale-[1.01] hover:bg-emerald-900 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
<<<<<<< HEAD
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
              {loading ? messages.contact.sending : messages.contact.send}
            </button>

            {success && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8 z-20">
                <CheckCircle size={64} className="text-emerald-500 mb-4" />
                <h3 className="text-2xl serif text-emerald-950 mb-2">{messages.contact.successTitle}</h3>
                <p className="text-emerald-800/60">{messages.contact.successText}</p>
=======
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
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
              </div>
            )}
          </motion.form>
        </div>
      </div>

<<<<<<< HEAD
      <footer className="mt-32 pt-16 border-t border-emerald-900/5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-bold tracking-[0.3em] text-emerald-950/40 uppercase">
          <div>{messages.footer.copyright}</div>
          <div className="flex space-x-8">
            <a href="#" className="hover:text-emerald-600 transition-colors">{messages.footer.legal}</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">{messages.footer.privacy}</a>
          </div>
          <div className="serif italic text-emerald-950 normal-case tracking-normal text-sm lowercase">{messages.footer.motto}</div>
=======
      <footer className="mt-32 border-t border-emerald-900/5 px-6 pt-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-950/40 md:flex-row">
          <div>{t('home.copyright')}</div>
          <div className="flex space-x-8">
            <a href="#" className="transition-colors hover:text-emerald-600">{t('common.legal')}</a>
            <a href="#" className="transition-colors hover:text-emerald-600">{t('common.privacy')}</a>
          </div>
          <div className="text-sm lowercase tracking-normal text-emerald-950 italic normal-case serif">
            {t('common.beauty')}
          </div>
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
        </div>
      </footer>
    </section>
  );
};

export default Contact;
