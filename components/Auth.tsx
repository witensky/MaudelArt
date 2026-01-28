
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Github, Chrome, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { View } from '../App';

interface AuthProps {
  setView: (view: View) => void;
}

const Auth: React.FC<AuthProps> = ({ setView }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;
        // Auto sign in happens, App.tsx listener will handle it
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
      setView('home');
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#041a14] pt-40 pb-20 px-6 flex items-center justify-center relative overflow-hidden">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-400/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-md w-full relative z-10">
        <button
          onClick={() => setView('home')}
          className="mb-8 flex items-center gap-2 text-white/40 hover:text-emerald-400 transition-colors uppercase text-[10px] font-black tracking-widest"
        >
          <ArrowLeft size={14} /> Retour à l'accueil
        </button>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10 shadow-2xl">
          <div className="text-center mb-10">
            <h2 className="text-4xl serif text-white mb-4">
              {mode === 'login' ? 'Bienvenue' : 'Nous rejoindre'}
            </h2>
            <p className="text-white/40 text-sm">
              {mode === 'login' ? 'Accédez à votre collection privée.' : 'Créez un compte pour collectionner l\'art.'}
            </p>
            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-xs">
                {error}
              </div>
            )}
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-white/5 rounded-2xl p-1 mb-10">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'login' ? 'bg-emerald-500 text-emerald-950' : 'text-white/40 hover:text-white'}`}
            >
              Connexion
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'signup' ? 'bg-emerald-500 text-emerald-950' : 'text-white/40 hover:text-white'}`}
            >
              Inscription
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleAuth}>
            <AnimatePresence mode="wait">
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input
                      type="text"
                      placeholder="Nom complet"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input
                type="email"
                placeholder="Adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-emerald-500 text-emerald-950 font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl shadow-emerald-500/20 hover:bg-emerald-400 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="animate-spin" size={16} />}
              {mode === 'login' ? 'Se connecter' : 'Créer un compte'}
            </button>
          </form>

          {/* Social Auth Divider */}
          <div className="flex items-center gap-4 my-10">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Ou</span>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          <button
            type="button"
            onClick={async () => {
              try {
                const { error } = await supabase.auth.signInWithOAuth({
                  provider: 'google',
                  options: {
                    redirectTo: `${window.location.origin}/`
                  }
                });
                if (error) throw error;
              } catch (err: any) {
                setError(err.message);
              }
            }}
            className="w-full flex items-center justify-center gap-3 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            <Chrome size={16} /> Continuer avec Google
          </button>
        </div>

        <p className="mt-8 text-center text-[10px] text-white/20 uppercase tracking-widest font-black">
          En continuant, vous acceptez nos <a href="#" className="text-emerald-500 hover:underline">conditions d'utilisation</a>.
        </p>
      </div>
    </div >
  );
};

export default Auth;
