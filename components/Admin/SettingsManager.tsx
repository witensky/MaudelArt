import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Save, Loader2, Globe, Mail, Instagram, Facebook, Twitter, MapPin, CheckCircle, Languages } from 'lucide-react';

const inputClass =
  'w-full rounded-xl border border-gray-200 bg-[#fcfcf9] p-4 text-emerald-950 font-medium outline-none transition-colors focus:border-emerald-500';
const labelClass = 'text-[10px] font-black uppercase tracking-widest';

interface SiteSettings {
  site_name: string;
  email_address: string;
  address: string;
  footer_text: string;
  instagram_url: string;
  facebook_url: string;
  twitter_url: string;
  hero_video_url: string;
  default_language: 'fr' | 'en';
  supported_languages: Array<'fr' | 'en'>;
}

const DEFAULT: SiteSettings = {
  site_name: 'MaudelArt',
  email_address: 'contact@mariemaudeart.com',
  address: 'Montreal, QC | Port-au-Prince, Haiti',
  footer_text: 'La beaute sauvera le monde.',
  instagram_url: 'https://www.instagram.com/mariemaude_eliacin/',
  facebook_url: 'https://www.facebook.com/mariemaudeeliacin',
  twitter_url: 'https://twitter.com/mariemaudelart',
  hero_video_url: '',
  default_language: 'fr',
  supported_languages: ['fr', 'en'],
};

const normalizeSupportedLanguages = (value: unknown): Array<'fr' | 'en'> => {
  if (!Array.isArray(value)) {
    return DEFAULT.supported_languages;
  }

  const languages = value.filter((language): language is 'fr' | 'en' => language === 'fr' || language === 'en');

  if (!languages.includes('fr')) {
    languages.unshift('fr');
  }

  if (!languages.includes('en')) {
    languages.push('en');
  }

  return Array.from(new Set(languages));
};

export const SettingsManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data } = await supabase.from('site_settings').select('*').single();

    if (data) {
      setSettings({
        site_name: data.site_name || DEFAULT.site_name,
        email_address: data.email_address || DEFAULT.email_address,
        address: data.address || DEFAULT.address,
        footer_text: data.footer_text || DEFAULT.footer_text,
        instagram_url: data.instagram_url || DEFAULT.instagram_url,
        facebook_url: data.facebook_url || DEFAULT.facebook_url,
        twitter_url: data.twitter_url || DEFAULT.twitter_url,
        hero_video_url: data.hero_video_url || DEFAULT.hero_video_url,
        default_language: data.default_language === 'en' ? 'en' : 'fr',
        supported_languages: normalizeSupportedLanguages(data.supported_languages),
      });
    }

    setLoading(false);
  };

  const setField =
    (field: keyof SiteSettings) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setSettings((previous) => ({ ...previous, [field]: event.target.value }));

  const handleSave = async () => {
    setSaving(true);

    await supabase.from('site_settings').upsert({
      id: 1,
      ...settings,
      supported_languages: ['fr', 'en'],
      default_language: 'fr',
    });

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="animate-spin text-emerald-600" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-10">
      <div>
        <h2 className="mb-2 text-4xl font-bold text-emerald-950 font-serif">Parametres du site</h2>
        <p className="font-medium text-gray-500">Configuration globale, reseaux sociaux et langues publiques.</p>
      </div>

      <div className="space-y-8 rounded-3xl border border-black/5 bg-white p-8 shadow-sm">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-emerald-900/50">Configuration des langues</h3>
          <p className="mt-1 text-xs text-gray-400">
            Le site public fonctionne en francais et en anglais. Le francais reste la langue par defaut.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <div className="mb-1 flex items-center gap-2 text-emerald-600">
              <Languages size={15} />
              <label className={labelClass}>Langues actives</label>
            </div>
            <div className="space-y-3 rounded-2xl border border-gray-200 bg-[#fcfcf9] p-4">
              <label className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                <div>
                  <div className="font-bold text-emerald-950">Francais</div>
                  <div className="text-xs text-emerald-700">Toujours actif comme langue principale.</div>
                </div>
                <input type="checkbox" checked disabled className="h-4 w-4 accent-emerald-600" />
              </label>
              <label className="flex items-center justify-between rounded-xl border border-sky-100 bg-sky-50 px-4 py-3">
                <div>
                  <div className="font-bold text-emerald-950">English</div>
                  <div className="text-xs text-sky-700">Toujours actif pour garantir le site bilingue.</div>
                </div>
                <input type="checkbox" checked disabled className="h-4 w-4 accent-sky-600" />
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <div className="mb-1 flex items-center gap-2 text-emerald-600">
              <Globe size={15} />
              <label className={labelClass}>Langue par defaut</label>
            </div>
            <select value="fr" disabled className={`${inputClass} cursor-not-allowed opacity-70`}>
              <option value="fr">Francais</option>
              <option value="en">English</option>
            </select>
            <p className="text-xs text-gray-400">
              Verrouille sur le francais pour respecter la langue par defaut demandee pour le site.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8 rounded-3xl border border-black/5 bg-white p-8 shadow-sm">
        <h3 className="text-sm font-black uppercase tracking-widest text-emerald-900/50">Informations generales</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <div className="mb-1 flex items-center gap-2 text-emerald-600">
              <Globe size={15} />
              <label className={labelClass}>Nom du site</label>
            </div>
            <input value={settings.site_name} onChange={setField('site_name')} className={inputClass} />
          </div>

          <div className="space-y-2">
            <div className="mb-1 flex items-center gap-2 text-emerald-600">
              <Mail size={15} />
              <label className={labelClass}>Email de contact</label>
            </div>
            <input type="email" value={settings.email_address} onChange={setField('email_address')} className={inputClass} placeholder="contact@example.com" />
          </div>

          <div className="space-y-2 md:col-span-2">
            <div className="mb-1 flex items-center gap-2 text-emerald-600">
              <MapPin size={15} />
              <label className={labelClass}>Localisation</label>
            </div>
            <input value={settings.address} onChange={setField('address')} className={inputClass} placeholder="Ville, pays" />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className={`${labelClass} mb-1 block text-emerald-900/40`}>Texte du footer</label>
            <input value={settings.footer_text} onChange={setField('footer_text')} className={`${inputClass} italic`} placeholder="La beaute sauvera le monde." />
          </div>
        </div>
      </div>

      <div className="space-y-8 rounded-3xl border border-black/5 bg-white p-8 shadow-sm">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-emerald-900/50">Reseaux sociaux</h3>
          <p className="mt-1 text-xs text-gray-400">Ces liens apparaissent dans le hero et le footer du site.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <div className="mb-1 flex items-center gap-2 text-pink-500">
              <Instagram size={15} />
              <label className={labelClass}>Instagram</label>
            </div>
            <input value={settings.instagram_url} onChange={setField('instagram_url')} className={inputClass} placeholder="https://www.instagram.com/username" />
          </div>

          <div className="space-y-2">
            <div className="mb-1 flex items-center gap-2 text-blue-600">
              <Facebook size={15} />
              <label className={labelClass}>Facebook</label>
            </div>
            <input value={settings.facebook_url} onChange={setField('facebook_url')} className={inputClass} placeholder="https://www.facebook.com/username" />
          </div>

          <div className="space-y-2">
            <div className="mb-1 flex items-center gap-2 text-sky-500">
              <Twitter size={15} />
              <label className={labelClass}>Twitter / X</label>
            </div>
            <input value={settings.twitter_url} onChange={setField('twitter_url')} className={inputClass} placeholder="https://twitter.com/username" />
          </div>
        </div>
      </div>

      <div className="space-y-6 rounded-3xl border border-black/5 bg-white p-8 shadow-sm">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-emerald-900/50">Video hero</h3>
          <p className="mt-1 text-xs text-gray-400">URL d&apos;une video MP4 pour l&apos;arriere-plan du hero. Laisse vide pour garder l&apos;image.</p>
        </div>
        <input
          value={settings.hero_video_url}
          onChange={setField('hero_video_url')}
          className={inputClass}
          placeholder="https://example.com/video.mp4"
        />
        {settings.hero_video_url && (
          <video
            key={settings.hero_video_url}
            src={settings.hero_video_url}
            className="mt-2 max-h-40 w-full rounded-xl border border-gray-200 object-cover"
            muted
            autoPlay
            loop
            playsInline
          />
        )}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-900 py-5 text-xs font-black uppercase tracking-[0.3em] text-[#d4af37] shadow-2xl transition-all hover:bg-emerald-950 disabled:opacity-60"
      >
        {saving ? (
          <>
            <Loader2 className="animate-spin" size={18} /> Sauvegarde...
          </>
        ) : saved ? (
          <>
            <CheckCircle size={18} className="text-emerald-400" /> Parametres sauvegardes
          </>
        ) : (
          <>
            <Save size={18} /> Enregistrer tous les parametres
          </>
        )}
      </button>
    </div>
  );
};
