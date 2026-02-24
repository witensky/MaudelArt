import React, { useCallback } from 'react';
import { Trash2, Copy, Check } from 'lucide-react';
import { supabase } from '../../../supabaseClient';

interface MediaGridProps {
    assets: any[];
    onDelete: (id: string, path: string) => void;
}

interface MediaCardProps {
    asset: any;
    isCopied: boolean;
    onCopy: (url: string, id: string) => void;
    onDelete: (id: string, path: string) => void;
}

const MediaCard = React.memo<MediaCardProps>(({ asset, isCopied, onCopy, onDelete }) => {
    return (
        <div className="group relative bg-white rounded-3xl p-3 shadow-sm border border-emerald-950/5 hover:shadow-xl transition-all">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 relative mb-3">
                <img
                    src={asset.public_url}
                    alt={asset.alt_text || asset.filename}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                        onClick={() => onCopy(asset.public_url, asset.id)}
                        className="p-2 bg-white text-emerald-900 rounded-xl hover:scale-110 transition-transform"
                        title="Copier le lien"
                    >
                        {isCopied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                    <button
                        onClick={() => onDelete(asset.id, asset.storage_path)}
                        className="p-2 bg-red-500 text-white rounded-xl hover:scale-110 transition-transform"
                        title="Supprimer"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
            <div className="px-2">
                <p className="text-xs font-bold text-emerald-950 truncate" title={asset.filename}>{asset.filename}</p>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{Math.round(asset.size / 1024)} KB</p>
            </div>
        </div>
    );
});

export const MediaGrid: React.FC<MediaGridProps> = ({ assets, onDelete }) => {
    const [copiedId, setCopiedId] = React.useState<string | null>(null);

    const handleCopy = useCallback((url: string, id: string) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    }, []);

    if (assets.length === 0) {
        return (
            <div className="text-center py-20 text-gray-400">
                Aucune image dans la médiathèque. Commencer par en ajouter.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {assets.map((asset) => (
                <MediaCard
                    key={asset.id}
                    asset={asset}
                    isCopied={copiedId === asset.id}
                    onCopy={handleCopy}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};
