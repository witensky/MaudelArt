import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Save, Loader2, Image as ImageIcon, Upload } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export const HeroImageManager = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [heroData, setHeroData] = useState({
        image_url: '',
        title: 'Sérénité Tropicale',
        description: 'Huile sur Toile — 2023',
        label: 'Oeuvre du moment'
    });

    useEffect(() => {
        fetchHeroImage();
    }, []);

    const fetchHeroImage = async () => {
        const { data } = await supabase
            .from('site_content')
            .select('*')
            .eq('key', 'hero_image')
            .single();

        if (data?.content) {
            setHeroData(data.content);
        }
        setLoading(false);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setUploading(true);

        try {
            const file = e.target.files[0];
            const fileName = `hero/${uuidv4()}.${file.name.split('.').pop()}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(fileName);

            setHeroData(prev => ({ ...prev, image_url: publicUrl }));
        } catch (error) {
            console.error('Upload error:', error);
            alert('Erreur lors du téléchargement de l\'image');
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        const { error } = await supabase.from('site_content').upsert({
            key: 'hero_image',
            type: 'json',
            content: heroData
        });

        if (!error) {
            alert('✅ Image Hero mise à jour ! Rafraîchissez la page d\'accueil pour voir les changements.');
        } else {
            alert('❌ Erreur lors de la sauvegarde');
        }
        setSaving(false);
    };

    if (loading) return (
        <div className="p-10 text-center">
            <Loader2 className="animate-spin text-emerald-600 mx-auto" size={48} />
        </div>
    );

    return (
        <div className="space-y-10 max-w-5xl">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-4xl font-serif text-emerald-950 font-bold mb-2">Image Hero Landing</h2>
                    <p className="text-gray-500 font-medium">Gérez l'œuvre principale affichée sur la page d'accueil.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-3 bg-emerald-600 text-white px-8 py-4 rounded-2xl hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/20 font-black uppercase tracking-widest text-xs"
                >
                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {saving ? 'Sauvegarde...' : 'Publier sur le Site'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Image Upload Section */}
                <div className="bg-white p-10 rounded-[2.5rem] border border-emerald-950/5 shadow-sm space-y-8">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-6">
                        <ImageIcon className="text-emerald-600" size={24} />
                        <h3 className="text-xl font-bold text-emerald-950">Image du Tableau</h3>
                    </div>

                    {/* Image Preview & Upload */}
                    <div className="relative aspect-[4/5] bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-200 rounded-3xl overflow-hidden group hover:border-emerald-400 transition-all">
                        {heroData.image_url ? (
                            <>
                                <img
                                    src={heroData.image_url}
                                    alt="Hero Preview"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                                    <Upload className="text-white" size={48} />
                                    <span className="text-white text-sm font-bold uppercase tracking-widest">Changer l'Image</span>
                                </div>
                            </>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-4">
                                <ImageIcon size={64} />
                                <span className="text-sm font-bold uppercase tracking-widest">Téléverser une Œuvre</span>
                            </div>
                        )}

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            disabled={uploading}
                        />

                        {uploading && (
                            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-20">
                                <div className="flex flex-col items-center gap-4">
                                    <Loader2 className="animate-spin text-emerald-600" size={48} />
                                    <p className="text-emerald-950 font-bold text-sm">Téléchargement...</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
                        <p className="text-emerald-950 text-sm font-medium leading-relaxed">
                            <strong className="font-black">💡 Conseil :</strong> Utilisez une image haute résolution (min. 1200×1600px) pour un rendu optimal. Formats acceptés : JPG, PNG, WebP.
                        </p>
                    </div>
                </div>

                {/* Metadata Section */}
                <div className="bg-white p-10 rounded-[2.5rem] border border-emerald-950/5 shadow-sm space-y-8">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-6">
                        <ImageIcon className="text-emerald-600" size={24} />
                        <h3 className="text-xl font-bold text-emerald-950">Informations de l'Œuvre</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] uppercase tracking-widest text-emerald-900/40 font-black">Étiquette</label>
                            <input
                                value={heroData.label}
                                onChange={e => setHeroData({ ...heroData, label: e.target.value })}
                                className="w-full bg-[#fcfcf9] border border-emerald-950/10 rounded-2xl p-4 text-emerald-950 font-medium focus:border-emerald-500 outline-none"
                                placeholder="Ex: Oeuvre du moment"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] uppercase tracking-widest text-emerald-900/40 font-black">Titre de l'Œuvre</label>
                            <input
                                value={heroData.title}
                                onChange={e => setHeroData({ ...heroData, title: e.target.value })}
                                className="w-full bg-[#fcfcf9] border border-emerald-950/10 rounded-2xl p-4 text-emerald-950 font-bold text-lg focus:border-emerald-500 outline-none"
                                placeholder="Ex: Sérénité Tropicale"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] uppercase tracking-widest text-emerald-900/40 font-black">Description Technique</label>
                            <input
                                value={heroData.description}
                                onChange={e => setHeroData({ ...heroData, description: e.target.value })}
                                className="w-full bg-[#fcfcf9] border border-emerald-950/10 rounded-2xl p-4 text-emerald-950 font-medium focus:border-emerald-500 outline-none"
                                placeholder="Ex: Huile sur Toile — 2023"
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                        <div className="bg-gray-50 rounded-2xl p-6">
                            <h4 className="text-sm font-black text-emerald-950 mb-3 uppercase tracking-wide">Aperçu du Cartouche</h4>
                            <div className="space-y-2">
                                <span className="block text-[10px] uppercase tracking-widest text-emerald-600 font-black">{heroData.label}</span>
                                <h4 className="text-xl serif text-emerald-950 font-bold">{heroData.title || 'Titre de l\'œuvre'}</h4>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{heroData.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
