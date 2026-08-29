import { Experiment } from '../../types/experiment';

/**
 * Official Experiment #23: Simple Pendulum Period and Gravity — T = 2π · √(L / g)
 * Adheres strictly to the unified Language Map schema.
 */
export const PROTOTYPE_EXPERIMENT: Experiment = {
  id: 'exp-023-simple-pendulum-period-gravity',
  codeNumber: 23,
  category: 'mechanics',
  title: {
    ar: 'زمن دورة البندول البسيط والجاذبية',
    en: 'Simple Pendulum Period and Gravity',
    ku: 'کاتی خولی پەندۆلی سادە و کێشکردن',
    kmr: 'Dema Dorê ya Pêndula Hêsan û Gravîtasyon',
  },
  description: {
    ar: 'دراسة الحركة التوافقية البسيطة وحساب زمن الدورة وعلاقتها بطول الخيط وتسارع الجاذبية.',
    en: 'Study simple harmonic motion, period calculations, and dependence on string length and gravitational acceleration.',
    ku: 'لێکۆڵینەوە لە جووڵەی هارمۆنیکی سادە و هەژمارکردنی کاتی خول و پەیوەندی بە درێژی پەت و خێرایی کێشکردن.',
    kmr: 'Lêkolîna tevgera harmonîk a hêsan û hesabkirina dema dorê û pêwendiya wê bi dirêjiya ben û lezkirina erdê re.',
  },
  howItWorks: {
    ar: 'عند إزاحة البندول عن موضع اتزانه وتركه حر الحركة، تقوم مكونة مركب الوزن المماسة للمسار بإعادة الكتلة نحو موضع الاتزان.',
    en: 'When displaced from equilibrium, gravity provides a restoring force proportional to the angle, accelerating the mass back toward the center position.',
    ku: 'کاتێک پەندۆل لە شوێنی هاوسەنگی خۆی لادەدرێت، هێزی کێشکردن هێزێکی گەڕێنەرەوە دروست دەکات بۆ گەڕاندنەوەی بۆ ناوەند.',
    kmr: 'Gava pêndula ji cîhê xwe yê hevsengiyê tê veguhastin, hêza gravîtasyonê hêzek vedigere çêdike ku ber bi navendê ve dibe.',
  },
  whatHappened: {
    ar: 'تتحول الطاقة الكامنة في أقصى إزاحة إلى طاقة حركية بالكامل عند المرور بموضع الاتزان، مما تؤدي لإعادة الدورة بشكل دوري.',
    en: 'Potential energy at maximum amplitude continuously converts into kinetic energy at the equilibrium point, driving periodic oscillation.',
    ku: 'توانای ئامادە لە بەرزترین خاڵدا دەبێتە توانای جووڵە لە خاڵی هاوسەنگی، کە دەبێتە هۆی جووڵەی خولی بەرردەوام.',
    kmr: 'Anarşiya pozîsyonê di xala herî bilind de dibe anarşiya tevgerê di xala hevsengiyê de, û tevgera dewranî pêk tîne.',
  },
  result: {
    ar: 'زمن دورة البندول البسيط يعتمد فقط على طول الخيط وتسارع الجاذبية، ولا يعتمد على كتلة الجسم أو الزوايا الصغيرة.',
    en: 'The period of a simple pendulum depends strictly on string length and gravitational acceleration, remaining independent of mass for small angles.',
    ku: 'کاتی خولی پەندۆل تەنها بەستراوە بە درێژی پەت و کێشکردنەوە، و بەستراو نییە بە بارستە لە گۆشە بچووکەکاندا.',
    kmr: 'Dema dorê ya pêndulê tenê bi dirêjiya ben û lezkirina erdê re girêdayî ye, û ji giranî di goşeyên piçûk de serbixwe ye.',
  },
  inputs: {
    ar: ['طول الخيط (L)', 'تسارع الجاذبية الأرضية (g)', 'الكتلة (m)', 'زاوية الإزاحة الإبتدائية (θ)'],
    en: ['String Length (L)', 'Gravitational Acceleration (g)', 'Mass (m)', 'Initial Displacement Angle (θ)'],
    ku: ['درێژی پەت (L)', 'تاودانی کێشکردن (g)', 'بڕی ماددە (m)', 'گۆشەی سەرەتایی (θ)'],
    kmr: ['Dirêjiya Ben (L)', 'Lezkirina Erdê (g)', 'Giranî (m)', 'Goşeya Destpêkê (θ)'],
  },
  outputs: {
    ar: ['زمن الدورة (T)', 'التردد (f)', 'الطاقة الحركية (Ek)', 'الطاقة الكامنة (Ep)'],
    en: ['Period (T)', 'Frequency (f)', 'Kinetic Energy (Ek)', 'Potential Energy (Ep)'],
    ku: ['کاتی خول (T)', 'فریکوێنسی (f)', 'توانای جووڵە (Ek)', 'توانای ئامادە (Ep)'],
    kmr: ['Dema Dorê (T)', 'Frîkans (f)', 'Anarşiya Tevgerê (Ek)', 'Anarşiya Pozîsyonê (Ep)'],
  },
  explanation: {
    ar: 'يتكون البندول البسيط من كتلة نقطية معلقة بخيط مهمل الكتلة غير قابل للاستطالة. تخضع حركته لقانون الحركة التوافقية البسيطة عند الزوايا الصغيرة.',
    en: 'A simple pendulum consists of a point mass suspended from a massless, inextensible string. Under small angle approximations, it exhibits Simple Harmonic Motion (SHM).',
    ku: 'پەندۆلی سادە پێکدێت لە بڕە ماددەیەکی هەڵواستراو بە پەتێکی بێ کێش. لە گۆشە بچووکەکاندا جووڵەکەی گوێڕایەڵی یاسای هارمۆنیکی سادەیە.',
    kmr: 'Pêndula hêsan ji giraniyekî rawestayî li ser benekî bê-giranî pêk tê. Di goşeyên piçûk de tevgera wê harmonîk e.',
  },
  procedure: {
    ar: [
      'حدد طول الخيط المطلوب باستخدام شريط التمرير.',
      'اختر تسارع الجاذبية المناسب (الكرة الأرضية، القمر، أو كوكب آخر).',
      'اسحب الكتلة لزاوية إزاحة صغيرة (أقل من 15 درجة).',
      'ابدأ المحاكاة وقس زمن 10 دورات كاملة لحساب زمن الدورة الواحدة.',
    ],
    en: [
      'Adjust string length using the parameter slider.',
      'Select gravitational acceleration (Earth, Moon, or custom).',
      'Displace the pendulum mass to a small initial angle (< 15°).',
      'Start the simulation and observe period and energy oscillations.',
    ],
    ku: [
      'درێژی پەت دیاری بکە بەکارهێنانی خلیسکێنە.',
      'تاودانی کێشکردن هەڵبژێرە.',
      'بارستەکە ڕابکێشە بۆ گۆشەیەکی بچووک.',
      'هاوشێوەسازی دەستپێبکە و کاتی خول بپێوە.',
    ],
    kmr: [
      'Dirêjiya ben bi rêیا sliderê saz bike.',
      'Lezkirina erdê hilbijêre.',
      'Giraniyê ber bi goşeyek piçûk ve bikşîne.',
      'Simulasyonê bide destpêkirin û dema dorê bipîve.',
    ],
  },
  physicalLaw: 'T = 2π · √(L / g)',
  parameters: [
    {
      id: 'length',
      label: { ar: 'طول الخيط', en: 'String Length', ku: 'درێژی پەت', kmr: 'Dirêjiya Ben' },
      unit: 'm',
      min: 0.1,
      max: 5.0,
      step: 0.1,
      defaultValue: 1.0,
    },
    {
      id: 'gravity',
      label: { ar: 'تسارع الجاذبية', en: 'Gravity', ku: 'کێشکردن', kmr: 'Lezkirina Erdê' },
      unit: 'm/s²',
      min: 1.0,
      max: 25.0,
      step: 0.1,
      defaultValue: 9.81,
    },
    {
      id: 'mass',
      label: { ar: 'الكتلة', en: 'Mass', ku: 'بارسته', kmr: 'Giranî' },
      unit: 'kg',
      min: 0.1,
      max: 10.0,
      step: 0.1,
      defaultValue: 1.0,
    },
    {
      id: 'initialAngle',
      label: { ar: 'الزاوية الابتدائية', en: 'Initial Angle', ku: 'گۆشەی سەرەتایی', kmr: 'Goşeya Destpêکê' },
      unit: '°',
      min: 1,
      max: 45,
      step: 1,
      defaultValue: 15,
    },
  ],
  outputMetrics: [
    {
      id: 'period',
      label: { ar: 'زمن الدورة', en: 'Period', ku: 'کاتی خول', kmr: 'Dema Dorê' },
      unit: 's',
      symbol: 'T',
    },
    {
      id: 'frequency',
      label: { ar: 'التردد', en: 'Frequency', ku: 'فریکوێنسی', kmr: 'Frîkans' },
      unit: 'Hz',
      symbol: 'f',
    },
  ],
  supportedRenderers: ['canvas2d'],
};
