import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Palette, Search, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../supabaseClient';
import { getErrorMessage, isAbortLikeError } from '../utils/errors';

interface ArtistsProps {
  onArtistSelect: (authorId: string) => void;
}

const Artists: React.FC<ArtistsProps> = ({ onArtistSelect }) => {
  const { t } = useLanguage();
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [artworkCounts, setArtworkCounts] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [hasLoadError, setHasLoadError] = useState(false);
  const [reloadTick, setReloadTick] = useState(0);

  const retryLoad = () => setReloadTick((tick) => tick + 1);

  useEffect(() => {
    let isMounted = true;

    const fetchArtists = async () => {
      try {
        setLoading(true);
        setHasLoadError(false);

        const { data: authorsData, error: authorsError } = await supabase
          .from('authors')
          .select('*')
          .order('name', { ascending: true });

        if (authorsError) {
          throw authorsError;
        }

        if (!isMounted) {
          return;
        }

        if (authorsData && authorsData.length > 0) {
          setArtists(authorsData);

          const authorIds = authorsData.map((artist) => artist.id);
          const { data: artworksData, error: artworksError } = await supabase
            .from('artworks')
            .select('author_id')
            .in('author_id', authorIds)
            .eq('is_active', true);

          if (artworksError) {
            throw artworksError;
          }

          if (!isMounted) {
            return;
          }

          const counts: Record<string, number> = {};
          authorIds.forEach((id) => { counts[id] = 0; });
          artworksData?.forEach((artwork) => {
            if (counts[artwork.author_id] !== undefined) {
              counts[artwork.author_id] += 1;
            }
          });

          setArtworkCounts(counts);
        } else {
          setArtists([]);
          setArtworkCounts({});
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (isAbortLikeError(error)) {
          return;
        }

        console.error('Error loading artists:', getErrorMessage(error));
        setHasLoadError(true);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchArtists();

    return () => {
      isMounted = false;
    };
  }, [reloadTick]);

  const filteredArtists = useMemo(() => {
    if (!searchQuery.trim()) {
      return artists;
    }

    const query = searchQuery.toLowerCase();
    return artists.filter((artist) => (
      artist.name?.toLowerCase().includes(query) ||
      artist.bio?.toLowerCase().includes(query)
    ));
  }, [artists, searchQuery]);

  const getArtworkCountLabel = (count: number) => {
    return count === 1
      ? t('artists.workCount', { count })
      : t('artists.workCountPlural', { count });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fcfcf9] px-6 pb-20 pt-40">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-600" />
          <span className="text-sm font-medium uppercase tracking-widest text-emerald-700/60">
            {t('artists.loading')}
          </span>
        </div>
      </div>
    );
  }

  if (hasLoadError && artists.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fcfcf9] px-6 pb-20 pt-40">
        <div className="w-full max-w-md rounded-3xl border border-emerald-950/10 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
            <Palette className="text-emerald-600" size={20} />
          </div>
          <h2 className="mb-2 text-2xl text-emerald-950 serif">{t('common.loadErrorTitle')}</h2>
          <p className="mb-6 text-sm leading-relaxed text-emerald-950/50">{t('common.loadErrorDescription')}</p>
          <button
            onClick={retryLoad}
            className="rounded-full bg-emerald-950 px-6 py-3 text-[11px] font-black uppercase tracking-wider text-[#d4af37] shadow-md transition-colors hover:bg-emerald-800"
          >
            {t('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#fcfcf9] px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center sm:mb-16"
        >
          <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.4em] text-[#d4af37] sm:text-xs">
            {t('artists.titleLabel')}
          </span>
          <h1 className="mb-6 text-4xl leading-tight text-emerald-950 sm:text-5xl md:text-6xl lg:text-7xl serif">
            {t('artists.title')}
          </h1>
          <div className="mx-auto mb-8 h-0.5 w-16 bg-[#d4af37]" />
          <p className="mx-auto max-w-xl text-base leading-relaxed text-emerald-950/55 sm:text-lg">
            {t('artists.description')}
          </p>
        </motion.div>

        {artists.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="group relative mx-auto mb-12 max-w-lg"
          >
            <div className="pointer-events-none absolute inset-y-0 left-5 flex items-center">
              <Search size={16} className="text-emerald-950/30 transition-colors duration-200 group-focus-within:text-[#d4af37]" />
            </div>
            <input
              type="text"
              placeholder={t('artists.searchPlaceholder')}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              aria-label={t('artists.searchLabel')}
              className="h-[52px] w-full rounded-2xl border-2 border-emerald-950/10 bg-white pl-12 pr-11 text-sm font-medium text-emerald-950 shadow-sm transition-all duration-200 placeholder:text-emerald-950/35 focus:border-[#d4af37] focus:outline-none focus:shadow-[0_0_0_4px_rgba(212,175,55,0.08)]"
            />
            {searchQuery.length > 0 && (
              <button
                onClick={() => setSearchQuery('')}
                aria-label={t('artists.clearSearch')}
                className="absolute inset-y-0 right-4 my-auto flex h-7 w-7 items-center justify-center rounded-full bg-emerald-950/5 text-emerald-950/40 transition-all hover:bg-emerald-950/10 hover:text-emerald-950"
              >
                <X size={13} />
              </button>
            )}
          </motion.div>
        )}

        {filteredArtists.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3 lg:gap-10">
            {filteredArtists.map((artist, index) => {
              const count = artworkCounts[artist.id] || 0;

              return (
                <motion.div
                  key={artist.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="group overflow-hidden rounded-[2rem] border border-emerald-950/5 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-emerald-50 to-emerald-100">
                    {artist.avatar_url ? (
                      <img
                        src={artist.avatar_url}
                        alt={artist.name}
                        className="h-full w-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full select-none items-center justify-center text-[100px] font-bold text-emerald-200 font-serif">
                        {artist.name?.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-emerald-950/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100 backdrop-blur-sm">
                      <Palette size={12} className="text-[#d4af37]" />
                      <span className="text-[11px] font-black text-emerald-950">
                        {getArtworkCountLabel(count)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-5 p-6 sm:p-7">
                    <div>
                      <h3 className="mb-2 text-xl font-bold leading-tight text-emerald-950 transition-colors group-hover:text-emerald-700 sm:text-2xl serif">
                        {artist.name}
                      </h3>
                      <p className="line-clamp-3 text-sm italic leading-relaxed text-emerald-950/55">
                        {artist.bio || t('artists.defaultBio')}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-emerald-950/5 pt-4">
                      <div className="flex items-center gap-2.5">
                        <Palette className="text-emerald-600/60" size={16} />
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-black text-emerald-950">{count}</span>
                          <span className="text-[9px] font-black uppercase tracking-widest text-emerald-950/35">
                            {t('artists.worksLabel')}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onArtistSelect(artist.id)}
                        className="flex items-center gap-2 rounded-full bg-emerald-950 px-5 py-2.5 text-[11px] font-black uppercase tracking-wider text-[#d4af37] shadow-md transition-all duration-200 hover:gap-3 hover:bg-emerald-800"
                      >
                        {t('artists.seeWorks')}
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="py-24 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
              <Palette className="text-emerald-300" size={40} />
            </div>
            {searchQuery ? (
              <>
                <h3 className="mb-3 text-2xl text-emerald-950 serif">{t('artists.noResultsTitle')}</h3>
                <p className="mb-6 text-sm text-emerald-950/50">
                  {t('artists.noResultsDescription', { query: searchQuery })}
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="rounded-full border border-emerald-950/20 px-6 py-2.5 text-sm font-bold text-emerald-950 transition-colors hover:bg-emerald-50"
                >
                  {t('artists.resetSearch')}
                </button>
              </>
            ) : (
              <>
                <h3 className="mb-3 text-2xl text-emerald-950 serif">{t('artists.emptyTitle')}</h3>
                <p className="text-sm text-emerald-950/50">{t('artists.emptyDescription')}</p>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Artists;
