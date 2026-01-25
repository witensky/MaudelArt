import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Pencil, Trash2, Plus, Loader2, X, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export const AuthorsManager = () => {
    const [authors, setAuthors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        bio: '',
        avatar_url: '',
        is_active: true
    });
    const [artworksCount, setArtworksCount] = useState<Record<string, number>>({});

    useEffect(() => {
        fetchAuthors();
    }, []);

    const fetchAuthors = async () => {
        setLoading(true);
        const { data: authorsData } = await supabase
            .from('authors')
            .select('*')
            .order('created_at', { ascending: false });

        if (authorsData) {
            setAuthors(authorsData);

            // Count artworks for each author
            const counts: Record<string, number> = {};
            for (const author of authorsData) {
                const { count } = await supabase
                    .from('artworks')
                    .select('*', { count: 'exact', head: true })
                    .eq('author_id', author.id);
                counts[author.id] = count || 0;
            }
            setArtworksCount(counts);
        }
        setLoading(false);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setUploading(true);
        try {
            const file = e.target.files[0];
            const fileName = `${uuidv4()}.${file.name.split('.').pop()}`;
            const { error: uploadError } = await supabase.storage.from('images').upload(fileName, file);
            if (!uploadError) {
                const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
                setFormData(prev => ({ ...prev, avatar_url: publicUrl }));
            }
        } catch (error) {
            console.error('Error uploading avatar:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.from('authors').upsert({
            id: formData.id || uuidv4(),
            name: formData.name,
            bio: formData.bio,
            avatar_url: formData.avatar_url
        });
        if (!error) {
            setIsModalOpen(false);
            fetchAuthors();
            resetForm();
        }
        setLoading(false);
    };

    const resetForm = () => {
        setFormData({ id: '', name: '', bio: '', avatar_url: '', is_active: true });
    };

    const handleEdit = (author: any) => {
        setFormData(author);
        setIsModalOpen(true);
    };

    const deleteAuthor = async (id: string) => {
        if (!window.confirm('Supprimer cet artiste ? Ses œuvres ne seront pas supprimées.')) return;
        await supabase.from('authors').delete().eq('id', id);
        fetchAuthors();
    };

    if (loading && !isModalOpen) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-emerald-600" size={48} /></div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] shadow-sm border border-emerald-950/5">
                <div>
                    <h2 className="text-4xl font-serif text-emerald-950 font-bold mb-1">Gestion des Artistes</h2>
                    <p className="text-gray-500 font-medium">Créez et gérez les profils des artistes exposés.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="flex items-center gap-3 bg-emerald-600 text-white px-8 py-4 rounded-2xl hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-500/20 font-black uppercase tracking-widest text-xs"
                >
                    <Plus size={20} /> Créer un Artiste
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {authors.map((author) => (
                    <div key={author.id} className="bg-white rounded-[2rem] p-8 shadow-sm border border-emerald-950/5 group hover:shadow-xl transition-all">
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-emerald-50 shadow-lg mb-6 relative group/avatar">
                                {author.avatar_url ? (
                                    <img src={author.avatar_url} alt={author.name} className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center text-emerald-600 text-4xl font-serif font-bold">
                                        {author.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <h3 className="text-2xl font-serif text-emerald-950 font-bold mb-2">{author.name}</h3>
                            <p className="text-gray-500 text-sm line-clamp-3 italic leading-relaxed mb-4">{author.bio || 'Aucune biographie disponible.'}</p>

                            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full">
                                <span className="text-emerald-600 font-bold text-lg">{artworksCount[author.id] || 0}</span>
                                <span className="text-emerald-600/60 text-[10px] font-black uppercase tracking-widest">Œuvres</span>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-6 border-t border-gray-100">
                            <button
                                onClick={() => handleEdit(author)}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all font-bold text-sm uppercase tracking-wide"
                            >
                                <Pencil size={16} /> Modifier
                            </button>
                            <button
                                onClick={() => deleteAuthor(author.id)}
                                className="flex items-center justify-center px-4 py-3 bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-[#fcfcf9] w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-white/20">
                        <div className="px-10 py-8 border-b border-emerald-950/5 flex justify-between items-center bg-white">
                            <h3 className="text-2xl font-serif text-emerald-950 font-bold">
                                {formData.id ? 'Modifier l\'artiste' : 'Créer un nouveau profil'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:text-emerald-950 transition-all shadow-inner">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-10 overflow-y-auto max-h-[70vh]">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Avatar Upload */}
                                <div className="flex flex-col items-center">
                                    <div className="relative group w-40 h-40 rounded-full overflow-hidden border-4 border-emerald-100 shadow-xl mb-4">
                                        {formData.avatar_url ? (
                                            <img src={formData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center text-emerald-400">
                                                <ImageIcon size={48} />
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
                                            <div className="absolute inset-0 bg-white/90 flex items-center justify-center"><Loader2 className="animate-spin text-emerald-600" size={32} /></div>
                                        )}
                                    </div>
                                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Cliquez pour changer la photo</span>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase tracking-widest text-emerald-900/40 font-black">Nom complet de l'artiste</label>
                                    <input
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-white border border-emerald-950/10 rounded-2xl p-4 text-emerald-950 font-bold focus:border-emerald-500 outline-none transition-all"
                                        placeholder="Ex: Marie Maude Eliacin"
                                        required
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase tracking-widest text-emerald-900/40 font-black">Biographie de l'artiste</label>
                                    <textarea
                                        value={formData.bio}
                                        onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                        className="w-full bg-white border border-emerald-950/10 rounded-2xl p-6 text-emerald-950 leading-relaxed h-48 resize-none focus:border-emerald-500 outline-none transition-all"
                                        placeholder="Racontez l'histoire et le parcours de cet artiste..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-emerald-900 text-[#d4af37] font-black uppercase tracking-[0.4em] text-xs py-5 rounded-2xl hover:bg-emerald-950 transition-all shadow-2xl shadow-emerald-950/20 disabled:opacity-50"
                                >
                                    {loading ? 'Enregistrement...' : (formData.id ? 'Mettre à jour' : 'Créer le profil')}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
