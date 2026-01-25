import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Save, Loader2, FileText, Type, Quote, MessageSquare } from 'lucide-react';

interface SiteTextContent {
    hero_title?: string;
    hero_subtitle?: string;
    hero_cta?: string;
    gallery_title?: string;
    gallery_description?: string;
    contact_title?: string;
    contact_subtitle?: string;
    footer_slogan?: string;
    about_quote?: string;
    about_quote_author?: string;
}

export const SiteContentManager = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [content, setContent] = useState<SiteTextContent>({
        hero_title: "L'Art qui transcende le Visible",
        hero_subtitle: "Galerie d'Art Contemporain",
        hero_cta: "Explorer la Collection",
        gallery_title: "Collection Complète",
        gallery_description: "Découvrez l'univers artistique dans toute sa splendeur",
        contact_title: "Entrer dans l'univers",
        contact_subtitle: "Collaboration & Acquisition",
        footer_slogan: "La beauté sauvera le monde.",
        about_quote: "L'art ne reproduit pas le visible ; il rend visible.",
        about_quote_author: "Paul Klee"
    });

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        const { data } = await supabase
            .from('site_content')
            .select('*')
            .eq('key', 'global_texts')
            .single();

        if (data) {
            setContent(data.content);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        const { error } = await supabase.from('site_content').upsert({
            key: 'global_texts',
            type: 'json',
            content: content
        });
        if (!error) {
            alert('Contenu sauvegardé ! Les changements apparaîtront sur le site.');
        }
        setSaving(false);
    };

    const Section = ({ icon: Icon, title, children }: any) => (
        <div className="bg-white p-10 rounded-[2.5rem] border border-emerald-950/5 shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-6">
                <Icon className="text-emerald-600" size={24} />
                <h3 className="text-xl font-bold text-emerald-950">{title}</h3>
            </div>
            {children}
        </div>
    );

    const Input = ({ label, value, onChange, placeholder = '' }: any) => (
        <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-widest text-emerald-900/40 font-black">{label}</label>
            <input
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full bg-[#fcfcf9] border border-emerald-950/10 rounded-2xl p-4 text-emerald-950 font-medium focus:border-emerald-500 outline-none transition-all"
            />
        </div>
    );

    const Textarea = ({ label, value, onChange, placeholder = '' }: any) => (
        <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-widest text-emerald-900/40 font-black">{label}</label>
            <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full bg-[#fcfcf9] border border-emerald-950/10 rounded-2xl p-6 text-emerald-950 leading-relaxed h-32 resize-none focus:border-emerald-500 outline-none transition-all"
            />
        </div>
    );

    if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin text-emerald-600" size={48} /></div>;

    return (
        <div className="space-y-10 max-w-6xl">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-4xl font-serif text-emerald-950 font-bold mb-2">Contenu Éditorial</h2>
                    <p className="text-gray-500 font-medium">Modifiez tous les textes du site en temps réel.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-3 bg-emerald-600 text-white px-8 py-4 rounded-2xl hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/20 font-black uppercase tracking-widest text-xs"
                >
                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {saving ? 'Sauvegarde...' : 'Publier les Modifications'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Hero Section */}
                <Section icon={Type} title="Page d'Accueil (Hero)">
                    <Input
                        label="Titre Principal"
                        value={content.hero_title}
                        onChange={(e: any) => setContent({ ...content, hero_title: e.target.value })}
                        placeholder="Ex: L'Art qui transcende le Visible"
                    />
                    <Input
                        label="Sous-titre / Sur-titre"
                        value={content.hero_subtitle}
                        onChange={(e: any) => setContent({ ...content, hero_subtitle: e.target.value })}
                        placeholder="Ex: Galerie d'Art Contemporain"
                    />
                    <Input
                        label="Texte du Bouton Principal"
                        value={content.hero_cta}
                        onChange={(e: any) => setContent({ ...content, hero_cta: e.target.value })}
                        placeholder="Ex: Explorer la Collection"
                    />
                </Section>

                {/* Gallery */}
                <Section icon={FileText} title="Page Galerie">
                    <Input
                        label="Titre de la Galerie"
                        value={content.gallery_title}
                        onChange={(e: any) => setContent({ ...content, gallery_title: e.target.value })}
                        placeholder="Ex: Collection Complète"
                    />
                    <Textarea
                        label="Description de la Galerie"
                        value={content.gallery_description}
                        onChange={(e: any) => setContent({ ...content, gallery_description: e.target.value })}
                        placeholder="Texte d'introduction pour la page galerie"
                    />
                </Section>

                {/* Contact */}
                <Section icon={MessageSquare} title="Page Contact">
                    <Input
                        label="Titre de Contact"
                        value={content.contact_title}
                        onChange={(e: any) => setContent({ ...content, contact_title: e.target.value })}
                        placeholder="Ex: Entrer dans l'univers"
                    />
                    <Input
                        label="Sous-titre Contact"
                        value={content.contact_subtitle}
                        onChange={(e: any) => setContent({ ...content, contact_subtitle: e.target.value })}
                        placeholder="Ex: Collaboration & Acquisition"
                    />
                </Section>

                {/* Footer & Citations */}
                <Section icon={Quote} title="Citations & Footer">
                    <Textarea
                        label="Citation Page Accueil"
                        value={content.about_quote}
                        onChange={(e: any) => setContent({ ...content, about_quote: e.target.value })}
                        placeholder="Ex: L'art ne reproduit pas le visible ; il rend visible."
                    />
                    <Input
                        label="Auteur de la Citation"
                        value={content.about_quote_author}
                        onChange={(e: any) => setContent({ ...content, about_quote_author: e.target.value })}
                        placeholder="Ex: Paul Klee"
                    />
                    <Input
                        label="Slogan du Footer"
                        value={content.footer_slogan}
                        onChange={(e: any) => setContent({ ...content, footer_slogan: e.target.value })}
                        placeholder="Ex: La beauté sauvera le monde."
                    />
                </Section>
            </div>
        </div>
    );
};
