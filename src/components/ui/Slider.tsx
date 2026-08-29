import React from 'react';

export interface SliderProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export const Slider: React.FC<SliderProps> = ({
  id,
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-2 py-1">
      <div className="flex items-center justify-between text-xs sm:text-sm">
        <label htmlFor={id} className="text-slate-200 font-medium cursor-pointer select-none">
          {label}
        </label>
        <span className="font-mono text-cyan-400 font-bold bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20 text-xs sm:text-sm">
          {value} {unit}
        </span>
      </div>
      <div className="relative flex items-center min-h-[44px]">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full accent-cyan-400 bg-slate-800 h-2.5 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500/40 disabled:opacity-50"
          aria-label={`${label}: ${value} ${unit}`}
        />
      </div>
      <div className="flex justify-between text-[10px] text-slate-500 font-mono px-0.5">
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>
    </div>
  );
};
