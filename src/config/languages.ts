import { Language, LanguageConfig } from '../types/language';

export const DEFAULT_LANGUAGE: Language = 'ar';

export const SUPPORTED_LANGUAGES: Language[] = ['ar', 'en', 'ku', 'kmr'];

export const LANGUAGE_CONFIGS: Record<Language, LanguageConfig> = {
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
  },
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
  },
  ku: {
    code: 'ku',
    name: 'Sorani Kurdish',
    nativeName: 'کوردی (سۆرانی)',
    direction: 'rtl',
  },
  kmr: {
    code: 'kmr',
    name: 'Kurmanji Kurdish',
    nativeName: 'Kurdî (Kurmancî)',
    direction: 'ltr',
  },
};

export function getLanguageConfig(lang: Language): LanguageConfig {
  return LANGUAGE_CONFIGS[lang] || LANGUAGE_CONFIGS[DEFAULT_LANGUAGE];
}
