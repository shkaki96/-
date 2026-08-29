import React, { createContext, useCallback, useEffect, useState } from 'react';
import { DEFAULT_LANGUAGE, getLanguageConfig, SUPPORTED_LANGUAGES } from '../config/languages';
import { Language, LocalizedText, LocalizedTextArray, TextDirection } from '../types/language';
import { getDirection, getLocalizedArray, getLocalizedText, isRTL as checkIsRTL } from '../utils/localization';
import { SafeStorage } from '../utils/security';
import { UI_TRANSLATIONS, UITranslationSchema } from './uiTranslations';

export interface LanguageContextValue {
  language: Language;
  direction: TextDirection;
  isRTL: boolean;
  setLanguage: (lang: Language) => void;
  t: (path: string, fallback?: string) => string;
  getLocalizedText: (textMap: LocalizedText) => string;
  getLocalizedArray: (arrayMap: LocalizedTextArray) => string[];
  supportedLanguages: typeof SUPPORTED_LANGUAGES;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = SafeStorage.getItem('user_language') as Language;
    return SUPPORTED_LANGUAGES.includes(saved) ? saved : DEFAULT_LANGUAGE;
  });

  const direction = getDirection(language);
  const isRTL = checkIsRTL(language);

  // Sync document level attributes whenever language changes
  useEffect(() => {
    const config = getLanguageConfig(language);
    document.documentElement.dir = config.direction;
    document.documentElement.lang = language;
    SafeStorage.setItem('user_language', language);
  }, [language]);

  const setLanguage = useCallback((newLang: Language) => {
    if (SUPPORTED_LANGUAGES.includes(newLang)) {
      setLanguageState(newLang);
    }
  }, []);

  /**
   * Translates UI key path (e.g. "nav.home", "app.title", "simulation.start")
   * Strict Fallback Order: Requested Language -> English ('en') -> Arabic ('ar')
   */
  const t = useCallback(
    (path: string, fallback: string = ''): string => {
      const keys = path.split('.');
      const resolvePath = (dict: unknown): string | null => {
        let current: unknown = dict;
        for (const key of keys) {
          if (current && typeof current === 'object' && key in current) {
            current = (current as Record<string, unknown>)[key];
          } else {
            return null;
          }
        }
        return typeof current === 'string' && current.trim() !== '' ? current : null;
      };

      // 1. Try Requested Language
      const langResult = resolvePath(UI_TRANSLATIONS[language]);
      if (langResult) return langResult;

      // 2. Fallback to English
      const enResult = resolvePath(UI_TRANSLATIONS['en']);
      if (enResult) return enResult;

      // 3. Fallback to Arabic
      const arResult = resolvePath(UI_TRANSLATIONS['ar']);
      if (arResult) return arResult;

      return fallback || path;
    },
    [language]
  );

  const resolveLocalizedText = useCallback(
    (textMap: LocalizedText) => getLocalizedText(textMap, language),
    [language]
  );

  const resolveLocalizedArray = useCallback(
    (arrayMap: LocalizedTextArray) => getLocalizedArray(arrayMap, language),
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        direction,
        isRTL,
        setLanguage,
        t,
        getLocalizedText: resolveLocalizedText,
        getLocalizedArray: resolveLocalizedArray,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
