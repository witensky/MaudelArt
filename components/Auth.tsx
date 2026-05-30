import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Chrome, Loader2, Lock, Mail, User } from 'lucide-react';
<<<<<<< HEAD
import { NavigationOptions, View } from '../App';
import { useI18n } from '../i18n/I18nContext';
=======
import { View } from '../App';
import { useLanguage } from '../contexts/LanguageContext';
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
import { supabase } from '../supabaseClient';

interface AuthProps {
  navigateTo: (view: View, options?: NavigationOptions) => void;
}

<<<<<<< HEAD
const Auth: React.FC<AuthProps> = ({ navigateTo }) => {
  const { messages } = useI18n();
=======
const Auth: React.FC<AuthProps> = ({ setView }) => {
  const { t } = useLanguage();
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
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

<<<<<<< HEAD
      navigateTo('home');
    } catch (caughtError: any) {
      setError(caughtError.message || messages.auth.defaultError);
=======
      setView('home');
    } catch (err: any) {
      setError(err.message || t('auth.defaultError'));
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-[#041a14] pt-40 pb-20 px-6 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-400/5 blur-[120px] rounded-full" />
=======
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#041a14] px-6 pb-20 pt-40">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[-10%] top-[-10%] h-[600px] w-[600px] rounded-full bg-emerald-500/10 blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-emerald-400/5 blur-[120px]" />
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
      </div>

      <div className="relative z-10 w-full max-w-md">
        <button
<<<<<<< HEAD
          onClick={() => navigateTo('home')}
          className="mb-8 flex items-center gap-2 text-white/40 hover:text-emerald-400 transition-colors uppercase text-[10px] font-black tracking-widest"
        >
          <ArrowLeft size={14} /> {messages.auth.backHome}
        </button>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10 shadow-2xl">
          <div className="text-center mb-10">
            <h2 className="text-4xl serif text-white mb-4">{mode === 'login' ? messages.auth.loginTitle : messages.auth.signupTitle}</h2>
            <p className="text-white/40 text-sm">{mode === 'login' ? messages.auth.loginSubtitle : messages.auth.signupSubtitle}</p>
=======
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
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
            {error && (
              <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-200">
                {error}
              </div>
            )}
          </div>

<<<<<<< HEAD
          <div className="flex bg-white/5 rounded-2xl p-1 mb-10">
=======
          <div className="mb-10 flex rounded-2xl bg-white/5 p-1">
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
            <button
              onClick={() => setMode('login')}
              className={`flex-1 rounded-xl py-3 text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'login' ? 'bg-emerald-500 text-emerald-950' : 'text-white/40 hover:text-white'}`}
            >
<<<<<<< HEAD
              {messages.auth.loginTab}
=======
              {t('auth.login')}
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 rounded-xl py-3 text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'signup' ? 'bg-emerald-500 text-emerald-950' : 'text-white/40 hover:text-white'}`}
            >
<<<<<<< HEAD
              {messages.auth.signupTab}
=======
              {t('auth.signup')}
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
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
<<<<<<< HEAD
                      placeholder={messages.auth.fullName}
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
=======
                      placeholder={t('auth.fullName')}
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-6 text-sm text-white transition-all focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input
                type="email"
<<<<<<< HEAD
                placeholder={messages.auth.email}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
=======
                placeholder={t('auth.email')}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-6 text-sm text-white transition-all focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input
                type="password"
<<<<<<< HEAD
                placeholder={messages.auth.password}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
=======
                placeholder={t('auth.password')}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-6 text-sm text-white transition-all focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-4 text-[11px] font-black uppercase tracking-widest text-emerald-950 shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] hover:bg-emerald-400"
            >
              {loading && <Loader2 className="animate-spin" size={16} />}
<<<<<<< HEAD
              {mode === 'login' ? messages.auth.signIn : messages.auth.signUp}
            </button>
          </form>

          <div className="flex items-center gap-4 my-10">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{messages.auth.or}</span>
            <div className="h-px bg-white/10 flex-1" />
=======
              {mode === 'login' ? t('auth.signIn') : t('auth.createAccount')}
            </button>
          </form>

          <div className="my-10 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{t('auth.or')}</span>
            <div className="h-px flex-1 bg-white/10" />
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
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
<<<<<<< HEAD
              } catch (caughtError: any) {
                setError(caughtError.message);
=======
              } catch (err: any) {
                setError(err.message || t('auth.defaultError'));
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
              }
            }}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 py-3 text-[10px] font-black uppercase text-white/60 transition-all hover:bg-white/10 hover:text-white"
          >
<<<<<<< HEAD
            <Chrome size={16} /> {messages.auth.continueWithGoogle}
          </button>
        </div>

        <p className="mt-8 text-center text-[10px] text-white/20 uppercase tracking-widest font-black">
          {messages.auth.terms}
=======
            <Chrome size={16} />
            {t('auth.continueWithGoogle')}
          </button>
        </div>

        <p className="mt-8 text-center text-[10px] font-black uppercase tracking-widest text-white/20">
          {t('auth.termsPrefix')}
          <a href="#" className="text-emerald-500 hover:underline">{t('auth.termsLink')}</a>
          {t('auth.termsSuffix')}
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
        </p>
      </div>
    </div>
  );
};

export default Auth;
