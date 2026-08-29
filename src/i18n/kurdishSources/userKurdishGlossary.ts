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
  // Mechanics & Motion
  displacement: {
    termId: 'displacement',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'لادان',
    kmr: 'Cihguhêzbarî',
  },
  distance: {
    termId: 'distance',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'دووری (مەودا)',
    kmr: 'Dûrî (Mewda)',
  },
  velocity: {
    termId: 'velocity',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'خێرایی ئاراستەبڕ',
    kmr: 'Leza Arasteyî',
  },
  acceleration: {
    termId: 'acceleration',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'تاودان',
    kmr: 'Lezkirin (Akselerasyon)',
  },
  free_fall: {
    termId: 'free_fall',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'کەوتنی سەربەست',
    kmr: 'Ketina Azad',
  },
  vector: {
    termId: 'vector',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'ئاراستەبڕ (ڤێکتەر)',
    kmr: 'Vektor',
  },
  scalar: {
    termId: 'scalar',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'بڕی پێوانەیی (سکالەر)',
    kmr: 'Pîvana Skalar',
  },
  force: {
    termId: 'force',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'هێز',
    kmr: 'Hêz',
  },
  net_force: {
    termId: 'net_force',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'هێزی بەڕەنجام',
    kmr: 'Hêza Net',
  },
  normal_force: {
    termId: 'normal_force',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'هێزی ستوونی',
    kmr: 'Hêza Stûnî',
  },
  friction: {
    termId: 'friction',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'لێکخشاندن',
    kmr: 'Lêkxişandin',
  },
  inertia: {
    termId: 'inertia',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'سستی (خۆنەگۆڕین)',
    kmr: 'Bêlivî (Inertia)',
  },
  equilibrium: {
    termId: 'equilibrium',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'هاوسەنگی',
    kmr: 'Hevsengî',
  },
  momentum: {
    termId: 'momentum',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'تەوژم (زەخم)',
    kmr: 'Momentum',
  },
  impulse: {
    termId: 'impulse',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'پاڵدان',
    kmr: 'Palvedan',
  },
  work: {
    termId: 'work',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'کار (ئیش)',
    kmr: 'Kar',
  },
  power: {
    termId: 'power',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'توان',
    kmr: 'Hêz (Power)',
  },
  kinetic_energy: {
    termId: 'kinetic_energy',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'وزەی جووڵە',
    kmr: 'Enerjiya Tevgerî',
  },
  potential_energy: {
    termId: 'potential_energy',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'وزەی شیاو (ماتە)',
    kmr: 'Enerjiya Potansiyel',
  },
  mechanical_energy: {
    termId: 'mechanical_energy',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'وزەی میکانیکی',
    kmr: 'Enerjiya Mêkanîkî',
  },
  conservation_of_energy: {
    termId: 'conservation_of_energy',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'پاراستنی وزە',
    kmr: 'Parastina Enerjiyê',
  },
  pendulum: {
    termId: 'pendulum',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'پەندۆل',
    kmr: 'Pendol',
  },
  simple_harmonic_motion: {
    termId: 'simple_harmonic_motion',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'جووڵەی هارمۆنیکی سادە',
    kmr: 'Tevgera lerizînî ya hêsan',
  },
  gravitational_acceleration: {
    termId: 'gravitational_acceleration',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'تاودانی کێشکردن',
    kmr: 'Lezîna kêşanê',
  },
  period: {
    termId: 'period',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'کاتی خول',
    kmr: 'Dema dewrî',
  },
  frequency: {
    termId: 'frequency',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'لەرەلەر (فریکوێنسی)',
    kmr: 'Frekans',
  },
  moment_of_inertia: {
    termId: 'moment_of_inertia',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'زەبری بارنەگۆڕی (عەزمی سستی)',
    kmr: 'Torka bêliviyê',
  },
  angular_velocity: {
    termId: 'angular_velocity',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'خێرایی گۆشەیی',
    kmr: 'Leza goşeyî',
  },
  restoring_force: {
    termId: 'restoring_force',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'هێزی گەڕێنەرەوە',
    kmr: 'Hêza vegerandinê',
  },
  spring_constant: {
    termId: 'spring_constant',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'نەگۆڕی سپرینگ',
    kmr: 'Xweciha hişkbûna zemberekê',
  },
  center_of_mass: {
    termId: 'center_of_mass',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'چەقی بارستایی',
    kmr: 'Navenda Giraniyê',
  },
  centripetal_acceleration: {
    termId: 'centripetal_acceleration',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'چەقە تاودان (تاودانی ناوەندی)',
    kmr: 'Lezkirina Navendî',
  },
  angular_displacement: {
    termId: 'angular_displacement',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'گۆشە لادان',
    kmr: 'Cihguhêzbarî ya Goşeyî',
  },
  angular_acceleration: {
    termId: 'angular_acceleration',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'گۆشە تاودان',
    kmr: 'Lezkirina Goşeyî',
  },
  angular_momentum: {
    termId: 'angular_momentum',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'گۆشە تەوژم',
    kmr: 'Momentuma Goşeyî',
  },
  young_modulus: {
    termId: 'young_modulus',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'هاوکۆلکەی یۆنگ',
    kmr: 'Modula Young',
  },
  // Electricity & Magnetism
  electric_charge: {
    termId: 'electric_charge',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'بارگەی کارەبایی',
    kmr: 'Bara Elektrîkî',
  },
  coulomb_law: {
    termId: 'coulomb_law',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'یاسای کۆلۆم',
    kmr: 'Zagona Coulomb',
  },
  electric_field: {
    termId: 'electric_field',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'بواری کارەبایی',
    kmr: 'Qada Elektrîkî',
  },
  potential_difference: {
    termId: 'potential_difference',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'جیاوازی پۆتانسێل (ڤۆڵتیە)',
    kmr: 'Cudahiya Potansiyelê',
  },
  electric_current: {
    termId: 'electric_current',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'تەزووی کارەبا',
    kmr: 'Herika Elektrîkê',
  },
  electric_resistance: {
    termId: 'electric_resistance',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'بەرگری کارەبایی',
    kmr: 'Berxwedana Elektrîkî',
  },
  capacitance: {
    termId: 'capacitance',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'سێعەت (بارگەیگری)',
    kmr: 'Kapasîteya Elektrîkî',
  },
  magnetic_field: {
    termId: 'magnetic_field',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'بواری موگناتیسی',
    kmr: 'Qada Magnetîkî',
  },
  electromagnetic_induction: {
    termId: 'electromagnetic_induction',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'هاندانی کارۆموگناتیسی',
    kmr: 'Înduksiyona Elektromagnetîk',
  },
  transformer: {
    termId: 'transformer',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'ترانسفۆرمەر (گۆڕەری ڤۆڵتیە)',
    kmr: 'Trafoya Elektrîkê',
  },
  // Waves & Sound & Optics
  amplitude: {
    termId: 'amplitude',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'فراوانی (ئەمپلیتود)',
    kmr: 'Firehî (Amplitude)',
  },
  wavelength: {
    termId: 'wavelength',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'درێژی شەپۆل (لامبدا)',
    kmr: 'Dirêjahiya Pêlê',
  },
  resonance: {
    termId: 'resonance',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'زرنگانەوە (دەنگدانەوە / رەنین)',
    kmr: 'Rezonans',
  },
  standing_wave: {
    termId: 'standing_wave',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'شەپۆلی وەستاو (موقوف)',
    kmr: 'Pêla Rawestayî',
  },
  constructive_interference: {
    termId: 'constructive_interference',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'دەستتێوەردانی دروستکەر',
    kmr: 'Destwerdana Avaker',
  },
  destructive_interference: {
    termId: 'destructive_interference',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'دەستتێوەردانی لەناوچوو',
    kmr: 'Destwerdana Wêranker',
  },
  index_of_refraction: {
    termId: 'index_of_refraction',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'هاوکۆلکەی شکانەوەی ناوەند',
    kmr: 'Nîşaneya Şikandinê',
  },
  lens: {
    termId: 'lens',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'هاوێنە',
    kmr: 'Lêns (Neynik)',
  },
  // Thermodynamics & Fluids
  pressure: {
    termId: 'pressure',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'پەستان',
    kmr: 'Zext (Pestan)',
  },
  density: {
    termId: 'density',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'بارستە چڕی (ڕۆ)',
    kmr: 'Çirî (Densitî)',
  },
  buoyant_force: {
    termId: 'buoyant_force',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'هێزی سەرخەر (هێزی ئەرخەمیدس)',
    kmr: 'Hêza Hilgirtinê',
  },
  latent_heat: {
    termId: 'latent_heat',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'گەرمی شاراوە (ماتەگەرمی)',
    kmr: 'Germa Şehrawî',
  },
  thermal_equilibrium: {
    termId: 'thermal_equilibrium',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'هاوسەنگی گەرمی',
    kmr: 'Hevsengiya Germî',
  },
  internal_energy: {
    termId: 'internal_energy',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'وزەی ناوەکی',
    kmr: 'Enerjiya Navxweyî',
  },
  // Modern & Nuclear Physics
  photon: {
    termId: 'photon',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'فۆتۆن',
    kmr: 'Foton',
  },
  blackbody_radiation: {
    termId: 'blackbody_radiation',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'تیشکدانی تەنی ڕەش',
    kmr: 'Tîrêjên Laşê Reş',
  },
  photoelectric_effect: {
    termId: 'photoelectric_effect',
    sourceBook: 'Sorani Dictionary & Grade 10-12',
    ku: 'دیاردەی کارۆڕووناکی',
    kmr: 'Bandora Fotoelektrîk',
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
