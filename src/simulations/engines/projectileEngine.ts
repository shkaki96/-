import { BaseSimulationEngine } from '../core/BaseSimulationEngine';
import { SmartLabelSystem, AnnotationPriority } from '../core/AnnotationSystem';

export interface ProjectileParams extends Record<string, number> {
  initialVelocity?: number; // m/s
  launchAngle?: number; // deg
  gravity?: number; // m/s²
  initialHeight?: number; // m
  [key: string]: number | undefined;
}

export class ProjectileEngine extends BaseSimulationEngine<Record<string, number>> {
  private trajectoryPoints: { x: number; y: number }[] = [];

  constructor(initialParams: Record<string, number>) {
    super(initialParams, {
      posX: 0,
      posY: 0,
      velX: 0,
      velY: 0,
      speed: 0,
      range: 0,
      maxHeight: 0,
      flightTime: 0,
    });
  }

  protected onInit(): void {
    this.calculateMetrics();
    this.resetTrajectory();
  }

  protected onParamsUpdated(): void {
    this.calculateMetrics();
    this.resetTrajectory();
  }

  protected onReset(): void {
    this.calculateMetrics();
    this.resetTrajectory();
  }

  private resetTrajectory(): void {
    this.trajectoryPoints = [];
    const v0 = this.getV0();
    const thetaDeg = this.getAngle();
    const g = this.getG();
    const h0 = this.getH0();
    const thetaRad = (thetaDeg * Math.PI) / 180;
    const v0x = v0 * Math.cos(thetaRad);
    const v0y = v0 * Math.sin(thetaRad);
    const tFlight = (v0y + Math.sqrt(v0y * v0y + 2 * g * h0)) / g;

    // Precompute trajectory curve
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * tFlight;
      const x = v0x * t;
      const y = Math.max(0, h0 + v0y * t - 0.5 * g * t * t);
      this.trajectoryPoints.push({ x, y });
    }
  }

  private getV0(): number {
    return this.params.initialVelocity ?? this.params.v0 ?? this.params.var1 ?? 25;
  }

  private getAngle(): number {
    return this.params.launchAngle ?? this.params.angle ?? this.params.theta ?? 45;
  }

  private getG(): number {
    return this.params.gravity ?? this.params.g ?? 9.81;
  }

  private getH0(): number {
    return this.params.initialHeight ?? this.params.h0 ?? 0;
  }

  private calculateMetrics(): void {
    const v0 = this.getV0();
    const thetaDeg = this.getAngle();
    const g = this.getG();
    const h0 = this.getH0();

    const thetaRad = (thetaDeg * Math.PI) / 180;
    const v0x = v0 * Math.cos(thetaRad);
    const v0y = v0 * Math.sin(thetaRad);

    const tFlight = Number(((v0y + Math.sqrt(v0y * v0y + 2 * g * h0)) / g).toFixed(2));
    const range = Number((v0x * tFlight).toFixed(2));
    const maxHeight = Number((h0 + (v0y * v0y) / (2 * g)).toFixed(2));

    this.state.range = range;
    this.state.maxHeight = maxHeight;
    this.state.flightTime = tFlight;
    this.state.v0 = v0;
    this.state.angle = thetaDeg;
    this.state.gravity = g;

    const t = Math.min(this.time, tFlight);
    const posX = Number((v0x * t).toFixed(2));
    const posY = Number((Math.max(0, h0 + v0y * t - 0.5 * g * t * t)).toFixed(2));
    const velX = Number(v0x.toFixed(2));
    const velY = Number((v0y - g * t).toFixed(2));
    const speed = Number(Math.sqrt(velX * velX + velY * velY).toFixed(2));

    this.state.posX = posX;
    this.state.posY = posY;
    this.state.velX = velX;
    this.state.velY = velY;
    this.state.speed = speed;
  }

  public step(_deltaTime: number): void {
    this.calculateMetrics();
  }

  protected render(): void {
    if (!this.ctx || !this.canvas) return;

    const ctx = this.ctx;
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);

    ctx.clearRect(0, 0, width, height);

    const labelSystem = new SmartLabelSystem(ctx, width, height, 12);

    const groundY = height * 0.82;
    const originX = width * 0.12;

    const range = (this.state.range as number) || 50;
    const maxHeight = (this.state.maxHeight as number) || 20;

    const scaleX = (width * 0.76) / Math.max(range * 1.15, 10);
    const scaleY = (height * 0.6) / Math.max(maxHeight * 1.3, 10);

    // 1. Draw Ground Base
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(originX - 20, groundY);
    ctx.lineTo(width - 20, groundY);
    ctx.stroke();

    // Ground Grid Lines
    ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
    ctx.fillRect(0, groundY, width, height - groundY);

    // 2. Draw Predicted Trajectory Curve
    if (this.trajectoryPoints.length > 1) {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      this.trajectoryPoints.forEach((pt, idx) => {
        const px = originX + pt.x * scaleX;
        const py = groundY - pt.y * scaleY;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 3. Draw Max Height Marker & Range Marker
    const peakX = originX + (range / 2) * scaleX;
    const peakY = groundY - maxHeight * scaleY;
    const landX = originX + range * scaleX;

    // Vertical dashed line to peak
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.3)';
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(peakX, groundY);
    ctx.lineTo(peakX, peakY);
    ctx.stroke();
    ctx.setLineDash([]);

    // 4. Draw Current Projectile Ball
    const currX = (this.state.posX as number) || 0;
    const currY = (this.state.posY as number) || 0;
    const ballScreenX = originX + currX * scaleX;
    const ballScreenY = groundY - currY * scaleY;

    // Velocity Vector Arrow
    const velX = (this.state.velX as number) || 0;
    const velY = (this.state.velY as number) || 0;
    const arrowScale = 1.5;
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ballScreenX, ballScreenY);
    ctx.lineTo(ballScreenX + velX * arrowScale, ballScreenY - velY * arrowScale);
    ctx.stroke();

    // Projectile Ball Glow & Fill
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#0284c7';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(ballScreenX, ballScreenY, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // 5. Cannon / Launch Guide
    const angleRad = (this.getAngle() * Math.PI) / 180;
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(originX, groundY);
    ctx.lineTo(originX + 24 * Math.cos(angleRad), groundY - 24 * Math.sin(angleRad));
    ctx.stroke();

    // 6. Smart Annotations
    labelSystem.renderAnnotations([
      {
        id: 'projectile-range',
        anchorX: landX,
        anchorY: groundY + 12,
        text: `Range (R) = ${range} m`,
        compactText: `R = ${range} m`,
        priority: AnnotationPriority.PRIMARY_VALUE,
        color: '#10b981',
        borderColor: '#059669',
      },
      {
        id: 'max-height',
        anchorX: peakX,
        anchorY: peakY - 10,
        text: `H_max = ${maxHeight} m`,
        compactText: `H = ${maxHeight} m`,
        priority: AnnotationPriority.PRIMARY_VALUE,
        color: '#eab308',
        borderColor: '#ca8a04',
      },
      {
        id: 'flight-metrics',
        anchorX: ballScreenX,
        anchorY: ballScreenY - 14,
        text: `v = ${this.state.speed} m/s | t = ${this.time.toFixed(1)} s`,
        compactText: `${this.state.speed} m/s`,
        priority: AnnotationPriority.SECONDARY_INFO,
        color: '#38bdf8',
        borderColor: '#0284c7',
      },
      {
        id: 'launch-info',
        anchorX: originX,
        anchorY: groundY - 35,
        text: `v₀ = ${this.getV0()} m/s @ ${this.getAngle()}°`,
        compactText: `${this.getV0()} m/s`,
        priority: AnnotationPriority.OBJECT_NAME,
        color: '#cbd5e1',
        borderColor: '#475569',
      },
    ]);
  }
}
