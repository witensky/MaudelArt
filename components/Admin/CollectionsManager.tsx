import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Pencil, Trash2, Plus, Loader2, Image as ImageIcon, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export const CollectionsManager = () => {
    const [collections, setCollections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        description: '',
        cover_image_url: ''
    });

    useEffect(() => {
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        setLoading(true);
        const { data } = await supabase.from('collections').select('*').order('created_at', { ascending: false });
        if (data) setCollections(data);
        setLoading(false);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setUploading(true);
        const file = e.target.files[0];
        const fileName = `${uuidv4()}.${file.name.split('.').pop()}`;
        const { error: uploadError } = await supabase.storage.from('images').upload(fileName, file);
        if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
            setFormData(prev => ({ ...prev, cover_image_url: publicUrl }));
        }
        setUploading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.from('collections').upsert({
            id: formData.id || uuidv4(),
            name: formData.name,
            description: formData.description,
            cover_image_url: formData.cover_image_url
        });
        if (!error) {
            setIsModalOpen(false);
            fetchCollections();
        }
    };

    const handleEdit = (col: any) => {
        setFormData(col);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-serif text-emerald-950 font-bold">Gestion des Collections</h2>
                <button
                    onClick={() => { setFormData({ id: '', name: '', description: '', cover_image_url: '' }); setIsModalOpen(true); }}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20 font-bold uppercase tracking-widest text-xs"
                >
                    <Plus size={18} /> Nouvelle Collection
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((col) => (
                    <div key={col.id} className="bg-white rounded-2xl p-6 shadow-sm border border-black/5 group hover:shadow-xl transition-all">
                        <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden mb-6 relative">
                            <img src={col.cover_image_url} alt={col.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(col)} className="p-2 bg-white/90 backdrop-blur rounded-lg text-emerald-600 hover:text-emerald-700 shadow-sm"><Pencil size={18} /></button>
                                <button className="p-2 bg-white/90 backdrop-blur rounded-lg text-red-500 hover:text-red-600 shadow-sm"><Trash2 size={18} /></button>
                            </div>
                        </div>
                        <h3 className="text-xl font-serif text-emerald-950 mb-2 font-bold">{col.name}</h3>
                        <p className="text-gray-500 text-sm line-clamp-2 italic">{col.description}</p>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-[#fcfcf9] w-full max-w-lg rounded-3xl shadow-2xl p-10 overflow-hidden border border-white/20">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-serif text-emerald-950 font-bold">{formData.id ? 'Modifier' : 'Créer'} Collection</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-emerald-950"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-emerald-900/40 font-black">Nom de la collection</label>
                                <input
                                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-white border border-emerald-950/10 rounded-xl p-4 text-emerald-950 focus:outline-none focus:border-emerald-500"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-emerald-900/40 font-black">Description</label>
                                <textarea
                                    value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-white border border-emerald-950/10 rounded-xl p-4 text-emerald-950 h-24 resize-none focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-emerald-900/40 font-black">Image de couverture</label>
                                <div className="relative aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden flex items-center justify-center group flex-col text-gray-400">
                                    {formData.cover_image_url ? (
                                        <img src={formData.cover_image_url} className="w-full h-full object-cover" />
                                    ) : (
                                        <><ImageIcon size={32} className="mb-2" /><span className="text-[10px] font-bold uppercase tracking-widest">Upload Cover</span></>
                                    )}
                                    <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                                    {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader2 className="animate-spin text-emerald-600" /></div>}
                                </div>
                            </div>

                            <button type="submit" className="w-full py-5 bg-emerald-900 text-[#d4af37] font-black uppercase tracking-[0.3em] text-xs rounded-2xl shadow-xl hover:bg-emerald-950 transition-all">
                                {formData.id ? 'Mettre à jour' : 'Créer la collection'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
