import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { Loader2, Calendar, User, ArrowRight, AlertCircle } from 'lucide-react';

interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image_url: string;
    published_at: string;
    created_at: string;
}

export const Blog: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('is_published', true)
                .order('published_at', { ascending: false });

            if (error) throw error;
            setPosts(data || []);
        } catch (err: any) {
            console.error('Error fetching posts:', err.message);
            setError('Impossible de charger les articles pour le moment.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#041a14] flex items-center justify-center">
                <Loader2 className="animate-spin text-[#d4af37]" size={48} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#041a14] flex flex-col items-center justify-center text-white px-6 text-center">
                <AlertCircle size={48} className="text-red-400 mb-6" />
                <h2 className="text-2xl serif mb-4">Une erreur est survenue</h2>
                <p className="text-white/60 mb-8">{error}</p>
                <button
                    onClick={fetchPosts}
                    className="px-8 py-3 bg-[#d4af37] text-emerald-950 font-bold uppercase tracking-widest text-xs hover:bg-white transition-all"
                >
                    Réessayer
                </button>
            </div>
        );
    }

    return (
        <section id="blog" className="pt-40 pb-32 bg-[#041a14] min-h-screen text-white">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-24">
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[#d4af37] uppercase tracking-[0.4em] text-xs font-bold mb-6 block"
                    >
                        Journal Artistique
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl serif text-white mb-8"
                    >
                        Pensées & Inspirations
                    </motion.h2>
                    <div className="w-24 h-px bg-[#d4af37]/50 mx-auto" />
                </div>

                {posts.length === 0 ? (
                    <div className="text-center py-20 border border-white/10 rounded-[2rem] bg-white/5">
                        <h3 className="text-2xl serif text-white/50 mb-4">Aucun article publié pour le moment.</h3>
                        <p className="text-white/30 italic">Revenez bientôt pour découvrir les nouvelles réflexions de l'artiste.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {posts.map((post, index) => (
                            <motion.article
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group cursor-pointer"
                            >
                                <div className="aspect-[4/3] overflow-hidden rounded-2xl mb-8 relative">
                                    <div className="absolute inset-0 bg-emerald-950/20 group-hover:bg-transparent transition-colors z-10" />
                                    {post.image_url ? (
                                        <img
                                            src={post.image_url}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-emerald-900 flex items-center justify-center text-emerald-800">
                                            <Calendar size={48} />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 text-xs text-[#d4af37] uppercase tracking-widest font-bold">
                                        <span>{new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
                                    </div>

                                    <h3 className="text-2xl serif leading-tight group-hover:text-[#d4af37] transition-colors">
                                        {post.title}
                                    </h3>

                                    <p className="text-white/60 line-clamp-3 leading-relaxed text-sm">
                                        {post.excerpt || post.content.substring(0, 150)}...
                                    </p>

                                    <div className="pt-4 flex items-center gap-2 text-[#d4af37] text-xs font-bold uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                                        Lire la suite <ArrowRight size={14} />
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};
