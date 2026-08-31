import { Experiment, PhysicsParameter, PhysicsOutput } from '../../types/experiment';
import { PROTOTYPE_EXPERIMENT } from './prototypeExperiment';

/**
 * Official Badini Titles Mapping for all 70 TAQ experiments
 * Grounded in authentic Kurdish (Badini) physics curriculum terminology.
 */
const BADINI_TITLES_MAP: Record<number, string> = {
  1: 'ئیش، گەرمی و یاسایا ئێکێ یا تێرمۆدینامیکێ',
  2: 'بەرچاڤکێن پزیشکی و شیانا هاوێنەی',
  3: 'پێریسکۆپ و یاسایا ڤەگەڕیانێ',
  4: 'کارەبا سەکەن و یاسایا کۆلۆمی',
  5: 'پێشبڕکێیا شلیسکۆکان و یاسایێن لێکخشاندنێ',
  6: 'گەهاندنا گەرمییێ و یاسایا فۆریێ',
  7: 'هه‌ڤسه‌نگیا ئالیکۆکێ و هه‌ڤسه‌نگیا عەزمی',
  8: 'هاندانا کارۆموگناتیسی و یاسایا فارادای',
  9: 'لیچقی، یاسایا ستۆکس و لەزاتیا دووماهییێ',
  10: 'ئاستێ لار و ئامیرێن سادە',
  11: 'پێشگرێن مەتری و گوهۆڕینێن زانستی',
  12: 'فشار، شێواندن و موکۆمیا یۆنگ',
  13: 'پرەنسیپێ بێرنۆلی و رێڕەوێ ڤێنتۆری',
  14: 'ئاوینێن گۆشەدار و وێنەیێن ڤەگەڕیانا زۆر',
  15: 'ئاوینێن گۆیی یێن چەماو (قۆقز و قۆل)',
  16: 'هاوێنەیێن تەنک و هاوکێشەیا دووریا بؤری',
  17: 'جەمسەرگیریا رووناهییێ و یاسایا مالوس',
  18: 'بەلاڤبوونا رووناهییێ و یاسایا رالی یا بەلاڤبوونێ',
  19: 'درێژیا کەڤانی، رادیان و لڤینا گۆشەیی',
  20: 'عەزمێ سرەوتنێ و دینامیکا خولانەڤێ',
  21: 'ناڤەندا بارستایی یا سیستەم و تەنان',
  22: 'پاراستنا وزێ د پەندۆلیدا',
  23: 'دەمێ خولێ و تاودانا کێشکرنێ د پەندۆلی دا',
  24: 'لڤینا هاڤێتووکی و رێڕەوێ مەودایی',
  25: 'یاسایا هووک و لەرینەڤا هارمۆنیکی یا زەمبەرەکی',
  26: 'پاراستنا تەوژمێ هێلی و پێێکدادان',
  27: 'کینماتیکا کەفتنا سەربەست و تاودانا کێشکرنێ',
  28: 'دەنگڤەدان د بۆریێن ڤەکری و داخستیدا',
  29: 'لەزاتیا دەنگی دگەل دەنگڤەدانا ستوونا ئاڤێ',
  30: 'بیناییا پێلی و دەستتێوەردانا درزێ دوانە یێ یۆنگ',
  31: 'بیاڤێ موگناتیسی و هێزا لۆرێنتز ل سەر بارگەیان',
  32: 'شەبەنگێ دەرهاڤێتنا ئەتۆمی و دەربازبوونێن کوانتەمی',
  33: 'زڤرۆکێن کارەبێ، یاسایا ئۆمی و بەلاڤبوونا شیانێ',
  34: 'پرەنسیپێ ئەرخەمیدس و هێزا سەرئێخەر',
  35: 'یاسایا گازی نموونەیی و بارێ تێرمۆدینامیکی',
  36: 'بینایی و یاسایا سنێل یا شکانەڤێ',
  37: 'ئاڤاکرنا ئەتۆمێ و خشتەیێ خولی',
  38: 'ئاڤاکرنا ناڤۆکێ و وزا گرێدانێ',
  39: 'تاقیکرنا رەزەرفۆرد بۆ بەلاڤبوونا ئەلفا',
  40: 'کارلێکا گەردان دگەل فۆتۆنێن رووناهییێ',
  41: 'دیتنا رەنگان و تێکەلکرنا کۆمکەرا RGB',
  42: 'تاقیگەها بارگەگری و وزا کارەبایی یا عەمبارکری',
  43: 'بارگەیێن کارەبایی، هێڵێن بیاڤی و ئەرک',
  44: 'بەرگریا تێلێ و یاسایا بەرگریا تایبەت',
  45: 'کێشکرن و میکانیکا خولگەهان',
  46: 'یاسایێن کێپلەر بۆ لڤینا گرستێران',
  47: 'یاریگەها سکەیتێ و گوهۆڕینێن وزێ',
  48: 'زنجیرا فۆریێ و پێکهاتنا پێلێن هارمۆنیک',
  49: 'پێل ل سەر دەزی و لەزاتیا قۆناغێ',
  50: 'بارێن ماددەی، گوهۆڕینێن باری و گەرمیا ڤەشارتی',
  51: 'بەلاڤبوونا گازان و یاسایا گراهام بۆ دەرچوونێ',
  52: 'لڤینا خولانەڤێ و کۆمە عەزم',
  53: 'مۆدێلێن ئەتۆما هایدرۆجینێ',
  54: 'باکێجا ئاڤاکرنا زڤرۆکێن کارەبێ (پێشکەفتی)',
  55: 'موەلیدا کارەبێ (جێنەرەیتەر)',
  56: 'موگناتیس و قیبلەنما',
  57: 'موگناتیس و کارۆموگناتیس',
  58: 'تاقیگەها هێزا کێشکرنێ',
  59: 'کۆمەلا من یا رۆژێ و میکانیکا فرە-تەنان',
  60: 'شێوازێن وزێ و گوهۆڕینێن وێ',
  61: 'مودێن سروشتی و فریکوێنسێن دەنگڤەدانێ',
  62: 'هێز و لڤین: بنەما',
  63: 'تایبەتمەندیێن گازان و یاسایا پەستانا لڤینێ',
  64: 'بەلاڤبوونا گەردی و یاسایا ئێکێ یا فیک',
  65: 'شەبەنگێ لەشێ رەش و یاسایێن پلانک و ڤین',
  66: 'کاریگەریا دۆپلەر و گوهاستنا دەنگی',
  67: 'گوهاستەرێ کارەبێ و یاسایا هاندانا هەڤبەش',
  68: 'دیاردەیا کارۆرووناهی و یاسایا کوانتەمی یا ئەینشتاین',
  69: 'هەلوەشینا تیشکدەر و یاسایا نیڤەژینا ناڤۆکی',
  70: 'پێڤانا گەرمییێ و یاسایا هه‌ڤسه‌نگیا گەرمیێ',
};

/**
 * Helper function to instantiate structured experiments for the Official TAQ 70 Experiment Catalog.
 * Guarantees strict localization across English, Arabic, Sorani Kurdish, Kurmanji, and Badini.
 */
function createExperiment(
  code: number,
  slug: string,
  category: Experiment['category'],
  physicalLaw: string,
  titleEn: string,
  titleAr?: string,
  titleKu?: string,
  titleKmr?: string,
  titleBad?: string,
  descEn?: string,
  descAr?: string,
  descKu?: string,
  descKmr?: string,
  descBad?: string
): Experiment {
  const arTitle = titleAr || titleEn;
  const kuTitle = titleKu || titleEn;
  const kmrTitle = titleKmr || titleEn;
  const badTitle = titleBad || BADINI_TITLES_MAP[code] || titleEn;

  const defaultDescEn = descEn || `Interactive scientific study of ${titleEn} governed by ${physicalLaw}.`;
  const defaultDescAr = descAr || `دراسة علمية تفاعلية لـ ${arTitle} الخاضعة للقانون الفيزيائي ${physicalLaw}.`;
  const defaultDescKu = descKu || `لێکۆڵینەوەی زانستی کارلێککارانە لە ${kuTitle} بەپێی یاسای فیزیکی ${physicalLaw}.`;
  const defaultDescKmr = descKmr || `Lêkolîna zanistî ya înteraktîf a ${kmrTitle} li ser bingeha yasaya fîzîkî ${physicalLaw}.`;
  const defaultDescBad = descBad || `ڤەکۆلینا زانستی یا کارلێککەر ل سەر ${badTitle} ل دویڤ یاسایا فیزیکی ${physicalLaw}.`;

  return {
    id: `exp-${String(code).padStart(3, '0')}-${slug}`,
    codeNumber: code,
    category,
    physicalLaw,
    title: { en: titleEn, ar: arTitle, ku: kuTitle, kmr: kmrTitle, bad: badTitle },
    description: { en: defaultDescEn, ar: defaultDescAr, ku: defaultDescKu, kmr: defaultDescKmr, bad: defaultDescBad },
    howItWorks: {
      en: `Simulates physical interactions based on ${physicalLaw}.`,
      ar: `محاكاة التفاعلات الفيزيائية بناءً على ${physicalLaw}.`,
      ku: `هاوشێوەسازی کارلێکە فیزیکییەکان لەسەر بنەمای ${physicalLaw}.`,
      kmr: `Simulasyona têkiliyên fîzîkî li ser bingeha ${physicalLaw}.`,
      bad: `سیمیولەیشنا کارلێکێن فیزیکی دکەت ل سەر بنەمایێ ${physicalLaw}.`,
    },
    whatHappened: {
      en: 'System variables respond dynamically to parameter changes.',
      ar: 'تتفاعل متغيرات النظام بشكل ديناميكي مع تغيير المعايير.',
      ku: 'گۆڕاوەکانی سیستمەکە بە شێوەیەکی دیاریکراو وەڵام دەدەنەوە.',
      kmr: 'Guherbarên sîstemê bi rengekî dînamîk bersivê didin.',
      bad: 'گوهۆڕۆکێن سیستەمی ب شێوەیەکێ دینامیکی بەرسڤا گوهۆڕینا پارامیتەران ددەن.',
    },
    result: {
      en: 'Experimental measurements conform strictly to theoretical predictions.',
      ar: 'تتوافق القياسات التجريبية بدقة مع التوقعات النظرية.',
      ku: 'پێوانە ئەزموونییەکان بە تەواوی لەگەڵ پێشبینییە تیۆرییەکان دەگونجێن.',
      kmr: 'Pîvanên ezmûnî bi temamî bi پێşbîniyên teorîk re li hev dikin.',
      bad: 'پێڤانێن تاقیکرنێ ب دروستی دگەل پێشبینیێن بیردۆزی دگونجن.',
    },
    inputs: {
      en: ['Primary Variable', 'Environment Constant'],
      ar: ['المتغير الأساسي', 'ثابت البيئة'],
      ku: ['گۆڕاوی سەرەکی', 'نەگۆڕی ژینگە'],
      kmr: ['Guherbarê Serekî', 'Neqora Jîngehê'],
      bad: ['گوهۆڕۆکێ سەرەکی', 'نەگۆڕێ ژینگەهێ'],
    },
    outputs: {
      en: ['Response Value', 'System Energy'],
      ar: ['قيمة الاستجابة', 'طاقة النظام'],
      ku: ['نرخی وەڵامدانەوە', 'توانای سیستم'],
      kmr: ['Nirxa Bersivê', 'Anarşiya Sîstemê'],
      bad: ['بهایێ بەرسڤدانێ', 'وزا سیستەمی'],
    },
    explanation: {
      en: `Theoretical principles behind ${titleEn} governed by ${physicalLaw}.`,
      ar: `المبادئ النظرية وراء ${arTitle} الخاضعة لقانون ${physicalLaw}.`,
      ku: `پڕەنسیپە تیۆرییەکانی دواوەی ${kuTitle} کە بەپێی ${physicalLaw} کاردەکەن.`,
      kmr: `Prensîbên teorîk ên li pişt ${kmrTitle} yên ku ji hêla ${physicalLaw} ve tên birêvebirin.`,
      bad: `پرەنسیپێن بیردۆزی یێن ل پشت ${badTitle} یێن کو ب رێکا ${physicalLaw} دهێنە برێڤەبرن.`,
    },
    procedure: {
      en: ['Adjust parameters', 'Observe output response', 'Record data points'],
      ar: ['ضبط المعايير', 'ملاحظة استجابة المخرجات', 'تسجيل نقاط البيانات'],
      ku: ['ڕێکخستنی پارامیتەرەکان', 'ملاحظەکردنی دەرئەنجام', 'تۆمارکردنی زانیارییەکان'],
      kmr: ['Sazkirina parametreyan', 'Çavdêriya encaman', 'Torkirina daneyan'],
      bad: ['رێکخستنا پارامیتەران', 'چاڤدێریکرنا بەرسڤا دەرکەفتیان', 'تۆمارکرنا خالێن داتایێ'],
    },
    parameters: getParametersForExperiment(code, category),
    outputMetrics: getOutputMetricsForExperiment(code, category),
    supportedRenderers: ['canvas2d'],
  };
}

function getParametersForExperiment(code: number, category: string): PhysicsParameter[] {
  switch (code) {
    case 1:
      return [
        {
          id: 'heatAdded',
          label: { en: 'Heat Added (Q)', ar: 'الحرارة المضافة (Q)', ku: 'گەرمی زیادکراو (Q)', kmr: 'Germiya Zêdekirî (Q)', bad: 'گەرمیا زێدەکری (Q)' },
          unit: 'J',
          min: -500,
          max: 1000,
          step: 25,
          defaultValue: 400,
        },
        {
          id: 'workDone',
          label: { en: 'Work Done by Gas (W)', ar: 'الشغل المنجز من الغاز (W)', ku: 'کاری ئەنجامدراو (W)', kmr: 'Kara Hatiye Kirin (W)', bad: 'کارێ هاتیە کرن (W)' },
          unit: 'J',
          min: -500,
          max: 1000,
          step: 25,
          defaultValue: 150,
        },
      ];
    case 2:
      return [
        {
          id: 'focalLength',
          label: { en: 'Focal Length (f)', ar: 'البعد البؤري (f)', ku: 'دووری بؤری (f)', kmr: 'Dûriya Balgehê (f)', bad: 'دویریا بالگەهی (f)' },
          unit: 'cm',
          min: -50,
          max: 50,
          step: 1,
          defaultValue: 20,
        },
        {
          id: 'objectDistance',
          label: { en: 'Object Distance (dₒ)', ar: 'بعد الجسم (dₒ)', ku: 'دووری تەن (dₒ)', kmr: 'Dûriya Tiştî (dₒ)', bad: 'دویریا تەنێ (dₒ)' },
          unit: 'cm',
          min: 5,
          max: 100,
          step: 1,
          defaultValue: 40,
        },
        {
          id: 'objectHeight',
          label: { en: 'Object Height (hₒ)', ar: 'طول الجسم (hₒ)', ku: 'بەرزی تەن (hₒ)', kmr: 'Bilindiya Tiştî (hₒ)', bad: 'بلندیا تەنێ (hₒ)' },
          unit: 'cm',
          min: 2,
          max: 30,
          step: 1,
          defaultValue: 10,
        },
      ];
    case 3:
      return [
        {
          id: 'incidentAngle',
          label: { en: 'Incident Angle (θᵢ)', ar: 'زاوية السقوط (θᵢ)', ku: 'گۆشەی کەوتن (θᵢ)', kmr: 'Goşeya Ketinê (θᵢ)', bad: 'گۆشەیا کەفتنێ (θᵢ)' },
          unit: '°',
          min: 10,
          max: 80,
          step: 1,
          defaultValue: 45,
        },
        {
          id: 'periscopeHeight',
          label: { en: 'Periscope Height (H)', ar: 'ارتفاع البريسكوب (H)', ku: 'بەرزی پێریسکۆپ (H)', kmr: 'Bilindiya Pêrîskopê (H)', bad: 'بلندیا پێریسکۆپێ (H)' },
          unit: 'cm',
          min: 20,
          max: 120,
          step: 5,
          defaultValue: 60,
        },
      ];
    case 4:
      return [
        {
          id: 'charge1',
          label: { en: 'Charge 1 (q₁)', ar: 'الشحنة الأولى (q₁)', ku: 'بارگەی یەکەم (q₁)', kmr: 'Bargê Yekem (q₁)', bad: 'بارگەیێ ئێکێ (q₁)' },
          unit: 'μC',
          min: -50,
          max: 50,
          step: 1,
          defaultValue: 10,
        },
        {
          id: 'charge2',
          label: { en: 'Charge 2 (q₂)', ar: 'الشحنة الثانية (q₂)', ku: 'بارگەی دووەم (q₂)', kmr: 'Bargê Duyem (q₂)', bad: 'بارگەیێ دووێ (q₂)' },
          unit: 'μC',
          min: -50,
          max: 50,
          step: 1,
          defaultValue: 20,
        },
        {
          id: 'distance',
          label: { en: 'Distance (r)', ar: 'المسافة (r)', ku: 'دووری (r)', kmr: 'Dûrî (r)', bad: 'دویراتی (r)' },
          unit: 'cm',
          min: 2,
          max: 50,
          step: 1,
          defaultValue: 10,
        },
      ];
    case 5:
      return [
        {
          id: 'mass',
          label: { en: 'Sled Mass (m)', ar: 'كتلة الزلاجة (m)', ku: 'بارستەی خلیسکێنە (m)', kmr: 'Giraniya Xşokê (m)', bad: 'بارستەیا خلیسکانکێ (m)' },
          unit: 'kg',
          min: 1,
          max: 50,
          step: 1,
          defaultValue: 10,
        },
        {
          id: 'frictionCoeff',
          label: { en: 'Friction Coeff (μₖ)', ar: 'معامل الاحتكاك (μₖ)', ku: 'هاوکۆڵەی لێکخشاندن (μₖ)', kmr: 'Qatjimara Îshqilînê (μₖ)', bad: 'رێژەیا لێکخشاندنێ (μₖ)' },
          unit: '',
          min: 0.05,
          max: 0.95,
          step: 0.05,
          defaultValue: 0.25,
        },
        {
          id: 'force',
          label: { en: 'Applied Pull Force (F)', ar: 'قوة السحب (F)', ku: 'هێزی ڕاکێشان (F)', kmr: 'Hêza Rakêşanê (F)', bad: 'هێزا راکێشانێ (F)' },
          unit: 'N',
          min: 0,
          max: 200,
          step: 5,
          defaultValue: 50,
        },
      ];
    case 25:
      return [
        {
          id: 'springConstant',
          label: { en: 'Spring Constant (k)', ar: 'ثابت النابض (k)', ku: 'نەگۆڕی سپرینگ (k)', kmr: 'Neqora Spiringê (k)', bad: 'نەگۆڕێ سپرینگێ (k)' },
          unit: 'N/m',
          min: 10,
          max: 200,
          step: 5,
          defaultValue: 50,
        },
        {
          id: 'mass',
          label: { en: 'Hanging Mass (m)', ar: 'الكتلة المعلقة (m)', ku: 'بارستەی هەڵواسراو (m)', kmr: 'Giraniya Daleqandî (m)', bad: 'بارستەیا شۆڕکری (m)' },
          unit: 'kg',
          min: 0.2,
          max: 10.0,
          step: 0.1,
          defaultValue: 2.0,
        },
      ];
    case 30:
      return [
        {
          id: 'wavelength',
          label: { en: 'Laser Wavelength (λ)', ar: 'طول موجة الليزر (λ)', ku: 'درێژی شەپۆلی لەیزەر (λ)', kmr: 'Dirêjiya Pêla Laserê (λ)', bad: 'درێژیا پێلا لەیزەری (λ)' },
          unit: 'nm',
          min: 380,
          max: 750,
          step: 5,
          defaultValue: 532,
        },
        {
          id: 'slitDistance',
          label: { en: 'Slit Separation (d)', ar: 'المسافة بين الشقين (d)', ku: 'دووری نێوان درزەکان (d)', kmr: 'Dûriya Qelşan (d)', bad: 'دویریا درزان (d)' },
          unit: 'μm',
          min: 10,
          max: 150,
          step: 5,
          defaultValue: 50,
        },
      ];
    case 33:
      return [
        {
          id: 'voltage',
          label: { en: 'Supply Voltage (V)', ar: 'جهد المصدر (V)', ku: 'ڤۆڵتیەی سەرچاوە (V)', kmr: 'Voltaja Çavkaniyê (V)', bad: 'ڤۆلتییا ژێدەری (V)' },
          unit: 'V',
          min: 1,
          max: 48,
          step: 1,
          defaultValue: 12,
        },
        {
          id: 'resistance',
          label: { en: 'Circuit Resistance (R)', ar: 'مقاومة الدارة (R)', ku: 'بەرگری بازنە (R)', kmr: 'Berxwedana Çerxê (R)', bad: 'بەرگریا بازنەی (R)' },
          unit: 'Ω',
          min: 1,
          max: 500,
          step: 5,
          defaultValue: 100,
        },
      ];
    case 34:
      return [
        {
          id: 'fluidDensity',
          label: { en: 'Fluid Density (ρ)', ar: 'كثافة السائل (ρ)', ku: 'چڕی شلە (ρ)', kmr: 'Tirşiya Avê (ρ)', bad: 'چڕیا شلەمەنیێ (ρ)' },
          unit: 'kg/m³',
          min: 500,
          max: 2000,
          step: 50,
          defaultValue: 1000,
        },
        {
          id: 'objectVolume',
          label: { en: 'Object Volume (V)', ar: 'حجم الجسم (V)', ku: 'قەبارەی تەن (V)', kmr: 'Qebareya Tiştî (V)', bad: 'قەبارێ تەنێ (V)' },
          unit: 'L',
          min: 0.5,
          max: 10.0,
          step: 0.5,
          defaultValue: 3.0,
        },
      ];
    case 36:
      return [
        {
          id: 'n1',
          label: { en: 'Index Medium 1 (n₁)', ar: 'معامل الوسط الأول (n₁)', ku: 'هاوکۆڵەی ناوەندی 1 (n₁)', kmr: 'Şikestina Navenda 1 (n₁)', bad: 'هاوکۆلکێ ناڤەندێ 1 (n₁)' },
          unit: '',
          min: 1.0,
          max: 2.5,
          step: 0.05,
          defaultValue: 1.0,
        },
        {
          id: 'n2',
          label: { en: 'Index Medium 2 (n₂)', ar: 'معامل الوسط الثاني (n₂)', ku: 'هاوکۆڵەی ناوەندی 2 (n₂)', kmr: 'Şikestina Navenda 2 (n₂)', bad: 'هاوکۆلکێ ناڤەندێ 2 (n₂)' },
          unit: '',
          min: 1.0,
          max: 2.5,
          step: 0.05,
          defaultValue: 1.5,
        },
        {
          id: 'incidentAngle',
          label: { en: 'Incident Angle (θ₁)', ar: 'زاوية السقوط (θ₁)', ku: 'گۆشەی کەوتن (θ₁)', kmr: 'Goşeya Ketinê (θ₁)', bad: 'گۆشەیا کەفتنێ (θ₁)' },
          unit: '°',
          min: 0,
          max: 89,
          step: 1,
          defaultValue: 30,
        },
      ];
    case 68:
      return [
        {
          id: 'wavelength',
          label: { en: 'Wavelength (λ)', ar: 'طول الموجة (λ)', ku: 'درێژی شەپۆل (λ)', kmr: 'Dirêjiya Pêlê (λ)', bad: 'درێژیا پێلێ (λ)' },
          unit: 'nm',
          min: 150,
          max: 700,
          step: 5,
          defaultValue: 275,
        },
        {
          id: 'workFunction',
          label: { en: 'Work Function (Φ)', ar: 'دالة الشغل (Φ)', ku: 'نەخشی کار (Φ)', kmr: 'Fonksiyona Kar (Φ)', bad: 'نەخشێ کاری (Φ)' },
          unit: 'eV',
          min: 1.8,
          max: 6.0,
          step: 0.1,
          defaultValue: 2.3,
        },
      ];
    case 69:
      return [
        {
          id: 'initialNuclei',
          label: { en: 'Initial Nuclei (N₀)', ar: 'الأنوية الابتدائية (N₀)', ku: 'ناوکە سەرەتاییەکان (N₀)', kmr: 'Navokên Destpêkê (N₀)', bad: 'ناڤۆکێن دەستپێکی (N₀)' },
          unit: 'nuclei',
          min: 50,
          max: 500,
          step: 25,
          defaultValue: 200,
        },
        {
          id: 'halfLife',
          label: { en: 'Half-Life (T½)', ar: 'فترة نصف العمر (T½)', ku: 'نیوەژین (T½)', kmr: 'Nîv-Jiyan (T½)', bad: 'نیڤەژین (T½)' },
          unit: 's',
          min: 1,
          max: 30,
          step: 1,
          defaultValue: 5,
        },
      ];
    case 23:
      return [
        {
          id: 'length',
          label: { en: 'Pendulum Length (L)', ar: 'طول البندول (L)', ku: 'درێژی پەندۆڵ (L)', kmr: 'Dirêjiya Pêndulê (L)', bad: 'درێژیا پەندۆلی (L)' },
          unit: 'm',
          min: 0.2,
          max: 3.0,
          step: 0.1,
          defaultValue: 1.0,
        },
        {
          id: 'gravity',
          label: { en: 'Gravity Acceleration (g)', ar: 'تسارع الجاذبية (g)', ku: 'تاودانی کێشکردن (g)', kmr: 'Lezkirina Erdê (g)', bad: 'لەزاتییا کێشکرنێ (g)' },
          unit: 'm/s²',
          min: 1.6,
          max: 25.0,
          step: 0.1,
          defaultValue: 9.8,
        },
        {
          id: 'initialAngle',
          label: { en: 'Initial Angle (θ₀)', ar: 'الزاوية الابتدائية (θ₀)', ku: 'گۆشەی سەرەتایی (θ₀)', kmr: 'Goşeya Destpêkê (θ₀)', bad: 'گۆشەیا دەستپێکی (θ₀)' },
          unit: '°',
          min: 5,
          max: 60,
          step: 1,
          defaultValue: 20,
        },
      ];
    case 24:
      return [
        {
          id: 'initialVelocity',
          label: { en: 'Launch Velocity (v₀)', ar: 'سرعة الإطلاق (v₀)', ku: 'خێرایی هاویشتن (v₀)', kmr: 'Leza Avêtinê (v₀)', bad: 'لەزاتییا هاڤێتنێ (v₀)' },
          unit: 'm/s',
          min: 5,
          max: 60,
          step: 1,
          defaultValue: 25,
        },
        {
          id: 'launchAngle',
          label: { en: 'Launch Angle (θ)', ar: 'زاوية الإطلاق (θ)', ku: 'گۆشەی هاویشتن (θ)', kmr: 'Goşeya Avêtinê (θ)', bad: 'گۆشەیا هاڤێتنێ (θ)' },
          unit: '°',
          min: 10,
          max: 85,
          step: 1,
          defaultValue: 45,
        },
        {
          id: 'gravity',
          label: { en: 'Gravity (g)', ar: 'الجاذبية (g)', ku: 'کێشکردن (g)', kmr: 'Gravîtasyon (g)', bad: 'کێشکرن (g)' },
          unit: 'm/s²',
          min: 1.6,
          max: 25.0,
          step: 0.1,
          defaultValue: 9.8,
        },
      ];
    case 28:
    case 29:
      return [
        {
          id: 'pipeLength',
          label: { en: 'Pipe Length (L)', ar: 'طول الأنبوب (L)', ku: 'درێژی بۆری (L)', kmr: 'Dirêjiya Lûleyê (L)', bad: 'درێژیا بۆریێ (L)' },
          unit: 'm',
          min: 0.2,
          max: 2.0,
          step: 0.05,
          defaultValue: 0.85,
        },
        {
          id: 'harmonic',
          label: { en: 'Harmonic Mode (n)', ar: 'النمط التوافقي (n)', ku: 'شێوازی هارمۆنیک (n)', kmr: 'Moda Harmonîk (n)', bad: 'شێوازێ هارمۆنیک (n)' },
          unit: '',
          min: 1,
          max: 6,
          step: 1,
          defaultValue: 1,
        },
        {
          id: 'soundSpeed',
          label: { en: 'Speed of Sound (v)', ar: 'سرعة الصوت (v)', ku: 'خێرایی دەنگ (v)', kmr: 'Leza Deng (v)', bad: 'لەزاتییا دەنگی (v)' },
          unit: 'm/s',
          min: 300,
          max: 380,
          step: 1,
          defaultValue: 343,
        },
      ];
    case 49:
    case 61:
      return [
        {
          id: 'tension',
          label: { en: 'String Tension (T)', ar: 'شد الخيط (T)', ku: 'ڕاکێشانی پەت (T)', kmr: 'Girjiya Ben (T)', bad: 'راکێشانا پەتکی (T)' },
          unit: 'N',
          min: 10,
          max: 300,
          step: 5,
          defaultValue: 120,
        },
        {
          id: 'linearDensity',
          label: { en: 'Linear Density (μ)', ar: 'الكثافة الخطية (μ)', ku: 'چڕی هێڵی (μ)', kmr: 'Tirşiya Hêlî (μ)', bad: 'چڕیا هێلی (μ)' },
          unit: 'g/m',
          min: 1,
          max: 20,
          step: 0.5,
          defaultValue: 5,
        },
        {
          id: 'harmonic',
          label: { en: 'Harmonic (n)', ar: 'الرتبة التوافقية (n)', ku: 'پلەی هارمۆنیک (n)', kmr: 'Harmonîk (n)', bad: 'پلا هارمۆنیک (n)' },
          unit: '',
          min: 1,
          max: 5,
          step: 1,
          defaultValue: 2,
        },
      ];
    case 66:
      return [
        {
          id: 'sourceSpeed',
          label: { en: 'Source Speed (vₛ)', ar: 'سرعة المصدر (vₛ)', ku: 'خێرایی سەرچاوە (vₛ)', kmr: 'Leza Çavkaniyê (vₛ)', bad: 'لەزاتییا ژێدەری (vₛ)' },
          unit: 'm/s',
          min: 0,
          max: 250,
          step: 5,
          defaultValue: 60,
        },
        {
          id: 'sourceFrequency',
          label: { en: 'Source Frequency (f₀)', ar: 'تردد المصدر (f₀)', ku: 'فریکوێنسی سەرچاوە (f₀)', kmr: 'Frîkansa Çavkaniyê (f₀)', bad: 'فریکوێنسیا ژێدەری (f₀)' },
          unit: 'Hz',
          min: 100,
          max: 1000,
          step: 10,
          defaultValue: 440,
        },
        {
          id: 'soundSpeed',
          label: { en: 'Speed of Sound (v)', ar: 'سرعة الصوت (v)', ku: 'خێرایی دەنگ (v)', kmr: 'Leza Deng (v)', bad: 'لەزاتییا دەنگی (v)' },
          unit: 'm/s',
          min: 300,
          max: 380,
          step: 1,
          defaultValue: 343,
        },
      ];
    default:
      if (category === 'waves') {
        return [
          {
            id: 'frequency',
            label: { en: 'Frequency (f)', ar: 'التردد (f)', ku: 'فریکوێنسی (f)', kmr: 'Frîkans (f)', bad: 'فریکوێنس (f)' },
            unit: 'Hz',
            min: 50,
            max: 1000,
            step: 10,
            defaultValue: 440,
          },
          {
            id: 'soundSpeed',
            label: { en: 'Wave Speed (v)', ar: 'سرعة الموجة (v)', ku: 'خێرایی شەپۆل (v)', kmr: 'Leza Pêlê (v)', bad: 'لەزاتییا پێلێ (v)' },
            unit: 'm/s',
            min: 100,
            max: 500,
            step: 5,
            defaultValue: 343,
          },
        ];
      }
      if (category === 'optics') {
        return [
          {
            id: 'focalLength',
            label: { en: 'Focal Length (f)', ar: 'البعد البؤري (f)', ku: 'دووری بؤری (f)', kmr: 'Dûriya Balgehê (f)', bad: 'دویریا بالگەهی (f)' },
            unit: 'cm',
            min: 5,
            max: 50,
            step: 1,
            defaultValue: 20,
          },
          {
            id: 'objectDistance',
            label: { en: 'Object Distance (dₒ)', ar: 'بعد الجسم (dₒ)', ku: 'دووری تەن (dₒ)', kmr: 'Dûriya Tiştî (dₒ)', bad: 'دویریا تەنێ (dₒ)' },
            unit: 'cm',
            min: 5,
            max: 100,
            step: 1,
            defaultValue: 40,
          },
        ];
      }
      if (category === 'thermodynamics') {
        return [
          {
            id: 'temperature',
            label: { en: 'Temperature (T)', ar: 'درجة الحرارة (T)', ku: 'پلەی گەرمی (T)', kmr: 'Germahî (T)', bad: 'پلەیا گەرمییێ (T)' },
            unit: 'K',
            min: 100,
            max: 800,
            step: 10,
            defaultValue: 300,
          },
          {
            id: 'volume',
            label: { en: 'Volume (V)', ar: 'الحجم (V)', ku: 'قەبارە (V)', kmr: 'Qebare (V)', bad: 'قەبارە (V)' },
            unit: 'L',
            min: 1,
            max: 50,
            step: 1,
            defaultValue: 10,
          },
        ];
      }
      if (category === 'electricity') {
        return [
          {
            id: 'voltage',
            label: { en: 'Supply Voltage (V)', ar: 'جهد المصدر (V)', ku: 'ڤۆڵتیەی سەرچاوە (V)', kmr: 'Voltaja Çavkaniyê (V)', bad: 'ڤۆلتییا ژێدەری (V)' },
            unit: 'V',
            min: 1,
            max: 50,
            step: 1,
            defaultValue: 12,
          },
          {
            id: 'resistance',
            label: { en: 'Resistance (R)', ar: 'المقاومة (R)', ku: 'بەرگری (R)', kmr: 'Berxwedan (R)', bad: 'بەرگری (R)' },
            unit: 'Ω',
            min: 1,
            max: 200,
            step: 1,
            defaultValue: 50,
          },
        ];
      }
      if (category === 'modern_physics' || category === 'quantum' || category === 'nuclear') {
        return [
          {
            id: 'energy',
            label: { en: 'Photon Energy (E)', ar: 'طاقة الفوتون (E)', ku: 'وزەی فۆتۆن (E)', kmr: 'Enerjiya Foton (E)', bad: 'وزا فۆتۆنی (E)' },
            unit: 'eV',
            min: 1.0,
            max: 15.0,
            step: 0.1,
            defaultValue: 3.5,
          },
          {
            id: 'wavelength',
            label: { en: 'Wavelength (λ)', ar: 'طول الموجة (λ)', ku: 'درێژی شەپۆل (λ)', kmr: 'Dirêjiya Pêlê (λ)', bad: 'درێژیا پێلێ (λ)' },
            unit: 'nm',
            min: 200,
            max: 800,
            step: 10,
            defaultValue: 450,
          },
        ];
      }
      // Mechanics default
      return [
        {
          id: 'mass',
          label: { en: 'Mass (m)', ar: 'الكتلة (m)', ku: 'بارستە (m)', kmr: 'Giranî (m)', bad: 'بارستە (m)' },
          unit: 'kg',
          min: 0.5,
          max: 50,
          step: 0.5,
          defaultValue: 5,
        },
        {
          id: 'velocity',
          label: { en: 'Velocity (v)', ar: 'السرعة (v)', ku: 'خێرایی (v)', kmr: 'Lez (v)', bad: 'لەزاتی (v)' },
          unit: 'm/s',
          min: 1,
          max: 60,
          step: 1,
          defaultValue: 15,
        },
      ];
  }
}

function getOutputMetricsForExperiment(code: number, category: string): PhysicsOutput[] {
  switch (code) {
    case 1:
      return [
        { id: 'deltaU', label: { en: 'Internal Energy (ΔU)', ar: 'الطاقة الداخلية (ΔU)', ku: 'وزەی ناوەکی (ΔU)', kmr: 'Enerjiya Hundurîn', bad: 'وزا ناڤخۆیی (ΔU)' }, unit: 'J', symbol: 'ΔU' },
        { id: 'finalTemp', label: { en: 'Final Temperature (T)', ar: 'درجة الحرارة (T)', ku: 'پلەی گەرمی (T)', kmr: 'Germahî (T)', bad: 'پلەیا گەرمییێ (T)' }, unit: 'K', symbol: 'T' },
      ];
    case 2:
      return [
        { id: 'lensPower', label: { en: 'Lens Power (P)', ar: 'قوة العدسة (P)', ku: 'هێزی هاوێنە (P)', kmr: 'Hêza Lênsê (P)', bad: 'شیانا هاوێنێ (P)' }, unit: 'dpt', symbol: 'P' },
        { id: 'imageDistance', label: { en: 'Image Distance (dᵢ)', ar: 'بعد الصورة (dᵢ)', ku: 'دووری وێنە (dᵢ)', kmr: 'Dûriya Wêneyê (dᵢ)', bad: 'دویریا وێنەی (dᵢ)' }, unit: 'cm', symbol: 'd_i' },
        { id: 'magnification', label: { en: 'Magnification (M)', ar: 'التكبير (M)', ku: 'گەورەکردن (M)', kmr: 'Mezinbûn (M)', bad: 'مەزنکرن (M)' }, unit: '×', symbol: 'M' },
      ];
    case 3:
      return [
        { id: 'reflectionAngle', label: { en: 'Reflection Angle (θᵣ)', ar: 'زاوية الانعكاس (θᵣ)', ku: 'گۆشەی پێچەوانە (θᵣ)', kmr: 'Goşeya Vegerînê', bad: 'گۆشەیا زڤرینێ (θᵣ)' }, unit: '°', symbol: 'θ_r' },
        { id: 'pathLength', label: { en: 'Light Path Length (L)', ar: 'طول مسار الضوء (L)', ku: 'درێژی ڕێڕەو (L)', kmr: 'Dirêjiya Rêyê', bad: 'درێژیا رێڕەوی (L)' }, unit: 'cm', symbol: 'L' },
      ];
    case 4:
      return [
        { id: 'coulombForce', label: { en: 'Coulomb Force (F)', ar: 'قوة كولوم (F)', ku: 'هێزی کۆلۆم (F)', kmr: 'Hêza Coulomb', bad: 'هێزا کۆلۆمی (F)' }, unit: 'N', symbol: 'F' },
      ];
    case 5:
      return [
        { id: 'frictionForce', label: { en: 'Friction Force (fₖ)', ar: 'قوة الاحتكاك (fₖ)', ku: 'هێزی لێکخشاندن (fₖ)', kmr: 'Hêza Îshqilînê', bad: 'هێزا لێکخشاندنێ (fₖ)' }, unit: 'N', symbol: 'f_k' },
        { id: 'acceleration', label: { en: 'Acceleration (a)', ar: 'التسارع (a)', ku: 'تاودان (a)', kmr: 'Lezdan (a)', bad: 'لەزاتی (a)' }, unit: 'm/s²', symbol: 'a' },
      ];
    case 23:
      return [
        { id: 'period', label: { en: 'Period (T)', ar: 'الزمن الدوري (T)', ku: 'خولی کات (T)', kmr: 'Dema Xulê (T)', bad: 'دەما خولێ (T)' }, unit: 's', symbol: 'T' },
        { id: 'frequency', label: { en: 'Frequency (f)', ar: 'التردد (f)', ku: 'فریکوێنسی (f)', kmr: 'Frîkans (f)', bad: 'فریکوێنس (f)' }, unit: 'Hz', symbol: 'f' },
      ];
    case 24:
      return [
        { id: 'range', label: { en: 'Max Range (R)', ar: 'المدى الأقصى (R)', ku: 'مەودای کۆتایی (R)', kmr: 'Mewdaya Dawî (R)', bad: 'مەودایا دوماهییێ (R)' }, unit: 'm', symbol: 'R' },
        { id: 'maxHeight', label: { en: 'Max Height (H)', ar: 'أقصى ارتفاع (H)', ku: 'بەرزترین ئاست (H)', kmr: 'Bilindahiya Bilind (H)', bad: 'بلندترین ئاست (H)' }, unit: 'm', symbol: 'H' },
        { id: 'flightTime', label: { en: 'Time of Flight (t)', ar: 'زمن التحليق (t)', ku: 'کاتی فڕین (t)', kmr: 'Dema Firînê (t)', bad: 'دەما فڕینێ (t)' }, unit: 's', symbol: 't' },
      ];
    case 25:
      return [
        { id: 'period', label: { en: 'Oscillation Period (T)', ar: 'زمن التذبذب (T)', ku: 'خولی لەرینەوە (T)', kmr: 'Dema Hejandinê (T)', bad: 'دەما لەرینێ (T)' }, unit: 's', symbol: 'T' },
        { id: 'frequency', label: { en: 'Frequency (f)', ar: 'التردد (f)', ku: 'فریکوێنسی (f)', kmr: 'Frîkans (f)', bad: 'فریکوێنس (f)' }, unit: 'Hz', symbol: 'f' },
      ];
    case 28:
    case 29:
      return [
        { id: 'resonantFrequency', label: { en: 'Resonant Freq (f_res)', ar: 'تردد الرنين (f_res)', ku: 'فریکوێنسی دەنگدانەوە', kmr: 'Frîkansa Rezonansê', bad: 'فریکوێنسیا دەنگڤەدانێ' }, unit: 'Hz', symbol: 'f_res' },
        { id: 'wavelength', label: { en: 'Wavelength (λ)', ar: 'طول الموجة (λ)', ku: 'درێژی شەپۆل (λ)', kmr: 'Dirêjiya Pêlê (λ)', bad: 'درێژیا پێلێ (λ)' }, unit: 'm', symbol: 'λ' },
      ];
    case 30:
      return [
        { id: 'fringeSpacing', label: { en: 'Fringe Spacing (Δy)', ar: 'المسافة بين الأهداب (Δy)', ku: 'مەودای هێڵەکان (Δy)', kmr: 'Mewdaya Xetan', bad: 'مەودایا هێلان (Δy)' }, unit: 'mm', symbol: 'Δy' },
      ];
    case 33:
      return [
        { id: 'current', label: { en: 'Current (I)', ar: 'التيار (I)', ku: 'تەزوو (I)', kmr: 'Herik (I)', bad: 'تەزوو (I)' }, unit: 'A', symbol: 'I' },
        { id: 'power', label: { en: 'Power Dissipation (P)', ar: 'القدرة (P)', ku: 'توانا (P)', kmr: 'Hêz (P)', bad: 'شیان (P)' }, unit: 'W', symbol: 'P' },
      ];
    case 34:
      return [
        { id: 'buoyantForce', label: { en: 'Buoyant Force (F_B)', ar: 'قوة الطفو (F_B)', ku: 'هێزی بەرزکەرەوە', kmr: 'Hêza Rakirinê', bad: 'هێزا سەرئێخستنێ' }, unit: 'N', symbol: 'F_B' },
      ];
    case 36:
      return [
        { id: 'refractedAngle', label: { en: 'Refracted Angle (θ₂)', ar: 'زاوية الانكسار (θ₂)', ku: 'گۆشەی تێکشکاندن (θ₂)', kmr: 'Goşeya Şikestinê', bad: 'گۆشەیا شکانەڤێ (θ₂)' }, unit: '°', symbol: 'θ₂' },
        { id: 'criticalAngle', label: { en: 'Critical Angle (θ_c)', ar: 'الزاوية الحرجة (θ_c)', ku: 'گۆشەی ئاستەنگ (θ_c)', kmr: 'Goşeya Krîtîk', bad: 'گۆشەیا رەخنەگر (θ_c)' }, unit: '°', symbol: 'θ_c' },
      ];
    case 49:
    case 61:
      return [
        { id: 'waveSpeed', label: { en: 'Phase Wave Speed (v)', ar: 'سرعة الطور للموجة (v)', ku: 'خێرایی شەپۆل (v)', kmr: 'Leza Pêlê (v)', bad: 'لەزاتییا پێلێ (v)' }, unit: 'm/s', symbol: 'v' },
        { id: 'frequency', label: { en: 'Resonant Frequency (f)', ar: 'التردد الرنيني (f)', ku: 'فریکوێنسی دەنگدانەوە (f)', kmr: 'Frîkansa Rezonansê (f)', bad: 'فریکوێنسیا دەنگڤەدانێ (f)' }, unit: 'Hz', symbol: 'f' },
      ];
    case 66:
      return [
        { id: 'observedFrequencyAhead', label: { en: 'Observed Freq Ahead (f′)', ar: 'التردد المشاهد في الأمام (f′)', ku: 'فریکوێنسی بینراو لە پێشەوە', kmr: 'Frîkansa Pêşî', bad: 'فریکوێنسیا پێشیا ژێدەری' }, unit: 'Hz', symbol: 'f′_ahead' },
        { id: 'observedFrequencyBehind', label: { en: 'Observed Freq Behind (f′)', ar: 'التردد المشاهد في الخلف (f′)', ku: 'فریکوێنسی بینراو لە دواوە', kmr: 'Frîkansa Paşî', bad: 'فریکوێنسیا پاشیا ژێدەری' }, unit: 'Hz', symbol: 'f′_behind' },
        { id: 'frequencyShift', label: { en: 'Doppler Shift (Δf)', ar: 'انزياح دوبلر (Δf)', ku: 'گۆڕانی دۆپلەر (Δf)', kmr: 'Guherîna Doppler', bad: 'گوهۆڕینا دۆپلەری (Δf)' }, unit: 'Hz', symbol: 'Δf' },
        { id: 'machNumber', label: { en: 'Mach Number (M)', ar: 'رقم ماخ (M)', ku: 'ژمارەی ماخ (M)', kmr: 'Hejmara Mach (M)', bad: 'ژمارەیا ماخی (M)' }, unit: '', symbol: 'M' },
      ];
    case 68:
      return [
        { id: 'kineticEnergy', label: { en: 'Kinetic Energy (E_k)', ar: 'الطاقة الحركية (E_k)', ku: 'وزەی جووڵە (E_k)', kmr: 'Enerjiya Tevgerê', bad: 'وزا لڤینێ (E_k)' }, unit: 'eV', symbol: 'E_k' },
        { id: 'cutoffFreq', label: { en: 'Cutoff Frequency (f₀)', ar: 'تردد العتبة (f₀)', ku: 'فریکوێنسی بڕین (f₀)', kmr: 'Frîkansa Qutkirinê', bad: 'فریکوێنسیا بڕینێ (f₀)' }, unit: '×10¹⁴ Hz', symbol: 'f₀' },
      ];
    case 69:
      return [
        { id: 'remainingNuclei', label: { en: 'Remaining Nuclei (N)', ar: 'الأنوية المتبقية (N)', ku: 'ناوکە ماوەکان (N)', kmr: 'Navokên Mayî (N)', bad: 'ناڤۆکێن مایین (N)' }, unit: 'nuclei', symbol: 'N' },
        { id: 'activity', label: { en: 'Activity (A)', ar: 'النشاط الإشعاعي (A)', ku: 'چالاکی تیشکدان (A)', kmr: 'Çalakiya Radyoaktîf', bad: 'چالاکییا تیشکدانێ (A)' }, unit: 'Bq', symbol: 'A' },
      ];
    default:
      if (category === 'waves') {
        return [
          { id: 'frequency', label: { en: 'Frequency (f)', ar: 'التردد (f)', ku: 'فریکوێنسی (f)', kmr: 'Frîkans (f)', bad: 'فریکوێنس (f)' }, unit: 'Hz', symbol: 'f' },
          { id: 'wavelength', label: { en: 'Wavelength (λ)', ar: 'طول الموجة (λ)', ku: 'درێژی شەپۆل (λ)', kmr: 'Dirêjiya Pêlê (λ)', bad: 'درێژیا پێلێ (λ)' }, unit: 'm', symbol: 'λ' },
        ];
      }
      if (category === 'optics') {
        return [
          { id: 'focalLength', label: { en: 'Focal Distance (f)', ar: 'البعد البؤري (f)', ku: 'دووری بؤری (f)', kmr: 'Dûriya Balgehê', bad: 'دویریا بالگەهی' }, unit: 'cm', symbol: 'f' },
          { id: 'magnification', label: { en: 'Magnification (M)', ar: 'التكبير (M)', ku: 'گەورەکردن (M)', kmr: 'Mezinbûn (M)', bad: 'مەزنکرن (M)' }, unit: '×', symbol: 'M' },
        ];
      }
      if (category === 'thermodynamics') {
        return [
          { id: 'pressure', label: { en: 'Pressure (P)', ar: 'الضغط (P)', ku: 'پەستان (P)', kmr: 'Pestan (P)', bad: 'پەستان (P)' }, unit: 'kPa', symbol: 'P' },
          { id: 'temperature', label: { en: 'Temperature (T)', ar: 'درجة الحرارة (T)', ku: 'پلەی گەرمی (T)', kmr: 'Germahî (T)', bad: 'پلەیا گەرمییێ (T)' }, unit: 'K', symbol: 'T' },
        ];
      }
      if (category === 'electricity') {
        return [
          { id: 'current', label: { en: 'Current (I)', ar: 'التيار (I)', ku: 'تەزوو (I)', kmr: 'Herik (I)', bad: 'تەزوو (I)' }, unit: 'A', symbol: 'I' },
          { id: 'power', label: { en: 'Power (P)', ar: 'القدرة (P)', ku: 'توانا (P)', kmr: 'Hêz (P)', bad: 'شیان (P)' }, unit: 'W', symbol: 'P' },
        ];
      }
      if (category === 'modern_physics' || category === 'quantum' || category === 'nuclear') {
        return [
          { id: 'energy', label: { en: 'Energy (E)', ar: 'الطاقة (E)', ku: 'وزە (E)', kmr: 'Enerjî (E)', bad: 'وزە (E)' }, unit: 'eV', symbol: 'E' },
          { id: 'frequency', label: { en: 'Frequency (f)', ar: 'التردد (f)', ku: 'فریکوێنسی (f)', kmr: 'Frîkans (f)', bad: 'فریکوێنس (f)' }, unit: 'Hz', symbol: 'f' },
        ];
      }
      return [
        { id: 'velocity', label: { en: 'Velocity (v)', ar: 'السرعة (v)', ku: 'خێرایی (v)', kmr: 'Lez (v)', bad: 'لەزاتی (v)' }, unit: 'm/s', symbol: 'v' },
        { id: 'kineticEnergy', label: { en: 'Kinetic Energy (E_k)', ar: 'الطاقة الحركية (E_k)', ku: 'وزەی جووڵە (E_k)', kmr: 'Enerjiya Tevgerê', bad: 'وزا لڤینێ (E_k)' }, unit: 'J', symbol: 'E_k' },
      ];
  }
}

/**
 * OFFICIAL TAQ EXPERIMENT CATALOG (70 Experiments)
 * Strictly preserves official IDs 1–70, exact English names, physics categories, and laws.
 */
export const EXPERIMENTS_CATALOG: Experiment[] = [
  createExperiment(1, 'work-heat-1st-law-thermodynamics', 'thermodynamics', 'ΔU = Q - W', 'Work, Heat and 1st Law of Thermodynamics', 'الشغل والحراة والقانون الأول للديناميكا الحرارية', 'کار، گەرمی و یاسای یەکەمی ثێرمۆداینامیک', 'Kar, Germî û Yasa Yekem a Termodînamîkê'),
  createExperiment(2, 'prescription-glasses-lens-power', 'optics', 'P = 1/f', 'Prescription Glasses and Lens Power', 'النظارات الطبية وقوة العدسة', 'پێچکەی پزیشکی و هێزی هاوێنە', 'Pêçkên Pijîşkî û Hêza Lênsê'),
  createExperiment(3, 'periscope-law-of-reflection', 'optics', 'θ_i = θ_r', 'Periscope and Law of Reflection', 'البريسكوب وقانون الانعكاس', 'پێریسکۆپ و یاسای پێچەوانەبوونەوە', 'Pêrîskop û Yasa Vegerînê'),
  createExperiment(4, 'static-electricity-coulomb-law', 'electricity', 'F = k_e · |q₁·q₂| / r²', 'Static Electricity and Coulomb Law', 'الكهرباء الساكنة وقانون كولوم', 'کارەبای جێگیر و یاسای کۆلۆم', 'Elektrîka Sêranî û Yasa Coulomb'),
  createExperiment(5, 'sled-racing-friction-laws', 'mechanics', 'f_k = μ_k · N', 'Sled Racing and Friction Laws', 'سباق الزلاجات وقوانين الاحتكاك', 'پێشبڕکێی خلیسکێنە و یاساکانی لێکخشاندن', 'Pêşbirka Xşokan û Yasamên Îshqilînê'),
  createExperiment(6, 'heat-conduction-fourier-law', 'thermodynamics', 'q = -k · A · (ΔT / L)', 'Heat Conduction and Fourier Law', 'التوصيل الحراري وقانون فورييه', 'گەیاندنی گەرمی و یاسای فۆریێ', 'Gihandina Germî û Yasa Fourier'),
  createExperiment(7, 'seesaw-balance-torque-equilibrium', 'mechanics', 'τ = r · F · sin(θ), Στ = 0', 'Seesaw Balance and Torque Equilibrium', 'توازن الأرجوحة وتوازن العزم', 'هاوسەنگی ڕاگواز و هاوسەنگی عەزم', 'Hevsengiya Seesaw û Morkê'),
  createExperiment(8, 'electromagnetic-induction-faraday-law', 'electricity', 'ε = -N · (ΔΦ / Δt)', 'Electromagnetic Induction and Faraday Law', 'الحث الكهرومغناطيسي وقانون فاراداي', 'هاندانی کارۆمەگناتیسی و یاسای فارادای', 'Îndukasyona Elektromagnetîk û Yasa Faraday'),
  createExperiment(9, 'viscosity-stokes-law-terminal-velocity', 'mechanics', 'F_d = 6π · η · r · v_t', 'Viscosity, Stokes Law & Terminal Velocity', 'اللزوجة وقانون ستوكس والسرعة الحدية', 'چڕی و لمی، یاسای ستۆکس و خێرایی سنووری', 'Lijûkî, Yasa Stokes û Leza Krîtîk'),
  createExperiment(10, 'inclined-plane-simple-machines', 'mechanics', 'MA = 1 / sin(θ) = L / h', 'Inclined Plane & Simple Machines', 'المستوى المائل والآلات البسيطة', 'ئاستی لار و ئامێرە سادەکان', 'Asta Xwar û Mekîneyên Hêsan'),
  createExperiment(11, 'metric-prefixes-scientific-conversions', 'mechanics', 'Value × 10^{±n}', 'Metric Prefixes and Scientific Conversions', 'البادئات المترية والتحويلات العلمية', 'پێشگرە مەترییەکان و گۆڕینە زانستییەکان', 'Pêşgirên Metrî û Guherînên Zanistî'),
  createExperiment(12, 'stress-strain-young-modulus', 'mechanics', 'E = σ / ε = (F/A) / (ΔL/L₀)', 'Stress, Strain and Young Modulus', 'الإجهاد والانفعال ومعامل يونغ', 'سەختی، ڕاکێشان و هاوکۆڵەی یۆنگ', 'Pêşketin, Çەşîn û Modula Young'),
  createExperiment(13, 'bernoulli-principle-venturi-flow', 'mechanics', 'P + ½ρv² + ρgh = Const', 'Bernoulli Principle and Venturi Flow', 'مبدأ برنولي وتدفق فينتوري', 'پڕەنسیپی بەرنۆلی و ڕێڕەوی ڤینتۆری', 'Prensîba Bernoulli û Herika Venturi'),
  createExperiment(14, 'angled-mirrors-multiple-reflection-images', 'optics', 'N = (360° / θ) - 1', 'Angled Mirrors and Multiple Reflection Images', 'المرايا المائلة وصور الانعكاس المتعدد', 'ئاوێنە گۆشەییەکان و وێنەی پێچەوانەی زۆر', 'Neynikên Goşeyî û Wêneyên Zêde'),
  createExperiment(15, 'curved-spherical-mirrors-concave-convex', 'optics', '1/f = 1/d_o + 1/d_i', 'Curved Spherical Mirrors (Concave & Convex)', 'المرايا الكروية المنحنية (المقعرة والمحدبة)', 'ئاوێنە چەماوە گۆییەکان (قۆقز و قووڕ)', 'Neynikên Goyerok (Kov û Muxel)'),
  createExperiment(16, 'thin-lenses-focal-length-equation', 'optics', '1/f = 1/d_o + 1/d_i, M = -d_i/d_o', 'Thin Lenses and Focal Length Equation', 'العدسات الرقيقة ومعادلة البعد البؤري', 'هاوێنە تەنکەکان و هاوکێشەی دووری بؤری', 'Lênsên Zirav û Hevkêşeya Dûriya Balgehê'),
  createExperiment(17, 'light-polarization-malus-law', 'optics', 'I = I₀ · cos²(θ)', 'Light Polarization and Malus Law', 'استقطاب الضوء وقانون مالوس', 'بەجەمسەرکردنی ڕووناکی و یاسای مالۆس', 'Polarîzasyona Ronahiyê û Yasa Malus'),
  createExperiment(18, 'light-scattering-rayleigh-scattering-law', 'optics', 'I ∝ 1 / λ⁴', 'Light Scattering and Rayleigh Scattering Law', 'تشتت الضوء وقانون رالي للتشتت', 'پەرشبوونی ڕووناکی و یاسای ڕایلی', 'Belavbûna Ronahiyê û Yasa Rayleigh'),
  createExperiment(19, 'arc-length-radians-angular-motion', 'mechanics', 's = r · θ, v = r · ω', 'Arc Length, Radians & Angular Motion', 'طول القوس والراديان والحركة الزاوية', 'درێژی کەوانە، ڕادیان و جووڵەی گۆشەیی', 'Dirêjiya Kewanê, Radîan û Tevgera Goşeyî'),
  createExperiment(20, 'moment-of-inertia-rotational-dynamics', 'mechanics', 'τ = I · α', 'Moment of Inertia & Rotational Dynamics', 'عزم القصور الذاتي والديناميكا الدورانية', 'عەزمی سڕی و دینامیکی خولانەوە', 'Morka Inertiyayê û Dînamîka Zivirok'),
  createExperiment(21, 'center-of-mass-systems-objects', 'mechanics', 'X_cm = Σ(m_i · x_i) / Σm_i', 'Center of Mass of Systems and Objects', 'مركز الكتلة للأنظمة والأجسام', 'ناوچەی بارستەی سیستمەکان و لاشەکان', 'Navenda Giraniyê ya Sîstem û Tiştan'),
  createExperiment(22, 'conservation-energy-pendulum', 'mechanics', 'E_tot = K + U = ½mv² + mgh = Const', 'Conservation of Energy in a Pendulum', 'حفظ الطاقة في البندول', 'پاراستنی توانا لە پەندۆلدا', 'Parastina Anarşiyê di Pêndulê de'),
  PROTOTYPE_EXPERIMENT, // #23: Simple Pendulum Period and Gravity — T = 2π · √(L / g)
  createExperiment(24, 'projectile-motion-range-trajectory', 'mechanics', 'R = (v₀² · sin(2θ)) / g, H = (v₀² sin²θ) / 2g', 'Projectile Motion and Range Trajectory', 'حركة المقذوفات ومسار المدى', 'جووڵەی هەڵدراوەکان و ڕێڕەوی دووری', 'Tevgera Projeqtîl û Rêya Cihê'),
  createExperiment(25, 'hooke-law-spring-harmonic-oscillation', 'mechanics', 'F = -k · x, T = 2π · √(m / k)', 'Hooke Law and Spring Harmonic Oscillation', 'قانون هوك والتذبذب التوافقي للنابض', 'یاسای هوک و لەرینەوەی هارمۆنیکی سپرینگ', 'Yasa Hooke û Hejandina Harmonîk a Spiringê'),
  createExperiment(26, 'linear-momentum-conservation-collisions', 'mechanics', 'm₁·v₁ᵢ + m₂·v₂ᵢ = m₁·v₁_f + m₂·v₂_f', 'Linear Momentum Conservation and Collisions', 'حفظ الزخم الخطي والتصادمات', 'پاراستنی زەخمی هێڵی و پێکدادانەکان', 'Parastina Mementomê Hêlî û Pêkdandan'),
  createExperiment(27, 'free-fall-kinematics-gravitational-acceleration', 'mechanics', 'v = g · t, y = ½ · g · t²', 'Free Fall Kinematics and Gravitational Acceleration', 'كينماتيكا السقوط الحر وتسارع الجاذبية', 'کینماتیکی کەوتنی ئازاد و تاودانی کێشکردن', 'Kînematîka Ketina Azad û Lezkirina Erdê'),
  createExperiment(28, 'acoustic-resonance-open-closed-pipes', 'waves', 'f_n = (n · v)/(4L) Closed | (n · v)/(2L) Open', 'Acoustic Resonance in Open and Closed Pipes', 'الرنين الصوتي في الأنابيب المفتوحة والمغلقة', 'دەنگدانەوەی دەنگی لە بۆرییە کراوە و داخراوەکاندا', 'Rezonansa Dengî di Lûleyên Vekirî û Girtî de'),
  createExperiment(29, 'speed-of-sound-water-column-resonance', 'waves', 'v = f · λ = 2f · (L₂ - L₁)', 'Speed of Sound with Water Column Resonance', 'سرعة الصوت مع رنين عمود الماء', 'خێرایی دەنگ لەگەڵ دەنگدانەوەی ستوونی ئاو', 'Leza Deng bi Rezonansa Stûna Avê re'),
  createExperiment(30, 'wave-optics-young-double-slit-interference', 'optics', 'd · sin(θ) = m · λ, y_m = (m · λ · L) / d', 'Wave Optics & Young Double Slit Interference', 'البصريات الموجية وتداخل الشق المزدوج ليانغ', 'بۆچوونی شەپۆلی و دەستتێوەردانی درزی دووانەی یانگ', 'Boptîka Şepolî û Têkiliya Şeqê Dujmar a Young'),
  createExperiment(31, 'magnetic-field-lorentz-force-charges', 'electricity', 'F = q · v · B · sin(θ), r = (m·v)/(q·B)', 'Magnetic Field and Lorentz Force on Charges', 'المجال المغناطيسي وقوة لورنتز على الشحنات', 'بوارە مەگناتیسیەکە و هێزی لۆرێنتز لەسەر بارەکان', 'Qada Magnetîk û Hêza Lorentz li ser Baran'),
  createExperiment(32, 'atomic-emission-spectra-quantum-transitions', 'modern_physics', 'ΔE = E_final - E_initial = (h · c)/λ', 'Atomic Emission Spectra and Quantum Transitions', 'أطياف الانبعاث الذري والانتقالات الكمومية', 'شەبەنگی دەردانی ئەتۆمی و گوازتنەوە کوانتۆمییەکان', 'Spêktrên Belavbûna Atomî û Guherînên Kuantomî'),
  createExperiment(33, 'electric-circuits-ohm-law-power-dissipation', 'electricity', 'V = I · R, P = V · I = I² · R', 'Electric Circuits, Ohm Law and Power Dissipation', 'الدوائر الكهربائية وقانون أوم وتبديد الطاقة', 'بازنە کارەباییەکان، یاسای ئۆم و بەهەدەردانی توانا', 'Şebekeyên Elektrîkî, Yasa Ohm û Windabûna Hêzê'),
  createExperiment(34, 'archimedes-principle-buoyant-force', 'mechanics', 'F_B = ρ_fluid · V_disp · g', 'Archimedes Principle and Buoyant Force', 'مبدأ أرشميدس وقوة الطفو', 'پڕەنسیپی ئەرشەمیدس و هێزی بەرزکەرەوە', 'Prensîba Archimedes û Hêza Rakirinê'),
  createExperiment(35, 'ideal-gas-law-thermodynamics-state', 'thermodynamics', 'P · V = n · R · T', 'Ideal Gas Law and Thermodynamics State', 'قانون الغاز المثالي وحالة الديناميكا الحرارية', 'یاسای گازی نموونەیی و باری ثێرمۆداینامیک', 'Yasa Gazên Mînakî û Rewşa Termodînamîkê'),
  createExperiment(36, 'optics-snell-law-refraction', 'optics', 'n₁ · sin(θ₁) = n₂ · sin(θ₂)', 'Optics and Snell Law of Refraction', 'البصريات وقانون سنيل للانكسار', 'ڕووناکی و یاسای سنێل بۆ تێکشکاندن', 'Ronahî û Yasa Snell a Şikestinê'),
  createExperiment(37, 'build-atom-periodic-table', 'modern_physics', 'Z = p, A = p + n, Net Charge = p - e', 'Build an Atom & Periodic Table', 'بناء الذرة والجدول الدوري', 'دروستکردنی ئەتۆم و خشتەی خولی', 'Çêkirina Atomê û Xشتeya Periodîk'),
  createExperiment(38, 'build-nucleus-binding-energy', 'modern_physics', 'E_b = Δm · c²', 'Build a Nucleus & Binding Energy', 'بناء النواة وطاقة الربط', 'دروستکردنی ناوک و توانای بەستنەوە', 'Çêkirina Navokê û Anarşiya Girêdanê'),
  createExperiment(39, 'rutherford-alpha-scattering-experiment', 'modern_physics', 'F = (k · q_α · q_nucleus)/r²', 'Rutherford Alpha Scattering Experiment', 'تجربة رذرفورد لتشتت ألفا', 'ئەزموونی ڕەزەرفۆرد بۆ پەرشبوونی ئەلفا', 'Ezmûna Rutherford a Belavbûna Alpha'),
  createExperiment(40, 'molecules-light-photon-interaction', 'modern_physics', 'E = h · f, E_rot < E_vib < E_elec', 'Molecules and Light Photon Interaction', 'التفاعل بين الجزيئات وفوتونات الضوء', 'کارلێکی گەردەکان و فۆتۆنی ڕووناکی', 'Têkiliya Molekulan û Fotonên Ronahiyê'),
  createExperiment(41, 'color-vision-rgb-additive-mixing', 'optics', 'Color = R(λ) + G(λ) + B(λ)', 'Color Vision and RGB Additive Mixing', 'رؤية الألوان والمزج الإضافي RGB', 'بینینی ڕەنگەکان و تێکەڵکردنی RGB', 'Dîtina Rengan û Têkelkirina RGB'),
  createExperiment(42, 'capacitor-lab-stored-electric-energy', 'electricity', 'C = (ε · A)/d, Q = C · V, U = ½ · C · V²', 'Capacitor Lab & Stored Electric Energy', 'معمل المكثفات والطاقة الكهربائية المخزونة', 'تەقۆکەی کەپاسیتەر و توانای کارەبایی کۆکراوە', 'Kapasîtor Lab û Anarşiya Elektrîkî ya Torkirî'),
  createExperiment(43, 'electric-charges-field-lines-potential', 'electricity', 'E = (k · Q)/r², V = (k · Q)/r', 'Electric Charges, Field Lines & Potential', 'الشحنات الكهربائية وخطوط المجال والجهد', 'بارە کارەباییەکان، هێڵەکانی بوار و پۆتێنشیال', 'Barên Elektrîkî, Hêlên Qadê û Potansiyel'),
  createExperiment(44, 'wire-resistance-specific-resistivity-law', 'electricity', 'R = (ρ · L)/A', 'Wire Resistance & Specific Resistivity Law', 'مقاومة السلك وقانون المقاومية النوعية', 'بەرگری تەل و یاسای بەرگری تایبەت', 'Berengariya Têlê û Yasa Berengariya Taybet'),
  createExperiment(45, 'gravity-orbital-mechanics', 'mechanics', 'F = (G · M · m)/r², v_orb = √(G·M/r)', 'Gravity and Orbital Mechanics', 'الجاذبية وميكانيكا المدارات', 'کێشکردن و ميكانیکی خولگەکان', 'Gravîtasyon û Mêkanîka Yorîgeyan'),
  createExperiment(46, 'kepler-laws-planetary-motion', 'mechanics', 'T²/a³ = (4π²)/(G · M)', 'Kepler Laws of Planetary Motion', 'قوانين كبلر للحركة الكوكبية', 'یاساکانی کێپلەر بۆ جووڵەی هەسارەکان', 'Yasamên Kepler ji bo Tevgera Gerestêran'),
  createExperiment(47, 'energy-skate-park-transformations', 'mechanics', 'E_mech = K + U_g + E_thermal', 'Energy Skate Park and Energy Transformations', 'حديقة التزلج وتحولات الطاقة', 'یاریگای سکەیت و گۆڕانکارییەکانی توانا', 'Parka Skatê û Guherînên Anarşiyê'),
  createExperiment(48, 'fourier-series-harmonic-wave-synthesis', 'waves', 'f(x) = Σ[A_n · sin(n·ω·t)]', 'Fourier Series and Harmonic Wave Synthesis', 'سلسلة فورييه وتركيب الأمواج التوافقية', 'زنجیرەی فۆریێ و پێکهێنانی شەپۆلە هارمۆنیکییەکان', 'Rêza Fourier û Pêkhatina Şepolên Harmonîk'),
  createExperiment(49, 'wave-string-phase-speed', 'waves', 'v = √(T/μ), y(x,t) = A · sin(kx - ωt)', 'Wave on a String & Phase Speed', 'الموجة على الخيط وسرعة الطور', 'شەپۆل لەسەر پەت و خێرایی قۆناغ', 'Şepol li ser Ben û Leza Qonaxê'),
  createExperiment(50, 'states-matter-phase-transitions-latent-heat', 'thermodynamics', 'Q = m · c · ΔT, Q = m · L', 'States of Matter, Phase Transitions & Latent Heat', 'حالات المادة والتحولات الطورية والحرارة الكامنة', 'بارەکانی ماددە، گۆڕانی بار و گەرمی ئامادە', 'Rewşên Tiştan, Guherînên Rewşê û Germa Şehrawî'),
  createExperiment(51, 'gas-diffusion-graham-law-effusion', 'thermodynamics', 'r₁/r₂ = √(M₂/M₁)', 'Gas Diffusion and Graham Law of Effusion', 'انتشار الغازات وقانون جراهام للتدفق', 'پەرشبوونی گازەکان و یاسای گراهام', 'Belavbûna Gazan û Yasa Graham'),
  createExperiment(52, 'rotational-motion-net-torque', 'mechanics', 'Στ = I · α, L = I · ω', 'Rotational Motion & Net Torque', 'الحركة الدورانية وصافي العزم', 'جووڵەی خولانەوە و صافی عەزم', 'Tevgera Zivirok û Morka Paşîn'),
  createExperiment(53, 'models-hydrogen-atom', 'modern_physics', 'E_n = -13.6/n² eV, ΔE = 13.6(1/n₁² - 1/n₂²)', 'Models of the Hydrogen Atom', 'نماذج ذرة الهيدروجين', 'مۆدێلەکانی ئەتۆمی هایدرۆجین', 'Modelên Atoma Hîdrojenê'),
  createExperiment(54, 'circuit-construction-kit-advanced', 'electricity', 'Σ I_in = Σ I_out (KCL), Σ V_loop = 0 (KVL)', 'Circuit Construction Kit (Advanced)', 'مجموعة بناء الدوائر الكهربائية (متقدم)', 'کۆمەڵەی دروستکردنی بازنەکان (پێشکەوتوو)', 'Kîta Çêkirina Şebekeyan (Pêşkeftî)'),
  createExperiment(55, 'electric-generator', 'electricity', 'ε = -N · (ΔΦ/Δt) = N · B · A · ω · sin(ωt)', 'Electric Generator', 'المولد الكهربائي', 'محۆلەی کارەبایی', 'Jeneratorê Elektrîkî'),
  createExperiment(56, 'magnet-and-compass', 'electricity', 'tan(θ) = B_ext/B_earth', 'Magnet and Compass', 'المغناطيس والبوصلة', 'مەگناتیس و ڕووگەنما', 'Magnet û Compass'),
  createExperiment(57, 'magnets-and-electromagnets', 'electricity', 'B = μ₀ · μ_r · n · I', 'Magnets and Electromagnets', 'المغناطيس والمغناطيس الكهربائي', 'مەگناتیس و کارۆمەگناتیس', 'Magnet û Elektromagnet'),
  createExperiment(58, 'gravity-force-lab', 'mechanics', 'F = G · (m₁ · m₂)/r²', 'Gravity Force Lab', 'مختبر قوة الجاذبية', 'تەقۆکەی هێزی کێشکردن', 'Laboratûvara Hêza Gravîtasyonê'),
  createExperiment(59, 'my-solar-system-multi-body-mechanics', 'mechanics', 'd²r_i/dt² = Σ G · m_j · (r_j-r_i)/|r_j-r_i|³', 'My Solar System & Multi-Body Mechanics', 'نظامي الشمسي وميكانيكا الأجسام المتعددة', 'کۆمەڵەی خۆری من و ميكانیکی چەند لاشەیی', 'Sîstema Min a Rojê û Mêkanîka Pir-Tiştan'),
  createExperiment(60, 'energy-forms-and-transformations', 'mechanics', 'E_in = E_stored + E_out', 'Energy Forms and Transformations', 'أشكال الطاقة وتحولاتها', 'جۆرەکانی توانا و گۆڕانکارییەکانی', 'Formên Anarşiyê û Guherînên Wê'),
  createExperiment(61, 'normal-modes-resonant-frequencies', 'waves', 'f_n = (n·v)/(2L) = (n/2L)·√(T/μ)', 'Normal Modes & Resonant Frequencies', 'الأنماط الطبيعية والترددات الرنينية', 'شێوازە سروشتییەکان و فریکوێنسییە دەنگدانەوەییەکان', 'Modeyên Xirok û Frîkansên Rezonansî'),
  createExperiment(62, 'forces-and-motion-basics', 'mechanics', 'F_net = Σ F = m · a', 'Forces and Motion: Basics', 'القوى والحركة: الأساسيات', 'هێزەکان و جووڵە: سەرەتاییەکان', 'Hêz û Tevger: Binesazî'),
  createExperiment(63, 'gas-properties-kinetic-pressure-law', 'thermodynamics', 'P · V = N · k_B · T = n · R · T', 'Gas Properties & Kinetic Pressure Law', 'خصائص الغازات وقانون الضغط الحركي', 'تایبەتمەندییەکانی گاز و یاسای پەستانی جووڵەیی', 'Taybetmendiyên Gazan û Yasa Zexta Tevgerî'),
  createExperiment(64, 'molecular-diffusion-fick-first-law', 'thermodynamics', 'J = -D · (dC/dx)', 'Molecular Diffusion & Fick First Law', 'الانتشار الجزيئي وقانون فيك الأول', 'پەرشبوونی گەردی و یاسای یەکەمی فیک', 'Belavbûna Molekulî û Yasa Yekem a Fick'),
  createExperiment(65, 'blackbody-spectrum-planck-wien-laws', 'modern_physics', 'λ_max · T = b, E = h · f, I = σ · T⁴', 'Blackbody Spectrum, Planck & Wien Laws', 'طيف الجسم الأسود وقوانين بلانك وفين', 'شەبەنگی تەنی ڕەش و یاساکانی پلانک و وین', 'Spêktra Tiştê Reş û Yasamên Planck û Wien'),
  createExperiment(66, 'doppler-effect-sound-shift', 'waves', 'f\' = f · (v ± vₒ)/(v ∓ vₛ), M = vₛ/v', 'Doppler Effect & Sound Shift', 'تأثير دوبلر وانزياح الصوت', 'کاریگەری دۆپلەر و گۆڕانی دەنگ', 'Kariya Doppler û Guherîna Deng'),
  createExperiment(67, 'electrical-transformer-mutual-induction-law', 'electricity', 'Vₛ/Vₚ = Nₛ/Nₚ', 'Electrical Transformer & Mutual Induction Law', 'المحول الكهربائي وقانون الحث المتبادل', 'محوڵەی کارەبایی و یاسای هاندانی هاوبەش', 'Trafoya Elektrîkî û Yasa Îndukasyona Hevpar'),
  createExperiment(68, 'photoelectric-effect-einstein-quantum-law', 'modern_physics', 'E_k = h · f - Φ', 'Photoelectric Effect & Einstein Quantum Law', 'الظاهرة الكهرودوئية وقانون أينشتاين الكمومي', 'دیاردەی کارۆڕووناکی و یاسای کوانتۆمی ئەینشتاین', 'Tevgera Elektro-Ronahî û Yasa Kuantomî a Einstein'),
  createExperiment(69, 'radioactive-decay-nuclear-half-life-law', 'modern_physics', 'N(t) = N₀ · (1/2)^(t/T₁/₂)', 'Radioactive Decay & Nuclear Half-Life Law', 'الاضمحلال الإشعاعي وقانون عمر النصف النووي', 'تێکشکانی تیشکدەر و یاسای نیوەژیانی ناوکی', 'Xerabûna Radyoaktîf û Yasa Nîv-Jiyana Navokî'),
  createExperiment(70, 'calorimetry-thermal-equilibrium-law', 'thermodynamics', 'Q_lost = Q_gained', 'Calorimetry & Thermal Equilibrium Law', 'قياس الحرارة وقانون الاتزان الحراري', 'پێوانی گەرمی و یاسای هاوسەنگی گەرمی', 'Pîvandina Germiyê û Yasa Hevsengiya Germî')
];
