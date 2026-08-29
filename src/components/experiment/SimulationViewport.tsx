import React from 'react';
import { ISimulationEngine } from '../../types/simulation';
import { SimulationCanvas } from '../../simulations/core/SimulationCanvas';
import { useTranslation } from '../../i18n/useTranslation';
import { Button } from '../ui/Button';
import { Play, Pause, RotateCcw, Activity } from 'lucide-react';

export interface SimulationViewportProps<TParams extends Record<string, number>> {
  engine: ISimulationEngine<TParams, Record<string, unknown>>;
  parameters: TParams;
  isRunning: boolean;
  simulationStatus?: 'READY' | 'RUNNING' | 'PAUSED';
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  physicalLaw: string;
}

export function SimulationViewport<TParams extends Record<string, number>>({
  engine,
  parameters,
  isRunning,
  simulationStatus,
  onStart,
  onPause,
  onReset,
  physicalLaw,
}: SimulationViewportProps<TParams>) {
  const { t } = useTranslation();

  const statusKey = simulationStatus
    ? simulationStatus
    : isRunning
    ? 'RUNNING'
    : 'READY';

  const statusText =
    statusKey === 'RUNNING'
      ? t('simulation.stateRunning') || 'RUNNING'
      : statusKey === 'PAUSED'
      ? t('simulation.statePaused') || 'PAUSED'
      : t('simulation.stateReady') || 'READY';

  return (
    <div className="bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-800 shadow-xl space-y-3.5">
      {/* Simulation Dedicated Stage */}
      <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800/80 shadow-inner">
        <SimulationCanvas engine={engine} parameters={parameters} className="h-[280px] sm:h-[360px] md:h-[420px] w-full" />
        
        {/* Status Indicator Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2 bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-full border border-slate-700/80 text-xs font-mono font-bold text-slate-200 shadow-md select-none">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              statusKey === 'RUNNING'
                ? 'bg-emerald-400 animate-ping'
                : statusKey === 'PAUSED'
                ? 'bg-amber-400'
                : 'bg-cyan-400'
            }`}
          />
          <span>{statusText}</span>
        </div>

        {/* Physical Formula Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-full bg-slate-900/90 backdrop-blur border border-slate-700/80 text-cyan-400 font-bold shadow-md select-none">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>{physicalLaw}</span>
        </div>
      </div>

      {/* Primary Action Button Group (START / PAUSE / RESET) */}
      <div className="flex items-center justify-between gap-2.5 p-2.5 bg-slate-950/80 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2.5 w-full">
          {!isRunning ? (
            <button
              type="button"
              onClick={onStart}
              className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px] shadow-lg shadow-emerald-600/20 active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{t('simulation.start') || 'START'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onPause}
              className="flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px] shadow-lg shadow-amber-500/20 active:scale-95"
            >
              <Pause className="w-4 h-4 fill-current" />
              <span>{t('simulation.pause') || 'PAUSED'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onReset}
            className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs sm:text-sm rounded-xl border border-slate-700 transition-all cursor-pointer min-h-[44px] flex items-center justify-center gap-2 active:scale-95"
          >
            <RotateCcw className="w-4 h-4 text-slate-300" />
            <span>{t('simulation.reset') || 'RESET'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
