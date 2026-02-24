import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Pencil, Trash2, Plus, Loader2, X, Image as ImageIcon, LayoutGrid } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { MediaPicker } from './MediaLibrary/MediaPicker';

export const ArtworksManager = () => {
    const [artworks, setArtworks] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [authors, setAuthors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

    // Track which field triggered the media picker
    const [mediaPickerTarget, setMediaPickerTarget] = useState<'main' | 'gallery'>('main');

    // Form State
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        description: '',
        technique: '',
        dimensions: '',
        year: new Date().getFullYear().toString(),
        price: '',
        category_id: '',
        image_url: '',
        media_asset_id: '',
        gallery_images: [] as any[], // Array of { id, url }
        author_id: '',
        is_active: true
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const { data: arts } = await supabase
            .from('artworks')
            .select('*, categories(name)')
            .order('created_at', { ascending: false });

        const { data: cats } = await supabase.from('categories').select('*');
        const { data: auths } = await supabase.from('authors').select('*');

        if (arts) setArtworks(arts);
        if (cats) setCategories(cats);
        if (auths) setAuthors(auths);
        setLoading(false);
    };

    const handleMediaSelect = (url: string, id: string) => {
        if (mediaPickerTarget === 'main') {
            setFormData(prev => ({ ...prev, image_url: url, media_asset_id: id }));
        } else {
            // Add to gallery images if not already present
            setFormData(prev => {
                if (prev.gallery_images.some(img => img.id === id)) return prev;
                return {
                    ...prev,
                    gallery_images: [...prev.gallery_images, { id, url }]
                };
            });
        }
        setIsMediaPickerOpen(false);
    };

    const removeGalleryImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            gallery_images: prev.gallery_images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const dataToSave = {
                title: formData.title,
                description: formData.description,
                technique: formData.technique,
                dimensions: formData.dimensions,
                year: formData.year,
                price: parseFloat(formData.price) || 0,
                category_id: formData.category_id,
                image_url: formData.image_url,
                media_asset_id: formData.media_asset_id || null,
                gallery_images: formData.gallery_images, // Save JSONB array
                author_id: formData.author_id,
                is_active: formData.is_active,
                id: formData.id || uuidv4()
            };

            const { error } = await supabase
                .from('artworks')
                .upsert(dataToSave);

            if (error) throw error;

            setIsModalOpen(false);
            fetchData();
            resetForm();
        } catch (error: any) {
            alert('Erreur sauvegarde: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            id: '',
            title: '',
            description: '',
            technique: '',
            dimensions: '',
            year: new Date().getFullYear().toString(),
            price: '',
            category_id: '',
            image_url: '',
            media_asset_id: '',
            gallery_images: [],
            author_id: authors.length > 0 ? authors[0].id : '',
            is_active: true
        });
    };

    const handleEdit = (art: any) => {
        setFormData({
            id: art.id,
            title: art.title,
            description: art.description || '',
            technique: art.technique || '',
            dimensions: art.dimensions || '',
            year: art.year || '',
            price: art.price || '',
            category_id: art.category_id || '',
            image_url: art.image_url || '',
            media_asset_id: art.media_asset_id || '',
            gallery_images: Array.isArray(art.gallery_images) ? art.gallery_images : [],
            author_id: art.author_id || (authors.length > 0 ? authors[0].id : ''),
            is_active: art.is_active
        });
        setIsModalOpen(true);
    };

    const toggleStatus = async (id: string, current: boolean) => {
        await supabase.from('artworks').update({ is_active: !current }).eq('id', id);
        fetchData();
    };

    const deleteArtwork = async (id: string) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette œuvre ?')) return;
        await supabase.from('artworks').delete().eq('id', id);
        fetchData();
    };

    if (loading && !isModalOpen) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-emerald-600" /></div>;

    return (
        <div className="space-y-8 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-emerald-950/5 gap-4 md:gap-0">
                <div>
                    <h2 className="text-3xl md:text-4xl font-serif text-emerald-950 font-bold mb-1">Galerie</h2>
                    <p className="text-gray-500 font-medium text-sm md:text-base">Gérez l'inventaire complet.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="w-full md:w-auto flex items-center justify-center gap-2 md:gap-3 bg-emerald-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-500/20 font-black uppercase tracking-widest text-[10px] md:text-xs"
                >
                    <Plus size={18} className="md:w-5 md:h-5" /> <span className="hidden md:inline">Ajouter une Œuvre</span><span className="md:hidden">Ajouter</span>
                </button>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-[2.5rem] shadow-sm border border-emerald-950/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#fcfcf9] border-b border-gray-100">
                            <tr>
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-emerald-950/40">Aperçu</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-emerald-950/40">Titre & Détails</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-emerald-950/40">Catégorie</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-emerald-950/40">Statut</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-emerald-950/40 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {artworks.map((art) => (
                                <tr key={art.id} className="hover:bg-emerald-50/30 transition-colors group">
                                    <td className="p-6">
                                        <div className="w-20 h-20 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-sm group-hover:scale-110 transition-transform">
                                            <img src={art.image_url} alt={art.title} loading="lazy" className="w-full h-full object-cover" />
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="font-bold text-emerald-950 text-lg mb-1">{art.title}</div>
                                        <div className="flex gap-4">
                                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-md">{art.technique}</span>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{art.dimensions}</span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className="text-sm font-bold text-gray-500">{art.categories?.name || '-'}</span>
                                    </td>
                                    <td className="p-6">
                                        <button
                                            onClick={() => toggleStatus(art.id, art.is_active)}
                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${art.is_active ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                        >
                                            {art.is_active ? '● Actif' : '○ Masqué'}
                                        </button>
                                    </td>
                                    <td className="p-6 text-right space-x-3">
                                        <button onClick={() => handleEdit(art)} className="p-3 bg-gray-50 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"><Pencil size={18} /></button>
                                        <button onClick={() => deleteArtwork(art.id)} className="p-3 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden grid grid-cols-1 gap-4">
                {artworks.map((art) => (
                    <div key={art.id} className="bg-white p-4 rounded-[2rem] shadow-sm border border-emerald-950/5 flex gap-4 items-start">
                        <div className="w-20 h-20 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shrink-0">
                            <img src={art.image_url} alt={art.title} loading="lazy" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="font-bold text-emerald-950 text-base leading-tight mb-1 truncate">{art.title}</div>
                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{art.categories?.name}</div>
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => handleEdit(art)} className="p-2 bg-gray-50 text-emerald-600 rounded-lg"><Pencil size={14} /></button>
                                    <button onClick={() => deleteArtwork(art.id)} className="p-2 bg-gray-50 text-red-400 rounded-lg"><Trash2 size={14} /></button>
                                </div>
                            </div>

                            <div className="flex gap-2 items-center flex-wrap">
                                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md truncate max-w-[100px]">{art.technique}</span>
                                <button
                                    onClick={() => toggleStatus(art.id, art.is_active)}
                                    className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${art.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}
                                >
                                    {art.is_active ? '●' : '○'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ARTWORK MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-[#fcfcf9] w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] border border-white/20">
                        <div className="px-10 py-8 border-b border-emerald-950/5 flex justify-between items-center bg-white shrink-0">
                            <h3 className="text-2xl font-serif text-emerald-950 font-bold">
                                {formData.id ? 'Modifier la création' : 'Exposer une nouvelle œuvre'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:text-emerald-950 transition-all shadow-inner"><X size={24} /></button>
                        </div>

                        <div className="p-10 overflow-y-auto">
                            <form onSubmit={handleSubmit} className="space-y-10">

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                    {/* Left Column: Images */}
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] uppercase tracking-widest text-emerald-900/40 font-black">Image Principale</label>
                                            <div
                                                onClick={() => { setMediaPickerTarget('main'); setIsMediaPickerOpen(true); }}
                                                className="cursor-pointer aspect-square bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 hover:border-emerald-400 transition-all group relative overflow-hidden flex flex-col items-center justify-center text-center"
                                            >
                                                {formData.image_url ? (
                                                    <>
                                                        <img src={formData.image_url} alt="Main" className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <span className="text-white font-bold uppercase tracking-widest text-xs border border-white px-4 py-2 rounded-xl">Changer</span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="text-emerald-200">
                                                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-3 shadow-sm">
                                                            <ImageIcon size={32} />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Choisir Image</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[10px] uppercase tracking-widest text-emerald-900/40 font-black">Galerie Secondaire</label>
                                                <button
                                                    type="button"
                                                    onClick={() => { setMediaPickerTarget('gallery'); setIsMediaPickerOpen(true); }}
                                                    className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold hover:text-emerald-800 flex items-center gap-1"
                                                >
                                                    <Plus size={14} /> Ajouter
                                                </button>
                                            </div>

                                            {formData.gallery_images.length === 0 ? (
                                                <div
                                                    onClick={() => { setMediaPickerTarget('gallery'); setIsMediaPickerOpen(true); }}
                                                    className="p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center cursor-pointer hover:bg-emerald-50 hover:border-emerald-200 transition-colors"
                                                >
                                                    <LayoutGrid className="mx-auto text-gray-300 mb-2" size={24} />
                                                    <p className="text-[10px] text-gray-400 font-medium">Ajouter des vues de détail</p>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-3 gap-3">
                                                    {formData.gallery_images.map((img, idx) => (
                                                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group bg-gray-100 border border-gray-200">
                                                            <img src={img.url} className="w-full h-full object-cover" />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeGalleryImage(idx)}
                                                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <X size={12} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        onClick={() => { setMediaPickerTarget('gallery'); setIsMediaPickerOpen(true); }}
                                                        className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 hover:text-emerald-500 hover:border-emerald-300 transition-all bg-white"
                                                    >
                                                        <Plus size={20} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Column: Details */}
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] uppercase tracking-widest text-emerald-900/40 font-black">Titre de l'œuvre</label>
                                            <input
                                                value={formData.title}
                                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full bg-white border border-emerald-950/10 rounded-2xl p-4 text-emerald-950 font-bold focus:border-emerald-500 outline-none transition-all"
                                                placeholder="Ex: Sérénité Tropicale"
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-3">
                                                <label className="text-[10px] uppercase tracking-widest text-emerald-900/40 font-black">Catégorie</label>
                                                <select
                                                    value={formData.category_id}
                                                    onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                                                    className="w-full bg-white border border-emerald-950/10 rounded-2xl p-4 text-emerald-950 font-bold focus:border-emerald-500 outline-none transition-all appearance-none"
                                                    required
                                                >
                                                    <option value="">Sélectionner</option>
                                                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                                </select>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] uppercase tracking-widest text-emerald-900/40 font-black">Artiste</label>
                                                <select
                                                    value={formData.author_id}
                                                    onChange={e => setFormData({ ...formData, author_id: e.target.value })}
                                                    className="w-full bg-white border border-emerald-950/10 rounded-2xl p-4 text-emerald-950 font-bold focus:border-emerald-500 outline-none transition-all appearance-none"
                                                    required
                                                >
                                                    <option value="">Sélectionner</option>
                                                    {authors.map(auth => <option key={auth.id} value={auth.id}>{auth.name}</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-3">
                                                <label className="text-[10px] uppercase tracking-widest text-emerald-900/40 font-black">Technique</label>
                                                <input
                                                    value={formData.technique}
                                                    onChange={e => setFormData({ ...formData, technique: e.target.value })}
                                                    className="w-full bg-white border border-emerald-950/10 rounded-2xl p-4 text-emerald-950 font-medium focus:border-emerald-500 outline-none transition-all"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] uppercase tracking-widest text-emerald-900/40 font-black">Dimensions</label>
                                                <input
                                                    value={formData.dimensions}
                                                    onChange={e => setFormData({ ...formData, dimensions: e.target.value })}
                                                    className="w-full bg-white border border-emerald-950/10 rounded-2xl p-4 text-emerald-950 font-medium focus:border-emerald-500 outline-none transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-3">
                                                <label className="text-[10px] uppercase tracking-widest text-emerald-900/40 font-black">Année</label>
                                                <input
                                                    value={formData.year}
                                                    onChange={e => setFormData({ ...formData, year: e.target.value })}
                                                    className="w-full bg-white border border-emerald-950/10 rounded-2xl p-4 text-emerald-950 font-medium focus:border-emerald-500 outline-none transition-all"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] uppercase tracking-widest text-emerald-900/40 font-black">Prix (€)</label>
                                                <input
                                                    type="number"
                                                    value={formData.price}
                                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                                    className="w-full bg-white border border-emerald-950/10 rounded-2xl p-4 text-emerald-950 font-bold focus:border-emerald-500 outline-none transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3 pt-4 border-t border-emerald-950/5">
                                            <label className="text-[10px] uppercase tracking-widest text-emerald-900/40 font-black">Histoire de l'œuvre</label>
                                            <textarea
                                                value={formData.description}
                                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full bg-white border border-emerald-950/10 rounded-2xl p-6 text-emerald-950 leading-relaxed h-32 resize-none focus:border-emerald-500 outline-none transition-all"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full bg-emerald-900 text-[#d4af37] font-black uppercase tracking-[0.4em] text-xs py-5 rounded-2xl hover:bg-emerald-950 transition-all shadow-2xl shadow-emerald-950/20"
                                        >
                                            {formData.id ? 'Mettre à jour l\'œuvre' : 'Publier l\'œuvre'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* MEDIA PICKER MODAL */}
            {isMediaPickerOpen && (
                <MediaPicker
                    onSelect={handleMediaSelect}
                    onClose={() => setIsMediaPickerOpen(false)}
                />
            )}
        </div>
    );
};
