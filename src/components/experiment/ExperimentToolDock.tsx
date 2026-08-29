import React from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import {
  BookOpen,
  Compass,
  Calculator,
  Notebook,
  HelpCircle,
  Binary,
} from 'lucide-react';

interface ExperimentToolDockProps {
  onOpenTool: (toolId: string) => void;
}

export const ExperimentToolDock: React.FC<ExperimentToolDockProps> = ({ onOpenTool }) => {
  const { t } = useTranslation();

  const toolButtons = [
    { id: 'theory', label: t('experiment.theory'), icon: BookOpen, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
    { id: 'formulas', label: t('drawer.formulas'), icon: Compass, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
    { id: 'keyboard', label: t('drawer.scientificKeyboard'), icon: Calculator, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    { id: 'notebook', label: t('drawer.labNotebook'), icon: Notebook, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    { id: 'tests', label: t('drawer.tests'), icon: HelpCircle, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
    { id: 'symbols', label: t('drawer.symbolsAndConstants'), icon: Binary, color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
  ];

  return (
    <div className="bg-slate-900/90 backdrop-blur-md p-2 sm:p-3 rounded-2xl border border-slate-800 shadow-xl">
      <div className="flex items-center justify-around sm:justify-start gap-1.5 sm:gap-3 overflow-x-auto no-scrollbar">
        {toolButtons.map((tb) => {
          const Icon = tb.icon;
          return (
            <button
              key={tb.id}
              onClick={() => onOpenTool(tb.id)}
              className={`flex items-center gap-2 px-2.5 sm:px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer min-h-[44px] shrink-0 hover:scale-105 active:scale-95 ${tb.color}`}
              title={tb.label}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline text-slate-200">{tb.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
