import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { Palette, ArrowRight, Search, X } from 'lucide-react';

interface ArtistsProps {
    onArtistSelect: (authorId: string) => void;
}

const Artists: React.FC<ArtistsProps> = ({ onArtistSelect }) => {
    const [artists, setArtists] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [artworkCounts, setArtworkCounts] = useState<Record<string, number>>({});
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchArtists();
    }, []);

    const fetchArtists = async () => {
        setLoading(true);

        // Fetch all artists
        const { data: authorsData } = await supabase
            .from('authors')
            .select('*')
            .order('name', { ascending: true });

        if (authorsData && authorsData.length > 0) {
            setArtists(authorsData);

            // Fix N+1: single query to get all active artworks grouped by author
            const authorIds = authorsData.map(a => a.id);
            const { data: artworksData } = await supabase
                .from('artworks')
                .select('author_id')
                .in('author_id', authorIds)
                .eq('is_active', true);

            // Count per author in JS — O(n) instead of N queries
            const counts: Record<string, number> = {};
            authorIds.forEach(id => { counts[id] = 0; });
            artworksData?.forEach(aw => {
                if (counts[aw.author_id] !== undefined) {
                    counts[aw.author_id]++;
                }
            });
            setArtworkCounts(counts);
        }

        setLoading(false);
    };

    const filteredArtists = useMemo(() => {
        if (!searchQuery.trim()) return artists;
        const q = searchQuery.toLowerCase();
        return artists.filter(a =>
            a.name?.toLowerCase().includes(q) ||
            a.bio?.toLowerCase().includes(q)
        );
    }, [artists, searchQuery]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fcfcf9] pt-40 pb-20 px-6 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
                    <span className="text-emerald-700/60 text-sm font-medium uppercase tracking-widest">Chargement…</span>
                </div>
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-[#fcfcf9] pt-32 pb-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12 sm:mb-16"
                >
                    <span className="text-[#d4af37] uppercase tracking-[0.4em] text-[10px] sm:text-xs font-bold mb-4 block">
                        Nos Créateurs
                    </span>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl serif text-emerald-950 mb-6 leading-tight">
                        Les Artistes<br />Exposés
                    </h1>
                    <div className="h-0.5 w-16 bg-[#d4af37] mx-auto mb-8" />
                    <p className="text-base sm:text-lg text-emerald-950/55 max-w-xl mx-auto leading-relaxed">
                        Découvrez les talents exceptionnels qui donnent vie à notre galerie.
                        Chaque artiste apporte sa vision unique de l'art.
                    </p>
                </motion.div>

                {/* Search bar */}
                {artists.length > 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="max-w-lg mx-auto mb-12 relative group"
                    >
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                            <Search size={16} className="text-emerald-950/30 group-focus-within:text-[#d4af37] transition-colors duration-200" />
                        </div>
                        <input
                            type="text"
                            placeholder="Rechercher un artiste…"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            aria-label="Rechercher un artiste"
                            className="w-full h-[52px] bg-white border-2 border-emerald-950/10 pl-12 pr-11 rounded-2xl shadow-sm focus:outline-none focus:border-[#d4af37] focus:shadow-[0_0_0_4px_rgba(212,175,55,0.08)] transition-all duration-200 text-sm placeholder:text-emerald-950/35 text-emerald-950 font-medium"
                        />
                        {searchQuery.length > 0 && (
                            <button
                                onClick={() => setSearchQuery('')}
                                aria-label="Effacer"
                                className="absolute inset-y-0 right-4 flex items-center justify-center w-7 h-7 my-auto rounded-full bg-emerald-950/5 hover:bg-emerald-950/10 text-emerald-950/40 hover:text-emerald-950 transition-all"
                            >
                                <X size={13} />
                            </button>
                        )}
                    </motion.div>
                )}

                {/* Artists Grid */}
                {filteredArtists.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
                        {filteredArtists.map((artist, index) => (
                            <motion.div
                                key={artist.id}
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                                className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-emerald-950/5 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group"
                            >
                                {/* Artist Image */}
                                <div className="aspect-[3/4] overflow-hidden relative bg-gradient-to-br from-emerald-50 to-emerald-100">
                                    {artist.avatar_url ? (
                                        <img
                                            src={artist.avatar_url}
                                            alt={artist.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-emerald-200 text-[100px] font-serif font-bold select-none">
                                            {artist.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-emerald-950/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Artwork count badge */}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <Palette size={12} className="text-[#d4af37]" />
                                        <span className="text-[11px] font-black text-emerald-950">
                                            {artworkCounts[artist.id] || 0} œuvre{(artworkCounts[artist.id] || 0) !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                </div>

                                {/* Artist Info */}
                                <div className="p-6 sm:p-7 space-y-5">
                                    <div>
                                        <h3 className="text-xl sm:text-2xl serif text-emerald-950 font-bold mb-2 group-hover:text-emerald-700 transition-colors leading-tight">
                                            {artist.name}
                                        </h3>
                                        <p className="text-emerald-950/55 text-sm leading-relaxed line-clamp-3 italic">
                                            {artist.bio || 'Artiste contemporain passionné par la création visuelle.'}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-emerald-950/5">
                                        {/* Piece count */}
                                        <div className="flex items-center gap-2.5">
                                            <Palette className="text-emerald-600/60" size={16} />
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-xl font-black text-emerald-950">{artworkCounts[artist.id] || 0}</span>
                                                <span className="text-[9px] uppercase tracking-widest text-emerald-950/35 font-black">Œuvres</span>
                                            </div>
                                        </div>

                                        {/* CTA */}
                                        <button
                                            onClick={() => onArtistSelect(artist.id)}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-950 text-[#d4af37] rounded-full hover:bg-emerald-800 hover:gap-3 transition-all duration-200 shadow-md text-[11px] font-black uppercase tracking-wider"
                                        >
                                            Voir les œuvres
                                            <ArrowRight size={13} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    /* Empty / No search results */
                    <div className="text-center py-24">
                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Palette className="text-emerald-300" size={40} />
                        </div>
                        {searchQuery ? (
                            <>
                                <h3 className="text-2xl serif text-emerald-950 mb-3">Aucun résultat</h3>
                                <p className="text-emerald-950/50 mb-6 text-sm">Aucun artiste ne correspond à « {searchQuery} »</p>
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="px-6 py-2.5 rounded-full border border-emerald-950/20 text-emerald-950 text-sm font-bold hover:bg-emerald-50 transition-colors"
                                >
                                    Réinitialiser la recherche
                                </button>
                            </>
                        ) : (
                            <>
                                <h3 className="text-2xl serif text-emerald-950 mb-3">Aucun artiste pour le moment</h3>
                                <p className="text-emerald-950/50 text-sm">Les profils d'artistes seront bientôt disponibles.</p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Artists;
