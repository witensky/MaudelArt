import { Language } from '../contexts/LanguageContext';

const CATEGORY_KEYS: Record<string, string> = {
  Nature: 'Nature',
  'Paysages marins': 'Paysages marins',
  Seascapes: 'Paysages marins',
  Portraits: 'Portraits',
  Portrait: 'Portraits',
  'Natures mortes': 'Natures mortes',
  'Still lifes': 'Natures mortes',
  All: 'All',
  Unknown: 'Unknown',
};

export const getLocale = (language: Language) => (language === 'fr' ? 'fr-FR' : 'en-US');

export const getTranslatedCategoryKey = (category: string) => CATEGORY_KEYS[category] ?? category;
