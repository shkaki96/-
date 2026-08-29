import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Activity, RefreshCw, BarChart2 } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';

export interface GraphMetricOption {
  id: string;
  label: string;
  symbol: string;
  value: number;
  unit: string;
  color?: string;
}

export interface RealtimeGraphProps {
  time: number;
  value?: number;
  label?: string;
  unit?: string;
  metrics?: GraphMetricOption[];
  isRunning: boolean;
  color?: string;
}

interface DataPoint {
  t: number;
  v: number;
}

export const RealtimeGraph: React.FC<RealtimeGraphProps> = ({
  time,
  value,
  label,
  unit,
  metrics,
  isRunning,
  color = '#38bdf8',
}) => {
  const { language, getLocalizedText } = useTranslation();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Available selectable metrics
  const availableMetrics = useMemo<GraphMetricOption[]>(() => {
    if (metrics && metrics.length > 0) {
      return metrics;
    }
    return [
      {
        id: 'primary',
        label: label || 'Primary Metric',
        symbol: 'Y',
        value: typeof value === 'number' ? value : 0,
        unit: unit || '',
        color: color,
      },
    ];
  }, [metrics, label, unit, value, color]);

  const [selectedMetricId, setSelectedMetricId] = useState<string>(
    availableMetrics[0]?.id || 'primary'
  );

  // Sync selected metric if available metrics change and current selection isn't present
  useEffect(() => {
    if (!availableMetrics.some((m) => m.id === selectedMetricId)) {
      setSelectedMetricId(availableMetrics[0]?.id || 'primary');
    }
  }, [availableMetrics, selectedMetricId]);

  const activeMetric = useMemo(() => {
    return (
      availableMetrics.find((m) => m.id === selectedMetricId) ||
      availableMetrics[0] || {
        id: 'primary',
        label: 'Metric',
        symbol: 'Y',
        value: 0,
        unit: '',
        color: color,
      }
    );
  }, [availableMetrics, selectedMetricId, color]);

  // Histories dictionary: { [metricId]: DataPoint[] }
  const historiesRef = useRef<Record<string, DataPoint[]>>({});
  const lastTimeRef = useRef<number>(-1);
  const [pointCount, setPointCount] = useState<number>(0);
  const [renderTrigger, setRenderTrigger] = useState<number>(0);

  // Clear data when time resets back to 0
  useEffect(() => {
    if (time <= 0.05 || time < lastTimeRef.current) {
      historiesRef.current = {};
      setPointCount(0);
      setRenderTrigger((prev) => prev + 1);
    }
    lastTimeRef.current = time;

    // Record samples for ALL active metrics when simulation is running or at t=0 initial point
    if (isRunning || time === 0) {
      let updatedCount = 0;
      availableMetrics.forEach((m) => {
        if (typeof m.value === 'number' && !isNaN(m.value)) {
          if (!historiesRef.current[m.id]) {
            historiesRef.current[m.id] = [];
          }
          const history = historiesRef.current[m.id];
          const lastPoint = history[history.length - 1];

          // Append point if time advanced or initial point
          if (!lastPoint || time > lastPoint.t) {
            history.push({ t: time, v: m.value });
            // Bounded memory window: max 300 samples
            if (history.length > 300) {
              history.shift();
            }
          }
          if (m.id === activeMetric.id) {
            updatedCount = history.length;
          }
        }
      });
      setPointCount(updatedCount);
    }
  }, [time, isRunning, availableMetrics, activeMetric.id]);

  // Handle Container ResizeObserver for fluid redrawing
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      setRenderTrigger((prev) => prev + 1);
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Render Live Canvas Graph
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    const width = rect.width || 300;
    const height = rect.height || 200;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.clearRect(0, 0, width, height);

    const history = historiesRef.current[activeMetric.id] || [];
    const activeColor = activeMetric.color || color || '#38bdf8';

    // Margins
    const marginLeft = 50;
    const marginRight = 20;
    const marginTop = 20;
    const marginBottom = 30;
    const plotWidth = width - marginLeft - marginRight;
    const plotHeight = height - marginTop - marginBottom;

    // Background Grid Lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);

    const numGridX = 5;
    const numGridY = 4;

    for (let i = 0; i <= numGridX; i++) {
      const x = marginLeft + (i / numGridX) * plotWidth;
      ctx.beginPath();
      ctx.moveTo(x, marginTop);
      ctx.lineTo(x, marginTop + plotHeight);
      ctx.stroke();
    }

    for (let j = 0; j <= numGridY; j++) {
      const y = marginTop + (j / numGridY) * plotHeight;
      ctx.beginPath();
      ctx.moveTo(marginLeft, y);
      ctx.lineTo(marginLeft + plotWidth, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Outer Axes Box
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(marginLeft, marginTop);
    ctx.lineTo(marginLeft, marginTop + plotHeight);
    ctx.lineTo(marginLeft + plotWidth, marginTop + plotHeight);
    ctx.stroke();

    // Plot Data Line if points exist
    if (history.length > 1) {
      // Find range of Y
      let minY = Infinity;
      let maxY = -Infinity;
      for (const p of history) {
        if (p.v < minY) minY = p.v;
        if (p.v > maxY) maxY = p.v;
      }

      // Add padding to Y range
      if (minY === maxY) {
        minY -= 1;
        maxY += 1;
      } else {
        const range = maxY - minY;
        minY -= range * 0.12;
        maxY += range * 0.12;
      }

      // Range of X
      const minX = history[0].t;
      const maxX = Math.max(history[history.length - 1].t, minX + 1);

      const getXPixel = (tVal: number) => {
        return marginLeft + ((tVal - minX) / (maxX - minX)) * plotWidth;
      };

      const getYPixel = (vVal: number) => {
        return marginTop + plotHeight - ((vVal - minY) / (maxY - minY)) * plotHeight;
      };

      // Zero Baseline Indicator line if range spans 0
      if (minY < 0 && maxY > 0) {
        const zeroY = getYPixel(0);
        ctx.strokeStyle = '#64748b66';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(marginLeft, zeroY);
        ctx.lineTo(marginLeft + plotWidth, zeroY);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Gradient Fill Under Line
      const grad = ctx.createLinearGradient(0, marginTop, 0, marginTop + plotHeight);
      grad.addColorStop(0, `${activeColor}40`);
      grad.addColorStop(1, `${activeColor}00`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(getXPixel(history[0].t), marginTop + plotHeight);
      for (let i = 0; i < history.length; i++) {
        ctx.lineTo(getXPixel(history[i].t), getYPixel(history[i].v));
      }
      ctx.lineTo(getXPixel(history[history.length - 1].t), marginTop + plotHeight);
      ctx.closePath();
      ctx.fill();

      // Draw Main Data Line
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i < history.length; i++) {
        const px = getXPixel(history[i].t);
        const py = getYPixel(history[i].v);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Glowing Current Head Marker
      const last = history[history.length - 1];
      const headX = getXPixel(last.t);
      const headY = getYPixel(last.v);

      ctx.fillStyle = activeColor;
      ctx.shadowColor = activeColor;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(headX, headY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Y-Axis Min/Max Labels
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(maxY.toFixed(1), marginLeft - 6, marginTop + 10);
      ctx.fillText(minY.toFixed(1), marginLeft - 6, marginTop + plotHeight);

      // X-Axis Time Labels
      ctx.textAlign = 'center';
      ctx.fillText(`${minX.toFixed(1)}s`, marginLeft, marginTop + plotHeight + 16);
      ctx.fillText(`${maxX.toFixed(1)}s`, marginLeft + plotWidth, marginTop + plotHeight + 16);
    } else {
      // Empty State Indicator when simulation hasn't started
      ctx.fillStyle = '#64748b';
      ctx.font = '12px system-ui, sans-serif';
      ctx.textAlign = 'center';
      const emptyMsg =
        language === 'ar'
          ? 'اضغط "ابدأ" لعرض الرسم البياني المباشر'
          : language === 'ku'
          ? 'دابگرە "دەستپێبکە" بۆ بینینی هێڵکاری'
          : language === 'kmr'
          ? 'Zextê li "Destpêkirin" bike ji bo dîtina grafîkê'
          : 'Press START to plot live experiment graph';
      ctx.fillText(emptyMsg, marginLeft + plotWidth / 2, marginTop + plotHeight / 2);

      // Draw static axis labels on empty graph
      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText('max', marginLeft - 6, marginTop + 10);
      ctx.fillText('min', marginLeft - 6, marginTop + plotHeight);
      ctx.textAlign = 'center';
      ctx.fillText('0.0s', marginLeft, marginTop + plotHeight + 16);
      ctx.fillText('t (s)', marginLeft + plotWidth, marginTop + plotHeight + 16);
    }
  }, [pointCount, activeMetric, color, renderTrigger, language]);

  const handleClear = () => {
    historiesRef.current = {};
    setPointCount(0);
    setRenderTrigger((prev) => prev + 1);
  };

  const timeLabel =
    language === 'ar'
      ? 'الزمن (ث)'
      : language === 'ku'
      ? 'کات (چ)'
      : language === 'kmr'
      ? 'Deman (s)'
      : 'Time (s)';

  return (
    <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 shadow-xl space-y-3">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            {activeMetric.label} {activeMetric.unit ? `(${activeMetric.unit})` : ''} vs {timeLabel}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
            {pointCount} pts
          </span>
          <button
            onClick={handleClear}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
            title="Clear Graph"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Selectable Variable Chips (if multiple physical metrics exist) */}
      {availableMetrics.length > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap flex items-center gap-1 mr-1">
            <BarChart2 className="w-3 h-3" />
            {language === 'ar' ? 'المتغير:' : 'Variable:'}
          </span>
          {availableMetrics.map((m) => {
            const isSelected = m.id === selectedMetricId;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMetricId(m.id)}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap border ${
                  isSelected
                    ? 'bg-sky-500/20 text-sky-300 border-sky-500/50 shadow-sm'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {m.symbol ? `${m.symbol} ` : ''}
                {m.label} {m.unit ? `(${m.unit})` : ''}
              </button>
            );
          })}
        </div>
      )}

      {/* Canvas Container */}
      <div
        ref={containerRef}
        className="relative w-full h-[190px] sm:h-[210px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800/80"
      >
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>
    </div>
  );
};

