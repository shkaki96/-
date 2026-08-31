import React, { useEffect, useRef } from 'react';
import { Experiment } from '../../../types/experiment';

export interface DopplerWaveEngineProps {
  experiment: Experiment;
  params: Record<string, number>;
  isRunning?: boolean;
  onOutputsUpdate?: (outputs: Record<string, number>) => void;
}

interface WavePulse {
  x: number;
  y: number;
  radius: number;
  timeEmitted: number;
}

export const DopplerWaveEngine: React.FC<DopplerWaveEngineProps> = ({
  experiment,
  params,
  isRunning = true,
  onOutputsUpdate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pulsesRef = useRef<WavePulse[]>([]);
  const timeRef = useRef(0);
  const lastEmitTimeRef = useRef(0);
  const lastOutputsJsonRef = useRef('');
  const onOutputsUpdateRef = useRef(onOutputsUpdate);
  useEffect(() => {
    onOutputsUpdateRef.current = onOutputsUpdate;
  }, [onOutputsUpdate]);

  const code = experiment?.codeNumber || 66;
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

  // Determine sub-mode
  const isDoppler = code === 66 || slug.includes('doppler') || law.includes('doppler') || law.includes('v_s') || law.includes('vₛ');
  const isPipeResonance = code === 28 || code === 29 || slug.includes('pipe') || slug.includes('resonance') || slug.includes('speed-of-sound');
  const isStringWave = code === 49 || code === 61 || slug.includes('string') || slug.includes('normal-modes');
  const isFourier = code === 48 || slug.includes('fourier');

  // Real-time Physics Output Calculations
  useEffect(() => {
    if (!onOutputsUpdate) return;
    const outputs: Record<string, number> = {};

    if (isDoppler) {
      const vSound = getParam(['soundSpeed', 'v_sound', 'speedOfSound', 'v', 'vSound'], 343); // m/s
      const vSource = getParam(['sourceSpeed', 'sourceVelocity', 'vs', 'v_s', 'vS', 'var1'], 60); // m/s
      const vObserver = getParam(['observerSpeed', 'observerVelocity', 'vo', 'v_o', 'vO', 'var2'], 0); // m/s
      const fSource = getParam(['sourceFrequency', 'frequency', 'f0', 'f_0', 'f', 'var3'], 440); // Hz

      const machNumber = vSound > 0 ? vSource / vSound : 0;
      // Perceived frequency for observer ahead (approaching source)
      const denominatorAhead = Math.max(1, vSound - vSource);
      const fApproaching = fSource * ((vSound + vObserver) / denominatorAhead);
      // Perceived frequency for observer behind (receding source)
      const denominatorReceding = vSound + vSource;
      const fReceding = fSource * ((vSound - vObserver) / denominatorReceding);
      // Compressed wavelength ahead
      const wavelengthAhead = denominatorAhead / fSource;
      const wavelengthBehind = denominatorReceding / fSource;

      outputs.observedFrequencyAhead = Number(fApproaching.toFixed(1));
      outputs.observedFrequencyBehind = Number(fReceding.toFixed(1));
      outputs.observedFreq = Number(fApproaching.toFixed(1));
      outputs.frequencyShift = Number((fApproaching - fSource).toFixed(1));
      outputs.machNumber = Number(machNumber.toFixed(3));
      outputs.wavelengthAhead = Number(wavelengthAhead.toFixed(3));
      outputs.wavelengthBehind = Number(wavelengthBehind.toFixed(3));
      outputs.sourceFrequency = fSource;
      outputs.soundSpeed = vSound;
    } else if (isPipeResonance) {
      const vSound = getParam(['soundSpeed', 'v_sound', 'v'], 343);
      const length = getParam(['pipeLength', 'length', 'L', 'var1'], 0.85); // m
      const modeN = Math.max(1, Math.round(getParam(['harmonic', 'n', 'mode', 'var2'], 1)));

      const isClosed = code === 28 || slug.includes('closed');
      const resonantFreq = isClosed
        ? ((2 * modeN - 1) * vSound) / (4 * length)
        : (modeN * vSound) / (2 * length);
      const resonantWavelength = isClosed
        ? (4 * length) / (2 * modeN - 1)
        : (2 * length) / modeN;

      outputs.resonantFrequency = Number(resonantFreq.toFixed(1));
      outputs.wavelength = Number(resonantWavelength.toFixed(3));
      outputs.fundamentalFreq = Number((vSound / (isClosed ? 4 * length : 2 * length)).toFixed(1));
      outputs.harmonicNumber = modeN;
      outputs.pipeLength = length;
    } else if (isStringWave) {
      const tension = getParam(['tension', 'T', 'var1'], 120); // N
      const linearDensity = getParam(['linearDensity', 'mu', 'massPerLength', 'var2'], 0.005); // kg/m
      const length = getParam(['stringLength', 'length', 'L', 'var3'], 1.2); // m
      const harmonicN = Math.max(1, Math.round(getParam(['harmonic', 'n'], 2)));

      const waveSpeed = Math.sqrt(tension / Math.max(0.0001, linearDensity));
      const wavelength = (2 * length) / harmonicN;
      const frequency = waveSpeed / wavelength;

      outputs.waveSpeed = Number(waveSpeed.toFixed(2));
      outputs.frequency = Number(frequency.toFixed(2));
      outputs.wavelength = Number(wavelength.toFixed(3));
      outputs.standingNodes = harmonicN + 1;
      outputs.standingAntinodes = harmonicN;
    } else if (isFourier) {
      const fundamentalFreq = getParam(['fundamentalFreq', 'f0', 'frequency', 'var1'], 220);
      const harmonicsCount = Math.max(1, Math.min(8, Math.round(getParam(['harmonicsCount', 'numHarmonics', 'var2'], 4))));

      outputs.fundamentalFrequency = fundamentalFreq;
      outputs.activeHarmonics = harmonicsCount;
      outputs.highestHarmonicFreq = fundamentalFreq * harmonicsCount;
      outputs.thd = Number((1 / (harmonicsCount * 1.5)).toFixed(3));
    } else {
      const freq = getParam(['frequency', 'f', 'var1'], 250);
      const amplitude = getParam(['amplitude', 'A', 'var2'], 1.0);
      const speed = 343;

      outputs.frequency = freq;
      outputs.wavelength = Number((speed / freq).toFixed(3));
      outputs.period = Number((1 / freq).toFixed(4));
      outputs.waveSpeed = speed;
      outputs.amplitude = amplitude;
    }

    const json = JSON.stringify(outputs);
    if (json !== lastOutputsJsonRef.current) {
      lastOutputsJsonRef.current = json;
      onOutputsUpdateRef.current?.(outputs);
    }
  }, [code, law, slug, params, isDoppler, isPipeResonance, isStringWave, isFourier]);

  // Main Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 800);
      const height = (canvas.height = canvas.parentElement?.clientHeight || 450);

      // Dark acoustic lab background
      ctx.fillStyle = '#060B19';
      ctx.fillRect(0, 0, width, height);

      // Subtle grid
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.07)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      if (isRunning) {
        timeRef.current += 0.016;
      }
      const t = timeRef.current;

      // -------------------------------------------------------------
      // 1. DOPPLER EFFECT RENDERING
      // -------------------------------------------------------------
      if (isDoppler) {
        const vSound = getParam(['soundSpeed', 'v_sound', 'speedOfSound', 'v', 'vSound'], 343);
        const vSource = getParam(['sourceSpeed', 'sourceVelocity', 'vs', 'v_s', 'vS', 'var1'], 60);
        const fSource = getParam(['sourceFrequency', 'frequency', 'f0', 'f_0', 'f', 'var3'], 440);

        const centerY = height * 0.52;
        const trackStartX = 60;
        const trackEndX = width - 60;
        const trackLength = trackEndX - trackStartX;

        // Visual speed scaling
        const speedScale = 0.55;
        const visualSoundSpeed = 160; // px/s
        const visualSourceSpeed = (vSource / Math.max(1, vSound)) * visualSoundSpeed;

        // Source oscillation / motion across the track
        const period = trackLength / Math.max(20, visualSourceSpeed);
        const loopT = (t % (period * 2)) / period;
        const sourceX = loopT <= 1
          ? trackStartX + loopT * trackLength
          : trackEndX - (loopT - 1) * trackLength;
        const movingRight = loopT <= 1;

        // Emit new wave pulses at frequency rate
        const emitInterval = Math.max(0.12, 180 / Math.max(80, fSource));
        if (isRunning && t - lastEmitTimeRef.current >= emitInterval) {
          pulsesRef.current.push({
            x: sourceX,
            y: centerY,
            radius: 4,
            timeEmitted: t,
          });
          lastEmitTimeRef.current = t;
        }

        // Update and draw expanding wavefront pulses
        const maxRadius = Math.max(width, height) * 0.95;
        pulsesRef.current = pulsesRef.current.filter((pulse) => {
          const age = t - pulse.timeEmitted;
          const currentRadius = 4 + age * visualSoundSpeed * speedScale;

          if (currentRadius > maxRadius) return false;

          const alpha = Math.max(0, 1 - currentRadius / maxRadius);

          // Draw wavefront circle
          ctx.beginPath();
          ctx.arc(pulse.x, pulse.y, currentRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.85})`;
          ctx.lineWidth = 2;
          ctx.stroke();

          // Fill subtle shock wave glow
          ctx.fillStyle = `rgba(14, 165, 233, ${alpha * 0.05})`;
          ctx.fill();

          return true;
        });

        // Draw track
        ctx.beginPath();
        ctx.moveTo(trackStartX, centerY);
        ctx.lineTo(trackEndX, centerY);
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Observers Ahead (Right) & Behind (Left)
        const observerLeftX = trackStartX - 25;
        const observerRightX = trackEndX + 25;

        // Draw Observer Ear Left (Receding / Behind if moving right)
        ctx.fillStyle = '#A855F7';
        ctx.beginPath();
        ctx.arc(observerLeftX, centerY, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#E9D5FF';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#E9D5FF';
        ctx.font = 'bold 11px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Obs A (Left)', observerLeftX, centerY + 28);
        ctx.font = '10px monospace';
        ctx.fillStyle = '#C084FC';
        ctx.fillText(movingRight ? 'f′ Receding' : 'f′ Approach', observerLeftX, centerY + 42);

        // Draw Observer Ear Right (Approaching if moving right)
        ctx.fillStyle = '#10B981';
        ctx.beginPath();
        ctx.arc(observerRightX, centerY, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#A7F3D0';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#A7F3D0';
        ctx.font = 'bold 11px system-ui, sans-serif';
        ctx.fillText('Obs B (Right)', observerRightX, centerY + 28);
        ctx.font = '10px monospace';
        ctx.fillStyle = '#34D399';
        ctx.fillText(movingRight ? 'f′ Approach' : 'f′ Receding', observerRightX, centerY + 42);

        // Draw Moving Sound Source (Ambulance / Siren)
        ctx.save();
        ctx.translate(sourceX, centerY);

        // Halo / acoustic emitter glow
        const glowRadius = 24 + Math.sin(t * 15) * 6;
        const grad = ctx.createRadialGradient(0, 0, 4, 0, 0, glowRadius);
        grad.addColorStop(0, 'rgba(239, 68, 68, 0.8)');
        grad.addColorStop(1, 'rgba(239, 68, 68, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Source Body
        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FEE2E2';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Direction Arrow
        ctx.strokeStyle = '#FFFFFF';
        ctx.fillStyle = '#FFFFFF';
        ctx.lineWidth = 2.5;
        const arrowDir = movingRight ? 1 : -1;
        ctx.beginPath();
        ctx.moveTo(-8 * arrowDir, -22);
        ctx.lineTo(14 * arrowDir, -22);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(14 * arrowDir, -22);
        ctx.lineTo(6 * arrowDir, -26);
        ctx.lineTo(6 * arrowDir, -18);
        ctx.closePath();
        ctx.fill();

        ctx.font = 'bold 10px monospace';
        ctx.fillStyle = '#FCA5A5';
        ctx.textAlign = 'center';
        ctx.fillText(`v_s = ${vSource} m/s`, 0, 26);

        ctx.restore();

        // Mach Cone if Mach >= 1
        const mach = vSound > 0 ? vSource / vSound : 0;
        if (mach >= 1) {
          const muAngle = Math.asin(1 / mach);
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.85)';
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);

          ctx.beginPath();
          ctx.moveTo(sourceX, centerY);
          ctx.lineTo(
            sourceX - (movingRight ? 1 : -1) * 350 * Math.cos(muAngle),
            centerY - 350 * Math.sin(muAngle)
          );
          ctx.moveTo(sourceX, centerY);
          ctx.lineTo(
            sourceX - (movingRight ? 1 : -1) * 350 * Math.cos(muAngle),
            centerY + 350 * Math.sin(muAngle)
          );
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.fillStyle = '#FBBF24';
          ctx.font = 'bold 11px monospace';
          ctx.textAlign = 'left';
          ctx.fillText(`⚡ Sonic Boom Shock Cone (Mach ${mach.toFixed(2)})`, 20, height - 25);
        }

        // Frequency & Shift Banner HUD
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(width / 2 - 190, 16, 380, 48, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#38BDF8';
        ctx.font = 'bold 12px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Doppler Effect: f′ = f₀ · (v ± vₒ) / (v ∓ vₛ)`, width / 2, 34);

        const denom = Math.max(1, vSound - vSource);
        const fObs = (fSource * (vSound / denom)).toFixed(1);
        ctx.font = '11px monospace';
        ctx.fillStyle = '#E2E8F0';
        ctx.fillText(`f₀ = ${fSource} Hz | v = ${vSound} m/s | Ahead: ${fObs} Hz (+${(Number(fObs) - fSource).toFixed(1)} Hz)`, width / 2, 52);
      }

      // -------------------------------------------------------------
      // 2. PIPE & ACOUSTIC RESONANCE RENDERING (Exp 28, 29)
      // -------------------------------------------------------------
      else if (isPipeResonance) {
        const vSound = getParam(['soundSpeed', 'v_sound', 'v'], 343);
        const lengthM = getParam(['pipeLength', 'length', 'L', 'var1'], 0.85);
        const modeN = Math.max(1, Math.round(getParam(['harmonic', 'n', 'mode', 'var2'], 1)));
        const isClosed = code === 28 || slug.includes('closed');

        const tubeX = 140;
        const tubeY = height * 0.45;
        const tubeW = width - 280;
        const tubeH = 100;

        // Tube Walls
        ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
        ctx.fillRect(tubeX, tubeY - tubeH / 2, tubeW, tubeH);

        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 4;
        ctx.beginPath();
        // Top wall
        ctx.moveTo(tubeX, tubeY - tubeH / 2);
        ctx.lineTo(tubeX + tubeW, tubeY - tubeH / 2);
        // Bottom wall
        ctx.moveTo(tubeX, tubeY + tubeH / 2);
        ctx.lineTo(tubeX + tubeW, tubeY + tubeH / 2);

        // Closed End on Right (if closed tube)
        if (isClosed) {
          ctx.moveTo(tubeX + tubeW, tubeY - tubeH / 2);
          ctx.lineTo(tubeX + tubeW, tubeY + tubeH / 2);
        }
        ctx.stroke();

        // Tuning Fork / Speaker source on Left
        ctx.fillStyle = '#F59E0B';
        ctx.fillRect(tubeX - 45, tubeY - 30, 30, 60);
        ctx.fillStyle = '#FCD34D';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('SOURCE', tubeX - 30, tubeY + 4);

        // Sound standing waves inside tube
        const numPoints = 120;
        const k = isClosed
          ? ((2 * modeN - 1) * Math.PI) / (2 * tubeW)
          : (modeN * Math.PI) / tubeW;

        const omega = 8;
        const oscillation = Math.cos(omega * t);

        // Upper envelope standing wave
        ctx.beginPath();
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 2.5;
        for (let i = 0; i <= numPoints; i++) {
          const xNorm = (i / numPoints) * tubeW;
          const px = tubeX + xNorm;
          const standingAmp = (tubeH / 2 - 8) * Math.cos(k * xNorm) * oscillation;
          const py = tubeY - standingAmp;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Lower envelope
        ctx.beginPath();
        ctx.strokeStyle = '#818CF8';
        ctx.lineWidth = 2.5;
        for (let i = 0; i <= numPoints; i++) {
          const xNorm = (i / numPoints) * tubeW;
          const px = tubeX + xNorm;
          const standingAmp = (tubeH / 2 - 8) * Math.cos(k * xNorm) * oscillation;
          const py = tubeY + standingAmp;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Air pressure particle dots showing nodes and antinodes
        for (let p = 0; p < 80; p++) {
          const pxRatio = (p + (Math.sin(p * 99 + t * 4) * 0.5 + 0.5)) / 80;
          const px = tubeX + pxRatio * tubeW;
          const densityAmp = Math.sin(k * pxRatio * tubeW) * Math.cos(omega * t);
          const py = tubeY + (Math.sin(p * 37) * (tubeH / 2 - 15));

          ctx.fillStyle = `rgba(56, 189, 248, ${0.3 + Math.abs(densityAmp) * 0.6})`;
          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Info HUD
        const resFreq = isClosed
          ? ((2 * modeN - 1) * vSound) / (4 * lengthM)
          : (modeN * vSound) / (2 * lengthM);

        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.beginPath();
        ctx.roundRect(width / 2 - 180, height - 70, 360, 52, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#38BDF8';
        ctx.font = 'bold 12px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Acoustic Standing Wave (${isClosed ? 'Quarter-Wave / Closed' : 'Half-Wave / Open'})`, width / 2, height - 50);
        ctx.font = '11px monospace';
        ctx.fillStyle = '#F8FAFC';
        ctx.fillText(`Harmonic n = ${modeN} | L = ${lengthM} m | f_res = ${resFreq.toFixed(1)} Hz | v = ${vSound} m/s`, width / 2, height - 32);
      }

      // -------------------------------------------------------------
      // 3. WAVE ON A STRING / NORMAL MODES (Exp 49, 61, 48)
      // -------------------------------------------------------------
      else {
        const tension = getParam(['tension', 'T', 'var1'], 120);
        const linearDensity = getParam(['linearDensity', 'mu', 'var2'], 0.005);
        const lengthM = getParam(['stringLength', 'length', 'L', 'var3'], 1.2);
        const harmonicN = Math.max(1, Math.round(getParam(['harmonic', 'n'], 2)));

        const startX = 100;
        const endX = width - 100;
        const stringWidth = endX - startX;
        const baseY = height * 0.5;

        // String clamps
        ctx.fillStyle = '#64748B';
        ctx.fillRect(startX - 15, baseY - 40, 15, 80);
        ctx.fillRect(endX, baseY - 40, 15, 80);

        // Draw vibrating string
        ctx.beginPath();
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 4;

        const numPoints = 200;
        const waveSpeed = Math.sqrt(tension / Math.max(0.0001, linearDensity));
        const omega = (harmonicN * Math.PI * waveSpeed) / (lengthM * 50);

        for (let i = 0; i <= numPoints; i++) {
          const ratio = i / numPoints;
          const x = startX + ratio * stringWidth;
          const y = baseY + 55 * Math.sin(harmonicN * Math.PI * ratio) * Math.cos(omega * t);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Glow
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.lineWidth = 12;
        ctx.stroke();

        // Highlight Nodes
        for (let n = 0; n <= harmonicN; n++) {
          const nodeX = startX + (n / harmonicN) * stringWidth;
          ctx.fillStyle = '#EF4444';
          ctx.beginPath();
          ctx.arc(nodeX, baseY, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#FEE2E2';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = '#FCA5A5';
          ctx.font = '10px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`N${n}`, nodeX, baseY + 20);
        }

        // Wave parameters HUD
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.beginPath();
        ctx.roundRect(width / 2 - 190, 20, 380, 52, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#38BDF8';
        ctx.font = 'bold 12px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Wave on a String: v = √(T/μ) | f_n = (n/2L) · v`, width / 2, 40);

        const freq = (harmonicN / (2 * lengthM)) * waveSpeed;
        ctx.font = '11px monospace';
        ctx.fillStyle = '#F8FAFC';
        ctx.fillText(`v = ${waveSpeed.toFixed(1)} m/s | f = ${freq.toFixed(1)} Hz | Harmonic n = ${harmonicN}`, width / 2, 58);
      }

      if (isRunning) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [experiment, params, isRunning, isDoppler, isPipeResonance, isStringWave, isFourier]);

  return (
    <div className="relative w-full h-full min-h-[360px] bg-slate-950 rounded-xl overflow-hidden shadow-2xl border border-slate-800/80 flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

export default DopplerWaveEngine;
