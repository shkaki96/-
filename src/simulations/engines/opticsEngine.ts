import { BaseSimulationEngine } from '../core/BaseSimulationEngine';
import { SmartLabelSystem, AnnotationPriority } from '../core/AnnotationSystem';

export interface OpticsParams extends Record<string, number> {
  incidentAngle?: number; // deg
  n1?: number; // refractive index 1
  n2?: number; // refractive index 2
  [key: string]: number;
}

export class OpticsEngine extends BaseSimulationEngine<OpticsParams> {
  constructor(initialParams: OpticsParams) {
    super(initialParams, {
      refractedAngle: 0,
      criticalAngle: 0,
    });
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

  private calculateMetrics(): void {
    const theta1Deg = this.params.incidentAngle ?? this.params.var1 ?? 30;
    const n1 = this.params.n1 ?? 1.0;
    const n2 = this.params.n2 ?? 1.5;

    this.state.incidentAngle = theta1Deg;
    this.state.n1 = n1;
    this.state.n2 = n2;
    this.state.lightSpeedM1 = Number((3.0 / n1).toFixed(2));
    this.state.lightSpeedM2 = Number((3.0 / n2).toFixed(2));

    const theta1Rad = (theta1Deg * Math.PI) / 180;
    const sinTheta2 = (n1 * Math.sin(theta1Rad)) / n2;

    if (sinTheta2 <= 1.0) {
      const theta2Rad = Math.asin(sinTheta2);
      this.state.refractedAngle = Number(((theta2Rad * 180) / Math.PI).toFixed(1));
    } else {
      this.state.refractedAngle = 'Total Reflection';
    }

    if (n1 > n2) {
      const sinCritical = n2 / n1;
      this.state.criticalAngle = Number(((Math.asin(sinCritical) * 180) / Math.PI).toFixed(1));
    } else {
      this.state.criticalAngle = 'N/A';
    }
  }

  public step(_deltaTime: number): void {}

  protected render(): void {
    if (!this.ctx || !this.canvas) return;

    const ctx = this.ctx;
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);

    ctx.clearRect(0, 0, width, height);

    const midX = width / 2;
    const midY = height / 2;

    const theta1Deg = this.params.incidentAngle ?? this.params.var1 ?? 30;
    const n1 = this.params.n1 ?? 1.0;
    const n2 = this.params.n2 ?? 1.5;

    // Initialize Smart Annotation System
    const labelSystem = new SmartLabelSystem(ctx, width, height, 12);

    // 1. Draw Medium 2 (Bottom glass block)
    ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
    ctx.fillRect(0, midY, width, height - midY);

    // Boundary Line
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(width, midY);
    ctx.stroke();

    labelSystem.addObstacle({ type: 'line', x1: 0, y1: midY, x2: width, y2: midY, padding: 8 });

    // Normal Line (Dotted)
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(midX, 20);
    ctx.lineTo(midX, height - 20);
    ctx.stroke();
    ctx.setLineDash([]);

    labelSystem.addObstacle({ type: 'line', x1: midX, y1: 0, x2: midX, y2: height, padding: 8 });

    // 2. Incident Ray (From top left to center)
    const theta1Rad = (theta1Deg * Math.PI) / 180;
    const rayLength = height * 0.4;
    const incX = midX - rayLength * Math.sin(theta1Rad);
    const incY = midY - rayLength * Math.cos(theta1Rad);

    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(incX, incY);
    ctx.lineTo(midX, midY);
    ctx.stroke();

    labelSystem.addObstacle({ type: 'line', x1: incX, y1: incY, x2: midX, y2: midY, padding: 10 });

    // Laser Source Indicator
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(incX, incY, 6, 0, Math.PI * 2);
    ctx.fill();

    labelSystem.addObstacle({ type: 'circle', x: incX, y: incY, radius: 10 });

    // 3. Refracted / Reflected Ray
    const sinTheta2 = (n1 * Math.sin(theta1Rad)) / n2;
    let refX = midX;
    let refY = midY;

    if (sinTheta2 <= 1.0) {
      const theta2Rad = Math.asin(sinTheta2);
      refX = midX + rayLength * Math.sin(theta2Rad);
      refY = midY + rayLength * Math.cos(theta2Rad);

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(midX, midY);
      ctx.lineTo(refX, refY);
      ctx.stroke();
    } else {
      // Total Internal Reflection
      refX = midX + rayLength * Math.sin(theta1Rad);
      refY = midY - rayLength * Math.cos(theta1Rad);

      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(midX, midY);
      ctx.lineTo(refX, refY);
      ctx.stroke();
    }

    labelSystem.addObstacle({ type: 'line', x1: midX, y1: midY, x2: refX, y2: refY, padding: 10 });

    // Register Smart Annotations
    const incidentMidX = (incX + midX) / 2;
    const incidentMidY = (incY + midY) / 2;
    const refractedMidX = (midX + refX) / 2;
    const refractedMidY = (midY + refY) / 2;

    labelSystem.renderAnnotations([
      {
        id: 'incident-angle',
        anchorX: incidentMidX,
        anchorY: incidentMidY,
        text: `θ₁ (Incident) = ${theta1Deg}°`,
        compactText: `θ₁: ${theta1Deg}°`,
        priority: AnnotationPriority.PRIMARY_VALUE,
        color: '#f43f5e',
        borderColor: '#f43f5e',
      },
      {
        id: 'refracted-angle',
        anchorX: refractedMidX,
        anchorY: refractedMidY,
        text: `θ₂ (Refracted) = ${this.state.refractedAngle}°`,
        compactText: `θ₂: ${this.state.refractedAngle}°`,
        priority: AnnotationPriority.PRIMARY_VALUE,
        color: '#38bdf8',
        borderColor: '#0284c7',
      },
      {
        id: 'laser-source',
        anchorX: incX,
        anchorY: incY,
        text: 'Laser Source',
        compactText: 'Laser',
        priority: AnnotationPriority.OBJECT_NAME,
        color: '#fca5a5',
        borderColor: '#f43f5e',
      },
      {
        id: 'medium-1',
        anchorX: width * 0.15,
        anchorY: Math.max(30, midY - 30),
        text: `Medium 1 (n₁ = ${n1})`,
        compactText: `n₁ = ${n1}`,
        priority: AnnotationPriority.MEASUREMENT,
        color: '#e2e8f0',
        borderColor: '#64748b',
      },
      {
        id: 'medium-2',
        anchorX: width * 0.15,
        anchorY: Math.min(height - 30, midY + 30),
        text: `Medium 2 (n₂ = ${n2})`,
        compactText: `n₂ = ${n2}`,
        priority: AnnotationPriority.MEASUREMENT,
        color: '#38bdf8',
        borderColor: '#0284c7',
      },
    ]);
  }
}
