import React from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { getLanguageConfig } from '../../config/languages';
import { Language } from '../../types/language';
import { Globe, Atom, Menu } from 'lucide-react';

interface TopBarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  onOpenDrawer: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onNavigate, onOpenDrawer }) => {
  const { language, setLanguage, t, supportedLanguages } = useTranslation();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-3 sm:px-6 py-2.5 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left Side: Drawer Toggle Menu Button & TAQ Branding */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenDrawer}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center border border-slate-700/60"
            aria-label="Open Navigation Drawer"
          >
            <Menu className="w-5 h-5 text-cyan-400" />
          </button>

          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-none min-h-[44px] shrink-0"
            aria-label={t('app.title')}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform shrink-0">
              <Atom className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-slate-50 leading-tight">
                {t('app.title')}
              </h1>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                {t('app.subtitle')}
              </p>
            </div>
          </button>
        </div>

        {/* Right Side: Visible Language Button Selector */}
        <div className="relative flex items-center gap-1.5 bg-slate-950/90 px-2.5 py-1.5 rounded-xl border border-slate-800 min-h-[44px]">
          <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="bg-transparent text-xs sm:text-sm text-slate-200 font-medium focus:outline-none cursor-pointer pr-1"
            aria-label={t('common.selectLanguage')}
          >
            {supportedLanguages.map((code) => {
              const config = getLanguageConfig(code);
              return (
                <option key={code} value={code} className="bg-slate-900 text-slate-100">
                  {config.nativeName} ({code.toUpperCase()})
                </option>
              );
            })}
          </select>
        </div>
      </div>
    </header>
  );
};
