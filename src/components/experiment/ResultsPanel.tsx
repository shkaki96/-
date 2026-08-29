import React from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { Card } from '../ui/Card';
import { Activity, ArrowRightLeft, Cpu, Download, Printer } from 'lucide-react';
import { exportToCSV, exportToPrintableReport } from '../../utils/dataExport';

interface ParameterInputDisplay {
  label: string;
  value: number;
  unit: string;
}

interface CalculatedOutputDisplay {
  label: string;
  symbol: string;
  value: string | number;
  unit: string;
  highlight?: boolean;
}

export interface ResultsPanelProps {
  inputs: ParameterInputDisplay[];
  outputs: CalculatedOutputDisplay[];
  elapsedTime?: number;
  experimentTitle?: string;
  experimentId?: string;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  inputs,
  outputs,
  elapsedTime = 0,
  experimentTitle = 'Physics Experiment',
  experimentId = 'exp-01',
}) => {
  const { t, language } = useTranslation();

  const handleExportCSV = () => {
    const paramObj: Record<string, number> = {};
    inputs.forEach((inp) => {
      paramObj[inp.label] = inp.value;
    });

    const metricList = outputs.map((out, idx) => ({
      id: `m-${idx}`,
      name: `${out.label} (${out.symbol})`,
      value: out.value,
      unit: out.unit,
    }));

    exportToCSV({
      experimentId,
      experimentTitle,
      timestamp: new Date().toLocaleString(),
      parameters: paramObj,
      metrics: metricList,
      language,
    });
  };

  const handlePrintReport = () => {
    const paramObj: Record<string, number> = {};
    inputs.forEach((inp) => {
      paramObj[inp.label] = inp.value;
    });

    const metricList = outputs.map((out, idx) => ({
      id: `m-${idx}`,
      name: `${out.label} (${out.symbol})`,
      value: out.value,
      unit: out.unit,
    }));

    exportToPrintableReport({
      experimentId,
      experimentTitle,
      timestamp: new Date().toLocaleString(),
      parameters: paramObj,
      metrics: metricList,
      language,
    });
  };

  return (
    <Card variant="default" padding="md" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            {t('simulation.realTimeMetrics')}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30">
            t = {elapsedTime.toFixed(2)} s
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={handleExportCSV}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              title="Export CSV"
              aria-label="Export CSV"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handlePrintReport}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-purple-400 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              title="Print Lab Report / PDF"
              aria-label="Print Lab Report / PDF"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* INPUTS SECTION */}
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('experiment.inputs')}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {inputs.map((inp, idx) => (
              <div
                key={idx}
                className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800/80 space-y-0.5"
              >
                <span className="text-[10px] text-slate-400 font-medium block truncate">
                  {inp.label}
                </span>
                <span className="text-xs sm:text-sm font-bold font-mono text-amber-300 block">
                  {inp.value} {inp.unit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CALCULATED OUTPUTS SECTION */}
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t('experiment.outputs')}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {outputs.map((out, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-lg border space-y-0.5 transition-colors ${
                  out.highlight
                    ? 'bg-cyan-950/30 border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                    : 'bg-slate-900/90 border-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                  <span className="truncate">{out.label}</span>
                  <span className="font-mono text-cyan-400 font-bold">{out.symbol}</span>
                </div>
                <span className="text-xs sm:text-sm font-bold font-mono text-cyan-400 block">
                  {out.value} {out.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
