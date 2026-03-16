import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Save, Loader2, Image as ImageIcon, Upload } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

type LocalizedValue = {
  fr: string;
  en: string;
};

type HeroData = {
  image_url: string;
  title: LocalizedValue;
  description: LocalizedValue;
  label: LocalizedValue;
};

const DEFAULT_HERO_DATA: HeroData = {
  image_url: '',
  title: {
    fr: 'Serenite Tropicale',
    en: 'Tropical Serenity',
  },
  description: {
    fr: 'Huile sur toile - 2023',
    en: 'Oil on canvas - 2023',
  },
  label: {
    fr: 'Oeuvre du moment',
    en: 'Artwork of the moment',
  },
};

const normalizeLocalizedValue = (value: unknown, fallback: LocalizedValue): LocalizedValue => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const candidate = value as Partial<LocalizedValue>;
    return {
      fr: candidate.fr ?? fallback.fr,
      en: candidate.en ?? fallback.en,
    };
  }

  if (typeof value === 'string') {
    return {
      fr: value,
      en: fallback.en,
    };
  }

  return fallback;
};

const normalizeHeroData = (value: any): HeroData => ({
  image_url: value?.image_url || '',
  title: normalizeLocalizedValue(value?.title, DEFAULT_HERO_DATA.title),
  description: normalizeLocalizedValue(value?.description, DEFAULT_HERO_DATA.description),
  label: normalizeLocalizedValue(value?.label, DEFAULT_HERO_DATA.label),
});

const LocalizedInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: LocalizedValue;
  onChange: (language: keyof LocalizedValue, nextValue: string) => void;
}) => (
  <div className="space-y-4">
    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40">{label}</label>
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {(['fr', 'en'] as const).map((language) => (
        <div key={language} className="space-y-2">
          <span className={`text-[10px] font-black uppercase tracking-widest ${language === 'fr' ? 'text-emerald-600' : 'text-sky-600'}`}>
            {language === 'fr' ? 'Francais' : 'English'}
          </span>
          <input
            value={value[language]}
            onChange={(event) => onChange(language, event.target.value)}
            className="w-full rounded-2xl border border-emerald-950/10 bg-[#fcfcf9] p-4 text-emerald-950 outline-none focus:border-emerald-500"
          />
        </div>
      ))}
    </div>
  </div>
);

export const HeroImageManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [heroData, setHeroData] = useState<HeroData>(DEFAULT_HERO_DATA);

  useEffect(() => {
    fetchHeroImage();
  }, []);

  const fetchHeroImage = async () => {
    const { data } = await supabase
      .from('site_content')
      .select('*')
      .eq('key', 'hero_image')
      .single();

    if (data?.content) {
      setHeroData(normalizeHeroData(data.content));
    }

    setLoading(false);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    setUploading(true);

    try {
      const file = event.target.files[0];
      const fileName = `hero/${uuidv4()}.${file.name.split('.').pop()}`;

      const { error: uploadError } = await supabase.storage.from('images').upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('images').getPublicUrl(fileName);

      setHeroData((previous) => ({ ...previous, image_url: publicUrl }));
    } catch (error) {
      console.error('Upload error:', error);
      alert("Erreur lors du telechargement de l'image");
    } finally {
      setUploading(false);
    }
  };

  const updateLocalizedField = (
    field: keyof Pick<HeroData, 'title' | 'description' | 'label'>,
    language: keyof LocalizedValue,
    nextValue: string,
  ) => {
    setHeroData((previous) => ({
      ...previous,
      [field]: {
        ...previous[field],
        [language]: nextValue,
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);

    const { error } = await supabase.from('site_content').upsert({
      key: 'hero_image',
      type: 'json',
      content: heroData,
    });

    if (!error) {
      alert('Hero bilingue mis a jour.');
    } else {
      alert('Erreur lors de la sauvegarde');
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="p-10 text-center">
        <Loader2 className="mx-auto animate-spin text-emerald-600" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-10">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h2 className="mb-2 text-4xl font-bold text-emerald-950 font-serif">Hero de la page d&apos;accueil</h2>
          <p className="font-medium text-gray-500">Gere l&apos;oeuvre principale et son cartouche en francais et en anglais.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-3 rounded-2xl bg-emerald-600 px-8 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-emerald-600/20 transition-all hover:bg-emerald-500"
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          {saving ? 'Sauvegarde...' : 'Publier sur le site'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="space-y-8 rounded-[2.5rem] border border-emerald-950/5 bg-white p-10 shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-6">
            <ImageIcon className="text-emerald-600" size={24} />
            <h3 className="text-xl font-bold text-emerald-950">Image du tableau</h3>
          </div>

          <div className="group relative aspect-[4/5] overflow-hidden rounded-3xl border-2 border-dashed border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 transition-all hover:border-emerald-400">
            {heroData.image_url ? (
              <>
                <img src={heroData.image_url} alt="Hero preview" className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                  <Upload className="text-white" size={48} />
                  <span className="text-sm font-bold uppercase tracking-widest text-white">Changer l&apos;image</span>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-gray-400">
                <ImageIcon size={64} />
                <span className="text-sm font-bold uppercase tracking-widest">Televerser une oeuvre</span>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 cursor-pointer opacity-0"
              disabled={uploading}
            />

            {uploading && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/90 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="animate-spin text-emerald-600" size={48} />
                  <p className="text-sm font-bold text-emerald-950">Telechargement...</p>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
            <p className="text-sm font-medium leading-relaxed text-emerald-950">
              <strong className="font-black">Conseil :</strong> utilise une image haute resolution pour conserver un rendu net sur desktop et mobile.
            </p>
          </div>
        </div>

        <div className="space-y-8 rounded-[2.5rem] border border-emerald-950/5 bg-white p-10 shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-6">
            <ImageIcon className="text-emerald-600" size={24} />
            <h3 className="text-xl font-bold text-emerald-950">Cartouche bilingue</h3>
          </div>

          <div className="space-y-6">
            <LocalizedInput
              label="Etiquette"
              value={heroData.label}
              onChange={(language, nextValue) => updateLocalizedField('label', language, nextValue)}
            />
            <LocalizedInput
              label="Titre de l oeuvre"
              value={heroData.title}
              onChange={(language, nextValue) => updateLocalizedField('title', language, nextValue)}
            />
            <LocalizedInput
              label="Description technique"
              value={heroData.description}
              onChange={(language, nextValue) => updateLocalizedField('description', language, nextValue)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 border-t border-gray-100 pt-6 lg:grid-cols-2">
            {(['fr', 'en'] as const).map((language) => (
              <div key={language} className="rounded-2xl bg-gray-50 p-6">
                <h4 className="mb-3 text-sm font-black uppercase tracking-wide text-emerald-950">
                  Apercu {language === 'fr' ? 'francais' : 'english'}
                </h4>
                <div className="space-y-2">
                  <span className={`block text-[10px] font-black uppercase tracking-widest ${language === 'fr' ? 'text-emerald-600' : 'text-sky-600'}`}>
                    {heroData.label[language]}
                  </span>
                  <h4 className="text-xl font-bold text-emerald-950 serif">
                    {heroData.title[language] || (language === 'fr' ? "Titre de l'oeuvre" : 'Artwork title')}
                  </h4>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    {heroData.description[language]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
