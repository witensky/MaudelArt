import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Save, Loader2, DollarSign, Globe, RefreshCw, ToggleLeft, ToggleRight, Plus, Trash2 } from 'lucide-react';
import { SUPPORTED_CURRENCIES, Currency } from '../../contexts/CurrencyContext';

type SiteSettings = {
    defaultCurrency: string;
    autoDetect: boolean;
    manualRates: Record<string, number>;
};

const DEFAULT_SETTINGS: SiteSettings = {
    defaultCurrency: 'EUR',
    autoDetect: true,
    manualRates: {},
};

export const CurrencyManager: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

    useEffect(() => { fetchSettings(); }, []);

    const fetchSettings = async () => {
        const { data } = await supabase.from('site_content').select('content').eq('key', 'currency_settings').single();
        if (data?.content) setSettings(data.content as SiteSettings);
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        await supabase.from('site_content').upsert({ key: 'currency_settings', type: 'json', content: settings });
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const updateRate = (code: string, value: string) => {
        const rate = parseFloat(value);
        if (isNaN(rate)) return;
        setSettings(s => ({ ...s, manualRates: { ...s.manualRates, [code]: rate } }));
    };

    if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-emerald-500" size={24} /></div>;

    return (
        <div className="space-y-8 max-w-3xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-serif text-emerald-950 font-bold">Gestion des Devises</h2>
                    <p className="text-gray-500 mt-1">Configurez la devise principale et les taux de change.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all ${saved ? 'bg-emerald-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                        }`}
                >
                    {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                    {saved ? 'Sauvegardé ✓' : saving ? 'Sauvegarde…' : 'Enregistrer'}
                </button>
            </div>

            {/* Default currency */}
            <div className="bg-white rounded-3xl border border-emerald-950/5 p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
                    <Globe className="text-emerald-600" size={20} />
                    <h3 className="text-lg font-bold text-emerald-950">Devise Principale du Site</h3>
                </div>
                <p className="text-sm text-gray-500">Tous les prix sont saisis en cette devise dans la galerie.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {SUPPORTED_CURRENCIES.map(c => (
                        <button
                            key={c.code}
                            onClick={() => setSettings(s => ({ ...s, defaultCurrency: c.code }))}
                            className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${settings.defaultCurrency === c.code
                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                                    : 'border-gray-100 hover:border-emerald-200 text-gray-700'
                                }`}
                        >
                            <span className="text-2xl">{c.flag}</span>
                            <div>
                                <div className="font-black text-xs">{c.code}</div>
                                <div className="text-[10px] opacity-60">{c.name}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Auto-detect toggle */}
            <div className="bg-white rounded-3xl border border-emerald-950/5 p-8 shadow-sm">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-5 mb-6">
                    <Globe className="text-emerald-600" size={20} />
                    <h3 className="text-lg font-bold text-emerald-950">Détection Automatique</h3>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-bold text-emerald-950 text-sm">Détection par pays</p>
                        <p className="text-xs text-gray-500 mt-1">Convertit automatiquement le prix selon la langue du navigateur visitor.</p>
                    </div>
                    <button
                        onClick={() => setSettings(s => ({ ...s, autoDetect: !s.autoDetect }))}
                        className="transition-opacity"
                        aria-label="Toggle auto-detect"
                    >
                        {settings.autoDetect
                            ? <ToggleRight size={40} className="text-emerald-500" />
                            : <ToggleLeft size={40} className="text-gray-300" />}
                    </button>
                </div>
            </div>

            {/* Manual rates */}
            <div className="bg-white rounded-3xl border border-emerald-950/5 p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
                    <RefreshCw className="text-emerald-600" size={20} />
                    <div>
                        <h3 className="text-lg font-bold text-emerald-950">Taux Manuels (facultatif)</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Laissez vide pour utiliser les taux automatiques.</p>
                    </div>
                </div>
                <div className="space-y-3">
                    {SUPPORTED_CURRENCIES.filter(c => c.code !== settings.defaultCurrency).map(c => (
                        <div key={c.code} className="flex items-center gap-4">
                            <span className="flex items-center gap-2 w-28 text-sm font-bold text-emerald-950">
                                <span>{c.flag}</span>{c.code}
                            </span>
                            <span className="text-xs text-gray-400 w-24">1 {settings.defaultCurrency} =</span>
                            <input
                                type="number"
                                step="0.0001"
                                placeholder={`Auto`}
                                value={settings.manualRates[c.code] ?? ''}
                                onChange={e => updateRate(c.code, e.target.value)}
                                className="flex-1 bg-[#fcfcf9] border border-emerald-950/10 rounded-xl px-4 py-2.5 text-emerald-950 text-sm focus:border-emerald-500 outline-none"
                            />
                            <span className="text-sm font-bold text-gray-400">{c.symbol}</span>
                            {settings.manualRates[c.code] && (
                                <button
                                    onClick={() => {
                                        const r = { ...settings.manualRates };
                                        delete r[c.code];
                                        setSettings(s => ({ ...s, manualRates: r }));
                                    }}
                                    className="text-red-400 hover:text-red-600 transition-colors"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
