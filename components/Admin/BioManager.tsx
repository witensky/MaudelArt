import React, { useEffect, useRef, useState } from 'react';
import { Camera, CheckCircle, FileText, GripVertical, Image, Loader2, Plus, Quote, Save, Trash2 } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { MediaPicker } from './MediaLibrary/MediaPicker';

type LocalizedValue = {
  fr: string;
  en: string;
};

interface Chapter {
  id: number;
  title: LocalizedValue;
  icon: 'Scissors' | 'Palette' | 'Piano';
  period?: LocalizedValue;
  text: LocalizedValue;
}

interface Exhibition {
  year: string;
  title: LocalizedValue;
  location: LocalizedValue;
}

interface BioContent {
  mainTitle: LocalizedValue;
  subtitle: LocalizedValue;
  quote: LocalizedValue;
  quoteAuthor?: LocalizedValue;
  secondaryQuote?: LocalizedValue;
  secondaryQuoteAuthor?: LocalizedValue;
  chapters: Chapter[];
  exhibitions: Exhibition[];
  photoUrl?: string;
  finalStatement?: LocalizedValue;
}

const localized = (fr: string, en: string): LocalizedValue => ({ fr, en });

const DEFAULT: BioContent = {
  mainTitle: localized('Marie Maude Eliacin', 'Marie Maude Eliacin'),
  subtitle: localized('Recit artistique', 'Artist Narrative'),
  quote: localized(
    "Ma peinture est un voyage interieur...",
    'My painting is a journey of self-discovery...',
  ),
  quoteAuthor: localized('Marie Maude Eliacin', 'Marie Maude Eliacin'),
  secondaryQuote: localized(
    "L'univers pictural de Maude Eliacin n'a pas de place pour la morosite...",
    "Maude Eliacin's pictorial universe has no room for gloom...",
  ),
  secondaryQuoteAuthor: localized('Soucaneau Gabriel, Raj Magazine (2007)', 'Soucaneau Gabriel, Raj Magazine (2007)'),
  chapters: [
    {
      id: 1,
      title: localized('Precision du geste', 'Precision in Every Gesture'),
      icon: 'Palette',
      period: localized('Transition 2003', '2003 Transition'),
      text: localized('...', '...'),
    },
    {
      id: 2,
      title: localized('Du piano au chevalet', 'From Piano to Easel'),
      icon: 'Palette',
      period: localized('La rencontre', 'The Encounter'),
      text: localized('...', '...'),
    },
  ],
  exhibitions: [
    {
      year: '2015',
      title: localized('Ordre et Fantaisie', 'Order and Fantasy'),
      location: localized('Petion-Ville, Haiti', 'Petion-Ville, Haiti'),
    },
  ],
  photoUrl: '',
  finalStatement: localized(
    "Aujourd'hui, elle vous invite a decouvrir ses oeuvres...",
    'Today, she invites you to discover her works...',
  ),
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

const normalizeContent = (value: any): BioContent => ({
  mainTitle: normalizeLocalizedValue(value?.mainTitle, DEFAULT.mainTitle),
  subtitle: normalizeLocalizedValue(value?.subtitle, DEFAULT.subtitle),
  quote: normalizeLocalizedValue(value?.quote, DEFAULT.quote),
  quoteAuthor: normalizeLocalizedValue(value?.quoteAuthor, DEFAULT.quoteAuthor || localized('', '')),
  secondaryQuote: normalizeLocalizedValue(value?.secondaryQuote, DEFAULT.secondaryQuote || localized('', '')),
  secondaryQuoteAuthor: normalizeLocalizedValue(value?.secondaryQuoteAuthor, DEFAULT.secondaryQuoteAuthor || localized('', '')),
  chapters: Array.isArray(value?.chapters) && value.chapters.length > 0
    ? value.chapters.map((chapter: any, index: number) => ({
      id: chapter.id ?? Date.now() + index,
      icon: chapter.icon || 'Palette',
      title: normalizeLocalizedValue(chapter.title, localized('Nouveau chapitre', 'New chapter')),
      period: normalizeLocalizedValue(chapter.period, localized('', '')),
      text: normalizeLocalizedValue(chapter.text, localized('', '')),
    }))
    : DEFAULT.chapters,
  exhibitions: Array.isArray(value?.exhibitions) && value.exhibitions.length > 0
    ? value.exhibitions.map((exhibition: any) => ({
      year: exhibition.year || '',
      title: normalizeLocalizedValue(exhibition.title, localized('', '')),
      location: normalizeLocalizedValue(exhibition.location, localized('', '')),
    }))
    : DEFAULT.exhibitions,
  photoUrl: value?.photoUrl || '',
  finalStatement: normalizeLocalizedValue(value?.finalStatement, DEFAULT.finalStatement || localized('', '')),
});

const inputClassName = 'w-full rounded-xl border border-emerald-950/10 bg-[#fcfcf9] px-4 py-3 text-sm text-emerald-950 outline-none focus:border-emerald-500';
const textareaClassName = `${inputClassName} resize-none leading-relaxed`;

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-2">
    <label className="block text-[10px] font-black uppercase tracking-widest text-emerald-900/40">{label}</label>
    {children}
  </div>
);

const LocalizedEditor = ({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: LocalizedValue;
  onChange: (language: keyof LocalizedValue, nextValue: string) => void;
  multiline?: boolean;
}) => (
  <div className="space-y-4">
    <label className="block text-[10px] font-black uppercase tracking-widest text-emerald-900/40">{label}</label>
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {(['fr', 'en'] as const).map((language) => (
        <div key={language} className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
            {language === 'fr' ? 'Francais' : 'English'}
          </span>
          {multiline ? (
            <textarea
              value={value[language]}
              onChange={(event) => onChange(language, event.target.value)}
              className={`${textareaClassName} h-28`}
            />
          ) : (
            <input
              value={value[language]}
              onChange={(event) => onChange(language, event.target.value)}
              className={inputClassName}
            />
          )}
        </div>
      ))}
    </div>
  </div>
);

export const BioManager: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [content, setContent] = useState<BioContent>(DEFAULT);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchBio = async () => {
      const { data } = await supabase.from('site_content').select('content').eq('key', 'biography').single();
      if (data?.content) {
        setContent(normalizeContent(data.content));
      }
      setLoading(false);
    };

    fetchBio();
  }, []);

  const updateRootField = (field: keyof BioContent, language: keyof LocalizedValue, nextValue: string) => {
    setContent((previous) => ({
      ...previous,
      [field]: {
        ...(previous[field] as LocalizedValue),
        [language]: nextValue,
      },
    }));
  };

  const updateChapter = (index: number, field: keyof Chapter, nextValue: string, language?: keyof LocalizedValue) => {
    setContent((previous) => {
      const chapters = [...previous.chapters];
      const currentChapter = chapters[index];
      chapters[index] = language
        ? {
          ...currentChapter,
          [field]: {
            ...((currentChapter[field] as LocalizedValue) || localized('', '')),
            [language]: nextValue,
          },
        }
        : {
          ...currentChapter,
          [field]: nextValue,
        };

      return { ...previous, chapters };
    });
  };

  const updateExhibition = (index: number, field: keyof Exhibition, nextValue: string, language?: keyof LocalizedValue) => {
    setContent((previous) => {
      const exhibitions = [...previous.exhibitions];
      const currentExhibition = exhibitions[index];
      exhibitions[index] = language
        ? {
          ...currentExhibition,
          [field]: {
            ...((currentExhibition[field] as LocalizedValue) || localized('', '')),
            [language]: nextValue,
          },
        }
        : {
          ...currentExhibition,
          [field]: nextValue,
        };

      return { ...previous, exhibitions };
    });
  };

  const addChapter = () => {
    setContent((previous) => ({
      ...previous,
      chapters: [
        ...previous.chapters,
        {
          id: Date.now(),
          title: localized('Nouveau chapitre', 'New chapter'),
          icon: 'Palette',
          period: localized('', ''),
          text: localized('', ''),
        },
      ],
    }));
  };

  const addExhibition = () => {
    setContent((previous) => ({
      ...previous,
      exhibitions: [{ year: '', title: localized('', ''), location: localized('', '') }, ...previous.exhibitions],
    }));
  };

  const handlePhotoUpload = async (file: File) => {
    if (!file) {
      return;
    }

    setUploadingPhoto(true);
    const extension = file.name.split('.').pop();
    const path = `biography/${uuidv4()}.${extension}`;
    const { error } = await supabase.storage.from('images').upload(path, file, { upsert: false });

    if (!error) {
      const { data } = supabase.storage.from('images').getPublicUrl(path);
      setContent((previous) => ({ ...previous, photoUrl: data.publicUrl }));
    }

    setUploadingPhoto(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await supabase.from('site_content').upsert({ key: 'biography', type: 'json', content });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (loading) {
    return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-emerald-500" size={24} /></div>;
  }

  return (
    <div className="max-w-5xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-emerald-950 font-serif">Biographie & A propos</h2>
          <p className="mt-1 text-sm text-gray-500">Editez le contenu public en francais et en anglais.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 rounded-2xl px-6 py-3 text-xs font-black uppercase tracking-widest shadow-xl transition-all ${saved ? 'bg-emerald-500 text-white' : 'bg-emerald-600 text-white shadow-emerald-600/20 hover:bg-emerald-500'}`}
        >
          {saving ? <Loader2 className="animate-spin" size={16} /> : saved ? <CheckCircle size={16} /> : <Save size={16} />}
          {saved ? 'Publie' : saving ? 'Sauvegarde...' : 'Publier'}
        </button>
      </div>

      <div className="space-y-6 rounded-3xl border border-emerald-950/5 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
          <FileText className="text-emerald-600" size={20} />
          <h3 className="text-lg font-bold text-emerald-950">En-tete</h3>
        </div>
        <LocalizedEditor label="Nom / titre principal" value={content.mainTitle} onChange={(language, nextValue) => updateRootField('mainTitle', language, nextValue)} />
        <LocalizedEditor label="Sous-titre" value={content.subtitle} onChange={(language, nextValue) => updateRootField('subtitle', language, nextValue)} />
        <LocalizedEditor label="Citation principale" value={content.quote} onChange={(language, nextValue) => updateRootField('quote', language, nextValue)} multiline />
        <LocalizedEditor label="Auteur de la citation" value={content.quoteAuthor || localized('', '')} onChange={(language, nextValue) => updateRootField('quoteAuthor', language, nextValue)} />
      </div>

      <div className="space-y-6 rounded-3xl border border-emerald-950/5 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
          <Camera className="text-emerald-600" size={20} />
          <h3 className="text-lg font-bold text-emerald-950">Photo principale</h3>
        </div>
        <div className="flex items-start gap-8">
          <div
            className="group relative h-48 w-36 flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-emerald-200 transition-colors hover:border-emerald-400"
            onClick={() => photoInputRef.current?.click()}
          >
            {content.photoUrl ? (
              <>
                <img src={content.photoUrl} alt="preview" className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Camera size={24} className="text-white" />
                </div>
              </>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-emerald-300">
                <Image size={28} />
                <span className="px-2 text-center text-xs font-bold uppercase tracking-wider">Cliquer pour ajouter</span>
              </div>
            )}
            {uploadingPhoto && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                <Loader2 className="animate-spin text-emerald-500" size={20} />
              </div>
            )}
          </div>
          <div className="flex-1 space-y-4">
            <p className="text-sm text-gray-500">Chargez une photo de l'artiste ou collez une URL directe.</p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => photoInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-5 py-2.5 text-sm font-bold text-emerald-700 transition-colors hover:bg-emerald-100 disabled:opacity-60"
              >
                {uploadingPhoto ? <Loader2 size={14} className="animate-spin" /> : <Image size={14} />}
                {uploadingPhoto ? 'Upload en cours...' : 'Televerser une photo'}
              </button>
              <button
                onClick={() => setIsMediaPickerOpen(true)}
                disabled={uploadingPhoto}
                className="flex items-center gap-2 rounded-xl border border-emerald-950/10 bg-white px-5 py-2.5 text-sm font-bold text-emerald-950 transition-colors hover:bg-gray-50 disabled:opacity-60"
              >
                <Image size={14} />
                Choisir depuis la mediathque
              </button>
            </div>
            <Field label="URL de la photo">
              <input value={content.photoUrl || ''} onChange={(event) => setContent((previous) => ({ ...previous, photoUrl: event.target.value }))} className={inputClassName} placeholder="https://..." />
            </Field>
          </div>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                handlePhotoUpload(file);
              }
            }}
          />
        </div>
      </div>

      {isMediaPickerOpen && (
        <MediaPicker
          onSelect={(url) => {
            setContent((previous) => ({ ...previous, photoUrl: url }));
            setIsMediaPickerOpen(false);
          }}
          onClose={() => setIsMediaPickerOpen(false)}
        />
      )}

      <div className="space-y-6 rounded-3xl border border-emerald-950/5 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 pb-5">
          <div className="flex items-center gap-3">
            <FileText className="text-emerald-600" size={20} />
            <h3 className="text-lg font-bold text-emerald-950">Chapitres de l'histoire</h3>
          </div>
          <button onClick={addChapter} className="flex items-center gap-1.5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700 transition-colors hover:bg-emerald-100">
            <Plus size={14} /> Ajouter
          </button>
        </div>
        <div className="space-y-4">
          {content.chapters.map((chapter, index) => (
            <div key={chapter.id} className="space-y-4 rounded-2xl border border-emerald-950/5 bg-[#fcfcf9] p-6">
              <div className="flex items-center gap-3">
                <GripVertical size={16} className="flex-shrink-0 text-gray-300" />
                <div className="flex-1">
                  <Field label="Icone">
                    <select value={chapter.icon} onChange={(event) => updateChapter(index, 'icon', event.target.value)} className={inputClassName}>
                      <option value="Palette">Palette</option>
                      <option value="Scissors">Scissors</option>
                      <option value="Piano">Piano</option>
                    </select>
                  </Field>
                </div>
                <button onClick={() => setContent((previous) => ({ ...previous, chapters: previous.chapters.filter((_, chapterIndex) => chapterIndex !== index) }))} className="mt-6 flex-shrink-0 text-red-400 transition-colors hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
              <LocalizedEditor label="Titre" value={chapter.title} onChange={(language, nextValue) => updateChapter(index, 'title', nextValue, language)} />
              <LocalizedEditor label="Periode / label" value={chapter.period || localized('', '')} onChange={(language, nextValue) => updateChapter(index, 'period', nextValue, language)} />
              <LocalizedEditor label="Texte du chapitre" value={chapter.text} onChange={(language, nextValue) => updateChapter(index, 'text', nextValue, language)} multiline />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6 rounded-3xl border border-emerald-950/5 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
          <Quote className="text-emerald-600" size={20} />
          <h3 className="text-lg font-bold text-emerald-950">Citation critique</h3>
        </div>
        <LocalizedEditor label="Citation secondaire" value={content.secondaryQuote || localized('', '')} onChange={(language, nextValue) => updateRootField('secondaryQuote', language, nextValue)} multiline />
        <LocalizedEditor label="Source de la citation" value={content.secondaryQuoteAuthor || localized('', '')} onChange={(language, nextValue) => updateRootField('secondaryQuoteAuthor', language, nextValue)} />
      </div>

      <div className="space-y-6 rounded-3xl border border-emerald-950/5 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 pb-5">
          <div className="flex items-center gap-3">
            <FileText className="text-emerald-600" size={20} />
            <h3 className="text-lg font-bold text-emerald-950">Chronologie / Expositions</h3>
          </div>
          <button onClick={addExhibition} className="flex items-center gap-1.5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700 transition-colors hover:bg-emerald-100">
            <Plus size={14} /> Ajouter
          </button>
        </div>
        <div className="space-y-4">
          {content.exhibitions.map((exhibition, index) => (
            <div key={`${exhibition.year}-${index}`} className="space-y-4 rounded-2xl border border-emerald-950/5 bg-[#fcfcf9] p-6">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Field label="Annee">
                    <input value={exhibition.year} onChange={(event) => updateExhibition(index, 'year', event.target.value)} className={inputClassName} placeholder="2007" />
                  </Field>
                </div>
                <button onClick={() => setContent((previous) => ({ ...previous, exhibitions: previous.exhibitions.filter((_, exhibitionIndex) => exhibitionIndex !== index) }))} className="mt-6 text-red-400 transition-colors hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
              <LocalizedEditor label="Titre de l'exposition" value={exhibition.title} onChange={(language, nextValue) => updateExhibition(index, 'title', nextValue, language)} />
              <LocalizedEditor label="Lieu" value={exhibition.location} onChange={(language, nextValue) => updateExhibition(index, 'location', nextValue, language)} />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 rounded-3xl border border-emerald-950/5 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
          <FileText className="text-emerald-600" size={20} />
          <h3 className="text-lg font-bold text-emerald-950">Declaration finale</h3>
        </div>
        <LocalizedEditor label="Texte de conclusion" value={content.finalStatement || localized('', '')} onChange={(language, nextValue) => updateRootField('finalStatement', language, nextValue)} multiline />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className={`flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-xs font-black uppercase tracking-[0.3em] shadow-xl transition-all ${saved ? 'bg-emerald-500 text-white' : 'bg-emerald-900 text-[#d4af37] hover:bg-emerald-950'}`}
      >
        {saving ? <Loader2 className="animate-spin" size={18} /> : saved ? <CheckCircle size={18} /> : <Save size={18} />}
        {saved ? 'Publie avec succes' : saving ? 'Sauvegarde en cours...' : 'Publier tous les changements'}
      </button>
    </div>
  );
};
