import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Experiment } from '../../types/experiment';
import { SimulationEngineFactory } from '../../simulations/engineFactory';
import { SimulationCanvas } from './SimulationCanvas';
import { ControlPanel } from './ControlPanel';
import { RealtimeGraph } from './RealtimeGraph';
import { useTranslation } from '../../i18n/useTranslation';

export interface ExperimentViewProps {
  experiment: Experiment;
  lang?: 'ar' | 'en' | 'ku' | 'kmr' | 'bad';
  onLogToNotebook?: () => void;
}

export const ExperimentView: React.FC<ExperimentViewProps> = ({
  experiment,
  lang = 'ar',
  onLogToNotebook,
}) => {
  const { language } = useTranslation();
  const currentLang = lang || (language as 'ar' | 'en' | 'ku' | 'kmr' | 'bad') || 'ar';

  // Compute default parameters from experiment schema
  const defaultParams = useMemo(() => {
    const map: Record<string, number> = {};
    if (experiment.parameters) {
      experiment.parameters.forEach((p) => {
        map[p.id] = p.defaultValue;
      });
    }
    return map;
  }, [experiment]);

  const [params, setParams] = useState<Record<string, number>>(defaultParams);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [liveOutputs, setLiveOutputs] = useState<Record<string, number>>({});
  const [, setTick] = useState<number>(0);

  const handleOutputsUpdate = useCallback((newOutputs: Record<string, number>) => {
    if (!newOutputs) return;
    setLiveOutputs((prev) => {
      const prevKeys = Object.keys(prev);
      const newKeys = Object.keys(newOutputs);
      if (prevKeys.length === newKeys.length) {
        let isSame = true;
        for (const k of newKeys) {
          if (prev[k] !== newOutputs[k]) {
            isSame = false;
            break;
          }
        }
        if (isSame) return prev;
      }
      return { ...prev, ...newOutputs };
    });
  }, []);

  // Sync state when experiment changes
  useEffect(() => {
    setParams(defaultParams);
    setIsRunning(false);
    setTime(0);
  }, [experiment.id]);

  // Instantiate proper simulation engine
  const engine = useMemo(() => {
    const eng = SimulationEngineFactory.createEngine(experiment, defaultParams);
    eng.pause();
    return eng;
  }, [experiment.id]);

  // Animation frame loop
  useEffect(() => {
    let animId: number;
    let lastT = performance.now();

    const loop = (now: number) => {
      const dt = (now - lastT) / 1000;
      lastT = now;

      if (isRunning) {
        setTime((t) => t + dt);
        setTick((tick) => tick + 1);
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isRunning]);

  const handleStart = useCallback(() => {
    engine.start();
    setIsRunning(true);
  }, [engine]);

  const handlePause = useCallback(() => {
    engine.pause();
    setIsRunning(false);
  }, [engine]);

  const handleReset = useCallback(() => {
    engine.reset();
    setIsRunning(false);
    setTime(0);
    setTick((t) => t + 1);
  }, [engine]);

  const handleParamChange = useCallback((paramId: string, value: number) => {
    setParams((prev) => {
      const updated = { ...prev, [paramId]: value };
      engine.updateParams(updated);
      return updated;
    });
    setTick((t) => t + 1);
  }, [engine]);

  // Extract dynamic physical state outputs from engine
  const engineState = engine.getState();
  const engineData = { ...(engineState.data || {}), ...liveOutputs };

  const outputs = useMemo(() => {
    const res: Record<string, number> = {};
    // Merge engine state data
    Object.entries(engineData).forEach(([k, v]) => {
      if (typeof v === 'number') {
        res[k] = v;
      }
    });

    // Merge matching experiment outputMetrics
    if (experiment.outputMetrics) {
      experiment.outputMetrics.forEach((metric) => {
        if (res[metric.id] === undefined) {
          const matchedVal =
            engineData[metric.id] ??
            engineData[metric.symbol] ??
            engineData[metric.id.toLowerCase()] ??
            (metric.id === 'out1' ? engineData.lensPower ?? engineData.refractedAngle ?? engineData.coulombForce ?? engineData.frictionForce ?? 0 : 0);
          if (typeof matchedVal === 'number') {
            res[metric.id] = matchedVal;
          }
        }
      });
    }

    return res;
  }, [engineData, experiment.outputMetrics]);

  // Primary metric value for RealtimeGraph
  const primaryGraphMetric = useMemo(() => {
    if (experiment.outputMetrics && experiment.outputMetrics.length > 0) {
      const m0 = experiment.outputMetrics[0];
      const val = outputs[m0.id] ?? 0;
      const labelStr =
        typeof m0.label === 'object'
          ? m0.label[currentLang] || m0.label.en || m0.id
          : m0.label || m0.id;
      return {
        id: m0.id,
        label: labelStr,
        symbol: m0.symbol || 'Y',
        value: val,
        unit: m0.unit,
      };
    }
    return {
      id: 'primary',
      label: 'Output Metric',
      symbol: 'Y',
      value: typeof engineData.out1 === 'number' ? engineData.out1 : 0,
      unit: '',
    };
  }, [experiment.outputMetrics, outputs, currentLang, engineData]);

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Simulation Canvas Viewport (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-xl space-y-3">
            <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
              <SimulationCanvas
                experiment={experiment}
                params={params}
                isRunning={isRunning}
                engine={engine}
                parameters={params}
                onOutputsUpdate={handleOutputsUpdate}
                className="h-[320px] sm:h-[380px] md:h-[440px] w-full"
              />
            </div>

            {/* Start / Pause / Reset Bar */}
            <div className="flex items-center gap-2 p-2 bg-slate-950/80 rounded-xl border border-slate-800">
              {!isRunning ? (
                <button
                  type="button"
                  onClick={handleStart}
                  className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-600/20"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  <span>{currentLang === 'ar' ? 'تشغيل' : 'START'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePause}
                  className="flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                  <span>{currentLang === 'ar' ? 'إيقاف مؤقت' : 'PAUSE'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleReset}
                className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-sm rounded-xl border border-slate-700 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{currentLang === 'ar' ? 'إعادة ضبط' : 'RESET'}</span>
              </button>
            </div>
          </div>

          {/* Realtime Graph */}
          <RealtimeGraph
            time={time}
            value={primaryGraphMetric.value}
            label={primaryGraphMetric.label}
            unit={primaryGraphMetric.unit}
            isRunning={isRunning}
          />
        </div>

        {/* Dynamic Control Panel (5 Cols) */}
        <div className="lg:col-span-5">
          <ControlPanel
            experiment={experiment}
            currentParams={params}
            onParamChange={handleParamChange}
            lang={currentLang}
            outputs={outputs}
            onLogToNotebook={onLogToNotebook}
            isRunning={isRunning}
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
          />
        </div>
      </div>
    </div>
  );
};

export default ExperimentView;
