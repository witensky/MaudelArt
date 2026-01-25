import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Clock, Camera, Save, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';

const Profile: React.FC = () => {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [fullName, setFullName] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        getProfile();
    }, []);

    const getProfile = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

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

    const updateProfile = async () => {
        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Update auth metadata
            const { error: authError } = await supabase.auth.updateUser({
                data: { full_name: fullName }
            });

            if (authError) throw authError;

            // Refresh local state
            await getProfile();
            setEditing(false);
        } catch (error: any) {
            alert('Erreur: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#041a14] pt-40 flex justify-center text-emerald-500">
            <Loader2 className="animate-spin" size={40} />
        </div>
    );

    return (
        <section className="min-h-screen bg-[#041a14] pt-40 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#020d0a] border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
                >
                    {/* Background Ambience */}
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full -z-10" />

                    <div className="flex flex-col md:flex-row gap-12 items-start">
                        {/* Avatar Section */}
                        <div className="w-full md:w-1/3 flex flex-col items-center">
                            <div className="relative group">
                                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-900 p-1">
                                    <div className="w-full h-full rounded-full bg-[#041a14] flex items-center justify-center overflow-hidden relative">
                                        <span className="text-6xl font-serif text-emerald-500 font-bold">
                                            {profile?.email?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <button className="absolute bottom-2 right-2 p-3 bg-[#d4af37] text-emerald-950 rounded-full shadow-lg hover:scale-110 transition-transform">
                                    <Camera size={18} />
                                </button>
                            </div>
                            <div className="mt-6 text-center">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${profile?.role === 'admin'
                                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                        : 'bg-white/5 border-white/10 text-white/40'
                                    }`}>
                                    {profile?.role === 'admin' ? 'Administrateur' : 'Collectionneur'}
                                </span>
                            </div>
                        </div>

                        {/* Info Section */}
                        <div className="w-full md:w-2/3 space-y-8">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-3xl md:text-4xl serif text-white mb-2">Mon Profil</h2>
                                    <p className="text-white/40 text-sm">Gérez vos informations personnelles et vos préférences.</p>
                                </div>
                                <button
                                    onClick={() => editing ? updateProfile() : setEditing(true)}
                                    disabled={saving}
                                    className={`px-6 py-3 rounded-xl text-emerald-950 font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${editing ? 'bg-[#d4af37] hover:bg-white' : 'bg-white text-emerald-950 hover:bg-gray-200'
                                        }`}
                                >
                                    {saving && <Loader2 className="animate-spin" size={14} />}
                                    {editing ? (saving ? 'Enregistrement...' : <><Save size={16} /> Enregistrer</>) : 'Modifier'}
                                </button>
                            </div>

                            <div className="space-y-6 bg-white/5 p-8 rounded-2xl border border-white/5">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-[#d4af37] font-bold">Nom Complet</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                        <input
                                            type="text"
                                            disabled={!editing}
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className={`w-full bg-[#041a14] border rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none transition-all ${editing
                                                    ? 'border-emerald-500/50 focus:border-emerald-500'
                                                    : 'border-white/5 text-white/50 cursor-not-allowed'
                                                }`}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-[#d4af37] font-bold">Adresse Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                        <input
                                            type="email"
                                            disabled
                                            value={profile?.email || ''}
                                            className="w-full bg-[#041a14] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white/50 cursor-not-allowed"
                                        />
                                    </div>
                                    <p className="text-[10px] text-white/20 italic pl-1">L'adresse email ne peut pas être modifiée.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-6 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
                                    <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400"><Shield size={20} /></div>
                                    <div>
                                        <span className="block text-white text-sm font-bold">Compte Sécurisé</span>
                                        <span className="text-[10px] text-white/40">Authentification forte active</span>
                                    </div>
                                </div>
                                <div className="p-6 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
                                    <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400"><Clock size={20} /></div>
                                    <div>
                                        <span className="block text-white text-sm font-bold">Membre depuis</span>
                                        <span className="text-[10px] text-white/40">
                                            {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '-'}
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
