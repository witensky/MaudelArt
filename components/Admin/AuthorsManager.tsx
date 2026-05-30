import React, { useEffect, useState } from 'react';
import { Image as ImageIcon, Loader2, Pencil, Plus, Trash2, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../../supabaseClient';

export const AuthorsManager = () => {
  const [authors, setAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [artworksCount, setArtworksCount] = useState<Record<string, number>>({});
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    bio: '',
    bio_en: '',
    avatar_url: '',
  });

  useEffect(() => {
    const fetchAuthors = async () => {
      setLoading(true);
      const { data: authorsData } = await supabase.from('authors').select('*').order('created_at', { ascending: false });

      if (authorsData) {
        setAuthors(authorsData);

        const authorIds = authorsData.map((author) => author.id);
        const { data: artworksData } = await supabase
          .from('artworks')
          .select('author_id')
          .in('author_id', authorIds);

        const counts: Record<string, number> = {};
        authorIds.forEach((id) => { counts[id] = 0; });
        artworksData?.forEach((artwork) => {
          if (counts[artwork.author_id] !== undefined) {
            counts[artwork.author_id] += 1;
          }
        });
        setArtworksCount(counts);
      }

      setLoading(false);
    };

    fetchAuthors();
  }, []);

  const resetForm = () => {
    setFormData({ id: '', name: '', bio: '', bio_en: '', avatar_url: '' });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) {
      return;
    }

    setUploading(true);
    try {
      const file = event.target.files[0];
      const fileName = `${uuidv4()}.${file.name.split('.').pop()}`;
      const { error } = await supabase.storage.from('images').upload(fileName, file);

      if (!error) {
        const { data } = supabase.storage.from('images').getPublicUrl(fileName);
        setFormData((previous) => ({ ...previous, avatar_url: data.publicUrl }));
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('authors').upsert({
      id: formData.id || uuidv4(),
      name: formData.name,
      bio: formData.bio,
      bio_en: formData.bio_en,
      avatar_url: formData.avatar_url,
    });

    if (!error) {
      setIsModalOpen(false);
      resetForm();
      const { data } = await supabase.from('authors').select('*').order('created_at', { ascending: false });
      setAuthors(data || []);
    }

    setLoading(false);
  };

  const deleteAuthor = async (id: string) => {
    if (!window.confirm("Supprimer cet artiste ? Ses oeuvres ne seront pas supprimees.")) {
      return;
    }

    await supabase.from('authors').delete().eq('id', id);
    setAuthors((previous) => previous.filter((author) => author.id !== id));
  };

  if (loading && !isModalOpen) {
    return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-emerald-600" size={48} /></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between rounded-[2.5rem] border border-emerald-950/5 bg-white p-8 shadow-sm">
        <div>
          <h2 className="mb-1 text-4xl font-bold text-emerald-950 font-serif">Gestion des artistes</h2>
          <p className="text-gray-500">Ajoutez et editez les biographies FR / EN des artistes exposes.</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center gap-3 rounded-2xl bg-emerald-600 px-8 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-emerald-500/20 transition-all hover:bg-emerald-500"
        >
          <Plus size={20} /> Creer un artiste
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {authors.map((author) => (
          <div key={author.id} className="group rounded-[2rem] border border-emerald-950/5 bg-white p-8 shadow-sm transition-all hover:shadow-xl">
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="group/avatar relative mb-6 h-32 w-32 overflow-hidden rounded-full border-4 border-emerald-50 shadow-lg">
                {author.avatar_url ? (
                  <img src={author.avatar_url} alt={author.name} className="h-full w-full object-cover transition-transform duration-700 group-hover/avatar:scale-110" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-200 text-4xl font-bold text-emerald-600 font-serif">
                    {author.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <h3 className="mb-2 text-2xl font-bold text-emerald-950 font-serif">{author.name}</h3>
              <p className="mb-2 line-clamp-3 text-sm italic leading-relaxed text-gray-500">
                {author.bio || 'Aucune biographie disponible.'}
              </p>
              <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-gray-400">
                {author.bio_en || 'No English biography yet.'}
              </p>
              <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2">
                <span className="text-lg font-bold text-emerald-600">{artworksCount[author.id] || 0}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60">Oeuvres</span>
              </div>
            </div>

            <div className="flex gap-3 border-t border-gray-100 pt-6">
              <button
                onClick={() => {
                  setFormData({
                    id: author.id,
                    name: author.name || '',
                    bio: author.bio || '',
                    bio_en: author.bio_en || '',
                    avatar_url: author.avatar_url || '',
                  });
                  setIsModalOpen(true);
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-50 px-4 py-3 text-sm font-bold text-gray-600 transition-all hover:bg-emerald-50 hover:text-emerald-600"
              >
                <Pencil size={16} /> Modifier
              </button>
              <button onClick={() => deleteAuthor(author.id)} className="rounded-xl bg-gray-50 px-4 py-3 text-gray-600 transition-all hover:bg-red-50 hover:text-red-500">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-3xl overflow-hidden rounded-[3rem] border border-white/20 bg-[#fcfcf9] shadow-2xl">
            <div className="flex items-center justify-between border-b border-emerald-950/5 bg-white px-10 py-8">
              <h3 className="text-2xl font-bold text-emerald-950 font-serif">
                {formData.id ? "Modifier l'artiste" : 'Creer un nouveau profil'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-gray-400 transition-all hover:text-emerald-950 shadow-inner">
                <X size={24} />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4 h-40 w-40 overflow-hidden rounded-full border-4 border-emerald-100 shadow-xl">
                    {formData.avatar_url ? (
                      <img src={formData.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-400">
                        <ImageIcon size={48} />
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 cursor-pointer opacity-0" disabled={uploading} />
                    {uploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/90">
                        <Loader2 className="animate-spin text-emerald-600" size={32} />
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Cliquez pour changer la photo</span>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40">Nom complet de l'artiste</label>
                  <input
                    value={formData.name}
                    onChange={(event) => setFormData((previous) => ({ ...previous, name: event.target.value }))}
                    className="w-full rounded-2xl border border-emerald-950/10 bg-white p-4 font-bold text-emerald-950 outline-none transition-all focus:border-emerald-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40">Biographie FR</label>
                    <textarea
                      value={formData.bio}
                      onChange={(event) => setFormData((previous) => ({ ...previous, bio: event.target.value }))}
                      className="h-48 w-full resize-none rounded-2xl border border-emerald-950/10 bg-white p-6 leading-relaxed text-emerald-950 outline-none transition-all focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40">Biography EN</label>
                    <textarea
                      value={formData.bio_en}
                      onChange={(event) => setFormData((previous) => ({ ...previous, bio_en: event.target.value }))}
                      className="h-48 w-full resize-none rounded-2xl border border-emerald-950/10 bg-white p-6 leading-relaxed text-emerald-950 outline-none transition-all focus:border-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-emerald-900 py-5 text-xs font-black uppercase tracking-[0.4em] text-[#d4af37] shadow-2xl shadow-emerald-950/20 transition-all hover:bg-emerald-950 disabled:opacity-50"
                >
                  {loading ? 'Enregistrement...' : (formData.id ? 'Mettre a jour' : 'Creer le profil')}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
