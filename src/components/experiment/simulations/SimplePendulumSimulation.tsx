import React, { useEffect, useRef } from 'react';

export interface SimplePendulumSimulationProps {
  params: Record<string, number>;
  isRunning?: boolean;
  onOutputsUpdate?: (outputs: Record<string, number>) => void;
}

export const SimplePendulumSimulation: React.FC<SimplePendulumSimulationProps> = ({
  params,
  isRunning = true,
  onOutputsUpdate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onOutputsUpdateRef = useRef(onOutputsUpdate);
  useEffect(() => {
    onOutputsUpdateRef.current = onOutputsUpdate;
  }, [onOutputsUpdate]);

  const stateRef = useRef({
    angle: 0.35, // radians (~20 deg)
    omega: 0,
    time: 0,
  });

  // Extract parameters
  const length = params.length ?? params.L ?? params.var1 ?? 1.0; // meters
  const mass = params.mass ?? params.m ?? 1.0; // kg
  const gravity = params.gravity ?? params.g ?? 9.81; // m/s^2
  const initialAngleDeg = params.initialAngle ?? params.theta0 ?? 25; // degrees

  const damping = 0.002; // slight air damping
  const omega0 = Math.sqrt(gravity / Math.max(0.1, length));
  const period = 2 * Math.PI * Math.sqrt(Math.max(0.1, length) / gravity);
  const frequency = 1 / period;

  // Report physical metrics safely when parameters change
  useEffect(() => {
    if (onOutputsUpdateRef.current) {
      const maxSpeed = Math.sqrt(2 * gravity * length * (1 - Math.cos((initialAngleDeg * Math.PI) / 180)));
      const maxKinetic = 0.5 * mass * maxSpeed * maxSpeed;
      onOutputsUpdateRef.current({
        period: Number(period.toFixed(3)),
        frequency: Number(frequency.toFixed(3)),
        length: Number(length.toFixed(2)),
        mass: Number(mass.toFixed(2)),
        gravity: Number(gravity.toFixed(2)),
        initialAngle: Number(initialAngleDeg.toFixed(1)),
        maxSpeed: Number(maxSpeed.toFixed(2)),
        totalEnergy: Number(maxKinetic.toFixed(3)),
      });
    }
  }, [length, mass, gravity, initialAngleDeg, period, frequency]);

  // Sync initial angle when parameter changes and not actively oscillating
  useEffect(() => {
    stateRef.current.angle = (initialAngleDeg * Math.PI) / 180;
    stateRef.current.omega = 0;
  }, [initialAngleDeg, length]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.04);
      lastTime = now;

      // Physics Integration (Verlet / Runge-Kutta step for pendulum ODE: d2θ/dt2 = -(g/L)sin(θ) - b*ω)
      if (isRunning) {
        stateRef.current.time += dt;
        const currentAngle = stateRef.current.angle;
        const currentOmega = stateRef.current.omega;

        const alpha = -(gravity / length) * Math.sin(currentAngle) - damping * currentOmega;
        stateRef.current.omega += alpha * dt;
        stateRef.current.angle += stateRef.current.omega * dt;
      }

      const angle = stateRef.current.angle;
      const omega = stateRef.current.omega;
      const angleDeg = (angle * 180) / Math.PI;

      // Physical Metrics
      const speed = Math.abs(omega * length); // m/s
      const kineticEnergy = 0.5 * mass * speed * speed; // Joules
      const heightAboveLowest = length * (1 - Math.cos(angle)); // meters
      const potentialEnergy = mass * gravity * heightAboveLowest; // Joules
      const totalEnergy = kineticEnergy + potentialEnergy;
      const tension = mass * (gravity * Math.cos(angle) + (speed * speed) / length); // Newtons
      const restoringForce = -mass * gravity * Math.sin(angle); // Newtons

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth || 800;
      const height = canvas.clientHeight || 400;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Dark Scientific Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#040711');
      bgGrad.addColorStop(1, '#0b1528');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const pivotX = width * 0.45;
      const pivotY = 40;
      const visualLength = Math.min(height * 0.65, 230) * Math.min(1.2, Math.max(0.6, length));

      // Bob coordinates
      const bobX = pivotX + visualLength * Math.sin(angle);
      const bobY = pivotY + visualLength * Math.cos(angle);
      const bobRadius = Math.max(16, Math.min(30, 18 + mass * 4));

      // 1. Angle Sector & Reference Dashed Line
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(pivotX, pivotY);
      ctx.lineTo(pivotX, pivotY + visualLength + 30);
      ctx.stroke();
      ctx.setLineDash([]);

      // Angular Arc
      const arcRadius = visualLength * 0.35;
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      if (angle >= 0) {
        ctx.arc(pivotX, pivotY, arcRadius, Math.PI / 2, Math.PI / 2 + angle);
      } else {
        ctx.arc(pivotX, pivotY, arcRadius, Math.PI / 2 + angle, Math.PI / 2);
      }
      ctx.stroke();

      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = '#f59e0b';
      ctx.textAlign = 'center';
      ctx.fillText(
        `θ = ${Math.abs(angleDeg).toFixed(1)}°`,
        pivotX + Math.sin(angle / 2) * (arcRadius + 18),
        pivotY + Math.cos(angle / 2) * (arcRadius + 18)
      );

      // 2. Pendulum Rod / String
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(pivotX, pivotY);
      ctx.lineTo(bobX, bobY);
      ctx.stroke();

      // 3. Oscillating Bob (Metallic Specular Shading)
      ctx.save();
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 14;

      const bobGrad = ctx.createRadialGradient(
        bobX - bobRadius * 0.3,
        bobY - bobRadius * 0.3,
        bobRadius * 0.1,
        bobX,
        bobY,
        bobRadius
      );
      bobGrad.addColorStop(0, '#e0f2fe');
      bobGrad.addColorStop(0.3, '#38bdf8');
      bobGrad.addColorStop(0.7, '#0284c7');
      bobGrad.addColorStop(1, '#0c4a6e');

      ctx.fillStyle = bobGrad;
      ctx.beginPath();
      ctx.arc(bobX, bobY, bobRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Bob mass label
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(`${mass} kg`, bobX, bobY + 4);

      // 4. Vectors (Velocity Vector & Restoring Force Vector)
      if (Math.abs(speed) > 0.05) {
        // Tangent Velocity Vector (Cyan)
        const vScale = 22;
        const vx = omega * length * Math.cos(angle) * vScale;
        const vy = -omega * length * Math.sin(angle) * vScale;

        ctx.save();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(bobX, bobY);
        ctx.lineTo(bobX + vx, bobY + vy);
        ctx.stroke();

        // Velocity Arrow Head
        const vHeadAngle = Math.atan2(vy, vx);
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(bobX + vx, bobY + vy);
        ctx.lineTo(
          bobX + vx - 10 * Math.cos(vHeadAngle - Math.PI / 6),
          bobY + vy - 10 * Math.sin(vHeadAngle - Math.PI / 6)
        );
        ctx.lineTo(
          bobX + vx - 10 * Math.cos(vHeadAngle + Math.PI / 6),
          bobY + vy - 10 * Math.sin(vHeadAngle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();

        ctx.font = 'bold 10px monospace';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(`v = ${speed.toFixed(2)} m/s`, bobX + vx + 10, bobY + vy);
        ctx.restore();
      }

      // Restoring Force Vector (Red/Orange)
      if (Math.abs(restoringForce) > 0.1) {
        const fScale = 4.5;
        const fx = restoringForce * Math.cos(angle) * fScale;
        const fy = -restoringForce * Math.sin(angle) * fScale;

        ctx.save();
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(bobX, bobY);
        ctx.lineTo(bobX + fx, bobY + fy);
        ctx.stroke();

        ctx.fillStyle = '#f43f5e';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(`F_rest = ${Math.abs(restoringForce).toFixed(1)} N`, bobX + fx + 10, bobY + fy + 14);
        ctx.restore();
      }

      // 5. Ceiling Mount & Pivot Bearing
      ctx.fillStyle = '#334155';
      ctx.fillRect(pivotX - 50, pivotY - 14, 100, 14);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.strokeRect(pivotX - 50, pivotY - 14, 100, 14);

      // Pivot Center Pin
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(pivotX, pivotY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 6. Real-time Energy Bars Overlay
      const barX = 20;
      const barY = height - 110;
      const maxBarW = 120;
      const maxEnergyRef = Math.max(0.1, totalEnergy * 1.2);

      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(barX - 8, barY - 12, maxBarW + 70, 95, 10);
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 10px system-ui, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'left';
      ctx.fillText('ENERGY SPECTRUM', barX, barY + 2);

      // Kinetic Energy Bar
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('Ek:', barX, barY + 24);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(barX + 24, barY + 15, maxBarW, 10);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(barX + 24, barY + 15, (kineticEnergy / maxEnergyRef) * maxBarW, 10);
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '9px monospace';
      ctx.fillText(`${kineticEnergy.toFixed(2)} J`, barX + maxBarW + 30, barY + 24);

      // Potential Energy Bar
      ctx.font = 'bold 10px system-ui, sans-serif';
      ctx.fillStyle = '#eab308';
      ctx.fillText('Ep:', barX, barY + 44);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(barX + 24, barY + 35, maxBarW, 10);
      ctx.fillStyle = '#eab308';
      ctx.fillRect(barX + 24, barY + 35, (potentialEnergy / maxEnergyRef) * maxBarW, 10);
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '9px monospace';
      ctx.fillText(`${potentialEnergy.toFixed(2)} J`, barX + maxBarW + 30, barY + 44);

      // Total Energy Bar
      ctx.font = 'bold 10px system-ui, sans-serif';
      ctx.fillStyle = '#22c55e';
      ctx.fillText('Et:', barX, barY + 64);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(barX + 24, barY + 55, maxBarW, 10);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(barX + 24, barY + 55, (totalEnergy / maxEnergyRef) * maxBarW, 10);
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '9px monospace';
      ctx.fillText(`${totalEnergy.toFixed(2)} J`, barX + maxBarW + 30, barY + 64);

      // 7. Right HUD Card
      const hudW = 220;
      const hudH = 75;
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
      ctx.font = 'bold 12px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('HARMONIC MOTION / PENDULUM', hudX + 12, hudY + 20);

      ctx.font = 'bold 14px monospace';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(`Period T = ${period.toFixed(3)} s`, hudX + 12, hudY + 42);

      ctx.font = '11px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`Freq f = ${frequency.toFixed(3)} Hz | L = ${length} m`, hudX + 12, hudY + 62);

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [length, mass, gravity, period, frequency, isRunning]);

  return (
    <div className="relative w-full h-[320px] sm:h-[380px] md:h-[430px] rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
