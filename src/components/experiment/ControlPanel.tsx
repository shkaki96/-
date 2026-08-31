import React from 'react';
import { Experiment, ParameterSchema } from '../../types/experiment';

export interface ControlPanelProps {
  experiment?: Experiment;
  currentParams?: Record<string, number>;
  onParamChange?: (paramId: string, value: number) => void;
  lang?: 'ar' | 'en' | 'ku' | 'kmr' | 'bad' | string;
  outputs?: Record<string, number>;
  onLogToNotebook?: () => void;
  // Legacy / Direct schema props support for backwards compatibility
  parametersSchema?: ParameterSchema[];
  values?: Record<string, number>;
  onChange?: (key: string, value: number) => void;
  isRunning?: boolean;
  simulationStatus?: 'READY' | 'RUNNING' | 'PAUSED';
  onStart?: () => void;
  onPause?: () => void;
  onReset?: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  experiment,
  currentParams,
  onParamChange,
  lang = 'ar',
  outputs = {},
  onLogToNotebook,
  parametersSchema,
  values,
  onChange,
  isRunning,
  onStart,
  onPause,
  onReset,
}) => {
  // Extract parameters with priority given to experiment definition
  const parameters = experiment?.parameters || parametersSchema || [];
  const effectiveParams = currentParams || values || {};

  const handleUpdate = (paramId: string, val: number) => {
    if (onParamChange) {
      onParamChange(paramId, val);
    }
    if (onChange) {
      onChange(paramId, val);
    }
  };

  const palette = ['#a855f7', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'];
  const normLang = (lang as 'ar' | 'en' | 'ku' | 'kmr' | 'bad') || 'ar';

  return (
    <div className="w-full space-y-4 font-sans text-slate-100">
      {/* 1. Component Settings Card */}
      <div className="p-5 bg-[#0b0f19] rounded-2xl border border-slate-800/80 shadow-xl space-y-5">
        <div className="flex justify-between items-center border-b border-slate-800/60 pb-3">
          <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
            {normLang === 'ar' && 'إعدادات مكونات التجربة'}
            {normLang === 'en' && 'COMPONENT SETTINGS'}
            {normLang === 'ku' && 'ڕێکخستنی پێکهاتەکان'}
            {normLang === 'kmr' && 'Sazkirina Beşan'}
            {normLang === 'bad' && 'ڕێکخستنا پشكان'}
          </h3>
          <span className="text-xs font-mono bg-sky-950/80 text-sky-400 border border-sky-800/50 px-2.5 py-0.5 rounded-full font-bold">
            Exp #{experiment?.codeNumber || 1}
          </span>
        </div>

        {/* Simulation Play/Pause Controls if provided */}
        {(onStart || onPause || onReset) && (
          <div className="grid grid-cols-2 gap-2 pb-1">
            {!isRunning ? (
              <button
                type="button"
                onClick={onStart}
                className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-900/30"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span>{normLang === 'ar' ? 'تشغيل' : 'Start'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onPause}
                className="py-2 px-3 bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-amber-900/30"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
                <span>{normLang === 'ar' ? 'إيقاف مؤقت' : 'Pause'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onReset}
              className="py-2 px-3 bg-slate-800/90 hover:bg-slate-700 active:scale-[0.99] text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-slate-700/80 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{normLang === 'ar' ? 'إعادة ضبط' : 'Reset'}</span>
            </button>
          </div>
        )}

        {/* Dynamic Sliders - NO MORE "unit 50" FALLBACK */}
        <div className="space-y-4">
          {parameters.length > 0 ? (
            parameters.map((param, index) => {
              const currentValue = effectiveParams[param.id] ?? param.defaultValue;
              const labelText =
                typeof param.label === 'object'
                  ? param.label[normLang] || param.label.en || param.label.ar || param.id
                  : param.label || param.id;
              const accentColor = palette[index % palette.length];

              return (
                <div key={param.id} className="space-y-2 bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-slate-300">
                      {labelText} {param.symbol ? `(${param.symbol})` : ''}
                    </span>
                    <span className="font-mono font-bold text-sm" style={{ color: accentColor }}>
                      {currentValue} {param.unit}
                    </span>
                  </div>

                  <input
                    type="range"
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    value={currentValue}
                    onChange={(e) => handleUpdate(param.id, parseFloat(e.target.value))}
                    style={{ accentColor: accentColor }}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              );
            })
          ) : (
            <div className="text-xs text-slate-500 text-center py-2">
              {normLang === 'ar' ? 'جاري تحميل معاملات التجربة...' : 'Loading experiment parameters...'}
            </div>
          )}
        </div>

        {/* 2. Live Physics Calculations & Output Readout Box */}
        {experiment?.outputMetrics && experiment.outputMetrics.length > 0 && (
          <div className="p-4 bg-[#050811] rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex items-center space-x-2 text-sky-400 text-xs font-semibold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>
                {normLang === 'ar' && 'الحسابات المباشرة والنتائج:'}
                {normLang === 'en' && 'Live Calculations:'}
                {normLang === 'ku' && 'ژماردنە ڕاستەوخۆکان:'}
                {normLang === 'kmr' && 'Hesabkirinên Zindî:'}
                {normLang === 'bad' && 'هژمارتنێن ئێکسەر:'}
              </span>
            </div>

            <div className="font-mono text-xs space-y-1.5 pt-1">
              {experiment.outputMetrics.map((metric) => {
                const outputVal = outputs[metric.id] ?? 0;
                const metricLabel =
                  typeof metric.label === 'object'
                    ? metric.label[normLang] || metric.label.en || metric.label.ar || metric.id
                    : metric.label || metric.id;
                
                return (
                  <div key={metric.id} className="flex justify-between items-center bg-slate-900/80 px-3 py-1.5 rounded border border-slate-800/40">
                    <span className="text-slate-400">{metricLabel} ({metric.symbol || metric.id}):</span>
                    <span className="text-sky-300 font-bold">
                      {typeof outputVal === 'number' ? outputVal.toFixed(2) : outputVal} {metric.unit}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. Action Button: Log to Notebook */}
      <button
        type="button"
        onClick={onLogToNotebook}
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 active:scale-[0.99] rounded-xl font-semibold text-white shadow-lg shadow-blue-600/20 flex items-center justify-center space-x-2 transition-all cursor-pointer"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        <span>
          {normLang === 'ar' && 'حفظ النتائج في دفتر المختبر'}
          {normLang === 'en' && 'Log to Lab Notebook'}
          {normLang === 'ku' && 'تۆمارکردنی ئەنجام لە دەفتەری تاقیگە'}
          {normLang === 'kmr' && 'Tomarkirina encaman di lênûska ezmûnê de'}
          {normLang === 'bad' && 'تۆمارکرنا ئەنجامان ل دەفتەرا تاقیگەهێ'}
        </span>
      </button>

      {/* 4. Theory & Law Summary Card */}
      <div className="p-4 bg-[#0b0f19] rounded-xl border border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-950/80 text-indigo-400 rounded-lg border border-indigo-800/40">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              {normLang === 'ar' && 'القانون الفيزيائي والنظرية'}
              {normLang === 'en' && 'Scientific Theory & Physical Law'}
              {normLang === 'ku' && 'یاسای فیزیکی و تیۆری'}
              {normLang === 'kmr' && 'Qanûna Fîzîkî û Teorî'}
              {normLang === 'bad' && 'یاسایا فیزیکی و تیۆری'}
            </h4>
            <p className="text-sm font-mono text-sky-400 font-semibold mt-0.5">{experiment?.physicalLaw}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
