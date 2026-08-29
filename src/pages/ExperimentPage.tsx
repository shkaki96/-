import React, { useMemo, useState, useEffect } from 'react';
import { ExperimentRegistry } from '../data/experiments/registry';
import { SimulationEngineFactory } from '../simulations/engineFactory';
import { useTranslation } from '../i18n/useTranslation';
import { ExperimentNavigation } from '../components/experiment/ExperimentNavigation';
import { ExperimentHeader } from '../components/experiment/ExperimentHeader';
import { SimulationViewport } from '../components/experiment/SimulationViewport';
import { ControlPanel } from '../components/experiment/ControlPanel';
import { ResultsPanel } from '../components/experiment/ResultsPanel';
import { RealtimeGraph } from '../components/experiment/RealtimeGraph';
import { TheoryPanel } from '../components/experiment/TheoryPanel';
import { QuizPanel } from '../components/experiment/QuizPanel';
import { ExperimentToolDock } from '../components/experiment/ExperimentToolDock';
import { ExperimentTheoryModal } from '../components/experiment/ExperimentTheoryModal';
import { ScientificKeyboardModal } from '../components/tools/ScientificKeyboardModal';
import { LabNotebookModal } from '../components/tools/LabNotebookModal';
import { SymbolsConstantsModal } from '../components/tools/SymbolsConstantsModal';
import { FormulasModal } from '../components/tools/FormulasModal';
import { TestsModal } from '../components/tools/TestsModal';

interface ExperimentPageProps {
  experimentId: string;
  onNavigate: (id: string) => void;
  onBack: () => void;
  openToolFromDrawer?: string | null;
  onClearDrawerTool?: () => void;
}

export const ExperimentPage: React.FC<ExperimentPageProps> = ({
  experimentId,
  onNavigate,
  onBack,
  openToolFromDrawer = null,
  onClearDrawerTool,
}) => {
  const { getLocalizedText } = useTranslation();

  const experiment = useMemo(() => {
    return ExperimentRegistry.getById(experimentId) || ExperimentRegistry.getAll()[0];
  }, [experimentId]);

  // Compute initial parameter values from experiment schema
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
  const [isRunning, setIsRunning] = useState(false); // Motion does not start automatically per Phase 10.1
  const [hasStartedOnce, setHasStartedOnce] = useState(false);
  const [, setTick] = useState<number>(0);
  const [activeModal, setActiveModal] = useState<string | null>(openToolFromDrawer);

  // Re-sync params when experiment changes
  useEffect(() => {
    setParams(defaultParams);
    setIsRunning(false);
    setHasStartedOnce(false);
  }, [experiment, defaultParams]);

  // Instantiate proper simulation engine for current experiment
  const engine = useMemo(() => {
    const eng = SimulationEngineFactory.createEngine(experiment, defaultParams);
    eng.pause(); // Ensure initial state is ready and paused at t=0
    return eng;
  }, [experiment, defaultParams]);

  // Frame tick loop to continuously stream state into React for live telemetry & graphs
  useEffect(() => {
    let animId: number;
    const renderLoop = () => {
      if (isRunning) {
        setTick((t) => t + 1);
      }
      animId = requestAnimationFrame(renderLoop);
    };
    animId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animId);
  }, [isRunning]);

  // Sync tool from drawer if opened
  useEffect(() => {
    if (openToolFromDrawer) {
      setActiveModal(openToolFromDrawer);
      if (onClearDrawerTool) onClearDrawerTool();
    }
  }, [openToolFromDrawer, onClearDrawerTool]);

  const handleStart = () => {
    engine.start();
    setIsRunning(true);
    setHasStartedOnce(true);
  };

  const handlePause = () => {
    engine.pause();
    setIsRunning(false);
  };

  const handleReset = () => {
    engine.reset();
    setIsRunning(false);
    setHasStartedOnce(false);
    setTick((t) => t + 1);
  };

  const simulationStatus: 'READY' | 'RUNNING' | 'PAUSED' = isRunning
    ? 'RUNNING'
    : hasStartedOnce
    ? 'PAUSED'
    : 'READY';

  const handleParamChange = (key: string, value: number) => {
    const updated = { ...params, [key]: value };
    setParams(updated);
    engine.updateParams(updated);
    setTick((t) => t + 1);
  };

  const state = engine.getState();
  const title = getLocalizedText(experiment.title);

  // Format Inputs for Results Panel
  const inputList = (experiment.parameters || []).map((p) => ({
    label: getLocalizedText(p.label),
    value: params[p.id] ?? p.defaultValue,
    unit: p.unit,
  }));

  // Format Outputs for Results Panel with real physical simulation metrics
  const outputList = useMemo(() => {
    const category = experiment.category;
    const id = experiment.id.toLowerCase();
    const data = state.data;
    const elapsedTime = state.time;

    const list: Array<{
      label: string;
      symbol: string;
      value: string | number;
      unit: string;
      highlight?: boolean;
    }> = [];

    // 1. Time (s)
    list.push({
      label: getLocalizedText({
        ar: 'الزمن المنقضي',
        en: 'Time',
        ku: 'کات',
        kmr: 'Deman',
        bad: 'دەمێ بوری',
      }),
      symbol: 't',
      value: elapsedTime.toFixed(2),
      unit: 's',
      highlight: true,
    });

    // 2. Pendulum / Harmonic motion
    if (id.includes('pendulum') || id.includes('harmonic') || data.angularVelocity !== undefined) {
      const angleVal = data.angleDeg ?? (typeof data.angle === 'number' ? Number(((data.angle * 180) / Math.PI).toFixed(1)) : 0);
      list.push({
        label: getLocalizedText({ ar: 'زاوية الإزاحة', en: 'Angle', ku: 'گۆشە', kmr: 'Goşe', bad: 'گۆشەیا لادانێ' }),
        symbol: 'θ',
        value: angleVal,
        unit: '°',
        highlight: true,
      });
      list.push({
        label: getLocalizedText({ ar: 'السرعة الزاوية', en: 'Angular Velocity', ku: 'خێرایی گۆشەیی', kmr: 'Leza Goşeyî', bad: 'لەزاتیا گۆشەیی' }),
        symbol: 'ω',
        value: data.angularVelocity !== undefined ? String(data.angularVelocity) : '0.00',
        unit: 'rad/s',
        highlight: true,
      });
      list.push({
        label: getLocalizedText({ ar: 'السرعة الخطية', en: 'Linear Velocity', ku: 'خێرایی هێڵی', kmr: 'Leza Hêlî', bad: 'لەزاتیا هێلی' }),
        symbol: 'v',
        value: data.linearVelocity !== undefined ? String(data.linearVelocity) : '0.00',
        unit: 'm/s',
        highlight: true,
      });
      list.push({
        label: getLocalizedText({ ar: 'زمن الدورة', en: 'Period', ku: 'کاتی خول', kmr: 'Dema Dorê', bad: 'دەمێ خولێ' }),
        symbol: 'T',
        value: data.period !== undefined ? String(data.period) : '0.00',
        unit: 's',
        highlight: true,
      });
      list.push({
        label: getLocalizedText({ ar: 'التردد', en: 'Frequency', ku: 'فریکوێنسی', kmr: 'Frîkans', bad: 'فریکوێنس' }),
        symbol: 'f',
        value: data.frequency !== undefined ? String(data.frequency) : '0.00',
        unit: 'Hz',
        highlight: false,
      });
    }
    // 3. Optics / Refraction
    else if (category === 'optics' || id.includes('optics') || id.includes('refraction') || data.refractedAngle !== undefined) {
      list.push({
        label: getLocalizedText({ ar: 'زاوية السقوط', en: 'Incident Angle', ku: 'گۆشەی کەوتن', kmr: 'Goşeya Ketinê', bad: 'گۆشەیا کەفتنێ' }),
        symbol: 'θ₁',
        value: data.incidentAngle !== undefined ? String(data.incidentAngle) : String(params.incidentAngle ?? params.var1 ?? 30),
        unit: '°',
        highlight: true,
      });
      list.push({
        label: getLocalizedText({ ar: 'زاوية الانكسار', en: 'Refracted Angle', ku: 'گۆشەی تێکشکاندن', kmr: 'Goşeya Şikestinê', bad: 'گۆشەیا شکانەڤێ' }),
        symbol: 'θ₂',
        value: typeof data.refractedAngle === 'number' ? `${data.refractedAngle}°` : String(data.refractedAngle ?? '0°'),
        unit: '',
        highlight: true,
      });
      list.push({
        label: getLocalizedText({ ar: 'الزاوية الحرجة', en: 'Critical Angle', ku: 'گۆشەی ئاستەنگ', kmr: 'Goşeya Krîtîk', bad: 'گۆشەیا رەخنەگر' }),
        symbol: 'θc',
        value: typeof data.criticalAngle === 'number' ? `${data.criticalAngle}°` : String(data.criticalAngle ?? 'N/A'),
        unit: '',
        highlight: false,
      });
      list.push({
        label: getLocalizedText({ ar: 'سرعة الضوء (وسط 1)', en: 'Light Speed (Med 1)', ku: 'خێرایی ڕووناکی (ناوەند 1)', kmr: 'Leza Ronahiyê (Navend 1)', bad: 'لەزاتیا رووناهییێ (ناڤەندێ ١)' }),
        symbol: 'v₁',
        value: data.lightSpeedM1 !== undefined ? `${data.lightSpeedM1}×10⁸` : '3.00×10⁸',
        unit: 'm/s',
        highlight: false,
      });
      list.push({
        label: getLocalizedText({ ar: 'سرعة الضوء (وسط 2)', en: 'Light Speed (Med 2)', ku: 'خێرایی ڕووناکی (ناوەند 2)', kmr: 'Leza Ronahiyê (Navend 2)', bad: 'لەزاتیا رووناهییێ (ناڤەندێ ٢)' }),
        symbol: 'v₂',
        value: data.lightSpeedM2 !== undefined ? `${data.lightSpeedM2}×10⁸` : '2.00×10⁸',
        unit: 'm/s',
        highlight: false,
      });
    }
    // 4. Electricity / Circuits
    else if (category === 'electricity' || id.includes('circuit') || id.includes('ohm') || data.current !== undefined) {
      list.push({
        label: getLocalizedText({ ar: 'التيار الكهربائي', en: 'Current', ku: 'تەزووی کارەبا', kmr: 'Tevgera Elektrîkî', bad: 'تەزوویێ کارەبێ' }),
        symbol: 'I',
        value: data.current !== undefined ? String(data.current) : '0.00',
        unit: 'A',
        highlight: true,
      });
      list.push({
        label: getLocalizedText({ ar: 'القدرة الكهربائية', en: 'Power Dissipation', ku: 'توانی کارەبایی', kmr: 'Hêza Elektrîkî', bad: 'شیانا کارەبایی' }),
        symbol: 'P',
        value: data.power !== undefined ? String(data.power) : '0.00',
        unit: 'W',
        highlight: true,
      });
      list.push({
        label: getLocalizedText({ ar: 'الشحنة المنقولة', en: 'Transferred Charge', ku: 'باری گواستراوە', kmr: 'Bara Veguhastî', bad: 'بارگەیێ گوهاستراو' }),
        symbol: 'Q',
        value: data.chargeTransferred !== undefined ? String(data.chargeTransferred) : '0.00',
        unit: 'C',
        highlight: false,
      });
      list.push({
        label: getLocalizedText({ ar: 'الطاقة المستهلكة', en: 'Energy Dissipated', ku: 'توانای بەکاربراو', kmr: 'Anarşiya Windabûyî', bad: 'وزا بەلاڤبووی' }),
        symbol: 'E',
        value: data.energyDissipated !== undefined ? String(data.energyDissipated) : '0.00',
        unit: 'J',
        highlight: false,
      });
    }
    // 5. Thermodynamics / Gas
    else if (category === 'thermodynamics' || id.includes('heat') || id.includes('thermo') || data.pressure !== undefined) {
      list.push({
        label: getLocalizedText({ ar: 'الضغط', en: 'Pressure', ku: 'پەستان', kmr: 'Zext', bad: 'پەستان' }),
        symbol: 'P',
        value: data.pressure !== undefined ? String(data.pressure) : '101.3',
        unit: 'kPa',
        highlight: true,
      });
      list.push({
        label: getLocalizedText({ ar: 'الطاقة الداخلية', en: 'Internal Energy', ku: 'توانای ناوەکی', kmr: 'Anarşiya Navxweyî', bad: 'وزا ناڤخۆیی' }),
        symbol: 'U',
        value: data.internalEnergy !== undefined ? String(data.internalEnergy) : '0.0',
        unit: 'J',
        highlight: true,
      });
      list.push({
        label: getLocalizedText({ ar: 'الشغل المنجز', en: 'Work Done', ku: 'کاری ئەنجامدراو', kmr: 'Kara Pêkhatî', bad: 'ئیشێ ئەنجامدای' }),
        symbol: 'W',
        value: data.workDone !== undefined ? String(data.workDone) : '0.00',
        unit: 'J',
        highlight: false,
      });
    }
    // 6. Waves / Sound
    else if (category === 'waves' || id.includes('wave') || id.includes('sound') || data.waveSpeed !== undefined) {
      list.push({
        label: getLocalizedText({ ar: 'سرعة الموجة', en: 'Wave Speed', ku: 'خێرایی شەپۆل', kmr: 'Leza Şepolê', bad: 'لەزاتیا پێلێ' }),
        symbol: 'v',
        value: data.waveSpeed !== undefined ? String(data.waveSpeed) : '0.00',
        unit: 'm/s',
        highlight: true,
      });
      list.push({
        label: getLocalizedText({ ar: 'زمن الدورة', en: 'Period', ku: 'کاتی خول', kmr: 'Dema Dorê', bad: 'دەمێ خولێ' }),
        symbol: 'T',
        value: data.period !== undefined ? String(data.period) : '0.00',
        unit: 's',
        highlight: true,
      });
      list.push({
        label: getLocalizedText({ ar: 'التردد', en: 'Frequency', ku: 'فریکوێنسی', kmr: 'Frîkans', bad: 'فریکوێنس' }),
        symbol: 'f',
        value: data.frequency !== undefined ? String(data.frequency) : String(params.frequency ?? params.var1 ?? 2),
        unit: 'Hz',
        highlight: false,
      });
      list.push({
        label: getLocalizedText({ ar: 'الطول الموجي', en: 'Wavelength', ku: 'درێژی شەپۆل', kmr: 'Dirêjiya Şepolê', bad: 'درێژیا پێلێ' }),
        symbol: 'λ',
        value: data.wavelength !== undefined ? String(data.wavelength) : String(params.wavelength ?? 1.5),
        unit: 'm',
        highlight: false,
      });
    }
    // 7. Generic fallback
    else {
      if (experiment.outputMetrics && experiment.outputMetrics.length > 0) {
        experiment.outputMetrics.forEach((m) => {
          const val = data[m.id] ?? data.energy ?? data.systemResponse ?? 0;
          list.push({
            label: getLocalizedText(m.label),
            symbol: m.symbol,
            value: typeof val === 'number' ? val : String(val),
            unit: m.unit,
            highlight: true,
          });
        });
      } else {
        list.push({
          label: getLocalizedText({ ar: 'طاقة النظام', en: 'System Energy', ku: 'توانای سیستم', kmr: 'Anarşiya Sîstemê', bad: 'وزا سیستەمی' }),
          symbol: 'E',
          value: data.energy !== undefined ? String(data.energy) : '0.0',
          unit: 'J',
          highlight: true,
        });
      }
    }

    return list;
  }, [experiment, state.data, state.time, params, getLocalizedText]);

  // Map outputList metrics into GraphMetricOption array for RealtimeGraph variable selection
  const graphableMetrics = useMemo(() => {
    return outputList
      .filter((item) => item.symbol !== 't')
      .map((item, index) => {
        let numVal = 0;
        if (typeof item.value === 'number') {
          numVal = item.value;
        } else if (typeof item.value === 'string') {
          const parsed = parseFloat(item.value.replace(/[^0-9.-]/g, ''));
          numVal = isNaN(parsed) ? 0 : parsed;
        }
        return {
          id: `metric_${index}_${item.symbol}`,
          label: item.label,
          symbol: item.symbol,
          value: numVal,
          unit: item.unit,
        };
      });
  }, [outputList]);

  return (
    <div className="space-y-5 max-w-7xl mx-auto px-2 sm:px-4 py-3">
      {/* Top Compact Navigation & Language Header */}
      <ExperimentNavigation
        currentExperimentId={experiment.id}
        onNavigate={onNavigate}
        onBackToHome={onBack}
      />

      {/* Experiment Title & Law Metadata */}
      <ExperimentHeader experiment={experiment} />

      {/* Laboratory Quick Tool Dock */}
      <ExperimentToolDock onOpenTool={(toolId) => setActiveModal(toolId)} />

      {/* Primary Virtual Physics Laboratory Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Central Physics Area: Simulation Stage & Telemetry Chart */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-5">
          {/* Main Visual Simulation Stage */}
          <SimulationViewport
            engine={engine}
            parameters={params}
            isRunning={isRunning}
            simulationStatus={simulationStatus}
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
            physicalLaw={experiment.physicalLaw}
          />

          {/* Real-time Telemetry Line Plot Graph */}
          <RealtimeGraph
            time={state.time}
            metrics={graphableMetrics}
            isRunning={isRunning}
            color="#38bdf8"
          />
        </div>

        {/* Side Control & Measurement Panel */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-5">
          {/* Experiment Sliders & Parameter Controls */}
          <ControlPanel
            parametersSchema={experiment.parameters}
            values={params}
            onChange={handleParamChange}
            isRunning={isRunning}
            simulationStatus={simulationStatus}
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
          />

          {/* Real-Time Measurements & Calculated Outputs */}
          <ResultsPanel
            inputs={inputList}
            outputs={outputList}
            elapsedTime={state.time}
            experimentTitle={getLocalizedText(experiment.title)}
            experimentId={experiment.id}
          />
        </div>
      </div>

      {/* Physics Theory & Scientific Explanation Section */}
      <TheoryPanel experiment={experiment} />

      {/* Concept Quiz & Learning Check Section */}
      <QuizPanel experiment={experiment} />

      {/* Auxiliary Modals */}
      <ExperimentTheoryModal
        isOpen={activeModal === 'theory'}
        onClose={() => setActiveModal(null)}
        experiment={experiment}
      />

      <ScientificKeyboardModal
        isOpen={activeModal === 'keyboard'}
        onClose={() => setActiveModal(null)}
      />

      <LabNotebookModal
        isOpen={activeModal === 'notebook'}
        onClose={() => setActiveModal(null)}
        experimentId={experiment.id}
        experimentTitle={title}
      />

      <SymbolsConstantsModal
        isOpen={activeModal === 'symbols'}
        onClose={() => setActiveModal(null)}
      />

      <FormulasModal
        isOpen={activeModal === 'formulas'}
        onClose={() => setActiveModal(null)}
      />

      <TestsModal
        isOpen={activeModal === 'tests'}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
};
