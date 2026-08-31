import React, { useEffect, useRef } from 'react';
import { Experiment } from '../../../types/experiment';

export interface ThermodynamicsEngineProps {
  experiment: Experiment;
  params: Record<string, number>;
  isRunning?: boolean;
  onOutputsUpdate?: (outputs: Record<string, number>) => void;
}

interface GasParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

export const ThermodynamicsEngine: React.FC<ThermodynamicsEngineProps> = ({
  experiment,
  params,
  isRunning = true,
  onOutputsUpdate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<GasParticle[]>([]);
  const timeRef = useRef(0);
  const lastOutputsJsonRef = useRef('');
  const onOutputsUpdateRef = useRef(onOutputsUpdate);
  useEffect(() => {
    onOutputsUpdateRef.current = onOutputsUpdate;
  }, [onOutputsUpdate]);

  const code = experiment?.codeNumber || 35;
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

  // Perform physical formulas calculation dynamically
  useEffect(() => {
    if (!onOutputsUpdate) return;
    const outputs: Record<string, number> = {};

    // Carnot Engine (Exp 47)
    if (code === 47 || law.includes('1 - t_c') || slug.includes('carnot')) {
      const Th = getParam(['Th', 'T_h', 'hotTemp', 'var1'], 500);
      const Tc = getParam(['Tc', 'T_c', 'coldTemp', 'var2'], 300);
      const Qin = getParam(['Qin', 'Q_in', 'heatIn', 'var3'], 1000);
      const eff = Math.max(0, 1 - Tc / Math.max(Th, Tc + 1));
      const workOut = Qin * eff;
      const Qout = Qin - workOut;

      outputs.carnotEfficiency = Number((eff * 100).toFixed(1));
      outputs.workOutput = Number(workOut.toFixed(1));
      outputs.exhaustHeat = Number(Qout.toFixed(1));
      outputs.hotReservoir = Th;
      outputs.coldReservoir = Tc;
    }
    // Calorimetry & Heat Capacity (Exp 46, 70)
    else if (code === 46 || code === 70 || law.includes('m · c') || slug.includes('calorimetry') || slug.includes('heat')) {
      const mass = getParam(['mass', 'm', 'var1'], 0.5);
      const specificHeat = getParam(['specificHeat', 'c', 'var2'], 4186);
      const deltaT = getParam(['deltaT', 'dT', 'tempChange', 'var3'], 25);
      const heatQ = mass * specificHeat * deltaT;

      outputs.heatTransfer = Number(heatQ.toFixed(1));
      outputs.mass = mass;
      outputs.specificHeat = specificHeat;
      outputs.temperatureChange = deltaT;
      outputs.powerEquiv = Number((heatQ / 60).toFixed(1));
    }
    // Ideal Gas Law / Boyle / Charles / Gay-Lussac (Exp 35, 43, 44, 45)
    else {
      const tempK = getParam(['temperature', 'T', 'temp', 'var1'], 300);
      const moles = getParam(['moles', 'n', 'var2'], 1.0);
      const volumeL = getParam(['volume', 'V', 'var3'], 22.4);
      const R = 8.314;
      const volM3 = Math.max(volumeL * 1e-3, 0.001);
      const pressurePa = (moles * R * tempK) / volM3;
      const pressureAtm = pressurePa / 101325;
      const internalEnergyJ = 1.5 * moles * R * tempK;

      outputs.pressure = Number(pressureAtm.toFixed(2));
      outputs.pressureKPa = Number((pressurePa / 1000).toFixed(1));
      outputs.volume = Number(volumeL.toFixed(1));
      outputs.temperature = Number(tempK.toFixed(1));
      outputs.internalEnergy = Number(internalEnergyJ.toFixed(1));
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

    // Initialize 65 gas particles if empty
    if (particlesRef.current.length === 0) {
      const pts: GasParticle[] = [];
      for (let i = 0; i < 65; i++) {
        pts.push({
          x: 50 + Math.random() * 200,
          y: 60 + Math.random() * 180,
          vx: (Math.random() - 0.5) * 120,
          vy: (Math.random() - 0.5) * 120,
          color: i % 2 === 0 ? '#38bdf8' : '#f97316',
        });
      }
      particlesRef.current = pts;
    }

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

      // Dark Industrial Background
      const bg = ctx.createLinearGradient(0, 0, 0, height);
      bg.addColorStop(0, '#030712');
      bg.addColorStop(1, '#0f172a');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // Chamber Geometry
      const chamberLeft = width * 0.12;
      const chamberTop = 50;
      const chamberWidth = width * 0.44;
      const chamberHeight = height - 120;

      const tempK = getParam(['temperature', 'T', 'temp', 'Th', 'var1'], 300);
      const volumeParam = getParam(['volume', 'V', 'var3'], 22.4);
      const R = 8.314;
      const moles = getParam(['moles', 'n', 'var2'], 1.0);
      const pressureAtm = (moles * R * tempK) / (Math.max(volumeParam, 5) * 101.325);

      // Piston position depends on volume
      const pistonHeightFrac = Math.min(Math.max((volumeParam - 5) / 45, 0.25), 0.85);
      const pistonY = chamberTop + chamberHeight * (1 - pistonHeightFrac);

      // 1. Gas Chamber Insulation Walls
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 6;
      ctx.strokeRect(chamberLeft, chamberTop, chamberWidth, chamberHeight);

      // Interior gas glow
      const gasGlow = ctx.createLinearGradient(chamberLeft, pistonY, chamberLeft, chamberTop + chamberHeight);
      const heatFactor = Math.min(Math.max((tempK - 200) / 400, 0), 1);
      gasGlow.addColorStop(0, `rgba(${Math.round(56 + 199 * heatFactor)}, ${Math.round(189 - 100 * heatFactor)}, ${Math.round(248 - 200 * heatFactor)}, 0.15)`);
      gasGlow.addColorStop(1, `rgba(${Math.round(249 * heatFactor)}, ${Math.round(115 * heatFactor)}, 22, 0.3)`);
      ctx.fillStyle = gasGlow;
      ctx.fillRect(chamberLeft + 3, pistonY + 15, chamberWidth - 6, chamberTop + chamberHeight - pistonY - 18);

      // 2. Gas Molecules Animation with speed proportional to sqrt(T)
      const speedMult = Math.sqrt(Math.max(tempK, 50) / 300) * (isRunning ? 1 : 0);
      const particles = particlesRef.current;

      particles.forEach((p) => {
        if (isRunning) {
          p.x += p.vx * dt * speedMult;
          p.y += p.vy * dt * speedMult;

          const minX = chamberLeft + 12;
          const maxX = chamberLeft + chamberWidth - 12;
          const minY = pistonY + 22;
          const maxY = chamberTop + chamberHeight - 12;

          if (p.x < minX) {
            p.x = minX;
            p.vx *= -1;
          } else if (p.x > maxX) {
            p.x = maxX;
            p.vx *= -1;
          }
          if (p.y < minY) {
            p.y = minY;
            p.vy *= -1;
          } else if (p.y > maxY) {
            p.y = maxY;
            p.vy *= -1;
          }
        }

        ctx.fillStyle = heatFactor > 0.4 ? '#f97316' : '#38bdf8';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, Math.max(p.y, pistonY + 20), 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 3. Heavy Metallic Moving Piston
      const pistonGrad = ctx.createLinearGradient(chamberLeft, pistonY, chamberLeft + chamberWidth, pistonY);
      pistonGrad.addColorStop(0, '#334155');
      pistonGrad.addColorStop(0.5, '#94a3b8');
      pistonGrad.addColorStop(1, '#334155');
      ctx.fillStyle = pistonGrad;
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.fillRect(chamberLeft + 3, pistonY, chamberWidth - 6, 18);
      ctx.strokeRect(chamberLeft + 3, pistonY, chamberWidth - 6, 18);

      // Piston Shaft
      ctx.fillStyle = '#64748b';
      ctx.fillRect(chamberLeft + chamberWidth / 2 - 8, chamberTop - 25, 16, pistonY - chamberTop + 25);

      // 4. Burner / Cooling Base Heat Elements
      const baseMidX = chamberLeft + chamberWidth / 2;
      const baseY = chamberTop + chamberHeight + 10;

      if (tempK > 280) {
        // Flame Burner
        for (let i = -3; i <= 3; i++) {
          const fx = baseMidX + i * 22;
          const flameH = 18 + Math.sin(t * 15 + i) * 6;
          const flameGrad = ctx.createLinearGradient(fx, baseY, fx, baseY + flameH);
          flameGrad.addColorStop(0, '#f97316');
          flameGrad.addColorStop(1, '#e11d48');
          ctx.fillStyle = flameGrad;
          ctx.beginPath();
          ctx.moveTo(fx - 6, baseY + flameH);
          ctx.lineTo(fx + 6, baseY + flameH);
          ctx.quadraticCurveTo(fx, baseY, fx, baseY);
          ctx.fill();
        }
      } else {
        // Cryo Ice Cooling
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 12px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('❄️ REFRIGERATION ACTIVE', baseMidX, baseY + 20);
      }

      // 5. Analog Pressure Gauge (Dial Meter)
      const gaugeCenterX = width * 0.78;
      const gaugeCenterY = height * 0.42;
      const gaugeR = 64;

      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(gaugeCenterX, gaugeCenterY, gaugeR, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Gauge dial markings
      for (let a = -Math.PI * 0.75; a <= Math.PI * 0.75; a += Math.PI * 0.15) {
        const x1 = gaugeCenterX + Math.cos(a) * (gaugeR - 12);
        const y1 = gaugeCenterY + Math.sin(a) * (gaugeR - 12);
        const x2 = gaugeCenterX + Math.cos(a) * (gaugeR - 4);
        const y2 = gaugeCenterY + Math.sin(a) * (gaugeR - 4);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // Gauge Needle
      const needleAngle = -Math.PI * 0.75 + Math.min(pressureAtm / 5, 1) * Math.PI * 1.5;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(gaugeCenterX, gaugeCenterY);
      ctx.lineTo(gaugeCenterX + Math.cos(needleAngle) * (gaugeR - 14), gaugeCenterY + Math.sin(needleAngle) * (gaugeR - 14));
      ctx.stroke();

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 12px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PRESSURE', gaugeCenterX, gaugeCenterY - 20);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(`${pressureAtm.toFixed(2)} atm`, gaugeCenterX, gaugeCenterY + 28);

      // Temperature Thermometer Bar
      const thermoX = width * 0.65;
      const thermoY = height * 0.22;
      const thermoH = 140;
      const thermoW = 18;

      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(thermoX, thermoY, thermoW, thermoH, 8);
      ctx.fill();
      ctx.stroke();

      const tempFillH = Math.min(Math.max((tempK - 100) / 500, 0.1), 0.95) * thermoH;
      ctx.fillStyle = heatFactor > 0.5 ? '#f97316' : '#38bdf8';
      ctx.beginPath();
      ctx.roundRect(thermoX + 2, thermoY + thermoH - tempFillH, thermoW - 4, tempFillH - 2, 6);
      ctx.fill();

      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(`T = ${tempK.toFixed(0)} K`, thermoX + 10, thermoY + thermoH + 18);

      // Top Status Overlay
      const hudW = 240;
      const hudH = 64;
      const hudX = width - hudW - 16;
      const hudY = 16;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(hudX, hudY, hudW, hudH, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f97316';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(experiment.title?.en || 'THERMODYNAMICS SIMULATION', hudX + 12, hudY + 20);

      ctx.font = 'bold 13px monospace';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(experiment.physicalLaw || 'P · V = n · R · T', hudX + 12, hudY + 40);

      ctx.font = '10px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`Piston V = ${volumeParam.toFixed(1)} L | Active 60fps`, hudX + 12, hudY + 55);

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
