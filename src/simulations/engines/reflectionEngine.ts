import { BaseSimulationEngine } from '../core/BaseSimulationEngine';
import { SmartLabelSystem, AnnotationPriority } from '../core/AnnotationSystem';

export interface ReflectionParams extends Record<string, number> {
  incidentAngle?: number; // deg
  mirrorAngle?: number; // deg (for angled mirrors)
  periscopeHeight?: number; // cm
  mode?: number; // 1 = Periscope, 2 = Angled Mirrors
  [key: string]: number | undefined;
}

export class ReflectionEngine extends BaseSimulationEngine<ReflectionParams> {
  constructor(initialParams: ReflectionParams = {}) {
    super(
      {
        incidentAngle: initialParams.incidentAngle ?? 45,
        mirrorAngle: initialParams.mirrorAngle ?? 90,
        periscopeHeight: initialParams.periscopeHeight ?? 60,
        mode: initialParams.mode ?? 1,
        ...initialParams,
      },
      {
        incidentAngle: 45,
        reflectionAngle: 45,
        numImages: 3,
        pathLength: 120,
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
    this.calculateMetrics();
  }

  private calculateMetrics(): void {
    const thetaI = this.params.incidentAngle ?? this.params.var1 ?? 45;
    const mirrorAngle = this.params.mirrorAngle ?? this.params.var2 ?? 90;
    const height = this.params.periscopeHeight ?? 60;

    // Law of Reflection: theta_r = theta_i
    const thetaR = thetaI;

    // Angled Mirrors: N = round(360 / theta) - 1
    const safeAngle = Math.max(mirrorAngle, 10);
    const numImages = Math.max(Math.round(360 / safeAngle) - 1, 1);

    this.state.incidentAngle = thetaI;
    this.state.reflectionAngle = thetaR;
    this.state.mirrorAngle = mirrorAngle;
    this.state.numImages = numImages;
    this.state.pathLength = Number((height * 2 + 40).toFixed(1));

    this.state.out1 = thetaR;
    this.state.out2 = numImages;
  }

  protected render(): void {
    if (!this.ctx || !this.canvas) return;

    const ctx = this.ctx;
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);

    ctx.clearRect(0, 0, width, height);

    const isPeriscope = (this.params.mode ?? 1) === 1;

    if (isPeriscope) {
      this.renderPeriscope(ctx, width, height);
    } else {
      this.renderAngledMirrors(ctx, width, height);
    }
  }

  private renderPeriscope(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const midX = width / 2;
    const tubeWidth = 50;
    const topY = height * 0.18;
    const botY = height * 0.82;
    const leftArmX = midX - 100;
    const rightArmX = midX + 100;

    const labelSystem = new SmartLabelSystem(ctx, width, height, 11);

    // 1. Draw Periscope Body (Z-Shape Outline)
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;

    ctx.beginPath();
    // Top arm (left)
    ctx.moveTo(leftArmX - 40, topY - tubeWidth / 2);
    ctx.lineTo(midX + tubeWidth / 2, topY - tubeWidth / 2);
    ctx.lineTo(midX + tubeWidth / 2, botY + tubeWidth / 2);
    ctx.lineTo(rightArmX + 40, botY + tubeWidth / 2);
    ctx.lineTo(rightArmX + 40, botY - tubeWidth / 2);
    ctx.lineTo(midX - tubeWidth / 2, botY - tubeWidth / 2);
    ctx.lineTo(midX - tubeWidth / 2, topY + tubeWidth / 2);
    ctx.lineTo(leftArmX - 40, topY + tubeWidth / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 2. Draw Top 45-degree Mirror
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(midX - tubeWidth / 2, topY - tubeWidth / 2);
    ctx.lineTo(midX + tubeWidth / 2, topY + tubeWidth / 2);
    ctx.stroke();

    // 3. Draw Bottom 45-degree Mirror
    ctx.beginPath();
    ctx.moveTo(midX - tubeWidth / 2, botY - tubeWidth / 2);
    ctx.lineTo(midX + tubeWidth / 2, botY + tubeWidth / 2);
    ctx.stroke();

    // 4. Draw Incident, Internal & Reflected Light Ray Path
    ctx.strokeStyle = '#f43f5e'; // Red Laser beam
    ctx.lineWidth = 3;
    ctx.beginPath();
    // Ray into top entrance
    ctx.moveTo(leftArmX - 60, topY);
    ctx.lineTo(midX, topY);
    // Down through vertical shaft
    ctx.lineTo(midX, botY);
    // Out to viewer
    ctx.lineTo(rightArmX + 60, botY);
    ctx.stroke();

    // Glowing laser pulse
    const t = Date.now() / 600;
    const pulseX = (leftArmX - 60) + ((t % 3) / 3) * (rightArmX + 120 - leftArmX);
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#f43f5e';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(midX, topY, 4, 0, Math.PI * 2);
    ctx.arc(midX, botY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Normal lines at 45 deg mirrors
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(midX - 25, topY + 25);
    ctx.lineTo(midX + 25, topY - 25);
    ctx.moveTo(midX - 25, botY + 25);
    ctx.lineTo(midX + 25, botY - 25);
    ctx.stroke();
    ctx.setLineDash([]);

    // 5. Annotations
    labelSystem.renderAnnotations([
      {
        id: 'law-of-reflection',
        anchorX: midX,
        anchorY: 28,
        text: 'Law of Reflection: θᵢ = θᵣ = 45°',
        compactText: 'θᵢ = θᵣ = 45°',
        priority: AnnotationPriority.PRIMARY_VALUE,
        color: '#38bdf8',
        borderColor: '#0284c7',
      },
      {
        id: 'top-mirror',
        anchorX: midX + 35,
        anchorY: topY - 18,
        text: 'Top Mirror (45°)',
        compactText: 'Mirror 1',
        priority: AnnotationPriority.OBJECT_NAME,
        color: '#93c5fd',
        borderColor: '#3b82f6',
      },
      {
        id: 'bottom-mirror',
        anchorX: midX + 35,
        anchorY: botY + 22,
        text: 'Bottom Mirror (45°)',
        compactText: 'Mirror 2',
        priority: AnnotationPriority.OBJECT_NAME,
        color: '#93c5fd',
        borderColor: '#3b82f6',
      },
      {
        id: 'observer-eye',
        anchorX: rightArmX + 45,
        anchorY: botY - 18,
        text: 'Observer Eye / Output',
        compactText: 'Eye',
        priority: AnnotationPriority.MEASUREMENT,
        color: '#4ade80',
        borderColor: '#16a34a',
      },
    ]);
  }

  private renderAngledMirrors(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const midX = width / 2;
    const midY = height / 2 + 20;
    const mirrorLen = Math.min(width, height) * 0.38;

    const angleDeg = Number(this.state.mirrorAngle || 90);
    const numImages = Number(this.state.numImages || 3);
    const halfAngleRad = (angleDeg * Math.PI) / 360;

    // Draw Mirror 1 and Mirror 2
    const m1X = midX + mirrorLen * Math.cos(Math.PI / 2 - halfAngleRad);
    const m1Y = midY - mirrorLen * Math.sin(Math.PI / 2 - halfAngleRad);
    const m2X = midX + mirrorLen * Math.cos(Math.PI / 2 + halfAngleRad);
    const m2Y = midY - mirrorLen * Math.sin(Math.PI / 2 + halfAngleRad);

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(midX, midY);
    ctx.lineTo(m1X, m1Y);
    ctx.moveTo(midX, midY);
    ctx.lineTo(m2X, m2Y);
    ctx.stroke();

    // Object in between mirrors
    const objDist = mirrorLen * 0.6;
    const objX = midX;
    const objY = midY - objDist;

    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(objX, objY, 7, 0, Math.PI * 2);
    ctx.fill();

    // Render Virtual Images around vertex circle
    for (let i = 1; i <= numImages; i++) {
      const imgAngle = (Math.PI / 2) + ((i % 2 === 1 ? 1 : -1) * Math.ceil(i / 2) * (angleDeg * Math.PI) / 180);
      const imgX = midX + objDist * Math.cos(imgAngle);
      const imgY = midY - objDist * Math.sin(imgAngle);

      ctx.fillStyle = '#f43f5e88';
      ctx.beginPath();
      ctx.arc(imgX, imgY, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`N = (360° / ${angleDeg}°) - 1 = ${numImages} Images`, midX, 30);
  }
}
