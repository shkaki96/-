import React, { useEffect, useRef } from 'react';
import { Experiment } from '../../../types/experiment';

export interface GenericPhysicsCanvasProps {
  experiment: Experiment;
  params: Record<string, number>;
  isRunning?: boolean;
  onOutputsUpdate?: (outputs: Record<string, number>) => void;
}

export const GenericPhysicsCanvas: React.FC<GenericPhysicsCanvasProps> = ({
  experiment,
  params,
  isRunning = true,
  onOutputsUpdate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const stateDataRef = useRef<Record<string, number>>({});

  const code = experiment.codeNumber || 1;
  const category = experiment.category || 'general';

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

      // Deep Dark Lab Canvas
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#040711');
      bgGrad.addColorStop(1, '#091322');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle Background Grid
      ctx.strokeStyle = 'rgba(30, 58, 95, 0.18)';
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

      const outputs: Record<string, number> = {};

      // -------------------------------------------------------------
      // 1. REFRACTION / SNELL'S LAW / OPTICS (e.g. Exp 36, 3, 14, 15, 16)
      // -------------------------------------------------------------
      if (category === 'optics' || code === 36 || code === 3 || code === 14) {
        const n1 = params.n1 ?? 1.0;
        const n2 = params.n2 ?? 1.5;
        const theta1Deg = params.incidentAngle ?? params.theta1 ?? params.var1 ?? 35;
        const theta1Rad = (theta1Deg * Math.PI) / 180;

        // Snell's law: n1 * sin(θ1) = n2 * sin(θ2) => sin(θ2) = (n1/n2) * sin(θ1)
        const sinTheta2 = (n1 / n2) * Math.sin(theta1Rad);
        const isTIR = Math.abs(sinTheta2) > 1.0;
        const theta2Rad = isTIR ? 0 : Math.asin(sinTheta2);
        const theta2Deg = (theta2Rad * 180) / Math.PI;
        const criticalAngleDeg = n1 > n2 ? (Math.asin(n2 / n1) * 180) / Math.PI : 90;

        outputs.refractedAngle = Number(theta2Deg.toFixed(2));
        outputs.criticalAngle = Number(criticalAngleDeg.toFixed(2));
        outputs.incidentAngle = Number(theta1Deg.toFixed(2));

        const midX = width * 0.48;
        const interfaceY = height * 0.52;

        // Medium 1 (Top) & Medium 2 (Bottom)
        ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
        ctx.fillRect(0, 0, width, interfaceY);

        ctx.fillStyle = 'rgba(14, 116, 144, 0.22)';
        ctx.fillRect(0, interfaceY, width, height - interfaceY);

        // Interface Boundary Line
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(0, interfaceY);
        ctx.lineTo(width, interfaceY);
        ctx.stroke();

        // Normal Line (Vertical dashed)
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(midX, 20);
        ctx.lineTo(midX, height - 20);
        ctx.stroke();
        ctx.setLineDash([]);

        // Ray Length
        const rayLen = Math.min(width, height) * 0.38;

        // Incident Ray (Yellow)
        const incStartX = midX - rayLen * Math.sin(theta1Rad);
        const incStartY = interfaceY - rayLen * Math.cos(theta1Rad);

        ctx.save();
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(incStartX, incStartY);
        ctx.lineTo(midX, interfaceY);
        ctx.stroke();
        ctx.restore();

        // Refracted or Totally Reflected Ray
        ctx.save();
        if (!isTIR) {
          const refEndX = midX + rayLen * Math.sin(theta2Rad);
          const refEndY = interfaceY + rayLen * Math.cos(theta2Rad);

          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 3;
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.moveTo(midX, interfaceY);
          ctx.lineTo(refEndX, refEndY);
          ctx.stroke();

          // Refraction angle arc
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(midX, interfaceY, 35, Math.PI / 2, Math.PI / 2 + theta2Rad);
          ctx.stroke();
          ctx.font = 'bold 11px monospace';
          ctx.fillStyle = '#38bdf8';
          ctx.fillText(`θ₂ = ${theta2Deg.toFixed(1)}°`, midX + 42, interfaceY + 28);
        } else {
          // Total Internal Reflection
          const tirEndX = midX + rayLen * Math.sin(theta1Rad);
          const tirEndY = interfaceY - rayLen * Math.cos(theta1Rad);

          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 3;
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.moveTo(midX, interfaceY);
          ctx.lineTo(tirEndX, tirEndY);
          ctx.stroke();
        }
        ctx.restore();

        // Labels
        ctx.font = 'bold 12px system-ui, sans-serif';
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText(`Medium 1 (n₁ = ${n1})`, 25, interfaceY - 20);
        ctx.fillStyle = '#67e8f9';
        ctx.fillText(`Medium 2 (n₂ = ${n2})`, 25, interfaceY + 30);
      }

      // -------------------------------------------------------------
      // 2. DOUBLE-SLIT INTERFERENCE / YOUNG'S WAVE OPTICS (e.g. Exp 30, 17, 18, 41)
      // -------------------------------------------------------------
      else if (code === 30 || code === 17 || code === 18 || code === 41 || category === 'waves') {
        const wavelengthNm = params.wavelength ?? params.lambda ?? 532; // Green laser default
        const slitDistUm = params.slitDistance ?? params.d ?? 50; // μm
        const screenDistM = params.screenDistance ?? params.D ?? 1.5; // m

        const lambdaM = wavelengthNm * 1e-9;
        const dM = slitDistUm * 1e-6;
        const fringeSpacingMm = ((lambdaM * screenDistM) / dM) * 1000;

        outputs.fringeSpacing = Number(fringeSpacingMm.toFixed(2));
        outputs.wavelength = wavelengthNm;
        outputs.slitDistance = slitDistUm;

        const laserX = 40;
        const barrierX = width * 0.35;
        const screenX = width * 0.78;
        const midY = height * 0.5;

        // Laser Source
        const laserColor =
          wavelengthNm < 450
            ? '#818cf8'
            : wavelengthNm < 500
            ? '#38bdf8'
            : wavelengthNm < 570
            ? '#4ade80'
            : wavelengthNm < 620
            ? '#facc15'
            : '#f43f5e';

        ctx.fillStyle = '#1e293b';
        ctx.fillRect(laserX - 20, midY - 15, 40, 30);
        ctx.strokeStyle = laserColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(laserX - 20, midY - 15, 40, 30);

        // Laser Beam
        ctx.strokeStyle = laserColor;
        ctx.lineWidth = 3;
        ctx.shadowColor = laserColor;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(laserX + 20, midY);
        ctx.lineTo(barrierX, midY);
        ctx.stroke();

        // Slit Barrier Wall
        ctx.fillStyle = '#475569';
        ctx.fillRect(barrierX, 20, 10, midY - 25);
        ctx.fillRect(barrierX, midY - 15, 10, 30);
        ctx.fillRect(barrierX, midY + 25, 10, height - midY - 45);

        // Wavefronts expanding from slits
        const numWaves = 6;
        for (let i = 0; i < numWaves; i++) {
          const r = ((t * 80 + i * 25) % 180) + 5;
          ctx.strokeStyle = `rgba(74, 222, 128, ${Math.max(0, 1 - r / 180)})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(barrierX + 10, midY - 20, r, -Math.PI * 0.4, Math.PI * 0.4);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(barrierX + 10, midY + 20, r, -Math.PI * 0.4, Math.PI * 0.4);
          ctx.stroke();
        }

        // Screen Wall
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(screenX, 20, 8, height - 40);

        // Interference Fringes Pattern on Screen
        for (let y = 30; y < height - 30; y += 4) {
          const dy = y - midY;
          const phase = (2 * Math.PI * (dM / (screenDistM * 1000)) * (dy * 0.05)) / lambdaM;
          const intensity = Math.pow(Math.cos(phase), 2);

          ctx.fillStyle = laserColor;
          ctx.globalAlpha = intensity;
          ctx.fillRect(screenX + 14, y, 22, 3);
        }
        ctx.globalAlpha = 1.0;

        // Fringe Spacing Label
        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = '#f8fafc';
        ctx.fillText(`Δy = ${fringeSpacingMm.toFixed(2)} mm`, screenX - 90, midY - 50);
      }

      // -------------------------------------------------------------
      // 3. HOOKE'S LAW / SPRING MASS (e.g. Exp 25)
      // -------------------------------------------------------------
      else if (code === 25 || (category === 'mechanics' && params.springConstant !== undefined)) {
        const k = params.springConstant ?? params.k ?? 50; // N/m
        const m = params.mass ?? params.m ?? 2.0; // kg
        const omega = Math.sqrt(k / m);
        const period = (2 * Math.PI) / omega;
        const amplitude = 35;
        const currentDisplacement = amplitude * Math.cos(omega * t);
        const restoringForce = -k * (currentDisplacement / 100);

        outputs.period = Number(period.toFixed(2));
        outputs.restoringForce = Number(restoringForce.toFixed(2));
        outputs.frequency = Number((1 / period).toFixed(2));

        const anchorX = width * 0.48;
        const anchorY = 30;
        const springBaseLen = 140;
        const massY = anchorY + springBaseLen + currentDisplacement;

        // Ceiling Anchor
        ctx.fillStyle = '#475569';
        ctx.fillRect(anchorX - 45, anchorY - 10, 90, 10);

        // Zig-zag Spring Coil
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(anchorX, anchorY);
        const numCoils = 14;
        const coilStep = (massY - anchorY) / numCoils;
        for (let i = 1; i < numCoils; i++) {
          const cx = anchorX + (i % 2 === 0 ? 18 : -18);
          const cy = anchorY + i * coilStep;
          ctx.lineTo(cx, cy);
        }
        ctx.lineTo(anchorX, massY);
        ctx.stroke();

        // Hanging Mass Block
        const massW = 55;
        const massH = 45;
        ctx.fillStyle = '#0284c7';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(anchorX - massW / 2, massY, massW, massH, 8);
        ctx.fill();
        ctx.stroke();

        ctx.font = 'bold 12px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(`${m} kg`, anchorX, massY + 26);
      }

      // -------------------------------------------------------------
      // 4. COULOMB'S LAW & ELECTROSTATICS (e.g. Exp 4)
      // -------------------------------------------------------------
      else if (code === 4 || category === 'electromagnetism') {
        const q1 = params.charge1 ?? params.q1 ?? 10; // μC
        const q2 = params.charge2 ?? params.q2 ?? 20; // μC
        const rCm = params.distance ?? params.r ?? 10; // cm

        const rM = rCm * 0.01;
        const kE = 8.98755e9;
        const force = (kE * Math.abs(q1 * 1e-6 * (q2 * 1e-6))) / (rM * rM);
        const isRepulsive = q1 * q2 > 0;

        outputs.coulombForce = Number(force.toFixed(2));
        outputs.distance = rCm;

        const midY = height * 0.5;
        const distPx = Math.min(width * 0.55, Math.max(100, rCm * 14));
        const c1X = width * 0.5 - distPx / 2;
        const c2X = width * 0.5 + distPx / 2;

        // Draw Field Lines between charges
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.lineWidth = 1;
        for (let i = -3; i <= 3; i++) {
          ctx.beginPath();
          ctx.moveTo(c1X, midY);
          ctx.bezierCurveTo(
            c1X + distPx * 0.3,
            midY + i * 35,
            c2X - distPx * 0.3,
            midY + i * 35,
            c2X,
            midY
          );
          ctx.stroke();
        }

        // Charge 1 Sphere
        const r1Color = q1 >= 0 ? '#ef4444' : '#3b82f6';
        ctx.save();
        ctx.fillStyle = r1Color;
        ctx.shadowColor = r1Color;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(c1X, midY, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.font = 'bold 13px system-ui, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(q1 >= 0 ? `+${q1}μC` : `${q1}μC`, c1X, midY + 5);

        // Charge 2 Sphere
        const r2Color = q2 >= 0 ? '#ef4444' : '#3b82f6';
        ctx.save();
        ctx.fillStyle = r2Color;
        ctx.shadowColor = r2Color;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(c2X, midY, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.font = 'bold 13px system-ui, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(q2 >= 0 ? `+${q2}μC` : `${q2}μC`, c2X, midY + 5);

        // Force Vector Arrows
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        if (isRepulsive) {
          ctx.moveTo(c1X, midY);
          ctx.lineTo(c1X - 50, midY);
          ctx.moveTo(c2X, midY);
          ctx.lineTo(c2X + 50, midY);
        } else {
          ctx.moveTo(c1X, midY);
          ctx.lineTo(c1X + 50, midY);
          ctx.moveTo(c2X, midY);
          ctx.lineTo(c2X - 50, midY);
        }
        ctx.stroke();

        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = '#fbbf24';
        ctx.fillText(`F = ${force.toFixed(1)} N (${isRepulsive ? 'Repulsion' : 'Attraction'})`, width * 0.5, midY - 60);
      }

      // -------------------------------------------------------------
      // 5. MODERN PHYSICS / PHOTOELECTRIC & NUCLEAR (e.g. Exp 68, 69)
      // -------------------------------------------------------------
      else if (code === 68 || code === 69 || category === 'nuclear' || category === 'modern') {
        const wavelengthNm = params.wavelength ?? 275;
        const workFunctionEv = params.workFunction ?? 2.3;
        const photonEnergyEv = 1240 / wavelengthNm;
        const kineticEnergyEv = Math.max(0, photonEnergyEv - workFunctionEv);
        const stoppingVolt = kineticEnergyEv;

        outputs.stoppingVoltage = Number(stoppingVolt.toFixed(2));
        outputs.kineticEnergy = Number(kineticEnergyEv.toFixed(2));
        outputs.photonEnergy = Number(photonEnergyEv.toFixed(2));

        const metalPlateX = width * 0.35;
        const collectorPlateX = width * 0.72;
        const tubeY = height * 0.5;

        // Vacuum Chamber Outline
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 2;
        ctx.strokeRect(width * 0.2, tubeY - 80, width * 0.6, 160);

        // Emitter Plate
        ctx.fillStyle = '#64748b';
        ctx.fillRect(metalPlateX, tubeY - 50, 10, 100);

        // Collector Plate
        ctx.fillStyle = '#475569';
        ctx.fillRect(collectorPlateX, tubeY - 50, 10, 100);

        // Incoming Photon Packets (Wavy rays)
        for (let i = -1; i <= 1; i++) {
          const py = tubeY + i * 25;
          ctx.strokeStyle = '#a855f7';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(metalPlateX - 80, py - 30);
          ctx.lineTo(metalPlateX, py);
          ctx.stroke();
        }

        // Ejected Photoelectrons (Cyan animated particles)
        if (kineticEnergyEv > 0) {
          const numElectrons = 6;
          for (let i = 0; i < numElectrons; i++) {
            const ex = metalPlateX + 12 + ((t * 90 + i * 40) % (collectorPlateX - metalPlateX - 20));
            const ey = tubeY - 30 + i * 12;

            ctx.fillStyle = '#38bdf8';
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(ex, ey, 3.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // -------------------------------------------------------------
      // 6. DEFAULT GENERAL PHYSICS SYSTEM (Vectors & Kinematic Field)
      // -------------------------------------------------------------
      else {
        const val = params.var1 ?? 50;
        const orbRadius = 60 + val * 0.6;
        const midX = width * 0.48;
        const midY = height * 0.52;

        outputs.out1 = Number((val * 1.414).toFixed(2));

        // Central Orbit Track
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.arc(midX, midY, orbRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Central Core
        ctx.fillStyle = '#0284c7';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(midX, midY, 20, 0, Math.PI * 2);
        ctx.fill();

        // Orbiting Satellite Body
        const orbX = midX + Math.cos(t * 1.5) * orbRadius;
        const orbY = midY + Math.sin(t * 1.5) * orbRadius;

        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(orbX, orbY, 12, 0, Math.PI * 2);
        ctx.fill();

        // Velocity Tangent Vector
        const vx = -Math.sin(t * 1.5) * 35;
        const vy = Math.cos(t * 1.5) * 35;
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(orbX, orbY);
        ctx.lineTo(orbX + vx, orbY + vy);
        ctx.stroke();
      }

      // -------------------------------------------------------------
      // Universally Render Live Physics HUD Badge on Top Right
      // -------------------------------------------------------------
      const hudW = 240;
      const hudH = 68;
      const hudX = width - hudW - 16;
      const hudY = 16;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(hudX, hudY, hudW, hudH, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(
        (experiment.physicalLaw || experiment.title.en || 'PHYSICS SIMULATION').toUpperCase(),
        hudX + 12,
        hudY + 22
      );

      ctx.font = 'bold 14px monospace';
      ctx.fillStyle = '#f8fafc';
      const metricKeys = Object.keys(outputs);
      if (metricKeys.length > 0) {
        ctx.fillText(`${metricKeys[0]}: ${outputs[metricKeys[0]]}`, hudX + 12, hudY + 44);
      } else {
        ctx.fillText(`State: Active`, hudX + 12, hudY + 44);
      }

      ctx.font = '10px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`Category: ${category.toUpperCase()}`, hudX + 12, hudY + 59);

      // Report outputs
      stateDataRef.current = outputs;

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [code, category, params, isRunning, experiment]);

  const lastOutputsJsonRef = useRef('');
  const onOutputsUpdateRef = useRef(onOutputsUpdate);
  useEffect(() => {
    onOutputsUpdateRef.current = onOutputsUpdate;
  }, [onOutputsUpdate]);

  // Push output updates to parent
  useEffect(() => {
    const json = JSON.stringify(stateDataRef.current);
    if (json !== lastOutputsJsonRef.current) {
      lastOutputsJsonRef.current = json;
      onOutputsUpdateRef.current?.(stateDataRef.current);
    }
  }, [params]);

  return (
    <div className="relative w-full h-[320px] sm:h-[380px] md:h-[430px] rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
