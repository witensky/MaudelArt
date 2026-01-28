import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../supabaseClient';
import { Pencil, Trash2, Plus, Loader2, X, Upload, Image as ImageIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export const ArtworksManager = () => {
    const [artworks, setArtworks] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [authors, setAuthors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);

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
        author_id: ''
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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        try {
            setUploading(true);
            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${uuidv4()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, image_url: publicUrl }));
        } catch (error: any) {
            alert('Erreur upload image: ' + error.message);
        } finally {
            setUploading(false);
        }
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
                author_id: formData.author_id,
                id: formData.id || uuidv4() // Use existing ID or generate new one
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
            author_id: authors.length > 0 ? authors[0].id : ''
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
            author_id: art.author_id || (authors.length > 0 ? authors[0].id : '')
        });
        setIsModalOpen(true);
    };

    const toggleStatus = async (id: string, current: boolean) => {
        await supabase.from('artworks').update({ is_active: !current }).eq('id', id);
        fetchData(); // optimized: could just update local state
    };

    const deleteArtwork = async (id: string) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette œuvre ?')) return;
        await supabase.from('artworks').delete().eq('id', id);
        fetchData();
    };

    if (loading && !isModalOpen) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-emerald-600" /></div>;

    return (
        <div className="space-y-8 relative">
            <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] shadow-sm border border-emerald-950/5">
                <div>
                    <h2 className="text-4xl font-serif text-emerald-950 font-bold mb-1">Galerie d'Œuvres</h2>
                    <p className="text-gray-500 font-medium">Gérez l'inventaire complet de vos créations.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="flex items-center gap-3 bg-emerald-600 text-white px-8 py-4 rounded-2xl hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-500/20 font-black uppercase tracking-widest text-xs"
                >
                    <Plus size={20} /> Ajouter une Œuvre
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-emerald-950/5 overflow-hidden">
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
                                            <img src={art.image_url} alt={art.title} className="w-full h-full object-cover" />
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

            {/* MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-[#fcfcf9] w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/20">
                        <div className="px-10 py-8 border-b border-emerald-950/5 flex justify-between items-center bg-white">
                            <h3 className="text-2xl font-serif text-emerald-950 font-bold">
                                {formData.id ? 'Modifier la création' : 'Exposer une nouvelle œuvre'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:text-emerald-950 transition-all shadow-inner"><X size={24} /></button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Image Upload */}
                                <div className="p-8 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 hover:border-emerald-400 transition-all group relative overflow-hidden flex flex-col items-center justify-center text-center">
                                    {formData.image_url ? (
                                        <>
                                            <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg border border-white/50">
                                                <img src={formData.image_url} alt="Preview" className="w-full h-full object-contain bg-black/5" />
                                            </div>
                                            <div className="mt-4 flex gap-3">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">Changer l'image</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="py-8">
                                            <div className="w-20 h-20 rounded-3xl bg-white shadow-sm flex items-center justify-center mb-4 mx-auto text-emerald-200">
                                                <ImageIcon size={40} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Téléverser l'image haute définition</span>
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
                                        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10">
                                            <Loader2 className="animate-spin text-emerald-600" size={48} />
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase tracking-widest text-emerald-900/40 font-black">Catégorie</label>
                                        <select
                                            value={formData.category_id}
                                            onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                                            className="w-full bg-white border border-emerald-950/10 rounded-2xl p-4 text-emerald-950 font-bold focus:border-emerald-500 outline-none transition-all appearance-none"
                                            required
                                        >
                                            <option value="">Sélectionner une catégorie</option>
                                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase tracking-widest text-emerald-900/40 font-black">Technique Utilisée</label>
                                        <input
                                            value={formData.technique}
                                            onChange={e => setFormData({ ...formData, technique: e.target.value })}
                                            className="w-full bg-white border border-emerald-950/10 rounded-2xl p-4 text-emerald-950 font-medium focus:border-emerald-500 outline-none transition-all"
                                            placeholder="Ex: Huile sur toile"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase tracking-widest text-emerald-900/40 font-black">Dimensions</label>
                                        <input
                                            value={formData.dimensions}
                                            onChange={e => setFormData({ ...formData, dimensions: e.target.value })}
                                            className="w-full bg-white border border-emerald-950/10 rounded-2xl p-4 text-emerald-950 font-medium focus:border-emerald-500 outline-none transition-all"
                                            placeholder="Ex: 80x100 cm"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase tracking-widest text-emerald-900/40 font-black">Artiste</label>
                                        <select
                                            value={formData.author_id}
                                            onChange={e => setFormData({ ...formData, author_id: e.target.value })}
                                            className="w-full bg-white border border-emerald-950/10 rounded-2xl p-4 text-emerald-950 font-bold focus:border-emerald-500 outline-none transition-all appearance-none"
                                            required
                                        >
                                            <option value="">Sélectionner un artiste</option>
                                            {authors.map(auth => <option key={auth.id} value={auth.id}>{auth.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase tracking-widest text-emerald-900/40 font-black">Année de Création</label>
                                        <input
                                            value={formData.year}
                                            onChange={e => setFormData({ ...formData, year: e.target.value })}
                                            className="w-full bg-white border border-emerald-950/10 rounded-2xl p-4 text-emerald-950 font-medium focus:border-emerald-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase tracking-widest text-emerald-900/40 font-black">Prix d'Acquisition (€)</label>
                                        <input
                                            type="number"
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full bg-white border border-emerald-950/10 rounded-2xl p-4 text-emerald-950 font-bold focus:border-emerald-500 outline-none transition-all"
                                            placeholder="Laissez vide pour 'Prix sur demande'"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-emerald-950/5">
                                    <label className="text-[10px] uppercase tracking-widest text-emerald-900/40 font-black">Description & Histoire de l'œuvre</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-white border border-emerald-950/10 rounded-2xl p-6 text-emerald-950 leading-relaxed h-32 resize-none focus:border-emerald-500 outline-none transition-all"
                                        placeholder="Décrivez l'inspiration derrière cette création..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-emerald-900 text-[#d4af37] font-black uppercase tracking-[0.4em] text-xs py-5 rounded-2xl hover:bg-emerald-950 transition-all shadow-2xl shadow-emerald-950/20"
                                >
                                    {formData.id ? 'Mettre à jour l\'œuvre' : 'Publier l\'œuvre'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
