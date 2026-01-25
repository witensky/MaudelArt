import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Save, Loader2, Globe, Mail, Instagram, MapPin } from 'lucide-react';

export const SettingsManager = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<any>({
        siteName: "MaudelArt",
        contactEmail: "contact@mariemaudeart.com",
        instagram: "@mariemaude_eliacin",
        address: "Montréal, QC | Port-au-Prince, Haïti",
        footerText: "La beauté sauvera le monde."
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        const { data } = await supabase.from('site_content').select('*').eq('key', 'settings').single();
        if (data) setSettings(data.content);
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        await supabase.from('site_content').upsert({
            key: 'settings',
            type: 'json',
            content: settings
        });
        setSaving(false);
    };

    if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-10 max-w-4xl">
            <div>
                <h2 className="text-4xl font-serif text-emerald-950 font-bold mb-2">Paramètres du Site</h2>
                <p className="text-gray-500 font-medium">Informations de contact et configuration globale.</p>
            </div>

            <div className="bg-white p-10 rounded-3xl border border-black/5 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-emerald-600 mb-1">
                            <Globe size={16} />
                            <label className="text-[10px] uppercase tracking-widest font-black">Nom du Site</label>
                        </div>
                        <input
                            value={settings.siteName} onChange={e => setSettings({ ...settings, siteName: e.target.value })}
                            className="w-full bg-[#fcfcf9] border border-gray-200 rounded-xl p-4 text-emerald-950 font-bold focus:border-emerald-500 outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-emerald-600 mb-1">
                            <Mail size={16} />
                            <label className="text-[10px] uppercase tracking-widest font-black">Email de Contact</label>
                        </div>
                        <input
                            value={settings.contactEmail} onChange={e => setSettings({ ...settings, contactEmail: e.target.value })}
                            className="w-full bg-[#fcfcf9] border border-gray-200 rounded-xl p-4 text-emerald-950 focus:border-emerald-500 outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-emerald-600 mb-1">
                            <Instagram size={16} />
                            <label className="text-[10px] uppercase tracking-widest font-black">Instagram</label>
                        </div>
                        <input
                            value={settings.instagram} onChange={e => setSettings({ ...settings, instagram: e.target.value })}
                            className="w-full bg-[#fcfcf9] border border-gray-200 rounded-xl p-4 text-emerald-950 focus:border-emerald-500 outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-emerald-600 mb-1">
                            <MapPin size={16} />
                            <label className="text-[10px] uppercase tracking-widest font-black">Localisation</label>
                        </div>
                        <input
                            value={settings.address} onChange={e => setSettings({ ...settings, address: e.target.value })}
                            className="w-full bg-[#fcfcf9] border border-gray-200 rounded-xl p-4 text-emerald-950 focus:border-emerald-500 outline-none"
                        />
                    </div>
                </div>

                <div className="md:col-span-2 space-y-2 pt-6 border-t border-gray-100">
                    <label className="text-[10px] uppercase tracking-widest text-emerald-900/40 font-black">Texte du Footer (Slogan)</label>
                    <input
                        value={settings.footerText} onChange={e => setSettings({ ...settings, footerText: e.target.value })}
                        className="w-full bg-[#fcfcf9] border border-gray-200 rounded-xl p-4 text-emerald-950 italic serif focus:border-emerald-500 outline-none"
                    />
                </div>
            </div>

            <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-5 bg-emerald-900 text-[#d4af37] font-black uppercase tracking-[0.3em] text-xs rounded-2xl shadow-2xl hover:bg-emerald-950 transition-all flex items-center justify-center gap-3"
            >
                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {saving ? 'Sauvegarde...' : 'Enregistrer les paramètres globaux'}
            </button>
        </div>
    );
};
