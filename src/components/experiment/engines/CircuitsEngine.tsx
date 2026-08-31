import React, { useEffect, useRef } from 'react';
import { Experiment } from '../../../types/experiment';

export interface CircuitsEngineProps {
  experiment: Experiment;
  params: Record<string, number>;
  isRunning?: boolean;
  onOutputsUpdate?: (outputs: Record<string, number>) => void;
}

export const CircuitsEngine: React.FC<CircuitsEngineProps> = ({
  experiment,
  params,
  isRunning = true,
  onOutputsUpdate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const lastOutputsJsonRef = useRef('');
  const onOutputsUpdateRef = useRef(onOutputsUpdate);
  useEffect(() => {
    onOutputsUpdateRef.current = onOutputsUpdate;
  }, [onOutputsUpdate]);

  const code = experiment?.codeNumber || 4;
  const law = (experiment?.physicalLaw || '').toLowerCase();
  const slug = (experiment?.id || '').toLowerCase();

  const getParam = (names: string[], def: number): number => {
    for (const name of names) {
      if (params[name] !== undefined && !isNaN(params[name])) {
        return params[name];
      }
    }
    return def;
  };

  // Perform physical circuit calculations dynamically
  useEffect(() => {
    if (!onOutputsUpdate) return;
    const outputs: Record<string, number> = {};

    // 1. RC Circuit Time Constant (Exp 6)
    if (code === 6 || law.includes('rc') || slug.includes('rc-circuit')) {
      const rOhms = getParam(['resistance', 'R', 'var1'], 1000);
      const cUf = getParam(['capacitance', 'C', 'var2'], 100);
      const v0 = getParam(['voltage', 'V0', 'var3'], 12);
      const tau = (rOhms * cUf) / 1e6; // seconds

      outputs.timeConstant = Number((tau * 1000).toFixed(2)); // ms
      outputs.cutoffFrequency = Number((1 / (2 * Math.PI * tau)).toFixed(2));
      outputs.storedCharge = Number((cUf * 1e-6 * v0 * 1e3).toFixed(2)); // mC
      outputs.supplyVoltage = v0;
    }
    // 2. Lorentz Force / Magnetism (Exp 31, 52)
    else if (code === 31 || law.includes('q · v · b') || slug.includes('lorentz') || slug.includes('magnetic')) {
      const q = getParam(['charge', 'q', 'var1'], 1.6);
      const v = getParam(['velocity', 'v', 'var2'], 2.0);
      const b = getParam(['magneticField', 'B', 'var3'], 0.5);
      const force = q * v * b;
      const radius = (1.0 * v) / Math.max(q * b, 0.01);

      outputs.magneticForce = Number(force.toFixed(2));
      outputs.cyclotronRadius = Number(radius.toFixed(2));
      outputs.charge = q;
      outputs.velocity = v;
      outputs.magneticField = b;
    }
    // 3. Coulomb's Law (Exp 50)
    else if (code === 50 || law.includes('k · q') || slug.includes('coulomb')) {
      const q1 = getParam(['q1', 'charge1', 'var1'], 5.0);
      const q2 = getParam(['q2', 'charge2', 'var2'], 5.0);
      const r = getParam(['distance', 'r', 'var3'], 0.1);
      const k = 8.99; // x10^9
      const force = (k * Math.abs(q1 * q2)) / Math.pow(Math.max(r, 0.01), 2);

      outputs.electrostaticForce = Number(force.toFixed(2));
      outputs.charge1 = q1;
      outputs.charge2 = q2;
      outputs.distance = r;
    }
    // 4. Ohm's Law & DC Circuits / Series-Parallel (Exp 4, 5, 33, 49, 51)
    else {
      const voltage = getParam(['voltage', 'V', 'var1'], 12);
      const resistance = getParam(['resistance', 'R', 'var2'], 10);
      const rSafe = Math.max(resistance, 0.1);
      const current = voltage / rSafe;
      const power = voltage * current;
      const heatJoules = power * 1.0;

      outputs.current = Number(current.toFixed(2));
      outputs.power = Number(power.toFixed(2));
      outputs.voltage = Number(voltage.toFixed(1));
      outputs.resistance = Number(resistance.toFixed(1));
      outputs.heatDissipation = Number(heatJoules.toFixed(1));
    }

    const json = JSON.stringify(outputs);
    if (json !== lastOutputsJsonRef.current) {
      lastOutputsJsonRef.current = json;
      onOutputsUpdateRef.current?.(outputs);
    }
  }, [code, law, slug, params]);

  // Canvas 2D Interactive Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      if (isRunning) {
        timeRef.current += dt;
      }
      const t = timeRef.current;

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth || 800;
      const height = canvas.clientHeight || 400;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Deep Dark Lab Theme
      const bg = ctx.createLinearGradient(0, 0, 0, height);
      bg.addColorStop(0, '#030712');
      bg.addColorStop(1, '#09152b');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // PCB Grid Matrix
      ctx.strokeStyle = 'rgba(14, 116, 144, 0.18)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 25) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // -------------------------------------------------------------
      // Circuit Parameters
      // -------------------------------------------------------------
      const voltage = getParam(['voltage', 'V', 'V0', 'var1'], 12);
      const resistance = getParam(['resistance', 'R', 'var2'], 10);
      const current = voltage / Math.max(resistance, 0.1);
      const power = voltage * current;

      // Circuit Wire Loop Coordinates
      const pLeft = width * 0.14;
      const pRight = width * 0.72;
      const pTop = height * 0.22;
      const pBottom = height * 0.78;

      // Outer Glow Circuit Wire Conduit
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.roundRect(pLeft, pTop, pRight - pLeft, pBottom - pTop, 20);
      ctx.stroke();

      // Main Copper Trace
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(pLeft, pTop, pRight - pLeft, pBottom - pTop, 20);
      ctx.stroke();

      // Animated Electron Particles Flowing
      if (isRunning && current > 0) {
        const loopPerimeter = 2 * (pRight - pLeft + pBottom - pTop);
        const speed = Math.min(Math.max(current * 40, 20), 300);
        const numElectrons = 24;

        ctx.fillStyle = '#facc15';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 8;

        for (let i = 0; i < numElectrons; i++) {
          const dist = (t * speed + (i * loopPerimeter) / numElectrons) % loopPerimeter;
          let ex = 0;
          let ey = 0;

          const w = pRight - pLeft;
          const h = pBottom - pTop;

          if (dist < w) {
            ex = pLeft + dist;
            ey = pTop;
          } else if (dist < w + h) {
            ex = pRight;
            ey = pTop + (dist - w);
          } else if (dist < 2 * w + h) {
            ex = pRight - (dist - (w + h));
            ey = pBottom;
          } else {
            ex = pLeft;
            ey = pBottom - (dist - (2 * w + h));
          }

          ctx.beginPath();
          ctx.arc(ex, ey, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      }

      // 1. DC Voltage Source (Left Branch)
      const batteryMidY = (pTop + pBottom) / 2;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(pLeft - 22, batteryMidY - 35, 44, 70);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(pLeft - 22, batteryMidY - 35, 44, 70);

      // Battery Plate Symbols
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(pLeft - 14, batteryMidY - 14);
      ctx.lineTo(pLeft + 14, batteryMidY - 14);
      ctx.stroke();

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(pLeft - 8, batteryMidY + 14);
      ctx.lineTo(pLeft + 8, batteryMidY + 14);
      ctx.stroke();

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${voltage.toFixed(1)}V DC`, pLeft, batteryMidY - 42);

      // 2. Ceramic Color-Banded Resistor (Top Branch)
      const resistorMidX = (pLeft + pRight) / 2;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(resistorMidX - 45, pTop - 18, 90, 36);

      const resGrad = ctx.createLinearGradient(resistorMidX - 35, 0, resistorMidX + 35, 0);
      resGrad.addColorStop(0, '#d97706');
      resGrad.addColorStop(0.5, '#fde68a');
      resGrad.addColorStop(1, '#d97706');
      ctx.fillStyle = resGrad;
      ctx.beginPath();
      ctx.roundRect(resistorMidX - 35, pTop - 14, 70, 28, 6);
      ctx.fill();

      // Resistor Color Bands
      const bands = ['#b91c1c', '#000000', '#f59e0b', '#d97706'];
      bands.forEach((color, idx) => {
        ctx.fillStyle = color;
        ctx.fillRect(resistorMidX - 25 + idx * 16, pTop - 14, 6, 28);
      });

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${resistance.toFixed(1)} Ω`, resistorMidX, pTop - 25);

      // 3. Incandescent Light Bulb (Right Branch)
      const bulbMidY = (pTop + pBottom) / 2;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(pRight - 25, bulbMidY - 35, 50, 70);

      const brightnessFactor = Math.min(power / 60, 1.0);
      const bulbGlow = ctx.createRadialGradient(pRight, bulbMidY, 2, pRight, bulbMidY, 40);
      bulbGlow.addColorStop(0, `rgba(254, 240, 138, ${0.3 + 0.7 * brightnessFactor})`);
      bulbGlow.addColorStop(1, 'rgba(254, 240, 138, 0)');
      ctx.fillStyle = bulbGlow;
      ctx.beginPath();
      ctx.arc(pRight, bulbMidY, 40, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(pRight, bulbMidY, 18, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`💡 ${power.toFixed(1)}W`, pRight, bulbMidY + 34);

      // 4. Analog/Digital Ammeter (Bottom Branch)
      const meterMidX = (pLeft + pRight) / 2;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(meterMidX - 45, pBottom - 26, 90, 52);
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(meterMidX - 45, pBottom - 26, 90, 52, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 10px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('AMMETER', meterMidX, pBottom - 10);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 16px monospace';
      ctx.fillText(`${current.toFixed(2)} A`, meterMidX, pBottom + 14);

      // Universal Floating Circuits HUD
      const hudW = 240;
      const hudH = 64;
      const hudX = width - hudW - 16;
      const hudY = 16;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(hudX, hudY, hudW, hudH, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(experiment.title?.en || 'CIRCUITS SIMULATION', hudX + 12, hudY + 20);

      ctx.font = 'bold 13px monospace';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(experiment.physicalLaw || 'V = I · R', hudX + 12, hudY + 40);

      ctx.font = '10px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`Current I = ${current.toFixed(2)} A | Active 60fps`, hudX + 12, hudY + 55);

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [code, law, slug, params, isRunning, experiment]);

  return (
    <div className="relative w-full h-[320px] sm:h-[380px] md:h-[430px] rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
