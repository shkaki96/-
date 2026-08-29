import React from 'react';
import { ExperimentRegistry } from '../../data/experiments/registry';
import { useTranslation } from '../../i18n/useTranslation';
import { LANGUAGE_CONFIGS } from '../../config/languages';
import { Language } from '../../types/language';
import { Button } from '../ui/Button';
import { ArrowLeft, ArrowRight, Layers, Globe } from 'lucide-react';

export interface ExperimentNavigationProps {
  currentExperimentId: string;
  onNavigate: (id: string) => void;
  onBackToHome: () => void;
}

export const ExperimentNavigation: React.FC<ExperimentNavigationProps> = ({
  currentExperimentId,
  onNavigate,
  onBackToHome,
}) => {
  const { isRTL, language, setLanguage, t, getLocalizedText, supportedLanguages } = useTranslation();
  const allExperiments = ExperimentRegistry.getAll();
  const currentIndex = allExperiments.findIndex((e) => e.id === currentExperimentId);

  const prevExperiment = currentIndex > 0 ? allExperiments[currentIndex - 1] : null;
  const nextExperiment = currentIndex < allExperiments.length - 1 ? allExperiments[currentIndex + 1] : null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 p-3 rounded-2xl border border-slate-800 shadow-md">
      {/* Obvious way to return to Experiment List */}
      <Button
        variant="secondary"
        size="sm"
        onClick={() => {
          onBackToHome();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="min-h-[44px] px-4 font-semibold text-xs sm:text-sm cursor-pointer"
      >
        {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        <span>{t('experiment.allExperiments')}</span>
      </Button>

      {/* Quick Select Dropdown */}
      <div className="flex items-center gap-2 max-w-xs sm:max-w-md w-full sm:w-auto">
        <Layers className="w-4 h-4 text-cyan-400 shrink-0 hidden sm:block" />
        <select
          value={currentExperimentId}
          onChange={(e) => {
            onNavigate(e.target.value);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="w-full bg-slate-950 text-xs sm:text-sm text-slate-200 border border-slate-800 rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer min-h-[44px]"
          aria-label={t('experiment.allExperiments')}
        >
          {allExperiments.map((exp) => (
            <option key={exp.id} value={exp.id}>
              EXP-{String(exp.codeNumber).padStart(3, '0')}: {getLocalizedText(exp.title)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        {/* Language Selector in Header */}
        <div className="relative flex items-center">
          <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="bg-slate-950 text-xs text-slate-200 border border-slate-800 rounded-xl pl-8 pr-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer min-h-[44px]"
            aria-label="Language Selector"
          >
            {supportedLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {LANGUAGE_CONFIGS[lang]?.nativeName || lang.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Prev / Next Buttons */}
        <Button
          variant="outline"
          size="sm"
          disabled={!prevExperiment}
          onClick={() => {
            if (prevExperiment) {
              onNavigate(prevExperiment.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="min-h-[44px]"
          aria-label={t('experiment.previous')}
        >
          {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span className="hidden sm:inline">{t('experiment.previous')}</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          disabled={!nextExperiment}
          onClick={() => {
            if (nextExperiment) {
              onNavigate(nextExperiment.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="min-h-[44px]"
          aria-label={t('experiment.next')}
        >
          <span className="hidden sm:inline">{t('experiment.next')}</span>
          {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
};
