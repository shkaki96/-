import React, { useEffect, useRef } from 'react';
import { Experiment } from '../../../types/experiment';

export interface ModernPhysicsEngineProps {
  experiment: Experiment;
  params: Record<string, number>;
  isRunning?: boolean;
  onOutputsUpdate?: (outputs: Record<string, number>) => void;
}

export const ModernPhysicsEngine: React.FC<ModernPhysicsEngineProps> = ({
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

  const code = experiment?.codeNumber || 32;
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

  // Perform physical quantum calculations dynamically
  useEffect(() => {
    if (!onOutputsUpdate) return;
    const outputs: Record<string, number> = {};

    // 1. Photoelectric Effect (Exp 68)
    if (code === 68 || law.includes('hf - φ') || slug.includes('photoelectric')) {
      const frequencyThz = getParam(['frequency', 'f', 'var1'], 650);
      const workFunctionEv = getParam(['workFunction', 'phi', 'var2'], 2.2);
      const h_eVs = 4.1357e-15;
      const photonEnergyEv = h_eVs * (frequencyThz * 1e12);
      const kMaxEv = Math.max(0, photonEnergyEv - workFunctionEv);
      const stoppingVoltage = kMaxEv;

      outputs.photonEnergy = Number(photonEnergyEv.toFixed(2));
      outputs.maxKineticEnergy = Number(kMaxEv.toFixed(2));
      outputs.stoppingPotential = Number(stoppingVoltage.toFixed(2));
      outputs.thresholdFrequency = Number(((workFunctionEv / h_eVs) / 1e12).toFixed(1));
    }
    // 2. Radioactive Decay & Half-Life (Exp 69)
    else if (code === 69 || law.includes('n_0') || slug.includes('decay') || slug.includes('half-life')) {
      const initialN = getParam(['initialCount', 'N0', 'var1'], 1000);
      const halfLifeSec = getParam(['halfLife', 't_half', 'var2'], 10);
      const elapsedSec = getParam(['time', 't', 'var3'], 5);
      const decayConstant = 0.69315 / Math.max(halfLifeSec, 0.1);
      const remainingN = initialN * Math.exp(-decayConstant * elapsedSec);
      const activityBq = decayConstant * remainingN;

      outputs.remainingNuclei = Number(remainingN.toFixed(0));
      outputs.decayConstant = Number(decayConstant.toFixed(4));
      outputs.activity = Number(activityBq.toFixed(1));
      outputs.halfLife = halfLifeSec;
    }
    // 3. Blackbody & Wien's Law (Exp 65)
    else if (code === 65 || law.includes('planck') || slug.includes('blackbody')) {
      const tempK = getParam(['temperature', 'T', 'var1'], 5500);
      const bWien = 2.8977719e-3; // m·K
      const peakLambdaNm = ((bWien / Math.max(tempK, 100)) * 1e9);
      const totalPowerW = 5.67e-8 * Math.pow(tempK, 4);

      outputs.peakWavelength = Number(peakLambdaNm.toFixed(1));
      outputs.totalEmissivePower = Number((totalPowerW / 1e6).toFixed(2)); // MW/m2
      outputs.temperature = tempK;
    }
    // 4. Atomic Bohr Transitions & Quantum Spectra / Nuclear Core (Exp 32, 37, 38, 39, 40)
    else {
      const nInitial = Math.round(getParam(['nInitial', 'n1', 'n_i', 'var1'], 3));
      const nFinal = Math.round(getParam(['nFinal', 'n2', 'n_f', 'var2'], 2));
      const z = Math.round(getParam(['atomicNumber', 'Z', 'var3'], 1));

      const rydbergEv = 13.6;
      const eInitial = -rydbergEv * (z * z) / Math.pow(Math.max(nInitial, 1), 2);
      const eFinal = -rydbergEv * (z * z) / Math.pow(Math.max(nFinal, 1), 2);
      const deltaE = Math.abs(eInitial - eFinal);
      const lambdaNm = deltaE > 0 ? 1239.84 / deltaE : 0;

      outputs.transitionEnergy = Number(deltaE.toFixed(2));
      outputs.emittedWavelength = Number(lambdaNm.toFixed(1));
      outputs.initialStateEnergy = Number(eInitial.toFixed(2));
      outputs.finalStateEnergy = Number(eFinal.toFixed(2));
      outputs.principalN1 = nInitial;
      outputs.principalN2 = nFinal;
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

      // Deep Space Quantum Nebula Background
      const bg = ctx.createLinearGradient(0, 0, 0, height);
      bg.addColorStop(0, '#030712');
      bg.addColorStop(1, '#110c22');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // Quantum Starfield / Lattice
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.15)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // -------------------------------------------------------------
      // SUB-RENDERER A: Photoelectric Effect (Exp 68)
      // -------------------------------------------------------------
      if (code === 68 || law.includes('hf - φ') || slug.includes('photoelectric')) {
        const freqThz = getParam(['frequency', 'f', 'var1'], 650);
        const workFnEv = getParam(['workFunction', 'phi', 'var2'], 2.2);
        const h_eVs = 4.1357e-15;
        const photonE = h_eVs * (freqThz * 1e12);
        const kMax = Math.max(0, photonE - workFnEv);

        const plateLeftX = width * 0.25;
        const plateRightX = width * 0.7;
        const plateY = height * 0.25;
        const plateH = height * 0.5;

        // Cathode Plate
        ctx.fillStyle = '#475569';
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        ctx.fillRect(plateLeftX, plateY, 14, plateH);
        ctx.strokeRect(plateLeftX, plateY, 14, plateH);

        // Anode Collector Plate
        ctx.fillRect(plateRightX, plateY, 14, plateH);
        ctx.strokeRect(plateRightX, plateY, 14, plateH);

        // Incoming UV/Optical Photons
        for (let i = 0; i < 4; i++) {
          const phX = (plateLeftX - 120 + ((t * 140 + i * 35) % 120));
          const phY = plateY + 40 + i * 40;

          ctx.strokeStyle = '#a855f7';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          for (let dx = -15; dx <= 15; dx += 2) {
            const dy = Math.sin(dx * 0.6 + t * 10) * 5;
            if (dx === -15) ctx.moveTo(phX + dx, phY + dy);
            else ctx.lineTo(phX + dx, phY + dy);
          }
          ctx.stroke();
        }

        // Ejected Photoelectrons (if photonE > workFn)
        if (kMax > 0 && isRunning) {
          const numElectrons = 6;
          for (let i = 0; i < numElectrons; i++) {
            const progress = (t * (kMax * 0.8 + 0.3) + i * 0.25) % 1;
            const ex = plateLeftX + 14 + progress * (plateRightX - plateLeftX - 14);
            const ey = plateY + 30 + (i * 35) + Math.sin(progress * Math.PI) * 10;

            ctx.fillStyle = '#38bdf8';
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(ex, ey, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }

        ctx.font = 'bold 11px system-ui, sans-serif';
        ctx.fillStyle = '#cbd5e1';
        ctx.textAlign = 'center';
        ctx.fillText('EMITTER CATHODE', plateLeftX + 7, plateY + plateH + 20);
        ctx.fillText('COLLECTOR ANODE', plateRightX + 7, plateY + plateH + 20);

        ctx.fillStyle = '#c084fc';
        ctx.fillText(`Photon E = ${photonE.toFixed(2)} eV`, plateLeftX - 50, plateY - 15);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(`K_max = ${kMax.toFixed(2)} eV`, (plateLeftX + plateRightX) / 2, plateY - 15);
      }

      // -------------------------------------------------------------
      // SUB-RENDERER B: Bohr Atomic Model & Quantum Transitions (Exp 32, 37, 38, 40)
      // -------------------------------------------------------------
      else {
        const atomCenterX = width * 0.44;
        const atomCenterY = height * 0.52;

        const nInitial = Math.round(getParam(['nInitial', 'n1', 'n_i', 'var1'], 3));
        const nFinal = Math.round(getParam(['nFinal', 'n2', 'n_f', 'var2'], 2));

        // Concentric Orbital Shells (n=1, n=2, n=3, n=4)
        const shellRadii = [35, 65, 100, 140];
        shellRadii.forEach((r, idx) => {
          const n = idx + 1;
          const isActive = n === nInitial || n === nFinal;
          ctx.strokeStyle = isActive ? '#a855f7' : 'rgba(148, 163, 184, 0.25)';
          ctx.lineWidth = isActive ? 2 : 1;
          ctx.setLineDash(isActive ? [5, 3] : [3, 3]);
          ctx.beginPath();
          ctx.arc(atomCenterX, atomCenterY, r, 0, Math.PI * 2);
          ctx.stroke();

          ctx.font = 'bold 10px monospace';
          ctx.fillStyle = isActive ? '#c084fc' : '#64748b';
          ctx.fillText(`n=${n}`, atomCenterX + r + 4, atomCenterY - 4);
        });
        ctx.setLineDash([]);

        // Atomic Nucleus (Dense Protons/Neutrons)
        const nucGrad = ctx.createRadialGradient(atomCenterX - 3, atomCenterY - 3, 2, atomCenterX, atomCenterY, 16);
        nucGrad.addColorStop(0, '#fca5a5');
        nucGrad.addColorStop(0.5, '#ef4444');
        nucGrad.addColorStop(1, '#991b1b');
        ctx.fillStyle = nucGrad;
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(atomCenterX, atomCenterY, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('+Ze', atomCenterX, atomCenterY + 3);

        // Orbiting Electron
        const targetRadius = shellRadii[Math.min(nInitial - 1, 3)] || 100;
        const electronAngle = t * 2.5;
        const eX = atomCenterX + Math.cos(electronAngle) * targetRadius;
        const eY = atomCenterY + Math.sin(electronAngle) * targetRadius;

        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(eX, eY, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Emitted Photon Wave Packet
        const photonStartDist = targetRadius;
        const photonDist = photonStartDist + (t * 60) % 180;
        const photonAngle = Math.PI * 0.25;
        const pX = atomCenterX + Math.cos(photonAngle) * photonDist;
        const pY = atomCenterY - Math.sin(photonAngle) * photonDist;

        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        for (let s = -20; s <= 20; s += 2) {
          const sx = pX + s * Math.cos(photonAngle);
          const sy = pY - s * Math.sin(photonAngle) + Math.sin(s * 0.8 + t * 12) * 6;
          if (s === -20) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Universal Floating Modern Physics HUD
      const hudW = 240;
      const hudH = 64;
      const hudX = width - hudW - 16;
      const hudY = 16;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(hudX, hudY, hudW, hudH, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#c084fc';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(experiment.title?.en || 'MODERN PHYSICS SIMULATION', hudX + 12, hudY + 20);

      ctx.font = 'bold 13px monospace';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(experiment.physicalLaw || 'ΔE = h · c / λ', hudX + 12, hudY + 40);

      ctx.font = '10px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`Quantum Engine | Active 60fps`, hudX + 12, hudY + 55);

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
