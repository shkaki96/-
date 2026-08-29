import React, { useState } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { X, HelpCircle, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

interface TestsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LocalizedQuestion {
  id: number;
  question: Record<string, string>;
  options: Record<string, string[]>;
  correctIndex: number;
  explanation: Record<string, string>;
}

const QUIZ_QUESTIONS: LocalizedQuestion[] = [
  {
    id: 1,
    question: {
      en: 'How does doubling the length (L) of a simple pendulum affect its period (T)?',
      ar: 'كيف يؤثر مضاعفة طول خيط البندول البسيط (L) على زمنه الدوري (T)؟',
      ku: 'چۆن دوو هێندەکردنی درێژی پەت (L)ی پەندۆلی سادە کاریگەری دەکاتە سەر ماوەی خولی (T)؟',
      kmr: 'Duqatkirina dirêjahiya werîs (L) di pendola xwerû de çawa bandorê li ser dema dewranî (T) dike?',
    },
    options: {
      en: [
        'The period doubles (2x)',
        'The period increases by a factor of √2 (~1.41x)',
        'The period is halved (0.5x)',
        'The period remains unchanged',
      ],
      ar: [
        'يتضاعف الزمن الدوري مرتين (2x)',
        'يزداد الزمن الدوري بمقدار الجذر التربيعي لاثنين (√2 ≈ 1.41)',
        'يقل الزمن الدوري إلى النصف (0.5x)',
        'يبقى الزمن الدوري ثابتاً دون أي تغيير',
      ],
      ku: [
        'ماوەی خولی دوو هێندە دەبێت (2x)',
        'ماوەی خولی بە ڕێژەی ڕەگی دوو (√2 ≈ 1.41) زیاد دەکات',
        'ماوەی خولی دەبێتە نیوە (0.5x)',
        'ماوەی خولی بە نەگۆڕی دەمێنێتەوە',
      ],
      kmr: [
        'Dema dewranî du qatan zêde dibe (2x)',
        'Dema dewranî bi qasî reha duyem (√2 ≈ 1.41) zêde dibe',
        'Dema dewranî nîvî kêm dibe (0.5x)',
        'Dema dewranî neguherbar dimîne',
      ],
    },
    correctIndex: 1,
    explanation: {
      en: 'From T = 2π√(L/g), period T is directly proportional to the square root of length √L. Thus, doubling L increases T by √2.',
      ar: 'وفق قانون البندول البسيط T = 2π√(L/g)، يتناسب الزمن الدوري طردياً مع الجذر التربيعي للطول √L. لذلك فإن مضاعفة الطول تزيد الزمن بمعامل √2.',
      ku: 'بەپێی یاسای پەندۆل T = 2π√(L/g)، ماوەی خولی ڕاستەوانە دەگۆڕێت لەگەڵ ڕەگی دووجای درێژی √L، بۆیە دوو هێندەکردنی درێژی بە ڕێژەی √2 کات زیاد دەکات.',
      kmr: 'Li gor hevkêşeya T = 2π√(L/g), dema dewranî rasterast bi reha çargoşeyî ya dirêjahiyê √L ve girêdayî ye. Ji ber vê yekê, duqatkirina L dibe sedema zêdebûna T bi rêjeya √2.',
    },
  },
  {
    id: 2,
    question: {
      en: "According to Hooke's Law (F = -k x), what happens if the spring constant (k) is increased?",
      ar: 'وفقاً لقانون هوك (F = -k x)، ماذا يحدث عند زيادة ثابت صلابة الزنبرك (k)؟',
      ku: 'بەپێی یاسای هۆک (F = -k x)، چی ڕوودەدات ئەگەر نەگۆڕی سپرینگ (k) زیاد بکرێت؟',
      kmr: 'Li gor Zagona Hok (F = -k x), ger xweciha rastekê (k) were zêdekirin çi diqewime?',
    },
    options: {
      en: [
        'The spring becomes softer and easier to stretch',
        'The period of oscillation increases',
        'The spring becomes stiffer and oscillation frequency increases',
        'The force decreases for the same displacement',
      ],
      ar: [
        'يصبح الزنبرك أكثر مرونة وسهولة في الاستطالة',
        'يزداد الزمن الدوري للاهتزاز',
        'تزداد صلابة الزنبرك ويزداد تردد الاهتزاز',
        'تقل القوة المسترجعة لنفس الإزاحة',
      ],
      ku: [
        'سپرینگەکە نەرمتر دەبێت و ئاسانتر دەکشێت',
        'ماوەی خولی لەرینەوەکە زیاد دەکات',
        'سپرینگەکە ڕەقتر دەبێت و فریکوێنسی لەرینەوەکەی زیاد دەکات',
        'هێز کەم دەکات بۆ هەمان بڕی لادان',
      ],
      kmr: [
        'Rastek nermtir dibe û hêsantir dirêj dibe',
        'Dema dewranî ya lerizînê zêde dibe',
        'Rastek tundtir/reqtir dibe û frekansa lerizînê zêde dibe',
        'Ji bo heman dirêjbûnê hêz kêm dibe',
      ],
    },
    correctIndex: 2,
    explanation: {
      en: 'A higher spring constant k means a stiffer spring. Frequency f = (1/2π)√(k/m) increases, making oscillations faster.',
      ar: 'زيادة ثابت الزنبرك k تعني جساءة أكبر. ويزداد التردد f = (1/2π)√(k/m) مما يجعل الاهتزازات أسرع.',
      ku: 'نەگۆڕی سپرینگی بەرزتر k واتە سپرینگێکی ڕەقتر. فریکوێنسی فیزیکی زیاد دەکات و جووڵەی لەرینەوە خێراتر دەبێت.',
      kmr: 'Zêdebûna xweciha rastekê k tê wateya rastekeke tundtir. Frekans zêde dibe û tevgera lerizînê leztir dibe.',
    },
  },
  {
    id: 3,
    question: {
      en: 'If air resistance is neglected, how does increasing the mass of a pendulum bob affect its period?',
      ar: 'بإهمال مقاومة الهواء، كيف تؤثر زيادة كتلة ثقل البندول على زمنه الدوري؟',
      ku: 'بە پشتگوێخستنی بەرگری هەوا، چۆن زیادکردنی بارستەی تۆپی پەندۆل کاریگەری دەکاتە سەر ماوەی خولی؟',
      kmr: 'Bi paşguhkirina bergirîya hewayê, zêdekirina senga giloka pendolê çawa bandorê li ser dema dewranî dike?',
    },
    options: {
      en: [
        'Increases the period',
        'Decreases the period',
        'Has zero effect on the period',
        'Stops the oscillation',
      ],
      ar: [
        'يزيد من الزمن الدوري',
        'يقلل من الزمن الدوري',
        'ليس له أي تأثير إطلاقاً على الزمن الدوري',
        'يوقف حركة البندول الاهتزازية',
      ],
      ku: [
        'ماوەی خولی زیاد دەکات',
        'ماوەی خولی کەم دەکات',
        'هیچ کاریگەرییەکی نییە لەسەر ماوەی خولی',
        'جووڵەی لەرینەوەکە دەوەستێنێت',
      ],
      kmr: [
        'Dema dewranî zêde dike',
        'Dema dewranî kêm dike',
        'Qet tu bandorê li ser dema dewranî nake',
        'Tevgera lerizînê radiwestîne',
      ],
    },
    correctIndex: 2,
    explanation: {
      en: 'The period equation T = 2π√(L/g) does not contain mass m. Gravitational mass and inertial mass cancel out completely.',
      ar: 'معادلة الزمن الدوري T = 2π√(L/g) لا تعتمد على الكتلة m نهائياً، حيث تتساوى وتلغى الكتلة العطالية مع كتلة الجاذبية.',
      ku: 'هاوکێشەی ماوەی خولی T = 2π√(L/g) هیچ پەیوەندی بە بارستە m نییە، چونکە بارستەی کێشکردن و بارستەی سستی یەکتر پووچەڵ دەکەنەوە.',
      kmr: 'Hevkêşeya dema dewranî T = 2π√(L/g) ji senga m serbixwe ye. Senga hevkêşanê û senga bêliviyê hevûdu pûç dikin.',
    },
  },
  {
    id: 4,
    question: {
      en: 'At which point during a simple pendulum oscillation is kinetic energy at its maximum?',
      ar: 'عند أي نقطة أثناء اهتزاز البندول البسيط تكون الطاقة الحركية في قيمتها العظمى؟',
      ku: 'لە چ خاڵێکدا لە کاتی لەرینەوەی پەندۆلی سادەدا وزەی جووڵە لە بەرزترین ئاستیدایە؟',
      kmr: 'Di kîjan xalê de di dema lerizîna pendola xwerû de enerjiya tevgerî di asta xwe ya herî bilind de ye?',
    },
    options: {
      en: [
        'At maximum amplitude (turning points)',
        'At the lowest point (equilibrium position)',
        'Midway between equilibrium and maximum angle',
        'Kinetic energy is constant throughout',
      ],
      ar: [
        'عند أقصى إزاحة وسعة اهتزاز (نقاط الانعكاس)',
        'عند أدنى نقطة (موضع الاتزان والاستقرار)',
        'في منتصف المسافة بين موضع الاتزان وأقصى زاوية',
        'الطاقة الحركية تظل ثابتة في جميع النقاط',
      ],
      ku: [
        'لە ئەوپەڕی لادان و گەورەیی لەرینەوەدا',
        'لە نزمترین خاڵدا (شوێنی هاوسەنگی)',
        'لە نێوان شوێنی هاوسەنگی و ئەوپەڕی گۆشەدا',
        'وزەی جووڵە لە هەموو شوێنێکدا وەک خۆیەتی',
      ],
      kmr: [
        'Di mezintirîn dirêjbûn û goşeya zivirînê de',
        'Di xala herî nizm de (cihê hevsengiyê)',
        'Di nîvê navbera cihê hevsengiyê û goşeya herî mezin de',
        'Enerjiya tevgerî li her derê wekhev e',
      ],
    },
    correctIndex: 1,
    explanation: {
      en: 'At equilibrium, potential energy is zero (lowest point) and velocity is maximum, making kinetic energy (½m v²) maximum.',
      ar: 'عند موضع الاتزان تكون طاقة الوضع في أدنى قيمة والسرعة في أقصاها، مما يجعل الطاقة الحركية (½m v²) في قيمتها العظمى.',
      ku: 'لە خاڵی هاوسەنگیدا، وزەی شاراوە سفرە و خێرایی لە ئەوپەڕی خۆیدایە، بۆیە وزەی جووڵە (½m v²) دەبێتە زۆرترین بڕ.',
      kmr: 'Li cihê hevsengiyê, enerjiya embarkirî sifr e û lez herî zêde ye, ji ber vê yekê enerjiya tevgerî (½m v²) digihîje nirxa herî bilind.',
    },
  },
];

export const TestsModal: React.FC<TestsModalProps> = ({ isOpen, onClose }) => {
  const { t, language } = useTranslation();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  if (!isOpen) return null;

  const currentLang = language || 'kmr';
  const currentQ = QUIZ_QUESTIONS[currentIdx];

  const qText = currentQ.question[currentLang] || currentQ.question['kmr'] || currentQ.question['ku'] || currentQ.question['en'];
  const opts = currentQ.options[currentLang] || currentQ.options['kmr'] || currentQ.options['ku'] || currentQ.options['en'] || [];
  const expl = currentQ.explanation[currentLang] || currentQ.explanation['kmr'] || currentQ.explanation['ku'] || currentQ.explanation['en'];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setScore(0);
    setQuizCompleted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-bold text-slate-100">{t('tools.testsTitle')}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4 bg-slate-950/50">
          {quizCompleted ? (
            <div className="text-center py-8 space-y-4">
              <div className="inline-flex p-4 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-400">
                <CheckCircle className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-100">{t('quiz.quizComplete')}</h4>
                <p className="text-sm text-slate-400 mt-1">
                  {t('tools.score')}: <span className="font-mono font-bold text-cyan-400">{score}</span> / {QUIZ_QUESTIONS.length}
                </p>
              </div>

              <button
                onClick={handleRestart}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 mx-auto transition-colors cursor-pointer min-h-[44px]"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t('quiz.retakeQuiz')}</span>
              </button>
            </div>
          ) : (
            <>
              {/* Progress */}
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>
                  {t('tools.question')} {currentIdx + 1} / {QUIZ_QUESTIONS.length}
                </span>
                <span>
                  {t('tools.score')}: {score}
                </span>
              </div>

              {/* Question Text */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl font-medium text-xs sm:text-sm text-slate-100 leading-relaxed">
                {qText}
              </div>

              {/* Options */}
              <div className="space-y-2">
                {opts.map((opt, idx) => {
                  let btnStyle = 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200';
                  if (isAnswered) {
                    if (idx === currentQ.correctIndex) {
                      btnStyle = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold';
                    } else if (idx === selectedOpt) {
                      btnStyle = 'bg-rose-500/20 border-rose-500/50 text-rose-300';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswered}
                      className={`w-full p-3 text-left text-xs sm:text-sm rounded-xl border transition-colors cursor-pointer min-h-[48px] flex items-center justify-between gap-3 ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {isAnswered && idx === currentQ.correctIndex && (
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {isAnswered && idx === selectedOpt && idx !== currentQ.correctIndex && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation feedback */}
              {isAnswered && (
                <div className="p-3 bg-slate-900/90 border border-cyan-500/30 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                    {t('tools.explanation')}
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {expl}
                  </p>
                </div>
              )}

              {/* Next Button */}
              {isAnswered && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNext}
                    className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer min-h-[44px]"
                  >
                    {t('tools.nextQuestion')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
