import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Clock, Loader2, Mail, Save, Shield, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../supabaseClient';

const Profile: React.FC = () => {
  const { language, t } = useLanguage();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          return;
        }

        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();

        if (data) {
          setProfile({ ...data, email: user.email, user_metadata: user.user_metadata });
          setFullName(user.user_metadata?.full_name || '');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, []);

  const updateProfile = async () => {
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName },
      });

      if (error) {
        throw error;
      }

      setProfile((previous: any) => previous ? {
        ...previous,
        user_metadata: {
          ...previous.user_metadata,
          full_name: fullName,
        },
      } : previous);
      setEditing(false);
    } catch (error: any) {
      alert(t('profile.updateError', { message: error.message }));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen justify-center bg-[#041a14] pt-40 text-emerald-500">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#041a14] px-6 pb-20 pt-40">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-white/5 bg-[#020d0a] p-8 shadow-2xl md:p-12"
        >
          <div className="absolute right-0 top-0 -z-10 h-[400px] w-[400px] rounded-full bg-emerald-500/5 blur-[100px]" />

          <div className="flex flex-col items-start gap-12 md:flex-row">
            <div className="flex w-full flex-col items-center md:w-1/3">
              <div className="group relative">
                <div className="h-40 w-40 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-900 p-1">
                  <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#041a14]">
                    <span className="text-6xl font-bold text-emerald-500 font-serif">
                      {profile?.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <button className="absolute bottom-2 right-2 rounded-full bg-[#d4af37] p-3 text-emerald-950 shadow-lg transition-transform hover:scale-110">
                  <Camera size={18} />
                </button>
              </div>

              <div className="mt-6 text-center">
                <span className={`rounded-full border px-4 py-1.5 text-[10px] font-black uppercase tracking-widest ${profile?.role === 'admin' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 'border-white/10 bg-white/5 text-white/40'}`}>
                  {profile?.role === 'admin' ? t('profile.admin') : t('profile.collector')}
                </span>
              </div>
            </div>

            <div className="w-full space-y-8 md:w-2/3">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="mb-2 text-3xl text-white md:text-4xl serif">{t('profile.title')}</h2>
                  <p className="text-sm text-white/40">{t('profile.description')}</p>
                </div>
                <button
                  onClick={() => (editing ? updateProfile() : setEditing(true))}
                  disabled={saving}
                  className={`flex items-center gap-2 rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all ${editing ? 'bg-[#d4af37] text-emerald-950 hover:bg-white' : 'bg-white text-emerald-950 hover:bg-gray-200'}`}
                >
                  {saving && <Loader2 className="animate-spin" size={14} />}
                  {editing ? (saving ? t('profile.editing') : <><Save size={16} /> {t('profile.save')}</>) : t('profile.edit')}
                </button>
              </div>

              <div className="space-y-6 rounded-2xl border border-white/5 bg-white/5 p-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37]">
                    {t('profile.fullName')}
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input
                      type="text"
                      disabled={!editing}
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      className={`w-full rounded-xl border bg-[#041a14] py-4 pl-12 pr-4 text-white transition-all focus:outline-none ${editing ? 'border-emerald-500/50 focus:border-emerald-500' : 'cursor-not-allowed border-white/5 text-white/50'}`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37]">
                    {t('profile.email')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input
                      type="email"
                      disabled
                      value={profile?.email || ''}
                      className="w-full cursor-not-allowed rounded-xl border border-white/5 bg-[#041a14] py-4 pl-12 pr-4 text-white/50"
                    />
                  </div>
                  <p className="pl-1 text-[10px] italic text-white/20">{t('profile.emailLocked')}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-6">
                  <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-400">
                    <Shield size={20} />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-white">{t('profile.secureAccount')}</span>
                    <span className="text-[10px] text-white/40">{t('profile.strongAuth')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-6">
                  <div className="rounded-lg bg-blue-500/10 p-3 text-blue-400">
                    <Clock size={20} />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-white">{t('profile.memberSince')}</span>
                    <span className="text-[10px] text-white/40">
                      {profile?.created_at ? new Date(profile.created_at).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US') : '-'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Profile;
