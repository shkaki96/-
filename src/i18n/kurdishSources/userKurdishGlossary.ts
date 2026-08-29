import { Language } from '../../types/language';

/**
 * User-provided Kurdish Physics Glossary & Textbook Reference Repository.
 * 
 * DESIGN PRINCIPLE:
 * This registry holds offline terminology extracted from user-provided Kurdish physics textbooks
 * (e.g. Ministry of Education Sorani & Kurmanji curricula).
 * 
 * It allows adding, extending, or updating textbook terms without making external API calls
 * and without altering any component or application logic.
 */

export interface KurdishTermEntry {
  termId: string;
  sourceBook?: string; // Reference textbook or chapter
  ku: string;  // Sorani Kurdish (RTL)
  kmr: string; // Kurmanji Kurdish (LTR)
}

/**
 * Registry of standardized Kurdish physics terms mapped from official educational textbooks.
 */
export const USER_KURDISH_PHYSICS_GLOSSARY: Record<string, KurdishTermEntry> = {
  pendulum: {
    termId: 'pendulum',
    sourceBook: 'Fîzîk Amadeyî 3 - Waneya 3',
    ku: 'پەندۆل',
    kmr: 'Pendol',
  },
  simple_harmonic_motion: {
    termId: 'simple_harmonic_motion',
    sourceBook: 'Fîzîk Amadeyî 2 / 3',
    ku: 'جووڵەی هارمۆنیکی سادە',
    kmr: 'Tevgera lerizînî ya hêsan',
  },
  gravitational_acceleration: {
    termId: 'gravitational_acceleration',
    sourceBook: 'Fîzîk Amadeyî 1 / 3',
    ku: 'تاودانی کێشکردن',
    kmr: 'Lezîna kêşanê',
  },
  period: {
    termId: 'period',
    sourceBook: 'Fîzîk Amadeyî 2 / 3',
    ku: 'کاتی خول',
    kmr: 'Dema dewrî',
  },
  frequency: {
    termId: 'frequency',
    sourceBook: 'Fîzîk Amadeyî 1 / 2 / 3',
    ku: 'فریکوێنسی',
    kmr: 'Frekans',
  },
  kinetic_energy: {
    termId: 'kinetic_energy',
    sourceBook: 'Fîzîk Amadeyî 1 / 2 / 3',
    ku: 'توانای جووڵە',
    kmr: 'Enerjiya tevgerî',
  },
  potential_energy: {
    termId: 'potential_energy',
    sourceBook: 'Fîzîk Amadeyî 1 / 3',
    ku: 'توانای ئامادە',
    kmr: 'Enerjiya potansiyelê',
  },
  moment_of_inertia: {
    termId: 'moment_of_inertia',
    sourceBook: 'Fîzîk Amadeyî 2 / 3',
    ku: 'عەزمی سرەوتن',
    kmr: 'Torka bêliviyê',
  },
  angular_velocity: {
    termId: 'angular_velocity',
    sourceBook: 'Fîzîk Amadeyî 2 / 3',
    ku: 'خێرایی گۆشەیی',
    kmr: 'Leza goşeyî',
  },
  restoring_force: {
    termId: 'restoring_force',
    sourceBook: 'Fîzîk Amadeyî 1 / 3',
    ku: 'هێزی گەڕێنەرەوە',
    kmr: 'Hêza vegerandinê',
  },
  spring_constant: {
    termId: 'spring_constant',
    sourceBook: 'Fîzîk Amadeyî 2 / 3',
    ku: 'نەگۆڕی سپرینگ',
    kmr: 'Xweciha hişkbûna zemberekê',
  },
};

/**
 * Helper to retrieve a verified term from the user-provided Kurdish textbook sources.
 */
export function getKurdishTextbookTerm(termId: string, lang: 'ku' | 'kmr'): string | null {
  const entry = USER_KURDISH_PHYSICS_GLOSSARY[termId];
  if (!entry) return null;
  return lang === 'ku' ? entry.ku : entry.kmr;
}
