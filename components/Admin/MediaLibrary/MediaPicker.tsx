import React, { useEffect, useState } from 'react';
import { supabase } from '../../../supabaseClient';
import { X, Search } from 'lucide-react';
import { MediaGrid } from './MediaGrid';
import { MediaUploader } from './MediaUploader';

interface MediaPickerProps {
    onSelect: (url: string, id: string) => void;
    onClose: () => void;
}

export const MediaPicker: React.FC<MediaPickerProps> = ({ onSelect, onClose }) => {
    const [assets, setAssets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'grid' | 'upload'>('grid');

    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('media_assets')
            .select('*')
            .order('created_at', { ascending: false });
        if (data) setAssets(data);
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-emerald-950/60 backdrop-blur-md" onClick={onClose} />
            <div className="relative bg-[#fcfcf9] w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col h-[85vh] border border-white/20">
                <div className="px-10 py-6 border-b border-emerald-950/5 flex justify-between items-center bg-white shrink-0">
                    <div className="flex items-center gap-6">
                        <h3 className="text-2xl font-serif text-emerald-950 font-bold">Choisir une image</h3>
                        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
                            <button
                                onClick={() => setView('grid')}
                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${view === 'grid' ? 'bg-white shadow-sm text-emerald-950' : 'text-gray-500 hover:text-emerald-950'}`}
                            >
                                Bibliothèque
                            </button>
                            <button
                                onClick={() => setView('upload')}
                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${view === 'upload' ? 'bg-white shadow-sm text-emerald-950' : 'text-gray-500 hover:text-emerald-950'}`}
                            >
                                Téléverser
                            </button>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:text-emerald-950 transition-all">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-10 bg-gray-50/50">
                    {view === 'upload' ? (
                        <MediaUploader onUploadComplete={() => { fetchAssets(); setView('grid'); }} />
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {assets.map((asset) => (
                                <div
                                    key={asset.id}
                                    onClick={() => onSelect(asset.public_url, asset.id)}
                                    className="group relative cursor-pointer bg-white rounded-2xl p-2 shadow-sm border border-transparent hover:border-emerald-500 hover:shadow-lg transition-all"
                                >
                                    <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                                        <img src={asset.public_url} alt={asset.filename} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="mt-2 px-1">
                                        <p className="text-[10px] font-bold text-gray-400 truncate">{asset.filename}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
