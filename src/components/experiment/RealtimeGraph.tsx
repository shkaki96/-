import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import {
  Activity,
  RefreshCw,
  BarChart2,
  ChevronDown,
  ChevronUp,
  Target,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { Experiment } from '../../types/experiment';
import {
  getExperimentGraphWhitelistConfig,
  WhitelistGraphConfig,
} from '../../utils/scientificVisualizationWhitelist';

export interface GraphMetricOption {
  id: string;
  label: string;
  symbol: string;
  value: number;
  unit: string;
  color?: string;
}

export interface RealtimeGraphProps {
  experiment?: Experiment;
  time: number;
  parameters?: Record<string, number>;
  liveOutputs?: Record<string, number | string>;
  value?: number;
  label?: string;
  unit?: string;
  metrics?: GraphMetricOption[];
  isRunning: boolean;
  color?: string;
}

interface DataPoint {
  x: number;
  y: number;
  t?: number;
}

export const RealtimeGraph: React.FC<RealtimeGraphProps> = ({
  experiment,
  time,
  parameters = {},
  liveOutputs = {},
  value,
  label,
  unit,
  metrics,
  isRunning,
  color = '#38bdf8',
}) => {
  const { language } = useTranslation();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 1. Strict Whitelist Check
  const whitelistConfig: WhitelistGraphConfig | null = useMemo(() => {
    if (!experiment) return null;
    return getExperimentGraphWhitelistConfig(experiment.codeNumber || experiment.id);
  }, [experiment]);

  const loc = (texts?: { ar: string; en: string; ku: string; kmr: string; bad: string }): string => {
    if (!texts) return '';
    if (language === 'bad') return texts.bad;
    if (language === 'ku') return texts.ku;
    if (language === 'kmr') return texts.kmr;
    if (language === 'ar') return texts.ar;
    return texts.en;
  };

  const graphTitle = whitelistConfig ? loc(whitelistConfig.title) : '';
  const graphAim = whitelistConfig ? loc(whitelistConfig.aim) : '';
  const xLabel = whitelistConfig ? loc(whitelistConfig.xAxis.label) : '';
  const yLabel = whitelistConfig ? loc(whitelistConfig.yAxis.label) : '';
  const graphColor = whitelistConfig?.color || color;

  // Track recorded historical points
  const historyRef = useRef<DataPoint[]>([]);
  const lastTimeRef = useRef<number>(-1);

  // Extract current X and Y values based on whitelist graph type & parameters
  const currentCoords = useMemo((): { x: number; y: number } => {
    const code = experiment?.codeNumber || 0;
    const p: Record<string, number | undefined> = parameters || {};
    const out = liveOutputs;

    // Helper to get number from outputs
    const getOutNum = (key: string, def = 0): number => {
      const v = out[key];
      if (typeof v === 'number') return v;
      if (typeof v === 'string') {
        const n = parseFloat(v.replace(/[^0-9.-]/g, ''));
        return isNaN(n) ? def : n;
      }
      return def;
    };

    // 1. Hooke's Law (#25) -> x (m), F (N)
    if (code === 25) {
      const k = p['springConstant'] ?? p['k'] ?? 25;
      const x = p['displacement'] ?? p['x'] ?? p['var1'] ?? 0.2;
      const F = Math.abs(getOutNum('restoringForce', k * x));
      return { x, y: F };
    }

    // 2. Ohm's Law (#33, #44, #54) -> I (A), V (V)
    if (code === 33 || code === 44 || code === 54) {
      const V = p['voltage'] ?? p['V'] ?? 12;
      const R = p['resistance'] ?? p['R'] ?? 10;
      const I = getOutNum('current', V / Math.max(0.1, R));
      return { x: I, y: V };
    }

    // 3. Newton's 2nd Law (#62, #10, #26) -> a (m/s²), F (N)
    if (code === 62 || code === 10 || code === 26) {
      const m = p['mass'] ?? p['m'] ?? 5;
      const F = p['appliedForce'] ?? p['force'] ?? p['F'] ?? 20;
      const a = getOutNum('acceleration', F / Math.max(0.1, m));
      return { x: a, y: F };
    }

    // 4. Friction (#5) -> F_N (N), f_k (N)
    if (code === 5) {
      const m = p['mass'] ?? 5;
      const g = 9.81;
      const mu = p['frictionCoeff'] ?? p['mu'] ?? 0.3;
      const FN = m * g;
      const fk = getOutNum('frictionForce', mu * FN);
      return { x: FN, y: fk };
    }

    // 5. Pendulum (#22, #23) -> Length (m), Period² (s²)
    if (code === 22 || code === 23) {
      const L = p['length'] ?? p['L'] ?? 1.0;
      const g = p['gravity'] ?? 9.81;
      const T = getOutNum('period', 2 * Math.PI * Math.sqrt(L / g));
      return { x: L, y: T * T };
    }

    // 6. Boyle's Law (#35, #63) -> Volume (L), Pressure (kPa)
    if (code === 35 || code === 63) {
      const V = p['volume'] ?? p['V'] ?? 5;
      const T = p['temperature'] ?? p['T'] ?? 300;
      const n = p['moles'] ?? p['n'] ?? 1;
      const R_gas = 8.314;
      const P = getOutNum('pressure', (n * R_gas * T) / Math.max(0.1, V));
      return { x: V, y: P };
    }

    // 7. Charles's Law (#50) -> Temp (K), Volume (L)
    if (code === 50) {
      const T = p['temperature'] ?? p['T'] ?? 300;
      const V0 = 2.0;
      const T0 = 273.15;
      const V = getOutNum('volume', (V0 * T) / T0);
      return { x: T, y: V };
    }

    // 8. Lens Power (#2, #16) -> Focal Length (m), Power (D)
    if (code === 2 || code === 16) {
      const f_cm = p['focalLength'] ?? 20;
      const f_m = Math.max(0.01, f_cm / 100);
      const P_lens = getOutNum('lensPower', 1 / f_m);
      return { x: f_m, y: P_lens };
    }

    // 9. Fourier's Law (#6) -> Temp Gradient (K/m), Heat Flux (W/m²)
    if (code === 6) {
      const k_cond = p['thermalConductivity'] ?? 50;
      const dT = p['tempDiff'] ?? 40;
      const L = p['length'] ?? 0.5;
      const grad = dT / Math.max(0.01, L);
      const q = getOutNum('heatFlux', k_cond * grad);
      return { x: grad, y: q };
    }

    // Time-based graphs
    // 10. Free Fall (#27) -> t (s), v (m/s)
    if (code === 27) {
      const g = p['gravity'] ?? 9.81;
      const v = getOutNum('velocity', g * time);
      return { x: time, y: v };
    }

    // 11. Thermal Equilibrium (#70, #1) -> t (s), T (°C)
    if (code === 70 || code === 1) {
      const T_init = p['initialTemp'] ?? 80;
      const T_env = p['ambientTemp'] ?? 22;
      const k = 0.08;
      const T_curr = getOutNum('temperature', T_env + (T_init - T_env) * Math.exp(-k * time));
      return { x: time, y: T_curr };
    }

    // 12. Electromagnetic Induction (#8, #55, #67) -> t (s), EMF (V)
    if (code === 8 || code === 55 || code === 67) {
      const B = p['magneticField'] ?? 0.5;
      const N = p['turns'] ?? 100;
      const freq = p['frequency'];
      const w = freq ? freq * 2 * Math.PI : 2;
      const emf = getOutNum('inducedEmf', N * B * Math.sin(w * time));
      return { x: time, y: emf };
    }

    // 13. Capacitor RC (#42) -> t (s), V_C (V)
    if (code === 42) {
      const V0 = p['voltage'] ?? 10;
      const R = p['resistance'] ?? 1000;
      const C = p['capacitance'] ?? 0.001;
      const tau = R * C;
      const Vc = getOutNum('capacitorVoltage', V0 * (1 - Math.exp(-time / Math.max(0.01, tau))));
      return { x: time, y: Vc };
    }

    // 14. Radioactive Decay (#69) -> t (s), N (nuclei)
    if (code === 69) {
      const N0 = p['initialNuclei'] ?? 200;
      const halfLife = p['halfLife'] ?? 5.0;
      const lambda = Math.LN2 / Math.max(0.1, halfLife);
      const N = getOutNum('remainingNuclei', N0 * Math.exp(-lambda * time));
      return { x: time, y: N };
    }

    // Default fallback
    return { x: time, y: typeof value === 'number' ? value : getOutNum('energy', 0) };
  }, [experiment, parameters, liveOutputs, time, value]);

  // Record historical points
  useEffect(() => {
    if (time <= 0.05 || time < lastTimeRef.current) {
      historyRef.current = [];
    }
    lastTimeRef.current = time;

    const pt = currentCoords;
    if (
      !isNaN(pt.x) &&
      !isNaN(pt.y) &&
      isFinite(pt.x) &&
      isFinite(pt.y)
    ) {
      const hist = historyRef.current;
      const last = hist[hist.length - 1];

      // For data graphs, we record unique coordinate points; for time graphs, we append on time progression
      if (!last || Math.abs(last.x - pt.x) > 0.001 || Math.abs(last.y - pt.y) > 0.001) {
        hist.push({ x: pt.x, y: pt.y, t: time });
        if (hist.length > 300) hist.shift();
      }
    }
  }, [time, currentCoords]);

  // Main Canvas Rendering
  const drawChart = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !whitelistConfig) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    const width = rect.width || 320;
    const height = rect.height || 210;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.clearRect(0, 0, width, height);

    const marginLeft = 56;
    const marginRight = 24;
    const marginTop = 20;
    const marginBottom = 34;
    const plotWidth = width - marginLeft - marginRight;
    const plotHeight = height - marginTop - marginBottom;

    // Grid Lines
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

    const history = historyRef.current;

    // Compute coordinate ranges
    let minX = 0;
    let maxX = Math.max(1, currentCoords.x * 1.3);
    let minY = 0;
    let maxY = Math.max(1, currentCoords.y * 1.3);

    if (history.length > 1) {
      minX = Math.min(...history.map((p) => p.x));
      maxX = Math.max(...history.map((p) => p.x));
      minY = Math.min(...history.map((p) => p.y));
      maxY = Math.max(...history.map((p) => p.y));
    }

    if (whitelistConfig.type === 'data_graph') {
      minX = 0;
      maxX = Math.max(maxX, currentCoords.x * 1.25, 0.5);
      minY = 0;
      maxY = Math.max(maxY, currentCoords.y * 1.25, 1.0);
    } else {
      minX = 0;
      maxX = Math.max(maxX, 5);
      if (minY >= 0) minY = 0;
      else minY = minY * 1.15;
      maxY = Math.max(maxY * 1.15, 1);
    }

    if (maxX === minX) maxX += 1;
    if (maxY === minY) maxY += 1;

    const getXPixel = (xVal: number) => {
      return marginLeft + ((xVal - minX) / (maxX - minX)) * plotWidth;
    };

    const getYPixel = (yVal: number) => {
      return marginTop + plotHeight - ((yVal - minY) / (maxY - minY)) * plotHeight;
    };

    // Draw theoretical reference curve
    if (whitelistConfig.type === 'data_graph') {
      ctx.strokeStyle = `${graphColor}40`;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      const numSteps = 30;
      for (let s = 0; s <= numSteps; s++) {
        const xStep = minX + (s / numSteps) * (maxX - minX);
        let yStep = 0;

        // Model linear slope or theoretical function
        const slope = currentCoords.x !== 0 ? currentCoords.y / currentCoords.x : 1;
        if (whitelistConfig.experimentCodes.includes(35)) {
          // Boyle's Law: P = k / V
          const k_const = currentCoords.x * currentCoords.y || 100;
          yStep = k_const / Math.max(0.1, xStep);
        } else if (whitelistConfig.experimentCodes.includes(2)) {
          // Lens Power: P = 1 / f
          yStep = 1 / Math.max(0.01, xStep);
        } else {
          // Linear: y = slope * x
          yStep = slope * xStep;
        }

        const px = getXPixel(xStep);
        const py = getYPixel(yStep);
        if (s === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw historical or current points
    if (history.length > 1) {
      // Area Fill under curve
      const grad = ctx.createLinearGradient(0, marginTop, 0, marginTop + plotHeight);
      grad.addColorStop(0, `${graphColor}35`);
      grad.addColorStop(1, `${graphColor}00`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(getXPixel(history[0].x), marginTop + plotHeight);
      for (let i = 0; i < history.length; i++) {
        ctx.lineTo(getXPixel(history[i].x), getYPixel(history[i].y));
      }
      ctx.lineTo(getXPixel(history[history.length - 1].x), marginTop + plotHeight);
      ctx.closePath();
      ctx.fill();

      // Main line
      ctx.strokeStyle = graphColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i < history.length; i++) {
        const px = getXPixel(history[i].x);
        const py = getYPixel(history[i].y);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    // Glowing Current Active State Point
    const curX = getXPixel(currentCoords.x);
    const curY = getYPixel(currentCoords.y);

    ctx.fillStyle = graphColor;
    ctx.shadowColor = graphColor;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(curX, curY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Crosshair lines to axes
    ctx.strokeStyle = `${graphColor}80`;
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(marginLeft, curY);
    ctx.lineTo(curX, curY);
    ctx.lineTo(curX, marginTop + plotHeight);
    ctx.stroke();
    ctx.setLineDash([]);

    // Axes Values & Labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';

    // Y Axis values
    ctx.textAlign = 'right';
    ctx.fillText(maxY.toFixed(1), marginLeft - 6, marginTop + 10);
    ctx.fillText(minY.toFixed(1), marginLeft - 6, marginTop + plotHeight);

    // Current Y readout badge
    ctx.fillStyle = graphColor;
    ctx.font = 'bold 10px monospace';
    ctx.fillText(
      `${currentCoords.y.toFixed(2)} ${whitelistConfig.yAxis.unit}`,
      marginLeft - 6,
      Math.max(marginTop + 14, Math.min(marginTop + plotHeight - 4, curY + 3))
    );

    // X Axis values
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';
    ctx.fillText(minX.toFixed(1), marginLeft, marginTop + plotHeight + 16);
    ctx.fillText(maxX.toFixed(1), marginLeft + plotWidth, marginTop + plotHeight + 16);

    // Current X readout
    ctx.fillStyle = graphColor;
    ctx.fillText(
      `${currentCoords.x.toFixed(2)} ${whitelistConfig.xAxis.unit}`,
      Math.max(marginLeft + 20, Math.min(marginLeft + plotWidth - 20, curX)),
      marginTop + plotHeight + 28
    );

    // Axis Symbol Names
    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(
      `${whitelistConfig.yAxis.symbol} (${whitelistConfig.yAxis.unit})`,
      marginLeft + 6,
      marginTop + 14
    );
    ctx.textAlign = 'right';
    ctx.fillText(
      `${whitelistConfig.xAxis.symbol} (${whitelistConfig.xAxis.unit})`,
      marginLeft + plotWidth - 4,
      marginTop + plotHeight - 8
    );
  }, [currentCoords, graphColor, whitelistConfig]);

  useEffect(() => {
    drawChart();
  }, [drawChart, time]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      drawChart();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [drawChart]);

  const handleClear = () => {
    historyRef.current = [];
    drawChart();
  };

  const pointCount = historyRef.current.length;

  if (!whitelistConfig) {
    return null;
  }

  return (
    <div className="bg-slate-900/90 p-4 rounded-2xl border border-sky-900/40 shadow-xl space-y-3">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-sky-400" />
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-xs sm:text-sm font-bold text-slate-100 uppercase tracking-wide">
              {graphTitle}
            </h4>
            {whitelistConfig.formula && (
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-sky-950/80 text-sky-300 border border-sky-500/30">
                {whitelistConfig.formula}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
            {pointCount} {loc({ ar: 'نقاط', bad: 'خال', ku: 'خاڵ', kmr: 'xal', en: 'pts' })}
          </span>
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Reset Data Points"
            aria-label="Clear Graph"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title={isExpanded ? 'Collapse Graph' : 'Expand Graph'}
            aria-label="Toggle Graph"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Scientific Aim Banner (الهدف التعليمي والفيزيائي) */}
          <div className="flex items-start gap-2 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-300">
            <Target className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-400 mr-1.5">
                {loc({
                  ar: 'الهدف العلمي:',
                  bad: 'ئارمانجا زانستی:',
                  ku: 'ئامانجی زانستی:',
                  kmr: 'Armanca Zanistî:',
                  en: 'Scientific Aim:',
                })}
              </span>
              <span>{graphAim}</span>
            </div>
          </div>

          {/* Canvas Container */}
          <div
            ref={containerRef}
            className="relative w-full h-[200px] sm:h-[220px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800/80 shadow-inner"
          >
            <canvas ref={canvasRef} className="w-full h-full block" />
          </div>
        </>
      )}
    </div>
  );
};

