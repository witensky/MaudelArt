import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { supabase } from '../../../supabaseClient';
import { MediaUploader } from './MediaUploader';
import { MediaGrid } from './MediaGrid';

export const MediaLibraryManager: React.FC = () => {
    const [assets, setAssets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('media_assets')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) console.error('Error fetching assets:', error);
        if (data) setAssets(data);
        setLoading(false);
    };

    const handleDelete = async (id: string, path: string) => {
        if (!window.confirm('Supprimer cette image ? (Cela peut casser les liens existants)')) return;

        // 1. Delete from Storage
        const { error: storageError } = await supabase.storage.from('images').remove([path]);
        if (storageError) {
            console.error('Storage delete error:', storageError);
            alert('Erreur suppression stockage');
            return;
        }

        // 2. Delete from DB
        const { error: dbError } = await supabase.from('media_assets').delete().eq('id', id);
        if (dbError) {
            console.error('DB delete error:', dbError);
            alert('Erreur suppression DB');
        }

        fetchAssets();
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-emerald-950/5 gap-4">
                <div>
                    <h2 className="text-3xl md:text-4xl font-serif text-emerald-950 font-bold mb-1">Médiathèque</h2>
                    <p className="text-gray-500 font-medium text-sm md:text-base">Gérez toutes vos images et fichiers ici.</p>
                </div>
                <button
                    onClick={fetchAssets}
                    className="w-full md:w-auto p-3 bg-gray-50 text-emerald-600 rounded-xl hover:bg-emerald-50 transition-colors flex justify-center items-center"
                    title="Actualiser"
                >
                    <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            <MediaUploader onUploadComplete={fetchAssets} />

            <div className="min-h-[300px]">
                {loading ? (
                    <div className="text-center py-20 text-gray-400">Chargement...</div>
                ) : (
                    <MediaGrid assets={assets} onDelete={handleDelete} />
                )}
            </div>
        </div>
    );
};
