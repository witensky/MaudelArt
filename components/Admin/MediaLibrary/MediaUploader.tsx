import React, { useState, useRef } from 'react';
import { supabase } from '../../../supabaseClient';
import { Upload, Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface MediaUploaderProps {
    onUploadComplete: () => void;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({ onUploadComplete }) => {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        const files = Array.from(e.target.files);

        try {
            for (const file of files) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${uuidv4()}.${fileExt}`;
                const filePath = `${fileName}`;

                // 1. Upload to Storage
                const { error: uploadError } = await supabase.storage
                    .from('images') // Assumes bucket 'images' exists
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                // 2. Get Public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('images')
                    .getPublicUrl(filePath);

                // 3. Insert into DB
                const { error: dbError } = await supabase.from('media_assets').insert({
                    filename: file.name,
                    storage_path: filePath,
                    public_url: publicUrl,
                    size: file.size,
                    mime_type: file.type,
                    credit: 'Admin', // Default for now
                    alt_text: file.name.split('.')[0]
                });

                if (dbError) throw dbError;
            }
            onUploadComplete();
        } catch (error: any) {
            alert('Erreur lors de l\'upload: ' + error.message);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-emerald-950/10 rounded-[2rem] p-6 md:p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-emerald-50/50 hover:border-emerald-500/30 transition-all group relative bg-white"
        >
            <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleUpload}
                disabled={uploading}
            />

            {uploading ? (
                <Loader2 className="animate-spin text-emerald-600 mb-4" size={48} />
            ) : (
                <div className="w-16 h-16 bg-emerald-100 rounded-3xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform shadow-sm">
                    <Upload size={32} />
                </div>
            )}

            <h3 className="text-xl font-serif text-emerald-950 font-bold mb-2">
                {uploading ? 'Téléversement en cours...' : 'Cliquez pour ajouter des images'}
            </h3>
            <p className="text-gray-400 text-sm max-w-xs mx-auto">
                Supporte JPG, PNG, WEBP. Plusieurs fichiers possibles.
            </p>
        </div>
    );
};
