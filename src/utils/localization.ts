import { DEFAULT_LANGUAGE, LANGUAGE_CONFIGS } from '../config/languages';
import { Language, LocalizedText, LocalizedTextArray, TextDirection } from '../types/language';

/**
 * Safely resolves localized text for a given language code.
 * Strict Fallback Order:
 * - For 'ku': ku -> kmr -> ar -> en -> first available non-empty
 * - For 'kmr': kmr -> ku -> ar -> en -> first available non-empty
 * - For 'ar': ar -> en -> ku -> kmr -> first available non-empty
 * - For 'en': en -> ar -> ku -> kmr -> first available non-empty
 */
export function getLocalizedText(
  textMap: LocalizedText,
  lang: Language
): string {
  if (!textMap) return '';
  
  if (lang === 'bad') {
    if (textMap['bad'] && textMap['bad'].trim() !== '') return textMap['bad'];
    if (textMap['ku'] && textMap['ku'].trim() !== '') return textMap['ku'];
    if (textMap['kmr'] && textMap['kmr'].trim() !== '') return textMap['kmr'];
    if (textMap['ar'] && textMap['ar'].trim() !== '') return textMap['ar'];
    if (textMap['en'] && textMap['en'].trim() !== '') return textMap['en'];
  } else if (lang === 'ku') {
    if (textMap['ku'] && textMap['ku'].trim() !== '') return textMap['ku'];
    if (textMap['bad'] && textMap['bad'].trim() !== '') return textMap['bad'];
    if (textMap['kmr'] && textMap['kmr'].trim() !== '') return textMap['kmr'];
    if (textMap['ar'] && textMap['ar'].trim() !== '') return textMap['ar'];
    if (textMap['en'] && textMap['en'].trim() !== '') return textMap['en'];
  } else if (lang === 'kmr') {
    if (textMap['kmr'] && textMap['kmr'].trim() !== '') return textMap['kmr'];
    if (textMap['ku'] && textMap['ku'].trim() !== '') return textMap['ku'];
    if (textMap['bad'] && textMap['bad'].trim() !== '') return textMap['bad'];
    if (textMap['ar'] && textMap['ar'].trim() !== '') return textMap['ar'];
    if (textMap['en'] && textMap['en'].trim() !== '') return textMap['en'];
  } else if (lang === 'ar') {
    if (textMap['ar'] && textMap['ar'].trim() !== '') return textMap['ar'];
    if (textMap['en'] && textMap['en'].trim() !== '') return textMap['en'];
    if (textMap['bad'] && textMap['bad'].trim() !== '') return textMap['bad'];
    if (textMap['ku'] && textMap['ku'].trim() !== '') return textMap['ku'];
    if (textMap['kmr'] && textMap['kmr'].trim() !== '') return textMap['kmr'];
  } else {
    if (textMap['en'] && textMap['en'].trim() !== '') return textMap['en'];
    if (textMap['ar'] && textMap['ar'].trim() !== '') return textMap['ar'];
    if (textMap['bad'] && textMap['bad'].trim() !== '') return textMap['bad'];
    if (textMap['ku'] && textMap['ku'].trim() !== '') return textMap['ku'];
    if (textMap['kmr'] && textMap['kmr'].trim() !== '') return textMap['kmr'];
  }
  
  // Final safeguard: return first non-empty string in the map
  const fallback = Object.values(textMap).find((val) => typeof val === 'string' && val.trim() !== '');
  return fallback || '';
}

/**
 * Safely resolves a localized array of strings for a given language code.
 * Strict Fallback Order:
 * - For 'ku': ku -> kmr -> ar -> en -> first available non-empty
 * - For 'kmr': kmr -> ku -> ar -> en -> first available non-empty
 * - For 'ar': ar -> en -> ku -> kmr -> first available non-empty
 * - For 'en': en -> ar -> ku -> kmr -> first available non-empty
 */
export function getLocalizedArray(
  arrayMap: LocalizedTextArray,
  lang: Language
): string[] {
  if (!arrayMap) return [];

  if (lang === 'bad') {
    if (arrayMap['bad'] && arrayMap['bad'].length > 0) return arrayMap['bad'];
    if (arrayMap['ku'] && arrayMap['ku'].length > 0) return arrayMap['ku'];
    if (arrayMap['kmr'] && arrayMap['kmr'].length > 0) return arrayMap['kmr'];
    if (arrayMap['ar'] && arrayMap['ar'].length > 0) return arrayMap['ar'];
    if (arrayMap['en'] && arrayMap['en'].length > 0) return arrayMap['en'];
  } else if (lang === 'ku') {
    if (arrayMap['ku'] && arrayMap['ku'].length > 0) return arrayMap['ku'];
    if (arrayMap['bad'] && arrayMap['bad'].length > 0) return arrayMap['bad'];
    if (arrayMap['kmr'] && arrayMap['kmr'].length > 0) return arrayMap['kmr'];
    if (arrayMap['ar'] && arrayMap['ar'].length > 0) return arrayMap['ar'];
    if (arrayMap['en'] && arrayMap['en'].length > 0) return arrayMap['en'];
  } else if (lang === 'kmr') {
    if (arrayMap['kmr'] && arrayMap['kmr'].length > 0) return arrayMap['kmr'];
    if (arrayMap['ku'] && arrayMap['ku'].length > 0) return arrayMap['ku'];
    if (arrayMap['bad'] && arrayMap['bad'].length > 0) return arrayMap['bad'];
    if (arrayMap['ar'] && arrayMap['ar'].length > 0) return arrayMap['ar'];
    if (arrayMap['en'] && arrayMap['en'].length > 0) return arrayMap['en'];
  } else if (lang === 'ar') {
    if (arrayMap['ar'] && arrayMap['ar'].length > 0) return arrayMap['ar'];
    if (arrayMap['en'] && arrayMap['en'].length > 0) return arrayMap['en'];
    if (arrayMap['bad'] && arrayMap['bad'].length > 0) return arrayMap['bad'];
    if (arrayMap['ku'] && arrayMap['ku'].length > 0) return arrayMap['ku'];
    if (arrayMap['kmr'] && arrayMap['kmr'].length > 0) return arrayMap['kmr'];
  } else {
    if (arrayMap['en'] && arrayMap['en'].length > 0) return arrayMap['en'];
    if (arrayMap['ar'] && arrayMap['ar'].length > 0) return arrayMap['ar'];
    if (arrayMap['bad'] && arrayMap['bad'].length > 0) return arrayMap['bad'];
    if (arrayMap['ku'] && arrayMap['ku'].length > 0) return arrayMap['ku'];
    if (arrayMap['kmr'] && arrayMap['kmr'].length > 0) return arrayMap['kmr'];
  }

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
