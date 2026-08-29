import { DEFAULT_LANGUAGE, LANGUAGE_CONFIGS } from '../config/languages';
import { Language, LocalizedText, LocalizedTextArray, TextDirection } from '../types/language';

/**
 * Safely resolves localized text for a given language code.
 * Strict Fallback Order: Requested Language -> English ('en') -> Arabic ('ar') -> first available value.
 */
export function getLocalizedText(
  textMap: LocalizedText,
  lang: Language
): string {
  if (!textMap) return '';
  if (textMap[lang] && textMap[lang].trim() !== '') return textMap[lang];
  if (textMap['en'] && textMap['en'].trim() !== '') return textMap['en'];
  if (textMap['ar'] && textMap['ar'].trim() !== '') return textMap['ar'];
  
  // Final safeguard: return first non-empty string in the map
  const fallback = Object.values(textMap).find((val) => typeof val === 'string' && val.trim() !== '');
  return fallback || '';
}

/**
 * Safely resolves a localized array of strings for a given language code.
 * Strict Fallback Order: Requested Language -> English ('en') -> Arabic ('ar') -> first available array.
 */
export function getLocalizedArray(
  arrayMap: LocalizedTextArray,
  lang: Language
): string[] {
  if (!arrayMap) return [];
  if (arrayMap[lang] && arrayMap[lang].length > 0) return arrayMap[lang];
  if (arrayMap['en'] && arrayMap['en'].length > 0) return arrayMap['en'];
  if (arrayMap['ar'] && arrayMap['ar'].length > 0) return arrayMap['ar'];

  const fallback = Object.values(arrayMap).find((arr) => Array.isArray(arr) && arr.length > 0);
  return fallback || [];
}

/**
 * Returns true if the language orientation is Right-to-Left (RTL).
 */
export function isRTL(lang: Language): boolean {
  const config = LANGUAGE_CONFIGS[lang];
  return config ? config.direction === 'rtl' : true;
}

/**
 * Returns the direction attribute ('rtl' | 'ltr') for a given language.
 */
export function getDirection(lang: Language): TextDirection {
  const config = LANGUAGE_CONFIGS[lang];
  return config ? config.direction : 'rtl';
}
