import React from 'react';
import { useI18n } from '../i18n/I18nContext';

const LanguageSwitcher: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { language, setLanguage, messages } = useI18n();

  return (
    <div
      className={`inline-flex items-center rounded-full border border-gray-200 bg-white p-1 ${
        compact ? 'gap-1' : 'gap-1.5'
      }`}
      aria-label={messages.nav.language}
      role="group"
    >
      {(['fr', 'en'] as const).map((code) => {
        const active = language === code;

        return (
          <button
            key={code}
            type="button"
            onClick={() => setLanguage(code)}
            className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] transition-colors ${
              active ? 'bg-emerald-950 text-[#d4af37]' : 'text-gray-500 hover:text-emerald-950'
            }`}
            aria-pressed={active}
          >
            {messages.languageSwitcher[code]}
          </button>
        );
      })}
    </div>
  );
};

export default LanguageSwitcher;
