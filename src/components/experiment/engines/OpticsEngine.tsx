import React, { useEffect, useRef } from 'react';
import { Experiment } from '../../../types/experiment';

export interface OpticsEngineProps {
  experiment: Experiment;
  params: Record<string, number>;
  isRunning?: boolean;
  onOutputsUpdate?: (outputs: Record<string, number>) => void;
}

export const OpticsEngine: React.FC<OpticsEngineProps> = ({
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

  const code = experiment?.codeNumber || 2;
  const law = (experiment?.physicalLaw || '').toLowerCase();
  const slug = (experiment?.id || '').toLowerCase();

  // Helper for parameter extraction with fallbacks
  const getParam = (names: string[], def: number): number => {
    for (const name of names) {
      if (params[name] !== undefined && !isNaN(params[name])) {
        return params[name];
      }
    }
    return def;
  };

  // Perform physical calculations dynamically
  useEffect(() => {
    if (!onOutputsUpdate) return;
    const outputs: Record<string, number> = {};

    // 1. Refraction & Snell's Law (Exp 36, 15)
    if (code === 36 || code === 15 || law.includes('sin(θ') || slug.includes('snell') || slug.includes('refraction')) {
      const n1 = getParam(['n1', 'n_1', 'index1', 'var1'], 1.0);
      const n2 = getParam(['n2', 'n_2', 'index2', 'var2'], 1.5);
      const theta1Deg = getParam(['incidentAngle', 'theta1', 'theta_1', 'var1', 'angle'], 35);
      const theta1Rad = (theta1Deg * Math.PI) / 180;
      const sinTheta2 = (n1 / n2) * Math.sin(theta1Rad);
      const isTIR = Math.abs(sinTheta2) > 1.0;
      const theta2Rad = isTIR ? 0 : Math.asin(sinTheta2);
      const theta2Deg = isTIR ? 0 : (theta2Rad * 180) / Math.PI;
      const criticalAngleDeg = n1 > n2 ? (Math.asin(n2 / n1) * 180) / Math.PI : 90;

      outputs.refractedAngle = Number(theta2Deg.toFixed(2));
      outputs.incidentAngle = Number(theta1Deg.toFixed(2));
      outputs.criticalAngle = Number(criticalAngleDeg.toFixed(2));
      outputs.isTIR = isTIR ? 1 : 0;
    }
    // 2. Polarization & Malus' Law (Exp 17)
    else if (code === 17 || law.includes('cos²') || slug.includes('malus') || slug.includes('polarization')) {
      const I0 = getParam(['I0', 'initialIntensity', 'var1'], 100);
      const angleDeg = getParam(['theta', 'polarizerAngle', 'var2', 'angle'], 45);
      const angleRad = (angleDeg * Math.PI) / 180;
      const transmittedIntensity = I0 * Math.pow(Math.cos(angleRad), 2);

      outputs.transmittedIntensity = Number(transmittedIntensity.toFixed(2));
      outputs.initialIntensity = Number(I0.toFixed(2));
      outputs.polarizerAngle = Number(angleDeg.toFixed(2));
      outputs.absorptionRatio = Number((1 - transmittedIntensity / I0).toFixed(2));
    }
    // 3. Double-Slit & Wave Optics / Diffraction (Exp 30, 41)
    else if (code === 30 || code === 41 || law.includes('d_i') === false && (law.includes('λ') || slug.includes('slit') || slug.includes('interference'))) {
      const wavelengthNm = getParam(['wavelength', 'lambda', 'var1'], 532);
      const slitDistUm = getParam(['slitDistance', 'd', 'var2'], 50);
      const screenDistM = getParam(['screenDistance', 'D', 'L', 'var3'], 1.5);
      const fringeSpacingMm = ((wavelengthNm * 1e-9 * screenDistM) / (slitDistUm * 1e-6)) * 1000;

      outputs.fringeSpacing = Number(fringeSpacingMm.toFixed(2));
      outputs.wavelength = wavelengthNm;
      outputs.slitDistance = slitDistUm;
      outputs.screenDistance = screenDistM;
    }
    // 4. Lenses / Eyeglasses / Optical Power / Mirrors (Exp 2, 3, 16)
    else {
      const fCm = getParam(['focalLength', 'f', 'var1'], 20);
      const doCm = getParam(['objectDistance', 'do', 'd_o', 'var2'], 40);
      const hoCm = getParam(['objectHeight', 'ho', 'h_o', 'var3'], 10);
      const fSafe = fCm !== 0 ? fCm : 0.01;
      const doSafe = doCm > 0 ? doCm : 1;
      const diCm = (fSafe * doSafe) / (doSafe - fSafe);
      const mag = -diCm / doSafe;
      const hiCm = mag * hoCm;
      const powerDpt = 100 / fSafe;

      outputs.lensPower = Number(powerDpt.toFixed(2));
      outputs.imageDistance = Number(diCm.toFixed(2));
      outputs.magnification = Number(mag.toFixed(2));
      outputs.imageHeight = Number(hiCm.toFixed(2));
      outputs.focalLength = Number(fSafe.toFixed(2));
      outputs.objectDistance = Number(doSafe.toFixed(2));
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
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#040711');
      bgGrad.addColorStop(1, '#091322');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle Lab Coordinate Grid
      ctx.strokeStyle = 'rgba(30, 58, 95, 0.22)';
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
      // SUB-RENDERER A: Polarization & Malus' Law (Exp 17)
      // -------------------------------------------------------------
      if (code === 17 || law.includes('cos²') || slug.includes('malus') || slug.includes('polarization')) {
        const I0 = getParam(['I0', 'initialIntensity', 'var1'], 100);
        const thetaDeg = getParam(['theta', 'polarizerAngle', 'var2', 'angle'], 45);
        const thetaRad = (thetaDeg * Math.PI) / 180;
        const transmittedI = I0 * Math.pow(Math.cos(thetaRad), 2);
        const intensityRatio = transmittedI / I0;

        const midY = height * 0.52;
        const sourceX = 60;
        const p1X = width * 0.35;
        const p2X = width * 0.65;
        const detectorX = width - 70;

        // Light Source
        ctx.fillStyle = '#facc15';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(sourceX, midY, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        ctx.save();
        ctx.scale(dpr, dpr);

        // Unpolarized beam (Source to Polarizer 1)
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(sourceX + 18, midY);
        ctx.lineTo(p1X - 10, midY);
        ctx.stroke();

        // Polarizer 1 (Fixed Vertical)
        ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(p1X - 15, midY - 65, 30, 130, 8);
        ctx.fill();
        ctx.stroke();
        // Slit axis
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(p1X, midY - 50);
        ctx.lineTo(p1X, midY + 50);
        ctx.stroke();

        // Polarized beam (Polarizer 1 to Polarizer 2)
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.85)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(p1X + 15, midY);
        ctx.lineTo(p2X - 15, midY);
        ctx.stroke();

        // Polarizer 2 (Rotated by theta)
        ctx.save();
        ctx.translate(p2X, midY);
        ctx.fillStyle = 'rgba(168, 85, 247, 0.25)';
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(-15, -65, 30, 130, 8);
        ctx.fill();
        ctx.stroke();

        // Rotating optical axis
        ctx.strokeStyle = '#e879f9';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-Math.sin(thetaRad) * 50, -Math.cos(thetaRad) * 50);
        ctx.lineTo(Math.sin(thetaRad) * 50, Math.cos(thetaRad) * 50);
        ctx.stroke();
        ctx.restore();

        // Transmitted beam after Analyzer
        ctx.strokeStyle = `rgba(250, 204, 21, ${0.1 + 0.9 * intensityRatio})`;
        ctx.lineWidth = Math.max(1, 6 * intensityRatio);
        ctx.beginPath();
        ctx.moveTo(p2X + 15, midY);
        ctx.lineTo(detectorX - 20, midY);
        ctx.stroke();

        // Photodetector
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(detectorX - 20, midY - 40, 40, 80, 6);
        ctx.fill();
        ctx.stroke();

        // Labels
        ctx.font = 'bold 11px system-ui, sans-serif';
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'center';
        ctx.fillText('POLARIZER (0°)', p1X, midY + 80);
        ctx.fillStyle = '#c084fc';
        ctx.fillText(`ANALYZER (${thetaDeg.toFixed(0)}°)`, p2X, midY + 80);
        ctx.fillStyle = '#4ade80';
        ctx.fillText(`SENSOR: ${transmittedI.toFixed(1)} W/m²`, detectorX, midY + 55);
      }

      // -------------------------------------------------------------
      // SUB-RENDERER B: Snell's Law & Total Internal Reflection (Exp 36, 15)
      // -------------------------------------------------------------
      else if (code === 36 || code === 15 || law.includes('sin(θ') || slug.includes('snell') || slug.includes('refraction')) {
        const n1 = getParam(['n1', 'n_1', 'index1', 'var1'], 1.0);
        const n2 = getParam(['n2', 'n_2', 'index2', 'var2'], 1.5);
        const theta1Deg = getParam(['incidentAngle', 'theta1', 'theta_1', 'var1', 'angle'], 35);
        const theta1Rad = (theta1Deg * Math.PI) / 180;
        const sinTheta2 = (n1 / n2) * Math.sin(theta1Rad);
        const isTIR = Math.abs(sinTheta2) > 1.0;
        const theta2Rad = isTIR ? 0 : Math.asin(sinTheta2);
        const theta2Deg = isTIR ? 0 : (theta2Rad * 180) / Math.PI;

        const midX = width * 0.48;
        const interfaceY = height * 0.52;
        const rayLen = Math.min(width, height) * 0.4;

        // Medium 1 (Top) & Medium 2 (Bottom)
        ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
        ctx.fillRect(0, 0, width, interfaceY);
        ctx.fillStyle = 'rgba(14, 116, 144, 0.25)';
        ctx.fillRect(0, interfaceY, width, height - interfaceY);

        // Boundary Interface
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(0, interfaceY);
        ctx.lineTo(width, interfaceY);
        ctx.stroke();

        // Normal Line (Dashed)
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(midX, 20);
        ctx.lineTo(midX, height - 20);
        ctx.stroke();
        ctx.setLineDash([]);

        // Incident Ray (Laser Yellow)
        const incX = midX - rayLen * Math.sin(theta1Rad);
        const incY = interfaceY - rayLen * Math.cos(theta1Rad);

        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 3.5;
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(incX, incY);
        ctx.lineTo(midX, interfaceY);
        ctx.stroke();

        if (!isTIR) {
          // Refracted Ray (Cyan)
          const refX = midX + rayLen * Math.sin(theta2Rad);
          const refY = interfaceY + rayLen * Math.cos(theta2Rad);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 3.5;
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.moveTo(midX, interfaceY);
          ctx.lineTo(refX, refY);
          ctx.stroke();

          // Angle arc
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(midX, interfaceY, 32, Math.PI / 2, Math.PI / 2 + theta2Rad);
          ctx.stroke();
          ctx.font = 'bold 11px monospace';
          ctx.fillStyle = '#38bdf8';
          ctx.fillText(`θ₂ = ${theta2Deg.toFixed(1)}°`, midX + 38, interfaceY + 26);
        } else {
          // Total Internal Reflection (Red)
          const tirX = midX + rayLen * Math.sin(theta1Rad);
          const tirY = interfaceY - rayLen * Math.cos(theta1Rad);
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 3.5;
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.moveTo(midX, interfaceY);
          ctx.lineTo(tirX, tirY);
          ctx.stroke();

          ctx.font = 'bold 12px monospace';
          ctx.fillStyle = '#ef4444';
          ctx.fillText('TOTAL INTERNAL REFLECTION', midX + 40, interfaceY - 40);
        }

        // Angle θ1 arc
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(midX, interfaceY, 32, -Math.PI / 2 - theta1Rad, -Math.PI / 2);
        ctx.stroke();
        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = '#facc15';
        ctx.fillText(`θ₁ = ${theta1Deg.toFixed(1)}°`, midX - 70, interfaceY - 26);

        ctx.font = 'bold 12px system-ui, sans-serif';
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText(`n₁ = ${n1} (Incident)`, 24, interfaceY - 18);
        ctx.fillStyle = '#67e8f9';
        ctx.fillText(`n₂ = ${n2} (Refractive)`, 24, interfaceY + 28);
      }

      // -------------------------------------------------------------
      // SUB-RENDERER C: Double-Slit & Wave Diffraction (Exp 30, 41)
      // -------------------------------------------------------------
      else if (code === 30 || code === 41 || (law.includes('λ') && !law.includes('d_i'))) {
        const wavelengthNm = getParam(['wavelength', 'lambda', 'var1'], 532);
        const slitDistUm = getParam(['slitDistance', 'd', 'var2'], 50);
        const screenDistM = getParam(['screenDistance', 'D', 'L', 'var3'], 1.5);
        const fringeSpacingMm = ((wavelengthNm * 1e-9 * screenDistM) / (slitDistUm * 1e-6)) * 1000;

        const laserX = 40;
        const barrierX = width * 0.35;
        const screenX = width * 0.78;
        const midY = height * 0.5;

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

        // Laser Source
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(laserX - 20, midY - 16, 40, 32);
        ctx.strokeStyle = laserColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(laserX - 20, midY - 16, 40, 32);

        // Laser Beam
        ctx.strokeStyle = laserColor;
        ctx.lineWidth = 3.5;
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

        // Wavefronts propagating
        for (let i = 0; i < 6; i++) {
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
          const phase = (2 * Math.PI * ((slitDistUm * 1e-6) / (screenDistM * 1000)) * (dy * 0.05)) / (wavelengthNm * 1e-9);
          const intensity = Math.pow(Math.cos(phase), 2);

          ctx.fillStyle = laserColor;
          ctx.globalAlpha = intensity;
          ctx.fillRect(screenX + 14, y, 24, 3);
        }
        ctx.globalAlpha = 1.0;

        ctx.font = 'bold 12px monospace';
        ctx.fillStyle = '#f8fafc';
        ctx.fillText(`Δy = ${fringeSpacingMm.toFixed(2)} mm`, screenX - 95, midY - 60);
      }

      // -------------------------------------------------------------
      // SUB-RENDERER D: Thin Lenses & Ray Optics (Exp 2, 3, 16)
      // -------------------------------------------------------------
      else {
        const fCm = getParam(['focalLength', 'f', 'var1'], 20);
        const doCm = getParam(['objectDistance', 'do', 'd_o', 'var2'], 40);
        const hoCm = getParam(['objectHeight', 'ho', 'h_o', 'var3'], 10);
        const f = fCm !== 0 ? fCm : 0.01;
        const doDist = doCm > 0 ? doCm : 1;
        const di = (f * doDist) / (doDist - f);
        const magnification = -di / doDist;
        const imageHeight = magnification * hoCm;
        const lensPower = 100 / f;

        const centerX = width * 0.48;
        const centerY = height * 0.52;
        const scale = Math.min(width / 130, height / 70);

        // Principal Axis
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(10, centerY);
        ctx.lineTo(width - 10, centerY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Lens Vertical Axis
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(centerX, 20);
        ctx.lineTo(centerX, height - 20);
        ctx.stroke();
        ctx.setLineDash([]);

        // Lens Body
        const lensHeight = Math.min(height * 0.76, 260);
        const isConvex = f > 0;
        const lensThickness = 30;

        ctx.save();
        const lensGrad = ctx.createLinearGradient(centerX - 20, 0, centerX + 20, 0);
        lensGrad.addColorStop(0, 'rgba(56, 189, 248, 0.15)');
        lensGrad.addColorStop(0.5, 'rgba(186, 230, 253, 0.45)');
        lensGrad.addColorStop(1, 'rgba(56, 189, 248, 0.15)');
        ctx.fillStyle = lensGrad;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#0284c7';
        ctx.shadowBlur = 12;

        ctx.beginPath();
        if (isConvex) {
          ctx.moveTo(centerX, centerY - lensHeight / 2);
          ctx.quadraticCurveTo(centerX + lensThickness, centerY, centerX, centerY + lensHeight / 2);
          ctx.quadraticCurveTo(centerX - lensThickness, centerY, centerX, centerY - lensHeight / 2);
        } else {
          ctx.moveTo(centerX - lensThickness / 2, centerY - lensHeight / 2);
          ctx.lineTo(centerX + lensThickness / 2, centerY - lensHeight / 2);
          ctx.quadraticCurveTo(centerX, centerY, centerX + lensThickness / 2, centerY + lensHeight / 2);
          ctx.lineTo(centerX - lensThickness / 2, centerY + lensHeight / 2);
          ctx.quadraticCurveTo(centerX, centerY, centerX - lensThickness / 2, centerY - lensHeight / 2);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Focal Points
        const fPixels = f * scale;
        [
          { x: centerX - fPixels, label: 'F₁' },
          { x: centerX + fPixels, label: 'F₂' },
        ].forEach((pt) => {
          if (pt.x > 20 && pt.x < width - 20) {
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.arc(pt.x, centerY, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.font = 'bold 11px system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(pt.label, pt.x, centerY + 18);
          }
        });

        // Object Arrow
        const objX = centerX - doDist * scale;
        const objYTop = centerY - hoCm * scale;
        ctx.save();
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 3.5;
        ctx.shadowColor = '#22c55e';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(objX, centerY);
        ctx.lineTo(objX, objYTop);
        ctx.stroke();

        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.moveTo(objX, objYTop);
        ctx.lineTo(objX - 5, objYTop + 9);
        ctx.lineTo(objX + 5, objYTop + 9);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        ctx.font = 'bold 11px system-ui, sans-serif';
        ctx.fillStyle = '#4ade80';
        ctx.textAlign = 'center';
        ctx.fillText(`Object (dₒ=${doDist.toFixed(1)}cm)`, objX, objYTop - 12);

        // Rays (Parallel & Center)
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(objX, objYTop);
        ctx.lineTo(centerX, objYTop);
        if (isConvex) {
          const slope = (centerY - objYTop) / fPixels;
          ctx.lineTo(width, objYTop + slope * (width - centerX));
        }
        ctx.stroke();

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(objX, objYTop);
        ctx.lineTo(centerX, centerY);
        const slope2 = (centerY - objYTop) / (centerX - objX);
        ctx.lineTo(width, centerY + slope2 * (width - centerX));
        ctx.stroke();

        // Image Arrow
        const imgX = centerX + di * scale;
        const imgYTop = centerY - imageHeight * scale;
        const isReal = di > 0;

        if (imgX > -200 && imgX < width + 200) {
          ctx.save();
          ctx.strokeStyle = isReal ? '#f43f5e' : '#a855f7';
          ctx.lineWidth = 3;
          if (!isReal) ctx.setLineDash([5, 3]);
          ctx.beginPath();
          ctx.moveTo(imgX, centerY);
          ctx.lineTo(imgX, imgYTop);
          ctx.stroke();
          ctx.restore();

          ctx.font = 'bold 11px system-ui, sans-serif';
          ctx.fillStyle = isReal ? '#fb7185' : '#c084fc';
          ctx.textAlign = 'center';
          ctx.fillText(`Image (dᵢ=${di.toFixed(1)}cm)`, imgX, imgYTop + (imageHeight > 0 ? -10 : 18));
        }
      }

      // Universal Floating Optics HUD
      const hudW = 230;
      const hudH = 68;
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
      ctx.fillText(experiment.title?.en || 'OPTICS SIMULATION', hudX + 12, hudY + 22);

      ctx.font = 'bold 14px monospace';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(experiment.physicalLaw || 'Optics Engine', hudX + 12, hudY + 44);

      ctx.font = '10px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`Status: 60 FPS Active`, hudX + 12, hudY + 59);

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
