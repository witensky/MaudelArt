import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { Palette, ArrowRight } from 'lucide-react';

interface ArtistsProps {
    onArtistSelect: (authorId: string) => void;
}

const Artists: React.FC<ArtistsProps> = ({ onArtistSelect }) => {
    const [artists, setArtists] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [artworkCounts, setArtworkCounts] = useState<Record<string, number>>({});

    useEffect(() => {
        fetchArtists();
    }, []);

    const fetchArtists = async () => {
        setLoading(true);
        const { data: authorsData } = await supabase
            .from('authors')
            .select('*')
            .order('name', { ascending: true });

        if (authorsData) {
            setArtists(authorsData);

            // Get artwork count for each artist
            const counts: Record<string, number> = {};
            for (const author of authorsData) {
                const { count } = await supabase
                    .from('artworks')
                    .select('*', { count: 'exact', head: true })
                    .eq('author_id', author.id)
                    .eq('is_active', true);
                counts[author.id] = count || 0;
            }
            setArtworkCounts(counts);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fcfcf9] pt-40 pb-20 px-6 flex items-center justify-center">
                <div className="text-emerald-600 animate-pulse text-xl font-serif">Chargement des artistes...</div>
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-[#fcfcf9] pt-40 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <span className="text-[#d4af37] uppercase tracking-[0.4em] text-xs font-bold mb-6 block">
                        Nos Créateurs
                    </span>
                    <h1 className="text-6xl md:text-8xl serif text-emerald-950 mb-8 leading-tight">
                        Les Artistes<br />Exposés
                    </h1>
                    <div className="h-1 w-24 bg-[#d4af37] mx-auto mb-10" />
                    <p className="text-xl text-emerald-950/60 max-w-2xl mx-auto leading-relaxed">
                        Découvrez les talents exceptionnels qui donnent vie à notre galerie.
                        Chaque artiste apporte son univers unique et sa vision personnelle de l'art.
                    </p>
                </motion.div>

                {/* Artists Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {artists.map((artist, index) => (
                        <motion.div
                            key={artist.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-emerald-950/5 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group"
                        >
                            {/* Artist Image */}
                            <div className="aspect-[4/5] overflow-hidden relative bg-gradient-to-br from-emerald-50 to-emerald-100">
                                {artist.avatar_url ? (
                                    <img
                                        src={artist.avatar_url}
                                        alt={artist.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-emerald-300 text-[120px] font-serif font-bold">
                                        {artist.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-emerald-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>

                            {/* Artist Info */}
                            <div className="p-8 space-y-6">
                                <div>
                                    <h3 className="text-3xl serif text-emerald-950 font-bold mb-3 group-hover:text-emerald-700 transition-colors">
                                        {artist.name}
                                    </h3>
                                    <p className="text-emerald-950/60 text-sm leading-relaxed line-clamp-3 italic">
                                        {artist.bio || 'Artiste contemporain passionné par la création visuelle.'}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-emerald-950/5">
                                    <div className="flex items-center gap-3">
                                        <Palette className="text-emerald-600" size={20} />
                                        <div>
                                            <span className="text-2xl font-bold text-emerald-950">{artworkCounts[artist.id] || 0}</span>
                                            <span className="text-[10px] uppercase tracking-widest text-emerald-950/40 font-black ml-2">Œuvres</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => onArtistSelect(artist.id)}
                                        className="flex items-center gap-2 px-6 py-3 bg-emerald-950 text-[#d4af37] rounded-full hover:bg-emerald-900 transition-all shadow-lg group/btn text-xs font-black uppercase tracking-widest"
                                    >
                                        Voir
                                        <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Empty State */}
                {artists.length === 0 && (
                    <div className="text-center py-32">
                        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <Palette className="text-emerald-300" size={48} />
                        </div>
                        <h3 className="text-3xl serif text-emerald-950 mb-4">Aucun artiste pour le moment</h3>
                        <p className="text-emerald-950/60">Les profils d'artistes seront bientôt disponibles.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Artists;
