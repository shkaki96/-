import React, { useEffect, useRef } from 'react';

export interface OpticsEyeglassesSimulationProps {
  params: Record<string, number>;
  isRunning?: boolean;
  onOutputsUpdate?: (outputs: Record<string, number>) => void;
}

export const OpticsEyeglassesSimulation: React.FC<OpticsEyeglassesSimulationProps> = ({
  params,
  onOutputsUpdate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastOutputsJsonRef = useRef('');
  const onOutputsUpdateRef = useRef(onOutputsUpdate);
  useEffect(() => {
    onOutputsUpdateRef.current = onOutputsUpdate;
  }, [onOutputsUpdate]);

  // Extract parameters with safe fallbacks
  const focalLength = params.focalLength ?? params.f ?? 20; // cm (+ for convex, - for concave)
  const objectDistance = params.objectDistance ?? params.do ?? params.var1 ?? 40; // cm
  const objectHeight = params.objectHeight ?? params.ho ?? 10; // cm

  // Compute optical physics: 1/f = 1/do + 1/di => 1/di = 1/f - 1/do => di = (f * do) / (do - f)
  const f = focalLength !== 0 ? focalLength : 0.001;
  const doDist = objectDistance > 0 ? objectDistance : 1;
  const di = (f * doDist) / (doDist - f);
  const magnification = -di / doDist;
  const imageHeight = magnification * objectHeight;
  const lensPower = 100 / f; // Diopters (P = 100 / f_cm)

  // Report outputs upward
  useEffect(() => {
    const outputs = {
      lensPower: Number(lensPower.toFixed(2)),
      imageDistance: Number(di.toFixed(2)),
      magnification: Number(magnification.toFixed(2)),
      imageHeight: Number(imageHeight.toFixed(2)),
      focalLength: Number(f.toFixed(1)),
      objectDistance: Number(doDist.toFixed(1)),
      isReal: di > 0 ? 1 : 0,
    };
    const json = JSON.stringify(outputs);
    if (json !== lastOutputsJsonRef.current) {
      lastOutputsJsonRef.current = json;
      onOutputsUpdateRef.current?.(outputs);
    }
  }, [lensPower, di, magnification, imageHeight, f, doDist]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth || 800;
      const height = canvas.clientHeight || 400;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // 1. Dark Lab Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#050b14');
      bgGrad.addColorStop(1, '#091322');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Grid Pattern
      ctx.strokeStyle = 'rgba(30, 58, 95, 0.25)';
      ctx.lineWidth = 1;
      const gridSize = 25;
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

      const centerX = width * 0.48;
      const centerY = height * 0.52;
      const scale = Math.min(width / 130, height / 70); // pixels per cm

      // 2. Optical Principal Axis
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(10, centerY);
      ctx.lineTo(width - 10, centerY);
      ctx.stroke();
      ctx.setLineDash([]);

      // 3. Lens Vertical Reference Line
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(centerX, 20);
      ctx.lineTo(centerX, height - 20);
      ctx.stroke();
      ctx.setLineDash([]);

      // 4. Draw Lens (Biconvex or Biconcave Glass with Glowing Edge)
      const lensHeight = Math.min(height * 0.76, 260);
      const isConvex = f > 0;
      const lensThickness = Math.min(Math.abs(f) > 0 ? 30 : 20, 36);

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
        // Biconvex Lens Shape
        ctx.moveTo(centerX, centerY - lensHeight / 2);
        ctx.quadraticCurveTo(centerX + lensThickness, centerY, centerX, centerY + lensHeight / 2);
        ctx.quadraticCurveTo(centerX - lensThickness, centerY, centerX, centerY - lensHeight / 2);
      } else {
        // Biconcave Lens Shape
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

      // Lens Center Vertex 'O'
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // 5. Focal Points Markers: F1, F2, 2F1, 2F2
      const fPixels = f * scale;
      const focalPoints = [
        { x: centerX - fPixels, label: 'F₁', color: '#f59e0b' },
        { x: centerX + fPixels, label: 'F₂', color: '#f59e0b' },
        { x: centerX - 2 * fPixels, label: '2F₁', color: '#94a3b8' },
        { x: centerX + 2 * fPixels, label: '2F₂', color: '#94a3b8' },
      ];

      focalPoints.forEach((pt) => {
        if (pt.x > 20 && pt.x < width - 20) {
          ctx.fillStyle = pt.color;
          ctx.beginPath();
          ctx.arc(pt.x, centerY, 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.font = 'bold 11px system-ui, sans-serif';
          ctx.fillStyle = pt.color;
          ctx.textAlign = 'center';
          ctx.fillText(pt.label, pt.x, centerY + 18);
        }
      });

      // 6. Object Arrow (Source)
      const objX = centerX - doDist * scale;
      const objYTop = centerY - objectHeight * scale;

      // Draw Object Glow & Arrow
      ctx.save();
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 3.5;
      ctx.shadowColor = '#22c55e';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(objX, centerY);
      ctx.lineTo(objX, objYTop);
      ctx.stroke();

      // Object Arrowhead
      const arrowSize = 9;
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.moveTo(objX, objYTop);
      ctx.lineTo(objX - arrowSize * 0.6, objYTop + arrowSize);
      ctx.lineTo(objX + arrowSize * 0.6, objYTop + arrowSize);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Object Labels
      ctx.font = 'bold 12px system-ui, sans-serif';
      ctx.fillStyle = '#4ade80';
      ctx.textAlign = 'center';
      ctx.fillText(`Object (hₒ=${objectHeight}cm)`, objX, objYTop - 12);
      ctx.font = '10px system-ui, sans-serif';
      ctx.fillStyle = '#86efac';
      ctx.fillText(`dₒ = ${doDist.toFixed(1)} cm`, objX, centerY + 20);

      // 7. Ray Tracing (Ray 1: Parallel to Axis -> Through Focus)
      // (Ray 2: Through Optical Center Vertex O)
      // (Ray 3: Virtual Extension if virtual image)
      const ray1YLens = objYTop;

      // Ray 1: Parallel Ray to Lens
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.moveTo(objX, objYTop);
      ctx.lineTo(centerX, ray1YLens);
      ctx.stroke();

      if (isConvex) {
        // Converging: Goes through F2 (centerX + fPixels)
        const slope1 = (centerY - ray1YLens) / fPixels;
        const ray1EndXR = width;
        const ray1EndYR = ray1YLens + slope1 * (ray1EndXR - centerX);

        ctx.beginPath();
        ctx.moveTo(centerX, ray1YLens);
        ctx.lineTo(ray1EndXR, ray1EndYR);
        ctx.stroke();

        // If virtual (do < f), extend backwards (dotted)
        if (doDist < f) {
          ctx.setLineDash([4, 4]);
          ctx.strokeStyle = 'rgba(250, 204, 21, 0.6)';
          ctx.beginPath();
          ctx.moveTo(centerX, ray1YLens);
          ctx.lineTo(0, ray1YLens - slope1 * centerX);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      } else {
        // Diverging: Appears to come from F1 (centerX - |fPixels|)
        const slope1 = (ray1YLens - centerY) / Math.abs(fPixels);
        const ray1EndXR = width;
        const ray1EndYR = ray1YLens + slope1 * (ray1EndXR - centerX);

        ctx.beginPath();
        ctx.moveTo(centerX, ray1YLens);
        ctx.lineTo(ray1EndXR, ray1EndYR);
        ctx.stroke();

        // Virtual extension back to F1
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.6)';
        ctx.beginPath();
        ctx.moveTo(centerX, ray1YLens);
        ctx.lineTo(centerX - Math.abs(fPixels), centerY);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Ray 2: Central Ray Through Vertex O (undeviated)
      const slope2 = (centerY - objYTop) / (centerX - objX);
      const ray2EndXR = width;
      const ray2EndYR = centerY + slope2 * (ray2EndXR - centerX);

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.moveTo(objX, objYTop);
      ctx.lineTo(centerX, centerY);
      ctx.lineTo(ray2EndXR, ray2EndYR);
      ctx.stroke();

      // Virtual extension backwards if needed
      if (doDist < f && isConvex) {
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(0, centerY - slope2 * centerX);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // 8. Image Arrow (Real or Virtual)
      const imgX = centerX + di * scale;
      const imgYTop = centerY - imageHeight * scale;
      const isReal = di > 0;

      if (imgX > -200 && imgX < width + 200 && Math.abs(imageHeight) < height * 2) {
        ctx.save();
        ctx.strokeStyle = isReal ? '#f43f5e' : '#a855f7';
        ctx.lineWidth = 3;
        ctx.shadowColor = isReal ? '#f43f5e' : '#a855f7';
        ctx.shadowBlur = 10;
        if (!isReal) ctx.setLineDash([5, 3]);

        ctx.beginPath();
        ctx.moveTo(imgX, centerY);
        ctx.lineTo(imgX, imgYTop);
        ctx.stroke();
        ctx.setLineDash([]);

        // Image Arrowhead
        const imgArrowDir = imageHeight > 0 ? 1 : -1;
        const imgArrowSize = 8;
        ctx.fillStyle = isReal ? '#f43f5e' : '#a855f7';
        ctx.beginPath();
        ctx.moveTo(imgX, imgYTop);
        ctx.lineTo(imgX - imgArrowSize * 0.6, imgYTop + imgArrowSize * imgArrowDir);
        ctx.lineTo(imgX + imgArrowSize * 0.6, imgYTop + imgArrowSize * imgArrowDir);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Image Label
        ctx.font = 'bold 12px system-ui, sans-serif';
        ctx.fillStyle = isReal ? '#fb7185' : '#c084fc';
        ctx.textAlign = 'center';
        const imgText = isReal
          ? `Real Image (hᵢ = ${imageHeight.toFixed(1)}cm)`
          : `Virtual Image (hᵢ = ${imageHeight.toFixed(1)}cm)`;
        ctx.fillText(imgText, imgX, imgYTop + (imageHeight > 0 ? -12 : 20));
        ctx.font = '10px system-ui, sans-serif';
        ctx.fillText(`dᵢ = ${di.toFixed(1)} cm`, imgX, centerY + (imageHeight > 0 ? 20 : -12));
      }

      // 9. Floating Diopter HUD Pill
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1.5;
      const hudW = 240;
      const hudH = 68;
      const hudX = width - hudW - 16;
      const hudY = 16;

      ctx.beginPath();
      ctx.roundRect(hudX, hudY, hudW, hudH, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 13px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('OPTOMETRY / THIN LENS', hudX + 12, hudY + 22);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 15px monospace';
      ctx.fillText(
        `P = ${lensPower >= 0 ? '+' : ''}${lensPower.toFixed(2)} dpt`,
        hudX + 12,
        hudY + 44
      );

      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px monospace';
      ctx.fillText(`M = ${magnification.toFixed(2)}×  |  f = ${f.toFixed(1)}cm`, hudX + 12, hudY + 59);

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [f, doDist, objectHeight, di, magnification, imageHeight, lensPower]);

  return (
    <div className="relative w-full h-[320px] sm:h-[380px] md:h-[430px] rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
