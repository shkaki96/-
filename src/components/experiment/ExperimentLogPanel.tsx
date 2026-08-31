import React, { useState } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { Card } from '../ui/Card';
import {
  History,
  PlusCircle,
  Trash2,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  ArrowRightLeft,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Experiment } from '../../types/experiment';

export interface TrialRecord {
  id: string;
  trialNumber: number;
  timestamp: string;
  params: Record<string, number | string>;
  measurements: Record<string, number | string>;
  resultSummary: string;
}

export interface ExperimentLogPanelProps {
  experiment: Experiment;
  currentParams: Record<string, number>;
  liveOutputs: Record<string, number | string>;
  elapsedTime: number;
  onOpenNotebook?: () => void;
}

export const ExperimentLogPanel: React.FC<ExperimentLogPanelProps> = ({
  experiment,
  currentParams,
  liveOutputs,
  elapsedTime,
  onOpenNotebook,
}) => {
  const { language, getLocalizedText } = useTranslation();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [trials, setTrials] = useState<TrialRecord[]>([]);

  const loc = (texts: { ar: string; en: string; ku: string; kmr: string; bad: string }): string => {
    if (language === 'bad') return texts.bad;
    if (language === 'ku') return texts.ku;
    if (language === 'kmr') return texts.kmr;
    if (language === 'ar') return texts.ar;
    return texts.en;
  };

  const handleRecordTrial = () => {
    // Generate human-friendly result summary string
    const summaryParts: string[] = [];
    if (liveOutputs.period !== undefined) summaryParts.push(`T = ${liveOutputs.period} s`);
    if (liveOutputs.range !== undefined) summaryParts.push(`R = ${liveOutputs.range} m`);
    if (liveOutputs.current !== undefined) summaryParts.push(`I = ${liveOutputs.current} A`);
    if (liveOutputs.restoringForce !== undefined) summaryParts.push(`F = ${liveOutputs.restoringForce} N`);
    if (liveOutputs.stoppingVoltage !== undefined) summaryParts.push(`V₀ = ${liveOutputs.stoppingVoltage} V`);
    if (liveOutputs.fringeSpacing !== undefined) summaryParts.push(`Δy = ${liveOutputs.fringeSpacing} mm`);

    const newTrial: TrialRecord = {
      id: `trial-${Date.now()}`,
      trialNumber: trials.length + 1,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      params: { ...currentParams },
      measurements: { ...liveOutputs, t: elapsedTime.toFixed(2) },
      resultSummary: summaryParts.length > 0 ? summaryParts.join(' | ') : `t = ${elapsedTime.toFixed(2)} s`,
    };

    setTrials((prev) => [...prev, newTrial]);
  };

  const handleDeleteTrial = (id: string) => {
    setTrials((prev) => prev.filter((t) => t.id !== id));
  };

  const handleClearAll = () => {
    setTrials([]);
  };

  return (
    <Card variant="default" padding="md" className="space-y-3">
      {/* Header bar with toggle */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            {loc({
              ar: 'سجل المحاولات والمقارنة العلمية',
              bad: 'تۆمارا تاقیکرنان و هەڤبەرکرنا زانستی',
              ku: 'تۆماری تاقیکردنەوەکان و بەراوردکاری',
              kmr: 'Tomara Ceribandinan û Berawirdkirina Zanistî',
              en: 'Experiment Trials Log & Scientific Comparison',
            })}
          </h3>
          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
            {trials.length}{' '}
            {loc({
              ar: 'محاولات',
              bad: 'تاقیکرن',
              ku: 'تاقیکردنەوە',
              kmr: 'ceribandin',
              en: 'trials',
            })}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRecordTrial}
            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-emerald-900/30"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>
              {loc({
                ar: 'تسجيل المحاولة الحالية',
                bad: 'تۆمارکرنا ڤێ تاقیکرنێ',
                ku: 'تۆمارکردنی ئەم تاقیکردنەوەیە',
                kmr: 'Tomarkirina Ceribandina Niha',
                en: 'Record Current Trial',
              })}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle Trials Panel"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-3 pt-1">
          {trials.length === 0 ? (
            <div className="text-center py-6 px-4 bg-slate-950/60 rounded-xl border border-dashed border-slate-800/80 space-y-2">
              <FileSpreadsheet className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400 font-medium">
                {loc({
                  ar: 'لم يتم تسجيل أي محاولات بعد. غيّر قيم المدخلات واضغط "تسجيل المحاولة الحالية" لمقارنة النتائج واكتشاف القانون الفيزيائي.',
                  bad: 'چ تاقیکرن نەهاتینە تۆمارکرن. بهایێن پێکئینەران بگوهۆڕە و دابگرە "تۆمارکرنا ڤێ تاقیکرنێ" دا کو ئەنجامان هەڤبەر بکەی.',
                  ku: 'هیچ تاقیکردنەوەیەک تۆمار نەکراوە. گۆڕانکاری لە بەهاکان بکە و دابگرە "تۆمارکردنی ئەم تاقیکردنەوەیە" بۆ بەراوردکردن.',
                  kmr: 'Hîç ceribandinek nehatiye tomarkirin. Nirxan biguhêre û tomar bike.',
                  en: 'No trials recorded yet. Adjust input variables and click "Record Current Trial" to compare how results change.',
                })}
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {/* Comparative Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/90 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">#</th>
                      <th className="py-2.5 px-3 font-semibold">
                        {loc({ ar: 'الوقت', bad: 'دەم', ku: 'کات', kmr: 'Dem', en: 'Time' })}
                      </th>
                      <th className="py-2.5 px-3 font-semibold">
                        {loc({ ar: 'المدخلات المضبوطة (Inputs)', bad: 'پێکئینەر (Inputs)', ku: 'تێکراوەکان', kmr: 'Têketin', en: 'Inputs' })}
                      </th>
                      <th className="py-2.5 px-3 font-semibold">
                        {loc({ ar: 'النتيجة الرئيسية (Result)', bad: 'ئەنجام (Result)', ku: 'ئەنجام', kmr: 'Encam', en: 'Result' })}
                      </th>
                      <th className="py-2.5 px-2 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {trials.map((trial) => (
                      <tr key={trial.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-2.5 px-3 text-emerald-400 font-bold">
                          #{trial.trialNumber}
                        </td>
                        <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                          {trial.timestamp}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex flex-wrap gap-1.5">
                            {Object.entries(trial.params).map(([k, v]) => (
                              <span
                                key={k}
                                className="bg-slate-900 px-1.5 py-0.5 rounded text-[11px] text-amber-300 border border-amber-500/20"
                              >
                                {k}: {v}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-cyan-300 font-bold">
                          {trial.resultSummary}
                        </td>
                        <td className="py-2.5 px-2 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteTrial(trial.id)}
                            className="p-1 text-slate-500 hover:text-red-400 hover:bg-red-950/40 rounded transition-colors cursor-pointer"
                            title="Delete trial"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Action Bar for Trials */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs text-slate-500 hover:text-red-400 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>
                    {loc({
                      ar: 'مسح جميع المحاولات',
                      bad: 'ژێبرنا هەمی تاقیکرنان',
                      ku: 'سڕینەوەی هەموو تاقیکردنەوەکان',
                      kmr: 'Paqijkirina hemû ceribandinan',
                      en: 'Clear All Trials',
                    })}
                  </span>
                </button>

                {onOpenNotebook && (
                  <button
                    type="button"
                    onClick={onOpenNotebook}
                    className="text-xs text-sky-400 hover:text-sky-300 transition-colors cursor-pointer flex items-center gap-1 font-medium"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>
                      {loc({
                        ar: 'فتح دفتر المختبر للتحليل الكامل',
                        bad: 'ڤەکرنا دەفتەرا تاقیگەهێ بۆ شیکاریا تەمام',
                        ku: 'کردنەوەی دەفتەری تاقیگە بۆ شیکاری',
                        kmr: 'Vekirina lênûska ceribandinê ji bo analîzê',
                        en: 'Open Lab Notebook for Full Analysis',
                      })}
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
