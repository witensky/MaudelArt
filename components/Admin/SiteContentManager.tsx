import React, { useEffect, useState } from 'react';
import { FileText, Loader2, MessageSquare, Quote, Save, Type } from 'lucide-react';
import { supabase } from '../../supabaseClient';

type LocalizedValue = {
  fr: string;
  en: string;
};

interface SiteTextContent {
  hero_title: LocalizedValue;
  hero_subtitle: LocalizedValue;
  hero_cta: LocalizedValue;
  gallery_title: LocalizedValue;
  gallery_description: LocalizedValue;
  contact_title: LocalizedValue;
  contact_subtitle: LocalizedValue;
  footer_slogan: LocalizedValue;
  about_quote: LocalizedValue;
  about_quote_author: LocalizedValue;
}

const DEFAULT_CONTENT: SiteTextContent = {
  hero_title: { fr: "L'art qui transcende le visible", en: 'Art that goes beyond the visible' },
  hero_subtitle: { fr: "Galerie d'art contemporain", en: 'Contemporary art gallery' },
  hero_cta: { fr: 'Explorer la galerie', en: 'Explore the gallery' },
  gallery_title: { fr: 'Galerie', en: 'Gallery' },
  gallery_description: {
    fr: "Selection meticuleuse d'oeuvres originales, serenite et elegance tropicale.",
    en: 'A curated selection of original works, serenity, and tropical elegance.',
  },
  contact_title: { fr: "Entrer dans l'univers", en: 'Enter the world' },
  contact_subtitle: { fr: 'Collaboration & Acquisition', en: 'Collaboration & Acquisition' },
  footer_slogan: { fr: 'La beaute sauvera le monde.', en: 'Beauty will save the world.' },
  about_quote: {
    fr: "L'art ne reproduit pas le visible ; il rend visible.",
    en: 'Art does not reproduce the visible; it makes visible.',
  },
  about_quote_author: { fr: 'Paul Klee', en: 'Paul Klee' },
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

const normalizeContent = (value: any): SiteTextContent => ({
  hero_title: normalizeLocalizedValue(value?.hero_title, DEFAULT_CONTENT.hero_title),
  hero_subtitle: normalizeLocalizedValue(value?.hero_subtitle, DEFAULT_CONTENT.hero_subtitle),
  hero_cta: normalizeLocalizedValue(value?.hero_cta, DEFAULT_CONTENT.hero_cta),
  gallery_title: normalizeLocalizedValue(value?.gallery_title, DEFAULT_CONTENT.gallery_title),
  gallery_description: normalizeLocalizedValue(value?.gallery_description, DEFAULT_CONTENT.gallery_description),
  contact_title: normalizeLocalizedValue(value?.contact_title, DEFAULT_CONTENT.contact_title),
  contact_subtitle: normalizeLocalizedValue(value?.contact_subtitle, DEFAULT_CONTENT.contact_subtitle),
  footer_slogan: normalizeLocalizedValue(value?.footer_slogan, DEFAULT_CONTENT.footer_slogan),
  about_quote: normalizeLocalizedValue(value?.about_quote, DEFAULT_CONTENT.about_quote),
  about_quote_author: normalizeLocalizedValue(value?.about_quote_author, DEFAULT_CONTENT.about_quote_author),
});

const Section = ({ icon: Icon, title, children }: any) => (
  <div className="space-y-8 rounded-[2.5rem] border border-emerald-950/5 bg-white p-10 shadow-sm">
    <div className="flex items-center gap-3 border-b border-gray-100 pb-6">
      <Icon className="text-emerald-600" size={24} />
      <h3 className="text-xl font-bold text-emerald-950">{title}</h3>
    </div>
    {children}
  </div>
);

const LocalizedField = ({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: LocalizedValue;
  onChange: (language: keyof LocalizedValue, nextValue: string) => void;
  multiline?: boolean;
}) => {
  const className = multiline
    ? 'h-32 w-full resize-none rounded-2xl border border-emerald-950/10 bg-[#fcfcf9] p-6 text-emerald-950 outline-none transition-all focus:border-emerald-500'
    : 'w-full rounded-2xl border border-emerald-950/10 bg-[#fcfcf9] p-4 text-emerald-950 outline-none transition-all focus:border-emerald-500';

  return (
    <div className="space-y-4">
      <label className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40">{label}</label>
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
                className={className}
              />
            ) : (
              <input
                value={value[language]}
                onChange={(event) => onChange(language, event.target.value)}
                className={className}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const SiteContentManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<SiteTextContent>(DEFAULT_CONTENT);

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase
        .from('site_content')
        .select('*')
        .eq('key', 'global_texts')
        .single();

      if (data?.content) {
        setContent(normalizeContent(data.content));
      }

      setLoading(false);
    };

    fetchContent();
  }, []);

  const updateField = (field: keyof SiteTextContent, language: keyof LocalizedValue, nextValue: string) => {
    setContent((previous) => ({
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
      key: 'global_texts',
      type: 'json',
      content,
    });

    if (!error) {
      alert('Contenu bilingue sauvegarde.');
    }

    setSaving(false);
  };

  if (loading) {
    return <div className="p-10 text-center"><Loader2 className="animate-spin text-emerald-600" size={48} /></div>;
  }

  return (
    <div className="max-w-6xl space-y-10">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h2 className="mb-2 text-4xl font-bold text-emerald-950 font-serif">Contenu editorial</h2>
          <p className="font-medium text-gray-500">Editez les textes globaux du site en francais et en anglais.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-3 rounded-2xl bg-emerald-600 px-8 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-emerald-600/20 transition-all hover:bg-emerald-500"
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          {saving ? 'Sauvegarde...' : 'Publier les modifications'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <Section icon={Type} title="Page d'accueil">
          <LocalizedField label="Titre principal" value={content.hero_title} onChange={(language, nextValue) => updateField('hero_title', language, nextValue)} />
          <LocalizedField label="Sous-titre" value={content.hero_subtitle} onChange={(language, nextValue) => updateField('hero_subtitle', language, nextValue)} />
          <LocalizedField label="Bouton principal" value={content.hero_cta} onChange={(language, nextValue) => updateField('hero_cta', language, nextValue)} />
        </Section>

        <Section icon={FileText} title="Page galerie">
          <LocalizedField label="Titre de la galerie" value={content.gallery_title} onChange={(language, nextValue) => updateField('gallery_title', language, nextValue)} />
          <LocalizedField label="Description de la galerie" value={content.gallery_description} onChange={(language, nextValue) => updateField('gallery_description', language, nextValue)} multiline />
        </Section>

        <Section icon={MessageSquare} title="Page contact">
          <LocalizedField label="Titre de contact" value={content.contact_title} onChange={(language, nextValue) => updateField('contact_title', language, nextValue)} />
          <LocalizedField label="Sous-titre contact" value={content.contact_subtitle} onChange={(language, nextValue) => updateField('contact_subtitle', language, nextValue)} />
        </Section>

        <Section icon={Quote} title="Citation & footer">
          <LocalizedField label="Citation page d'accueil" value={content.about_quote} onChange={(language, nextValue) => updateField('about_quote', language, nextValue)} multiline />
          <LocalizedField label="Auteur de la citation" value={content.about_quote_author} onChange={(language, nextValue) => updateField('about_quote_author', language, nextValue)} />
          <LocalizedField label="Slogan du footer" value={content.footer_slogan} onChange={(language, nextValue) => updateField('footer_slogan', language, nextValue)} />
        </Section>
      </div>
    </div>
  );
};
