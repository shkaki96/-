import React from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { Card } from '../ui/Card';
import { Activity } from 'lucide-react';

export interface MetricsGridProps {
  period?: number;
  frequency?: number;
  angle?: number;
  time?: number;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({
  period = 0,
  frequency = 0,
  angle = 0,
  time = 0,
}) => {
  const { t } = useTranslation();

  const angleDegrees = ((angle * 180) / Math.PI).toFixed(1);

  return (
    <Card variant="default" padding="sm" className="space-y-3">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <Activity className="w-4 h-4 text-cyan-400" />
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          {t('simulation.realTimeMetrics')}
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1">
          <span className="text-[10px] text-slate-400 font-medium block">
            {t('simulation.results')} (T)
          </span>
          <span className="text-sm sm:text-base font-bold font-mono text-cyan-400">
            {period} s
          </span>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1">
          <span className="text-[10px] text-slate-400 font-medium block">
            {t('simulation.results')} (f)
          </span>
          <span className="text-sm sm:text-base font-bold font-mono text-cyan-400">
            {frequency} Hz
          </span>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1">
          <span className="text-[10px] text-slate-400 font-medium block">
            θ
          </span>
          <span className="text-sm sm:text-base font-bold font-mono text-cyan-400">
            {angleDegrees}°
          </span>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1">
          <span className="text-[10px] text-slate-400 font-medium block">
            t
          </span>
          <span className="text-sm sm:text-base font-bold font-mono text-cyan-400">
            {time.toFixed(1)} s
          </span>
        </div>
      </div>
    </Card>
  );
};
