import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Chrome, Loader2, Lock, Mail, User } from 'lucide-react';
import { NavigationOptions, View } from '../App';
import { useI18n } from '../i18n/I18nContext';
import { supabase } from '../supabaseClient';

interface AuthProps {
  navigateTo: (view: View, options?: NavigationOptions) => void;
}

const Auth: React.FC<AuthProps> = ({ navigateTo }) => {
  const { messages } = useI18n();
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

      navigateTo('home');
    } catch (caughtError: any) {
      setError(caughtError.message || messages.auth.defaultError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#041a14] pt-40 pb-20 px-6 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-400/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-md w-full relative z-10">
        <button
          onClick={() => navigateTo('home')}
          className="mb-8 flex items-center gap-2 text-white/40 hover:text-emerald-400 transition-colors uppercase text-[10px] font-black tracking-widest"
        >
          <ArrowLeft size={14} /> {messages.auth.backHome}
        </button>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10 shadow-2xl">
          <div className="text-center mb-10">
            <h2 className="text-4xl serif text-white mb-4">{mode === 'login' ? messages.auth.loginTitle : messages.auth.signupTitle}</h2>
            <p className="text-white/40 text-sm">{mode === 'login' ? messages.auth.loginSubtitle : messages.auth.signupSubtitle}</p>
            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-xs">
                {error}
              </div>
            )}
          </div>

          <div className="flex bg-white/5 rounded-2xl p-1 mb-10">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'login' ? 'bg-emerald-500 text-emerald-950' : 'text-white/40 hover:text-white'}`}
            >
              {messages.auth.loginTab}
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'signup' ? 'bg-emerald-500 text-emerald-950' : 'text-white/40 hover:text-white'}`}
            >
              {messages.auth.signupTab}
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
                      placeholder={messages.auth.fullName}
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
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
                placeholder={messages.auth.email}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input
                type="password"
                placeholder={messages.auth.password}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-emerald-500 text-emerald-950 font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl shadow-emerald-500/20 hover:bg-emerald-400 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="animate-spin" size={16} />}
              {mode === 'login' ? messages.auth.signIn : messages.auth.signUp}
            </button>
          </form>

          <div className="flex items-center gap-4 my-10">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{messages.auth.or}</span>
            <div className="h-px bg-white/10 flex-1" />
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
              } catch (caughtError: any) {
                setError(caughtError.message);
              }
            }}
            className="w-full flex items-center justify-center gap-3 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            <Chrome size={16} /> {messages.auth.continueWithGoogle}
          </button>
        </div>

        <p className="mt-8 text-center text-[10px] text-white/20 uppercase tracking-widest font-black">
          {messages.auth.terms}
        </p>
      </div>
    </div>
  );
};

export default Auth;
