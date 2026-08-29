import React, { useState } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import {
  X,
  Atom,
  FlaskConical,
  Calculator,
  Telescope,
  BookOpen,
  HelpCircle,
  Binary,
  Compass,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Home,
  Layers,
} from 'lucide-react';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activePage: string;
  onNavigate: (page: string) => void;
  onOpenTool: (toolId: string) => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  activePage,
  onNavigate,
  onOpenTool,
}) => {
  const { t, isRTL } = useTranslation();
  const [scienceExpanded, setScienceExpanded] = useState(true);
  const [toolsExpanded, setToolsExpanded] = useState(true);

  if (!isOpen) return null;

  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
      {/* Semi-transparent dark backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Sliding Drawer Panel */}
      <div
        className={`relative z-10 w-80 sm:w-96 bg-slate-900 border-slate-800 h-full flex flex-col shadow-2xl transition-transform duration-300 ease-out ${
          isRTL ? 'border-l ml-auto' : 'border-r'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
              <Atom className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">{t('app.title')}</h2>
              <p className="text-xs text-slate-400">{t('app.subtitle')}</p>
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

        {/* Drawer Scrollable Links & Sections */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Main App Navigation */}
          <div className="space-y-1">
            <button
              onClick={() => {
                onNavigate('home');
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer min-h-[44px] ${
                activePage === 'home'
                  ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100'
              }`}
            >
              <Home className="w-5 h-5 text-cyan-400" />
              <span>{t('nav.home')}</span>
            </button>

            <button
              onClick={() => {
                onNavigate('experiment');
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer min-h-[44px] ${
                activePage === 'experiment'
                  ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100'
              }`}
            >
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>{t('nav.experiments')}</span>
            </button>
          </div>

          {/* Section 1: Science & Disciplines */}
          <div className="space-y-2">
            <button
              onClick={() => setScienceExpanded(!scienceExpanded)}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-2 py-1 hover:text-slate-200 transition-colors cursor-pointer"
            >
              <span>{t('drawer.science')}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  scienceExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>

            {scienceExpanded && (
              <div className="space-y-1 pl-1">
                {/* Physics - Active */}
                <button
                  onClick={() => {
                    onNavigate('home');
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800/80 transition-colors cursor-pointer min-h-[44px]"
                >
                  <div className="flex items-center gap-3">
                    <Atom className="w-4 h-4 text-cyan-400" />
                    <span>{t('drawer.physics')}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    70 Labs
                  </span>
                </button>

                {/* Chemistry - Future Extensibility */}
                <div className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-950/40 text-slate-500 text-xs font-medium border border-slate-800/30 opacity-75">
                  <div className="flex items-center gap-3">
                    <FlaskConical className="w-4 h-4 text-slate-500" />
                    <span>{t('drawer.chemistry')}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 border border-slate-700">
                    {t('drawer.comingSoon')}
                  </span>
                </div>

                {/* Mathematics - Future Extensibility */}
                <div className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-950/40 text-slate-500 text-xs font-medium border border-slate-800/30 opacity-75">
                  <div className="flex items-center gap-3">
                    <Calculator className="w-4 h-4 text-slate-500" />
                    <span>{t('drawer.mathematics')}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 border border-slate-700">
                    {t('drawer.comingSoon')}
                  </span>
                </div>

                {/* Astronomy - Future Extensibility */}
                <div className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-950/40 text-slate-500 text-xs font-medium border border-slate-800/30 opacity-75">
                  <div className="flex items-center gap-3">
                    <Telescope className="w-4 h-4 text-slate-500" />
                    <span>{t('drawer.astronomy')}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 border border-slate-700">
                    {t('drawer.comingSoon')}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Laboratory Tools */}
          <div className="space-y-2">
            <button
              onClick={() => setToolsExpanded(!toolsExpanded)}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-2 py-1 hover:text-slate-200 transition-colors cursor-pointer"
            >
              <span>{t('drawer.tools')}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  toolsExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>

            {toolsExpanded && (
              <div className="space-y-1 pl-1">
                {/* Scientific Keyboard */}
                <button
                  onClick={() => {
                    onOpenTool('keyboard');
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800/80 transition-colors cursor-pointer min-h-[44px]"
                >
                  <div className="flex items-center gap-3">
                    <Calculator className="w-4 h-4 text-emerald-400" />
                    <span>{t('drawer.scientificKeyboard')}</span>
                  </div>
                  <ChevronIcon className="w-4 h-4 text-slate-500" />
                </button>

                {/* Lab Notebook */}
                <button
                  onClick={() => {
                    onOpenTool('notebook');
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800/80 transition-colors cursor-pointer min-h-[44px]"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    <span>{t('drawer.labNotebook')}</span>
                  </div>
                  <ChevronIcon className="w-4 h-4 text-slate-500" />
                </button>

                {/* Physics Tests */}
                <button
                  onClick={() => {
                    onOpenTool('tests');
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800/80 transition-colors cursor-pointer min-h-[44px]"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-purple-400" />
                    <span>{t('drawer.tests')}</span>
                  </div>
                  <ChevronIcon className="w-4 h-4 text-slate-500" />
                </button>

                {/* Symbols & Constants */}
                <button
                  onClick={() => {
                    onOpenTool('symbols');
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800/80 transition-colors cursor-pointer min-h-[44px]"
                >
                  <div className="flex items-center gap-3">
                    <Binary className="w-4 h-4 text-blue-400" />
                    <span>{t('drawer.symbolsAndConstants')}</span>
                  </div>
                  <ChevronIcon className="w-4 h-4 text-slate-500" />
                </button>

                {/* Formulas Guide */}
                <button
                  onClick={() => {
                    onOpenTool('formulas');
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800/80 transition-colors cursor-pointer min-h-[44px]"
                >
                  <div className="flex items-center gap-3">
                    <Compass className="w-4 h-4 text-rose-400" />
                    <span>{t('drawer.formulas')}</span>
                  </div>
                  <ChevronIcon className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 text-xs text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-cyan-400 font-mono text-[11px]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('app.version')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
