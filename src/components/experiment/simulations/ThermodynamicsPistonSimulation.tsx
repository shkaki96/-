import React, { useEffect, useRef } from 'react';

export interface ThermodynamicsPistonSimulationProps {
  params: Record<string, number>;
  isRunning?: boolean;
  onOutputsUpdate?: (outputs: Record<string, number>) => void;
}

interface GasParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export const ThermodynamicsPistonSimulation: React.FC<ThermodynamicsPistonSimulationProps> = ({
  params,
  isRunning = true,
  onOutputsUpdate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<GasParticle[]>([]);
  const stateRef = useRef({
    pistonY: 200,
    targetPistonY: 200,
    flamePhase: 0,
    time: 0,
  });
  const lastOutputsJsonRef = useRef('');
  const onOutputsUpdateRef = useRef(onOutputsUpdate);
  useEffect(() => {
    onOutputsUpdateRef.current = onOutputsUpdate;
  }, [onOutputsUpdate]);

  // Extract parameters
  const heatAdded = params.heatAdded ?? params.Q ?? params.var1 ?? 400; // Joules
  const workDone = params.workDone ?? params.W ?? 150; // Joules
  const initialTemp = params.initialTemp ?? params.T0 ?? 300; // Kelvin
  const gasMoles = params.moles ?? params.n ?? 0.1; // mol

  // Physics calculation: First Law of Thermodynamics ΔU = Q - W
  const deltaU = heatAdded - workDone; // Joules
  // ΔU = n * Cv * ΔT => ΔT = ΔU / (n * Cv), for ideal monoatomic gas Cv = 3/2 R ≈ 12.47 J/(mol K)
  const Cv = 12.47;
  const deltaT = deltaU / (gasMoles * Cv);
  const finalTemp = Math.max(10, initialTemp + deltaT);
  const R = 8.314;
  // Volume: initial V0 = 2.0 L, piston movement scales with work done and thermal expansion
  const baseVolume = 2.5; // Liters
  const volume = Math.max(0.8, Math.min(5.0, baseVolume + (workDone / 500) * 1.2));
  // Pressure P = (n R T) / V in kPa
  const pressureKPa = (gasMoles * R * finalTemp) / (volume * 0.001) / 1000;

  // Report outputs upward
  useEffect(() => {
    const outputs = {
      deltaU: Number(deltaU.toFixed(1)),
      internalEnergy: Number(deltaU.toFixed(1)),
      finalTemp: Number(finalTemp.toFixed(1)),
      temperature: Number(finalTemp.toFixed(1)),
      pressure: Number(pressureKPa.toFixed(1)),
      volume: Number(volume.toFixed(2)),
      workDone: Number(workDone.toFixed(1)),
      heatAdded: Number(heatAdded.toFixed(1)),
    };
    const json = JSON.stringify(outputs);
    if (json !== lastOutputsJsonRef.current) {
      lastOutputsJsonRef.current = json;
      onOutputsUpdateRef.current?.(outputs);
    }
  }, [deltaU, finalTemp, pressureKPa, volume, workDone, heatAdded]);

  // Initialize gas particles
  useEffect(() => {
    const numParticles = 45;
    const particles: GasParticle[] = [];
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * 200 + 50,
        y: Math.random() * 120 + 200,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        radius: Math.random() * 1.5 + 3,
      });
    }
    particlesRef.current = particles;
  }, []);

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
        stateRef.current.time += dt;
        stateRef.current.flamePhase += dt * 8;
      }

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth || 800;
      const height = canvas.clientHeight || 400;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#040812');
      bgGrad.addColorStop(1, '#091322');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Chamber Bounds
      const chamberW = Math.min(width * 0.38, 260);
      const chamberH = Math.min(height * 0.68, 260);
      const chamberX = width * 0.34;
      const chamberBottomY = height * 0.82;
      const chamberTopY = chamberBottomY - chamberH;

      // Piston target position based on volume
      const minPistonY = chamberTopY + 25;
      const maxPistonY = chamberBottomY - 40;
      const volFraction = (volume - 0.8) / (5.0 - 0.8);
      const targetY = maxPistonY - volFraction * (maxPistonY - minPistonY);
      stateRef.current.pistonY += (targetY - stateRef.current.pistonY) * 0.1;
      const currentPistonY = stateRef.current.pistonY;

      // 1. Burner & Heat Source Beneath Cylinder
      const burnerX = chamberX + chamberW / 2;
      const burnerY = chamberBottomY + 28;
      const hasHeat = heatAdded > 0;
      const isCooling = heatAdded < 0;

      if (hasHeat) {
        const flameIntensity = Math.min(1, Math.abs(heatAdded) / 600);
        const flameH = 26 * flameIntensity;
        ctx.save();
        ctx.shadowColor = '#f97316';
        ctx.shadowBlur = 18 * flameIntensity;

        // Draw multiple flame tongues
        for (let i = -2; i <= 2; i++) {
          const fx = burnerX + i * 18;
          const sway = Math.sin(stateRef.current.flamePhase + i) * 5;
          const flameGrad = ctx.createLinearGradient(fx, burnerY, fx + sway, burnerY - flameH);
          flameGrad.addColorStop(0, '#f97316');
          flameGrad.addColorStop(0.4, '#eab308');
          flameGrad.addColorStop(1, 'rgba(255, 255, 255, 0.9)');

          ctx.fillStyle = flameGrad;
          ctx.beginPath();
          ctx.moveTo(fx - 10, burnerY);
          ctx.quadraticCurveTo(fx + sway, burnerY - flameH, fx, burnerY - flameH * 1.2);
          ctx.quadraticCurveTo(fx + sway * 0.5, burnerY - flameH, fx + 10, burnerY);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      } else if (isCooling) {
        // Draw ice cooling block
        ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.strokeRect(chamberX + 20, chamberBottomY + 6, chamberW - 40, 20);
        ctx.fillRect(chamberX + 20, chamberBottomY + 6, chamberW - 40, 20);
        ctx.fillStyle = '#bae6fd';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('ICE HEAT SINK (Q < 0)', burnerX, chamberBottomY + 20);
      }

      // Burner Stand
      ctx.fillStyle = '#334155';
      ctx.fillRect(burnerX - 55, burnerY + 2, 110, 8);
      ctx.fillRect(burnerX - 45, burnerY + 10, 10, 20);
      ctx.fillRect(burnerX + 35, burnerY + 10, 10, 20);

      // 2. Insulated Cylinder Chamber (Walls)
      ctx.save();
      // Thick outer chamber border
      ctx.lineWidth = 10;
      ctx.strokeStyle = '#475569';
      ctx.beginPath();
      ctx.moveTo(chamberX, chamberTopY);
      ctx.lineTo(chamberX, chamberBottomY);
      ctx.lineTo(chamberX + chamberW, chamberBottomY);
      ctx.lineTo(chamberX + chamberW, chamberTopY);
      ctx.stroke();

      // Transparent Gas Cavity
      const tempNormalized = Math.min(1, Math.max(0, (finalTemp - 200) / 600));
      const gasGrad = ctx.createLinearGradient(0, currentPistonY, 0, chamberBottomY);
      gasGrad.addColorStop(
        0,
        `rgba(${Math.floor(50 + 200 * tempNormalized)}, ${Math.floor(100 - 40 * tempNormalized)}, ${Math.floor(220 - 180 * tempNormalized)}, 0.25)`
      );
      gasGrad.addColorStop(
        1,
        `rgba(${Math.floor(180 * tempNormalized)}, ${Math.floor(50)}, ${Math.floor(180 - 140 * tempNormalized)}, 0.45)`
      );
      ctx.fillStyle = gasGrad;
      ctx.fillRect(
        chamberX + 5,
        currentPistonY + 14,
        chamberW - 10,
        chamberBottomY - currentPistonY - 14
      );

      // Volume tick marks along right wall
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      for (let v = 1; v <= 5; v++) {
        const vFraction = (v - 0.8) / (5.0 - 0.8);
        const vy = maxPistonY - vFraction * (maxPistonY - minPistonY);
        ctx.beginPath();
        ctx.moveTo(chamberX + chamberW - 14, vy);
        ctx.lineTo(chamberX + chamberW - 4, vy);
        ctx.stroke();

        ctx.font = '9px monospace';
        ctx.fillStyle = '#cbd5e1';
        ctx.textAlign = 'right';
        ctx.fillText(`${v}L`, chamberX + chamberW - 16, vy + 3);
      }
      ctx.restore();

      // 3. Dynamic Gas Molecules
      const speedFactor = Math.sqrt(finalTemp / 300);
      const particles = particlesRef.current;
      const pMinX = chamberX + 12;
      const pMaxX = chamberX + chamberW - 12;
      const pMinY = currentPistonY + 22;
      const pMaxY = chamberBottomY - 8;

      ctx.save();
      particles.forEach((p) => {
        if (isRunning) {
          p.x += p.vx * speedFactor;
          p.y += p.vy * speedFactor;

          if (p.x <= pMinX) {
            p.x = pMinX;
            p.vx = Math.abs(p.vx);
          } else if (p.x >= pMaxX) {
            p.x = pMaxX;
            p.vx = -Math.abs(p.vx);
          }

          if (p.y <= pMinY) {
            p.y = pMinY;
            p.vy = Math.abs(p.vy);
          } else if (p.y >= pMaxY) {
            p.y = pMaxY;
            p.vy = -Math.abs(p.vy);
          }
        }

        // Particle Glow
        const particleColor =
          finalTemp > 450 ? '#f87171' : finalTemp > 320 ? '#fbbf24' : '#38bdf8';
        ctx.fillStyle = particleColor;
        ctx.shadowColor = particleColor;
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // 4. Moving Metallic Piston & Rod
      ctx.save();
      const pistonH = 18;
      const pistonGrad = ctx.createLinearGradient(
        chamberX,
        currentPistonY,
        chamberX + chamberW,
        currentPistonY
      );
      pistonGrad.addColorStop(0, '#94a3b8');
      pistonGrad.addColorStop(0.3, '#f1f5f9');
      pistonGrad.addColorStop(0.7, '#64748b');
      pistonGrad.addColorStop(1, '#334155');

      ctx.fillStyle = pistonGrad;
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      ctx.fillRect(chamberX + 4, currentPistonY, chamberW - 8, pistonH);
      ctx.strokeRect(chamberX + 4, currentPistonY, chamberW - 8, pistonH);

      // Piston Rod
      const rodW = 16;
      const rodH = currentPistonY - chamberTopY + 30;
      const rodX = chamberX + chamberW / 2 - rodW / 2;
      const rodY = currentPistonY - rodH;
      const rodGrad = ctx.createLinearGradient(rodX, 0, rodX + rodW, 0);
      rodGrad.addColorStop(0, '#64748b');
      rodGrad.addColorStop(0.5, '#e2e8f0');
      rodGrad.addColorStop(1, '#475569');

      ctx.fillStyle = rodGrad;
      ctx.fillRect(rodX, rodY, rodW, rodH);
      ctx.strokeRect(rodX, rodY, rodW, rodH);

      // Top Piston Handle
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.roundRect(rodX - 20, rodY - 10, rodW + 40, 12, 4);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // 5. Dial Pressure Gauge on Chamber Left
      const gaugeX = chamberX - 55;
      const gaugeY = currentPistonY + 40;
      const gaugeR = 32;

      ctx.save();
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(gaugeX, gaugeY, gaugeR, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Needle dial arc
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(gaugeX, gaugeY, gaugeR - 6, Math.PI * 0.75, Math.PI * 2.25);
      ctx.stroke();

      // Needle angle based on pressure
      const maxPressure = 800; // kPa
      const pFraction = Math.min(1, Math.max(0, pressureKPa / maxPressure));
      const needleAngle = Math.PI * 0.75 + pFraction * (Math.PI * 1.5);

      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.moveTo(gaugeX, gaugeY);
      ctx.lineTo(gaugeX + Math.cos(needleAngle) * (gaugeR - 8), gaugeY + Math.sin(needleAngle) * (gaugeR - 8));
      ctx.stroke();

      // Pivot cap
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(gaugeX, gaugeY, 4, 0, Math.PI * 2);
      ctx.fill();

      // Gauge Label
      ctx.font = 'bold 9px system-ui, sans-serif';
      ctx.fillStyle = '#38bdf8';
      ctx.textAlign = 'center';
      ctx.fillText('PRESSURE', gaugeX, gaugeY + 18);
      ctx.font = 'bold 9px monospace';
      ctx.fillStyle = '#f1f5f9';
      ctx.fillText(`${pressureKPa.toFixed(0)} kPa`, gaugeX, gaugeY - 14);
      ctx.restore();

      // 6. Floating Thermodynamics HUD Card
      const hudW = 250;
      const hudH = 92;
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
      ctx.fillText('FIRST LAW: ΔU = Q - W', hudX + 12, hudY + 20);

      ctx.font = 'bold 14px monospace';
      ctx.fillStyle = deltaU >= 0 ? '#4ade80' : '#f87171';
      ctx.fillText(`ΔU = ${deltaU >= 0 ? '+' : ''}${deltaU.toFixed(1)} J`, hudX + 12, hudY + 42);

      ctx.font = '11px monospace';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Q = ${heatAdded >= 0 ? '+' : ''}${heatAdded} J  |  W = ${workDone} J`, hudX + 12, hudY + 62);
      ctx.fillText(`Temp T = ${finalTemp.toFixed(1)} K  |  Vol V = ${volume.toFixed(2)} L`, hudX + 12, hudY + 80);

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [heatAdded, workDone, finalTemp, deltaU, pressureKPa, volume, isRunning]);

  return (
    <div className="relative w-full h-[320px] sm:h-[380px] md:h-[430px] rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
