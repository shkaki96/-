import { BaseSimulationEngine } from '../core/BaseSimulationEngine';
import { SmartLabelSystem, AnnotationPriority } from '../core/AnnotationSystem';

export interface LensOpticsParams extends Record<string, number> {
  focalLength?: number; // cm (+ for convex, - for concave)
  objectDistance?: number; // cm (d_o > 0)
  objectHeight?: number; // cm (h_o > 0)
  lensType?: number; // 1 = Convex (Converging), 2 = Concave (Diverging)
  [key: string]: number | undefined;
}

export class LensOpticsEngine extends BaseSimulationEngine<LensOpticsParams> {
  constructor(initialParams: LensOpticsParams = {}) {
    super(
      {
        focalLength: initialParams.focalLength ?? 20,
        objectDistance: initialParams.objectDistance ?? 40,
        objectHeight: initialParams.objectHeight ?? 10,
        lensType: initialParams.lensType ?? 1,
        ...initialParams,
      },
      {
        lensPower: 5.0,
        imageDistance: 40.0,
        magnification: -1.0,
        imageHeight: -10.0,
        isReal: true,
        isInverted: true,
      }
    );
  }

  protected onInit(): void {
    this.calculateMetrics();
  }

  protected onParamsUpdated(): void {
    this.calculateMetrics();
  }

  protected onReset(): void {
    this.calculateMetrics();
  }

  public step(_deltaTime: number): void {
    // Dynamic optical calculations
    this.calculateMetrics();
  }

  private calculateMetrics(): void {
    const rawF = this.params.focalLength ?? this.params.var1 ?? 20;
    const isConcave = (this.params.lensType === 2) || (rawF < 0);
    const fCm = isConcave ? -Math.abs(rawF) : Math.abs(rawF);
    const doCm = Math.max(this.params.objectDistance ?? this.params.var2 ?? 40, 2);
    const hoCm = Math.max(this.params.objectHeight ?? this.params.var3 ?? 10, 1);

    // 1. Lens Power P = 1 / f (in meters) -> 100 / f(cm) [Diopters (dpt)]
    const fMeters = fCm / 100;
    const powerDpt = Number((1 / fMeters).toFixed(2));

    // 2. Thin Lens Equation: 1/f = 1/do + 1/di => di = (f * do) / (do - f)
    let diCm = 0;
    let magnification = 0;
    let isReal = true;
    let isInverted = true;

    if (Math.abs(doCm - fCm) < 0.001) {
      // Object at exact focus -> image at infinity
      diCm = 9999;
      magnification = 999;
      isReal = false;
      isInverted = false;
    } else {
      diCm = (fCm * doCm) / (doCm - fCm);
      magnification = -diCm / doCm;
      isReal = diCm > 0;
      isInverted = magnification < 0;
    }

    const hiCm = magnification * hoCm;

    this.state.lensPower = powerDpt;
    this.state.focalLength = fCm;
    this.state.focalLengthM = Number(fMeters.toFixed(2));
    this.state.objectDistance = doCm;
    this.state.objectHeight = hoCm;
    this.state.imageDistance = Number(diCm.toFixed(2));
    this.state.magnification = Number(magnification.toFixed(2));
    this.state.imageHeight = Number(hiCm.toFixed(2));
    this.state.isReal = isReal;
    this.state.isInverted = isInverted;

    // For generic output listeners
    this.state.out1 = powerDpt;
    this.state.power = powerDpt;
    this.state.di = Number(diCm.toFixed(2));
    this.state.mag = Number(magnification.toFixed(2));
  }

  protected render(): void {
    if (!this.ctx || !this.canvas) return;

    const ctx = this.ctx;
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);

    ctx.clearRect(0, 0, width, height);

    // Coordinate system setup: Optical axis at center Y
    const midX = width / 2;
    const axisY = height / 2;

    // Scale factors: pixels per cm
    const scale = Math.min(width / 140, height / 50);

    const fCm = Number(this.state.focalLength || 20);
    const doCm = Number(this.state.objectDistance || 40);
    const hoCm = Number(this.state.objectHeight || 10);
    const diCm = Number(this.state.imageDistance || 40);
    const hiCm = Number(this.state.imageHeight || -10);
    const isConvex = fCm > 0;

    // Initialize Smart Label System
    const labelSystem = new SmartLabelSystem(ctx, width, height, 11);

    // 1. Draw Optical Bench Grid & Axis
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Optical Principal Axis (White / Slate line)
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(10, axisY);
    ctx.lineTo(width - 10, axisY);
    ctx.stroke();

    labelSystem.addObstacle({ type: 'line', x1: 10, y1: axisY, x2: width - 10, y2: axisY, padding: 6 });

    // 2. Draw Lens at midX
    const lensRadius = Math.min(height * 0.42, 140);
    ctx.strokeStyle = '#38bdf8';
    ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    if (isConvex) {
      // Biconvex Lens shape
      ctx.arc(midX - lensRadius * 0.7, axisY, lensRadius, -0.45, 0.45, false);
      ctx.arc(midX + lensRadius * 0.7, axisY, lensRadius, Math.PI - 0.45, Math.PI + 0.45, false);
    } else {
      // Biconcave Lens shape
      ctx.moveTo(midX - 12, axisY - lensRadius * 0.8);
      ctx.lineTo(midX + 12, axisY - lensRadius * 0.8);
      ctx.arcTo(midX + 3, axisY, midX + 12, axisY + lensRadius * 0.8, 30);
      ctx.lineTo(midX - 12, axisY + lensRadius * 0.8);
      ctx.arcTo(midX - 3, axisY, midX - 12, axisY - lensRadius * 0.8, 30);
      ctx.closePath();
    }
    ctx.fill();
    ctx.stroke();

    // Eyeglasses Lens Center Line
    ctx.strokeStyle = '#38bdf8';
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(midX, axisY - lensRadius * 0.85);
    ctx.lineTo(midX, axisY + lensRadius * 0.85);
    ctx.stroke();
    ctx.setLineDash([]);

    labelSystem.addObstacle({ type: 'box', x: midX - 18, y: axisY - lensRadius, width: 36, height: lensRadius * 2 });

    // 3. Mark Focal Points F1, F2 and 2F1, 2F2
    const fPixel = Math.abs(fCm) * scale;
    const f1X = midX - fPixel; // Front focal point
    const f2X = midX + fPixel; // Back focal point
    const f2x1 = midX - 2 * fPixel;
    const f2x2 = midX + 2 * fPixel;

    // Draw focal tick marks
    const drawPoint = (px: number, label: string, color: string = '#38bdf8') => {
      if (px < 15 || px > width - 15) return;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(px, axisY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(label, px, axisY + 16);
      labelSystem.addObstacle({ type: 'circle', x: px, y: axisY, radius: 8 });
    };

    drawPoint(f1X, 'F₁', '#38bdf8');
    drawPoint(f2X, 'F₂', '#38bdf8');
    if (f2x1 > 20) drawPoint(f2x1, '2F₁', '#94a3b8');
    if (f2x2 < width - 20) drawPoint(f2x2, '2F₂', '#94a3b8');

    // 4. Draw Object (Arrow on Left)
    const objX = midX - doCm * scale;
    const objTopY = axisY - hoCm * scale;

    ctx.strokeStyle = '#22c55e'; // Green arrow for object
    ctx.fillStyle = '#22c55e';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(objX, axisY);
    ctx.lineTo(objX, objTopY);
    ctx.stroke();

    // Arrowhead
    ctx.beginPath();
    ctx.moveTo(objX, objTopY);
    ctx.lineTo(objX - 6, objTopY + 10);
    ctx.lineTo(objX + 6, objTopY + 10);
    ctx.closePath();
    ctx.fill();

    labelSystem.addObstacle({ type: 'line', x1: objX, y1: axisY, x2: objX, y2: objTopY, padding: 8 });

    // 5. Draw Image (Arrow on Right or Left for Virtual)
    const imgX = midX + diCm * scale;
    const imgTopY = axisY - hiCm * scale;

    if (Math.abs(diCm) < 500 && imgX > 10 && imgX < width - 10) {
      const isReal = this.state.isReal;
      ctx.strokeStyle = isReal ? '#f43f5e' : '#a855f7'; // Red for real, Purple for virtual
      ctx.fillStyle = isReal ? '#f43f5e' : '#a855f7';
      ctx.lineWidth = 3.5;

      if (!isReal) ctx.setLineDash([4, 3]);

      ctx.beginPath();
      ctx.moveTo(imgX, axisY);
      ctx.lineTo(imgX, imgTopY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Arrowhead for image (pointing in direction of height)
      const arrowDir = hiCm >= 0 ? 1 : -1;
      ctx.beginPath();
      ctx.moveTo(imgX, imgTopY);
      ctx.lineTo(imgX - 6, imgTopY + 10 * arrowDir);
      ctx.lineTo(imgX + 6, imgTopY + 10 * arrowDir);
      ctx.closePath();
      ctx.fill();

      labelSystem.addObstacle({ type: 'line', x1: imgX, y1: axisY, x2: imgX, y2: imgTopY, padding: 8 });
    }

    // 6. Draw 3 Standard Principal Light Rays
    if (isConvex) {
      // Ray 1: Parallel to axis, then through F2
      ctx.strokeStyle = '#ef4444'; // Red
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(objX, objTopY);
      ctx.lineTo(midX, objTopY);
      ctx.stroke();

      // Refracted ray extending through F2
      ctx.beginPath();
      ctx.moveTo(midX, objTopY);
      // Slope: (axisY - objTopY) / (f2X - midX)
      const slope1 = (axisY - objTopY) / (f2X - midX);
      const endX1 = width - 15;
      const endY1 = objTopY + slope1 * (endX1 - midX);
      ctx.lineTo(endX1, endY1);
      ctx.stroke();

      // Ray 2: Straight through optical center (midX, axisY)
      ctx.strokeStyle = '#06b6d4'; // Cyan
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(objX, objTopY);
      const slope2 = (axisY - objTopY) / (midX - objX);
      const endX2 = width - 15;
      const endY2 = objTopY + slope2 * (endX2 - objX);
      ctx.lineTo(endX2, endY2);
      ctx.stroke();

      // If virtual image, draw dashed trace-back rays
      if (!this.state.isReal && imgX > 10) {
        ctx.strokeStyle = '#f43f5e88';
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(midX, objTopY);
        ctx.lineTo(imgX, imgTopY);
        ctx.stroke();

        ctx.strokeStyle = '#06b6d488';
        ctx.beginPath();
        ctx.moveTo(midX, axisY);
        ctx.lineTo(imgX, imgTopY);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    } else {
      // Concave (Diverging) Lens Rays
      ctx.strokeStyle = '#ef4444'; // Red
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(objX, objTopY);
      ctx.lineTo(midX, objTopY);
      ctx.stroke();

      // Refracted ray diverges as if coming from F1 (midX - fPixel)
      const f1VirtualX = midX - fPixel;
      const slopeDiv = (objTopY - axisY) / (midX - f1VirtualX);
      const endXDiv = width - 15;
      const endYDiv = objTopY + slopeDiv * (endXDiv - midX);

      ctx.beginPath();
      ctx.moveTo(midX, objTopY);
      ctx.lineTo(endXDiv, endYDiv);
      ctx.stroke();

      // Dashed trace back to virtual focus F1
      ctx.strokeStyle = '#ef444488';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(midX, objTopY);
      ctx.lineTo(f1VirtualX, axisY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Ray 2: Center ray
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(objX, objTopY);
      const slope2 = (axisY - objTopY) / (midX - objX);
      ctx.lineTo(width - 15, objTopY + slope2 * (width - 15 - objX));
      ctx.stroke();
    }

    // 7. Dynamic Smart Annotations
    const powerStr = `${Number(this.state.lensPower) > 0 ? '+' : ''}${this.state.lensPower} dpt`;
    const fStr = `${fCm > 0 ? '+' : ''}${fCm} cm`;

    labelSystem.renderAnnotations([
      {
        id: 'lens-power-badge',
        anchorX: midX,
        anchorY: Math.max(35, axisY - lensRadius * 0.85 - 18),
        text: `Lens Power: P = 1/f = ${powerStr} (${isConvex ? 'Convex' : 'Concave'})`,
        compactText: `P = ${powerStr}`,
        priority: AnnotationPriority.PRIMARY_VALUE,
        color: '#38bdf8',
        borderColor: '#0284c7',
      },
      {
        id: 'object-label',
        anchorX: objX,
        anchorY: objTopY - 14,
        text: `Object (dₒ = ${doCm} cm, hₒ = ${hoCm} cm)`,
        compactText: `dₒ = ${doCm}cm`,
        priority: AnnotationPriority.MEASUREMENT,
        color: '#4ade80',
        borderColor: '#16a34a',
      },
      {
        id: 'image-label',
        anchorX: Math.min(Math.max(imgX, 60), width - 70),
        anchorY: Math.min(Math.max(imgTopY + (hiCm < 0 ? 18 : -14), 40), height - 20),
        text: `Image (dᵢ = ${diCm.toFixed(1)} cm, M = ${Number(this.state.magnification).toFixed(2)}) • ${this.state.isReal ? 'Real' : 'Virtual'}`,
        compactText: `dᵢ = ${diCm.toFixed(1)}cm`,
        priority: AnnotationPriority.MEASUREMENT,
        color: this.state.isReal ? '#f87171' : '#c084fc',
        borderColor: this.state.isReal ? '#dc2626' : '#9333ea',
      },
      {
        id: 'focal-length-label',
        anchorX: f2X,
        anchorY: axisY + 32,
        text: `Focal Length f = ${fStr}`,
        compactText: `f = ${fStr}`,
        priority: AnnotationPriority.SECONDARY_INFO,
        color: '#93c5fd',
        borderColor: '#3b82f6',
      },
    ]);
  }
}
