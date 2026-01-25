import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Save, Loader2, FileText, Quote, Scissors, Palette } from 'lucide-react';

export const BioManager = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [content, setContent] = useState<any>({
        mainTitle: "Marie Maude Eliacin",
        subtitle: "Artist Narrative",
        quote: "My painting is a journey of self-discovery...",
        quoteAuthor: "Marie Maude Eliacin",
        chapters: [
            { id: 1, title: "Precision in Every Thread", icon: "Scissors", text: "..." },
            { id: 2, title: "From Piano Keys to Pencils", icon: "Palette", text: "..." }
        ]
    });

    useEffect(() => {
        fetchBio();
    }, []);

    const fetchBio = async () => {
        const { data } = await supabase.from('site_content').select('*').eq('key', 'biography').single();
        if (data) setContent(data.content);
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        const { error } = await supabase.from('site_content').upsert({
            key: 'biography',
            type: 'json',
            content: content
        });
        if (!error) alert('Biographie mise à jour !');
        setSaving(false);
    };

    if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-10 max-w-5xl">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-4xl font-serif text-emerald-950 font-bold mb-2 text-dark">Biographie & Textes</h2>
                    <p className="text-gray-500 font-medium">Contrôlez l'histoire affichée sur la page À propos.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-3 bg-emerald-600 text-white px-8 py-4 rounded-2xl hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/20 font-black uppercase tracking-widest text-xs"
                >
                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {saving ? 'Sauvegarde...' : 'Publier les changements'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-12 space-y-8">
                    {/* Hero Section */}
                    <div className="bg-white p-10 rounded-3xl border border-emerald-950/5 shadow-sm space-y-8">
                        <div className="flex items-center gap-3 border-b border-gray-100 pb-6 mb-6">
                            <FileText className="text-emerald-600" size={24} />
                            <h3 className="text-xl font-bold text-emerald-950">En-tête & Introduction</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase tracking-widest text-emerald-900/40 font-black">Titre Principal</label>
                                <input
                                    value={content.mainTitle} onChange={e => setContent({ ...content, mainTitle: e.target.value })}
                                    className="w-full bg-[#fcfcf9] border border-emerald-950/10 rounded-xl p-4 text-emerald-950 font-serif text-2xl focus:border-emerald-500 outline-none"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase tracking-widest text-emerald-900/40 font-black">Sous-titre (Sur-titre)</label>
                                <input
                                    value={content.subtitle} onChange={e => setContent({ ...content, subtitle: e.target.value })}
                                    className="w-full bg-[#fcfcf9] border border-emerald-950/10 rounded-xl p-4 text-emerald-950 font-bold uppercase tracking-widest focus:border-emerald-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-3 pt-6 border-t border-gray-100">
                            <div className="flex items-center gap-2 mb-2">
                                <Quote className="text-emerald-400" size={16} />
                                <label className="text-[10px] uppercase tracking-widest text-emerald-900/40 font-black">Citation d'introduction</label>
                            </div>
                            <textarea
                                value={content.quote} onChange={e => setContent({ ...content, quote: e.target.value })}
                                className="w-full bg-[#fcfcf9] border border-emerald-950/10 rounded-xl p-6 text-emerald-950 italic serif text-lg h-32 resize-none focus:border-emerald-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Chapters */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-serif text-emerald-950 font-bold px-2">Chapitres de l'histoire</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {content.chapters.map((chap: any, idx: number) => (
                                <div key={chap.id} className="bg-white p-8 rounded-3xl border border-emerald-950/5 shadow-sm space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                            {chap.icon === 'Scissors' ? <Scissors size={18} /> : <Palette size={18} />}
                                        </div>
                                        <input
                                            value={chap.title}
                                            onChange={e => {
                                                const newChaps = [...content.chapters];
                                                newChaps[idx].title = e.target.value;
                                                setContent({ ...content, chapters: newChaps });
                                            }}
                                            className="bg-transparent border-none text-emerald-950 font-bold text-lg focus:outline-none focus:ring-1 focus:ring-emerald-200 rounded px-2 w-full"
                                            placeholder="Titre du chapitre"
                                        />
                                    </div>
                                    <textarea
                                        value={chap.text}
                                        onChange={e => {
                                            const newChaps = [...content.chapters];
                                            newChaps[idx].text = e.target.value;
                                            setContent({ ...content, chapters: newChaps });
                                        }}
                                        className="w-full bg-[#fcfcf9]/50 border border-emerald-950/5 rounded-xl p-4 text-emerald-900/70 text-sm leading-relaxed h-48 resize-none focus:bg-white focus:border-emerald-500 transition-all outline-none"
                                        placeholder="Contenu du chapitre..."
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
