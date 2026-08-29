import React from 'react';
import { ExperimentSchema } from '../../types/experiment';
import { useTranslation } from '../../i18n/useTranslation';
import { Card } from '../ui/Card';
import { BookOpen, Activity, Play, CheckCircle2, ListOrdered, ArrowDownRight, ArrowUpRight } from 'lucide-react';

export interface EducationalPanelProps {
  experiment: ExperimentSchema;
}

export const EducationalPanel: React.FC<EducationalPanelProps> = ({ experiment }) => {
  const { t, getLocalizedText, getLocalizedArray } = useTranslation();

  return (
    <Card variant="elevated" padding="md" className="space-y-5">
      {/* Theory & Concept */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>{t('experiment.theory')}</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {getLocalizedText(experiment.explanation)}
        </p>
      </div>

      {/* How It Works */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>{t('experiment.howItWorks')}</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {getLocalizedText(experiment.howItWorks)}
        </p>
      </div>

      {/* What Happened */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
          <Play className="w-4 h-4 text-cyan-400" />
          <span>{t('experiment.whatHappened')}</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {getLocalizedText(experiment.whatHappened)}
        </p>
      </div>

      {/* Result & Conclusion */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{t('experiment.result')}</span>
        </h3>
        <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 rounded-xl text-xs sm:text-sm text-emerald-300/90 leading-relaxed font-medium">
          {getLocalizedText(experiment.result)}
        </div>
      </div>

      {/* Procedure Steps */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
          <ListOrdered className="w-4 h-4 text-cyan-400" />
          <span>{t('experiment.procedure')}</span>
        </h3>
        <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {getLocalizedArray(experiment.procedure).map((step, idx) => (
            <li key={idx} className="pl-1">{step}</li>
          ))}
        </ol>
      </div>

      {/* Inputs & Outputs Grid */}
      <div className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-2">
          <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>{t('experiment.inputs')}</span>
          </span>
          <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
            {getLocalizedArray(experiment.inputs).map((inp, idx) => (
              <li key={idx}>{inp}</li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-2">
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{t('experiment.outputs')}</span>
          </span>
          <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
            {getLocalizedArray(experiment.outputs).map((out, idx) => (
              <li key={idx}>{out}</li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};
