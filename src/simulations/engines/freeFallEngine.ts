import { BaseSimulationEngine } from '../core/BaseSimulationEngine';
import { SmartLabelSystem, AnnotationPriority } from '../core/AnnotationSystem';

export interface FreeFallParams extends Record<string, number> {
  initialHeight?: number; // m
  gravity?: number; // m/s²
  mass?: number; // kg
  [key: string]: number | undefined;
}

export class FreeFallEngine extends BaseSimulationEngine<Record<string, number>> {
  constructor(initialParams: Record<string, number>) {
    super(initialParams, {
      currentHeight: 0,
      velocity: 0,
      impactVelocity: 0,
      impactTime: 0,
      kineticEnergy: 0,
      potentialEnergy: 0,
      totalEnergy: 0,
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

  private getH0(): number {
    return this.params.initialHeight ?? this.params.height ?? this.params.h0 ?? this.params.var1 ?? 50;
  }

  private getG(): number {
    return this.params.gravity ?? this.params.g ?? 9.81;
  }

  private getM(): number {
    return this.params.mass ?? this.params.m ?? 1.0;
  }

  private calculateMetrics(): void {
    const h0 = this.getH0();
    const g = this.getG();
    const m = this.getM();

    const tImpact = Number(Math.sqrt((2 * h0) / g).toFixed(2));
    const vImpact = Number(Math.sqrt(2 * g * h0).toFixed(2));
    const totalE = Number((m * g * h0).toFixed(2));

    const t = Math.min(this.time, tImpact);
    const currH = Number(Math.max(0, h0 - 0.5 * g * t * t).toFixed(2));
    const currV = Number((g * t).toFixed(2));
    const ek = Number((0.5 * m * currV * currV).toFixed(2));
    const ep = Number((m * g * currH).toFixed(2));

    this.state.initialHeight = h0;
    this.state.gravity = g;
    this.state.mass = m;
    this.state.impactTime = tImpact;
    this.state.impactVelocity = vImpact;
    this.state.currentHeight = currH;
    this.state.velocity = currV;
    this.state.kineticEnergy = ek;
    this.state.potentialEnergy = ep;
    this.state.totalEnergy = totalE;
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

    const h0 = this.getH0();
    const groundY = height * 0.85;
    const topY = height * 0.15;
    const towerX = width * 0.35;
    const dropHeightPx = groundY - topY;

    // 1. Draw Ground
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width * 0.1, groundY);
    ctx.lineTo(width * 0.9, groundY);
    ctx.stroke();

    ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
    ctx.fillRect(0, groundY, width, height - groundY);

    // 2. Draw Measurement Scale / Ruler Tower
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(towerX - 25, topY);
    ctx.lineTo(towerX - 25, groundY);
    ctx.stroke();

    // Ruler Ticks
    const ticks = 5;
    for (let i = 0; i <= ticks; i++) {
      const ty = groundY - (i / ticks) * dropHeightPx;
      const hVal = Math.round((i / ticks) * h0);
      ctx.beginPath();
      ctx.moveTo(towerX - 32, ty);
      ctx.lineTo(towerX - 25, ty);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.fillText(`${hVal}m`, towerX - 58, ty + 3);
    }

    // 3. Falling Object
    const currH = (this.state.currentHeight as number) ?? h0;
    const normH = Math.max(0, Math.min(1, currH / (h0 || 1)));
    const ballY = groundY - normH * dropHeightPx;
    const ballX = towerX + 20;

    // Motion Trail
    if (this.time > 0) {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(ballX, topY);
      ctx.lineTo(ballX, ballY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Velocity Vector Downward
    const currV = (this.state.velocity as number) || 0;
    if (currV > 0 && currH > 0) {
      const vLen = Math.min(currV * 1.5, 60);
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ballX, ballY);
      ctx.lineTo(ballX, ballY + vLen);
      ctx.stroke();

      // Arrow head
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.moveTo(ballX - 4, ballY + vLen - 4);
      ctx.lineTo(ballX + 4, ballY + vLen - 4);
      ctx.lineTo(ballX, ballY + vLen + 2);
      ctx.fill();
    }

    // Ball Body
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#0284c7';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // 4. Real-time Energy Balance Bars (Right Side)
    const energyX = width * 0.7;
    const barWidth = 24;
    const maxBarH = height * 0.45;
    const totalE = (this.state.totalEnergy as number) || 1;
    const ekRatio = ((this.state.kineticEnergy as number) || 0) / totalE;
    const epRatio = ((this.state.potentialEnergy as number) || 0) / totalE;

    // Potential Energy Bar (Orange)
    const epHeight = epRatio * maxBarH;
    ctx.fillStyle = '#f97316';
    ctx.fillRect(energyX, groundY - epHeight, barWidth, epHeight);

    // Kinetic Energy Bar (Cyan)
    const ekHeight = ekRatio * maxBarH;
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(energyX + barWidth + 8, groundY - ekHeight, barWidth, ekHeight);

    // Bar Labels
    ctx.font = '10px monospace';
    ctx.fillStyle = '#f97316';
    ctx.fillText('Ep', energyX + 5, groundY + 14);
    ctx.fillStyle = '#06b6d4';
    ctx.fillText('Ek', energyX + barWidth + 13, groundY + 14);

    // 5. Smart Annotations
    labelSystem.renderAnnotations([
      {
        id: 'current-height-label',
        anchorX: ballX,
        anchorY: ballY - 14,
        text: `h = ${currH} m | v = ${currV} m/s`,
        compactText: `${currH} m | ${currV} m/s`,
        priority: AnnotationPriority.PRIMARY_VALUE,
        color: '#38bdf8',
        borderColor: '#0284c7',
      },
      {
        id: 'impact-metrics',
        anchorX: towerX - 25,
        anchorY: groundY + 14,
        text: `Impact: v_max = ${this.state.impactVelocity} m/s @ t = ${this.state.impactTime} s`,
        compactText: `t_impact = ${this.state.impactTime} s`,
        priority: AnnotationPriority.PRIMARY_VALUE,
        color: '#10b981',
        borderColor: '#059669',
      },
      {
        id: 'energy-conservation',
        anchorX: energyX + barWidth,
        anchorY: groundY - maxBarH - 12,
        text: `E_tot = ${totalE} J (Constant)`,
        compactText: `E = ${totalE} J`,
        priority: AnnotationPriority.MEASUREMENT,
        color: '#a855f7',
        borderColor: '#9333ea',
      },
    ]);
  }
}
