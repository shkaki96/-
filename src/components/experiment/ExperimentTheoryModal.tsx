import React from 'react';
import { Experiment } from '../../types/experiment';
import { useTranslation } from '../../i18n/useTranslation';
import {
  X,
  BookOpen,
  Target,
  Activity,
  Lightbulb,
  Cog,
  ShieldCheck,
  Eye,
  CheckCircle2,
  FileText,
} from 'lucide-react';

interface ExperimentTheoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  experiment: Experiment;
}

export const ExperimentTheoryModal: React.FC<ExperimentTheoryModalProps> = ({
  isOpen,
  onClose,
  experiment,
}) => {
  const { t, getLocalizedText, getLocalizedArray } = useTranslation();

  if (!isOpen) return null;

  const title = getLocalizedText(experiment.title);
  const description = getLocalizedText(experiment.description);
  const howItWorks = getLocalizedText(experiment.howItWorks);
  const whatHappened = getLocalizedText(experiment.whatHappened);
  const result = getLocalizedText(experiment.result);
  const explanation = getLocalizedText(experiment.explanation);
  const procedure = getLocalizedArray(experiment.procedure);
  const inputs = getLocalizedArray(experiment.inputs);
  const outputs = getLocalizedArray(experiment.outputs);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 leading-snug">
                {title}
              </h2>
              <span className="text-xs font-mono text-cyan-400 font-semibold">
                {experiment.physicalLaw}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center border border-slate-700/60"
            aria-label={t('ads.close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Sections */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-950/40">
          {/* Section 1: Experiment Objective */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
              <Target className="w-4 h-4" />
              <span>{t('theoryModal.objective')}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              {description}
            </p>
          </div>

          {/* Section 2: What Happens in the Experiment */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Activity className="w-4 h-4" />
              <span>{t('theoryModal.whatHappened')}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              {whatHappened}
            </p>
          </div>

          {/* Section 3: Theoretical Explanation */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <Lightbulb className="w-4 h-4" />
              <span>{t('theoryModal.theoreticalExplanation')}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              {explanation}
            </p>
          </div>

          {/* Section 4: How the Experiment Works */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
              <Cog className="w-4 h-4" />
              <span>{t('theoryModal.howItWorks')}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              {howItWorks}
            </p>
          </div>

          {/* Section 5: Physical Law */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>{t('theoryModal.physicalLaw')}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-sm text-cyan-400 font-bold">
              {experiment.physicalLaw}
            </div>
          </div>

          {/* Section 6: What We Observe (Procedure Steps) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
              <Eye className="w-4 h-4" />
              <span>{t('theoryModal.observations')}</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
              {procedure.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-rose-400 font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 7: What We Obtain / Quantitative Outputs */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-wider">
              <FileText className="w-4 h-4" />
              <span>{t('theoryModal.obtainedResults')}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">
                  {t('experiment.inputs')}
                </span>
                <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
                  {inputs.map((inp, i) => (
                    <li key={i}>{inp}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">
                  {t('experiment.outputs')}
                </span>
                <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
                  {outputs.map((out, i) => (
                    <li key={i}>{out}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Section 8: Conclusion & Key Takeaway */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('theoryModal.conclusion')}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans font-medium">
              {result}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
