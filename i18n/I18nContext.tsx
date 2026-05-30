import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Language, translations, TranslationMessages } from './translations';

interface I18nContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  messages: TranslationMessages;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = 'maudelart-language';

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') {
      return 'fr';
    }

    const storedLanguage = window.localStorage.getItem(STORAGE_KEY);
    return storedLanguage === 'en' ? 'en' : 'fr';
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language === 'fr' ? 'fr' : 'en';
  }, [language]);

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      setLanguage: setLanguageState,
      messages: translations[language],
    }),
    [language]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useI18n must be used inside an I18nProvider');
  }

  return context;
};
