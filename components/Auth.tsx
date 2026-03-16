import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Chrome, Loader2, Lock, Mail, User } from 'lucide-react';
import { View } from '../App';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../supabaseClient';

interface AuthProps {
  setView: (view: View) => void;
}

const Auth: React.FC<AuthProps> = ({ setView }) => {
  const { t } = useLanguage();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        if (signUpError) {
          throw signUpError;
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

        if (signInError) {
          throw signInError;
        }
      }

      setView('home');
    } catch (err: any) {
      setError(err.message || t('auth.defaultError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#041a14] px-6 pb-20 pt-40">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[-10%] top-[-10%] h-[600px] w-[600px] rounded-full bg-emerald-500/10 blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-emerald-400/5 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <button
          onClick={() => setView('home')}
          className="mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 transition-colors hover:text-emerald-400"
        >
          <ArrowLeft size={14} />
          {t('auth.backHome')}
        </button>

        <div className="rounded-[40px] border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-2xl">
          <div className="mb-10 text-center">
            <h2 className="mb-4 text-4xl text-white serif">
              {mode === 'login' ? t('auth.welcome') : t('auth.join')}
            </h2>
            <p className="text-sm text-white/40">
              {mode === 'login' ? t('auth.welcomeDescription') : t('auth.joinDescription')}
            </p>
            {error && (
              <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-200">
                {error}
              </div>
            )}
          </div>

          <div className="mb-10 flex rounded-2xl bg-white/5 p-1">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 rounded-xl py-3 text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'login' ? 'bg-emerald-500 text-emerald-950' : 'text-white/40 hover:text-white'}`}
            >
              {t('auth.login')}
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 rounded-xl py-3 text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'signup' ? 'bg-emerald-500 text-emerald-950' : 'text-white/40 hover:text-white'}`}
            >
              {t('auth.signup')}
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
                      placeholder={t('auth.fullName')}
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-6 text-sm text-white transition-all focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input
                type="email"
                placeholder={t('auth.email')}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-6 text-sm text-white transition-all focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input
                type="password"
                placeholder={t('auth.password')}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-6 text-sm text-white transition-all focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-4 text-[11px] font-black uppercase tracking-widest text-emerald-950 shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] hover:bg-emerald-400"
            >
              {loading && <Loader2 className="animate-spin" size={16} />}
              {mode === 'login' ? t('auth.signIn') : t('auth.createAccount')}
            </button>
          </form>

          <div className="my-10 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{t('auth.or')}</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <button
            type="button"
            onClick={async () => {
              try {
                const { error: oauthError } = await supabase.auth.signInWithOAuth({
                  provider: 'google',
                  options: {
                    redirectTo: `${window.location.origin}/`,
                  },
                });

                if (oauthError) {
                  throw oauthError;
                }
              } catch (err: any) {
                setError(err.message || t('auth.defaultError'));
              }
            }}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 py-3 text-[10px] font-black uppercase text-white/60 transition-all hover:bg-white/10 hover:text-white"
          >
            <Chrome size={16} />
            {t('auth.continueWithGoogle')}
          </button>
        </div>

        <p className="mt-8 text-center text-[10px] font-black uppercase tracking-widest text-white/20">
          {t('auth.termsPrefix')}
          <a href="#" className="text-emerald-500 hover:underline">{t('auth.termsLink')}</a>
          {t('auth.termsSuffix')}
        </p>
      </div>
    </div>
  );
};

export default Auth;
