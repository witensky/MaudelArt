import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight, Calendar, Loader2 } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { supabase } from '../supabaseClient';

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
  const { language, messages } = useI18n();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [messages.blog.loadError]);

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
        <h2 className="text-2xl serif mb-4">{messages.blog.errorTitle}</h2>
        <p className="text-white/60 mb-8">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-[#d4af37] text-emerald-950 font-bold uppercase tracking-widest text-xs hover:bg-white transition-all"
        >
          {messages.blog.retry}
        </button>
      </div>
    );
  }

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
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
