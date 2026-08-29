import React, { useState } from 'react';
import { Experiment } from '../../types/experiment';
import { useTranslation } from '../../i18n/useTranslation';
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Sliders,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

interface TheoryPanelProps {
  experiment: Experiment;
}

interface VariableInfo {
  symbol: string;
  name: string;
  unit: string;
  type: 'input' | 'output' | 'constant';
  description?: string;
}

interface RelationshipInfo {
  cause: string;
  effect: string;
  type: 'direct' | 'inverse' | 'proportional';
  explanation: string;
}

interface ExperimentTheoryData {
  concept: string;
  principle: string;
  equation: string;
  variables: VariableInfo[];
  relationships: RelationshipInfo[];
}

export const TheoryPanel: React.FC<TheoryPanelProps> = ({ experiment }) => {
  const { language, getLocalizedText } = useTranslation();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Generate physics theory data based on experiment category & physical law
  const getTheoryData = (): ExperimentTheoryData => {
    const id = experiment.id.toLowerCase();
    const category = experiment.category;

    // 1. Simple Harmonic Motion / Pendulum
    if (id.includes('pendulum') || id.includes('harmonic')) {
      return {
        concept:
          language === 'ar'
            ? 'دراسة الحركة التوافقية البسيطة للبندول البسيط والتأثير الدوري للجاذبية وطول الخيط.'
            : language === 'ku'
            ? 'لێکۆڵینەوە لە جووڵەی هاوسەنگی سادەی پاندۆڵ و کاریگەری هێزی کێشکردن و درێژی پەت.'
            : language === 'kmr'
            ? 'Lêkolîna tevgera hevseng a sade ya pendulê û bandora kişandina erdê.'
            : 'Study of Simple Harmonic Motion (SHM) in a simple pendulum under gravitational restoring forces.',
        principle:
          language === 'ar'
            ? 'يتذبذب البندول البسيط حول موضع الاتزان نتيجة قوة الإعادة الناتجة عن مرشح مركب الوزن. بالنسبة للزوايا الصغيرة (θ < 15°)، يكون الزمن الدوري مستقلاً عن الكتلة وسعة الاهتزاز ويعتمد فقط على طول الخيط وتسارع الجاذبية الأرضية.'
            : language === 'ku'
            ? 'پاندۆڵ لە دەوری شوێنی هاوسەنگی دەسوڕێتەوە بەهۆی هێزی گەڕێنەرەوە. بۆ گۆشە بچووکەکان (θ < 15°)، کاتی خول سەربەخۆیە لە قورسایی و تەنها بەستراوە بە درێژی پەت و هێزی کێشکردن.'
            : language === 'kmr'
            ? 'Pendul li dora cihê hevsengiyê diheje. Ji bo goşeyên piçûk, dema dorê serbixwe ye ji giraniyê.'
            : 'A simple pendulum oscillates around equilibrium due to gravitational restoring force. For small angles (θ < 15°), the periodic time is independent of mass and amplitude, relying only on string length and gravitational acceleration.',
        equation: 'T = 2π × √(L / g)',
        variables: [
          {
            symbol: 'T',
            name: language === 'ar' ? 'زمن الدورة الكاملة' : 'Period Time',
            unit: 's',
            type: 'output',
            description: language === 'ar' ? 'الزمن المستغرق لإكمال اهتزازة واحدة كاملة' : 'Time for one full oscillation',
          },
          {
            symbol: 'L',
            name: language === 'ar' ? 'طول الخيط' : 'String Length',
            unit: 'm',
            type: 'input',
            description: language === 'ar' ? 'المسافة من نقطة التعليق إلى مركز كتلة الثقل' : 'Distance from pivot to center of mass',
          },
          {
            symbol: 'g',
            name: language === 'ar' ? 'تسارع الجاذبية الأرضية' : 'Gravitational Acceleration',
            unit: 'm/s²',
            type: 'input',
            description: language === 'ar' ? 'شريطة البيئة المحيطة (9.81 m/s² على الأرض)' : 'Local gravitational field strength',
          },
          {
            symbol: 'θ',
            name: language === 'ar' ? 'زاوية الإزاحة الابتدائية' : 'Initial Displacement Angle',
            unit: '°',
            type: 'input',
            description: language === 'ar' ? 'سعة الاهتزازة الابتدائية' : 'Initial release angle',
          },
          {
            symbol: 'm',
            name: language === 'ar' ? 'كتلة الثقل' : 'Bob Mass',
            unit: 'kg',
            type: 'input',
            description: language === 'ar' ? 'كتلة الكرة المعلقة (لا تؤثر على الزمن الدوري)' : 'Mass of suspended bob (does not affect T)',
          },
        ],
        relationships: [
          {
            cause: 'L ↑ (زيادة الطول)',
            effect: 'T ↑ (زيادة زمن الدورة)',
            type: 'direct',
            explanation:
              language === 'ar'
                ? 'زيادة طول الخيط يزيد المسار المقطوع ويتناسب الزمن الدوري طرديًا مع جذر الطول (√L).'
                : 'Period increases proportionally to the square root of string length (√L).',
          },
          {
            cause: 'g ↑ (زيادة الجاذبية)',
            effect: 'T ↓ (تناقص زمن الدورة)',
            type: 'inverse',
            explanation:
              language === 'ar'
                ? 'زيادة الجاذبية تزيد قوة الإعادة مما يسرع التذبذب ويقلل الزمن الدوري.'
                : 'Higher gravity increases restoring force, accelerating oscillation and decreasing period T.',
          },
          {
            cause: 'm ↑ (زيادة الكتلة)',
            effect: 'T = ثبات الزمن الدوري',
            type: 'proportional',
            explanation:
              language === 'ar'
                ? 'الكتلة تزيد القصور الذاتي وقوة الجاذبية بنسبة متساوية تمامًا، فلا يتغير الزمن الدوري.'
                : 'Mass increases inertia and gravity equally, leaving period T unchanged.',
          },
        ],
      };
    }

    // 2. Optics / Refraction / Snell's Law
    if (category === 'optics' || id.includes('optics') || id.includes('refraction')) {
      return {
        concept:
          language === 'ar'
            ? 'انكسار الضوء وتغير سرعته واتجاهه عند الانتقال بين وسطين شفافين مختلفين في الكثافة الضوئية.'
            : 'Light refraction and speed change when passing between media with different refractive indices.',
        principle:
          language === 'ar'
            ? 'ينحرف الشعاع الضوئي عن مساره عند الانتقال بين وسطين ضوئيين مختلفين نتيجة تغير سرعة انتشار الضوء. يخضع الانكسار لقانون سنيل، حيث تظل نسبة جيب زاوية السقوط إلى جيب زاوية الانكسار ثابتاً يساوي نسبة معامل الانكسار.'
            : 'Light bends at boundaries between different optical media due to speed variation. According to Snell’s Law, the ratio of sines of incidence and refraction angles equals the ratio of refractive indices.',
        equation: 'n₁ × sin(θ₁) = n₂ × sin(θ₂)',
        variables: [
          {
            symbol: 'n₁',
            name: language === 'ar' ? 'معامل انكسار الوسط الأول' : 'Refractive Index Medium 1',
            unit: 'dimensionless',
            type: 'input',
            description: language === 'ar' ? 'مقياس الكثافة الضوئية للوسط الأول' : 'Optical density measure of medium 1',
          },
          {
            symbol: 'θ₁',
            name: language === 'ar' ? 'زاوية السقوط' : 'Incident Angle',
            unit: '°',
            type: 'input',
            description: language === 'ar' ? 'الزاوية بين الشعاع الساقط والعمود المقاوم' : 'Angle between ray and surface normal',
          },
          {
            symbol: 'n₂',
            name: language === 'ar' ? 'معامل انكسار الوسط الثاني' : 'Refractive Index Medium 2',
            unit: 'dimensionless',
            type: 'input',
            description: language === 'ar' ? 'مقياس الكثافة الضوئية للوسط الثاني' : 'Optical density measure of medium 2',
          },
          {
            symbol: 'θ₂',
            name: language === 'ar' ? 'زاوية الانكسار' : 'Refracted Angle',
            unit: '°',
            type: 'output',
            description: language === 'ar' ? 'الزاوية بين الشعاع المنكسر والعمود المقاوم' : 'Angle of refracted ray to normal',
          },
          {
            symbol: 'θc',
            name: language === 'ar' ? 'الزاوية الحرجة' : 'Critical Angle',
            unit: '°',
            type: 'output',
            description: language === 'ar' ? 'زاوية السقوط التي تقابلها زاوية انكسار 90° (عند n₁ > n₂)' : 'Incidence angle for θ₂ = 90°',
          },
        ],
        relationships: [
          {
            cause: 'n₂ > n₁ (انتقال لوسط أثقل ضوئيًا)',
            effect: 'θ₂ < θ₁ (ينكسر الشعاع مقتربًا من العمود)',
            type: 'inverse',
            explanation:
              language === 'ar'
                ? 'تقل سرعة الضوء في الوسط الثاني الأكثف، فيتحرف الشعاع باتجاه العمود المقاوم.'
                : 'Light slows down in higher refractive index media, bending towards the normal.',
          },
          {
            cause: 'θ₁ > θc (سقوط بزاوية أكبر من الحرجة)',
            effect: 'انعكاس كلي داخلي (Total Reflection)',
            type: 'direct',
            explanation:
              language === 'ar'
                ? 'عند الانتقال من وسط أكبر كثافة لوسط أقل بزاوية أكبر من الزاوية الحرجة ينعكس الشعاع كليًا داخل الوسط الأول.'
                : 'When light travels from higher to lower index at θ₁ > θc, total internal reflection occurs.',
          },
        ],
      };
    }

    // 3. Electricity / Ohm's Law
    if (category === 'electricity' || id.includes('circuit') || id.includes('ohm')) {
      return {
        concept:
          language === 'ar'
            ? 'دراسة العلاقة المباشرة بين فرق الجهد الكهربائي وشدة التيار والمقاومة الكهربائية في الدارات المغلقة.'
            : 'Direct relation between electric potential, current intensity, and electrical resistance in closed circuits.',
        principle:
          language === 'ar'
            ? 'ينص قانون أوم على أن شدة التيار الكهربائي المار في موصل معدني تتناسب طرديًا مع فرق الجهد بين طرفيه عند ثبات درجة الحرارة، وتتناسب عكسيًا مع مقداره المادي المقاوم.'
            : 'Ohm’s Law states that electric current through a conductor between two points is directly proportional to voltage across the points and inversely proportional to resistance.',
        equation: 'V = I × R   =>   I = V / R',
        variables: [
          {
            symbol: 'V',
            name: language === 'ar' ? 'فرق الجهد الكهربائي' : 'Voltage / Potential Difference',
            unit: 'V',
            type: 'input',
            description: language === 'ar' ? 'القوة الدافعة الكهربائية بين طرفي الدارة' : 'Electromotive force across circuit',
          },
          {
            symbol: 'R',
            name: language === 'ar' ? 'المقاومة الكهربائية' : 'Resistance',
            unit: 'Ω',
            type: 'input',
            description: language === 'ar' ? 'ممانعة الموصل لتدفق الشحنات الكهربائية' : 'Opposition to flow of electric charge',
          },
          {
            symbol: 'I',
            name: language === 'ar' ? 'شدة التيار الكهربائي' : 'Electric Current',
            unit: 'A',
            type: 'output',
            description: language === 'ar' ? 'معدل تدفق الشحنات الكهربائية عبر المقطع' : 'Rate of electric charge flow',
          },
          {
            symbol: 'P',
            name: language === 'ar' ? 'القدرة المتبددة' : 'Power Dissipation',
            unit: 'W',
            type: 'output',
            description: language === 'ar' ? 'الطاقة المستهلكة في الموصل حراريًا per second (P = V × I = I²R)' : 'Electrical power converted to heat per second',
          },
        ],
        relationships: [
          {
            cause: 'V ↑ (زيادة فرق الجهد)',
            effect: 'I ↑ (زيادة شدة التيار)',
            type: 'direct',
            explanation:
              language === 'ar'
                ? 'زيادة الجهد توفر طاقة أكبر لدفع الشحنات مما يرفع شدة التيار بنسبة طردية خطية.'
                : 'Higher voltage exerts greater potential force, increasing current proportionally.',
          },
          {
            cause: 'R ↑ (زيادة المقاومة)',
            effect: 'I ↓ (تناقص شدة التيار)',
            type: 'inverse',
            explanation:
              language === 'ar'
                ? 'المقاومة تعيق حركة الإلكترونات الحرة، فزيادتها تقلل معدل الشحنات المارة ثانيةً.'
                : 'Greater resistance restricts electron movement, reducing total current flow rate.',
          },
        ],
      };
    }

    // 4. Thermodynamics / Ideal Gas Law
    if (category === 'thermodynamics' || id.includes('gas') || id.includes('heat') || id.includes('thermo')) {
      return {
        concept:
          language === 'ar'
            ? 'دراسة سلوك الغازات المثالية والعلاقة بين الضغط والحجم ودرجة الحرارة المطلقة.'
            : 'Behavior of ideal gases relating pressure, volume, and absolute temperature.',
        principle:
          language === 'ar'
            ? 'تصف معادلة الحالة للغاز المثالي العلاقة الحركية بين ضغط الغاز وحجمه ودرجة حرارته المطلقة. يزداد ضغط الغاز بتصادم جزيئاته المسرعة مع جدران الإناء المعتمدة على الطاقة الحركية الحرارية.'
            : 'The ideal gas state equation relates pressure, volume, and absolute temperature. Pressure stems from molecular kinetic collisions against container walls.',
        equation: 'P × V = n × R × T',
        variables: [
          {
            symbol: 'P',
            name: language === 'ar' ? 'ضغط الغاز' : 'Gas Pressure',
            unit: 'kPa',
            type: 'output',
            description: language === 'ar' ? 'القوة الكلية الناتجة عن تصادمات الجزيئات لكل وحدة مساحة' : 'Total force per unit area from collisions',
          },
          {
            symbol: 'V',
            name: language === 'ar' ? 'حجم الإناء' : 'Volume',
            unit: 'L',
            type: 'input',
            description: language === 'ar' ? 'الحجم المتاح لحركة جزيئات الغاز' : 'Volume available for gas molecules',
          },
          {
            symbol: 'T',
            name: language === 'ar' ? 'درجة الحرارة المطلقة' : 'Absolute Temperature',
            unit: 'K',
            type: 'input',
            description: language === 'ar' ? 'مقياس متوسط الطاقة الحركية لجزيئات الغاز' : 'Measure of average molecular kinetic energy',
          },
          {
            symbol: 'U',
            name: language === 'ar' ? 'الطاقة الداخلية' : 'Internal Energy',
            unit: 'J',
            type: 'output',
            description: language === 'ar' ? 'مجموع الطاقات الحركية الميكروسكوبية للجزيئات (U = 1.5 nRT)' : 'Sum of microscopic kinetic energies',
          },
        ],
        relationships: [
          {
            cause: 'T ↑ (رفع درجة الحرارة)',
            effect: 'P ↑ (زيادة الضغط عند ثبوت الحجم)',
            type: 'direct',
            explanation:
              language === 'ar'
                ? 'ارتفاع الحرارة يزيد سرعة الجزيئات وقوة تصادمها مع جدار الإناء مما يرفع الضغط (قانون غاي-لوساك).'
                : 'Higher temperature boosts kinetic velocity, driving more energetic wall collisions.',
          },
          {
            cause: 'V ↓ (تقليل الحجم)',
            effect: 'P ↑ (زيادة الضغط عند ثبوت الحرارة)',
            type: 'inverse',
            explanation:
              language === 'ar'
                ? 'تراكم الجزيئات في حجم أصغر يرفع معدل التصادمات مع السطح فيزداد الضغط (قانون بويل).'
                : 'Decreasing container volume increases collision frequency per unit area.',
          },
        ],
      };
    }

    // 5. Waves / Wave Equation
    if (category === 'waves' || id.includes('wave') || id.includes('sound')) {
      return {
        concept:
          language === 'ar'
            ? 'خصائص انتشار الموجات الميكانيكية والعلاقة بين السرعة والتردد والطول الموجي.'
            : 'Mechanical wave propagation relating velocity, frequency, and wavelength.',
        principle:
          language === 'ar'
            ? 'تنتشر الاضطرابات الموجية عبر الوسط بنقل الطاقة دون نقل المادة. تتحدد سرعة الموجة بخواص الوسط الفيزيائية وتساوي حاصل ضرب التردد في الطول الموجي.'
            : 'Wave disturbances propagate energy through a medium without mass transport. Wave speed depends on medium properties and equals frequency times wavelength.',
        equation: 'v = f × λ   ,   T = 1 / f',
        variables: [
          {
            symbol: 'v',
            name: language === 'ar' ? 'سرعة انتشار الموجة' : 'Wave Speed',
            unit: 'm/s',
            type: 'output',
            description: language === 'ar' ? 'المسافة التي تقطعها قمة الموجة في الثانية' : 'Distance wave crest travels per second',
          },
          {
            symbol: 'f',
            name: language === 'ar' ? 'تردد الموجة' : 'Frequency',
            unit: 'Hz',
            type: 'input',
            description: language === 'ar' ? 'عدد الاهتزازات الكاملة في الثانية الواحدة' : 'Number of oscillations per second',
          },
          {
            symbol: 'λ',
            name: language === 'ar' ? 'الطول الموجي' : 'Wavelength',
            unit: 'm',
            type: 'input',
            description: language === 'ar' ? 'المسافة بين قمتين متتاليتين أو قاعين متتاليين' : 'Distance between consecutive crests',
          },
          {
            symbol: 'T',
            name: language === 'ar' ? 'زمن الدورة' : 'Period',
            unit: 's',
            type: 'output',
            description: language === 'ar' ? 'زمن مرار قمة موجية كاملة عبر نقطة ثابتة' : 'Time for one complete wave to pass',
          },
        ],
        relationships: [
          {
            cause: 'f ↑ (زيادة التردد)',
            effect: 'λ ↓ (تناقص الطول الموجي عند ثبوت السرعة)',
            type: 'inverse',
            explanation:
              language === 'ar'
                ? 'عند انتشار الموجة في نفس الوسط تكون السرعة ثابتة، فيؤدي زيادة التردد لتقارب القمم وانخفاض الطول الموجي.'
                : 'In a fixed medium, velocity stays constant; higher frequency shortens wavelength.',
          },
        ],
      };
    }

    // Fallback Generic Experiment Theory Structure
    return {
      concept: getLocalizedText(experiment.description),
      principle: getLocalizedText(experiment.explanation),
      equation: experiment.physicalLaw || 'F = f(x, y, z)',
      variables: [
        ...(experiment.parameters || []).map((p) => ({
          symbol: p.id,
          name: getLocalizedText(p.label),
          unit: p.unit || '',
          type: 'input' as const,
        })),
        ...(experiment.outputMetrics || []).map((o) => ({
          symbol: o.symbol || o.id,
          name: getLocalizedText(o.label),
          unit: o.unit || '',
          type: 'output' as const,
        })),
      ],
      relationships: [
        {
          cause: language === 'ar' ? 'تعديل المعاملات الابتدائية' : 'Adjusting Input Parameters',
          effect: language === 'ar' ? 'تغير النتائج والمخرجات المحسوبة' : 'Dynamically alters system output metrics',
          type: 'direct',
          explanation: getLocalizedText(experiment.whatHappened),
        },
      ],
    };
  };

  const theory = getTheoryData();

  const titleText =
    language === 'ar'
      ? 'الشرح العلمي والنظرية الفيزيائية'
      : language === 'ku'
      ? 'ڕوونکردنەوەی زانستی و تیۆری فیزیکی'
      : language === 'kmr'
      ? 'Şîroveya Zanistî û Teoriya Fîzîkî'
      : 'Theory & Physics Explanation';

  const conceptHeader =
    language === 'ar'
      ? 'المفهوم والمبدأ الفيزيائي'
      : 'Concept & Physical Principle';

  const mainEquationHeader =
    language === 'ar' ? 'المعادلة الرئيسية والقانون' : 'Main Governing Equation';

  const variablesHeader =
    language === 'ar' ? 'رموز ومعاملات التجربة' : 'Experiment Variables & Symbols';

  const relationshipsHeader =
    language === 'ar' ? 'العلاقات والتأثيرات المباشرة' : 'Physical Relationships & Effects';

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300">
      {/* Collapsible Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-900/80 transition-colors select-none"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
              <span>{titleText}</span>
            </h2>
            <span className="text-xs font-mono text-cyan-400 font-semibold block mt-0.5">
              {experiment.physicalLaw}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 text-xs font-medium cursor-pointer"
          aria-label="Toggle Theory Section"
        >
          <span className="hidden sm:inline">
            {isExpanded
              ? language === 'ar'
                ? 'طَيّ'
                : 'Collapse'
              : language === 'ar'
              ? 'توسيع'
              : 'Expand'}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-cyan-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-cyan-400" />
          )}
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-6 bg-slate-950/40 divide-y divide-slate-800/60">
          {/* Section 1: Concept & Physical Principle */}
          <div className="space-y-3 pt-1">
            <h3 className="text-xs sm:text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              <span>{conceptHeader}</span>
            </h3>
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                {theory.concept}
              </p>
              <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed font-sans pt-2 border-t border-slate-800/60">
                {theory.principle}
              </p>
            </div>
          </div>

          {/* Section 2: Main Governing Equation Card */}
          <div className="space-y-3 pt-5">
            <h3 className="text-xs sm:text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              <span>{mainEquationHeader}</span>
            </h3>
            <div className="p-4 bg-slate-950 rounded-xl border border-amber-500/30 text-center shadow-inner space-y-2">
              <div
                dir="ltr"
                className="font-mono text-base sm:text-xl font-extrabold text-cyan-300 tracking-wider overflow-x-auto py-1"
              >
                {theory.equation}
              </div>
              <span className="text-[11px] text-slate-400 block font-sans">
                {language === 'ar'
                  ? 'الصيغة الرياضية الأساسية الحاكمة للمحاكاة الحية'
                  : 'Governing mathematical formula driving the simulation'}
              </span>
            </div>
          </div>

          {/* Section 3: Variables & Symbols Table */}
          <div className="space-y-3 pt-5">
            <h3 className="text-xs sm:text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              <span>{variablesHeader}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {theory.variables.map((v, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex flex-col justify-between space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span
                      dir="ltr"
                      className="font-mono font-black text-sm text-cyan-300 px-2 py-0.5 rounded bg-slate-950 border border-slate-800"
                    >
                      {v.symbol}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        v.type === 'input'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : v.type === 'output'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {v.unit ? v.unit : 'SI'}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">
                      {v.name}
                    </span>
                    {v.description && (
                      <span className="text-[11px] text-slate-400 block mt-0.5 leading-snug">
                        {v.description}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Physical Relationships & Effects */}
          <div className="space-y-3 pt-5">
            <h3 className="text-xs sm:text-sm font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>{relationshipsHeader}</span>
            </h3>
            <div className="space-y-2">
              {theory.relationships.map((rel, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1.5"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-200">
                    <span className="text-sky-300 px-2 py-0.5 bg-slate-950 rounded border border-slate-800">
                      {rel.cause}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0 rtl:rotate-180" />
                    <span className="text-emerald-300 px-2 py-0.5 bg-slate-950 rounded border border-slate-800">
                      {rel.effect}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    {rel.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
