import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Instagram, MapPin, Send, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Acquisition d\'œuvre',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('messages').insert([
      {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      }
    ]);

    if (!error) {
      setSuccess(true);
      setFormData({ name: '', email: '', subject: 'Acquisition d\'œuvre', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } else {
      alert("Erreur lors de l'envoi du message.");
    }
    setLoading(false);
  };

  return (
    <section id="contact" className="py-32 bg-[#fcfcf9]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[#d4af37] uppercase tracking-widest text-xs md:text-sm mb-4 block font-bold">Collaboration & Acquisition</span>
            <h2 className="text-4xl md:text-6xl serif text-emerald-950 mb-8 md:mb-12 leading-tight">
              Entrer dans <br className="hidden md:block" />
              l'univers
            </h2>

            <div className="space-y-10">
              <div className="flex items-start gap-6">
                <div className="p-3 bg-emerald-950 text-white rounded-sm">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-950 uppercase tracking-widest text-xs mb-1">Email</h4>
                  <p className="text-emerald-800/70 font-medium">contact@mariemaudeart.com</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="p-3 bg-emerald-950 text-white rounded-sm">
                  <Instagram size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-950 uppercase tracking-widest text-xs mb-1">Instagram</h4>
                  <p className="text-emerald-800/70 font-medium">@mariemaude_eliacin</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="p-3 bg-emerald-950 text-white rounded-sm">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-950 uppercase tracking-widest text-xs mb-1">Atelier</h4>
                  <p className="text-emerald-800/70 font-medium">Montréal, QC | Port-au-Prince, Haïti</p>
                </div>
              </div>
            </div>

            <div className="mt-16 p-8 bg-[#f5f5f0] border-l-4 border-[#d4af37]">
              <p className="italic text-emerald-900 serif text-lg leading-relaxed">
                "C'est un honneur de partager mon voyage avec vous. Pour toute demande d'acquisition ou de projet spécial, n'hésitez pas à me contacter."
              </p>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8 bg-white p-6 md:p-12 shadow-[0_40px_100px_-20px_rgba(6,78,59,0.15)] rounded-2xl border border-emerald-900/5 relative overflow-hidden contact-form"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-950/40">Nom complet</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Jean Dupont"
                  required
                  className="w-full bg-emerald-50/30 border border-emerald-950/10 rounded-xl py-4 px-5 text-emerald-950 placeholder-emerald-900/30 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-medium"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-950/40">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="votre@email.com"
                  required
                  className="w-full bg-emerald-50/30 border border-emerald-950/10 rounded-xl py-4 px-5 text-emerald-950 placeholder-emerald-900/30 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-medium"
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-950/40">Sujet de la demande</label>
              <select
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                className="w-full bg-emerald-50/30 border border-emerald-950/10 rounded-xl py-4 px-5 text-emerald-950 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-medium appearance-none"
              >
                <option>Acquisition d'œuvre</option>
                <option>Demande de catalogue</option>
                <option>Presse / Collaboration</option>
                <option>Autre</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-950/40">Votre Message</label>
              <textarea
                rows={5}
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                placeholder="Comment pouvons-nous vous aider ?"
                required
                className="w-full bg-emerald-50/30 border border-emerald-950/10 rounded-xl py-4 px-5 text-emerald-950 placeholder-emerald-900/30 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all resize-none font-medium"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-emerald-950 text-[#d4af37] font-black uppercase tracking-[0.3em] text-xs rounded-xl flex items-center justify-center gap-3 hover:bg-emerald-900 hover:scale-[1.01] active:scale-[0.98] transition-all shadow-xl shadow-emerald-950/20 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
              {loading ? 'Envoi...' : 'Envoyer le message'}
            </button>

            {success && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8 z-20">
                <CheckCircle size={64} className="text-emerald-500 mb-4" />
                <h3 className="text-2xl serif text-emerald-950 mb-2">Message Envoyé !</h3>
                <p className="text-emerald-800/60">Nous vous répondrons dans les plus brefs délais.</p>
              </div>
            )}
          </motion.form>

        </div>
      </div>

      <footer className="mt-32 pt-16 border-t border-emerald-900/5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-bold tracking-[0.3em] text-emerald-950/40 uppercase">
          <div>© 2024 Marie Maude Eliacin — MaudelArt</div>
          <div className="flex space-x-8">
            <a href="#" className="hover:text-emerald-600 transition-colors">Mentions Légales</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Confidentialité</a>
          </div>
          <div className="serif italic text-emerald-950 normal-case tracking-normal text-sm lowercase">La beauté sauvera le monde.</div>
        </div>
      </footer>
    </section>
  );
};

export default Contact;
