import React, { useState, useEffect } from 'react';
import { ParameterSchema } from '../../types/experiment';
import { useTranslation } from '../../i18n/useTranslation';
import { Sliders, Play, Pause, RotateCcw, Plus, Minus, Activity } from 'lucide-react';
import { Card } from '../ui/Card';

export interface ControlPanelProps<TParams> {
  parametersSchema: ParameterSchema[];
  values: TParams;
  onChange: (key: keyof TParams, value: number) => void;
  isRunning: boolean;
  simulationStatus?: 'READY' | 'RUNNING' | 'PAUSED';
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

interface ParameterControlRowProps {
  param: ParameterSchema;
  value: number;
  onChange: (value: number) => void;
  getLocalizedText: (text: Record<string, string> | string) => string;
}

const ParameterControlRow: React.FC<ParameterControlRowProps> = ({
  param,
  value,
  onChange,
  getLocalizedText,
}) => {
  const [localInput, setLocalInput] = useState<string>(String(value));

  // Keep local input field in sync with external value updates (e.g., slider drag, step button, reset)
  useEffect(() => {
    setLocalInput(String(value));
  }, [value]);

  const paramName = getLocalizedText(param.label);

  const clampAndFormat = (val: number): number => {
    if (isNaN(val)) return param.defaultValue;
    const clamped = Math.min(param.max, Math.max(param.min, val));
    // Determine precision steps (e.g. 0.01 -> 2 decimal places)
    const stepDecimals = (param.step.toString().split('.')[1] || '').length;
    const precision = Math.max(stepDecimals, 2);
    return parseFloat(clamped.toFixed(precision));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = parseFloat(e.target.value);
    const validVal = clampAndFormat(rawVal);
    setLocalInput(String(validVal));
    onChange(validVal);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setLocalInput(text);

    const parsed = parseFloat(text);
    if (!isNaN(parsed)) {
      const validVal = clampAndFormat(parsed);
      onChange(validVal);
    }
  };

  const handleInputBlur = () => {
    const parsed = parseFloat(localInput);
    const validVal = clampAndFormat(parsed);
    setLocalInput(String(validVal));
    onChange(validVal);
  };

  const handleStep = (delta: number) => {
    const nextVal = clampAndFormat(value + delta);
    setLocalInput(String(nextVal));
    onChange(nextVal);
  };

  return (
    <div className="space-y-3 bg-slate-950/80 p-3 sm:p-3.5 rounded-2xl border border-slate-800 shadow-inner">
      {/* Parameter Header & Direct Numeric Input: Label -> [ Input ] Unit */}
      <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
        <label htmlFor={`param-input-${param.id}`} className="text-slate-100 font-bold tracking-wide select-none">
          {paramName}
        </label>

        {/* Two-Way Numeric Input Container */}
        <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-xl border border-cyan-500/40 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/30 transition-all">
          <input
            id={`param-input-${param.id}`}
            type="number"
            min={param.min}
            max={param.max}
            step={param.step}
            value={localInput}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className="w-16 sm:w-20 bg-transparent text-right font-mono font-bold text-cyan-300 text-xs sm:text-sm focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            aria-label={`${paramName} numeric value`}
          />
          <span className="text-xs font-mono font-bold text-cyan-500">{param.unit}</span>
        </div>
      </div>

      {/* Touch-Friendly Slider & Stepper Controls */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => handleStep(-param.step)}
          disabled={value <= param.min}
          className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-700/80 cursor-pointer disabled:cursor-not-allowed min-h-[44px] min-w-[44px] flex items-center justify-center font-bold transition-all active:scale-95 shadow-sm shrink-0"
          aria-label={`Decrease ${paramName}`}
          title={`Decrease ${paramName} (-${param.step})`}
        >
          <Minus className="w-4 h-4 text-cyan-400" />
        </button>

        <div className="relative flex-1 flex items-center min-h-[44px]">
          <input
            type="range"
            min={param.min}
            max={param.max}
            step={param.step}
            value={value}
            onChange={handleSliderChange}
            className="w-full accent-cyan-400 bg-slate-800 h-2.5 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500/50 touch-none"
            aria-label={`${paramName} slider: ${value} ${param.unit}`}
          />
        </div>

        <button
          type="button"
          onClick={() => handleStep(param.step)}
          disabled={value >= param.max}
          className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-700/80 cursor-pointer disabled:cursor-not-allowed min-h-[44px] min-w-[44px] flex items-center justify-center font-bold transition-all active:scale-95 shadow-sm shrink-0"
          aria-label={`Increase ${paramName}`}
          title={`Increase ${paramName} (+${param.step})`}
        >
          <Plus className="w-4 h-4 text-cyan-400" />
        </button>
      </div>

      {/* Bounds & Step Information */}
      <div className="flex justify-between text-[11px] font-mono text-slate-400 px-1 pt-0.5 border-t border-slate-900">
        <span>Min: <strong className="text-slate-300">{param.min}</strong> {param.unit}</span>
        <span>Step: <strong className="text-slate-300">{param.step}</strong></span>
        <span>Max: <strong className="text-slate-300">{param.max}</strong> {param.unit}</span>
      </div>
    </div>
  );
};

export function ControlPanel<TParams extends Record<string, number>>({
  parametersSchema,
  values,
  onChange,
  isRunning,
  simulationStatus,
  onStart,
  onPause,
  onReset,
}: ControlPanelProps<TParams>) {
  const { t, getLocalizedText } = useTranslation();

  // Determine current active status label
  const statusKey = simulationStatus
    ? simulationStatus
    : isRunning
    ? 'RUNNING'
    : 'READY';

  const statusBadgeStyle =
    statusKey === 'RUNNING'
      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
      : statusKey === 'PAUSED'
      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
      : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';

  const statusLabelText =
    statusKey === 'RUNNING'
      ? t('simulation.stateRunning') || 'RUNNING'
      : statusKey === 'PAUSED'
      ? t('simulation.statePaused') || 'PAUSED'
      : t('simulation.stateReady') || 'READY';

  return (
    <Card variant="elevated" padding="md" className="space-y-4">
      {/* Panel Header & Simulation State Badge */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4.5 h-4.5 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-100">
            {t('simulation.controls')} & {t('simulation.parameters')}
          </h3>
        </div>

        {/* Simulation State Badge */}
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-bold ${statusBadgeStyle}`}>
          <span
            className={`w-2 h-2 rounded-full ${
              statusKey === 'RUNNING'
                ? 'bg-emerald-400 animate-ping'
                : statusKey === 'PAUSED'
                ? 'bg-amber-400'
                : 'bg-cyan-400'
            }`}
          />
          <span>{statusLabelText}</span>
        </div>
      </div>

      {/* Button Group: START / PAUSE / RESET */}
      <div className="grid grid-cols-2 gap-2.5">
        {!isRunning ? (
          <button
            type="button"
            onClick={onStart}
            className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px] shadow-lg shadow-emerald-600/20 active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{t('simulation.start') || 'START'}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onPause}
            className="py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px] shadow-lg shadow-amber-500/20 active:scale-95"
          >
            <Pause className="w-4 h-4 fill-current" />
            <span>{t('simulation.pause') || 'PAUSED'}</span>
          </button>
        )}

        <button
          type="button"
          onClick={onReset}
          className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs sm:text-sm rounded-xl border border-slate-700 transition-all cursor-pointer min-h-[44px] flex items-center justify-center gap-2 active:scale-95"
        >
          <RotateCcw className="w-4 h-4 text-slate-300" />
          <span>{t('simulation.reset') || 'RESET'}</span>
        </button>
      </div>

      {/* Interactive Two-Way Parameter Controls List */}
      <div className="space-y-3.5">
        {parametersSchema.map((param) => {
          const currentValue = values[param.id as keyof TParams] ?? param.defaultValue;

          return (
            <ParameterControlRow
              key={param.id}
              param={param}
              value={currentValue}
              onChange={(newVal) => onChange(param.id as keyof TParams, newVal)}
              getLocalizedText={getLocalizedText}
            />
          );
        })}
      </div>
    </Card>
  );
}
