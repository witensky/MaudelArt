import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { translations } from '../translations';

export type Language = 'fr' | 'en';
export type LocalizedText = string | Partial<Record<Language, string>>;

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  getLocalizedValue: (value: LocalizedText | null | undefined, fallback?: string) => string;
}

const DEFAULT_LANGUAGE: Language = 'fr';
const STORAGE_KEY = 'maudelart-language';

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE;
  }

  const storedLanguage = window.localStorage.getItem(STORAGE_KEY);
  return storedLanguage === 'en' ? 'en' : DEFAULT_LANGUAGE;
};

const getTranslationValue = (language: Language, key: string): string | undefined => {
  return key.split('.').reduce<any>((current, segment) => current?.[segment], translations[language]);
};

const interpolate = (template: string, params?: Record<string, string | number>) => {
  if (!params) {
    return template;
  }

  return Object.entries(params).reduce((result, [name, value]) => {
    return result.replace(new RegExp(`\\{${name}\\}`, 'g'), String(value));
  }, template);
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const t = useCallback((key: string, params?: Record<string, string | number>) => {
    const value =
      getTranslationValue(language, key) ??
      getTranslationValue(DEFAULT_LANGUAGE, key) ??
      key;

    return interpolate(value, params);
  }, [language]);

  const getLocalizedValue = useCallback((value: LocalizedText | null | undefined, fallback = '') => {
    if (!value) {
      return fallback;
    }

    if (typeof value === 'string') {
      return value;
    }

    return value[language] ?? value.fr ?? value.en ?? fallback;
  }, [language]);

  const contextValue = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage,
    t,
    getLocalizedValue,
  }), [getLocalizedValue, language, t]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return context;
};
