/**
 * Language and Localization Types for TAQ Laboratory
 */

export type Language = 'ar' | 'en' | 'ku' | 'kmr' | 'bad';

export type TextDirection = 'rtl' | 'ltr';

export interface LanguageConfig {
  code: Language;
  name: string;
  nativeName: string;
  direction: TextDirection;
}

/**
 * Single language map structure for all localized string fields.
 * Guarantees every entity has translations across all 4 supported languages.
 */
export type LocalizedText = Record<Language, string>;

/**
 * Language map structure for arrays of localized strings (e.g., procedures, lists).
 */
export type LocalizedTextArray = Record<Language, string[]>;
