import React, { useState, useMemo } from 'react';
import { Experiment } from '../../types/experiment';
import { useTranslation } from '../../i18n/useTranslation';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Brain,
  Sparkles,
} from 'lucide-react';

interface QuizPanelProps {
  experiment: Experiment;
}

export interface Question {
  id: number;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const QuizPanel: React.FC<QuizPanelProps> = ({ experiment }) => {
  const { language, getLocalizedText } = useTranslation();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Quiz state
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [answersHistory, setAnswersHistory] = useState<
    { selected: number; isCorrect: boolean }[]
  >([]);
  const [isQuizFinished, setIsQuizFinished] = useState<boolean>(false);

  // Generate experiment-tailored questions based on category and physics
  const questions = useMemo<Question[]>(() => {
    const id = experiment.id.toLowerCase();
    const cat = experiment.category;

    // 1. Simple Pendulum / Harmonic Motion
    if (id.includes('pendulum') || id.includes('harmonic')) {
      return [
        {
          id: 1,
          questionText:
            language === 'ar'
              ? 'إذا تم زيادة طول خيط البندول أربعة أضعاف (4L)، فماذا يحدث للزمن الدوري (T)؟'
              : 'If the length of a pendulum is quadrupled (4L), what happens to its period (T)?',
          options:
            language === 'ar'
              ? ['يزداد إلى الضعف (2T)', 'يتضاعف أربعة أضعاف (4T)', 'ينخفض إلى النصف (0.5T)', 'يبقى ثابتاً دون تغيير']
              : ['It doubles (2T)', 'It quadruples (4T)', 'It halves (0.5T)', 'It remains unchanged'],
          correctIndex: 0,
          explanation:
            language === 'ar'
              ? 'طبقاً لمعادلة الزمن الدوري T = 2π√(L/g)، يتناسب T طردياً مع جذر الطول (√L). جذر 4 يساوي 2، لذا يتضاعف الزمن الدوري مرتين.'
              : 'According to T = 2π√(L/g), the period T is proportional to √L. √4 = 2, so the period doubles.',
        },
        {
          id: 2,
          questionText:
            language === 'ar'
              ? 'هل تؤثر زيادة كتلة ثقل البندول (m) على الزمن الدوري (T) عند ثبات الطول والجاذبية؟'
              : 'Does increasing the mass of the bob (m) affect the period (T) when length and gravity are constant?',
          options:
            language === 'ar'
              ? ['لا، الكتلة لا تؤثر إطلاقاً على الزمن الدوري', 'نعم، يزداد الزمن الدوري بزيادة الكتلة', 'نعم، يقل الزمن الدوري بزيادة الكتلة', 'ينعدم الزمن الدوري']
              : ['No, mass has no effect on the period', 'Yes, period increases with mass', 'Yes, period decreases with mass', 'Period becomes zero'],
          correctIndex: 0,
          explanation:
            language === 'ar'
              ? 'الكتلة لا تظهر في قانون البندول T = 2π√(L/g) لأن زيادة الكتلة تزيد القصور الذاتي وقوة الجاذبية بنسب متساوية كلياً.'
              : 'Mass does not appear in T = 2π√(L/g) because mass increases inertia and gravitational force equally.',
        },
        {
          id: 3,
          questionText:
            language === 'ar'
              ? 'صح أم خطأ: بالنسبة للزوايا الصغيرة (θ < 15°)، تعتبر حركة البندول حركة توافقية بسيطة (SHM).'
              : 'True or False: For small displacement angles (θ < 15°), pendulum motion is Simple Harmonic Motion (SHM).',
          options:
            language === 'ar'
              ? ['صحيح (True)', 'خطأ (False)']
              : ['True', 'False'],
          correctIndex: 0,
          explanation:
            language === 'ar'
              ? 'صحيح. عند الزوايا الصغيرة يكون sin(θ) ≈ θ بالراديان، فتكون قوة الإعادة متناسبة خطياً مع الإزاحة.'
              : 'True. For small angles sin(θ) ≈ θ in radians, making the restoring force linear with displacement.',
        },
        {
          id: 4,
          questionText:
            language === 'ar'
              ? 'ما هي وحدة قياس تسارع الجاذبية الأرضية (g) في النظام الدولي للوحدات SI؟'
              : 'What is the SI unit for gravitational acceleration (g)?',
          options: ['m/s²', 'm/s', 'Joule', 'Newton'],
          correctIndex: 0,
          explanation:
            language === 'ar'
              ? 'وحدة التسارع هي متر لكل ثانية مربعة (m/s²).'
              : 'The SI unit for acceleration is meters per second squared (m/s²).',
        },
      ];
    }

    // 2. Optics / Refraction
    if (cat === 'optics' || id.includes('optics') || id.includes('refraction')) {
      return [
        {
          id: 1,
          questionText:
            language === 'ar'
              ? 'عند انتقال شعاع ضوئي من الهواء (n₁ = 1.0) إلى الزجاج (n₂ = 1.5)، ماذا يحدث لزاوية الانكسار (θ₂)؟'
              : 'When light passes from air (n₁ = 1.0) into glass (n₂ = 1.5), what happens to the angle of refraction (θ₂)?',
          options:
            language === 'ar'
              ? [
                  'ينكسر الشعاع مقترباً من العمود (θ₂ < θ₁)',
                  'ينكسر الشعاع مبتعداً عن العمود (θ₂ > θ₁)',
                  'يمر الشعاع دون أي انحراف',
                  'ينعكس الشعاع بالكامل دائماً',
                ]
              : [
                  'Light bends towards the normal (θ₂ < θ₁)',
                  'Light bends away from the normal (θ₂ > θ₁)',
                  'Light passes straight without bending',
                  'Light always reflects completely',
                ],
          correctIndex: 0,
          explanation:
            language === 'ar'
              ? 'طبقاً لقانون سنيل n₁ sin(θ₁) = n₂ sin(θ₂)، عند الانتقال لوسط أصلد ضوئياً (n₂ > n₁) تقل سرعة الضوء وينكسر الشعاع مقترباً من العمود.'
              : 'According to Snell’s Law n₁ sin(θ₁) = n₂ sin(θ₂), moving into a higher refractive index medium slows light down, bending it towards the normal.',
        },
        {
          id: 2,
          questionText:
            language === 'ar'
              ? 'متى يحدث الانعكاس الكلي الداخلي (Total Internal Reflection)؟'
              : 'When does Total Internal Reflection occur?',
          options:
            language === 'ar'
              ? [
                  'عند الانتقال من وسط أكبر كثافة ضوئية لأقل وسقوط الضوء بزاوية أكبر من الزاوية الحرجة',
                  'عند الانتقال من الهواء إلى الماء بزاوية 0°',
                  'عندما تكون زاوية السقوط أصغر من 10° دائماً',
                  'في جميع الأوساط الشفافة بغض النظر عن الزاوية',
                ]
              : [
                  'Traveling from higher to lower refractive index at an angle greater than the critical angle (θ₁ > θc)',
                  'Traveling from air to water at 0° incidence',
                  'When incidence angle is less than 10°',
                  'In all transparent media regardless of angle',
                ],
          correctIndex: 0,
          explanation:
            language === 'ar'
              ? 'شرطا الانعكاس الكلي الداخلي: الانتقال من وسط أكبر معامل انكسار لوسط أقل، وأن تتجاوز زاوية السقوط الزاوية الحرجة sin(θc) = n₂/n₁.'
              : 'Total internal reflection requires moving from a higher index to a lower index medium at θ₁ > θc where sin(θc) = n₂/n₁.',
        },
        {
          id: 3,
          questionText:
            language === 'ar'
              ? 'ما هي وحدة قياس معامل الانكسار (n)؟'
              : 'What is the unit of measure for refractive index (n)?',
          options:
            language === 'ar'
              ? ['بدون وحدة قياس (كمية غير بعدية)', 'متر / ثانية', 'درجة قوسية °', 'راديان']
              : ['Dimensionless (no unit)', 'Meters / second', 'Degrees °', 'Radians'],
          correctIndex: 0,
          explanation:
            language === 'ar'
              ? 'معامل الانكسار نسبة بين سرعتين n = c/v، لذا فهو كمية عددية مجردة بدون وحدة.'
              : 'Refractive index is a speed ratio n = c/v, making it a dimensionless unitless quantity.',
        },
      ];
    }

    // 3. Electricity / Ohm's Law
    if (cat === 'electricity' || id.includes('circuit') || id.includes('ohm')) {
      return [
        {
          id: 1,
          questionText:
            language === 'ar'
              ? 'طبقاً لقانون أوم (V = I × R)، إذا تضاعفت المقاومة الكهربائية (R) لمرتين مع ثبات فرق الجهد (V)، فماذا يحدث لشدة التيار (I)؟'
              : 'According to Ohm’s Law (V = I × R), if resistance (R) doubles while voltage (V) remains constant, current (I) will:',
          options:
            language === 'ar'
              ? ['تنخفض إلى النصف (0.5 I)', 'تتضاعف مرتين (2 I)', 'تتضاعف أربعة أضعاف', 'تبقى ثابتاً دون تغير']
              : ['Halve (0.5 I)', 'Double (2 I)', 'Quadruple', 'Remain unchanged'],
          correctIndex: 0,
          explanation:
            language === 'ar'
              ? 'التيار I = V / R يتناسب عكسياً مع المقاومة R، لذا فإن مضاعفة المقاومة تقلل التيار للنصف.'
              : 'Current I = V / R is inversely proportional to resistance R, so doubling resistance halves current.',
        },
        {
          id: 2,
          questionText:
            language === 'ar'
              ? 'ما هي وحدة قياس القدرة الكهربائية المتبددة (P) في الموصل؟'
              : 'What is the SI unit for electric power (P)?',
          options: ['Watt (واط)', 'Volt (فولت)', 'Ampere (أمبير)', 'Ohm (أوم)'],
          correctIndex: 0,
          explanation:
            language === 'ar'
              ? 'تقاس القدرة الكهربائية بوحدة الواط (Watt) وتساوي جُول لكل ثانية (P = V × I).'
              : 'Electric power is measured in Watts (W), representing energy consumed per second (P = V × I).',
        },
        {
          id: 3,
          questionText:
            language === 'ar'
              ? 'ماذا يحدث للقدرة المتبددة حرارياً (P = I² R) عند مضاعفة شدة التيار المار مرتين (2I)؟'
              : 'What happens to dissipated thermal power (P = I² R) if current (I) is doubled?',
          options:
            language === 'ar'
              ? ['تزداد أربعة أضعاف (4P)', 'تتضاعف مرتين فقط (2P)', 'تقل للنصف', 'لا تتغير']
              : ['Quadruples (4P)', 'Doubles only (2P)', 'Halves (0.5P)', 'Remains unchanged'],
          correctIndex: 0,
          explanation:
            language === 'ar'
              ? 'القدرة تتناسب مع مربع شدة التيار (I²). مربع 2 هو 4، فتتضاعف القدرة 4 مرات.'
              : 'Power depends on the square of current (I²). (2)² = 4, so power quadruples.',
        },
      ];
    }

    // 4. Thermodynamics / Ideal Gas Law
    if (cat === 'thermodynamics' || id.includes('gas') || id.includes('thermo')) {
      return [
        {
          id: 1,
          questionText:
            language === 'ar'
              ? 'في قانون الغاز المثالي (P × V = n × R × T)، إذا انخفض حجم الإناء (V) إلى النصف مع ثبات درجة الحرارة، ماذا يحدث للضغط (P)؟'
              : 'In the Ideal Gas Law (P × V = n × R × T), if volume (V) decreases by half at constant temperature, pressure (P) will:',
          options:
            language === 'ar'
              ? ['يتضاعف مرتين (2P)', 'ينخفض إلى النصف', 'يبقى ثابتاً', 'ينعدم الضغط']
              : ['Double (2P)', 'Halve', 'Remain constant', 'Become zero'],
          correctIndex: 0,
          explanation:
            language === 'ar'
              ? 'طبقاً لقانون بويل، يتناسب الضغط عكسياً مع الحجم (P ∝ 1/V) عند ثبات درجة الحرارة.'
              : 'According to Boyle’s Law, pressure is inversely proportional to volume (P ∝ 1/V) at constant temperature.',
        },
        {
          id: 2,
          questionText:
            language === 'ar'
              ? 'ما هي وحدة قياس درجة الحرارة المطلقة الواجب استخدامها في قوانين الغازات؟'
              : 'What unit of absolute temperature must be used in gas laws?',
          options: ['Kelvin (K)', 'Celsius (°C)', 'Fahrenheit (°F)', 'Joule (J)'],
          correctIndex: 0,
          explanation:
            language === 'ar'
              ? 'تستخدم درجة الحرارة المطلقة بوحدة الكلفن (K = °C + 273.15) في جميع معادلات الديناميكا الحرارية.'
              : 'Absolute temperature in Kelvin (K = °C + 273.15) is strictly required for thermodynamic equations.',
        },
      ];
    }

    // Default Fallback Questions generated from parameters and explanation
    return [
      {
        id: 1,
        questionText:
          language === 'ar'
            ? `ما القانون أو المبدأ الفيزيائي الأساسي الذي تحاكيه هذه التجربة؟`
            : `What primary physical law governs this simulation?`,
        options: [
          experiment.physicalLaw || 'قانون الحفظ الفيزيائي',
          language === 'ar' ? 'قانون كبلر الثالث' : 'Kepler’s Third Law',
          language === 'ar' ? 'مبدأ أرخميدس للطفو' : 'Archimedes Principle',
          language === 'ar' ? 'قانون كولوم الشحني' : 'Coulomb’s Law',
        ],
        correctIndex: 0,
        explanation:
          language === 'ar'
            ? `القانون الفيزيائي الرئيسي لهذه التجربة هو: ${experiment.physicalLaw}.`
            : `The governing physical principle for this experiment is ${experiment.physicalLaw}.`,
      },
      {
        id: 2,
        questionText:
          language === 'ar'
            ? 'ما الهدف الأساسي من تعديل المعاملات والمدخلات في المحاكاة؟'
            : 'What is the primary purpose of adjusting input parameters in this simulation?',
        options:
          language === 'ar'
            ? [
                'ملاحظة واستنتاج العلاقات الفيزيائية بين المتغيرات حياً',
                'تغيير القوانين الفيزيائية للكون',
                'إيقاف المحاكاة بشكل دائم',
                'لا يطرق أي تغيير على المخرجات',
              ]
            : [
                'To observe and infer physical relationships between variables in real-time',
                'To alter universal laws of physics',
                'To permanently stop the simulation',
                'No output changes occur',
              ],
        correctIndex: 0,
        explanation:
          language === 'ar'
            ? 'تتيح المحاكاة التفاعلية دراسة التأثير المباشر لكل متغير مدخل على المخرجات المقاسة.'
            : 'Interactive simulation lets students discover how tweaking input parameters affects measured physical outputs.',
      },
    ];
  }, [experiment, language]);

  const currentQuestion = questions[currentIndex] || questions[0];

  const handleSelectOption = (index: number) => {
    if (isSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isSubmitted) return;
    const isCorrect = selectedOption === currentQuestion.correctIndex;
    setIsSubmitted(true);
    setAnswersHistory((prev) => [...prev, { selected: selectedOption, isCorrect }]);
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setIsQuizFinished(true);
    }
  };

  const handleRetryQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setAnswersHistory([]);
    setIsQuizFinished(false);
  };

  const scoreCount = answersHistory.filter((a) => a.isCorrect).length;
  const scorePercent = Math.round((scoreCount / questions.length) * 100);

  const titleText =
    language === 'ar'
      ? 'اختبار واستيعاب المفاهيم'
      : language === 'ku'
      ? 'تاقیکردنەوە و تێگەیشتنی چەمکەکان'
      : language === 'kmr'
      ? 'Taqîkirin û Têgihîştina Çemkan'
      : 'Learning Check & Concept Quiz';

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300">
      {/* Header Bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-900/80 transition-colors select-none"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 shrink-0">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
              <span>{titleText}</span>
            </h2>
            <span className="text-xs text-purple-400 font-semibold block mt-0.5">
              {language === 'ar'
                ? `أسئلة تفاعلية (${questions.length} أسئلة)`
                : `Interactive Quiz (${questions.length} Questions)`}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 text-xs font-medium cursor-pointer"
          aria-label="Toggle Quiz Panel"
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
            <ChevronUp className="w-4 h-4 text-purple-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-purple-400" />
          )}
        </button>
      </div>

      {/* Main Quiz Body */}
      {isExpanded && (
        <div className="p-4 sm:p-6 bg-slate-950/40 space-y-5">
          {!isQuizFinished ? (
            <div className="space-y-4">
              {/* Progress Header */}
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>
                  {language === 'ar'
                    ? `السؤال ${currentIndex + 1} من ${questions.length}`
                    : `Question ${currentIndex + 1} of ${questions.length}`}
                </span>
                <span className="text-purple-400 font-mono font-bold">
                  {Math.round(((currentIndex + 1) / questions.length) * 100)}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>

              {/* Question Text */}
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-100 leading-relaxed">
                  {currentQuestion.questionText}
                </h3>
              </div>

              {/* Options List */}
              <div className="space-y-2">
                {currentQuestion.options.map((optionText, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrectAnswer = idx === currentQuestion.correctIndex;

                  let buttonStyle =
                    'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80';

                  if (isSubmitted) {
                    if (isCorrectAnswer) {
                      buttonStyle =
                        'bg-emerald-950/60 text-emerald-200 border-emerald-500/60 font-semibold';
                    } else if (isSelected && !isCorrectAnswer) {
                      buttonStyle =
                        'bg-rose-950/60 text-rose-200 border-rose-500/60 font-semibold';
                    } else {
                      buttonStyle = 'bg-slate-900/40 text-slate-500 border-slate-800/60 opacity-60';
                    }
                  } else if (isSelected) {
                    buttonStyle =
                      'bg-purple-950/60 text-purple-200 border-purple-500/80 shadow-md font-semibold';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isSubmitted}
                      className={`w-full p-3.5 rounded-xl border text-xs sm:text-sm text-start transition-all cursor-pointer flex items-center justify-between gap-3 ${buttonStyle}`}
                    >
                      <span className="flex-1 leading-relaxed">{optionText}</span>
                      <div className="shrink-0">
                        {isSubmitted ? (
                          isCorrectAnswer ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : isSelected ? (
                            <XCircle className="w-5 h-5 text-rose-400" />
                          ) : null
                        ) : (
                          <div
                            className={`w-4 h-4 rounded-full border ${
                              isSelected
                                ? 'border-purple-400 bg-purple-500'
                                : 'border-slate-600'
                            }`}
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Submit & Explanation Box */}
              {!isSubmitted ? (
                <button
                  type="button"
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-40 disabled:hover:bg-purple-600 transition-colors shadow-lg cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {language === 'ar' ? 'تأكيد الإجابة' : 'Check Answer'}
                  </span>
                </button>
              ) : (
                <div className="space-y-3 pt-2">
                  {/* Scientific Explanation Box */}
                  <div
                    className={`p-4 rounded-xl border space-y-1.5 ${
                      selectedOption === currentQuestion.correctIndex
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                        : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
                      {selectedOption === currentQuestion.correctIndex ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>
                            {language === 'ar'
                              ? 'إجابة صحيحة! أحسنت'
                              : 'Correct Answer! Well done.'}
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          <span>
                            {language === 'ar'
                              ? 'إجابة خاطئة'
                              : 'Incorrect Answer.'}
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans pt-1">
                      {currentQuestion.explanation}
                    </p>
                  </div>

                  {/* Next Question Button */}
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-slate-800 hover:bg-slate-700 text-slate-100 transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>
                      {currentIndex < questions.length - 1
                        ? language === 'ar'
                          ? 'السؤال التالي'
                          : 'Next Question'
                        : language === 'ar'
                        ? 'عرض النتيجة النهائية'
                        : 'View Final Score'}
                    </span>
                    {language === 'ar' ? (
                      <ChevronLeft className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Quiz Completed Summary Card */
            <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                <Award className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-slate-100">
                  {language === 'ar'
                    ? 'اكتمل الاختبا العلمِي!'
                    : 'Quiz Completed!'}
                </h3>
                <p className="text-xs text-slate-400">
                  {language === 'ar'
                    ? 'نتيجتك النهائية في استيعاب مفاهيم التجربة:'
                    : 'Your final score in understanding this experiment:'}
                </p>
              </div>

              {/* Score Metric Display */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 inline-block min-w-[200px]">
                <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono">
                  {scoreCount} / {questions.length}
                </div>
                <div className="text-xs font-bold text-slate-400 mt-1">
                  {scorePercent}%{' '}
                  {scorePercent >= 80
                    ? language === 'ar'
                      ? 'ممتاز!'
                      : 'Excellent!'
                    : scorePercent >= 50
                    ? language === 'ar'
                      ? 'جيد جداً'
                      : 'Good Job'
                    : language === 'ar'
                    ? 'راجع النظرية وحاول مجدداً'
                    : 'Review Theory & Try Again'}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleRetryQuiz}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-purple-600 hover:bg-purple-500 text-white transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>
                    {language === 'ar'
                      ? 'إعادة الاختبار'
                      : 'Retry Quiz'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
