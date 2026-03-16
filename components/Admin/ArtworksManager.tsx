import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Pencil, Trash2, Plus, Loader2, X, Image as ImageIcon, LayoutGrid } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { MediaPicker } from './MediaLibrary/MediaPicker';

type GalleryImage = {
  id: string;
  url: string;
};

type FormData = {
  id: string;
  title: string;
  title_en: string;
  description: string;
  description_en: string;
  technique: string;
  technique_en: string;
  dimensions: string;
  year: string;
  price: string;
  category_id: string;
  image_url: string;
  media_asset_id: string;
  gallery_images: GalleryImage[];
  author_id: string;
  is_active: boolean;
};

const createEmptyFormData = (authorId = ''): FormData => ({
  id: '',
  title: '',
  title_en: '',
  description: '',
  description_en: '',
  technique: '',
  technique_en: '',
  dimensions: '',
  year: new Date().getFullYear().toString(),
  price: '',
  category_id: '',
  image_url: '',
  media_asset_id: '',
  gallery_images: [],
  author_id: authorId,
  is_active: true,
});

const inputClass =
  'w-full rounded-2xl border border-emerald-950/10 bg-white p-4 text-emerald-950 outline-none transition-all focus:border-emerald-500';

const labelClass = 'text-[10px] font-black uppercase tracking-widest text-emerald-900/40';

const LocalizedField = ({
  label,
  valueFr,
  valueEn,
  onFrChange,
  onEnChange,
  placeholderFr,
  placeholderEn,
  multiline = false,
}: {
  label: string;
  valueFr: string;
  valueEn: string;
  onFrChange: (value: string) => void;
  onEnChange: (value: string) => void;
  placeholderFr?: string;
  placeholderEn?: string;
  multiline?: boolean;
}) => {
  const baseClass = multiline ? `${inputClass} h-32 resize-none p-6 leading-relaxed` : inputClass;

  return (
    <div className="space-y-4">
      <label className={labelClass}>{label}</label>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Francais</span>
          {multiline ? (
            <textarea
              value={valueFr}
              onChange={(event) => onFrChange(event.target.value)}
              className={baseClass}
              placeholder={placeholderFr}
            />
          ) : (
            <input
              value={valueFr}
              onChange={(event) => onFrChange(event.target.value)}
              className={baseClass}
              placeholder={placeholderFr}
            />
          )}
        </div>
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-sky-600">English</span>
          {multiline ? (
            <textarea
              value={valueEn}
              onChange={(event) => onEnChange(event.target.value)}
              className={baseClass}
              placeholder={placeholderEn}
            />
          ) : (
            <input
              value={valueEn}
              onChange={(event) => onEnChange(event.target.value)}
              className={baseClass}
              placeholder={placeholderEn}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export const ArtworksManager = () => {
  const [artworks, setArtworks] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<'main' | 'gallery'>('main');
  const [formData, setFormData] = useState<FormData>(createEmptyFormData());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const { data: arts } = await supabase
      .from('artworks')
      .select('*, categories(name, name_en), authors(name)')
      .order('created_at', { ascending: false });

    const { data: cats } = await supabase.from('categories').select('*').order('name');
    const { data: auths } = await supabase.from('authors').select('*').order('name');

    if (arts) {
      setArtworks(arts);
    }

    if (cats) {
      setCategories(cats);
    }

    if (auths) {
      setAuthors(auths);
      setFormData((previous) => (previous.author_id ? previous : { ...previous, author_id: auths[0]?.id ?? '' }));
    }

    setLoading(false);
  };

  const resetForm = () => {
    setFormData(createEmptyFormData(authors[0]?.id ?? ''));
  };

  const handleMediaSelect = (url: string, id: string) => {
    if (mediaPickerTarget === 'main') {
      setFormData((previous) => ({ ...previous, image_url: url, media_asset_id: id }));
    } else {
      setFormData((previous) => {
        if (previous.gallery_images.some((image) => image.id === id)) {
          return previous;
        }

        return {
          ...previous,
          gallery_images: [...previous.gallery_images, { id, url }],
        };
      });
    }

    setIsMediaPickerOpen(false);
  };

  const removeGalleryImage = (index: number) => {
    setFormData((previous) => ({
      ...previous,
      gallery_images: previous.gallery_images.filter((_, imageIndex) => imageIndex !== index),
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setLoading(true);

      const dataToSave = {
        id: formData.id || uuidv4(),
        title: formData.title,
        title_en: formData.title_en || formData.title,
        description: formData.description,
        description_en: formData.description_en || formData.description,
        technique: formData.technique,
        technique_en: formData.technique_en || formData.technique,
        dimensions: formData.dimensions,
        year: formData.year,
        price: parseFloat(formData.price) || 0,
        category_id: formData.category_id || null,
        image_url: formData.image_url,
        media_asset_id: formData.media_asset_id || null,
        gallery_images: formData.gallery_images,
        author_id: formData.author_id || null,
        is_active: formData.is_active,
      };

      const { error } = await supabase.from('artworks').upsert(dataToSave);

      if (error) {
        throw error;
      }

      setIsModalOpen(false);
      resetForm();
      await fetchData();
    } catch (error: any) {
      alert(`Erreur sauvegarde: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (artwork: any) => {
    setFormData({
      id: artwork.id,
      title: artwork.title || '',
      title_en: artwork.title_en || artwork.title || '',
      description: artwork.description || '',
      description_en: artwork.description_en || artwork.description || '',
      technique: artwork.technique || '',
      technique_en: artwork.technique_en || artwork.technique || '',
      dimensions: artwork.dimensions || '',
      year: artwork.year || '',
      price: artwork.price?.toString?.() || '',
      category_id: artwork.category_id || '',
      image_url: artwork.image_url || '',
      media_asset_id: artwork.media_asset_id || '',
      gallery_images: Array.isArray(artwork.gallery_images) ? artwork.gallery_images : [],
      author_id: artwork.author_id || authors[0]?.id || '',
      is_active: artwork.is_active,
    });
    setIsModalOpen(true);
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    await supabase.from('artworks').update({ is_active: !currentStatus }).eq('id', id);
    fetchData();
  };

  const deleteArtwork = async (id: string) => {
    if (!window.confirm('Supprimer cette oeuvre ?')) {
      return;
    }

    await supabase.from('artworks').delete().eq('id', id);
    fetchData();
  };

  if (loading && !isModalOpen) {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="relative space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 rounded-[2rem] border border-emerald-950/5 bg-white p-6 shadow-sm md:flex-row md:items-center md:rounded-[2.5rem] md:p-8 md:gap-0">
        <div>
          <h2 className="mb-1 text-3xl font-bold text-emerald-950 font-serif md:text-4xl">Galerie</h2>
          <p className="text-sm font-medium text-gray-500 md:text-base">
            Gere l&apos;inventaire complet et ses textes en francais et en anglais.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-emerald-500/20 transition-all hover:bg-emerald-500 md:w-auto md:gap-3 md:rounded-2xl md:px-8 md:py-4 md:text-xs"
        >
          <Plus size={18} className="md:h-5 md:w-5" />
          <span className="hidden md:inline">Ajouter une oeuvre</span>
          <span className="md:hidden">Ajouter</span>
        </button>
      </div>

      <div className="hidden overflow-hidden rounded-[2.5rem] border border-emerald-950/5 bg-white shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-gray-100 bg-[#fcfcf9]">
              <tr>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-emerald-950/40">Apercu</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-emerald-950/40">Titre et details</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-emerald-950/40">Artiste</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-emerald-950/40">Categorie</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-emerald-950/40">Statut</th>
                <th className="p-6 text-right text-[10px] font-black uppercase tracking-widest text-emerald-950/40">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {artworks.map((artwork) => (
                <tr key={artwork.id} className="group transition-colors hover:bg-emerald-50/30">
                  <td className="p-6">
                    <div className="h-20 w-20 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-sm transition-transform group-hover:scale-110">
                      <img src={artwork.image_url} alt={artwork.title} loading="lazy" className="h-full w-full object-cover" />
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="mb-1 font-bold text-emerald-950">{artwork.title}</div>
                    <div className="mb-3 text-sm text-sky-700">{artwork.title_en || 'No English title yet.'}</div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                        {artwork.technique}
                      </span>
                      <span className="rounded-md bg-sky-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-sky-700">
                        {artwork.technique_en || 'EN missing'}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{artwork.dimensions}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="text-sm font-bold text-gray-600">{artwork.authors?.name || '-'}</span>
                  </td>
                  <td className="p-6">
                    <div className="space-y-1">
                      <span className="block text-sm font-bold text-gray-600">{artwork.categories?.name || '-'}</span>
                      <span className="block text-xs text-sky-700">{artwork.categories?.name_en || '-'}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <button
                      onClick={() => toggleStatus(artwork.id, artwork.is_active)}
                      className={`rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                        artwork.is_active
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {artwork.is_active ? 'Visible' : 'Masquee'}
                    </button>
                  </td>
                  <td className="space-x-3 p-6 text-right">
                    <button
                      onClick={() => handleEdit(artwork)}
                      className="rounded-xl bg-gray-50 p-3 text-gray-400 transition-all hover:bg-emerald-50 hover:text-emerald-600"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => deleteArtwork(artwork.id)}
                      className="rounded-xl bg-gray-50 p-3 text-gray-400 transition-all hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:hidden">
        {artworks.map((artwork) => (
          <div key={artwork.id} className="flex items-start gap-4 rounded-[2rem] border border-emerald-950/5 bg-white p-4 shadow-sm">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
              <img src={artwork.image_url} alt={artwork.title} loading="lazy" className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <div className="truncate text-base font-bold leading-tight text-emerald-950">{artwork.title}</div>
                  <div className="truncate text-xs text-sky-700">{artwork.title_en || 'No English title yet.'}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{artwork.categories?.name}</div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(artwork)} className="rounded-lg bg-gray-50 p-2 text-emerald-600">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => deleteArtwork(artwork.id)} className="rounded-lg bg-gray-50 p-2 text-red-400">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="max-w-[110px] truncate rounded-md bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-600">
                  {artwork.technique}
                </span>
                <span className="max-w-[110px] truncate rounded-md bg-sky-50 px-2 py-0.5 text-[9px] font-bold text-sky-700">
                  {artwork.technique_en || 'EN missing'}
                </span>
                <button
                  onClick={() => toggleStatus(artwork.id, artwork.is_active)}
                  className={`rounded-lg px-3 py-1 text-[9px] font-black uppercase tracking-widest ${
                    artwork.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {artwork.is_active ? 'Visible' : 'Masquee'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-[3rem] border border-white/20 bg-[#fcfcf9] shadow-2xl">
            <div className="shrink-0 border-b border-emerald-950/5 bg-white px-10 py-8">
              <div className="flex items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold text-emerald-950 font-serif">
                    {formData.id ? 'Modifier l oeuvre' : 'Ajouter une nouvelle oeuvre'}
                  </h3>
                  <p className="mt-2 text-sm font-medium text-gray-500">
                    Les champs francais alimentent la langue par defaut. Les champs anglais servent le switch de langue.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-gray-400 shadow-inner transition-all hover:text-emerald-950"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto p-10">
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.4fr]">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className={labelClass}>Image principale</label>
                      <div
                        onClick={() => {
                          setMediaPickerTarget('main');
                          setIsMediaPickerOpen(true);
                        }}
                        className="group relative aspect-square cursor-pointer overflow-hidden rounded-[2rem] border-2 border-dashed border-gray-200 bg-gray-50 text-center transition-all hover:border-emerald-400"
                      >
                        {formData.image_url ? (
                          <>
                            <img src={formData.image_url} alt="Main artwork" className="h-full w-full object-cover" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                              <span className="rounded-xl border border-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-white">
                                Changer
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="flex h-full flex-col items-center justify-center text-emerald-200">
                            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                              <ImageIcon size={32} />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Choisir une image</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className={labelClass}>Galerie secondaire</label>
                        <button
                          type="button"
                          onClick={() => {
                            setMediaPickerTarget('gallery');
                            setIsMediaPickerOpen(true);
                          }}
                          className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-emerald-600 hover:text-emerald-800"
                        >
                          <Plus size={14} /> Ajouter
                        </button>
                      </div>

                      {formData.gallery_images.length === 0 ? (
                        <div
                          onClick={() => {
                            setMediaPickerTarget('gallery');
                            setIsMediaPickerOpen(true);
                          }}
                          className="cursor-pointer rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center transition-colors hover:border-emerald-200 hover:bg-emerald-50"
                        >
                          <LayoutGrid className="mx-auto mb-2 text-gray-300" size={24} />
                          <p className="text-[10px] font-medium text-gray-400">Ajouter des vues de detail</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-3">
                          {formData.gallery_images.map((image, index) => (
                            <div key={`${image.id}-${index}`} className="group relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                              <img src={image.url} alt="" className="h-full w-full object-cover" />
                              <button
                                type="button"
                                onClick={() => removeGalleryImage(index)}
                                className="absolute right-1 top-1 rounded-lg bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              setMediaPickerTarget('gallery');
                              setIsMediaPickerOpen(true);
                            }}
                            className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white text-gray-300 transition-all hover:border-emerald-300 hover:text-emerald-500"
                          >
                            <Plus size={20} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <LocalizedField
                      label="Titre de l oeuvre"
                      valueFr={formData.title}
                      valueEn={formData.title_en}
                      onFrChange={(value) => setFormData((previous) => ({ ...previous, title: value }))}
                      onEnChange={(value) => setFormData((previous) => ({ ...previous, title_en: value }))}
                      placeholderFr="Ex: Serenite Tropicale"
                      placeholderEn="Ex: Tropical Serenity"
                    />

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-3">
                        <label className={labelClass}>Categorie</label>
                        <select
                          value={formData.category_id}
                          onChange={(event) => setFormData((previous) => ({ ...previous, category_id: event.target.value }))}
                          className={`${inputClass} appearance-none font-bold`}
                          required
                        >
                          <option value="">Selectionner</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                              {category.name_en ? ` / ${category.name_en}` : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className={labelClass}>Artiste</label>
                        <select
                          value={formData.author_id}
                          onChange={(event) => setFormData((previous) => ({ ...previous, author_id: event.target.value }))}
                          className={`${inputClass} appearance-none font-bold`}
                          required
                        >
                          <option value="">Selectionner</option>
                          {authors.map((author) => (
                            <option key={author.id} value={author.id}>
                              {author.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <LocalizedField
                      label="Technique"
                      valueFr={formData.technique}
                      valueEn={formData.technique_en}
                      onFrChange={(value) => setFormData((previous) => ({ ...previous, technique: value }))}
                      onEnChange={(value) => setFormData((previous) => ({ ...previous, technique_en: value }))}
                      placeholderFr="Ex: Huile sur toile"
                      placeholderEn="Ex: Oil on canvas"
                    />

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div className="space-y-3">
                        <label className={labelClass}>Dimensions</label>
                        <input
                          value={formData.dimensions}
                          onChange={(event) => setFormData((previous) => ({ ...previous, dimensions: event.target.value }))}
                          className={inputClass}
                          placeholder="80 x 100 cm"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className={labelClass}>Annee</label>
                        <input
                          value={formData.year}
                          onChange={(event) => setFormData((previous) => ({ ...previous, year: event.target.value }))}
                          className={inputClass}
                          placeholder="2026"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className={labelClass}>Prix (EUR)</label>
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(event) => setFormData((previous) => ({ ...previous, price: event.target.value }))}
                          className={`${inputClass} font-bold`}
                          placeholder="1200"
                        />
                      </div>
                    </div>

                    <LocalizedField
                      label="Description"
                      valueFr={formData.description}
                      valueEn={formData.description_en}
                      onFrChange={(value) => setFormData((previous) => ({ ...previous, description: value }))}
                      onEnChange={(value) => setFormData((previous) => ({ ...previous, description_en: value }))}
                      placeholderFr="Contexte, inspiration, histoire de l oeuvre..."
                      placeholderEn="Context, inspiration, story of the artwork..."
                      multiline
                    />

                    <button
                      type="submit"
                      className="w-full rounded-2xl bg-emerald-900 py-5 text-xs font-black uppercase tracking-[0.4em] text-[#d4af37] shadow-2xl shadow-emerald-950/20 transition-all hover:bg-emerald-950"
                    >
                      {formData.id ? 'Mettre a jour l oeuvre' : 'Publier l oeuvre'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {isMediaPickerOpen && <MediaPicker onSelect={handleMediaSelect} onClose={() => setIsMediaPickerOpen(false)} />}
    </div>
  );
};
