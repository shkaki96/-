import React from 'react';
import { ExperimentSchema } from '../../types/experiment';
import { useTranslation } from '../../i18n/useTranslation';
import { Badge } from '../ui/Badge';
import { Atom } from 'lucide-react';

export interface ExperimentHeaderProps {
  experiment: ExperimentSchema;
}

export const ExperimentHeader: React.FC<ExperimentHeaderProps> = ({ experiment }) => {
  const { getLocalizedText } = useTranslation();

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="cyan">
          <Atom className="w-3.5 h-3.5" />
          <span>EXP-{String(experiment.codeNumber).padStart(3, '0')}</span>
        </Badge>
        <Badge variant="purple">
          <span>{experiment.physicalLaw}</span>
        </Badge>
      </div>

      <div className="space-y-1.5">
        <h2 className="text-xl sm:text-3xl font-extrabold text-slate-50 tracking-tight leading-tight">
          {getLocalizedText(experiment.title)}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
          {getLocalizedText(experiment.description)}
        </p>
      </div>
    </div>
  );
};
