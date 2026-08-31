import React, { useEffect, useRef } from 'react';
import { Experiment } from '../../../types/experiment';

export interface MechanicsEngineProps {
  experiment: Experiment;
  params: Record<string, number>;
  isRunning?: boolean;
  onOutputsUpdate?: (outputs: Record<string, number>) => void;
}

export const MechanicsEngine: React.FC<MechanicsEngineProps> = ({
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

  const code = experiment?.codeNumber || 1;
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

  // Perform physical output metrics calculation dynamically
  useEffect(() => {
    if (!onOutputsUpdate) return;
    const outputs: Record<string, number> = {};

    // 1. Projectile Motion (Exp 24)
    if (code === 24 || law.includes('sin(2θ)') || slug.includes('projectile')) {
      const v0 = getParam(['initialVelocity', 'v0', 'v_0', 'var1'], 25);
      const angleDeg = getParam(['launchAngle', 'theta', 'angle', 'var2'], 45);
      const g = getParam(['gravity', 'g', 'var3'], 9.8);
      const angleRad = (angleDeg * Math.PI) / 180;

      const timeOfFlight = (2 * v0 * Math.sin(angleRad)) / g;
      const maxRange = (Math.pow(v0, 2) * Math.sin(2 * angleRad)) / g;
      const maxHeight = Math.pow(v0 * Math.sin(angleRad), 2) / (2 * g);

      outputs.range = Number(maxRange.toFixed(2));
      outputs.maxHeight = Number(maxHeight.toFixed(2));
      outputs.flightTime = Number(timeOfFlight.toFixed(2));
      outputs.launchSpeed = v0;
      outputs.launchAngle = angleDeg;
    }
    // 2. Spring & Hooke's Law (Exp 25)
    else if (code === 25 || law.includes('k · x') || slug.includes('hooke') || slug.includes('spring')) {
      const k = getParam(['springConstant', 'k', 'var1'], 50);
      const mass = getParam(['mass', 'm', 'var2'], 1.2);
      const amplitude = getParam(['amplitude', 'x', 'displacement', 'var3'], 0.15);
      const g = 9.8;

      const omega = Math.sqrt(k / Math.max(mass, 0.05));
      const period = (2 * Math.PI) / omega;
      const maxForce = k * amplitude;
      const maxPE = 0.5 * k * Math.pow(amplitude, 2);

      outputs.period = Number(period.toFixed(2));
      outputs.frequency = Number((1 / period).toFixed(2));
      outputs.restoringForce = Number(maxForce.toFixed(2));
      outputs.potentialEnergy = Number(maxPE.toFixed(3));
      outputs.angularFrequency = Number(omega.toFixed(2));
    }
    // 3. Collisions & Linear Momentum (Exp 26)
    else if (code === 26 || law.includes('m₁·v₁') || slug.includes('collision') || slug.includes('momentum')) {
      const m1 = getParam(['m1', 'mass1', 'var1'], 2.0);
      const v1 = getParam(['v1', 'vel1', 'var2'], 4.0);
      const m2 = getParam(['m2', 'mass2', 'var3'], 1.5);
      const v2 = getParam(['v2', 'vel2'], 0.0);

      const totalMass = m1 + m2;
      const v1Final = ((m1 - m2) / totalMass) * v1 + ((2 * m2) / totalMass) * v2;
      const v2Final = ((2 * m1) / totalMass) * v1 + ((m2 - m1) / totalMass) * v2;
      const initialKE = 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2;

      outputs.finalVelocity1 = Number(v1Final.toFixed(2));
      outputs.finalVelocity2 = Number(v2Final.toFixed(2));
      outputs.totalMomentum = Number((m1 * v1 + m2 * v2).toFixed(2));
      outputs.totalEnergy = Number(initialKE.toFixed(2));
    }
    // 4. Pendulum & Rotational Dynamics / Harmonic Oscillation (Exp 1, 19, 20, 22)
    else {
      const lengthM = getParam(['length', 'L', 'var1'], 1.0);
      const g = getParam(['gravity', 'g', 'var2'], 9.8);
      const massKg = getParam(['mass', 'm', 'var3'], 0.5);
      const theta0Deg = getParam(['initialAngle', 'theta0', 'angle'], 20);

      const period = 2 * Math.PI * Math.sqrt(Math.max(lengthM, 0.05) / g);
      const frequency = 1 / period;
      const theta0Rad = (theta0Deg * Math.PI) / 180;
      const maxVelocity = Math.sqrt(2 * g * lengthM * (1 - Math.cos(theta0Rad)));
      const maxPotentialEnergy = massKg * g * lengthM * (1 - Math.cos(theta0Rad));

      outputs.period = Number(period.toFixed(2));
      outputs.frequency = Number(frequency.toFixed(2));
      outputs.maxVelocity = Number(maxVelocity.toFixed(2));
      outputs.potentialEnergy = Number(maxPotentialEnergy.toFixed(3));
      outputs.length = lengthM;
      outputs.gravity = g;
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
      bg.addColorStop(0, '#040711');
      bg.addColorStop(1, '#0b1329');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // Mechanics Grid
      ctx.strokeStyle = 'rgba(30, 58, 95, 0.2)';
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
      // SUB-RENDERER A: Projectile Motion (Exp 24)
      // -------------------------------------------------------------
      if (code === 24 || law.includes('sin(2θ)') || slug.includes('projectile')) {
        const v0 = getParam(['initialVelocity', 'v0', 'v_0', 'var1'], 25);
        const angleDeg = getParam(['launchAngle', 'theta', 'angle', 'var2'], 45);
        const g = getParam(['gravity', 'g', 'var3'], 9.8);
        const angleRad = (angleDeg * Math.PI) / 180;

        const originX = 60;
        const groundY = height - 60;
        const scaleX = (width - 120) / Math.max((v0 * v0 * Math.sin(2 * angleRad)) / g, 10);
        const scaleY = (height - 120) / Math.max((v0 * v0 * Math.pow(Math.sin(angleRad), 2)) / (2 * g), 5);
        const simScale = Math.min(scaleX, scaleY, 6.0);

        // Ground Platform
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(20, groundY, width - 40, 30);
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.strokeRect(20, groundY, width - 40, 30);

        // Parabolic trajectory trace
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        const totalT = (2 * v0 * Math.sin(angleRad)) / g;
        for (let st = 0; st <= totalT; st += 0.05) {
          const px = originX + v0 * Math.cos(angleRad) * st * simScale;
          const py = groundY - (v0 * Math.sin(angleRad) * st - 0.5 * g * st * st) * simScale;
          if (st === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Active projectile position
        const currentFlightT = totalT > 0 ? (t % (totalT + 0.8)) : 0;
        const isFlying = currentFlightT <= totalT;
        const activeT = isFlying ? currentFlightT : totalT;

        const ballX = originX + v0 * Math.cos(angleRad) * activeT * simScale;
        const ballY = groundY - (v0 * Math.sin(angleRad) * activeT - 0.5 * g * activeT * activeT) * simScale;

        // Projectile ball with glow
        ctx.fillStyle = '#f59e0b';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(ballX, ballY, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Cannon Launch Barrel
        ctx.save();
        ctx.translate(originX, groundY);
        ctx.rotate(-angleRad);
        ctx.fillStyle = '#64748b';
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.fillRect(0, -7, 36, 14);
        ctx.strokeRect(0, -7, 36, 14);
        ctx.restore();

        // Target Impact Marker
        const rangeDist = (v0 * v0 * Math.sin(2 * angleRad)) / g;
        const targetX = originX + rangeDist * simScale;
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(targetX, groundY, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = 'bold 11px system-ui, sans-serif';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(`R = ${rangeDist.toFixed(1)} m`, targetX - 25, groundY + 22);
      }

      // -------------------------------------------------------------
      // SUB-RENDERER B: Spring-Mass Oscillator (Exp 25)
      // -------------------------------------------------------------
      else if (code === 25 || law.includes('k · x') || slug.includes('hooke') || slug.includes('spring')) {
        const k = getParam(['springConstant', 'k', 'var1'], 50);
        const mass = getParam(['mass', 'm', 'var2'], 1.2);
        const amp = getParam(['amplitude', 'x', 'displacement', 'var3'], 0.15);

        const omega = Math.sqrt(k / Math.max(mass, 0.05));
        const disp = amp * Math.cos(omega * t);

        const wallX = 50;
        const centerY = height * 0.52;
        const restLength = width * 0.35;
        const massX = wallX + restLength + disp * 400;

        // Support Wall
        ctx.fillStyle = '#334155';
        ctx.fillRect(wallX - 16, centerY - 60, 16, 120);
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.strokeRect(wallX - 16, centerY - 60, 16, 120);

        // Spring Coils
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(wallX, centerY);
        const numCoils = 14;
        const coilSpacing = (massX - wallX) / numCoils;
        for (let i = 0; i < numCoils; i++) {
          const cx = wallX + (i + 0.5) * coilSpacing;
          const cy = centerY + (i % 2 === 0 ? -18 : 18);
          ctx.lineTo(cx, cy);
        }
        ctx.lineTo(massX, centerY);
        ctx.stroke();

        // Mass Block
        ctx.fillStyle = '#f59e0b';
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.fillRect(massX, centerY - 25, 50, 50);
        ctx.strokeRect(massX, centerY - 25, 50, 50);

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 11px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${mass.toFixed(1)} kg`, massX + 25, centerY + 5);

        // Velocity & Force vector arrows
        const vCurr = -amp * omega * Math.sin(omega * t);
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(massX + 25, centerY - 35);
        ctx.lineTo(massX + 25 + vCurr * 80, centerY - 35);
        ctx.stroke();
      }

      // -------------------------------------------------------------
      // SUB-RENDERER C: Harmonic Pendulum & Rotational Dynamics (Exp 1, 19, 20, 22)
      // -------------------------------------------------------------
      else {
        const lengthM = getParam(['length', 'L', 'var1'], 1.0);
        const g = getParam(['gravity', 'g', 'var2'], 9.8);
        const massKg = getParam(['mass', 'm', 'var3'], 0.5);
        const theta0Deg = getParam(['initialAngle', 'theta0', 'angle'], 20);

        const omega = Math.sqrt(g / Math.max(lengthM, 0.05));
        const theta0Rad = (theta0Deg * Math.PI) / 180;
        const currentTheta = isRunning ? theta0Rad * Math.cos(omega * t) : theta0Rad;

        const pivotX = width * 0.48;
        const pivotY = 50;
        const pixelLength = Math.min(height * 0.65, lengthM * 180);

        const bobX = pivotX + pixelLength * Math.sin(currentTheta);
        const bobY = pivotY + pixelLength * Math.cos(currentTheta);

        // Ceiling Mount
        ctx.fillStyle = '#334155';
        ctx.fillRect(pivotX - 50, pivotY - 12, 100, 12);
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.strokeRect(pivotX - 50, pivotY - 12, 100, 12);

        // Angle Protractor Arc
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(pivotX, pivotY, 50, Math.PI * 0.3, Math.PI * 0.7);
        ctx.stroke();

        // Vertical Reference Line
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(pivotX, pivotY);
        ctx.lineTo(pivotX, pivotY + pixelLength + 20);
        ctx.stroke();
        ctx.setLineDash([]);

        // Braided Cable Rod
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(pivotX, pivotY);
        ctx.lineTo(bobX, bobY);
        ctx.stroke();

        // Pivot Pin
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(pivotX, pivotY, 5, 0, Math.PI * 2);
        ctx.fill();

        // Spherical Metallic Bob with Glow
        const bobRadius = 14 + Math.min(massKg * 4, 12);
        const bobGrad = ctx.createRadialGradient(bobX - 4, bobY - 4, 2, bobX, bobY, bobRadius);
        bobGrad.addColorStop(0, '#fef08a');
        bobGrad.addColorStop(0.4, '#eab308');
        bobGrad.addColorStop(1, '#854d0e');

        ctx.fillStyle = bobGrad;
        ctx.shadowColor = '#eab308';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(bobX, bobY, bobRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Tangential Velocity Vector
        const currentVel = -omega * theta0Rad * Math.sin(omega * t);
        const tanAngle = currentTheta + Math.PI / 2;
        const vVectorLen = currentVel * 50;

        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(bobX, bobY);
        ctx.lineTo(bobX + Math.cos(tanAngle) * vVectorLen, bobY + Math.sin(tanAngle) * vVectorLen);
        ctx.stroke();

        // Live Angle Label
        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'center';
        ctx.fillText(`θ = ${((currentTheta * 180) / Math.PI).toFixed(1)}°`, pivotX, pivotY + 70);
      }

      // Universal Floating Mechanics HUD
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
      ctx.fillText(experiment.title?.en || 'MECHANICS SIMULATION', hudX + 12, hudY + 20);

      ctx.font = 'bold 13px monospace';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(experiment.physicalLaw || 'T = 2π√(L/g)', hudX + 12, hudY + 40);

      ctx.font = '10px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`Active Physics Engine | 60 FPS`, hudX + 12, hudY + 55);

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
