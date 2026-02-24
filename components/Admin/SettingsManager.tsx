import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Save, Loader2, Globe, Mail, Instagram, Facebook, Twitter, MapPin, CheckCircle } from 'lucide-react';

const inputClass = "w-full bg-[#fcfcf9] border border-gray-200 rounded-xl p-4 text-emerald-950 font-medium focus:border-emerald-500 outline-none transition-colors";
const labelClass = "text-[10px] uppercase tracking-widest font-black";

interface SiteSettings {
    site_name: string;
    email_address: string;
    address: string;
    footer_text: string;
    instagram_url: string;
    facebook_url: string;
    twitter_url: string;
    hero_video_url: string;
}

const DEFAULT: SiteSettings = {
    site_name: 'MaudelArt',
    email_address: 'contact@mariemaudeart.com',
    address: 'Montréal, QC | Port-au-Prince, Haïti',
    footer_text: 'La beauté sauvera le monde.',
    instagram_url: 'https://www.instagram.com/mariemaude_eliacin/',
    facebook_url: 'https://www.facebook.com/mariemaudeeliacin',
    twitter_url: 'https://twitter.com/mariemaudelart',
    hero_video_url: '',
};

export const SettingsManager = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [settings, setSettings] = useState<SiteSettings>(DEFAULT);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        const { data } = await supabase.from('site_settings').select('*').single();
        if (data) {
            setSettings({
                site_name: data.site_name || DEFAULT.site_name,
                email_address: data.email_address || DEFAULT.email_address,
                address: data.address || DEFAULT.address,
                footer_text: data.footer_text || DEFAULT.footer_text,
                instagram_url: data.instagram_url || DEFAULT.instagram_url,
                facebook_url: data.facebook_url || DEFAULT.facebook_url,
                twitter_url: data.twitter_url || DEFAULT.twitter_url,
                hero_video_url: data.hero_video_url || '',
            });
        }
        setLoading(false);
    };

    const set = (field: keyof SiteSettings) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setSettings(prev => ({ ...prev, [field]: e.target.value }));

    const handleSave = async () => {
        setSaving(true);
        await supabase.from('site_settings').upsert({ id: 1, ...settings });
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[300px]">
            <Loader2 className="animate-spin text-emerald-600" size={32} />
        </div>
    );

    return (
        <div className="space-y-10 max-w-4xl">
            <div>
                <h2 className="text-4xl font-serif text-emerald-950 font-bold mb-2">Paramètres du Site</h2>
                <p className="text-gray-500 font-medium">Configuration globale, réseaux sociaux et liens du site.</p>
            </div>

            {/* General Info */}
            <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm space-y-8">
                <h3 className="text-sm font-black uppercase tracking-widest text-emerald-900/50">Informations Générales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-emerald-600 mb-1">
                            <Globe size={15} />
                            <label className={labelClass}>Nom du Site</label>
                        </div>
                        <input value={settings.site_name} onChange={set('site_name')} className={inputClass} />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-emerald-600 mb-1">
                            <Mail size={15} />
                            <label className={labelClass}>Email de Contact</label>
                        </div>
                        <input type="email" value={settings.email_address} onChange={set('email_address')} className={inputClass} placeholder="contact@example.com" />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <div className="flex items-center gap-2 text-emerald-600 mb-1">
                            <MapPin size={15} />
                            <label className={labelClass}>Localisation</label>
                        </div>
                        <input value={settings.address} onChange={set('address')} className={inputClass} placeholder="Ville, Pays" />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className={`${labelClass} text-emerald-900/40 block mb-1`}>Texte du Footer (Slogan)</label>
                        <input value={settings.footer_text} onChange={set('footer_text')} className={`${inputClass} italic`} placeholder="La beauté sauvera le monde." />
                    </div>
                </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm space-y-8">
                <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-emerald-900/50">Réseaux Sociaux</h3>
                    <p className="text-xs text-gray-400 mt-1">Ces liens apparaissent dans le hero et le footer du site.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-pink-500 mb-1">
                            <Instagram size={15} />
                            <label className={labelClass}>Instagram (URL complète)</label>
                        </div>
                        <input
                            value={settings.instagram_url}
                            onChange={set('instagram_url')}
                            className={inputClass}
                            placeholder="https://www.instagram.com/username"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-blue-600 mb-1">
                            <Facebook size={15} />
                            <label className={labelClass}>Facebook (URL complète)</label>
                        </div>
                        <input
                            value={settings.facebook_url}
                            onChange={set('facebook_url')}
                            className={inputClass}
                            placeholder="https://www.facebook.com/username"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sky-500 mb-1">
                            <Twitter size={15} />
                            <label className={labelClass}>Twitter / X (URL complète)</label>
                        </div>
                        <input
                            value={settings.twitter_url}
                            onChange={set('twitter_url')}
                            className={inputClass}
                            placeholder="https://twitter.com/username"
                        />
                    </div>
                </div>
            </div>

            {/* Hero Video URL */}
            <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm space-y-6">
                <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-emerald-900/50">Vidéo Hero (optionnel)</h3>
                    <p className="text-xs text-gray-400 mt-1">URL d'une vidéo MP4 à afficher en arrière-plan du hero. Laissez vide pour utiliser l'image.</p>
                </div>
                <input
                    value={settings.hero_video_url}
                    onChange={set('hero_video_url')}
                    className={inputClass}
                    placeholder="https://example.com/video.mp4"
                />
                {settings.hero_video_url && (
                    <video
                        key={settings.hero_video_url}
                        src={settings.hero_video_url}
                        className="w-full max-h-40 rounded-xl object-cover mt-2 border border-gray-200"
                        muted autoPlay loop playsInline
                    />
                )}
            </div>

            <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-5 bg-emerald-900 text-[#d4af37] font-black uppercase tracking-[0.3em] text-xs rounded-2xl shadow-2xl hover:bg-emerald-950 transition-all flex items-center justify-center gap-3 disabled:opacity-60"
            >
                {saving ? (
                    <><Loader2 className="animate-spin" size={18} /> Sauvegarde...</>
                ) : saved ? (
                    <><CheckCircle size={18} className="text-emerald-400" /> Paramètres sauvegardés !</>
                ) : (
                    <><Save size={18} /> Enregistrer tous les paramètres</>
                )}
            </button>
        </div>
    );
};
