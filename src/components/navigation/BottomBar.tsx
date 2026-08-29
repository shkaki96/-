import React from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { ShieldCheck, Home, Layers, Sparkles } from 'lucide-react';

interface BottomBarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export const BottomBar: React.FC<BottomBarProps> = ({ activePage, onNavigate }) => {
  const { t } = useTranslation();

  return (
    <>
      {/* Mobile Touch Bar (Fixed at bottom on small screens) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-6 py-2 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[64px] gap-1 transition-colors cursor-pointer ${
            activePage === 'home' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label={t('nav.home')}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] tracking-wide">{t('nav.home')}</span>
        </button>

        <button
          onClick={() => onNavigate('experiment')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[64px] gap-1 transition-colors cursor-pointer ${
            activePage === 'experiment' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label={t('nav.experiments')}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px] tracking-wide">{t('nav.experiments')}</span>
        </button>
      </div>

      {/* Desktop / Global Status Footer */}
      <footer className="bg-slate-900/80 border-t border-slate-800/80 py-3.5 px-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Platform Status & Security Notice */}
          <div className="flex items-center gap-2 text-emerald-400 font-mono">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="text-slate-300 font-sans">{t('common.securityNotice')}</span>
          </div>

          {/* Core Version & Interactive Physics Indicator */}
          <div className="flex items-center gap-3 text-slate-400">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 text-[11px] font-mono text-cyan-400 border border-slate-700">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>{t('app.version')}</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
