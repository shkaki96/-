import React from 'react';
import { useAds } from './AdContext';
import { useTranslation } from '../../i18n/useTranslation';
import { X, Sparkles, ExternalLink } from 'lucide-react';

export const ReservedAdBanner: React.FC = () => {
  const { isAdVisible, dismissAd, activePage } = useAds();
  const { t } = useTranslation();

  // Rule: Do NOT display ads on experiment pages or when dismissed
  if (!isAdVisible || activePage === 'experiment') {
    return null;
  }

  return (
    <div 
      className="my-6 w-full max-w-7xl mx-auto rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-4 sm:p-5 shadow-lg relative overflow-hidden transition-all duration-300"
      aria-label={t('ads.sponsored')}
    >
      {/* Decorative ambient background */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
        {/* Left Side: Badge & Info */}
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-cyan-400 border border-slate-700">
                {t('ads.sponsored')}
              </span>
              <span className="text-xs font-semibold text-slate-300">
                {t('ads.educationalPartner')}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('ads.nonIntrusiveNotice')}
            </p>
          </div>
        </div>

        {/* Right Side: Action & Close Button */}
        <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
          <a
            href="https://ai.studio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-medium border border-slate-700 transition-colors cursor-pointer min-h-[44px]"
          >
            <span>Google AI Studio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Explicit Close / Dismiss Button */}
          <button
            onClick={dismissAd}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center border border-slate-700/60"
            aria-label={t('ads.close')}
            title={t('ads.close')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
