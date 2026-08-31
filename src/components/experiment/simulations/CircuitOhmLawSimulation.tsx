import React, { useEffect, useRef } from 'react';

export interface CircuitOhmLawSimulationProps {
  params: Record<string, number>;
  isRunning?: boolean;
  onOutputsUpdate?: (outputs: Record<string, number>) => void;
}

export const CircuitOhmLawSimulation: React.FC<CircuitOhmLawSimulationProps> = ({
  params,
  isRunning = true,
  onOutputsUpdate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animPhaseRef = useRef(0);
  const lastOutputsJsonRef = useRef('');
  const onOutputsUpdateRef = useRef(onOutputsUpdate);
  useEffect(() => {
    onOutputsUpdateRef.current = onOutputsUpdate;
  }, [onOutputsUpdate]);

  // Extract parameters
  const voltage = params.voltage ?? params.V ?? params.var1 ?? 12; // Volts
  const resistance = Math.max(0.5, params.resistance ?? params.R ?? 50); // Ohms

  // Ohm's Law: I = V / R, P = V * I
  const current = voltage / resistance; // Amperes
  const power = voltage * current; // Watts

  useEffect(() => {
    const outputs = {
      current: Number(current.toFixed(3)),
      power: Number(power.toFixed(2)),
      voltage: Number(voltage.toFixed(2)),
      resistance: Number(resistance.toFixed(1)),
    };
    const json = JSON.stringify(outputs);
    if (json !== lastOutputsJsonRef.current) {
      lastOutputsJsonRef.current = json;
      onOutputsUpdateRef.current?.(outputs);
    }
  }, [current, power, voltage, resistance]);

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

      if (isRunning && current > 0) {
        // Animation speed of electron flow is proportional to current
        animPhaseRef.current += dt * Math.min(25, current * 40 + 2);
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

      // Dark Circuit Board Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#040813');
      bgGrad.addColorStop(1, '#0a1426');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle PCB Grid Pattern
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

      // Circuit Geometry Rect
      const cLeft = width * 0.12;
      const cRight = width * 0.72;
      const cTop = height * 0.2;
      const cBottom = height * 0.8;
      const cMidY = (cTop + cBottom) / 2;

      // 1. Draw Main Circuit Wire Loop
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 4;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(cLeft, cTop);
      ctx.lineTo(cRight, cTop);
      ctx.lineTo(cRight, cBottom);
      ctx.lineTo(cLeft, cBottom);
      ctx.closePath();
      ctx.stroke();

      // 2. Animated Electron / Current Flow Dots
      if (current > 0.001) {
        const perimeter = 2 * (cRight - cLeft + cBottom - cTop);
        const numElectrons = 28;
        const phase = animPhaseRef.current % perimeter;

        ctx.save();
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 8;

        for (let i = 0; i < numElectrons; i++) {
          const dist = (phase + (i * perimeter) / numElectrons) % perimeter;
          let dotX = cLeft;
          let dotY = cTop;

          const topLen = cRight - cLeft;
          const rightLen = cBottom - cTop;
          const bottomLen = cRight - cLeft;

          if (dist < topLen) {
            dotX = cLeft + dist;
            dotY = cTop;
          } else if (dist < topLen + rightLen) {
            dotX = cRight;
            dotY = cTop + (dist - topLen);
          } else if (dist < topLen + rightLen + bottomLen) {
            dotX = cRight - (dist - topLen - rightLen);
            dotY = cBottom;
          } else {
            dotX = cLeft;
            dotY = cBottom - (dist - topLen - rightLen - bottomLen);
          }

          ctx.beginPath();
          ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // 3. DC Battery Source on Left Branch
      const batX = cLeft;
      const batY = cMidY;
      ctx.save();
      // Cut wire behind battery
      ctx.fillStyle = '#0a1426';
      ctx.fillRect(batX - 25, batY - 35, 50, 70);

      // Battery Long Plate (+)
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(batX - 18, batY - 10);
      ctx.lineTo(batX + 18, batY - 10);
      ctx.stroke();

      // Battery Short Plate (-)
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(batX - 10, batY + 10);
      ctx.lineTo(batX + 10, batY + 10);
      ctx.stroke();

      // Polarity signs
      ctx.font = 'bold 13px system-ui, sans-serif';
      ctx.fillStyle = '#ef4444';
      ctx.textAlign = 'right';
      ctx.fillText('+', batX - 22, batY - 8);

      ctx.fillStyle = '#38bdf8';
      ctx.fillText('−', batX - 22, batY + 14);

      // Voltage Tag
      ctx.font = 'bold 12px monospace';
      ctx.fillStyle = '#f8fafc';
      ctx.textAlign = 'left';
      ctx.fillText(`${voltage.toFixed(1)} V`, batX + 26, batY + 4);
      ctx.restore();

      // 4. Resistor Component on Top Branch
      const resX = (cLeft + cRight) / 2;
      const resY = cTop;
      const resW = 70;
      const resH = 22;

      ctx.save();
      // Cut wire behind resistor
      ctx.fillStyle = '#0a1426';
      ctx.fillRect(resX - resW / 2 - 10, resY - 15, resW + 20, 30);

      // Ceramic body
      ctx.fillStyle = '#d97706';
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(resX - resW / 2, resY - resH / 2, resW, resH, 4);
      ctx.fill();
      ctx.stroke();

      // Resistor Color Bands
      const bandColors = ['#1e293b', '#b91c1c', '#f59e0b', '#eab308'];
      bandColors.forEach((color, idx) => {
        ctx.fillStyle = color;
        ctx.fillRect(resX - resW / 2 + 12 + idx * 12, resY - resH / 2, 5, resH);
      });

      // Heat wave glow if high power
      if (power > 5) {
        ctx.save();
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
        ctx.lineWidth = 1.5;
        const heatOffset = Math.sin(animPhaseRef.current * 0.2) * 3;
        ctx.beginPath();
        ctx.moveTo(resX - 20, resY - 18 + heatOffset);
        ctx.quadraticCurveTo(resX, resY - 26 - heatOffset, resX + 20, resY - 18 + heatOffset);
        ctx.stroke();
        ctx.restore();
      }

      ctx.font = 'bold 12px monospace';
      ctx.fillStyle = '#fef08a';
      ctx.textAlign = 'center';
      ctx.fillText(`R = ${resistance.toFixed(1)} Ω`, resX, resY - 18);
      ctx.restore();

      // 5. Glowing Light Bulb on Right Branch
      const bulbX = cRight;
      const bulbY = cMidY;
      const bulbRadius = 26;
      const brightness = Math.min(1, power / 15);

      ctx.save();
      // Cut wire behind bulb
      ctx.fillStyle = '#0a1426';
      ctx.fillRect(bulbX - 35, bulbY - 35, 70, 70);

      // Bulb Bloom / Radiance
      if (brightness > 0.05) {
        const glowGrad = ctx.createRadialGradient(
          bulbX,
          bulbY,
          bulbRadius * 0.4,
          bulbX,
          bulbY,
          bulbRadius * 2.8 * brightness
        );
        glowGrad.addColorStop(0, 'rgba(254, 240, 138, 0.85)');
        glowGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.35)');
        glowGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');

        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(bulbX, bulbY, bulbRadius * 2.8 * brightness, 0, Math.PI * 2);
        ctx.fill();
      }

      // Bulb Glass Envelope
      ctx.fillStyle = `rgba(254, 240, 138, ${0.15 + 0.65 * brightness})`;
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(bulbX, bulbY, bulbRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Filament (Internal glowing loop)
      ctx.strokeStyle = brightness > 0.1 ? '#fef08a' : '#94a3b8';
      ctx.lineWidth = 2.5;
      if (brightness > 0.1) {
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 10;
      }
      ctx.beginPath();
      ctx.moveTo(bulbX - 8, bulbY + 12);
      ctx.lineTo(bulbX - 4, bulbY - 6);
      ctx.arc(bulbX, bulbY - 6, 4, Math.PI, 0);
      ctx.lineTo(bulbX + 8, bulbY + 12);
      ctx.stroke();

      // Bulb base socket
      ctx.fillStyle = '#64748b';
      ctx.fillRect(bulbX - 10, bulbY + bulbRadius - 2, 20, 8);

      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = '#fde047';
      ctx.textAlign = 'center';
      ctx.fillText(`${power.toFixed(1)} W`, bulbX, bulbY + bulbRadius + 20);
      ctx.restore();

      // 6. Analog / Digital Ammeter Meter on Bottom Branch
      const ammeterX = (cLeft + cRight) / 2;
      const ammeterY = cBottom;
      const meterR = 30;

      ctx.save();
      // Cut wire behind meter
      ctx.fillStyle = '#0a1426';
      ctx.fillRect(ammeterX - 40, ammeterY - 40, 80, 80);

      // Meter Outer Casing
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(ammeterX, ammeterY, meterR, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Meter Needle Dial
      const maxCurrentRef = 1.0; // A
      const curFraction = Math.min(1, current / maxCurrentRef);
      const needleAngle = Math.PI * 0.75 + curFraction * (Math.PI * 1.5);

      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(ammeterX, ammeterY);
      ctx.lineTo(
        ammeterX + Math.cos(needleAngle) * (meterR - 7),
        ammeterY + Math.sin(needleAngle) * (meterR - 7)
      );
      ctx.stroke();

      // Ammeter Center Cap
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(ammeterX, ammeterY, 4, 0, Math.PI * 2);
      ctx.fill();

      // Ammeter Symbol 'A'
      ctx.font = 'bold 10px system-ui, sans-serif';
      ctx.fillStyle = '#38bdf8';
      ctx.textAlign = 'center';
      ctx.fillText('AMMETER', ammeterX, ammeterY + meterR + 15);

      ctx.font = 'bold 12px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`I = ${current.toFixed(3)} A`, ammeterX, ammeterY - meterR - 8);
      ctx.restore();

      // 7. Floating Telemetry HUD Card
      const hudW = 230;
      const hudH = 88;
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
      ctx.fillText("OHM'S LAW: V = I × R", hudX + 12, hudY + 20);

      ctx.font = 'bold 15px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`I = ${current.toFixed(3)} A`, hudX + 12, hudY + 42);

      ctx.font = '11px monospace';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Voltage V = ${voltage.toFixed(1)} V`, hudX + 12, hudY + 60);
      ctx.fillText(`Power P = ${power.toFixed(2)} W | R = ${resistance} Ω`, hudX + 12, hudY + 77);

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [voltage, resistance, current, power, isRunning]);

  return (
    <div className="relative w-full h-[320px] sm:h-[380px] md:h-[430px] rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
