import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight, Calendar, Loader2 } from 'lucide-react';
<<<<<<< HEAD
import { useI18n } from '../i18n/I18nContext';
import { supabase } from '../supabaseClient';
=======
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../supabaseClient';
import { getLocale } from '../utils/localization';
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f

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
<<<<<<< HEAD
  const { language, messages } = useI18n();
=======
  const { language, t } = useLanguage();
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
<<<<<<< HEAD

        const { data, error: postError } = await supabase
          .from('posts')
          .select('*')
          .eq('is_published', true)
          .order('published_at', { ascending: false });

        if (postError) {
          throw postError;
        }

        setPosts(data || []);
      } catch (caughtError: any) {
        console.error('Error fetching posts:', caughtError.message);
        setError(messages.blog.loadError);
=======
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
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
<<<<<<< HEAD
  }, [messages.blog.loadError]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#041a14] flex items-center justify-center">
=======
  }, [t]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#041a14]">
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
        <Loader2 className="animate-spin text-[#d4af37]" size={48} />
      </div>
    );
  }

  if (error) {
    return (
<<<<<<< HEAD
      <div className="min-h-screen bg-[#041a14] flex flex-col items-center justify-center text-white px-6 text-center">
        <AlertCircle size={48} className="text-red-400 mb-6" />
        <h2 className="text-2xl serif mb-4">{messages.blog.errorTitle}</h2>
        <p className="text-white/60 mb-8">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-[#d4af37] text-emerald-950 font-bold uppercase tracking-widest text-xs hover:bg-white transition-all"
        >
          {messages.blog.retry}
=======
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#041a14] px-6 text-center text-white">
        <AlertCircle size={48} className="mb-6 text-red-400" />
        <h2 className="mb-4 text-2xl serif">{t('blog.errorTitle')}</h2>
        <p className="mb-8 text-white/60">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#d4af37] px-8 py-3 text-xs font-bold uppercase tracking-widest text-emerald-950 transition-all hover:bg-white"
        >
          {t('common.retry')}
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
        </button>
      </div>
    );
  }

<<<<<<< HEAD
  const locale = language === 'fr' ? 'fr-FR' : 'en-US';

  return (
    <section id="blog" className="pt-40 pb-32 bg-[#041a14] min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#d4af37] uppercase tracking-[0.4em] text-xs font-bold mb-6 block"
          >
            {messages.blog.badge}
=======
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
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
<<<<<<< HEAD
            className="text-5xl md:text-7xl serif text-white mb-8"
          >
            {messages.blog.title}
          </motion.h2>
          <div className="w-24 h-px bg-[#d4af37]/50 mx-auto" />
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 border border-white/10 rounded-[2rem] bg-white/5">
            <h3 className="text-2xl serif text-white/50 mb-4">{messages.blog.emptyTitle}</h3>
            <p className="text-white/30 italic">{messages.blog.emptyText}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
=======
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
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
              >
<<<<<<< HEAD
                <div className="aspect-[4/3] overflow-hidden rounded-2xl mb-8 relative">
                  <div className="absolute inset-0 bg-emerald-950/20 group-hover:bg-transparent transition-colors z-10" />
=======
                <div className="relative mb-8 aspect-[4/3] overflow-hidden rounded-2xl">
                  <div className="absolute inset-0 z-10 bg-emerald-950/20 transition-colors group-hover:bg-transparent" />
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
                  {post.image_url ? (
                    <img
                      src={post.image_url}
                      alt={post.title}
<<<<<<< HEAD
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-emerald-900 flex items-center justify-center text-emerald-800">
=======
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-emerald-900 text-emerald-800">
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
                      <Calendar size={48} />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
<<<<<<< HEAD
                  <div className="flex items-center gap-4 text-xs text-[#d4af37] uppercase tracking-widest font-bold">
                    <span>{new Date(post.published_at || post.created_at).toLocaleDateString(locale)}</span>
                  </div>

                  <h3 className="text-2xl serif leading-tight group-hover:text-[#d4af37] transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-white/60 line-clamp-3 leading-relaxed text-sm">
                    {post.excerpt || `${post.content.substring(0, 150)}...`}
                  </p>

                  <div className="pt-4 flex items-center gap-2 text-[#d4af37] text-xs font-bold uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                    {messages.blog.readMore} <ArrowRight size={14} />
=======
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
>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
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
