import React, { useState } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { X, HelpCircle, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

interface TestsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'How does doubling the length (L) of a simple pendulum affect its period (T)?',
    options: [
      'The period doubles (2x)',
      'The period increases by a factor of √2 (~1.41x)',
      'The period is halved (0.5x)',
      'The period remains unchanged',
    ],
    correctIndex: 1,
    explanation: 'From T = 2π√(L/g), period T is directly proportional to the square root of length √L. Thus, doubling L increases T by √2.',
  },
  {
    id: 2,
    question: 'According to Hooke\'s Law (F = -k x), what happens if the spring constant (k) is increased?',
    options: [
      'The spring becomes softer and easier to stretch',
      'The period of oscillation increases',
      'The spring becomes stiffer and oscillation frequency increases',
      'The force decreases for the same displacement',
    ],
    correctIndex: 2,
    explanation: 'A higher spring constant k means a stiffer spring. Frequency f = (1/2π)√(k/m) increases, making oscillations faster.',
  },
  {
    id: 3,
    question: 'If air resistance is neglected, how does increasing the mass of a pendulum bob affect its period?',
    options: [
      'Increases the period',
      'Decreases the period',
      'Has zero effect on the period',
      'Stops the oscillation',
    ],
    correctIndex: 2,
    explanation: 'The period equation T = 2π√(L/g) does not contain mass m. Gravitational mass and inertial mass cancel out completely.',
  },
  {
    id: 4,
    question: 'At which point during a simple pendulum oscillation is kinetic energy at its maximum?',
    options: [
      'At maximum amplitude (turning points)',
      'At the lowest point (equilibrium position)',
      'Midway between equilibrium and maximum angle',
      'Kinetic energy is constant throughout',
    ],
    correctIndex: 1,
    explanation: 'At equilibrium, potential energy is zero (lowest point) and velocity is maximum, making kinetic energy (½m v²) maximum.',
  },
];

export const TestsModal: React.FC<TestsModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  if (!isOpen) return null;

  const currentQ = QUIZ_QUESTIONS[currentIdx];

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
                <h4 className="text-lg font-bold text-slate-100">Test Completed!</h4>
                <p className="text-sm text-slate-400 mt-1">
                  {t('tools.score')}: <span className="font-mono font-bold text-cyan-400">{score}</span> / {QUIZ_QUESTIONS.length}
                </p>
              </div>

              <button
                onClick={handleRestart}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 mx-auto transition-colors cursor-pointer min-h-[44px]"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restart Test</span>
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
                {currentQ.question}
              </div>

              {/* Options */}
              <div className="space-y-2">
                {currentQ.options.map((opt, idx) => {
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
                    {currentQ.explanation}
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
