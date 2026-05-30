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

        {posts.length === 0 ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/5 py-20 text-center">
            <h3 className="mb-4 text-2xl text-white/50 serif">{t('blog.emptyTitle')}</h3>
            <p className="italic text-white/30">{t('blog.emptyDescription')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
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
        )}
      </div>
    </section>
  );
};

export default Blog;
