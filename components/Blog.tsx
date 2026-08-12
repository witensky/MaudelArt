import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight, Calendar, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../supabaseClient';
import { getLocale } from '../utils/localization';

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

const FALLBACK_POSTS: Post[] = [
  {
    id: 'atelier-lumiere-couleur',
    title: "L'atelier comme lieu de lumiere",
    slug: 'atelier-lumiere-couleur',
    excerpt: "Dans la pratique de Marie Maude Eliacin, la lumiere n'est pas seulement un effet visuel. Elle devient une facon de guider le regard, d'installer le calme et de donner aux couleurs leur respiration.",
    content: "Dans la pratique de Marie Maude Eliacin, la lumiere n'est pas seulement un effet visuel. Elle devient une facon de guider le regard, d'installer le calme et de donner aux couleurs leur respiration. Chaque composition cherche un equilibre entre observation, souvenir et emotion.",
    image_url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=1200',
    published_at: '2026-08-12',
    created_at: '2026-08-12',
  },
  {
    id: 'collectionner-oeuvre-originale',
    title: 'Collectionner une oeuvre originale',
    slug: 'collectionner-oeuvre-originale',
    excerpt: "Choisir une oeuvre originale commence par une rencontre : une texture, une couleur, un silence ou un detail qui continue d'exister apres le premier regard.",
    content: "Choisir une oeuvre originale commence par une rencontre : une texture, une couleur, un silence ou un detail qui continue d'exister apres le premier regard. MaudelArt accompagne cette rencontre avec des informations claires sur les techniques, dimensions et conditions d'acquisition.",
    image_url: 'https://images.unsplash.com/photo-1578926375605-eaf7559b1458?auto=format&fit=crop&q=80&w=1200',
    published_at: '2026-08-05',
    created_at: '2026-08-05',
  },
  {
    id: 'matiere-huile-fusain',
    title: "Huile, fusain et patience du detail",
    slug: 'matiere-huile-fusain',
    excerpt: "L'huile apporte profondeur et vibration, tandis que le fusain garde la trace directe du geste. Ensemble, ces matieres ouvrent un dialogue entre construction et intuition.",
    content: "L'huile apporte profondeur et vibration, tandis que le fusain garde la trace directe du geste. Ensemble, ces matieres ouvrent un dialogue entre construction et intuition. Le detail n'est pas decoratif : il donne une presence concrete a la nature, aux visages et aux objets.",
    image_url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=1200',
    published_at: '2026-07-28',
    created_at: '2026-07-28',
  },
];

export const Blog: React.FC = () => {
  const { language, t } = useLanguage();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const { data, error: requestError } = await supabase
          .from('posts')
          .select('*')
          .eq('is_published', true)
          .order('published_at', { ascending: false });

        if (requestError) {
          throw requestError;
        }

        setPosts(data || []);
      } catch (err: any) {
        console.error('Error fetching posts:', err.message);
        setError(t('blog.errorLoading'));
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [t]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#041a14]">
        <Loader2 className="animate-spin text-[#d4af37]" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#041a14] px-6 text-center text-white">
        <AlertCircle size={48} className="mb-6 text-red-400" />
        <h2 className="mb-4 text-2xl serif">{t('blog.errorTitle')}</h2>
        <p className="mb-8 text-white/60">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#d4af37] px-8 py-3 text-xs font-bold uppercase tracking-widest text-emerald-950 transition-all hover:bg-white"
        >
          {t('common.retry')}
        </button>
      </div>
    );
  }

  const visiblePosts = posts.length > 0 ? posts : FALLBACK_POSTS;

  return (
    <section id="blog" className="min-h-screen bg-[#041a14] pb-32 pt-40 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-24 text-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 block text-xs font-bold uppercase tracking-[0.4em] text-[#d4af37]"
          >
            {t('blog.titleLabel')}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-5xl text-white md:text-7xl serif"
          >
            {t('blog.title')}
          </motion.h2>
          <div className="mx-auto h-px w-24 bg-[#d4af37]/50" />
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {visiblePosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative mb-8 aspect-[4/3] overflow-hidden rounded-2xl">
                  <div className="absolute inset-0 z-10 bg-emerald-950/20 transition-colors group-hover:bg-transparent" />
                  {post.image_url ? (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-emerald-900 text-emerald-800">
                      <Calendar size={48} />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-[#d4af37]">
                    <span>
                      {new Date(post.published_at || post.created_at).toLocaleDateString(getLocale(language))}
                    </span>
                  </div>

                  <h3 className="text-2xl leading-tight transition-colors group-hover:text-[#d4af37] serif">
                    {post.title}
                  </h3>

                  <p className="line-clamp-3 text-sm leading-relaxed text-white/60">
                    {post.excerpt || `${post.content.substring(0, 150)}...`}
                  </p>

                  <div className="flex items-center gap-2 pt-4 text-xs font-bold uppercase tracking-widest text-[#d4af37] transition-transform group-hover:translate-x-2">
                    {t('blog.readMore')}
                    <ArrowRight size={14} />
                  </div>
                </div>
              </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
